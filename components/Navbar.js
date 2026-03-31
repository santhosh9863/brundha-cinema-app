"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed w-full top-0 z-50 px-4 sm:px-6 pt-3">

      {/* GLASS CONTAINER */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3 rounded-2xl 
        bg-white/5 backdrop-blur-xl border border-white/10 
        shadow-[0_0_30px_rgba(255,200,0,0.08)]">

        {/* LOGO */}
        <h1 className="text-sm sm:text-base font-semibold tracking-wide text-white/90">
          🎬 Brundha Cinema
        </h1>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8 text-sm">

          {links.map((link) => (
            <Link key={link.path} href={link.path}>
              <span className="relative group cursor-pointer">

                {/* TEXT */}
                <span
                  className={`transition ${
                    pathname === link.path
                      ? "text-yellow-400"
                      : "text-white/70 group-hover:text-white"
                  }`}
                >
                  {link.name}
                </span>

                {/* UNDERLINE ANIMATION */}
                <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
          ))}

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* CTA BUTTON */}
          <Link href="/booking">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="relative px-4 py-2 rounded-full text-sm font-semibold text-black 
              bg-gradient-to-r from-yellow-400 to-yellow-600 
              shadow-[0_0_20px_rgba(255,200,0,0.4)] overflow-hidden"
            >
              <span className="relative z-10">Book</span>
              <span className="absolute inset-0 bg-yellow-400 opacity-20 blur-xl"></span>
            </motion.button>
          </Link>

          {/* HAMBURGER */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-lg text-white/80"
          >
            ☰
          </button>

        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden mt-3 mx-auto max-w-7xl px-5 py-4 rounded-2xl 
          bg-white/5 backdrop-blur-xl border border-white/10 
          shadow-[0_0_30px_rgba(255,200,0,0.08)] space-y-3">

          {links.map((link) => (
            <Link key={link.path} href={link.path}>
              <p className="text-white/80 hover:text-yellow-400 transition">
                {link.name}
              </p>
            </Link>
          ))}

        </div>
      )}
    </nav>
  );
}