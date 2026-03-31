"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const images = [
  {
    src: "https://image.tmdb.org/t/p/w500/6agKYU5IQFpuDyUYPu39w7UCRrJ.jpg",
    title: "Leo",
  },
  {
    src: "https://image.tmdb.org/t/p/w500/xfh2t3wX7Pq9k7vF9nF3p8u8Z7M.jpg",
    title: "KGF Chapter 2",
  },
  {
    src: "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg",
    title: "RRR",
  },
  {
    src: "https://image.tmdb.org/t/p/w500/8z0k7QJHc2kE4zG4J5Vq2G4vZkK.jpg",
    title: "Pushpa",
  },
  {
    src: "https://image.tmdb.org/t/p/w500/7lZb7gZ7dZp0v6bK9z7rXzF9wQ.jpg",
    title: "Vikram",
  },
  {
    src: "https://image.tmdb.org/t/p/w500/j9dJp9d0pJ7v7rF9k9Z8XzF9wQ.jpg",
    title: "Jailer",
  },
];

export default function Gallery() {
  const [selected, setSelected] = useState(null);

  return (
    <main className="min-h-screen bg-black text-white pt-20 px-4 sm:px-6">

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-12 text-yellow-400">
        Now Showing 🎬
      </h1>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">

        {images.map((img, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative overflow-hidden rounded-xl cursor-pointer glass group"
            onClick={() => setSelected(img)}
          >
            <Image
              src={img.src}
              alt={img.title}
              width={500}
              height={700}
              className="object-cover w-full h-[300px] sm:h-[400px] group-hover:scale-110 transition duration-500"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-end p-4">
              <h2 className="text-white font-semibold text-sm sm:text-base">
                {img.title}
              </h2>
            </div>

            {/* Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition shadow-[0_0_30px_rgba(255,200,0,0.4)]"></div>

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
            <motion.img
              src={selected.src}
              alt={selected.title}
              className="max-w-3xl w-full rounded-lg shadow-[0_0_40px_rgba(255,200,0,0.5)]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            />

            {/* Close */}
            <span className="absolute top-5 right-5 text-white text-2xl cursor-pointer">
              ✕
            </span>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}