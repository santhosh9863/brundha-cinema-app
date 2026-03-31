// 📂 app/success/page.js (FINAL FIXED)

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBooking } from "../context/BookingContext"; // ✅ FIXED PATH
import { motion } from "framer-motion";

export default function Success() {
  const { booking } = useBooking();
  const router = useRouter();

  // 🚨 BLOCK DIRECT ACCESS
  useEffect(() => {
    if (!booking.paid) {
      router.push("/booking");
    }
  }, [booking.paid, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-4">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-6 rounded-xl w-full max-w-md text-center space-y-4 shadow-[0_0_30px_rgba(255,200,0,0.2)]"
      >

        {/* 🎉 Title */}
        <h1 className="text-xl text-yellow-400 font-semibold">
          🎟 Booking Confirmed
        </h1>

        {/* 🎬 Movie Info */}
        <div className="text-sm text-gray-300 space-y-1">
          <p className="font-semibold text-white">{booking.movie}</p>
          <p>{booking.time}</p>
        </div>

        {/* 💺 Seats */}
        <p className="text-sm">
          Seats:{" "}
          <span className="text-white font-semibold">
            {booking.seats?.join(", ") || "No seats"}
          </span>
        </p>

        {/* 💰 Price */}
        <p className="text-yellow-400 text-2xl font-bold">
          ₹{booking.total}
        </p>

        {/* 🎫 Divider */}
        <div className="border-t border-dashed border-white/20 my-4"></div>

        {/* 🔳 Fake QR */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-white/10 grid grid-cols-4 gap-1 p-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className={`${
                  Math.random() > 0.5 ? "bg-white" : "bg-transparent"
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* 🔙 Button */}
        <Link href="/">
          <button
            onClick={() => localStorage.removeItem("booking")} // 🔥 RESET AFTER SUCCESS
            className="w-full py-2 bg-white/10 rounded hover:bg-white/20 transition"
          >
            Back Home
          </button>
        </Link>

      </motion.div>

    </main>
  );
}