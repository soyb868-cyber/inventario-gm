"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Check,
  MapPin,
  Minus,
  Trash2,
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";

/* ---------------- TYPES ---------------- */

type TarifaDistancia = {
  rango: string;
  menudeo: number;
  mayoreo: number;
  carretilla?: number;
  incluyeCarretilla?: boolean;
  pickup?: boolean;
};

type Precio = {
  medidas: string;
  notas: string;
  editando?: boolean;
  tarifas: TarifaDistancia[];
};

type Producto = {
  id: number;
  nombre: string;
  imagen: string;
  precios: Precio[];
};

type ProductoDB = {
  id: number;
  nombre: string;
  imagen: string;
  medidas: string;
  notas: string;
};

type TarifaDB = {
  id: number;
  producto_id: number;
  rango: string;
  menudeo: number;
  mayoreo: number;
  carretilla: number | null;
  incluye_carretilla: boolean;
  pickup: boolean;
};

export default function AgregadosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoActivo, setProductoActivo] = useState<Producto | null>(null);

  const [pickup, setPickup] =
  useState<{ [key: number]: boolean }>({});

const [cantidad, setCantidad] =
  useState<{ [key: number]: number }>({});

const [subiendoImagen, setSubiendoImagen] =
  useState(false);

  /* ---------------- LOAD ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      const { data: productosDB } = await supabase
        .from("productos")
        .select("*")
        .eq("tipo", "agregados");
        

      const { data: tarifasDB } = await supabase
        .from("producto_tarifas")
        .select("*");

      if (!productosDB || !tarifasDB) return;

      const productosTyped = productosDB as ProductoDB[];
      const tarifasTyped = tarifasDB as TarifaDB[];

      const formateados: Producto[] = productosTyped.map((p) => {
        const tarifas = tarifasTyped
          .filter((t) => t.producto_id === p.id)
          .map((t) => ({
            rango: t.rango,
            menudeo: Number(t.menudeo || 0),
            mayoreo: Number(t.mayoreo || 0),
            carretilla: Number(t.carretilla || 0),
            incluyeCarretilla: t.incluye_carretilla ?? false,
            pickup: t.pickup ?? true,
          }));

        return {
          id: p.id,
          nombre: p.nombre,
          imagen: p.imagen,
          precios: [
            {
              medidas: p.medidas || "",
              notas: p.notas || "",
              editando: false,
              tarifas,
            },
          ],
        };
      });

      setProductos(formateados);
    };

    fetchData();
    
  }, []);

  /* ---------------- MODAL STATE ---------------- */

  const abrirModal = (p: Producto) => setProductoActivo(p);
  const cerrarModal = () => setProductoActivo(null);

  const actualizarProducto = (actualizado: Producto) => {
    setProductoActivo(actualizado);
    setProductos((prev) =>
      prev.map((p) => (p.id === actualizado.id ? actualizado : p))
    );
  };

  const editarCampo = (
  campo: keyof Producto,
  valor: string
) => {
  if (!productoActivo) return;

  actualizarProducto({
    ...productoActivo,
    [campo]: valor,
  });
};

 const toggleEditar = async (
  index: number
) => {
  if (!productoActivo) return;

  if (
    productoActivo.precios[index]
      .editando
  ) {

    await supabase
      .from("producto_tarifas")
      .delete()
      .eq(
        "producto_id",
        productoActivo.id
      );
      await supabase
  .from("productos")
  .update({
    nombre: productoActivo.nombre,
    imagen: productoActivo.imagen,

    medidas:
      productoActivo.precios[index]
        .medidas,

    notas:
      productoActivo.precios[index]
        .notas,
  })
  .eq("id", productoActivo.id);

    const tarifas =
      productoActivo.precios[index]
        .tarifas;

    if (tarifas.length > 0) {

      await supabase
        .from("producto_tarifas")
        .insert(
          tarifas.map((t) => ({
            producto_id:
              productoActivo.id,

            rango: t.rango,

            menudeo:
              t.menudeo,

            mayoreo:
              t.mayoreo,

            carretilla:
              t.carretilla || 0,

            incluye_carretilla:
              t.incluyeCarretilla ??
              false,
              pickup: t.pickup ?? true,
          }))
        );
    }
  }

  const nuevos = [
    ...productoActivo.precios,
  ];

  nuevos[index].editando =
    !nuevos[index].editando;

  actualizarProducto({
    ...productoActivo,
    precios: nuevos,
  });
};

const editarTarifa = (
  index: number,
  tIndex: number,
  campo: keyof TarifaDistancia,
  valor: string | number | boolean
) => {
  if (!productoActivo) return;

  const nuevos = [...productoActivo.precios];
  const tarifas = [...nuevos[index].tarifas];

  tarifas[tIndex] = {
    ...tarifas[tIndex],
    [campo]: valor,
  };

  nuevos[index].tarifas = tarifas;

  actualizarProducto({
    ...productoActivo,
    precios: nuevos,
  });
};

  const agregarTarifa = (index: number) => {
    if (!productoActivo) return;

    const nuevos = [...productoActivo.precios];

nuevos[index].tarifas.push({
  rango: "Nueva distancia",
  menudeo: 0,
  mayoreo: 0,
  carretilla: 0,
  incluyeCarretilla: true,
  pickup: true,
});

    actualizarProducto({
      ...productoActivo,
      precios: nuevos,
    });
  };

  const eliminarTarifa = (index: number, tIndex: number) => {
    if (!productoActivo) return;

    const nuevos = [...productoActivo.precios];

    nuevos[index].tarifas = nuevos[index].tarifas.filter(
      (_, i) => i !== tIndex
    );

    actualizarProducto({
      ...productoActivo,
      precios: nuevos,
    });
  };

  const crearProducto = async () => {
  const { data, error } = await supabase
    .from("productos")
    .insert({
      nombre: "Nuevo producto",
      imagen: "",
      tipo: "agregados",
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return;
  }

  const nuevoProducto: Producto = {
    id: data.id,
    nombre: data.nombre,
    imagen: data.imagen,
    precios: [
      {
        medidas: "",
        notas: "",
        editando: true,
        tarifas: [],
      },
    ],
  };

  setProductos((prev) => [
    nuevoProducto,
    ...prev,
  ]);

  setProductoActivo(nuevoProducto);
};

const eliminarProducto = async () => {
  if (!productoActivo) return;

  await supabase
    .from("producto_tarifas")
    .delete()
    .eq("producto_id", productoActivo.id);

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

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-[#f5f1eb] min-h-screen">

      {/* HERO (igual que tu diseño bonito) */}
      <div className="relative w-full h-[260px] md:h-[320px] overflow-hidden">
        <Image
          src="/agregados/banner-agregados.jpeg"
          alt="Agregados"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
          <h1 className="text-white text-5xl font-black">
            Agregados
          </h1>
        </div>
      </div>

        <div className="
        <div
    w-[95%]
    md:w-auto
    max-w-7xl
    mx-auto
    my-4
    md:my-10
  "
  >
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

      {/* GRID BONITO */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {productos.map((p) => (
          <div
            key={p.id}
            className="
              group
              bg-white/90
              backdrop-blur
              border
              border-[#eadfd3]
              rounded-[30px]
              p-4
              shadow-md
              hover:shadow-2xl
              hover:-translate-y-1
              hover:scale-[1.02]
              transition-all
              duration-300
            "
            
          >
            <div className="relative w-full h-[170px] rounded-2xl overflow-hidden">
              <Image
                  src={
                    p.imagen?.trim()
                      ? p.imagen
                      : "/sin-imagen.png"
                  }
                alt={p.nombre}
                fill
                className="
                  object-cover
                  group-hover:scale-110
                  transition-transform
                  duration-500
                  "
              />
            </div>

            <h2 className="text-center font-semibold mt-3 text-[#3f2d21]">
              {p.nombre}
            </h2>

            <button
              onClick={() => abrirModal(p)}
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
              Ver precios
            </button>
          </div>
        ))}
      </div>

  
    {/* Modal*/}
    {productoActivo && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">

        <div
        className="
        max-w-7xl
        mx-auto
        my-10
        bg-[#f8f4ef]
        rounded-[40px]
        overflow-hidden
        shadow-2xl
        "
      >
        
      {/* HEADER */}
      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          justify-between
          gap-6
          px-4
          md:px-8
          py-6
          border-b
          border-[#eadfd3]
          bg-white/70
          backdrop-blur
        "
      >
<div className="    
    flex
    flex-col
    sm:flex-row
    items-center
    sm:items-start
    gap-5
    w-full
  ">

  <div className="flex flex-col gap-3">

    <div
      className="
        relative
        w-24
        h-24
        rounded-[24px]
        overflow-hidden
        shadow-lg
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
        className="object-cover"
      />
    </div>

    {productoActivo.precios[0].editando && (
      <>
<input
  type="text"
  placeholder="Pega aquí el enlace de la imagen..."
  value={productoActivo.imagen}
  onChange={(e) =>
    editarCampo("imagen", e.target.value)
  }
  className="
    w-full
    bg-white
    border
    border-[#e5d8cb]
    rounded-2xl
    px-4
    py-3
    text-sm
    text-[#4b3425]
    shadow-sm
    outline-none
    transition-all
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-200
    placeholder:text-gray-400
  "
/>

        <label
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-4
            py-2
            rounded-xl
            cursor-pointer
            text-center
          "
        >
          Seleccionar imagen

          <input
            type="file"
            accept="image/*"
            onChange={subirImagen}
            className="hidden"
          />
        </label>

        {subiendoImagen && (
          <p className="text-blue-600 text-sm">
            Subiendo imagen...
          </p>
        )}
      </>
    )}
  </div>

  <div>
    <input
      disabled={
        !productoActivo.precios[0].editando
      }
      value={productoActivo.nombre}
      onChange={(e) =>
        editarCampo(
          "nombre",
          e.target.value
        )
      }
      className="
  bg-transparent
  text-2xl
  md:text-4xl
  font-black
  w-full
      "
    />

    <p className="text-[#7a6a5d] mt-1">
      Tarifas configurables por distancia
    </p>
  </div>

</div>

          <button
          onClick={cerrarModal}
          className="
            flex
            items-center
            gap-2
            bg-white
            hover:bg-[#f5ede6]
            border
            border-[#d8c6b6]
            text-[#4b3425]
            px-6
            py-3
            rounded-2xl
            font-bold
            shadow-md
            hover:shadow-lg
            transition-all
            duration-300
            hover:scale-105
            active:scale-95
          "
        >
          Cerrar
        </button>
      </div>

           {/* CONTENT */}
      <div className="p-4 md:p-8">

        {productoActivo.precios.map((precio, index) => (

          <div key={index}>

            {/* TOP ACTIONS */}
            <div className="flex flex-wrap items-center justify-between mb-8 gap-4">

              {/* MEDIDAS */}
              <div className="flex-1">

          <input
            value={precio.medidas}
            disabled={!precio.editando}
            placeholder="Ej: 1m³ / 1 tonelada"
            onChange={(e) => {
              if (!productoActivo) return;

              const nuevos = [...productoActivo.precios];

              nuevos[index].medidas = e.target.value;

              actualizarProducto({
                ...productoActivo,
                precios: nuevos,
              });
            }}
            className="
              text-3xl
              font-black
              bg-transparent
              outline-none
              border-b-2
              border-[#d8c6b6]
              py-2
              w-full
              text-[#3f2d21]
            "
          />
              </div>

                            {/* ACTION BUTTONS */}
              <div className="    
    flex
    flex-wrap
    gap-3
    w-full
    md:w-auto">

                {precio.editando && (
                  <button
                    onClick={() => agregarTarifa(index)}
                    className="
                      flex
                      items-center
                      gap-2
                      bg-[#b8875c]
                      hover:bg-[#9f6f47]
                      text-white
                      px-5
                      py-3
                      rounded-2xl
                      font-semibold
                      shadow-lg
                      transition
                    "
                  >
                    <Plus size={18} />
                    Agregar
                  </button>
                )}

                                <button
                  onClick={() => toggleEditar(index)}
                  className={`
                    flex
                    items-center
                    gap-2
                    px-5
                    py-3
                    rounded-2xl
                    font-semibold
                    shadow-lg
                    transition
                    ${
                      precio.editando
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-[#d7bea7] hover:bg-[#c7a789] text-[#3f2d21]"
                    }
                  `}
                >
                  {precio.editando ? (
                    <>
                      <Check size={18} />
                      Guardar
                    </>
                  ) : (
                    <>
                      <Pencil size={18} />
                      Editar
                    </>
                  )}
                </button>

                <button
  onClick={eliminarProducto}
  className="
    bg-black
    hover:bg-gray-900
    text-white
    px-5
    py-3
    rounded-2xl
    font-semibold
    shadow-lg
    transition
    flex
    items-center
    gap-2
  "
>
  <Trash2 size={18} />
  Eliminar
</button>
              </div>
            </div>

                        {/* GRID */}
            <div className="
              bg-white/90
              backdrop-blur
              border
              border-[#eadfd3]
              rounded-[24px]
              p-4
              md:p-6
            ">

              {precio.tarifas.map((t, tIndex) => (

                <div
                  key={tIndex}
                  className="
                    bg-white/90
                    backdrop-blur
                    border
                    border-[#eadfd3]
                    rounded-[30px]
                    p-6
                    shadow-md
                    hover:shadow-2xl
                    hover:-translate-y-1
                    transition-all
                    duration-300
                    relative
                  "
                >
                
                                  {/* DELETE */}
                  {precio.editando && (
                    <button
                      onClick={() =>
                        eliminarTarifa(index, tIndex)
                      }
                      className="
                        absolute
                        top-4
                        right-4
                        w-9
                        h-9
                        rounded-full
                        bg-red-50
                        hover:bg-red-100
                        flex
                        items-center
                        justify-center
                        text-red-500
                        transition
                      "
                    >
                      <Trash2 size={16} />
                    </button>
                                    )}

                  {/* ICON */}
                  <div
                    className="
                      w-14
                      h-14
                      rounded-full
                      bg-[#f5ede6]
                      flex
                      items-center
                      justify-center
                      mb-5
                    "
                  >

                    <MapPin className="text-[#9f6f47]" />
                  </div>

                  {/* RANGO */}
                  <input
                    value={t.rango}
                    disabled={!precio.editando}
                    onChange={(e) =>
                      editarTarifa(
                        index,
                        tIndex,
                        "rango",
                        e.target.value
                      )
                    }
                    className="
                      text-xl
                      font-bold
                      text-[#3f2d21]
                      w-full
                      outline-none
                      bg-transparent
                      mb-6
                    "
                  />

                  {/* PRECIOS */}
                  <div className="space-y-4">

                    {/* MENUDEO */}
                    <div className="bg-[#f7f3ef] rounded-2xl p-4">

                      <div className="text-xs text-[#6b5a4c] mb-1 font-semibold">
                        Menudeo m³
                      </div>

                      <div className="flex items-center gap-2">

                        <span className="text-xl font-bold text-[#9f6f47]">
                          $
                        </span>

                        <input
                          type="number"
                          value={t.menudeo}
                          disabled={!precio.editando}
                          onChange={(e) =>
                            editarTarifa(
                              index,
                              tIndex,
                              "menudeo",
                              Number(e.target.value)
                            )
                          }
                          className="
                            bg-transparent
                            outline-none
                            text-3xl
                            font-black
                            w-full
                            text-[#3f2d21]
                          "
                        />
                      </div>
                    </div>

                                        {/* MAYOREO */}
                    <div className="bg-[#f7f3ef] rounded-2xl p-4">

                      <div className="text-xs text-[#6b5a4c] mb-1 font-semibold">
                        Mayoreo m³
                      </div>

                      <div className="flex items-center gap-2">

                        <span className="text-xl font-bold text-[#9f6f47]">
                          $
                        </span>

                        <input
                          type="number"
                          value={t.mayoreo}
                          disabled={!precio.editando}
                          onChange={(e) =>
                            editarTarifa(
                              index,
                              tIndex,
                              "mayoreo",
                              Number(e.target.value)
                            )
                          }
                            className="
                            bg-transparent
                            outline-none
                            text-xl
                            md:text-3xl
                            font-black
                            w-full
                            text-[#3f2d21]
                          "
                        />
                      </div>
                    </div>
                                        {/* CARRETILLA */}
                    {t.incluyeCarretilla && (
                      <div className="bg-[#f7f3ef] rounded-2xl p-4">

                        <div className="text-xs text-[#6b5a4c] mb-1 font-semibold">
                          Carretilla
                        </div>

                        <div className="flex items-center gap-2">

                          <span className="text-xl font-bold text-[#9f6f47]">
                            $
                          </span>

                          <input
                            type="number"
                            value={t.carretilla}
                            disabled={!precio.editando}
                            onChange={(e) =>
                              editarTarifa(
                                index,
                                tIndex,
                                "carretilla",
                                Number(e.target.value)
                              )
                            }
                            
                            className="
                                  bg-transparent
                                  outline-none
                                  text-xl
                                  md:text-3xl
                                  font-black
                                  w-full
                                  text-[#3f2d21]
                            "
                          />
                        </div>
                      </div>
                    )}

                    
                  </div>

                  {/* PICKUP */}
<div className="mt-5">

  <label
    className="
      flex
      items-center
      gap-3
      bg-[#f7f3ef]
      rounded-2xl
      p-4
      cursor-pointer
    "
  >
    <input
      type="checkbox"
      checked={t.pickup ?? true}
      disabled={!precio.editando}
      onChange={(e) =>
        editarTarifa(
          index,
          tIndex,
          "pickup",
          e.target.checked
        )
      }
      className="w-5 h-5"
    />

    <span className="font-semibold text-[#3f2d21]">
      Pickup (sin flete)
    </span>
  </label>

</div>



                  
                  {/* BADGE */}
                  <div
                    className="
                      mt-6
                      bg-gradient-to-r
                      from-[#b8875c]
                      to-[#9f6f47]
                      text-white
                      rounded-2xl
                      p-4
                    "
                  >
                    <div className="text-sm opacity-80">
                      Tarifa activa
                    </div>

                    <div className="text-xl md:text-2xl font-black mt-1">
                      {t.rango}
                    </div>
                  </div>

                                  </div>
              ))}
            </div>
          </div>
        ))}

                {/* NOTAS IMPORTANTES */}
        <div
          className="
            mt-10
            bg-gradient-to-r
            from-[#fff8f2]
            to-[#f7efe7]
            border
            border-[#ead8c7]
            rounded-[32px]
            p-6
            shadow-md
          "
        >

          {/* HEADER */}
          <div className="flex items-center gap-4 mb-6">

            <div
              className="
                w-14
                h-14
                rounded-full
                bg-[#d7bea7]
                flex
                items-center
                justify-center
                text-[#3f2d21]
                text-2xl
                font-black
                shadow-md
              "
            >
              !
            </div>

            <div>

              <h3
                className="
                  text-2xl
                  font-black
                  text-[#3f2d21]
                "
              >
                Notas importantes
              </h3>

              <p className="text-[#7a6a5d] text-sm mt-1">
                Información adicional sobre los precios
              </p>

            </div>

          </div>

          {/* LISTA */}
          <div className="grid md:grid-cols-2 gap-4">

            <div
              className="
                bg-white
                border
                border-[#eadfd3]
                rounded-2xl
                p-4
                text-[#4b3425]
                font-semibold
                shadow-sm
              "
            >
              • Los precios no incluyen IVA hasta facturacion.
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
)}
</div> 
  )
}