"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "../context/BookingContext";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../components/ui/Button";

const MOVIES = [
  { name: "Leo", genre: "Action Thriller", rating: "8.2", emoji: "🦁" },
  { name: "KGF Chapter 2", genre: "Period Action", rating: "8.4", emoji: "⚔️" },
  { name: "RRR", genre: "Epic Drama", rating: "8.0", emoji: "🔥" },
  { name: "Pushpa", genre: "Action Drama", rating: "7.6", emoji: "🌿" },
];

const TIMES = ["7:30 PM", "10:45 PM"];

const SECTIONS = [
  { name: "DIAMOND", rows: 3, left: 5, right: 5, price: 300, code: "DIAMOND" },
  { name: "GOLD", rows: 5, left: 7, right: 7, price: 200, code: "GOLD" },
  { name: "SILVER", rows: 6, left: 9, right: 9, price: 150, code: "SILVER" },
];

const TOTAL_SEATS = SECTIONS.reduce(
  (sum, sec) => sum + sec.rows * (sec.left + sec.right),
  0
);

const PRICE_MAP = { DIAMOND: 300, GOLD: 200, SILVER: 150 };

function getPrice(seat) {
  const type = seat.split("-")[0];
  return PRICE_MAP[type] || 150;
}

export default function Booking() {
  const router = useRouter();
  const { setBooking } = useBooking();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [movie, setMovie] = useState(MOVIES[0].name);
  const [time, setTime] = useState(TIMES[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isFull = bookedSeats.length >= TOTAL_SEATS;

  const total = useMemo(
    () => selectedSeats.reduce((sum, seat) => sum + getPrice(seat), 0),
    [selectedSeats]
  );

  useEffect(() => {
    setLoading(true);
    setBookedSeats([]);
    setSelectedSeats([]);
    setError("");

    const eventSource = new EventSource(
      `/api/live-seats?movie=${encodeURIComponent(movie)}&time=${encodeURIComponent(time)}`
    );

    let timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setBookedSeats(Array.isArray(data) ? data : []);
        setLoading(false);
        clearTimeout(timeout);
      } catch {
        setBookedSeats([]);
        setLoading(false);
        clearTimeout(timeout);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      setLoading(false);
      clearTimeout(timeout);
    };

    return () => {
      eventSource.close();
      clearTimeout(timeout);
    };
  }, [movie, time]);

  useEffect(() => {
    if (isFull) setSelectedSeats([]);
  }, [isFull]);

  const toggleSeat = useCallback(
    (seat) => {
      if (bookedSeats.includes(seat) || isFull) return;

      setSelectedSeats((prev) =>
        prev.includes(seat)
          ? prev.filter((s) => s !== seat)
          : [...prev, seat]
      );

      setError("");
    },
    [bookedSeats, isFull]
  );

  const handleProceed = async () => {
    if (selectedSeats.length === 0) {
      setError("Please select at least one seat");
      return;
    }

    setSubmitting(true);
    setError("");

    setBooking({
      seats: selectedSeats,
      total,
      movie,
      time,
      paid: false,
    });

    router.push("/payment");
    setSubmitting(false);
  };

  const renderSection = (section) => {
    return (
      <div key={section.name} className="mb-8 flex flex-col items-center">
        <h2 className="text-center text-xs sm:text-sm text-gray-400 mb-3">
          {section.name} ₹{section.price}
        </h2>

        {Array.from({ length: section.rows }).map((_, rowIndex) => {
          const rowLabel = String.fromCharCode(65 + rowIndex);

          return (
            <div key={rowIndex} className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500 w-4 text-right">
                {rowLabel}
              </span>

              <div className="flex gap-1">
                {Array.from({ length: section.left + section.right }).map(
                  (_, colIndex) => {
                    const seat = `${section.code}-${rowLabel}${colIndex + 1}`;
                    const isSelected = selectedSeats.includes(seat);
                    const isBooked = bookedSeats.includes(seat);

                    return (
                      <motion.div
                        key={seat}
                        onClick={() => toggleSeat(seat)}
                        whileHover={!isBooked ? { scale: 1.15 } : {}}
                        whileTap={!isBooked ? { scale: 0.9 } : {}}
                        className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[9px] sm:text-[10px] rounded-md cursor-pointer select-none
                          ${
                            isBooked
                              ? "bg-red-500/70 cursor-not-allowed"
                              : isSelected
                              ? "bg-yellow-400 text-black shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                              : section.code === "DIAMOND"
                              ? "bg-purple-500/30 hover:bg-purple-500/50"
                              : section.code === "GOLD"
                              ? "bg-yellow-500/20 hover:bg-yellow-500/40"
                              : "bg-white/10 hover:bg-white/20"
                          }`}
                      >
                        {colIndex + 1}
                      </motion.div>
                    );
                  }
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-black text-white pt-16 px-3 pb-20">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-yellow-400 text-center mb-8"
      >
        Book Your Show
      </motion.h1>

      {/* MOVIE SELECTOR */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3 ml-1">
          Select Movie
        </p>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {MOVIES.map((m) => {
            const isActive = movie === m.name;
            return (
              <motion.div
                key={m.name}
                onClick={() => setMovie(m.name)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                layout
                className={`flex-shrink-0 snap-start w-36 sm:w-40 rounded-xl border cursor-pointer transition-all duration-300 overflow-hidden ${
                  isActive
                    ? "border-yellow-400/60 shadow-[0_0_25px_rgba(255,200,0,0.2)] bg-yellow-400/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="p-4 text-center">
                  <span className="text-2xl block mb-2">{m.emoji}</span>
                  <p className={`text-sm font-semibold truncate ${isActive ? "text-yellow-400" : "text-white"}`}>
                    {m.name}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{m.genre}</p>
                  <div className="flex items-center justify-center gap-1 mt-1.5">
                    <span className="text-[10px] text-yellow-400/80">★</span>
                    <span className="text-[10px] text-gray-400">{m.rating}</span>
                  </div>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="movie-glow"
                    className="h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* TIME SELECTOR */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3 ml-1">
          Select Time
        </p>
        <div className="flex gap-3">
          {TIMES.map((t) => {
            const isActive = time === t;
            return (
              <motion.button
                key={t}
                onClick={() => setTime(t)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-yellow-400 text-black shadow-[0_0_20px_rgba(255,200,0,0.4)]"
                    : "bg-white/5 text-gray-400 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:text-white"
                }`}
              >
                {t}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* LEGEND */}
      <div className="flex justify-center gap-4 mb-6 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-purple-500/30" />
          <span>Diamond ₹300</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-yellow-500/20" />
          <span>Gold ₹200</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-white/10" />
          <span>Silver ₹150</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-yellow-400" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-red-500/70" />
          <span>Booked</span>
        </div>
      </div>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-400 mb-4 animate-pulse"
        >
          Loading available seats...
        </motion.div>
      )}

      {isFull && !loading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-red-500 mb-4 font-semibold"
        >
          All seats booked for this show
        </motion.div>
      )}

      {/* SEATS */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-fit flex flex-col items-center">
          {SECTIONS.map((section) => renderSection(section))}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="mt-10 text-center">
        <AnimatePresence mode="wait">
          {selectedSeats.length > 0 ? (
            <motion.p
              key="seats"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-gray-300 text-sm font-medium"
            >
              {selectedSeats.join(", ")}
            </motion.p>
          ) : (
            <motion.p
              key="empty"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-gray-500 text-sm"
            >
              No seats selected
            </motion.p>
          )}
        </AnimatePresence>

        <motion.p
          key={total}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-yellow-400 text-2xl font-bold mt-2"
        >
          ₹{total}
        </motion.p>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-2 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          className="mt-4 w-full max-w-md"
          disabled={isFull || selectedSeats.length === 0 || loading}
          loading={submitting}
          onClick={handleProceed}
        >
          {isFull ? "Bookings Full" : "Proceed to Payment"}
        </Button>
      </div>
    </main>
  );
}
