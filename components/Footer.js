"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 mt-24 overflow-hidden">

      {/* 🔥 CINEMATIC BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,200,0,0.08),transparent_70%)] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">

        {/* 🔝 TOP SECTION */}
        <div className="flex flex-col items-center text-center space-y-4">

          {/* BRAND */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-semibold tracking-wide"
          >
            <span className="text-yellow-400">Brundha</span>{" "}
            <span className="text-white">4K Atmos Cinema</span>
          </motion.h2>

          {/* DESCRIPTION */}
          <p className="text-gray-400 text-sm max-w-md leading-relaxed">
            Experience cinema the way it was meant to be — with stunning 4K visuals,
            immersive Dolby Atmos sound, and unmatched comfort.
          </p>

        </div>

        {/* 🔗 LINKS */}
        <div className="flex justify-center gap-8 mt-8 text-sm">

          <a
            href="https://github.com/santhosh9863/brundha-cinema-app"
            target="_blank"
            className="relative text-gray-400 hover:text-yellow-400 transition group"
          >
            GitHub
            <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-yellow-400 transition-all group-hover:w-full"></span>
          </a>

          <a
            href="https://brundha-4k-dolby-atom.vercel.app"
            target="_blank"
            className="relative text-gray-400 hover:text-yellow-400 transition group"
          >
            Live Site
            <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-yellow-400 transition-all group-hover:w-full"></span>
          </a>

        </div>

        {/* 📍 LOCATION (INTEGRATED — NOT SEPARATE BLOCK) */}
        <div className="flex justify-center mt-8">

          <a
            href="https://maps.app.goo.gl/pUJnM3cNLQLq1dFd8"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-500 hover:text-yellow-400 transition group"
          >

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 opacity-70 group-hover:opacity-100 transition"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19.5 8c0 7-7.5 13-7.5 13S4.5 15 4.5 8a7.5 7.5 0 1115 0z"
              />
            </svg>

            <span className="text-sm tracking-wide">
              Brunda Theatre • Bengaluru
            </span>

          </a>

        </div>

        {/* 🔻 DIVIDER */}
        <div className="border-t border-white/10 mt-10 pt-6 text-center">

          <p className="text-gray-500 text-xs tracking-wide">
            Built by Santhosh • Next.js • Tailwind • Framer Motion
          </p>

        </div>

      </div>

    </footer>
  );
}