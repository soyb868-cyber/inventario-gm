"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import {
  Plus,
  Trash2,
  MapPin,
  Pencil,
  Check,
  X,
} from "lucide-react";

import { supabase } from "@/app/lib/supabase";

/* ---------------- TYPES ---------------- */

type Tarifa = {
  rango: string;
  extra: number;
};

type Precio = {
  base: number;
  tarifas: Tarifa[];
  editando?: boolean;
};

type Producto = {
  id: number;
  nombre: string;
  imagen: string;
  precios: Precio;
};

type ProductoDB = {
  id: number;
  nombre: string;
  imagen: string;
  precio_base: number | null;
};

type TarifaDB = {
  producto_id: number;
  rango: string;
  extra: number;
};

/* ---------------- PAGE ---------------- */

export default function BlockPage() {
  const [productos, setProductos] =
    useState<Producto[]>([]);

  const [productoActivo, setProductoActivo] =
    useState<Producto | null>(null);

  const [guardando, setGuardando] =
    useState(false);

    const [subiendoImagen, setSubiendoImagen] =
  useState(false);

  /* ---------------- LOAD ---------------- */

  useEffect(() => {
    const cargarProductos = async () => {
      const {
        data: productosData,
        error,
      } = await supabase
        .from("productos")
        .select("*")
        .eq("categoria", "Block");

      if (error) {
        console.error(error);
        return;
      }

      const { data: tarifasData } =
        await supabase
          .from("tarifas_distancia")
          .select("*");
          

      const productosFormateados =
        (productosData || []).map(
          (producto: ProductoDB) => {
            const tarifas =
              tarifasData
                ?.filter(
                  (t: TarifaDB) =>
                    t.producto_id ===
                    producto.id
                )
                .map((t: TarifaDB) => ({
                  rango: t.rango,
                  extra: Number(t.extra || 0),
                })) || [];

            return {
              id: producto.id,
              nombre: producto.nombre,
              imagen: producto.imagen,

              precios: {
                base: Number(
                  producto.precio_base || 0
                ),

                tarifas,

                editando: false,
              },
            };
          }
        );

      setProductos(productosFormateados);
    };

    cargarProductos();
  }, []);

  /* ---------------- HELPERS ---------------- */

  const abrirModal = (producto: Producto) =>
    setProductoActivo(producto);

  const cerrarModal = () =>
    setProductoActivo(null);

  const actualizarLocal = (
    productoActualizado: Producto
  ) => {
    setProductoActivo(productoActualizado);

    setProductos((prev) =>
      prev.map((p) =>
        p.id === productoActualizado.id
          ? productoActualizado
          : p
      )
    );
  };

  const editarCampo = (
  campo: keyof Producto,
  valor: string
) => {
  if (!productoActivo) return;

  actualizarLocal({
    ...productoActivo,
    [campo]: valor,
  });
};

  /* ---------------- GUARDAR ---------------- */

  const guardarCambios = async () => {
    if (!productoActivo) return;

    try {
      setGuardando(true);

      /* UPDATE BASE */
await supabase
  .from("productos")
  .update({
    nombre: productoActivo.nombre,
    imagen: productoActivo.imagen,

    precio_base:
      productoActivo.precios.base,
  })
  .eq("id", productoActivo.id);

      /* DELETE */
      await supabase
        .from("tarifas_distancia")
        .delete()
        .eq(
          "producto_id",
          productoActivo.id
        );

      /* INSERT */
      const nuevasTarifas =
        productoActivo.precios.tarifas.map(
          (t) => ({
            producto_id:
              productoActivo.id,

            rango: t.rango,
            extra: t.extra,
          })
        );

      if (nuevasTarifas.length > 0) {
        await supabase
          .from("tarifas_distancia")
          .insert(nuevasTarifas);
      }

      actualizarLocal({
        ...productoActivo,
        precios: {
          ...productoActivo.precios,
          editando: false,
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setGuardando(false);
    }
  };

  /* ---------------- EDITAR ---------------- */

  const toggleEditar = async () => {
    if (!productoActivo) return;

    if (productoActivo.precios.editando) {
      await guardarCambios();
      return;
    }

    actualizarLocal({
      ...productoActivo,
      precios: {
        ...productoActivo.precios,
        editando: true,
      },
    });
  };

  const editarPrecioBase = (
    valor: number
  ) => {
    if (!productoActivo) return;

    actualizarLocal({
      ...productoActivo,
      precios: {
        ...productoActivo.precios,
        base: valor,
      },
    });
  };

  const editarTarifa = (
    index: number,
    campo: keyof Tarifa,
    valor: string | number
  ) => {
    if (!productoActivo) return;

    const nuevasTarifas = [
      ...productoActivo.precios.tarifas,
    ];

    nuevasTarifas[index] = {
      ...nuevasTarifas[index],

      [campo]:
        campo === "rango"
          ? String(valor)
          : Number(valor),
    };

    actualizarLocal({
      ...productoActivo,
      precios: {
        ...productoActivo.precios,
        tarifas: nuevasTarifas,
      },
    });
  };

  const agregarTarifa = () => {
    if (!productoActivo) return;

    actualizarLocal({
      ...productoActivo,
      precios: {
        ...productoActivo.precios,

        tarifas: [
          ...productoActivo.precios
            .tarifas,

          {
            rango: "Nueva distancia",
            extra: 0,
          },
        ],
      },
    });
  };

  const eliminarTarifa = (
    index: number
  ) => {
    if (!productoActivo) return;

    actualizarLocal({
      ...productoActivo,

      precios: {
        ...productoActivo.precios,

        tarifas:
          productoActivo.precios.tarifas.filter(
            (_, i) => i !== index
          ),
      },
    });
  };

  const crearProducto = async () => {
  const { data, error } =
    await supabase
      .from("productos")
      .insert({
        nombre: "Nuevo producto",
        imagen: "",
        categoria: "Block",
        precio_base: 0,
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

    precios: {
      base: 0,
      tarifas: [],
      editando: true,
    },
  };

  setProductos((prev) => [
    nuevoProducto,
    ...prev,
  ]);

  setProductoActivo(
    nuevoProducto
  );
};

const eliminarProducto = async () => {
  if (!productoActivo) return;

  await supabase
    .from("tarifas_distancia")
    .delete()
    .eq(
      "producto_id",
      productoActivo.id
    );

  const { error } =
    await supabase
      .from("productos")
      .delete()
      .eq(
        "id",
        productoActivo.id
      );

  if (error) {
    console.error(error);
    return;
  }

  setProductos((prev) =>
    prev.filter(
      (p) =>
        p.id !== productoActivo.id
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

    const archivo =
      e.target.files[0];

    const extension =
      archivo.name
        .split(".")
        .pop();

    const nombreArchivo =
      `${Date.now()}.${extension}`;

    const ruta =
      `productos/${nombreArchivo}`;

    const {
      error: uploadError,
    } =
      await supabase.storage
        .from("productos")
        .upload(
          ruta,
          archivo
        );

    if (uploadError) {
      console.error(
        uploadError
      );
      return;
    }

    const { data } =
      supabase.storage
        .from("productos")
        .getPublicUrl(
          ruta
        );

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

      {/* HERO */}
      <div className="relative w-full h-[260px] md:h-[320px] overflow-hidden">

        <Image
          src="/block/banner.jpeg"
          alt="Block"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">

          <h1 className="text-white text-5xl md:text-6xl font-black">
            Block
          </h1>

        </div>

      </div>

      <div
  className="
    max-w-7xl
    mx-auto
    px-4
    md:px-6
    pt-6
    md:pt-10
    flex
    justify-center
    md:justify-end
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


      {/* GRID */}
      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          py-14
          grid
          grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-8
        "
      >

        {productos.map((producto) => (

          <div
            key={producto.id}
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

            {/* IMAGE */}
            <div
              className="
                relative
                w-full
                h-[170px]
                rounded-2xl
                overflow-hidden
              "
            >

             <Image
                src={
                  producto.imagen?.trim()
                    ? producto.imagen
                    : "/sin-imagen.png"
                }
                alt={producto.nombre}
                fill
                className="
                  object-contain
                  group-hover:scale-110
                  transition-transform
                  duration-500
                "
              />

            </div>

            {/* TITLE */}
            <h2
              className="
                text-center
                font-semibold
                mt-4
                text-[#3f2d21]
                min-h-[50px]
                flex
                items-center
                justify-center
              "
            >
              {producto.nombre}
            </h2>

            {/* BUTTON */}
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
              Ver precios
            </button>

          </div>

        ))}

      </div>

      {/* MODAL */}
      {productoActivo && (

        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">

          <div
            className="
            w-full
            max-w-7xl
            mx-auto
            my-2
            md:my-10
            bg-[#f8f4ef]
            rounded-none
            md:rounded-[40px]
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
                gap-4
                px-4
                md:px-8
                py-4
                md:py-6
                border-b
                border-[#eadfd3]
                bg-white/70
                backdrop-blur
              "
            >

              <div className="flex flex-col md:flex-row gap-5 w-full">

                {/* IMAGE */}

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


{productoActivo.precios.editando && (
  <div className="w-full">

    <p className="text-xs font-semibold text-[#7a6a5d] mb-2">
      URL de la imagen
    </p>

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
        mt-3
        block
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
      <p className="text-blue-600 text-sm mt-2">
        Subiendo imagen...
      </p>
    )}

  </div>
)}

</div>

                <div>

                <input
                  disabled={
                    !productoActivo.precios.editando
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
                    text-4xl
                    font-black
                    text-[#4b3425]
                    outline-none
                    w-full
                  "
                />

                  <p className="text-[#7a6a5d] mt-1">
                    Tarifas configurables por
                    distancia
                  </p>

                </div>

              </div>

              <button
                onClick={cerrarModal}
                className="
                  bg-[#e7d8ca]
                  hover:bg-[#d9c3af]
                  p-3
                  rounded-2xl
                  transition
                "
              >

                <X className="w-5 h-5" />

              </button>

            </div>

            {/* CONTENT */}
            <div className="p-4 md:p-8">

              {/* ACTIONS */}
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  mb-8
                  gap-4
                "
              >

                {/* BASE */}
                <div className="flex-1">

                  <div
                    className="
                      bg-white
                      rounded-[28px]
                      p-4
                      md:p-6
                      shadow-md
                      w-full
                      md:max-w-[420px]
                    "
                  >

                    <div className="text-sm text-gray-500 mb-2">
                      Precio base
                    </div>

                    <div className="flex items-center gap-2">

                      <span
                        className="
                          text-2xl
                          font-bold
                          text-[#9f6f47]
                        "
                      >
                        $
                      </span>

                      <input
                        type="number"
                        min={0}
                        disabled={
                          !productoActivo
                            .precios.editando
                        }
                        value={
                          productoActivo
                            .precios.base
                        }
                        onChange={(e) =>
                          editarPrecioBase(
                            Number(
                              e.target.value
                            )
                          )
                        }
                        className="
                        bg-transparent
                        text-2xl
                        md:text-4xl
                        font-black
                        text-[#4b3425]
                        outline-none
                        w-full
                        "
                      />

                    </div>

                  </div>

                </div>

                {/* BUTTONS */}
                <div
  className="
    flex
    flex-col
    sm:flex-row
    gap-3
    w-full
    md:w-auto
  "
>

                  {productoActivo.precios
                    .editando && (

                    <button
                      onClick={agregarTarifa}
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
                    onClick={toggleEditar}
                    disabled={guardando}
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
                        productoActivo
                          .precios.editando
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-[#d7bea7] hover:bg-[#c7a789] text-[#3f2d21]"
                      }
                    `}
                  >

                    {productoActivo.precios
                      .editando ? (
                      <>
                        <Check size={18} />

                        {guardando
                          ? "Guardando..."
                          : "Guardar"}
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
              <div
                className="
                  grid
                  sm:grid-cols-2
                  xl:grid-cols-3
                  gap-7
                "
              >

                {productoActivo.precios.tarifas.map(
                  (tarifa, index) => {

                    const total =
                      productoActivo
                        .precios.base +
                      tarifa.extra;

                    return (

                      <div
                        key={index}
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
                        {productoActivo
                          .precios
                          .editando && (

                          <button
                            onClick={() =>
                              eliminarTarifa(
                                index
                              )
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

                            <Trash2
                              size={16}
                            />

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

                        {/* RANGE */}
                        <input
                          value={tarifa.rango}
                          disabled={
                            !productoActivo
                              .precios
                              .editando
                          }
                          onChange={(e) =>
                            editarTarifa(
                              index,
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

                        {/* EXTRA */}
                        <div
                          className="
                            bg-[#f7f3ef]
                            rounded-2xl
                            p-4
                            mb-5
                          "
                        >

                          <div className="text-xs text-gray-500 mb-1">
                            Extra por distancia
                          </div>

                          <div className="flex items-center gap-2">

                            <span
                              className="
                                text-xl
                                font-bold
                                text-[#9f6f47]
                              "
                            >
                              $
                            </span>

                            <input
                              type="number"
                              min={0}
                              value={tarifa.extra}
                              disabled={
                                !productoActivo
                                  .precios
                                  .editando
                              }
                              onChange={(e) =>
                                editarTarifa(
                                  index,
                                  "extra",
                                  Number(
                                    e.target
                                      .value
                                  )
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

                        {/* TOTAL */}
                        <div
                          className="
                            bg-gradient-to-r
                            from-[#b8875c]
                            to-[#9f6f47]
                            text-white
                            rounded-2xl
                            p-5
                          "
                        >

                          <div className="text-sm opacity-80">
                            Precio total
                          </div>

                          <div className="text-3xl md:text-4xl font-black mt-1 break-words">
                            $
                            {total.toLocaleString()}
                          </div>

                        </div>

                        

                        {/* CALCULADORA DE VIAJE */}
<div
  className="
    mt-5
    bg-[#f8f5f1]
    rounded-[24px]
    p-5
    border
    border-[#eadfd4]
  "
>

  <div className="text-gray-500 text-sm mb-3">
    Cantidad de blocks
  </div>

  <input
    type="number"
    min={1}
    defaultValue={1}
    className="
      w-full
      bg-white
      border
      border-[#e5d8cb]
      rounded-2xl
      p-4
      text-2xl
      font-black
      outline-none
      text-[#4b3425]
      mb-5
    "
    onChange={(e) => {
      const cantidad =
        Number(e.target.value) || 0;

      const totalCalculado =
        total * cantidad;

    }}
  />
  
  <div
    className="
      bg-gradient-to-r
      from-[#2d2d2d]
      to-[#000]
      text-white
      rounded-2xl
      p-5
    "
  >

    <div className="text-sm opacity-80">
      Total del viaje
    </div>

    <div
      id={`total-${index}`}
      className="text-4xl font-black mt-1"
    >
      ${total.toLocaleString()}
    </div>

  </div>

</div>


                      </div>

              
                    );
                  }
                )}

              </div>
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
  );
  
}