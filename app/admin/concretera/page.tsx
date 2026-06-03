"use client";

import Image from "next/image";
import {
  Truck,
  HardHat,
  Droplets,
  Shovel,
  Building2,
  BadgeCheck,
} from "lucide-react";

export default function ConcreteraPage() {
  return (
    <main className="bg-[#f5f5f5] text-[#1f1f1f] overflow-hidden">
      {/* HERO */}
      <section className="relative h-[500px] w-full">
        <Image
          src="/concretera/heroe.jpeg"
          alt="Servicio de Concretera"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <div className="max-w-3xl text-center text-white">
            <h1 className="mb-4 text-4xl font-bold md:text-6xl">
              Servicio de Concretera
            </h1>

            <p className="mb-6 text-lg text-gray-200 md:text-xl">
              Concreto preparado directamente en su obra
            </p>

            <p className="mb-8 text-sm text-gray-300 md:text-base">
              Atención para obras privadas y públicas en Dolores Hidalgo y
              municipios cercanos.
            </p>

          </div>
        </div>
      </section>

      {/* QUE OFRECEMOS */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 py-24 md:grid-cols-2">
        {/* IMAGEN */}
        <div className="relative h-[350px] overflow-hidden rounded-3xl shadow-2xl">
          <Image
            src="/concretera/ofrecemos.jpg"
            alt="Concretera"
            fill
            className="object-cover"
          />
        </div>

        {/* TEXTO */}
        <div className="flex flex-col justify-center">
          <span className="mb-3 text-sm font-semibold uppercase tracking-[4px] text-[#c9b39a]">
            ¿Qué ofrecemos?
          </span>

          <h2 className="mb-6 text-4xl font-bold">
            Soluciones eficientes para construcción
          </h2>

          <p className="text-lg leading-relaxed text-gray-700">
            Llevamos el equipo, operador y materiales necesarios para elaborar
            concreto directamente en el sitio del proyecto, ofreciendo una
            solución práctica, eficiente y profesional para distintos tipos de
            construcción.
          </p>
        </div>
      </section>

      {/* INCLUYE */}
      <section className="bg-[#ececec] py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-2">
          {/* IZQUIERDA */}
          <div>
            <span className="mb-3 block text-sm font-semibold uppercase tracking-[4px] text-[#c9b39a]">
              ¿Qué incluye el servicio?
            </span>

            <h2 className="mb-10 text-4xl font-bold">
              Todo lo necesario para tu obra
            </h2>

            <div className="space-y-5">
              <ServiceItem
                icon={<Truck size={22} />}
                text="Máquina concretera"
              />

              <ServiceItem
                icon={<HardHat size={22} />}
                text="Operador capacitado"
              />

              <ServiceItem
                icon={<Shovel size={22} />}
                text="Arena y grava"
              />

              <ServiceItem
                icon={<Building2 size={22} />}
                text="Cemento"
              />

              <ServiceItem
                icon={<Droplets size={22} />}
                text="Agua para mezcla"
              />

              <ServiceItem
                icon={<BadgeCheck size={22} />}
                text="Atención en obra"
              />
            </div>
          </div>

          {/* DERECHA */}
          <div className="relative h-[450px] overflow-hidden rounded-[35px] shadow-[20px_20px_0px_rgba(0,0,0,0.15)]">
            <Image
              src="/concretera/obra.jpg"
              alt="Obra"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* VENTAJAS */}
      <section className="bg-[#f5f5f5] py-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* TITULO */}
          <div className="mb-16 text-center">
            <span className="mb-3 block text-sm font-semibold uppercase tracking-[4px] text-[#c9b39a]">
              Ventajas
            </span>

            <h2 className="text-4xl font-bold">
              Beneficios de nuestro servicio
            </h2>
          </div>

          {/* CONTENIDO */}
          <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
            {/* IMAGEN */}
            <div className="relative h-[450px] overflow-hidden rounded-[35px] shadow-[20px_20px_0px_rgba(0,0,0,0.15)]">
              <Image
                src="/concretera/ventajas.jpg"
                alt="Ventajas concretera"
                fill
                className="object-cover"
              />


            </div>

            {/* LISTA */}
            <div className="space-y-6">
              <VentajaItem text="Mezcla realizada directamente en obra" />

              <VentajaItem text="Mayor practicidad y rapidez" />

              <VentajaItem text="Reducción de desperdicio" />

              <VentajaItem text="Atención para proyectos pequeños y grandes" />

              <VentajaItem text="Servicio adaptable a diferentes necesidades" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ITEMS SERVICIO */
function ServiceItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex w-fit items-center gap-4 rounded-full bg-white px-6 py-4 shadow-lg transition hover:translate-x-2 hover:shadow-2xl">
      <div className="text-[#c9b39a]">{icon}</div>

      <span className="font-medium">{text}</span>
    </div>
  );
}

/* ITEMS VENTAJAS */
function VentajaItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-lg transition hover:translate-x-2 hover:shadow-2xl">
      <div className="h-3 w-3 rounded-full bg-[#c9b39a]" />

      <p className="text-lg font-medium text-gray-700">{text}</p>
    </div>
  );
}