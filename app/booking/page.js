"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "../context/BookingContext";
import { motion } from "framer-motion";
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

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;

    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );

    setError(""); // clear error on selection
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
                    whileHover={!isBooked ? { scale: 1.15 } : {}}
                    whileTap={!isBooked ? { scale: 0.9 } : {}}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className={`w-9 h-9 flex items-center justify-center text-[10px] rounded-md cursor-pointer
                      ${
                        isBooked
                          ? "bg-red-500/70 cursor-not-allowed"
                          : isSelected
                          ? "bg-yellow-400 text-black shadow-[0_0_15px_rgba(255,200,0,0.9)]"
                          : "bg-white/10 hover:bg-white/20"
                      }`}
                  >
                    {colIndex + 1}
                  </motion.div>
                );
              })}
            </div>

          </div>
        ))}
      </div>

      <div className="flex justify-center gap-6 mt-6 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white/20 rounded" />
          Available
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded" />
          Selected
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded" />
          Booked
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center text-center">

        <p className="text-gray-400 text-sm">
          {selectedSeats.length > 0
            ? selectedSeats.join(", ")
            : "No seats selected"}
        </p>

        <p className="text-yellow-400 text-xl font-bold mt-2">
          ₹{total}
        </p>

        {error && (
          <div className="mt-4 px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <Button
          className="mt-4"
          onClick={() => {
            if (selectedSeats.length === 0) {
              setError("Please select at least one seat");
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