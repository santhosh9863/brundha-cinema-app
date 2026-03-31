"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useBooking } from "../app/context/BookingContext"; // ✅ FIXED
import Button from "./ui/Button"; // ✅ FIXED
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

        {/* TITLE */}
        <h1 className="text-xl text-yellow-400 font-semibold">
          Confirm Payment
        </h1>

        {/* BOOKING INFO */}
        <div className="text-sm text-gray-300 space-y-1">
          <p className="font-semibold text-white">{booking.movie}</p>
          <p>{booking.time}</p>
          <p>{booking.seats?.join(", ")}</p>
        </div>

        {/* PRICE */}
        <p className="text-yellow-400 text-2xl font-bold">
          ₹{booking.total}
        </p>

        {/* ✅ BUTTON SYSTEM */}
        <Button onClick={handlePayment}>
          {loading ? "Processing Payment..." : "Pay Now"}
        </Button>

      </motion.div>

    </main>
  );
}