"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "../context/BookingContext";
import Button from "../../components/ui/Button";

export default function PaymentClient() {
  const router = useRouter();
  const bookingContext = useBooking();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ HARD FIX FOR YOUR CRASH
  if (!bookingContext || !bookingContext.booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading booking...
      </div>
    );
  }

  const { booking, setBooking } = bookingContext;

  // 🚫 BLOCK DIRECT ACCESS
  useEffect(() => {
    if (!booking?.seats || booking.seats.length === 0) {
      router.push("/booking");
    }
  }, [booking, router]);

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie: booking.movie,
          time: booking.time,
          seats: booking.seats,
          total: booking.total,
          paid: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Booking failed");
        setLoading(false);
        return;
      }

      setBooking((prev) => ({
        ...prev,
        paid: true,
      }));

      router.push("/success");
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="glass p-6 rounded-xl w-full max-w-md text-center space-y-4">
        <h1 className="text-xl text-yellow-400 font-semibold">
          Confirm Booking
        </h1>

        <div className="text-sm text-gray-300 space-y-1">
          <p className="font-semibold text-white">{booking.movie}</p>
          <p>{booking.time}</p>
          <p>{booking.seats.join(", ")}</p>
        </div>

        <p className="text-yellow-400 text-2xl font-bold">
          ₹{booking.total}
        </p>

        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}

        <Button onClick={handlePayment} loading={loading}>
          {loading ? "Processing..." : "Confirm Booking"}
        </Button>
      </div>
    </main>
  );
}