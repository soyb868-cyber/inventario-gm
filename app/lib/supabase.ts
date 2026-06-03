import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://amnknmanabcachdnntfr.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbmtubWFuYWJjYWNoZG5udGZyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTE0MjUwNiwiZXhwIjoyMDk0NzE4NTA2fQ.G5BeTNB3RLVOyir0F57zQwwkTLOlg2PWLm3V1RMND1k";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

export async function searchProducts(query: string) {
  const { data, error } = await supabase
    .from("productos")
    .select("id, nombre, slug, marca, pagina")
    .ilike("nombre", `%${query}%`)
    .not("slug", "is", null)
    .limit(8);

  if (error) {
    console.error("Error buscando productos:", error);
    return [];
  }

  return (data || []).filter(
    (p) => p.slug && p.slug.trim() !== ""
  );
}