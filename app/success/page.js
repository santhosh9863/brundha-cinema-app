"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "../context/BookingContext";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../components/ui/Button";

export default function Booking() {
  const rows = 5;
  const cols = 8;

  const router = useRouter();
  const { setBooking } = useBooking();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [movie, setMovie] = useState("Leo");
  const [time, setTime] = useState("7:30 PM");
  const [error, setError] = useState("");

  const bookedSeats = ["A3", "B5", "C6", "D2"];

  const getSeatLabel = (row, col) =>
    `${String.fromCharCode(65 + row)}${col + 1}`;

  // 🔥 MICRO HAPTIC (VIBRATION)
  const vibrate = (pattern = [10]) => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) {
      vibrate([20, 40, 20]); // blocked vibration
      return;
    }

    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );

    vibrate([10]); // tap feedback
    setError("");
  };

  const getPrice = (seat) => {
    const row = seat.charCodeAt(0) - 65;
    return row < 2 ? 150 : 250;
  };

  const total = selectedSeats.reduce(
    (sum, seat) => sum + getPrice(seat),
    0
  );

  return (
    <main className="min-h-screen bg-black text-white pt-20 px-4 sm:px-6">

      <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400 text-center mb-6">
        🎬 Book Your Show
      </h1>

      <div className="max-w-md mx-auto mb-6 space-y-4">
        <select
          value={movie}
          onChange={(e) => setMovie(e.target.value)}
          className="w-full p-3 bg-black border border-white/20 rounded"
        >
          <option>Leo</option>
          <option>KGF Chapter 2</option>
          <option>RRR</option>
          <option>Pushpa</option>
        </select>

        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-3 bg-black border border-white/20 rounded"
        >
          <option>7:30 PM</option>
          <option>10:45 PM</option>
        </select>
      </div>

      <div className="text-center mb-6">
        <div className="w-[90%] sm:w-2/3 mx-auto h-3 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full blur-[2px]" />
        <p className="text-gray-500 text-xs mt-2 tracking-widest">
          SCREEN
        </p>
      </div>

      <div className="flex flex-col items-center gap-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-2">

            <span className="text-xs text-gray-500 w-4">
              {String.fromCharCode(65 + rowIndex)}
            </span>

            <div className="flex gap-2">
              {Array.from({ length: cols }).map((_, colIndex) => {
                const seat = getSeatLabel(rowIndex, colIndex);
                const isSelected = selectedSeats.includes(seat);
                const isBooked = bookedSeats.includes(seat);

                return (
                  <motion.div
                    key={seat}
                    onClick={() => toggleSeat(seat)}
                    whileHover={!isBooked ? { scale: 1.12 } : {}}
                    whileTap={!isBooked ? { scale: 0.88 } : {}}
                    animate={
                      isSelected
                        ? { scale: [1, 1.25, 1], rotate: [0, -2, 2, 0] }
                        : {}
                    }
                    transition={{ duration: 0.3 }}
                    className={`w-9 h-9 flex items-center justify-center text-[10px] rounded-md cursor-pointer
                      ${
                        isBooked
                          ? "bg-red-500/70 cursor-not-allowed"
                          : isSelected
                          ? "bg-yellow-400 text-black shadow-[0_0_20px_rgba(255,200,0,1)]"
                          : "bg-white/10 hover:bg-white/20"
                      }`}
                  >
                    {colIndex + 1}

                    {/* 🔥 RIPPLE EFFECT */}
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0.6 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute w-6 h-6 rounded-full bg-yellow-400/30"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

          </div>
        ))}
      </div>

      <div className="text-center mt-10 flex flex-col items-center">

        <p className="text-gray-400 text-sm">
          {selectedSeats.join(", ") || "No seats selected"}
        </p>

        <p className="text-yellow-400 text-xl font-bold mt-2">
          ₹{total}
        </p>

        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                x: [0, -6, 6, -4, 4, 0],
              }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="mt-5 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 backdrop-blur-md shadow-[0_0_25px_rgba(255,0,0,0.25)] relative overflow-hidden"
            >
              <span className="relative z-10">
                Please select at least one seat
              </span>

              <motion.div
                initial={{ opacity: 0.2 }}
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-red-500/10 blur-xl"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          className="mt-6"
          onClick={() => {
            if (selectedSeats.length === 0) {
              vibrate([30, 50, 30]); // 🔥 error vibration
              setError("error");
              return;
            }

            setError("");

            setBooking({
              seats: selectedSeats,
              total,
              movie,
              time,
              paid: false,
            });

            router.push("/payment");
          }}
        >
          Proceed to Payment
        </Button>

      </div>

    </main>
  );
}