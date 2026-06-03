"use client";

import { useEffect, useState } from "react";

import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

export default function About() {
  return (
    <section id="nosotros" className="py-20 bg-black">
      <div className="max-w-4xl mx-auto px-6 text-center">

        {/* Título opcional */}
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Nuestras redes sociales
        </h2>

        <p className="text-white/60 mt-3">
          En contacto con nosotros
        </p>

        {/* Redes */}
        <div className="flex justify-center gap-6 mt-10">


        <a
          href="https://wa.me/524181826245"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition"
        >
          <FaWhatsapp size={24} />
        </a>

          <a
            href="https://www.instagram.com/copuprisa"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition"
          >
            <FaInstagram size={24} />
          </a>

          <a
            href="https://www.facebook.com/share/1D89zrbozT/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition"
          >
            <FaFacebookF size={22} />
          </a>

        </div>

      </div>
    </section>
  );
}