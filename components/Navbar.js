"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // 🔥 SCROLL DETECTION
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Booking", href: "/booking" },
    { name: "Experience", href: "/experience" },
  ];

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
      ${
        scrolled
          ? "py-2 backdrop-blur-xl bg-black/60 border-b border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.4)]"
          : "py-4 bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6">

        {/* LOGO */}
        <motion.h1
          whileHover={{ scale: 1.05 }}
          className="text-lg font-semibold tracking-wide cursor-pointer"
        >
          <span className="text-yellow-400">BRUNDHA</span>
          <span className="text-white">  4K</span>
        </motion.h1>

        {/* NAV LINKS */}
        <div className="flex gap-8 relative">

          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <div key={item.name} className="relative">

                <Link
                  href={item.href}
                  className={`text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "text-yellow-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>

                {/* 🔥 ACTIVE UNDERLINE (SMOOTH SHIFT) */}
                {isActive && (
                  <motion.div
                    layoutId="navbar-underline"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute left-0 right-0 -bottom-1 h-[2px] bg-yellow-400 rounded-full"
                  />
                )}

              </div>
            );
          })}

        </div>

      </div>
    </motion.nav>
  );
}