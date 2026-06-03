"use client";

import Image from "next/image";
import {
  Bolt,
  Lightbulb,
  ShieldCheck,
  Wrench,
} from "lucide-react";

export default function ElectricidadPage() {
  return (
    <div className="bg-[#efefef] min-h-screen">

      {/* HERO */}
      <section className="relative w-full h-[320px] overflow-hidden">
        <Image
          src="/electricidad/banner.jpeg"
          alt="Electricidad"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 flex items-center justify-center">
          <h1
            className="
              text-white
              text-5xl
              md:text-7xl
              font-black
              tracking-wide
              drop-shadow-2xl
            "
          >
            Electricidad
          </h1>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        {/* TITULO */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div
            className="
              inline-flex
              items-center
              gap-3
              bg-yellow-100
              text-yellow-800
              px-6
              py-3
              rounded-full
              font-bold
              mb-6
            "
          >
            <Bolt size={22} />
            Instalaciones Eléctricas
          </div>

          <h2
            className="
              text-4xl
              md:text-5xl
              font-black
              text-[#2d2d2d]
              mb-6
            "
          >
            Diseño e instalación profesional
          </h2>

          <p
            className="
              text-xl
              text-gray-600
              leading-relaxed
            "
          >
            Diseñamos, instalamos y damos mantenimiento
            a sistemas eléctricos residenciales,
            comerciales e industriales con seguridad,
            eficiencia y tecnología moderna.
          </p>
        </div>

        {/* SECCIÓN CENTRAL */}
        <div
          className="
            grid
            md:grid-cols-3
            gap-10
            items-center
            mb-24
          "
        >

          {/* TEXTO IZQUIERDA */}
          <div
            className="
              bg-white
              rounded-[35px]
              p-10
              shadow-xl
              text-center
            "
          >
            <div
              className="
                w-16
                h-16
                rounded-full
                bg-yellow-100
                flex
                items-center
                justify-center
                mx-auto
                mb-6
              "
            >
              <Lightbulb
                size={30}
                className="text-yellow-600"
              />
            </div>

            <h3
              className="
                text-3xl
                font-black
                text-[#2d2d2d]
                mb-5
              "
            >
              Diseño de Sistemas
            </h3>

            <p
              className="
                text-gray-600
                text-lg
                leading-relaxed
              "
            >
              Analizamos la demanda energética y el
              tipo de inmueble para crear sistemas
              eficientes, seguros y preparados para
              crecimiento futuro.
            </p>
          </div>

          {/* IMAGEN CENTRAL */}
          <div
            className="
              relative
              h-[520px]
              rounded-[40px]
              overflow-hidden
              shadow-2xl
            "
          >
            <Image
              src="/electricidad/rayo.jpeg"
              alt="Electricidad"
              fill
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* TEXTO DERECHA */}
          <div
            className="
              bg-white
              rounded-[35px]
              p-10
              shadow-xl
              text-center
            "
          >
            <div
              className="
                w-16
                h-16
                rounded-full
                bg-green-100
                flex
                items-center
                justify-center
                mx-auto
                mb-6
              "
            >
              <ShieldCheck
                size={30}
                className="text-green-600"
              />
            </div>

            <h3
              className="
                text-3xl
                font-black
                text-[#2d2d2d]
                mb-5
              "
            >
              Instalación Segura
            </h3>

            <p
              className="
                text-gray-600
                text-lg
                leading-relaxed
              "
            >
              Cada conexión, canalización y tablero
              se instala con precisión para reducir
              riesgos, fallas y sobrecargas.
            </p>
          </div>
        </div>

        {/* IMAGEN GRANDE */}
        <div
          className="
            relative
            w-full
            h-[500px]
            rounded-[45px]
            overflow-hidden
            shadow-2xl
            mb-20
          "
        >
          <Image
            src="/electricidad/foco.jpg"
            alt="Instalaciones eléctricas"
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/30" />

          <div
            className="
              absolute
              inset-0
              flex
              flex-col
              items-center
              justify-center
              text-center
              px-6
            "
          >
            <div
              className="
                bg-white/20
                backdrop-blur-md
                border
                border-white/20
                rounded-[35px]
                p-10
                max-w-3xl
              "
            >
              <h3
                className="
                  text-white
                  text-4xl
                  md:text-5xl
                  font-black
                  mb-6
                "
              >
                Soluciones eléctricas completas
              </h3>

              <p
                className="
                  text-white/90
                  text-xl
                  leading-relaxed
                "
              >
                Trabajamos en proyectos residenciales,
                comerciales e industriales ofreciendo
                calidad, seguridad y eficiencia
                energética.
              </p>
            </div>
          </div>
        </div>

{/* NUEVO APARTADO */}
<div
  className="
    bg-white
    rounded-[40px]
    overflow-hidden
    shadow-2xl
    mb-24
  "
>
  <div className="grid lg:grid-cols-2">

    {/* IMAGEN */}
    <div className="relative h-[350px] lg:h-auto">
      <Image
        src="/electricidad/plano.jpeg"
        alt="Diseño de sistemas eléctricos"
        fill
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/25" />
    </div>

    {/* CONTENIDO */}
    <div className="p-10 md:p-14 flex flex-col justify-center">

      <div
        className="
          inline-flex
          items-center
          gap-3
          bg-yellow-100
          text-yellow-700
          px-5
          py-2
          rounded-full
          font-bold
          mb-6
          w-fit
        "
      >
        <Bolt size={20} />
        Diseño de Sistemas Eléctricos
      </div>

      <h3
        className="
          text-4xl
          font-black
          text-[#2d2d2d]
          mb-6
        "
      >
        Soluciones modernas y eficientes
      </h3>

      <p
        className="
          text-gray-600
          text-lg
          leading-relaxed
          mb-8
        "
      >
        Analizamos el consumo energético y diseñamos
        sistemas eléctricos seguros, eficientes y
        preparados para el crecimiento futuro.
      </p>

      {/* LISTA */}
      <div className="space-y-4 mb-10">

        <div className="flex items-center gap-4">
          <div
            className="
              w-11
              h-11
              rounded-full
              bg-yellow-100
              flex
              items-center
              justify-center
            "
          >
            <Lightbulb
              size={20}
              className="text-yellow-600"
            />
          </div>

          <span className="font-semibold text-[#2d2d2d]">
            Iluminación arquitectónica
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="
              w-11
              h-11
              rounded-full
              bg-yellow-100
              flex
              items-center
              justify-center
            "
          >
            <Bolt
              size={20}
              className="text-yellow-600"
            />
          </div>

          <span className="font-semibold text-[#2d2d2d]">
            Optimización energética
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="
              w-11
              h-11
              rounded-full
              bg-yellow-100
              flex
              items-center
              justify-center
            "
          >
            <ShieldCheck
              size={20}
              className="text-yellow-600"
            />
          </div>

          <span className="font-semibold text-[#2d2d2d]">
            Sistemas eficientes y seguros
          </span>
        </div>
      </div>

    </div>
  </div>
</div>

      {/* CIERRE FINAL */}
<div
  className="
    bg-black
    rounded-[45px]
    overflow-hidden
    shadow-2xl
    mt-24
  "
>
  <div
    className="
      grid
      lg:grid-cols-2
      gap-10
      items-center
      p-10
      md:p-16
    "
  >

    {/* IMAGEN */}
    <div
      className="
        relative
        h-[260px]
        rounded-[30px]
        overflow-hidden
      "
    >
      <Image
        src="/electricidad/subestacion.jpeg"
        alt="Media y alta tensión"
        fill
        className="object-cover"
      />
    </div>

    {/* TEXTO */}
    <div className="text-white">

      <h3
        className="
          text-3xl
          md:text-4xl
          font-black
          mb-8
          uppercase
        "
      >
        Media y Alta Tensión
      </h3>

      <ul
        className="
          space-y-4
          text-lg
          text-white/90
          font-medium
        "
      >
        <li className="flex items-center gap-3">
          <Bolt className="text-yellow-400" size={22} />
          Subestaciones
        </li>

        <li className="flex items-center gap-3">
          <Bolt className="text-yellow-400" size={22} />
          Transformadores
        </li>

        <li className="flex items-center gap-3">
          <Bolt className="text-yellow-400" size={22} />
          Distribución eléctrica
        </li>
      </ul>
    </div>
  </div>

  {/* CTA FINAL */}
  <div
    className="
      border-t
      border-white/10
      py-14
      px-6
      text-center
    "
  >


  </div>
</div>

      </section>
    </div>
  );
}