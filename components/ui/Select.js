"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Select({ options, value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">

      {/* SELECT BOX */}
      <div
        onClick={() => setOpen(!open)}
        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer backdrop-blur-md flex justify-between items-center hover:border-yellow-400/40 transition"
      >
        <span>{value}</span>
        <span className="text-sm">⌄</span>
      </div>

      {/* DROPDOWN */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute mt-2 w-full bg-black/90 border border-white/10 rounded-lg backdrop-blur-md overflow-hidden z-50"
          >
            {options.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  onChange(item);
                  setOpen(false);
                }}
                className="px-4 py-2 hover:bg-yellow-400/10 hover:text-yellow-400 cursor-pointer transition"
              >
                {item}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}