"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "../context/BookingContext"; // ✅ FIXED
import Button from "./ui/Button";

export default function PaymentClient() {
  const router = useRouter();
  const { booking, setBooking } = useBooking();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🚫 BLOCK DIRECT ACCESS
  useEffect(() => {
    if (!booking?.seats || booking.seats.length === 0) {
      router.push("/booking");
    }
  }, [booking, router]);

  // 💳 HANDLE PAYMENT
  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seats: booking.seats,
          total: booking.total,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        setError(data.message || "Payment failed");
        return;
      }

      // ✅ SUCCESS
      setBooking((prev) => ({
        ...prev,
        paid: true,
        transactionId: data.transactionId,
      }));

      router.push("/success");

    } catch (err) {
      setLoading(false);
      setError("Network error. Try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-4">

      <div className="glass p-6 rounded-xl w-full max-w-md text-center space-y-4">

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

        {error && (
          <div className="text-red-400 text-sm">
            {error}
          </div>
        )}

        <Button onClick={handlePayment} loading={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </Button>

      </div>

    </main>
  );
}