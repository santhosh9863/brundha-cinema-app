"use client";

import { motion } from "framer-motion";

export default function Button({ children, onClick, disabled }) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.04 } : {}}
      whileTap={!disabled ? { scale: 0.96 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full py-3 rounded-xl font-semibold text-black
      bg-gradient-to-r from-yellow-400 to-yellow-600
      transition-all duration-300
      shadow-[0_0_20px_rgba(255,200,0,0.4)]
      ${
        disabled
          ? "opacity-40 cursor-not-allowed"
          : "hover:shadow-[0_0_30px_rgba(255,200,0,0.7)]"
      }`}
    >
      {children}
    </motion.button>
  );
}