"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen bg-black text-white pt-20 px-4 sm:px-6">

      {/* 🔙 BACK BUTTON */}
      <div className="max-w-6xl mx-auto mb-6">
        <Link href="/">
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition">
            ← Back to Home
          </button>
        </Link>
      </div>

      {/* HERO */}
      <section className="text-center max-w-4xl mx-auto mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-400"
        >
          Experience Cinema Like Never Before 🎬
        </motion.h1>

        <p className="text-gray-400 mt-4 text-sm sm:text-base">
          Brundha 4K Atmos Cinema delivers immersive visuals, powerful sound,
          and luxury seating for an unforgettable movie experience.
        </p>
      </section>

      {/* STORY */}
      <section className="max-w-5xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 p-6 rounded-xl border border-white/10"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-yellow-400 mb-3">
            Our Story
          </h2>

          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Located in Bengaluru, Brundha Cinema was built to redefine the
            movie experience with cutting-edge 4K projection and Dolby Atmos
            sound. Every detail is designed to deliver comfort, clarity, and
            cinematic excellence.
          </p>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 text-center mb-10">
          Premium Features
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {[
            "🎥 4K Ultra HD Projection",
            "🔊 Dolby Atmos Sound",
            "💺 Luxury Recliner Seats",
            "🚗 Ample Parking Space",
            "🍿 Premium Snacks & Lounge",
            "❄️ Fully Air Conditioned",
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 p-5 rounded-xl border border-white/10 text-center"
            >
              <p className="text-sm sm:text-base">{feature}</p>
            </motion.div>
          ))}

        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="max-w-4xl mx-auto mb-16 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-400 text-sm sm:text-base"
        >
          Every show is crafted to deliver crystal-clear visuals, immersive
          sound, and unmatched comfort — making every visit unforgettable.
        </motion.p>
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-5xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
          Why Choose Us
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-400 text-sm sm:text-base">

          <div>✔ Clean & Hygienic Environment</div>
          <div>✔ Affordable Ticket Pricing</div>
          <div>✔ Prime Location in Bengaluru</div>
          <div>✔ High Customer Satisfaction</div>

        </div>
      </section>

      {/* LOCATION */}
      <section className="max-w-4xl mx-auto mb-16 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-yellow-400 mb-3">
          Visit Us
        </h2>

        <p className="text-gray-400 text-sm sm:text-base">
          Devarachikkanahalli Main Rd, beside D Mart and Jockey Factory,
          SR Naidu Layout, Hongasandra, Bengaluru, Karnataka 560114
        </p>
      </section>

      {/* RATING */}
      <section className="text-center mb-16">
        <p className="text-yellow-400 text-lg font-semibold">
          ⭐ 4.4 Rating from 7,000+ Visitors
        </p>
      </section>

      {/* FOOTER */}
      <section className="text-center border-t border-white/10 pt-6 pb-10">
        <p className="text-gray-500 text-xs sm:text-sm">
          Built by Santhosh • Next.js • Tailwind CSS • Framer Motion
        </p>
      </section>

    </main>
  );
}