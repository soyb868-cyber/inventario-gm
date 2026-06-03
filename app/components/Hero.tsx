"use client";

import { useEffect, useState } from "react";

import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import Image from "next/image";

export default function Hero() {

  /* IMAGENES */
  const images = [
    "/hero.jpeg",
    "/hero2.jpeg",
    "/hero3.jpeg",
  ];

  const [current, setCurrent] = useState(0);

  /* CAMBIO AUTOMATICO */
  useEffect(() => {

    const interval = setInterval(() => {

      setCurrent((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );

    }, 4000);

    return () => clearInterval(interval);

  }, []);

  return (
  <section
      id="inicio"
      className="
        relative
        w-full
        min-h-screen
        pt-[90px]
        overflow-hidden
        bg-black
      "
    >

      {/* HERO IMAGE */}
      <div className="absolute inset-0">

        <div className="relative w-full h-full overflow-hidden">

          {/* IMAGENES */}
          {images.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt="Construcción"
              fill
              priority={index === 0}
              quality={100}
              sizes="100vw"
              className={`object-cover transition-opacity duration-1000 ${
                current === index ? "opacity-100" : "opacity-0"
              }`}

            />
          ))}

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-black/45"></div>

        </div>
      </div>

      {/* CONTENIDO */}
      <div className="relative z-20 min-h-[calc(100vh-90px)] flex flex-col justify-between">

        {/* TEXTO */}
        <div className="absolute top-1/2 -translate-y-1/2 left-[7%] text-white">

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight drop-shadow-2xl">
            Materiales <br />
            para construcción
          </h1>

          <p className="mt-6 text-xl md:text-2xl text-gray-200 max-w-[700px]">
            Calidad, resistencia y servicio profesional
            para todos tus proyectos.
          </p>

        </div>

{/* FOOTER */}
      </div>
    </section>
  );
}