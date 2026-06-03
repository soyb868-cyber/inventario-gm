"use client";

import { supabase } from "@/app/lib/supabase";
import Image from "next/image";
import { use, useEffect, useMemo, useState } from "react";
import {
  Check,
  Pencil,
  Trash2,
  Plus,
  X,
  Zap,
} from "lucide-react";


type Caracteristica = {
  id: number;
  caracteristica: string;
};

type Producto = {
  id: number;

  codigo: string;

  nombre: string;

  imagen: string;

  descripcion: string;

  categoria_slug: string;

subcategoria?: string;

subcategoria_slug?: string;

  marca: string;

  precio: number | null;

  precioAnterior?: number | null;

  existencia: number | null;

  modelo?: string;

  color?: string;

  voltaje?: string;

  destacado?: boolean;

  caracteristicas: Caracteristica[];

  editando?: boolean;
};

export default function LineaBlancaPage({
  params,
}: {
  params: Promise<{
    categoria: string;
  }>;
}) {

  const resolvedParams = use(params);

  const categoria = resolvedParams.categoria;

  const slug = categoria;

  // STATES
const [productos, setProductos] = useState<Producto[]>([]);

const [productoActivo, setProductoActivo] =
  useState<Producto | null>(null);

const [subiendoImagen, setSubiendoImagen] =
  useState(false);


useEffect(() => {
  const cargarProductos = async () => {

let query = supabase
  .from("productos")
  .select(`
    *,
    producto_caracteristicas (
      id,
      caracteristica
    )
  `);

if (slug !== "todos") {
  query = query.or(
    `categoria_slug.eq.${slug},subcategoria_slug.eq.${slug}`
  );
}

const { data, error } = await query.order(
  "creado_en",
  {
    ascending: false,
  }
);

    if (error) {
      console.error(error);
      return;
    }

    const formateados =
      data?.map((p) => ({
        id: p.id,
        codigo: p.codigo,
        nombre: p.nombre,
        imagen: p.imagen,
        descripcion: p.descripcion,
        categoria_slug: p.categoria_slug,
subcategoria_slug: p.subcategoria_slug,
        marca: p.marca,
        precio: p.precio,
        precioAnterior: p.precio_anterior,
        existencia: p.existencia,
        modelo: p.modelo,
        color: p.color,
        voltaje: p.voltaje,
        destacado: p.destacado,
        caracteristicas:
          p.producto_caracteristicas || [],
        editando: false,
      })) || [];

    setProductos(formateados);
  };

  cargarProductos();
}, [slug]);


  const productosFiltrados = useMemo(() => {
    return productos;
  }, [productos]);

  const abrirModal = (producto: Producto) => {
    setProductoActivo(producto);
  };

  const cerrarModal = () => {
    setProductoActivo(null);
  };

  const actualizarProducto = (
    actualizado: Producto
  ) => {
    setProductoActivo(actualizado);

    setProductos((prev) =>
      prev.map((p) =>
        p.id === actualizado.id
          ? actualizado
          : p
      )
    );
  };

const editarCampo = (
  campo: keyof Producto,
  valor: string | number | boolean | null
) => {
    if (!productoActivo) return;

    actualizarProducto({
      ...productoActivo,
      [campo]: valor,
    });
  };

  const editarCaracteristica = (
    index: number,
    valor: string
  ) => {
    if (!productoActivo) return;

    const nuevas = [
      ...productoActivo.caracteristicas,
    ];

    nuevas[index] = {
    ...nuevas[index],
    caracteristica: valor,
  };

    actualizarProducto({
      ...productoActivo,
      caracteristicas: nuevas,
    });
  };

const agregarCaracteristica = () => {
  if (!productoActivo) return;

  actualizarProducto({
    ...productoActivo,
    caracteristicas: [
      ...productoActivo.caracteristicas,
      {
        id: Date.now(),
        caracteristica: "Nueva característica",
      },
    ],
  });
};

  const eliminarCaracteristica = (
    index: number
  ) => {
    if (!productoActivo) return;

    actualizarProducto({
      ...productoActivo,
      caracteristicas:
        productoActivo.caracteristicas.filter(
          (_, i) => i !== index
        ),
    });
  };

const toggleEditar = async () => {
  if (!productoActivo) return;

  // SI ESTABA EDITANDO -> GUARDAR
  if (productoActivo.editando) {

        const { error } = await supabase
      .from("productos")
.update({
  codigo: productoActivo.codigo,
  nombre: productoActivo.nombre,
  imagen: productoActivo.imagen,
  descripcion: productoActivo.descripcion,

  categoria_slug:
    productoActivo.categoria_slug,

  subcategoria_slug:
    productoActivo.subcategoria_slug,

  marca: productoActivo.marca,

  precio: productoActivo.precio,

  precio_anterior:
    productoActivo.precioAnterior,

  existencia:
    productoActivo.existencia,

  modelo: productoActivo.modelo,

  color: productoActivo.color,

  voltaje: productoActivo.voltaje,

  destacado:
    productoActivo.destacado,
})
      .eq("id", productoActivo.id);

    if (error) {
      console.error(error);
      return;
    }

  await supabase
  .from("producto_caracteristicas")
  .delete()
  .eq("producto_id", productoActivo.id);

await supabase
  .from("producto_caracteristicas")
  .insert(
    productoActivo.caracteristicas.map(
      (c) => ({
        producto_id:
          productoActivo.id,
        caracteristica:
          c.caracteristica,
      })
    )
  );
  }

  actualizarProducto({
    ...productoActivo,
    editando: !productoActivo.editando,
  });
};

  const eliminarProducto = async () => {
if (!productoActivo) return;

const { error } = await supabase
  .from("productos")
  .delete()
  .eq("id", productoActivo.id);

if (error) {
  console.error(error);
  return;
}

setProductos((prev) =>
  prev.filter(
    (p) => p.id !== productoActivo.id
  )
);


cerrarModal();
};

  const subirImagen = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  if (
    !e.target.files ||
    !e.target.files[0] ||
    !productoActivo
  )
    return;

  try {
    setSubiendoImagen(true);

    const archivo = e.target.files[0];

    const extension =
      archivo.name.split(".").pop();

    const nombreArchivo =
      `${Date.now()}.${extension}`;

    const ruta =
      `productos/${nombreArchivo}`;

    const { error: uploadError } =
      await supabase.storage
        .from("productos")
        .upload(ruta, archivo);

    if (uploadError) {
      console.error(uploadError);
      return;
    }

    const { data } = supabase.storage
      .from("productos")
      .getPublicUrl(ruta);

    editarCampo(
      "imagen",
      data.publicUrl
    );
  } catch (error) {
    console.error(error);
  } finally {
    setSubiendoImagen(false);
  }
};

const crearProducto = async () => {
  const { data, error } = await supabase
    .from("productos")
    .insert({
      nombre: "Nuevo producto",
      codigo: null,
      imagen: "",
      descripcion: "",

      categoria_slug:
        slug === "todos"
          ? ""
          : slug,
      subcategoria_slug: "",

      marca: "",

      precio: 0,
      precio_anterior: 0,

      existencia: 0,

      modelo: "",
      color: "",
      voltaje: "",

      destacado: false,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return;
  }


  const nuevoProducto: Producto = {
    ...data,
    caracteristicas: [],
    editando: true,
  };

  setProductos((prev) => [
    nuevoProducto,
    ...prev,
  ]);

  setProductoActivo(nuevoProducto);
};

  return (
    <div className="bg-[#efefef] min-h-screen">

      {/* HERO */}
      <div className="relative w-full h-[260px] md:h-[320px] overflow-hidden">

        <Image
          src="/lineablanca/banner-linea-blanca.avif"
          alt="Línea Blanca"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
          "
        >
          <h1
            className="
              text-white
              text-4xl
              md:text-6xl
              font-black
              tracking-wide
              uppercase
              drop-shadow-2xl
            "
          >
            {slug === "todos"
  ? "Todos los productos"
  : slug.replace("-", " ")}
          </h1>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        
        {productos.length === 0 && (
  <div className="text-center py-20">
    <h2 className="text-3xl font-bold text-gray-500">
      Cargando Productos 
    </h2>
  </div>
)}

<div className="flex justify-end mb-8">
  <button
    onClick={crearProducto}
    className="
      bg-green-600
      hover:bg-green-700
      text-white
      px-6
      py-4
      rounded-2xl
      flex
      items-center
      gap-2
      shadow-lg
    "
  >
    <Plus size={22} />
    Nuevo Producto
  </button>
</div>
        {/* GRID */}
        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-8
          "
        >


{productosFiltrados.map((producto) => {

  const nombreNormalizado = producto.nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const tieneCalefaccion =
  nombreNormalizado.includes("calefaccion");

  const esSoloFrio =
    nombreNormalizado.includes("solo frio") ||
    (
      nombreNormalizado.includes("frio") &&
      !nombreNormalizado.includes("calor")
    );


  return (

    <div
      key={producto.id}
      className="
        group
        relative
        bg-white
        rounded-[30px]
        overflow-hidden
        shadow-md
        hover:shadow-2xl
        transition-all
        duration-300
        hover:-translate-y-1

        flex
        flex-col
        h-full
      "
    >

{producto.subcategoria_slug === "aires-acondicionados" && (
  <div className="absolute top-3 left-3 z-20">

      {tieneCalefaccion ? (
        <div className="
          bg-red-500
          text-white
          text-xs
          font-bold
          px-3
          py-1
          rounded-full
          shadow-lg
        ">
          🔥 Con Calefacción
        </div>
      ) : esSoloFrio ? (
      <div className="
        bg-blue-500
        text-white
        text-xs
        font-bold
        px-3
        py-1
        rounded-full
        shadow-lg
      ">
        ❄️ Solo Frío
      </div>
    ) : null}

  </div>
)}
              {/* IMAGEN */}
<div
  className="
    w-full
    h-[170px]
    bg-white
    flex
    items-end
    justify-center
    overflow-hidden
    pt-2
  "
>

<Image
  src={
    producto.imagen?.trim()
      ? producto.imagen
      : "/sin-imagen.png"
  }
  alt={producto.nombre}
  width={260}
  height={160}
  quality={100}
    className="
      object-contain
      max-h-[150px]
      w-auto
      group-hover:scale-105
      transition-transform
      duration-500
    "
  />

</div>

              {/* INFO */}
              <div className="p-5 flex flex-col flex-1">

              <div className="text-sm text-gray-500">
                {producto.marca}
              </div>

              <div className="text-xs text-gray-400 mb-2 font-medium">
                Código: {producto.codigo}
              </div>

                <h2
                  className="
                    text-xl
                    font-bold
                    text-[#3f2d21]
                    min-h-[96px]
                  "
                >
                  {producto.nombre}
                </h2>

                {/* PRECIOS */}
                <div className="mt-auto pt-4">

                  <div
                    className="
                      text-4xl
                      font-black
                      text-[#9f6f47]
                    "
                  >
 {new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
}).format(producto.precio || 0)}
                  </div>
                </div>


                {/* BOTON */}
                <button
                  onClick={() =>
                    abrirModal(producto)
                  }
                  className="
                      mt-6
                      w-full
                      bg-black
                      hover:bg-gray-900
                      text-white
                      font-semibold
                      py-3
                      rounded-2xl
                      transition-all
                      duration-300
                      hover:scale-[1.02]
                      active:scale-95
                      shadow-md
                      hover:shadow-xl
                  "
                >
                  Ver producto
                </button>

              </div>
            </div>

  );
})}
        </div>
      </div>

      {/* MODAL */}
      {productoActivo && (

        <div
          className="
            fixed
            inset-0
            bg-black/60
            z-50
            overflow-y-auto
            p-4
          "
        >

          <div
            className="
              bg-[#f5ede6]
              w-full
              max-w-7xl
              rounded-[35px]
              p-8
              md:p-14
              relative
              mx-auto
              my-10
            "
          >

            {/* CERRAR */}
<button
  onClick={cerrarModal}
  className="
    absolute
    top-3
    right-3
    md:top-6
    md:right-6

    bg-black
    text-white

    w-12
    h-12
    md:w-14
    md:h-14

    rounded-full
    flex
    items-center
    justify-center

    shadow-xl
    z-50
  "
>
  <X size={24} />
</button>

            <div className="grid md:grid-cols-2 gap-14">

              {/* ETIQUETA CLIMA */}
{/* ETIQUETA CLIMA */}
{productoActivo.subcategoria_slug === "aires-acondicionados" && (() => {

const nombreNormalizado = productoActivo.nombre
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "");

const tieneCalefaccion =
  nombreNormalizado.includes("calefaccion");

const esSoloFrio =
  nombreNormalizado.includes("solo frio");

  return (
    <div className="absolute top-4 left-4 z-10">

      {tieneCalefaccion ? (

        <div className="
          bg-gradient-to-r
          from-blue-500
          to-red-500
          text-white
          text-xs
          font-bold
          px-4
          py-2
          rounded-full
          shadow-lg
        ">
          🔥 Con Calefacción
        </div>

      ) : esSoloFrio ? (

        <div className="
          bg-blue-500
          text-white
          text-xs
          font-bold
          px-4
          py-2
          rounded-full
          shadow-lg
        ">
          ❄️ Solo Frío
        </div>

      ) : null}

    </div>
  );
})()}

              {/* IMAGEN */}
              <div
                className="
                  relative
                  w-full
                  h-[420px]
                  md:h-[450px]
                  rounded-[35px]
                  overflow-hidden
                  shadow-2xl
                  bg-white
                  p-8
                  flex
                  items-center
                  justify-center
                "
              >

              <Image
                src={
                  productoActivo.imagen?.trim()
                    ? productoActivo.imagen
                    : "/sin-imagen.png"
                }
                alt={productoActivo.nombre}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="
                  object-contain
                  p-6
                "
              />

              </div>

              {/* INFO */}
              <div>

                {/* MARCA */}
<div className="mb-4">
  <div className="text-gray-500 mb-1">
    Nombre
  </div>

  <input
    disabled={!productoActivo.editando}
    value={productoActivo.nombre}
    onChange={(e) =>
      editarCampo("nombre", e.target.value)
    }
    className="
      bg-transparent
      text-4xl
      font-black
      outline-none
      text-[#4b3425]
      w-full
    "
  />
</div>

<div className="mb-5">

  <div className="text-gray-500 text-sm mb-2">
    Categoría actual
  </div>

  <div
    className="
      inline-flex
      items-center
      gap-2
      bg-amber-100
      text-amber-800
      px-4
      py-2
      rounded-full
      font-semibold
    "
  >
     {slug.replaceAll("-", " ")}
  </div>

</div>

<div className="mb-4">
  <div className="text-gray-500 mb-1">
    Marca
  </div>

  <input
    disabled={!productoActivo.editando}
    value={productoActivo.marca || ""}
    onChange={(e) =>
      editarCampo("marca", e.target.value)
    }
    className="
      bg-transparent
      text-xl
      outline-none
      text-gray-600
      w-full
    "
  />
</div>

<div className="mb-4">
  <div className="text-gray-500 mb-1">
    Código
  </div>

  <input
    disabled={!productoActivo.editando}
    value={productoActivo.codigo || ""}
    onChange={(e) =>
      editarCampo(
        "codigo",
        e.target.value
      )
    }
    className="
      bg-transparent
      text-lg
      font-bold
      outline-none
      text-[#4b3425]
      w-full
    "
  />
</div>

<div className="mb-6">
  <div className="text-gray-500 mb-2">
    Imagen
  </div>

  {/* URL */}
  <input
    disabled={!productoActivo.editando}
    value={productoActivo.imagen || ""}
    onChange={(e) =>
      editarCampo(
        "imagen",
        e.target.value
      )
    }
    placeholder="https://..."
    className="
    w-full
    border
    border-gray-300
    rounded-xl
    p-3
    mb-3
    text-gray-800
    placeholder:text-gray-500
    "
  />

  {/* Archivo */}
{productoActivo.editando && (
  <label
    className="
      inline-flex
      items-center
      gap-2
      bg-blue-600
      hover:bg-blue-700
      text-white
      px-4
      py-2
      rounded-xl
      cursor-pointer
    "
  >
    <Plus size={18} />
    Seleccionar imagen

    <input
      type="file"
      accept="image/*"
      onChange={subirImagen}
      className="hidden"
    />
  </label>
)}

  {subiendoImagen && (
    <p className="mt-2 text-blue-600">
      Subiendo imagen...
    </p>
  )}
</div>

                {/* PRECIOS */}
                <div className="mb-8">

                  <div
                    className="
                      flex
                      items-center
                    "
                  >

                    <span
                      className="
                        text-5xl
                        font-black
                        text-[#9f6f47]
                        mr-2
                      "
                    >
                      $
                    </span>

                    <input
                      disabled={!productoActivo.editando}
                      type="number"
                      value={
                      productoActivo.precio ?? ""
                    }
                      onChange={(e) =>
                        editarCampo(
                          "precio",
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="
                        bg-transparent
                        text-6xl
                        font-black
                        outline-none
                        text-[#2d2d2d]
                        w-full
                      "
                    />

                  </div>
                </div>

                {/* INFO TECNICA */}
                <div
                  className="
                    bg-white
                    rounded-[28px]
                    p-8
                    shadow-md
                    mb-8
                    grid
                    grid-cols-2
                    gap-6
                  "
                >

                  {/* MODELO */}
                  <div>

                    <div className="text-gray-500 mb-1">
                      Modelo
                    </div>

                    <input
                      disabled={!productoActivo.editando}
                      value={
                        productoActivo.modelo || ""
                      }
                      onChange={(e) =>
                        editarCampo(
                          "modelo",
                          e.target.value
                        )
                      }
                      className="
                        bg-transparent
                        text-2xl
                        font-bold
                        outline-none
                        text-[#4b3425]
                        w-full
                      "
                    />

                  </div>

                  {/* COLOR */}
                  <div>

                    <div className="text-gray-500 mb-1">
                      Color
                    </div>

                    <input
                      disabled={!productoActivo.editando}
                      value={
                        productoActivo.color || ""
                      }
                      onChange={(e) =>
                        editarCampo(
                          "color",
                          e.target.value
                        )
                      }
                      className="
                        bg-transparent
                        text-2xl
                        font-bold
                        outline-none
                        text-[#4b3425]
                        w-full
                      "
                    />

                  </div>

                  {/* VOLTAJE */}
                  <div>

                    <div className="text-gray-500 mb-1">
                      Voltaje
                    </div>

                    <input
                      disabled={!productoActivo.editando}
                      value={
                        productoActivo.voltaje || ""
                      }
                      onChange={(e) =>
                        editarCampo(
                          "voltaje",
                          e.target.value
                        )
                      }
                      className="
                        bg-transparent
                        text-2xl
                        font-bold
                        outline-none
                        text-[#4b3425]
                        w-full
                      "
                    />

                  </div>

                  {/* EXISTENCIA */}
                  <div>

                    <div className="text-gray-500 mb-1">
                      Existencia
                    </div>

                    <input
                      disabled={!productoActivo.editando}
                      type="number"
                      value={
                        productoActivo.existencia ?? ""
                      }
                      onChange={(e) =>
                        editarCampo(
                          "existencia",
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="
                        bg-transparent
                        text-2xl
                        font-bold
                        outline-none
                        text-[#4b3425]
                        w-full
                      "
                    />

                  </div>

                </div>

                {/* CARACTERISTICAS */}
                <div className="mb-8">

                  <div
                    className="
                      text-3xl
                      font-black
                      text-[#4b3425]
                      mb-5
                    "
                  >
                    Características
                  </div>

                  <div className="space-y-4">

                    {productoActivo.caracteristicas.map(
                      (c, index) => (

                        <div
                          key={c.id}
                          className="
                            flex
                            items-center
                            gap-3
                            bg-white
                            rounded-2xl
                            p-4
                            shadow-sm
                          "
                        >

                          <Zap
                            size={20}
                            className="text-[#9f6f47]"
                          />

                          <input
                            disabled={
                              !productoActivo.editando
                            }
                            value={c.caracteristica}
                            onChange={(e) =>
                              editarCaracteristica(
                                index,
                                e.target.value
                              )
                            }
                            className="
                              bg-transparent
                              outline-none
                              text-lg
                              w-full
                              text-[#4b3425]
                            "
                          />

                          {productoActivo.editando && (

                            <button
                              onClick={() =>
                                eliminarCaracteristica(
                                  index
                                )
                              }
                              className="
                                bg-red-500
                                hover:bg-red-600
                                text-white
                                w-10
                                h-10
                                rounded-full
                                flex
                                items-center
                                justify-center
                              "
                            >
                              <Trash2 size={18} />
                            </button>

                          )}

                        </div>

                      )
                    )}
                  </div>

                  {/* AGREGAR */}
                  {productoActivo.editando && (

                    <button
                      onClick={
                        agregarCaracteristica
                      }
                      className="
                        mt-5
                        bg-green-600
                        hover:bg-green-700
                        text-white
                        px-6
                        py-4
                        rounded-2xl
                        flex
                        items-center
                        gap-3
                        shadow-lg
                      "
                    >
                      <Plus size={22} />
                      Agregar característica
                    </button>

                  )}
                </div>

                {/* DESCRIPCION */}
                <textarea
                  disabled={!productoActivo.editando}
                  value={
                    productoActivo.descripcion
                  }
                  onChange={(e) =>
                    editarCampo(
                      "descripcion",
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    bg-white
                    border
                    border-[#e7d8ca]
                    rounded-[28px]
                    p-6
                    min-h-[170px]
                    resize-none
                    outline-none
                    text-[#4b3425]
                    mb-8
                  "
                />

                {/* BOTONES */}
                <div className="flex flex-wrap gap-4">

                  <button
                    onClick={toggleEditar}
                    className={`
                      px-6
                      py-4
                      rounded-2xl
                      text-white
                      flex
                      items-center
                      gap-3
                      shadow-lg
                      transition
                      ${
                        productoActivo.editando
                          ? "bg-green-600"
                          : "bg-blue-600"
                      }
                    `}
                  >

                    {productoActivo.editando ? (
                      <>
                        <Check size={22} />
                        Guardar
                      </>
                    ) : (
                      <>
                        <Pencil size={22} />
                        Editar
                      </>
                    )}

                  </button>

                  <button
                    onClick={eliminarProducto}
                    className="
                      bg-black
                      text-white
                      px-6
                      py-4
                      rounded-2xl
                      flex
                      items-center
                      gap-3
                      shadow-lg
                    "
                  >
                    <Trash2 size={22} />
                    Eliminar
                  </button>

                </div>

              </div>
            </div>
          </div>
        </div>

      )}
    </div>
  );
}