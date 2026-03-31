"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBooking } from "../context/BookingContext"; // ✅ FIXED
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
        className="relative glass p-6 rounded-2xl w-full max-w-md text-center space-y-5 shadow-[0_0_40px_rgba(255,200,0,0.15)] overflow-hidden"
      >

        {/* 🎟 TOP SECTION */}
        <div className="space-y-1">
          <h1 className="text-lg text-yellow-400 font-semibold tracking-wide">
            🎟 Booking Confirmed
          </h1>

          <p className="text-white font-medium">
            {booking.movie}
          </p>

          <p className="text-gray-400 text-sm">
            {booking.time}
          </p>
        </div>

        {/* 🎫 DIVIDER */}
        <div className="relative flex items-center justify-center my-4">

          <div className="absolute left-0 w-4 h-4 bg-black rounded-full -translate-x-1/2"></div>
          <div className="absolute right-0 w-4 h-4 bg-black rounded-full translate-x-1/2"></div>

          <div className="w-full border-t border-dashed border-white/20"></div>
        </div>

        {/* 💺 DETAILS */}
        <div className="space-y-2 text-sm text-gray-300">
          <p>
            Seats:{" "}
            <span className="text-white font-semibold">
              {booking.seats.join(", ")}
            </span>
          </p>

          <p>
            Total:{" "}
            <span className="text-yellow-400 font-bold">
              ₹{booking.total}
            </span>
          </p>
        </div>

        {/* 🔳 PREMIUM QR */}
        <div className="flex justify-center mt-4">
          <div className="relative w-28 h-28 bg-white p-2 rounded-lg shadow-[0_0_25px_rgba(255,200,0,0.4)]">
            <div className="grid grid-cols-5 gap-[2px]">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-full h-full ${
                    Math.random() > 0.5 ? "bg-black" : "bg-white"
                  }`}
                ></div>
              ))}
            </div>

            {/* subtle glow */}
            <div className="absolute inset-0 rounded-lg shadow-[0_0_20px_rgba(255,200,0,0.3)] pointer-events-none"></div>
          </div>
        </div>

        {/* 🎫 BOTTOM CTA */}
        <Link href="/">
          <button className="w-full mt-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
            Back Home
          </button>
        </Link>

      </motion.div>

    </main>
  );
}