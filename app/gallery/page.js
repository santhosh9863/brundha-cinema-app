"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const images = [
  { title: "ustaad bhagath sing", src: "/images/leo.webp" },
  { title: "KGF Chapter 2", src: "/images/kgf2.jpg", rating: "4.5" },
  { title: "Baasha", src: "/images/baasha.jpg" },
  { title: "Pushpa", src: "/images/a.jpg" },
  { title: "GBU", src: "/images/gbu.jpg" },
  { title: "Kaadhal", src: "/images/jailer.jpg" },
];

export default function Gallery() {
  const [selected, setSelected] = useState(null);

  return (
    <main className="min-h-screen bg-black text-white pt-20 px-4 sm:px-6">

      {/* TITLE */}
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-12 text-yellow-400 tracking-wide">
        Now Showing 🎬
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {images.map((img, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => setSelected(img)}
          >

            {/* IMAGE */}
            <Image
              src={img.src}
              alt={img.title}
              width={500}
              height={700}
              className="w-full h-[400px] object-cover transition duration-500 group-hover:scale-110"
            />

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-end p-4">
              <h2 className="text-white font-semibold text-lg">
                {img.title}
              </h2>
            </div>

            {/* GLOW BORDER */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition shadow-[0_0_40px_rgba(255,200,0,0.5)] rounded-xl" />

          </motion.div>
        ))}

      </div>

      {/* 🔥 LIGHTBOX */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >

            {/* IMAGE POPUP */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >

              <Image
                src={selected.src}
                alt={selected.title}
                width={800}
                height={1000}
                className="rounded-xl shadow-[0_0_60px_rgba(255,200,0,0.6)]"
              />

              {/* TITLE */}
              <p className="text-center mt-4 text-yellow-400 text-lg">
                {selected.title}
              </p>

              {/* CLOSE */}
              <button
                onClick={() => setSelected(null)}
                className="absolute -top-4 -right-4 bg-black text-white w-10 h-10 rounded-full border border-white/20 hover:bg-white/10 transition"
              >
                ✕
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}