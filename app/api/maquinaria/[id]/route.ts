import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { id } = await params;

    const formData = await req.formData();

    const precio_dia = formData.get("precio_dia");
    const precio_semana = formData.get("precio_semana");
    const precio_quincena = formData.get("precio_quincena");
    const precio_mes = formData.get("precio_mes");
    const precio_viaje = formData.get("precio_viaje");
    const precio_arrastre = formData.get("precio_arrastre");

    // Por ahora solo los recibimos
    const imagen = formData.get("imagen") as File | null;
    const pdf = formData.get("pdf") as File | null;

    console.log("Imagen:", imagen?.name);
    console.log("PDF:", pdf?.name);

    const { data, error } = await supabase
      .from("maquinaria")
      .update({
        precio_dia: precio_dia ? Number(precio_dia) : null,
        precio_semana: precio_semana ? Number(precio_semana) : null,
        precio_quincena: precio_quincena ? Number(precio_quincena) : null,
        precio_mes: precio_mes ? Number(precio_mes) : null,
        precio_viaje: precio_viaje ? Number(precio_viaje) : null,
        precio_arrastre: precio_arrastre
          ? Number(precio_arrastre)
          : null,
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error(error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { id } = await params;

    const { error } = await supabase
      .from("maquinaria")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Registro eliminado correctamente",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}