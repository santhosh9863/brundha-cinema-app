"use client";

import { motion } from "framer-motion";

export default function Success() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">

      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-4xl text-yellow-400 font-bold mb-4"
      >
        🎉 Booking Confirmed!
      </motion.h1>

      <p className="text-gray-400 mb-6">
        Enjoy your movie experience 🍿
      </p>

      <motion.a
        href="/"
        whileHover={{ scale: 1.1 }}
        className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold"
      >
        Go Home
      </motion.a>

    </main>
  );
}