"use client";

import { motion } from "framer-motion";

export default function Button({
  children,
  onClick,
  className = "",
  variant = "primary",
}) {
  const base =
    "w-full py-2 rounded-lg font-semibold transition-all duration-200";

  const variants = {
    primary:
      "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-[0_0_15px_rgba(255,200,0,0.5)]",
    glass:
      "bg-white/10 text-white hover:bg-white/20 border border-white/10",
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}