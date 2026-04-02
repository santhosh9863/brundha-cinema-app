"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
export default function Button({
  children,
  onClick,
  className = "",
  variant = "primary",
  loading = false,
  disabled = false,
}) {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const smoothX = useSpring(x, { stiffness: 150, damping: 12 });
  const smoothY = useSpring(y, { stiffness: 150, damping: 12 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);

    x.set(dx * 0.25);
    y.set(dy * 0.25);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = () => {
    if (disabled || loading) return;
    onClick && onClick();
  };

  const base =
    "w-full py-2 rounded-lg font-semibold transition-all duration-200 relative overflow-hidden";

  const variants = {
    primary:
      "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-[0_0_20px_rgba(255,200,0,0.6)]",
    glass:
      "bg-white/10 text-white hover:bg-white/20 border border-white/10",
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      style={{ x: smoothX, y: smoothY }}
      whileTap={{ scale: 0.95 }}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className} ${
        disabled ? "opacity-40 cursor-not-allowed" : ""
      }`}
    >
      {loading ? "Processing..." : children}

      {/* glow effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 hover:opacity-100 transition duration-500 blur-md" />
    </motion.button>
  );
}