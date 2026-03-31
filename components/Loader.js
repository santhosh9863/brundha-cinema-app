"use client";

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-[9999]">

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-12 h-12 rounded-full border-2 border-yellow-400 border-t-transparent"
      />

    </div>
  );
}