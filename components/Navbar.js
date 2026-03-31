"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (path) =>
    `transition ${
      pathname === path ? "text-yellow-400" : "hover:text-yellow-400"
    }`;

  return (
    <nav className="fixed w-full top-0 left-0 bg-black/70 backdrop-blur-md text-white z-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">

        {/* LOGO */}
        <h1 className="font-bold text-sm sm:text-lg whitespace-nowrap">
          🎬 Brundha Cinema
        </h1>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex gap-6 text-sm">
          <Link href="/" className={linkClass("/")}>Home</Link>
          <Link href="/about" className={linkClass("/about")}>About</Link>
          <Link href="/gallery" className={linkClass("/gallery")}>Gallery</Link>
          <Link href="/contact" className={linkClass("/contact")}>Contact</Link>
        </div>

        {/* CTA + MOBILE MENU */}
        <div className="flex items-center gap-3">

          {/* CTA */}
          <Link href="/booking">
            <motion.button
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-3 sm:px-5 py-2 text-xs sm:text-sm rounded-lg font-semibold text-black bg-gradient-to-r from-yellow-400 to-yellow-600 overflow-hidden whitespace-nowrap"
            >
              <span className="absolute inset-0 bg-yellow-400 opacity-20 blur-xl animate-pulse"></span>
              <span className="relative z-10">Book Now</span>
            </motion.button>
          </Link>

          {/* HAMBURGER */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-xl"
          >
            ☰
          </button>

        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-black/90 backdrop-blur-md px-6 py-4 space-y-4 text-center"
        >
          <Link href="/" onClick={() => setOpen(false)} className={linkClass("/")}>Home</Link>
          <Link href="/about" onClick={() => setOpen(false)} className={linkClass("/about")}>About</Link>
          <Link href="/gallery" onClick={() => setOpen(false)} className={linkClass("/gallery")}>Gallery</Link>
          <Link href="/contact" onClick={() => setOpen(false)} className={linkClass("/contact")}>Contact</Link>
        </motion.div>
      )}

    </nav>
  );
}