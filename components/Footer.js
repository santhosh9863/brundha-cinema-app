"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16">

      <div className="max-w-6xl mx-auto px-6 py-8 text-center space-y-4">

        {/* Brand */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg font-semibold text-yellow-400"
        >
          🎬 Brundha 4K Atmos Cinema
        </motion.h2>

        {/* Description */}
        <p className="text-gray-400 text-sm">
          Premium movie experience with 4K visuals and Dolby Atmos sound.
        </p>

        {/* Links */}
        <div className="flex justify-center gap-6 text-sm">

          <a
            href="https://github.com/santhosh9863/brundha-cinema-app"
            target="_blank"
            className="hover:text-yellow-400 transition"
          >
            GitHub
          </a>

          <a
            href="https://brundha-4k-dolby-atom.vercel.app"
            target="_blank"
            className="hover:text-yellow-400 transition"
          >
            Live Site
          </a>

        </div>

        {/* Credit */}
        <p className="text-gray-500 text-xs">
          Built by Santhosh • Next.js • Tailwind • Framer Motion
        </p>

      </div>

    </footer>
  );
}