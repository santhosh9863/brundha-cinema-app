"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

function PaymentContent() {
  const params = useSearchParams();
  const router = useRouter();

  const seats = params.get("seats") || 0;
  const total = params.get("total") || 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0f] to-[#1a0f2e] text-white pt-24 px-6 flex flex-col items-center">

      {/* Title */}
      <h1 className="text-4xl font-bold text-yellow-400 mb-10">
        💳 Complete Payment
      </h1>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 w-full max-w-md text-center space-y-6"
      >

        {/* Summary */}
        <p className="text-gray-400">
          Seats: <span className="text-white">{seats}</span>
        </p>

        <p className="text-yellow-400 text-3xl font-bold">
          ₹{total}
        </p>

        {/* Payment Options */}
        <div className="space-y-3">
          <button className="w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 transition">
            Pay with UPI
          </button>

          <button className="w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 transition">
            Pay with Wallet
          </button>

          <button className="w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 transition">
            Pay with Card
          </button>
        </div>

        {/* Pay Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/success")}
          className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold rounded-lg shadow-[0_0_20px_rgba(255,200,0,0.6)]"
        >
          Confirm Payment
        </motion.button>

      </motion.div>

    </main>
  );
}

export default function Payment() {