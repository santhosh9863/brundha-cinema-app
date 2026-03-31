"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <main className="min-h-screen bg-black text-white pt-20 px-4 sm:px-6">

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 sm:mb-12"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400">
          Contact Us
        </h1>

        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Get in touch with Brundha 4K Atmos Cinema
        </p>
      </motion.div>

      {/* Content */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">

        {/* Left - Info */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 sm:space-y-6 text-sm sm:text-base"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-yellow-400">
            Visit Us
          </h2>

          <p className="text-gray-400 leading-relaxed">
            Devarachikkanahalli Main Rd, beside D Mart and Jockey Factory,
            SR Naidu Layout, Hongasandra, Bengaluru, Karnataka 560114
          </p>

          <p className="text-gray-400 leading-relaxed">
            Experience premium cinema with Dolby Atmos and 4K visuals.
          </p>
        </motion.div>

        {/* Right - Form */}
        <motion.form
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-md p-5 sm:p-6 rounded-xl border border-white/10 space-y-4"
        >
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base rounded bg-black/50 border border-white/10 focus:outline-none"
          />

          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base rounded bg-black/50 border border-white/10 focus:outline-none"
          />

          <textarea
            placeholder="Your Message"
            rows="4"
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base rounded bg-black/50 border border-white/10 focus:outline-none"
          />

          <button
            type="submit"
            className="w-full py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold rounded-lg hover:scale-105 transition"
          >
            Send Message
          </button>
        </motion.form>

      </div>

    </main>
  );
}