"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Menu, X, Search, ChevronRight } from "lucide-react";
import {useRouter} from "next/navigation";
import { searchProducts } from "@/app/lib/supabase";
import { useEffect } from "react";
import { usePathname } from "next/navigation";


type MenuItem = {
  name: string;
  link?: string;
  slug?: string;
};

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

type Product = {
  id: number;
  nombre: string;
  slug: string;
  marca?: string;
  pagina: string;
};

const [suggestions, setSuggestions] = useState<Product[]>([]);

  const [search,setSearch] = useState("");

  const pathname = usePathname();
  useEffect(() => {
  setOpen(false);
  setActiveMenu(null);
}, [pathname]);

  const router = useRouter()

useEffect(() => {
  const controller = new AbortController();

  const delay = setTimeout(async () => {
    const q = search.trim();

    if (q.length <= 1) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await searchProducts(q).catch(() => []);

      if (!Array.isArray(res)) {
        setSuggestions([]);
        return;
      }

      setSuggestions(
        Array.isArray(res)
          ? res.filter((p) => p?.pagina && p?.nombre)
          : []
      );
    } catch {
      setSuggestions([]);
    }
  }, 300);

  return () => {
    clearTimeout(delay);
    controller.abort();
  };
}, [search]);

const openMenu = (menu: string) => {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }

  setActiveMenu(menu);
};

const closeMenu = () => {
  timeoutRef.current = setTimeout(() => {
    setActiveMenu(null);
  }, 200);
};

  /* CATEGORÍAS */

  const menuItems: {
    materiales: MenuItem[];
    rentaMaquinaria: MenuItem[];
    lineaBlanca: MenuItem[];
    electricidad: MenuItem[];
    concretera: MenuItem[];

  } = {
    rentaMaquinaria: [
      {
        name: "Todas las máquinas",
        link: "/admin/maquinaria",
      },
    ],

    materiales: [
      {
        name: "Aceros",
        link: "/admin/aceros",
      },
      {
        name: "Polvos",
        link: "/admin/polvos",
      },
      {
        name: "Block",
        link: "/admin/block",
      },
      {
        name: "Agregados",
        link: "/admin/agregados",
      },
    ],

lineaBlanca: [
  { name: "Ver todos los productos", slug: "todos" },

  { name: "Refrigeradores", slug: "refrigeradores" },
  { name: "Congeladores", slug: "congeladores" },
  { name: "Colchones", slug: "colchones" },
  { name: "Refacciones", slug: "refacciones" },
  { name: "Luminaria", slug: "luminaria" },

  { name: "Bomba de vacío", slug: "bomba-de-vacio" },
  { name: "Escaleras", slug: "escaleras" },
  { name: "Aires Acondicionados", slug: "aires-acondicionados" },

  { name: "Cámaras de seguridad", slug: "camara-de-seguridad" },
  { name: "Tabletas", slug: "tabletas" },
  { name: "Ventiladores", slug: "ventiladores" },

  { name: "Controles Remoto", slug: "control-remoto" },
  { name: "Parrillas", slug: "parrillas" },
  { name: "Lavadoras", slug: "lavadoras" },

  { name: "Pantallas", slug: "pantallas" },
  { name: "Audífonos", slug: "audifonos" },
  { name: "Purificadores de Aire", slug: "purificadores-de-aire" },

  { name: "Frigobar", slug: "frigobar" },
  { name: "Bocinas", slug: "bocinas" },
  {name: "Estufas" , slug: "estufas"},
  {name: "Campanas" , slug: "campanas"},
  {name: "Horno", slug: "hornos"},

  { name: "Dispensadores de Agua", slug: "dispensadores-de-agua" },
  { name: "Boiler Electrico", slug: "boiler-electrico" }
],
electricidad: [
  {
    name: "Ver todo",
    link: "/admin/electricidad",
  },
],
concretera: [
  {
    name: "Servicios",
    link: "/admin/concretera",
  },
],

  };

  return (
    <header
      className="
        fixed top-0 left-0 w-full z-50
        bg-white/70
        backdrop-blur-xl
        border-b border-white/20
        shadow-[0_8px_30px_rgba(0,0,0,0.06)]
      "
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* DESKTOP */}
        <div className="hidden md:flex items-center justify-between gap-8">
          {/* NAV */}
          <nav className="flex items-center gap-3">
            <Link
              href="/"
              className="
                px-5 py-3 rounded-2xl
                text-gray-800 font-medium
                hover:bg-black
                hover:text-white
                transition-all duration-300
              "
            >
              Inicio
            </Link>

            <Link
              href="#nosotros"
              className="
                px-5 py-3 rounded-2xl
                text-gray-800 font-medium
                hover:bg-black
                hover:text-white
                transition-all duration-300
              "
            >
              Nosotros
            </Link>

            {/* MATERIALES */}
            <div
              className="relative"
              onMouseEnter={() => openMenu("materiales")}
              onMouseLeave={closeMenu}
            >
              <button
                className="
                  px-5 py-3 rounded-2xl
                  text-gray-800 font-medium
                  hover:bg-black
                  hover:text-white
                  transition-all duration-300
                "
              >
                Materiales
              </button>

              {activeMenu === "materiales" && (
                <div
                  className="
                    absolute top-[78px] left-1/2
                    -translate-x-1/2
                    w-[500px]
                    bg-white/95
                    backdrop-blur-xl
                    rounded-3xl
                    shadow-[0_15px_60px_rgba(0,0,0,0.12)]
                    border border-gray-100
                    p-6
                    animate-in fade-in zoom-in-95 duration-200
                  "
                >
                  <div className="mb-5">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Materiales
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Explora categorías disponibles
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {menuItems.materiales.map((item) => (
                      <Link
                        key={item.name}
                        href={item.link!}
                        className="
                          group
                          p-4 rounded-2xl
                          bg-gray-50
                          hover:bg-orange-50
                          border border-transparent
                          hover:border-orange-100
                          transition-all duration-300
                        "
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-800">
                            {item.name}
                          </p>

                          <ChevronRight
                            size={18}
                            className="
                              text-gray-400
                              group-hover:text-orange-500
                              transition-all
                            "
                          />
                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                          Ver productos
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* MAQUINARIA */}
            <div
              className="relative"
              onMouseEnter={() => openMenu("rentaMaquinaria")}
              onMouseLeave={closeMenu}
            >
              <button
                className="
                  px-5 py-3 rounded-2xl
                  text-gray-800 font-medium
                  hover:bg-black
                  hover:text-white
                  transition-all duration-300
                "
              >
                Renta de Maquinaria
              </button>

              {activeMenu === "rentaMaquinaria" && (
                <div
                  className="
                    absolute top-[78px] left-1/2
                    -translate-x-1/2
                    w-[650px]
                    bg-white/95
                    backdrop-blur-xl
                    rounded-3xl
                    shadow-[0_15px_60px_rgba(0,0,0,0.12)]
                    border border-gray-100
                    p-6
                    animate-in fade-in zoom-in-95 duration-200
                  "
                >
                  <div className="mb-5">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Maquinaria
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Equipo para construcción y transporte
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {menuItems.rentaMaquinaria.map((item) => (
                      <Link
                        key={item.name}
                        href={item.link!}
                        className="
                          group
                          p-4 rounded-2xl
                          bg-gray-50
                          hover:bg-orange-50
                          border border-transparent
                          hover:border-orange-100
                          transition-all duration-300
                        "
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-800">
                            {item.name}
                          </p>

                          <ChevronRight
                            size={18}
                            className="
                              text-gray-400
                              group-hover:text-orange-500
                              transition-all
                            "
                          />
                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                          Ver maquinaria
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* LINEA BLANCA */}
            <div
              className="relative"
              onMouseEnter={() => openMenu("lineablanca")}
              onMouseLeave={closeMenu}
            >
              <button
                className="
                  px-5 py-3 rounded-2xl
                  text-gray-800 font-medium
                  hover:bg-black
                  hover:text-white
                  transition-all duration-300
                "
              >
                Línea Blanca
              </button>

              {activeMenu === "lineablanca" && (
                <div
                  className="
                    absolute top-[78px] left-1/2
                    -translate-x-1/2
                    w-[700px]
                    bg-white/95
                    backdrop-blur-xl
                    rounded-3xl
                    shadow-[0_15px_60px_rgba(0,0,0,0.12)]
                    border border-gray-100
                    p-6
                    animate-in fade-in zoom-in-95 duration-200
                  "
                >
                  <div className="mb-5">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Línea Blanca
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Productos para hogar y oficina
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-2">
                    {menuItems.lineaBlanca.map((item) => (
                      <Link
                        key={item.name}
                        href={`/admin/productos/${item.slug}`}
                        className="
                          group
                          p-4 rounded-2xl
                          bg-gray-50
                          hover:bg-orange-50
                          border border-transparent
                          hover:border-orange-100
                          transition-all duration-300
                        "
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-800">
                            {item.name}
                          </p>

                          <ChevronRight
                            size={18}
                            className="
                              text-gray-400
                              group-hover:text-orange-500
                              transition-all
                            "
                          />
                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                          Ver productos
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* ELECTRICIDAD */}
<div
  className="relative"
  onMouseEnter={() => openMenu("electricidad")}
  onMouseLeave={closeMenu}
>
  <button
    className="
      px-5 py-3 rounded-2xl
      text-gray-800 font-medium
      hover:bg-black
      hover:text-white
      transition-all duration-300
    "
  >
    Electricidad
  </button>

  {activeMenu === "electricidad" && (
    <div
      className="
        absolute top-[78px] left-1/2
        -translate-x-1/2
        w-[550px]
        bg-white/95
        backdrop-blur-xl
        rounded-3xl
        shadow-[0_15px_60px_rgba(0,0,0,0.12)]
        border border-gray-100
        p-6
        animate-in fade-in zoom-in-95 duration-200
      "
    >
      <div className="mb-5">
        <h3 className="text-2xl font-bold text-gray-900">
          Electricidad
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Servicios y proyectos eléctricos
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {menuItems.electricidad.map((item) => (
          <Link
            key={item.name}
            href={item.link!}
            className="
              group
              p-4 rounded-2xl
              bg-gray-50
              hover:bg-orange-50
              border border-transparent
              hover:border-orange-100
              transition-all duration-300
            "
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-800">
                {item.name}
              </p>

              <ChevronRight
                size={18}
                className="
                  text-gray-400
                  group-hover:text-orange-500
                  transition-all
                "
              />
            </div>

            <p className="text-sm text-gray-500 mt-1">
              Ver información
            </p>
          </Link>
        ))}
      </div>
    </div>
  )}
</div>

{/* CONCRETERA */}
<div
  className="relative"
  onMouseEnter={() => openMenu("concretera")}
  onMouseLeave={closeMenu}
>
  <button
    className="
      px-5 py-3 rounded-2xl
      text-gray-800 font-medium
      hover:bg-black
      hover:text-white
      transition-all duration-300
    "
  >
    Concretera
  </button>

  {activeMenu === "concretera" && (
    <div
      className="
        absolute top-[78px] left-1/2
        -translate-x-1/2
        w-[450px]
        bg-white/95
        backdrop-blur-xl
        rounded-3xl
        shadow-[0_15px_60px_rgba(0,0,0,0.12)]
        border border-gray-100
        p-6
        animate-in fade-in zoom-in-95 duration-200
      "
    >
      <div className="mb-5">
        <h3 className="text-2xl font-bold text-gray-900">
          Concretera
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Servicios de concreto y construcción
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {menuItems.concretera.map((item) => (
          <Link
            key={item.name}
            href={item.link!}
            className="
              group
              p-4 rounded-2xl
              bg-gray-50
              hover:bg-orange-50
              border border-transparent
              hover:border-orange-100
              transition-all duration-300
            "
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-800">
                {item.name}
              </p>

              <ChevronRight
                size={18}
                className="
                  text-gray-400
                  group-hover:text-orange-500
                  transition-all
                "
              />
            </div>

            <p className="text-sm text-gray-500 mt-1">
              Ver servicios
            </p>
          </Link>
        ))}
      </div>
    </div>
  )}
</div>
          </nav>

          {/* BUSCADOR */}
          <div
            className="
              relative
              bg-white/80
              backdrop-blur-xl
              w-[420px]
              h-[58px]
              rounded-2xl
              border border-gray-200
              shadow-lg
              flex items-center
              px-5
              focus-within:ring-2
              focus-within:ring-orange-400
              transition-all
            "
          >
            <Search size={22} className="text-gray-400" />

<input
  type="text"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
onKeyDown={async (e) => {
  if (e.key === "Enter" && search.trim()) {
    const res = await searchProducts(search);

    const first = res?.[0];

    setSuggestions([]);

if (first?.pagina) {
  router.push(`${first.pagina}#producto-${first.id}`);
} else {
  router.push(`/search?q=${encodeURIComponent(search)}`);
}
  }
}}
  placeholder="Buscar maquinaria, materiales..."
  className="
    bg-transparent
    outline-none
    ml-4
    w-full
    text-gray-800
    placeholder:text-gray-400
  "
          />
{suggestions.length > 0 && (
  <div
    className="
      absolute
      top-[70px]
      left-0
      w-full
      bg-white
      border
      border-gray-200
      rounded-2xl
      shadow-2xl
      overflow-hidden
      z-50
    "
  >
    {suggestions.map((p) => (
      <Link
        key={p.id}
        href={`${p.pagina}#producto-${p.id}`}
        className="
          flex items-center gap-3
          p-4
          hover:bg-gray-100
          transition-colors
        "
        onClick={() => setSuggestions([])}
      >
        <div>
          <p className="font-medium text-gray-800">
            {p.nombre}
          </p>

          <p className="text-xs text-gray-500">
            {p.marca}
          </p>
        </div>
      </Link>
    ))}
  </div>
)}
          </div>
        </div>

        {/* MOBILE BUTTON */}
<div className="md:hidden flex items-center justify-between py-2">
  <button
    onClick={() => setOpen(!open)}
    className="
      bg-black
      text-white
      p-3
      rounded-2xl
      shadow-lg
    "
  >
    {open ? <X size={28} /> : <Menu size={28} />}
  </button>
</div>

        {/* MOBILE MENU */}
{open && (
  <div
  className="
    fixed
    top-0
    left-0
    w-full
    h-screen
    z-[9999]
    md:hidden
    bg-white
    overflow-y-auto
    px-5
    pt-24
    pb-6
    animate-in fade-in duration-200
  "
>
            {/* SEARCH */}
          <div
            className="
              relative
              bg-gray-100
              rounded-2xl
                flex items-center
                px-5
                h-[56px]
                mb-6
              "
            >
              <Search size={22} className="text-gray-400" />

            {suggestions.length > 0 && (
  <div className="absolute top-[70px] left-0 w-full bg-white rounded-2xl shadow-xl border overflow-hidden z-50">
    {suggestions.map((p) => (
      <Link
        key={p.id}
        href={`${p.pagina}#producto-${p.id}`}
        className="flex items-center gap-3 p-3 hover:bg-gray-100"
        onClick={() => setSuggestions([])}
      >
        <div>
          <p className="font-medium text-gray-800">{p.nombre}</p>
          <p className="text-xs text-gray-500">{p.marca}</p>
        </div>
      </Link>
    ))}
  </div>
)}

<input
  type="text"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
onKeyDown={async (e) => {
  if (e.key === "Enter" && search.trim()) {
    const res = await searchProducts(search);

if (res && res.length >= 1) {
  const first = res[0];

  if (first?.pagina) {
    router.push(`${first.pagina}#producto-${first.id}`);
    setSuggestions([]);
    return;
  }
}

      setSuggestions([]);

      return;
    }

    router.push(`/search?q=${encodeURIComponent(search)}`);

    setSuggestions([]);
  }
}
  placeholder="Buscar maquinaria, materiales..."
  className="bg-transparent outline-none ml-4 w-full text-gray-800"
/>
            </div>

            {/* NAV */}
{/* NAV */}
<nav className="flex flex-col gap-4 pb-10">

  <Link
    href="/#inicio"
    className="
      px-5 py-4 rounded-2xl
      bg-gray-50
      text-gray-800
      font-medium
    "
  >
    Inicio
  </Link>

  <Link
    href="#nosotros"
    className="
      px-5 py-4 rounded-2xl
      bg-gray-50
      text-gray-800
      font-medium
    "
  >
    Nosotros
  </Link>

  {/* MATERIALES */}
  <div className="bg-gray-50 rounded-2xl overflow-hidden">
    <button
      onClick={() =>
        setActiveMenu(
          activeMenu === "materiales"
            ? null
            : "materiales"
        )
      }
      className="
        w-full
        flex
        items-center
        justify-between
        px-5
        py-4
        font-medium
        text-gray-800
      "
    >
      Materiales
      <ChevronRight
        className={`transition-transform ${
          activeMenu === "materiales"
            ? "rotate-90"
            : ""
        }`}
      />
    </button>

    {activeMenu === "materiales" && (
      <div className="px-3 pb-3 flex flex-col gap-2">
        {menuItems.materiales.map((item) => (
          <Link
            key={item.name}
            href={item.link!}
            className="
              bg-white
              rounded-xl
              px-4
              py-3
              text-sm
              text-gray-700
            "
          >
            {item.name}
          </Link>
        ))}
      </div>
    )}
  </div>

  {/* MAQUINARIA */}
  <div className="bg-gray-50 rounded-2xl overflow-hidden">
    <button
      onClick={() =>
        setActiveMenu(
          activeMenu === "rentaMaquinaria"
            ? null
            : "rentaMaquinaria"
        )
      }
      className="
        w-full
        flex
        items-center
        justify-between
        px-5
        py-4
        font-medium
        text-gray-800
      "
    >
      Renta de Maquinaria
      <ChevronRight
        className={`transition-transform ${
          activeMenu === "rentaMaquinaria"
            ? "rotate-90"
            : ""
        }`}
      />
    </button>

    {activeMenu === "rentaMaquinaria" && (
      <div className="px-3 pb-3 flex flex-col gap-2">
        {menuItems.rentaMaquinaria.map((item) => (
          <Link
            key={item.name}
            href={item.link!}
            className="
              bg-white
              rounded-xl
              px-4
              py-3
              text-sm
              text-gray-700
            "
          >
            {item.name}
          </Link>
        ))}
      </div>
    )}
  </div>

  {/* LINEA BLANCA */}
  <div className="bg-gray-50 rounded-2xl overflow-hidden">
    <button
      onClick={() =>
        setActiveMenu(
          activeMenu === "lineablanca"
            ? null
            : "lineablanca"
        )
      }
      className="
        w-full
        flex
        items-center
        justify-between
        px-5
        py-4
        font-medium
        text-gray-800
      "
    >
      Línea Blanca
      <ChevronRight
        className={`transition-transform ${
          activeMenu === "lineablanca"
            ? "rotate-90"
            : ""
        }`}
      />
    </button>

    {activeMenu === "lineablanca" && (
      <div className="px-3 pb-3 flex flex-col gap-2 max-h-[350px] overflow-y-auto">
        {menuItems.lineaBlanca.map((item) => (
          <Link
            key={item.name}
            href={`/admin/productos/${item.slug}`}
            className="
              bg-white
              rounded-xl
              px-4
              py-3
              text-sm
              text-gray-700
            "
          >
            {item.name}
          </Link>
        ))}
      </div>
    )}
  </div>

  {/* ELECTRICIDAD */}
  <div className="bg-gray-50 rounded-2xl overflow-hidden">
    <button
      onClick={() =>
        setActiveMenu(
          activeMenu === "electricidad"
            ? null
            : "electricidad"
        )
      }
      className="
        w-full
        flex
        items-center
        justify-between
        px-5
        py-4
        font-medium
        text-gray-800
      "
    >
      Electricidad
      <ChevronRight
        className={`transition-transform ${
          activeMenu === "electricidad"
            ? "rotate-90"
            : ""
        }`}
      />
    </button>

    {activeMenu === "electricidad" && (
      <div className="px-3 pb-3 flex flex-col gap-2">
        {menuItems.electricidad.map((item) => (
          <Link
            key={item.name}
            href={item.link!}
            className="
              bg-white
              rounded-xl
              px-4
              py-3
              text-sm
              text-gray-700
            "
          >
            {item.name}
          </Link>
        ))}
      </div>
    )}
  </div>

  {/* CONCRETERA */}
  <div className="bg-gray-50 rounded-2xl overflow-hidden">
    <button
      onClick={() =>
        setActiveMenu(
          activeMenu === "concretera"
            ? null
            : "concretera"
        )
      }
      className="
        w-full
        flex
        items-center
        justify-between
        px-5
        py-4
        font-medium
        text-gray-800
      "
    >
      Concretera
      <ChevronRight
        className={`transition-transform ${
          activeMenu === "concretera"
            ? "rotate-90"
            : ""
        }`}
      />
    </button>

    {activeMenu === "concretera" && (
      <div className="px-3 pb-3 flex flex-col gap-2">
        {menuItems.concretera.map((item) => (
          <Link
            key={item.name}
            href={item.link!}
            className="
              bg-white
              rounded-xl
              px-4
              py-3
              text-sm
              text-gray-700
            "
          >
            {item.name}
          </Link>
        ))}
      </div>
    )}
  </div>
</nav>
          </div>
        )}
      </div>
    </header>
  );
}