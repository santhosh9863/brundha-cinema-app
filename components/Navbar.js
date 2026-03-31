"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (path) =>
    `block py-2 ${
      pathname === path ? "text-yellow-400" : "hover:text-yellow-400"
    }`;

  return (
    <nav className="fixed w-full top-0 left-0 bg-black/70 backdrop-blur-md text-white z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* LOGO */}
        <h1 className="font-bold text-lg">🎬 Brundha Cinema</h1>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-6 text-sm">
          <Link href="/" className={linkClass("/")}>Home</Link>
          <Link href="/about" className={linkClass("/about")}>About</Link>
          <Link href="/gallery" className={linkClass("/gallery")}>Gallery</Link>
          <Link href="/contact" className={linkClass("/contact")}>Contact</Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* BOOK BUTTON */}
          <Link href="/booking">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-lg font-semibold text-black bg-gradient-to-r from-yellow-400 to-yellow-600"
            >
              Book Now
            </motion.button>
          </Link>

          {/* HAMBURGER */}
          <button
            className="md:hidden text-xl"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>

        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-black/90 px-6 pb-4 space-y-2 text-sm">
          <Link href="/" className={linkClass("/")}>Home</Link>
          <Link href="/about" className={linkClass("/about")}>About</Link>
          <Link href="/gallery" className={linkClass("/gallery")}>Gallery</Link>
          <Link href="/contact" className={linkClass("/contact")}>Contact</Link>
        </div>
      )}
    </nav>
  );
}