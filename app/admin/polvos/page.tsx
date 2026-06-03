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

  editando?: boolean;
};

type ProductoDB = {
  id: number;
  nombre: string;
  imagen: string;
  precio_base: number | null;
};

type TarifaDB = {
  id: number;
  producto_id: number;
  rango: string;
  extra: number;
};

/* ---------------- PAGE ---------------- */

export default function PolvosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoActivo, setProductoActivo] =
    useState<Producto | null>(null);

const [subiendoImagen, setSubiendoImagen] =
  useState(false);

const [pickup, setPickup] =
  useState<{ [key: number]: boolean }>({});
  
  const [toneladas, setToneladas] =
  useState<{ [key: number]: number }>({});

  /* ---------------- LOAD ---------------- */

  useEffect(() => {
    const fetchProductos = async () => {
      const { data: productosDB } = await supabase
        .from("productos")
        .select("*")
        .eq("tipo", "polvos");

      const { data: tarifasDB } = await supabase
        .from("producto_tarifas")
        .select("*");

      if (!productosDB || !tarifasDB) return;

      const productosTyped =
        (productosDB ?? []) as ProductoDB[];

      const tarifasTyped =
        (tarifasDB ?? []) as TarifaDB[];

      const formateados: Producto[] =
        productosTyped.map((p) => {
          const tarifas = tarifasTyped
            .filter(
              (t) => t.producto_id === p.id
            )
            .map((t) => ({
              rango: t.rango,
              extra: Number(t.extra || 0),
            }));

          return {
            id: p.id,
            nombre: p.nombre,
            imagen: p.imagen,
            precios: {
              base: Number(
                p.precio_base || 0
              ),
              tarifas,
              editando: false,
            },
          };
        });

      setProductos(formateados);
    };

    fetchProductos();
  }, []);

  /* ---------------- HELPERS ---------------- */

  const abrirModal = (p: Producto) =>
    setProductoActivo(p);

  const cerrarModal = () =>
    setProductoActivo(null);

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
  valor: string
) => {
  if (!productoActivo) return;

  actualizarProducto({
    ...productoActivo,
    [campo]: valor,
  });
};

const toggleEditar = async () => {
  if (!productoActivo) return;

  if (productoActivo.precios.editando) {

    const { error } = await supabase
      .from("productos")
      .update({
        nombre: productoActivo.nombre,
        imagen: productoActivo.imagen,
      })
      .eq("id", productoActivo.id);

    if (error) {
      console.error(error);
      return;
    }

    await supabase
      .from("producto_tarifas")
      .delete()
      .eq("producto_id", productoActivo.id);

    if (
      productoActivo.precios.tarifas.length > 0
    ) {
      await supabase
        .from("producto_tarifas")
        .insert(
          productoActivo.precios.tarifas.map(
            (t) => ({
              producto_id:
                productoActivo.id,
              rango: t.rango,
              extra: t.extra,
            })
          )
        );
    }

    await supabase
      .from("productos")
      .update({
        precio_base:
          productoActivo.precios.base,
      })
      .eq("id", productoActivo.id);
  }

  actualizarProducto({
    ...productoActivo,
    precios: {
      ...productoActivo.precios,
      editando:
        !productoActivo.precios.editando,
    },
  });
};

  const editarBase = (valor: number) => {
    if (!productoActivo) return;

    actualizarProducto({
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

    const nuevas = [
      ...productoActivo.precios.tarifas,
    ];

    nuevas[index] = {
      ...nuevas[index],
      [campo]:
        campo === "rango"
          ? String(valor)
          : Number(valor),
    };

    actualizarProducto({
      ...productoActivo,
      precios: {
        ...productoActivo.precios,
        tarifas: nuevas,
      },
    });
  };

  const agregarTarifa = () => {
    if (!productoActivo) return;

    actualizarProducto({
      ...productoActivo,
      precios: {
        ...productoActivo.precios,
        tarifas: [
          ...productoActivo.precios.tarifas,
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

    actualizarProducto({
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

  const { data, error } =
    await supabase
      .from("productos")
      .insert({
        nombre: "Nuevo producto",
        imagen: "",
        precio_base: 0,
        tipo: "polvos",
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

  setProductoActivo(nuevoProducto);
};

const eliminarProducto = async () => {

  if (!productoActivo) return;

  await supabase
    .from("producto_tarifas")
    .delete()
    .eq(
      "producto_id",
      productoActivo.id
    );

  const { error } =
    await supabase
      .from("productos")
      .delete()
      .eq("id", productoActivo.id);

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

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-[#f5f1eb] min-h-screen">

      {/* HERO */}
      <div className="relative w-full h-[260px] md:h-[320px] overflow-hidden">

        <Image
          src="/polvos/banner.jpeg"
          alt="Polvos"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">

          <h1 className="text-white text-3xl md:text-5xl font-black">
            Polvos
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 flex justify-end">
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
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-8
        "
      >
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
    p.imagen?.trim()
      ? p.imagen
      : "/sin-imagen.png"
  }
                alt={p.nombre}
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
              {p.nombre}
            </h2>

            {/* BUTTON */}
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

      {/* MODAL */}
      {productoActivo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">

          <div
            className="
              w-[96%]
              max-w-7xl
              mx-auto
              my-2
              md:my-10
              bg-[#f8f4ef]
              rounded-[24px]
              md:rounded-[40px]
              overflow-hidden
            "
          >

 {/* HEADER */}
<div
  className="
    flex
    flex-col
    md:flex-row
    md:items-start
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

  <div className="flex items-start gap-5">

    {/* IMAGEN */}
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
        <>
          <input
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
            md:w-64
            border
            border-gray-300
            rounded-xl
            p-2
            text-sm
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

    {/* NOMBRE */}
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
  text-2xl
  md:text-4xl
  font-black
  text-[#4b3425]
  outline-none
  w-full
        "
      />

      <p className="text-[#7a6a5d] mt-1">
        Tarifas configurables por distancia
      </p>
    </div>

  </div>

  {/* CERRAR */}
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
            <div className="p-8">

              {/* TOP ACTIONS */}
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

                {/* BASE PRICE */}
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
                        disabled={
                          !productoActivo.precios
                            .editando
                        }
                        value={
                          productoActivo.precios
                            .base
                        }
                        onChange={(e) =>
                          editarBase(
                            Number(
                              e.target.value
                            )
                          )
                        }
                        className="
                          bg-transparent
                          outline-none
                          text-2xl md:text-4xl
                          md:text-6xl
                          font-black
                          text-[#1f1f1f]
                          tracking-tight
                          w-full
                        "
                      />
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="
                    flex
                    flex-col
                    sm:flex-row
                    gap-3
                    w-full
                    md:w-auto
                ">

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
                        text-black
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
                          ? "bg-green-600 hover:bg-green-700 text-black"
                          : "bg-[#d7bea7] hover:bg-[#c7a789] text-[#3f2d21]"
                      }
                    `}
                  >
                    {productoActivo.precios
                      .editando ? (
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
              <div
                className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-5
                md:gap-7
                "
              >

                {productoActivo.precios.tarifas.map(
                  (t, i) => {
          const cantidad =
            toneladas[i] || 1;

          const subtotal =
            productoActivo.precios.base *
            cantidad;

          const total =
            subtotal +
            (pickup[i] ? 0 : t.extra);
                    

                    return (
                      <div
                        key={i}
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
                                i
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
                          value={t.rango}
                          disabled={
                            !productoActivo
                              .precios
                              .editando
                          }
                          onChange={(e) =>
                            editarTarifa(
                              i,
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
                              value={t.extra}
                              disabled={
                                !productoActivo
                                  .precios
                                  .editando
                              }
                              onChange={(e) =>
                                editarTarifa(
                                  i,
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
                                text-2xl
                                md:text-4xl
                                font-black
                                text-[#2d2d2d]
                                w-full
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
                            text-black
                            rounded-2xl
                            p-5
                          "
                        >
                          <div className="text-sm text-gray-300 font-medium">
                            Precio total
                          </div>

                          <div className="text-4xl font-black mt-1">
                            $
                            {total.toLocaleString()}
                          </div>
                        </div>

                        {/* CALCULADORA TONELADAS */}
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

  <div className="text-sm text-gray-500 mb-3">
    Toneladas
  </div>

  <label className="flex items-center gap-3 mb-4">
  <input
    type="checkbox"
    checked={pickup[i] || false}
    onChange={(e) =>
      setPickup({
        ...pickup,
        [i]: e.target.checked,
      })
    }
  />

  <span className="font-semibold text-[#3f2d21]">
    Pickup (sin flete)
  </span>
</label>

<input
  type="number"
  min={1}
  value={toneladas[i] || 1}
  onChange={(e) =>
    setToneladas({
      ...toneladas,
      [i]: Number(e.target.value),
    })
  }
  className="
    w-full
    h-14
    rounded-2xl
    border
    border-[#d8c7b6]
    bg-white
    px-4
    text-2xl
    font-black
    text-[#3f2d21]
    outline-none
    focus:ring-4
    focus:ring-[#b8875c]/30
    shadow-sm
    mb-4
  "
/>

  {/* SUBTOTAL */}
  <div
    className="
        w-full
        h-14
        rounded-2xl
        border
        border-[#d8c7b6]
        bg-white
        px-4
        text-2xl
        font-black
        text-[#3f2d21]
        outline-none
        focus:ring-4
        focus:ring-[#b8875c]/30
        shadow-sm
    "
  >

    <div className="text-sm text-gray-500">
      Material
    </div>

    <div
      id={`subtotal-${i}`}
      className="
        text-2xl md:text-4xl
        font-black
        text-[#2d2d2d]
        tracking-tight
      "
    >
      $
      {subtotal.toLocaleString()}
    </div>

  </div>

  {/* TOTAL FINAL */}
  <div
    className="
        bg-gradient-to-r
        from-[#2d2d2d]
        to-black
        text-white
        rounded-2xl
        p-5
        shadow-xl
        border
        border-white/10
    "
  >

    <div className="text-sm opacity-80">
      Total con flete
    </div>

    <div
      id={`total-ton-${i}`}
      className="  
        text-3xl md:text-5xl
        font-black
        mt-2
        tracking-tight
        text-white
        drop-shadow-lg
        "
    >
      $
      {total.toLocaleString()}
    </div>

  </div>

</div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}