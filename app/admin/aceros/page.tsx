"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  Pencil,
  Check,
  Minus,
  Ruler,
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";


type PrecioAcero = {
  id: number;
  medida: string;

  precioPieza: number;

  piezasPorTonelada: number; // NUEVO

  precioMayoreo: number;
  precioCarretilla: number;

  rango: string;
  notas: string;

  editando?: boolean;
};

type Producto = {
  id: number;
  nombre: string;
  imagen: string;
  descripcion: string;
  precios: PrecioAcero[];
};

type ProductoDB = {
  id: number;
  nombre: string;
  imagen: string;
  descripcion: string;
};

type AceroPrecioDB = {
  id: number;
  producto_id: number;
  medida: string;

  menudeo: number;
  mayoreo: number;

  piezas_por_tonelada: number; // NUEVO

  carretilla: number;
  rango: string;
  notas: string;
};

export default function AcerosPage() {
    const [productos, setProductos] =
        useState<Producto[]>([]);

  const [productoActivo, setProductoActivo] =
    useState<Producto | null>(null);

    const [modo, setModo] = useState<"crear" | "editar">("editar");

    const [guardandoProducto, setGuardandoProducto] = useState(false);
const [subiendoImagen, setSubiendoImagen] = useState(false);

    useEffect(() => {
      

const fetchProductos = async () => {

  const { data: productosDB, error: productosError } =
    await supabase
      .from("productos")
      .select("*")
      .eq("tipo", "aceros");

  const { data: preciosDB, error: preciosError } =
    await supabase
      .from("producto_tarifas")
      .select("*");

  console.log(productosDB);
  console.log(preciosDB);

  if (
    productosError ||
    preciosError ||
    !productosDB ||
    !preciosDB
  ) {
    console.error(productosError);
    console.error(preciosError);
    return;
  }

  const productosTyped =
    productosDB as ProductoDB[];

  const preciosTyped =
    preciosDB as AceroPrecioDB[];

  const productosFormateados: Producto[] =
    productosTyped.map((p) => {

const precios =
  preciosTyped
    .filter(
      (precio) =>
        precio.producto_id === p.id
    )
.map((precio) => ({
  id: precio.id,
  medida: precio.medida,

  precioPieza: Number(
    precio.menudeo || 0
  ),

  precioMayoreo: Number(
    precio.mayoreo || 0
  ),

  piezasPorTonelada: Number(
    precio.piezas_por_tonelada || 0
  ),

  precioCarretilla: Number(
    precio.carretilla || 0
  ),

  rango: precio.rango || "",
  notas: precio.notas || "",
  editando: false,
}));

      return {
        id: p.id,
        nombre: p.nombre,
        imagen: p.imagen,
        descripcion: p.descripcion || "",
        precios,
      };
    });

  setProductos(productosFormateados);
};

  fetchProductos();

}, []);


const abrirModal = (producto: Producto) => {
  setProductoActivo(producto);
  setModo("editar");
};

const cerrarModal = () => {
  setProductoActivo(null);
  setModo("editar");
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

const crearProducto = async () => {
  // Crear producto
  const { data, error } = await supabase
    .from("productos")
    .insert({
      nombre: "",
      imagen: "",
      descripcion: "",
      tipo: "aceros",
    })
    .select()
    .single();

  if (error || !data) {
    console.error(error);
    return;
  }

  // Crear primera medida automáticamente
  const { data: tarifa, error: tarifaError } =
    await supabase
      .from("producto_tarifas")
      .insert({
        producto_id: data.id,
        medida: "Escribe la medida",
        menudeo: 0,
        mayoreo: 0,
        piezas_por_tonelada: 70,
        carretilla: 0,
        rango: "",
        notas: "",
      })
      .select()
      .single();

  if (tarifaError) {
    console.error(tarifaError);
  }

  const nuevo: Producto = {
    id: data.id,
    nombre: "",
    imagen: "/placeholder-producto.jpg",
    descripcion: "",
    precios: tarifa
      ? [
          {
            id: tarifa.id,
            medida: tarifa.medida,
            precioPieza: Number(tarifa.menudeo),
            precioMayoreo: Number(tarifa.mayoreo),
            piezasPorTonelada: Number(
              tarifa.piezas_por_tonelada
            ),
            precioCarretilla: Number(
              tarifa.carretilla
            ),
            rango: tarifa.rango,
            notas: tarifa.notas,
            editando: true,
          },
        ]
      : [],
  };

  setProductos((prev) => [nuevo, ...prev]);
  setProductoActivo(nuevo);
  setModo("crear");
};

const eliminarProducto = async () => {
  if (!productoActivo) return;

  await supabase
    .from("producto_tarifas")
    .delete()
    .eq("producto_id", productoActivo.id);

  await supabase
    .from("productos")
    .delete()
    .eq("id", productoActivo.id);

  setProductos((prev) =>
    prev.filter((p) => p.id !== productoActivo.id)
  );

  cerrarModal();
};

const guardarProducto = async () => {
  if (!productoActivo) return;

  setGuardandoProducto(true);

  try {
    // producto
    await supabase
      .from("productos")
      .update({
        nombre: productoActivo.nombre,
        descripcion: productoActivo.descripcion,
        imagen: productoActivo.imagen,
      })
      .eq("id", productoActivo.id);

    // todas las medidas
    for (const precio of productoActivo.precios) {
      await supabase
        .from("producto_tarifas")
        .update({
          medida: precio.medida,
          menudeo: precio.precioPieza,
          mayoreo: precio.precioMayoreo,
          piezas_por_tonelada:
            precio.piezasPorTonelada,
          carretilla: precio.precioCarretilla,
          rango: precio.rango ?? "",
          notas: precio.notas ?? "",
        })
        .eq("id", precio.id);
    }

    // salir de modo edición
    actualizarProducto({
      ...productoActivo,
      precios: productoActivo.precios.map(
        (p) => ({
          ...p,
          editando: false,
        })
      ),
    });

  } finally {
    setGuardandoProducto(false);
  }
};

const subirImagen = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  if (!productoActivo) return;

  const file = e.target.files?.[0];
  if (!file) return;

  setSubiendoImagen(true);

  const ext = file.name.split(".").pop();
  const path = `aceros/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("productos")
    .upload(path, file);

  if (error) {
    setSubiendoImagen(false);
    return;
  }

  const { data } = supabase.storage
    .from("productos")
    .getPublicUrl(path);

  setProductoActivo({
    ...productoActivo,
    imagen: data.publicUrl,
  });

  setSubiendoImagen(false);
};

  const editarPrecio = (
    index: number,
    campo: keyof PrecioAcero,
    valor: string | number
  ) => {
    if (!productoActivo) return;

    const nuevos = [...productoActivo.precios];

const esNumero = [
  "precioPieza",
  "precioMayoreo",
  "precioCarretilla",
  "piezasPorTonelada",
].includes(campo as string);

nuevos[index] = {
  ...nuevos[index],
  [campo]: esNumero ? Number(valor) : valor,
};

// calcular automáticamente el precio por tonelada
const precioPieza =
  campo === "precioPieza"
    ? Number(valor)
    : nuevos[index].precioPieza;

const piezasPorTonelada =
  campo === "piezasPorTonelada"
    ? Number(valor)
    : nuevos[index].piezasPorTonelada;

nuevos[index].precioMayoreo =
  precioPieza * piezasPorTonelada;

    actualizarProducto({
      ...productoActivo,
      precios: nuevos,
    });
  };

const toggleEditar = (index: number) => {
  if (!productoActivo) return;

  const nuevos = [...productoActivo.precios];

  nuevos[index] = {
    ...nuevos[index],
    editando: !nuevos[index].editando,
  };

  actualizarProducto({
    ...productoActivo,
    precios: nuevos,
  });
};

const guardarCambios = async (
  index: number
) => {

  if (!productoActivo) return;

  const precio =
    productoActivo.precios[index];

  await supabase
    .from("producto_tarifas")
  .update({
    medida: precio.medida,
    menudeo: precio.precioPieza,
    mayoreo: precio.precioMayoreo,
    piezas_por_tonelada:
      precio.piezasPorTonelada,
    carretilla: precio.precioCarretilla,
    rango: precio.rango ?? "",
    notas: precio.notas ?? "",
  })
  .eq("id", precio.id);
};

const eliminarPrecio = async (
  index: number
) => {

  if (!productoActivo) return;

  const precio =
    productoActivo.precios[index];

await supabase
  .from("producto_tarifas")
  .delete()
  .eq("id", precio.id);

  actualizarProducto({
    ...productoActivo,

    precios:
      productoActivo.precios.filter(
        (_, i) => i !== index
      ),
  });
};

const agregarPrecio = async () => {

  if (!productoActivo) return;

  const nuevo = {
  producto_id: productoActivo.id,
  medida: "Escribe la medida",
  menudeo: 0,
  mayoreo: 0,
  piezas_por_tonelada: 0,
  carretilla: 0,
  rango: "5-10 km",
  notas: "Editar información",
};

  const { data, error } =
    await supabase
      .from("producto_tarifas")
      .insert(nuevo)
      .select()
      .single();

  if (error || !data) {
    console.error(error);
    return;
  }

const nuevoPrecio: PrecioAcero = {
  id: data.id,
  medida: data.medida,
  precioPieza: Number(data.menudeo),
  precioMayoreo: Number(data.mayoreo),

  piezasPorTonelada: Number(
    data.piezas_por_tonelada
  ),

  precioCarretilla: Number(data.carretilla),
  rango: data.rango,
  notas: data.notas,
  editando: true,
};

  actualizarProducto({
    ...productoActivo,

    precios: [
      ...productoActivo.precios,
      nuevoPrecio,
    ],
  });
};

  return (
    <div className="bg-[#efefef] min-h-screen">

      {/* HERO */}
      <div className="relative w-full h-[260px] md:h-[320px] overflow-hidden">

        <Image
          src="/Aceros/banner-aceros.jpg"
          alt="Aceros"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

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
              drop-shadow-xl
            "
          >
            Aceros
          </h1>
        </div>
      </div>

      <div className="flex justify-end mb-6">
  <button
    onClick={crearProducto}
    className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl flex items-center gap-2"
  >
    <Plus size={20} />
    Nuevo producto
  </button>
</div>

      {/* CONTENIDO */}
      <div className="max-w-7xl mx-auto px-6 py-14">

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
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="
                group
                bg-white
                rounded-[28px]
                p-4
                shadow-md
                hover:shadow-2xl
                transition-all
                duration-300
                hover:-translate-y-1
                w-full
                max-w-[260px]
              "
            >

              <div
                className="
                  relative
                  w-full
                  h-[170px]
                  rounded-[22px]
                  overflow-hidden
                "
              >
                <Image
                    src={
                      producto.imagen ||
                      "/placeholder-producto.jpg"
                    }
                  alt={producto.nombre}
                  fill
                  className="
                    object-cover
                    group-hover:scale-110
                    transition-transform
                    duration-500
                  "
                />
              </div>

              <h2
                className="
                  mt-4
                  text-lg
                  md:text-xl
                  font-semibold
                  text-center
                  text-[#3f2d21]
                  min-h-[55px]
                  flex
                  items-center
                  justify-center
                "
              >
                {producto.nombre}
              </h2>

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
      </div>

      {/* MODAL */}
      {productoActivo && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">

          <div
            className="
            bg-white
            w-full
            max-w-7xl
            rounded-[35px]
            p-8
            md:p-14
            relative
            mx-auto
            my-10
            shadow-2xl
          "
        >

            {/* BOTON REGRESAR */}
            <button
              onClick={cerrarModal}
              className="
                bg-[#d7bea7]
                hover:bg-[#c9aa8d]
                text-[#4b3425]
                px-6
                py-4
                rounded-2xl
                font-semibold
                shadow-lg
                transition
                mb-10
              "
            >
              Regresar
            </button>

            <input
              value={productoActivo.nombre || ""}
              placeholder="Nombre del producto"
              onChange={(e) =>
                setProductoActivo({
                  ...productoActivo,
                  nombre: e.target.value,
                })
              }
              className="
                  bg-transparent
                  text-center
                  text-3xl md:text-5xl
                  font-black
                  text-[#4b3425]
                  placeholder:text-gray-300
                  outline-none
                  w-full
              "
            />

            
<div className="flex justify-end gap-4 mb-10">

  <button
    onClick={guardarProducto}
    disabled={guardandoProducto}
    className="
      bg-[#0ea843]
      hover:bg-[#0b923a]
      text-white
      px-6
      py-3
      rounded-xl
      shadow-md
    "
  >
    {guardandoProducto
      ? "Guardando..."
      : modo === "crear"
      ? "Crear producto"
      : "Guardar cambios"}
  </button>

  <button
    onClick={agregarPrecio}
    className="
      bg-[#c49563]
      hover:bg-[#b68450]
      text-white
      px-6
      py-3
      rounded-xl
      shadow-md
    "
  >
    + Agregar medida
  </button>

  <button
    onClick={eliminarProducto}
    className="
      bg-[#1f1f1f]
      hover:bg-black
      text-white
      px-6
      py-3
      rounded-xl
      shadow-md
    "
  >
    Eliminar
  </button>

</div>

            {/* CONTENIDO */}
<div className="grid md:grid-cols-[420px_1fr] gap-12 items-start">

  {/* COLUMNA IZQUIERDA */}
  <div>
    <div className="relative w-full h-[350px] md:h-[450px] rounded-[30px] overflow-hidden shadow-2xl">
      <Image
          src={
    productoActivo.imagen ||
    "/placeholder-producto.jpg"
  }
        alt={productoActivo.nombre}
        fill
        className="object-cover
        group-hover:scale-110
        transition-transform
        duration-500
        "
      />
    </div>

<div className="mt-5 space-y-3">

  <div>
    <p className="text-sm font-semibold text-[#6b5647] mb-2">
      URL de la imagen
    </p>

<input
  type="text"
  value={productoActivo.imagen || ""}
  placeholder="Pega aquí la URL de la imagen..."
  onChange={(e) =>
    setProductoActivo({
      ...productoActivo,
      imagen: e.target.value,
    })
  }
  className="
    w-full
    px-4
    py-3
    rounded-xl
    border
    border-[#d8ccc0]
    bg-white
    text-[#4b3425]
    text-base
    font-medium
    outline-none
    focus:ring-2
    focus:ring-[#c8a37c]
  "
/>
  </div>

  <label
    className="
      flex
      justify-center
      items-center
      w-full
      py-3
      rounded-xl
      bg-[#ede6df]
      hover:bg-[#e4dbd2]
      text-[#4b3425]
      font-semibold
      cursor-pointer
      transition
    "
  >
    Seleccionar imagen

    <input
      type="file"
      hidden
      onChange={subirImagen}
    />
  </label>

      {subiendoImagen && (
        <p className="text-blue-500 mt-2">
          Subiendo imagen...
        </p>
      )}
    </div>
  </div>

  {/* COLUMNA DERECHA */}
 <div className="space-y-6">



{productoActivo.precios.map((precio, index) => (
  
  
  <div
    key={precio.id}
    className="
        bg-white
        border
        border-[#ece3da]
        rounded-[32px]
        p-8
        shadow-lg
        space-y-6
    "
  >
      
      {/* MEDIDA */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Ruler size={22} className="text-[#9f6f47]" />
<h3
  className="
    text-xl
    font-bold
    text-[#4b3425]
    border-b
    border-[#ece3da]
    pb-4
  "
>
  Medida #{index + 1}
</h3>
        </div>
    

        <input
          disabled={!precio.editando}
          value={precio.medida}
          onChange={(e) =>
            editarPrecio(index, "medida", e.target.value)
          }
          className="
w-full
bg-[#f7f3ef]
border
border-[#d8ccc0]
rounded-2xl
p-4
text-center
text-2xl md:text-4xl
font-black
text-[#4b3425]
  "
        />
        </div>
  

      {/* PRECIOS */}
<div
  className="
    bg-[#ebe5df]
    rounded-[35px]
    p-8
    border
    border-[#d8ccc0]
  "
>

  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

    {/* PIEZA */}
    <div className="text-center">
      <p className="text-gray-500 text-xl mb-2">
        Pieza
      </p>

      <div className="relative">
<span
  className="
    absolute
    left-4
    top-1/2
    -translate-y-1/2
    text-2xl md:text-3xl
    font-bold
    text-[#4b3425]
  "
>
  $
</span>

        <input
          disabled={!precio.editando}
          type="number"
          value={precio.precioPieza}
          onChange={(e) =>
            editarPrecio(
              index,
              "precioPieza",
              Number(e.target.value)
            )
          }
          className="
            w-full
            pl-12
            bg-[#f7f3ef]
            border
            border-[#d8ccc0]
            rounded-2xl
            p-4
            text-center
            text-2xl md:text-4xl
            font-black
            text-[#4b3425]
                      "
        />
      </div>
    </div>

    {/* TONELADA */}
    <div className="text-center">
      <p className="text-gray-500 text-xl mb-2">
        Tonelada
      </p>

<div className="relative">
  <span
    className="
      absolute
      left-4
      top-1/2
      -translate-y-1/2
      text-3xl
      font-bold
      text-green-700
      z-10
    "
  >
    $
  </span>

  <input
    disabled
    type="number"
    value={precio.precioMayoreo}
    className="
  w-full
  pl-12
  bg-[#f7f3ef]
  border
  border-[#d8ccc0]
  rounded-2xl
  p-4
  text-center
  text-2xl md:text-4xl
  font-black
  text-[#4b3425]
    "
  />
</div>

        <div className="text-center mt-6">
          <p className="text-gray-500 text-lg mb-2">
            Piezas por tonelada
          </p>

          <input
            disabled={!precio.editando}
            type="number"
            value={precio.piezasPorTonelada}
            onChange={(e) =>
              editarPrecio(
                index,
                "piezasPorTonelada",
                Number(e.target.value)
              )
            }
            className="
  w-full
  pl-12
  bg-[#f7f3ef]
  border
  border-[#d8ccc0]
  rounded-2xl
  p-4
  text-center
  text-2xl md:text-4xl
  font-black
  text-[#4b3425]
"
          />
  </div> 
</div> 
</div> 
</div> 

      {/* NOTAS */}
<textarea
  disabled={!precio.editando}
  value={precio.notas}
  onChange={(e) =>
    editarPrecio(
      index,
      "notas",
      e.target.value
    )
  }
  className="
      w-full
      min-h-[140px]
      rounded-[30px]
      border
      border-[#d8ccc0]
      bg-[#f7f3ef]
      p-6
      text-lg
      text-[#4b3425]
      outline-none
      resize-none
      disabled:bg-transparent
      disabled:border-transparent
  "
/>

      {/* ACCIONES */}
<div className="flex gap-4 mt-6">

      <button
        onClick={() => toggleEditar(index)}
        className="
          bg-[#4b3425]
          hover:bg-[#3b2a1f]
          text-white
          px-8
          py-4
          rounded-2xl
          flex
          items-center
          gap-2
        "
      >
        <Pencil size={18} />

    {precio.editando
      ? "Listo"
      : "Editar"}
      </button>

    {precio.editando && (
      <button
        onClick={() =>
          eliminarPrecio(index)
        }
        className="
      bg-[#f1e8df]
      hover:bg-[#e7dbd0]
      text-[#8b5e3c]
      border
      border-[#d8ccc0]
      px-6
      py-3
      rounded-xl
      shadow-md
        "
      >
        <Trash2 size={18} />
        Eliminar
      </button>
    )}

</div>



    </div>
  ))}


              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}