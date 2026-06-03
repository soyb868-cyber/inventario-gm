"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/app/lib/supabase";

import SearchBar from "@/app/components/SearchBar";
import ProductTable from "@/app/components/ProductTable";

type Producto = {
  id: number;
  nombre: string;
  codigo: string;
  stock: number;
  precio: number;
};

export default function InventarioPage() {

  const [productos, setProductos] = useState<Producto[]>([]);
  const [search, setSearch] = useState("");

useEffect(() => {
  const cached = localStorage.getItem("productos");

  if (cached) {
    setProductos(JSON.parse(cached));
  }

  const fetchProductos = async () => {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error Supabase:", error.message);
      return;
    }

    if (data) {
      setProductos(data);
      localStorage.setItem("productos", JSON.stringify(data));
    }
  };

  if (navigator.onLine) {
    fetchProductos();
  }
}, []);

  const filtered = productos.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Inventario
          </h1>

          <p className="text-gray-500 mt-1">
            Administración de productos y stock
          </p>
        </div>

        <button
          className="
            bg-sky-600
            hover:bg-sky-700
            text-white
            px-5
            py-3
            rounded-xl
            text-sm
            font-medium
          "
        >
          Nuevo producto
        </button>

      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
      />

      <ProductTable productos={filtered} />

    </div>
  );
}