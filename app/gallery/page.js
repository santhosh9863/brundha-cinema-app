"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const images = [
  "/images/cinema1.jpg",
  "/images/cinema2.jpg",
  "/images/cinema3.jpg",
  "/images/cinema4.jpg",
  "/images/cinema5.jpg",
  "/images/cinema6.jpg",
];

export default function Gallery() {
  const [selected, setSelected] = useState(null);

  return (
    <main className="min-h-screen bg-black text-white pt-24 px-6">

      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-12 text-yellow-400">
        Gallery
      </h1>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {images.map((src, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="relative overflow-hidden rounded-xl group cursor-pointer"
            onClick={() => setSelected(src)}
          >
            <Image
              src={src}
              alt="Cinema"
              width={500}
              height={300}
              className="object-cover w-full h-full group-hover:scale-110 transition duration-500"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition"></div>
          </motion.div>
        ))}
      </div>

      {/* 🔥 LIGHTBOX */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.img
              src={selected}
              alt="Preview"
              className="max-w-4xl w-full rounded-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            />

            {/* Close hint */}
            <span className="absolute top-6 right-6 text-white text-2xl">
              ✕
            </span>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}