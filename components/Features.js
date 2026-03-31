"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Dolby Atmos Sound",
    desc: "Immersive surround audio experience",
  },
  {
    title: "4K Ultra  Projection",
    desc: "Ultra-clear cinematic visuals",
  },
  {
    title: "Luxury Seating",
    desc: "Comfortable premium seating",
  },
  {
    title: "Snacks & Parking",
    desc: "Convenience and refreshments",
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-black text-white px-6">

      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-center mb-16"
      >
        Why Choose Us ??
      </motion.h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">

        {features.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg"
          >
            <h3 className="text-xl font-semibold text-yellow-400">
              {item.title}
            </h3>
            <p className="text-gray-400 mt-2">{item.desc}</p>
          </motion.div>
        ))}

      </div>
    </section>
  );
}