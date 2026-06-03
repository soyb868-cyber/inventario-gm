"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

/* ─── TIPOS ─────────────────────────────────────────────── */
interface Precios {
  precio_dia: string;
  precio_semana: string;
  precio_quincena: string;
  precio_mes: string;
  precio_viaje: string;
  precio_arrastre?: string;
}

interface Maquina {
  id: number;

  nombre: string;

  imagen: string; // portada

  imagenes?: string[]; // galería

  fichaPdf: string;

  nota?: string;

  precio_dia: string | number;
  precio_semana: string | number;
  precio_quincena: string | number;
  precio_mes: string | number;
  precio_viaje: string | number;
  precio_arrastre?: string | number;
}

type CampoPrecio =
  | "precio_dia"
  | "precio_semana"
  | "precio_quincena"
  | "precio_mes"
  | "precio_viaje"
  | "precio_arrastre";
/* ─── COMPONENTE ─────────────────────────────────────────── */

export default function MaquinariaPage() {
  const [modalMaquina, setModalMaquina] = useState<Maquina | null>(null);

  const [modoEdicion, setModoEdicion] = useState(false);

    const [modalNuevaMaquina, setModalNuevaMaquina] = useState(false);
    const [nuevaMaquina, setNuevaMaquina] = useState({
  nombre: "",
  nota: "",
  precio_dia: "",
  precio_semana: "",
  precio_quincena: "",
  precio_mes: "",
  precio_viaje: "",
  precio_arrastre: "",
});

const [imagenPrincipal, setImagenPrincipal] = useState<File | null>(null);
const [imagenesGaleria, setImagenesGaleria] = useState<File[]>([]);
const [pdf, setPdf] = useState<File | null>(null);
const [imagenEditada, setImagenEditada] = useState<File | null>(null);
const [pdfEditado, setPdfEditado] = useState<File | null>(null);

const [preciosEditados, setPreciosEditados] = useState<{
  precio_dia: string;
  precio_semana: string;
  precio_quincena: string;
  precio_mes: string;
  precio_viaje: string;
  precio_arrastre: string;
}>({
  precio_dia: "",
  precio_semana: "",
  precio_quincena: "",
  precio_mes: "",
  precio_viaje: "",
  precio_arrastre: "",
});


const [maquinaria, setMaquinaria] = useState<Maquina[]>([]);
const [loading, setLoading] = useState(true);
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch("/api/maquinaria");
      const data = await res.json();

      

      console.log(data);

      setMaquinaria(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando maquinaria:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
  const campos: { label: string; campo: CampoPrecio }[] = [
  { label: "Día", campo: "precio_dia" },
  { label: "Semana", campo: "precio_semana" },
  { label: "Quincena", campo: "precio_quincena" },
  { label: "Mes", campo: "precio_mes" },
  { label: "Viaje", campo: "precio_viaje" },
  { label: "Arrastre", campo: "precio_arrastre" },
];
const getPrecio = (m: Maquina, campo: CampoPrecio) => {
  return m[campo] ?? "";
  

};

if (loading) {
  return (
    <div className="flex items-center justify-center h-screen">
      Cargando maquinaria...
    </div>
  );
}

  /* Abrir PDF en nueva pestaña */
  const abrirFicha = (pdf: string) => {
    window.open(pdf, "_blank");
  };

  /* Abrir modal de precios */
const abrirPrecios = (maquina: Maquina) => {
  setModalMaquina(maquina);

setPreciosEditados({
precio_dia: maquina.precio_dia?.toString() || "",
precio_semana: maquina.precio_semana?.toString() || "",
precio_quincena: maquina.precio_quincena?.toString() || "",
precio_mes: maquina.precio_mes?.toString() || "",
precio_viaje: maquina.precio_viaje?.toString() || "",
precio_arrastre: maquina.precio_arrastre?.toString() || "",
});

  setModoEdicion(false);
};

  const cerrarModal = () => setModalMaquina(null);


const guardarCambios = async () => {
  if (!modalMaquina) return;

  const formData = new FormData();

  console.log("imagenPrincipal:", formData.get("imagenPrincipal"));
console.log("pdf:", formData.get("pdf"));

  formData.append("precio_dia", preciosEditados.precio_dia);
  formData.append("precio_semana", preciosEditados.precio_semana);
  formData.append("precio_quincena", preciosEditados.precio_quincena);
  formData.append("precio_mes", preciosEditados.precio_mes);
  formData.append("precio_viaje", preciosEditados.precio_viaje);
  formData.append("precio_arrastre", preciosEditados.precio_arrastre);

  if (imagenEditada) {
    formData.append("imagen", imagenEditada);
  }

  if (pdfEditado) {
    formData.append("pdf", pdfEditado);
  }

  await fetch(`/api/maquinaria/${modalMaquina.id}`, {
    method: "PATCH",
    body: formData,
  });

  const res = await fetch("/api/maquinaria");   
  const data = await res.json();

  setMaquinaria(data);

  setImagenEditada(null);
  setPdfEditado(null);

  setModoEdicion(false);
  setModalMaquina(null);
};

const eliminarMaquina = async (id: number) => {
  const confirmar = confirm("¿Seguro que quieres eliminar esta maquinaria?");
  if (!confirmar) return;

  await fetch(`/api/maquinaria/${id}`, {
    method: "DELETE",
  });

  // recargar lista
  const res = await fetch("/api/maquinaria");
  const data = await res.json();
  setMaquinaria(data);

  // si tienes modal abierto de esa máquina, lo cierras
  if (modalMaquina?.id === id) {
    setModalMaquina(null);
  }
};

const crearMaquina = async () => {
    console.log("IMAGEN:", imagenPrincipal);
  console.log("PDF:", pdf);
  const formData = new FormData();
  if (!nuevaMaquina.nombre) {
  alert("Nombre requerido");
  return;
}
  formData.append("nombre", nuevaMaquina.nombre);
  if (nuevaMaquina.nota) {
  formData.append("nota", nuevaMaquina.nota);
}

formData.append("precio_dia", nuevaMaquina.precio_dia || "0");
formData.append("precio_semana", nuevaMaquina.precio_semana || "0");
formData.append("precio_quincena", nuevaMaquina.precio_quincena || "0");
formData.append("precio_mes", nuevaMaquina.precio_mes || "0");
formData.append("precio_viaje", nuevaMaquina.precio_viaje || "0");
formData.append("precio_arrastre", nuevaMaquina.precio_arrastre || "0");

if (imagenPrincipal) {
  formData.append("imagenPrincipal", imagenPrincipal);
}

imagenesGaleria.forEach((img) => {
  formData.append("imagenes", img);
});

  if (pdf) {
    formData.append("pdf", pdf);
  }

const response = await fetch("/api/maquinaria", {
  method: "POST",
  body: formData,
});

const result = await response.json();

console.log(result);

if (!response.ok) {
  alert(result.error || "Error");
  return;
}

  const res = await fetch("/api/maquinaria");
  const data = await res.json();

  setMaquinaria(data);

  setModalNuevaMaquina(false);

  setNuevaMaquina({
    nombre: "",
    nota: "",
    precio_dia: "",
    precio_semana: "",
    precio_quincena: "",
    precio_mes: "",
    precio_viaje: "",
    precio_arrastre: "",
  });

  setImagenPrincipal(null);
setImagenesGaleria([]);
  setPdf(null);
};


  return (
    <div className="bg-[#efefef] min-h-screen">

      {/* ── HERO ── */}
      <div className="relative w-full h-[220px] md:h-[300px] overflow-hidden">
        <Image
          src="/Maquinaria/banner.jpeg"
          alt="Renta de maquinaria"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-6xl font-black tracking-wide drop-shadow-xl text-center">
            Renta de Maquinaria
          </h1>
        </div>
      </div>

      
<div className="flex justify-end mb-8">
  <button
    onClick={() => setModalNuevaMaquina(true)}
    className="
      bg-green-600
      hover:bg-green-700
      text-white
      px-6 py-3
      rounded-2xl
      font-bold
    "
  >
    + Agregar maquinaria
  </button>
</div>
      {/* ── GRID DE TARJETAS ── */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
          {maquinaria.map((item) => (
            <div
              key={item.id}
              className="
                group bg-white rounded-[28px] p-4 shadow-md
                hover:shadow-2xl transition-all duration-300
                hover:-translate-y-1 w-full max-w-[240px]
                flex flex-col
              "
            >
              {/* IMAGEN */}
              <div className="relative w-full h-[170px] rounded-[22px] overflow-hidden">
                <Image
                  src={item.imagen?.trim() ? item.imagen : "/placeholder.jpg"}
                  alt={item.nombre}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* NOMBRE */}
              <h2 className="mt-4 text-lg md:text-xl font-semibold text-center text-[#3f2d21] min-h-[70px] flex items-center justify-center">
                {item.nombre}
              </h2>

              {/* BOTONES */}
            <div className="mt-5 flex flex-col gap-3">
              {/* VER PRECIOS */}
              <button
                onClick={() => abrirPrecios(item)}
                className="
                  w-full
                  py-3.5
                  rounded-2xl
                  bg-[#3f2d21]
                  text-white
                  font-semibold
                  shadow-lg
                  hover:bg-[#5a3e2b]
                  hover:-translate-y-1
                  hover:shadow-xl
                  transition-all duration-300
                "
              >
                 Ver precios
              </button>

              {/* FICHA TECNICA */}
              <button
                onClick={() => abrirFicha(item.fichaPdf)}
                className="
                  w-full
                  py-3.5
                  rounded-2xl
                  bg-[#d7bea7]
                  text-[#3f2d21]
                  font-semibold
                  shadow-lg
                  hover:bg-[#caa789]
                  hover:-translate-y-1
                  hover:shadow-xl
                  transition-all duration-300
                "
              >
                 Ficha técnica
              </button>

              {/* ELIMINAR */}
              <button
                onClick={() => eliminarMaquina(item.id)}
                className="
                  w-full
                  py-3.5
                  rounded-2xl
                  bg-red-50
                  border border-red-200
                  text-red-600
                  font-semibold
                  shadow-sm
                  hover:bg-red-600
                  hover:text-white
                  hover:border-red-600
                  hover:-translate-y-1
                  transition-all duration-300
                "
              >
                🗑 Eliminar
              </button>
            </div>
            </div>
          ))}
          
        </div>
      </div>

      {/* ── MODAL PREMIUM ── */}
{modalMaquina && (
  <>
    {/* FONDO */}
    <div
      className="
        fixed inset-0 bg-black/60 backdrop-blur-sm
        z-40
      "
      onClick={cerrarModal}
    />

    {/* CONTENEDOR */}
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        p-4
      "
    >
      <div
        className="
          relative bg-white
          w-full max-w-5xl
          rounded-[24px] md:rounded-[35px]
          overflow-hidden
          shadow-2xl
          animate-fade-up
          grid grid-cols-1 md:grid-cols-2
          max-h-[92vh]
          overflow-y-auto
        "
      >

        {/* BOTÓN CERRAR */}
        <button
          onClick={cerrarModal}
          className="
            absolute top-5 right-5 z-50
            w-11 h-11 rounded-full
            bg-white/90 hover:bg-white
            shadow-lg
            flex items-center justify-center
            text-xl font-bold
            text-[#3f2d21]
            transition-all
          "
        >
          ✕
        </button>

        {/* LADO IZQUIERDO */}
        <div className="relative h-[240px] md:min-h-full md:h-auto bg-[#f7f7f7]">

          <Image
            src={modalMaquina.imagen?.trim() ? modalMaquina.imagen : "/placeholder.jpg"}
            alt={modalMaquina.nombre}
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* TITULO SOBRE IMAGEN */}
          <div className="absolute bottom-0 left-0 p-8">
            <h2
              className="
                text-white
                text-2xl
                md:text-4xl
                font-black
                leading-tight
                drop-shadow-lg
              "
            >
              {modalMaquina.nombre}
            </h2>
          </div>
        </div>

        {/* LADO DERECHO */}
        <div className="p-5 md:p-10 overflow-y-auto">

          {/* HEADER */}
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[4px] text-gray-400">
              Renta de maquinaria
            </p>

            <h3 className="text-3xl font-black text-[#3f2d21] mt-1">
              Lista de precios
            </h3>

            <div className="w-16 h-1 bg-[#d7bea7] rounded-full mt-3" />
          </div>

          {/* PRECIOS */}
          <div className="space-y-4">

{campos.map((item) => {
  const valor = modalMaquina
    ? getPrecio(modalMaquina, item.campo)
    : "";

  return (
    <div
      key={item.label}
      className="
        flex flex-col md:flex-row
        md:items-center
        md:justify-between

        bg-gradient-to-r from-white to-[#faf6f2]
        border border-[#ead8c7]

        rounded-2xl
        px-4 md:px-5
        py-4

        hover:shadow-md hover:border-[#d7bea7]
        transition-all duration-300
        gap-3
      "
    >
      {/* LABEL */}
      <span className="font-semibold text-[#3f2d21] min-w-[100px]">
        {item.label}
      </span>

      {/* EDIT MODE */}
      {modoEdicion ? (
        <div className="flex items-center flex-1">
          <span className="mr-2 text-lg md:text-xl font-black text-[#caa789]">
            $
          </span>

          <input
            type="text"
            value={preciosEditados[item.campo]}
            onChange={(e) =>
              setPreciosEditados((prev) => ({
                ...prev,
                [item.campo]: e.target.value,
              }))
            }
            className="
              flex-1
              bg-white
              border border-[#d7bea7]

              rounded-xl
              px-4 py-2

              text-right
              font-bold
              text-[#3f2d21]

              outline-none
              focus:ring-2 focus:ring-[#d7bea7]
              focus:border-[#caa789]
            "
          />
        </div>
      ) : (
        /* VIEW MODE */
        <span className="text-xl font-black text-[#3f2d21]">
          {valor
            ? `$ ${Number(valor).toLocaleString("es-MX")}`
            : "—"}
        </span>
      )}
    </div>
  );
})}


          </div>
  {/* NOTAS IMPORTANTES */}
<div
  className="
    mt-6
    bg-gradient-to-r
    from-[#fff8f2]
    to-[#f7efe7]
    border
    border-[#ead8c7]
    rounded-[24px]
    p-5
    shadow-sm
  "
>

  {/* TITULO */}
  <div className="flex items-center gap-3 mb-4">

    <div
      className="
        w-10
        h-10
        rounded-full
        bg-[#d7bea7]
        flex
        items-center
        justify-center
        text-[#3f2d21]
        font-black
      "
    >
      !
    </div>

    <div>
      <h4 className="text-lg font-black text-[#3f2d21]">
        Notas importantes
      </h4>

      <p className="text-sm text-[#7a6a5d]">
        Información adicional sobre la renta
      </p>
    </div>
  </div>

  {/* LISTA */}
  <div className="space-y-3">

    <div
      className="
        bg-white/80
        border border-[#eadfd3]
        rounded-2xl
        px-4
        py-3
        text-[#4b3425]
        font-medium
      "
    >
      • Los precios no incluyen IVA.
    </div>

  </div>
</div>
          {/* NOTA */}
          {modalMaquina.nota && (
            <div
              className="
                mt-6 bg-[#fff7ef]
                border border-[#f0dcc5]
                rounded-2xl
                p-4
              "
            >
              <p className="text-sm text-[#6d4c36] leading-relaxed">
                {modalMaquina.nota}
              </p>
            </div>
          )}

          {modoEdicion && (
            <div className="mt-6 space-y-4">

              <div>
                <label className="block mb-2 font-semibold text-[#3f2d21]">
                  Cambiar imagen
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setImagenEditada(e.target.files[0]);
                    }
                  }}
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-[#3f2d21]">
                  Cambiar ficha PDF
                </label>

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setPdfEditado(e.target.files[0]);
                    }
                  }}
                />
              </div>

            </div>
          )}

          {/* BOTONES */}
          <div className="mt-8 flex flex-col md:flex-row gap-4">

            {/* PDF */}
            <button
              onClick={() => abrirFicha(modalMaquina.fichaPdf)}
              className="
                flex-1 bg-[#d7bea7]
                hover:bg-[#caa789]
                text-[#3f2d21]
                font-bold
                py-4 rounded-2xl
                transition-all duration-300
                shadow-md hover:shadow-xl
              "
            >
              Ver Ficha Técnica
            </button>

{modoEdicion ? (
  <>
    {/* GUARDAR */}
    <button
      onClick={guardarCambios}
      className="
        flex-1 bg-green-600
        hover:bg-green-700
        text-white
        font-bold
        py-4 rounded-2xl
        transition-all duration-300
        shadow-md hover:shadow-xl
      "
    >
      Guardar Cambios
    </button>

    {/* CANCELAR */}
    <button
      onClick={() => setModoEdicion(false)}
      className="
        flex-1 bg-gray-200
        hover:bg-gray-300
        text-[#3f2d21]
        font-bold
        py-4 rounded-2xl
        transition-all duration-300
      "
    >
      Cancelar
    </button>
  </>
) : (
  <button
    onClick={() => setModoEdicion(true)}
    className="
      flex-1 bg-[#3f2d21]
      hover:bg-[#5a3e2b]
      text-white
      font-bold
      py-4 rounded-2xl
      transition-all duration-300
      shadow-md hover:shadow-xl
    "
  >
    Editar Precios
  </button>
)}

          </div>

        </div>
      </div>
    </div>

    {/* ANIMACIONES */}
    <style>{`
      @keyframes fadeUp {
        from {
          opacity: 0;
          transform: translateY(30px) scale(0.97);
        }
        to {
          opacity: 1;
          transform: translateY(0px) scale(1);
        }
      }

      .animate-fade-up {
        animation: fadeUp 0.28s ease-out;
      }
    `}</style>
  </>
)}

{modalNuevaMaquina && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

    <div className="
      bg-white w-full max-w-2xl
      rounded-[28px]
      shadow-2xl
      p-6 md:p-8
      overflow-y-auto max-h-[90vh]
      border border-[#ead8c7]
    ">

      {/* HEADER */}
      <h2 className="text-3xl font-black mb-6 text-[#3f2d21]">
        Nueva maquinaria
      </h2>

      {/* NOMBRE */}
      <input
        className="
          w-full mb-4
          bg-[#faf6f2]
          border border-[#ead8c7]
          rounded-2xl
          px-4 py-3
          text-[#3f2d21]
          font-medium
          outline-none
          focus:ring-2 focus:ring-[#d7bea7]
        "
        placeholder="Nombre de la máquina"
        value={nuevaMaquina.nombre}
        onChange={(e) =>
          setNuevaMaquina({ ...nuevaMaquina, nombre: e.target.value })
        }
      />

      {/* NOTA */}
      <textarea
        className="
          w-full mb-4
          bg-[#faf6f2]
          border border-[#ead8c7]
          rounded-2xl
          px-4 py-3
          text-[#3f2d21]
          font-medium
          outline-none
          focus:ring-2 focus:ring-[#d7bea7]
          resize-none
          min-h-[90px]
        "
        placeholder="Nota (opcional)"
        value={nuevaMaquina.nota}
        onChange={(e) =>
          setNuevaMaquina({ ...nuevaMaquina, nota: e.target.value })
        }
      />

      {/* PRECIOS GRID */}
      <div className="grid grid-cols-2 gap-3 mb-5">

        {[
          ["Día", "precio_dia"],
          ["Semana", "precio_semana"],
          ["Quincena", "precio_quincena"],
          ["Mes", "precio_mes"],
          ["Viaje", "precio_viaje"],
          ["Arrastre", "precio_arrastre"],
        ].map(([label, key]) => (
          <input
            key={key}
            className="
              bg-[#faf6f2]
              border border-[#ead8c7]
              rounded-xl
              px-3 py-2
              text-[#3f2d21]
              font-medium
              outline-none
              focus:ring-2 focus:ring-[#d7bea7]
            "
            placeholder={label}
            onChange={(e) =>
              setNuevaMaquina({
                ...nuevaMaquina,
                [key]: e.target.value,
              })
            }
          />
        ))}

      </div>

      {/* UPLOADS */}
      <div className="space-y-4">

        <div>
          <label className="block mb-2 font-semibold text-[#3f2d21]">
            Imagen principal
          </label>
          <input
            type="file"
            accept="image/*"
            className="
              w-full
              text-sm
              text-[#3f2d21]
              file:mr-4
              file:px-4
              file:py-2
              file:rounded-xl
              file:border-0
              file:font-semibold
              file:bg-[#d7bea7]
              file:text-[#3f2d21]
              hover:file:bg-[#caa789]
              file:cursor-pointer
              cursor-pointer
            "
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setImagenPrincipal(e.target.files[0]);
              }
            }}
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-[#3f2d21]">
            Imágenes extra
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            className="
              w-full
              text-sm
              text-[#3f2d21]
              file:mr-4
              file:px-4
              file:py-2
              file:rounded-xl
              file:border-0
              file:font-semibold
              file:bg-[#d7bea7]
              file:text-[#3f2d21]
              hover:file:bg-[#caa789]
              file:cursor-pointer
              cursor-pointer
            "
            onChange={(e) => {
              if (e.target.files) {
                setImagenesGaleria(Array.from(e.target.files));
              }
            }}
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-[#3f2d21]">
            Ficha PDF
          </label>
          <input
            type="file"
            accept="application/pdf"
            className="
              w-full
              text-sm
              text-[#3f2d21]
              file:mr-4
              file:px-4
              file:py-2
              file:rounded-xl
              file:border-0
              file:font-semibold
              file:bg-[#d7bea7]
              file:text-[#3f2d21]
              hover:file:bg-[#caa789]
              file:cursor-pointer
              cursor-pointer
            "
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setPdf(e.target.files[0]);
              }
            }}
          />
        </div>
      </div>

      {/* BOTONES */}
      <div className="flex gap-3 mt-6">

        <button
          onClick={crearMaquina}
          className="
            flex-1
            bg-[#3f2d21]
            hover:bg-[#5a3e2b]
            text-white
            font-bold
            py-3 rounded-2xl
            transition-all
            shadow-md hover:shadow-xl
          "
        >
          Guardar maquinaria
        </button>

        <button
          onClick={() => setModalNuevaMaquina(false)}
          className="
            flex-1
            bg-[#f3f3f3]
            hover:bg-[#e7e7e7]
            text-[#3f2d21]
            font-bold
            py-3 rounded-2xl
          "
        >
          Cancelar
        </button>

      </div>

    </div>
  </div>
)}
    </div>
    
  );
}
