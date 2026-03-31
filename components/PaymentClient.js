"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "../app/context/BookingContext";
import { motion } from "framer-motion";

export default function PaymentClient() {
  const router = useRouter();
  const { booking, setBooking } = useBooking();

  const [loading, setLoading] = useState(false);

  // 🚨 BLOCK DIRECT ACCESS
  useEffect(() => {
    if (!booking.seats || booking.seats.length === 0) {
      router.push("/booking");
    }
  }, [booking.seats, router]);

  const handlePayment = () => {
    setLoading(true);

    setTimeout(() => {
      setBooking((prev) => ({
        ...prev,
        paid: true,
      }));

      router.push("/success");
    }, 2000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-4">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 rounded-xl w-full max-w-md text-center space-y-4"
      >

        <h1 className="text-xl text-yellow-400 font-semibold">
          Confirm Payment
        </h1>

        {/* 🎬 Booking Info */}
        <div className="text-sm text-gray-300 space-y-1">
          <p className="font-semibold text-white">{booking.movie}</p>
          <p>{booking.time}</p>
          <p>{booking.seats?.join(", ") || "No seats"}</p>
        </div>

        {/* 💰 Price */}
        <p className="text-yellow-400 text-2xl font-bold">
          ₹{booking.total}
        </p>

        {/* 🚀 Pay Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded font-semibold shadow-[0_0_15px_rgba(255,200,0,0.6)]"
        >
          {loading ? "Processing Payment..." : "Pay Now"}
        </motion.button>

      </motion.div>

    </main>
  );
}