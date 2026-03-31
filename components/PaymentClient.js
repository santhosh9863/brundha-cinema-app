"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useBooking } from "../app/context/BookingContext";
import Button from "./ui/Button";

export default function PaymentClient() {
  const router = useRouter();
  const { booking, setBooking } = useBooking();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 🚨 BLOCK DIRECT ACCESS
  useEffect(() => {
    if (!booking?.seats || booking.seats.length === 0) {
      router.push("/booking");
    }
  }, [booking, router]);

  const handlePayment = () => {
    if (loading) return;

    setLoading(true);

    setTimeout(() => {
      setSuccess(true);

      setBooking((prev) => ({
        ...prev,
        paid: true,
      }));

      // 🎬 delay redirect (lets animation play fully)
      setTimeout(() => {
        router.push("/success");
      }, 3000);
    }, 1500);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-4 relative overflow-hidden">

      {/* 🎬 MAIN PAYMENT CARD (HIDES ON SUCCESS) */}
      {!success && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass p-6 rounded-2xl w-full max-w-md text-center space-y-5 shadow-[0_0_25px_rgba(255,200,0,0.15)]"
        >
          <h1 className="text-xl text-yellow-400 font-semibold">
            Confirm Payment
          </h1>

          <div className="text-sm text-gray-300 space-y-1">
            <p className="font-semibold text-white">{booking?.movie}</p>
            <p>{booking?.time}</p>
            <p>{booking?.seats?.join(", ")}</p>
          </div>

          <p className="text-yellow-400 text-2xl font-bold">
            ₹{booking?.total}
          </p>

          {/* ⏳ LOADER */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center"
              >
                <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button onClick={handlePayment} disabled={loading}>
            {loading ? "Processing Payment..." : "Pay Now"}
          </Button>
        </motion.div>
      )}

      {/* 💥 SUCCESS POPUP (NO BACKGROUND OVERLAY) */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >

            {/* 🎆 PARTICLES */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, x: 0, y: 0 }}
                animate={{
                  x: (Math.random() - 0.5) * 300,
                  y: (Math.random() - 0.5) * 300,
                  opacity: 0,
                }}
                transition={{ duration: 1.2 }}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              />
            ))}

            {/* 🎯 POPUP CARD */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="pointer-events-auto p-8 rounded-2xl text-center space-y-5 w-[300px] relative 
              bg-gradient-to-b from-white/10 to-white/5 
              border border-white/10 
              backdrop-blur-xl 
              shadow-[0_0_20px_rgba(255,200,0,0.1)]"
            >

              {/* ✅ SVG SUCCESS TICK */}
              <motion.svg
                width="60"
                height="60"
                viewBox="0 0 52 52"
                className="mx-auto"
              >
                <motion.circle
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6 }}
                />
                <motion.path
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="3"
                  d="M14 27l7 7 16-16"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                />
              </motion.svg>

              {/* TEXT */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-lg font-semibold text-white"
              >
                Payment Successful
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-gray-400 text-sm"
              >
                Redirecting to your ticket...
              </motion.p>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}