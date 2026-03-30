"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Booking() {
  const rows = 5;
  const cols = 8;

  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState([]);

  const bookedSeats = ["0-2", "1-4", "2-5", "3-1"];

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;

    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  const getPrice = (seat) => {
    const row = Number(seat.split("-")[0]);
    return row < 2 ? 150 : 250;
  };

  const total = selectedSeats.reduce((sum, seat) => {
    return sum + getPrice(seat);
  }, 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0f] to-[#1a0f2e] text-white pt-24 px-6">

      {/* Title */}
      <h1 className="text-4xl font-bold text-center text-yellow-400 mb-10">
        🎟 Select Your Seats
      </h1>

      {/* Screen Glow */}
      <div className="text-center mb-10">
        <div className="w-2/3 mx-auto h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full shadow-[0_0_30px_rgba(255,200,0,0.6)]"></div>
        <p className="text-gray-400 text-sm mt-2">SCREEN</p>
      </div>

      {/* Seats */}
      <div className="flex flex-col items-center gap-4">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4">
            {Array.from({ length: cols }).map((_, colIndex) => {
              const seat = `${rowIndex}-${colIndex}`;
              const isSelected = selectedSeats.includes(seat);
              const isBooked = bookedSeats.includes(seat);

              return (
                <motion.div
                  key={seat}
                  onClick={() => toggleSeat(seat)}
                  whileHover={{ scale: isBooked ? 1 : 1.15 }}
                  whileTap={{ scale: isBooked ? 1 : 0.9 }}
                  className={`w-10 h-10 rounded-md cursor-pointer flex items-center justify-center text-xs font-semibold transition-all duration-300
                    ${
                      isBooked
                        ? "bg-red-500 cursor-not-allowed opacity-70"
                        : isSelected
                        ? "bg-yellow-400 text-black shadow-[0_0_15px_rgba(255,200,0,0.8)]"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                >
                  {rowIndex + 1}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-8 mt-10 text-sm">
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white/20 rounded"></div> Available
        </span>
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded"></div> Selected
        </span>
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div> Booked
        </span>
      </div>

      {/* Summary */}
      <div className="text-center mt-12">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-400"
        >
          Seats Selected: {selectedSeats.length}
        </motion.p>

        <motion.p
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-yellow-400 text-2xl font-bold mt-2"
        >
          Total: ₹{total}
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            router.push(`/payment?seats=${selectedSeats.length}&total=${total}`)
          }
          className="mt-6 px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold rounded-lg shadow-[0_0_20px_rgba(255,200,0,0.6)]"
        >
          Proceed to Payment
        </motion.button>
      </div>

    </main>
  );
}