"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Select({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef(null);

  // ✅ CLOSE ON OUTSIDE CLICK
  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // ✅ KEYBOARD SUPPORT
  useEffect(() => {
    const handleKey = (e) => {
      if (!open) return;

      if (e.key === "ArrowDown") {
        setActiveIndex((prev) => (prev + 1) % options.length);
      }

      if (e.key === "ArrowUp") {
        setActiveIndex((prev) =>
          prev === 0 ? options.length - 1 : prev - 1
        );
      }

      if (e.key === "Enter") {
        onChange(options[activeIndex]);
        setOpen(false);
      }

      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, activeIndex, options, onChange]);

  return (
    <div ref={ref} className="relative w-full">

      {/* SELECT BOX */}
      <div
        onClick={() => setOpen(!open)}
        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer backdrop-blur-md flex justify-between items-center hover:border-yellow-400/40 transition"
      >
        <span>{value}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-sm"
        >
          ⌄
        </motion.span>
      </div>

      {/* DROPDOWN */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute mt-2 w-full bg-black/90 border border-white/10 rounded-lg backdrop-blur-md overflow-hidden z-50"
          >
            {options.map((item, i) => {
              const isActive = i === activeIndex;
              const isSelected = item === value;

              return (
                <div
                  key={i}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                  className={`px-4 py-2 flex justify-between items-center cursor-pointer transition
                    ${
                      isActive
                        ? "bg-yellow-400/10 text-yellow-400"
                        : "text-white"
                    }`}
                >
                  {item}

                  {/* ✔ SELECTED MARK */}
                  {isSelected && (
                    <span className="text-yellow-400 text-xs">✔</span>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}