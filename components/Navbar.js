"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (path) =>
    `transition ${
      pathname === path ? "text-yellow-400" : "hover:text-yellow-400"
    }`;

  return (
    <nav className="fixed w-full top-0 left-0 bg-black/70 backdrop-blur-md text-white z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <h1 className="font-bold text-lg">🎬 Brundha Cinema</h1>

        {/* LINKS */}
        <div className="flex gap-6">
          <Link href="/" className={linkClass("/")}>Home</Link>
          <Link href="/about" className={linkClass("/about")}>About</Link>
          <Link href="/gallery" className={linkClass("/gallery")}>Gallery</Link>
          <Link href="/contact" className={linkClass("/contact")}>Contact</Link>
        </div>

        {/* CTA */}
        <Link href="/booking">
  <motion.button
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    className="relative px-5 py-2 rounded-lg font-semibold text-black bg-gradient-to-r from-yellow-400 to-yellow-600 overflow-hidden"
  >
    {/* Glow Layer */}
    <span className="absolute inset-0 bg-yellow-400 opacity-20 blur-xl animate-pulse"></span>

    {/* Text */}
    <span className="relative z-10">Book Now</span>
  </motion.button>
</Link>
      </div>
    </nav>
  );
}