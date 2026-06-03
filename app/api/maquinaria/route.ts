import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* ───────────────────────────────
   SUPABASE CLIENT
────────────────────────────── */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ───────────────────────────────
   GET MAQUINARIA
────────────────────────────── */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("maquinaria")
      .select("*")
      .eq("activo", true);

    console.log("INSERT ERROR:", error);

    if (error) {
      console.error("SUPABASE ERROR:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const maquinaria = (data || []).map((item) => ({
      id: item.id,
      nombre: item.nombre,
      imagen: item.imagen?.trim()
  ? item.imagen
  : "/placeholder.jpg",
      fichaPdf: item.ficha_pdf || "",
      nota: item.nota || "",

      precio_dia: item.precio_dia || "",
      precio_semana: item.precio_semana || "",
      precio_quincena: item.precio_quincena || "",
      precio_mes: item.precio_mes || "",
      precio_viaje: item.precio_viaje || "",
      precio_arrastre: item.precio_arrastre || "",
    }));

    return NextResponse.json(maquinaria);

  } catch (err) {
    console.error("ERROR API:", err);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

/* ───────────────────────────────
+-p
POST MAQUINARIA
────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const nombre = formData.get("nombre")?.toString() || "";
    const nota = formData.get("nota")?.toString() || "";

const safeNumber = (value: FormDataEntryValue | null) => {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
};

const precio_dia = safeNumber(formData.get("precio_dia"));
const precio_semana = safeNumber(formData.get("precio_semana"));
const precio_quincena = safeNumber(formData.get("precio_quincena"));
const precio_mes = safeNumber(formData.get("precio_mes"));
const precio_viaje = safeNumber(formData.get("precio_viaje"));
const precio_arrastre = safeNumber(formData.get("precio_arrastre"));

    if (!nombre) {
      return NextResponse.json(
        { error: "Nombre requerido" },
        { status: 400 }
      );
    }

    const imagenPrincipal = formData.get("imagenPrincipal") as File | null;
const pdf = formData.get("pdf") as File | null;

let imagenUrl = "";
let pdfUrl = "";

/* SUBIR IMAGEN */
if (imagenPrincipal) {
  const extension = imagenPrincipal.name.split(".").pop();

  const nombreImagen = `maquina-${Date.now()}.${extension}`;

  const { error: imageError } = await supabase.storage
    .from("maquinaria")
    .upload(nombreImagen, imagenPrincipal, {
      upsert: true,
    });

console.log("IMAGE ERROR:", imageError);

if (imageError) {
  console.error(imageError);

    return NextResponse.json(
      { error: imageError.message },
      { status: 500 }
    );
  }

  const { data } = supabase.storage
    .from("maquinaria")
    .getPublicUrl(nombreImagen);

  imagenUrl = data.publicUrl;
}

/* SUBIR PDF */
if (pdf) {
  const extension = pdf.name.split(".").pop();

  const nombrePdf = `ficha-${Date.now()}.${extension}`;

  const { error: pdfError } = await supabase.storage
    .from("maquinaria")
    .upload(nombrePdf, pdf, {
      upsert: true,
    });

  if (pdfError) {
    console.error(pdfError);

    return NextResponse.json(
      { error: pdfError.message },
      { status: 500 }
    );
  }

  const { data } = supabase.storage
    .from("maquinaria")
    .getPublicUrl(nombrePdf);

  pdfUrl = data.publicUrl;
}

    const { data, error } = await supabase
      .from("maquinaria")
  .insert([
    {
      nombre,
      nota,
      precio_dia,
      precio_semana,
      precio_quincena,
      precio_mes,
      precio_viaje,
      precio_arrastre,
      activo: true,
      imagen: imagenUrl,
      ficha_pdf: pdfUrl,
    },
  ])
  .select()
  .single();

    if (error) {
      console.error("SUPABASE ERROR:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (err: any) {
    console.error("POST ERROR:", err);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}