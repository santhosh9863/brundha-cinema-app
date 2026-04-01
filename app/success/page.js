"use client";

import { motion } from "framer-motion";
import { useBooking } from "../context/BookingContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function Success() {
  const { booking } = useBooking();
  const router = useRouter();

  // ✅ FIXED useEffect (stable dependency)
  useEffect(() => {
    if (!booking || !booking.seats || booking.seats.length === 0) {
      window.location.href = "/booking";
    }
  }, []); // ⚠️ KEEP EMPTY

  const qrValue = JSON.stringify({
    movie: booking?.movie,
    time: booking?.time,
    seats: booking?.seats,
    total: booking?.total,
  });

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-4 overflow-hidden">
      <motion.div
        initial={{ y: -200, opacity: 0, rotateX: 60 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
        className="relative w-full max-w-md"
      >
        <div className="glass p-6 rounded-2xl border border-yellow-400/20 shadow-[0_0_60px_rgba(255,200,0,0.35)] relative overflow-hidden">
          
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-purple-500/10 blur-2xl" />

          <div className="relative my-4">
            <div className="border-t border-dashed border-white/20"></div>
            <div className="absolute -top-2 left-0 w-4 h-4 bg-black rounded-full"></div>
            <div className="absolute -top-2 right-0 w-4 h-4 bg-black rounded-full"></div>
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 1] }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-4"
          >
            <div className="w-14 h-14 rounded-full border-2 border-green-400 flex items-center justify-center text-green-400 text-2xl shadow-[0_0_30px_rgba(0,255,150,0.7)]">
              ✓
            </div>
          </motion.div>

          <h1 className="text-center text-xl font-bold text-yellow-400">
            Booking Confirmed
          </h1>

          <div className="text-center text-sm text-gray-300 mt-3 space-y-1">
            <p className="text-white font-semibold">{booking?.movie}</p>
            <p>{booking?.time}</p>
            <p>{booking?.seats?.join(", ")}</p>
          </div>

          <p className="text-center text-yellow-400 text-2xl font-bold mt-4">
            ₹{booking?.total}
          </p>

          <div className="mt-6 flex justify-center">
            <div className="p-2 bg-white rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <QRCodeCanvas value={qrValue} size={120} />
            </div>
          </div>

          {/* ✅ WORKING BUTTON */}
          <div className="mt-6 flex justify-center relative z-50">
  <button
    onClick={() => {
      console.log("CLICKED"); // debug
      window.location.href = "/";
    }}
    className="px-6 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition"
  >
    Back to Home
  </button>
</div>

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-0 left-0 w-1/2 h-full bg-white/10 blur-2xl"
          />

          <motion.div
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl shadow-[0_0_40px_rgba(255,200,0,0.2)] pointer-events-none"
          />

        </div>
      </motion.div>
    </main>
  );
}