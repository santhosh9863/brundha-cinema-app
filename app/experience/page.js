"use client";

import { motion } from "framer-motion";

export default function Experience() {
  const reviews = [
    {
      name: "Chakradhar Reddy",
      text: "Watched Mark FDFS. The theater is pretty good after the re-modification. Sound system has been improved. Enough parking space for cars as well.",
    },
    {
      name: "Akash Inchal",
      text: "Superb theatre. Clean and hygienic. Plenty of bike and car parking. Interval snacks, tea, and coffee available. Well maintained and budget friendly.",
    },
    {
      name: "Bhargava Galipally",
      text: "4K Dolby Atmos theater is straight-up fire. The visuals are crisp and the sound is fully immersive. Seats are comfortable with an old-school vibe.",
    },
    {
      name: "Dhanooj Balakrishnan",
      text: "Overall excellent experience. Picture quality and sound quality are top-notch.",
    },
    {
      name: "Vishnu A",
      text: "One of the best single screen theatres in Bengaluru. 4K projection and Dolby Atmos sound deliver great clarity and audio effects.",
    },
    {
      name: "Prasanth VS",
      text: "Unexpected gem. Watched Aavesham here and the experience was fabulous. Screen, projection, and sound were all top-tier.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white pt-20 px-4 sm:px-6">

      {/* HERO */}
      <section className="text-center max-w-4xl mx-auto mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-5xl font-bold text-yellow-400 mb-4"
        >
          Brunda Theatre Experience
        </motion.h1>

        <p className="text-gray-400 text-sm sm:text-base">
          A modern upgrade to a classic single-screen cinema — where comfort,
          clarity, and sound come together.
        </p>
      </section>

      {/* KEY FEATURES */}
      <section className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">

        {[
          {
            title: "4K Projection",
            desc: "Sharp visuals with excellent clarity that enhance every scene.",
          },
          {
            title: "Dolby Atmos Sound",
            desc: "Immersive audio experience with powerful and precise sound design.",
          },
          {
            title: "Comfort Seating",
            desc: "Upgraded seating system designed for long, comfortable viewing.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className="glass p-5 rounded-xl space-y-2"
          >
            <h3 className="text-yellow-400 font-semibold">
              {item.title}
            </h3>
            <p className="text-gray-400 text-sm">
              {item.desc}
            </p>
          </motion.div>
        ))}

      </section>

      {/* DESCRIPTION */}
      <section className="max-w-4xl mx-auto text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-300 leading-relaxed"
        >
          Brunda Theatre has evolved into one of the most loved single-screen
          cinemas in Bengaluru. With improved sound systems, enhanced seating,
          and upgraded projection quality, it delivers a balanced cinematic
          experience — combining affordability with premium-level immersion.
        </motion.p>
      </section>

      {/* REVIEWS */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-xl text-yellow-400 mb-8 text-center">
          Real Audience Reviews
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {reviews.map((review, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="glass p-5 rounded-xl space-y-3"
            >
              <p className="text-gray-300 text-sm leading-relaxed">
                “{review.text}”
              </p>

              <p className="text-yellow-400 text-sm font-semibold">
                — {review.name}
              </p>
            </motion.div>
          ))}

        </div>
      </section>

    </main>
  );
}