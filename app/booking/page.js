"use client";

import Select from "@/components/ui/Select";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "../context/BookingContext";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button";

export default function Booking() {
  const router = useRouter();
  const { setBooking } = useBooking();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);

  const [movie, setMovie] = useState("Leo");
  const [time, setTime] = useState("7:30 PM");

  const [error, setError] = useState("");

  // 🎯 RESPONSIVE SEAT CONFIG
  const sections = [
    {
      name: "DIAMOND",
      rows: 3,
      left: 5,
      right: 5,
      price: 300,
      code: "DIAMOND",
    },
    {
      name: "GOLD",
      rows: 5,
      left: 7,
      right: 7,
      price: 200,
      code: "GOLD",
    },
    {
      name: "SILVER",
      rows: 6,
      left: 9,
      right: 9,
      price: 150,
      code: "SILVER",
    },
  ];

  const totalSeats = sections.reduce(
    (sum, sec) => sum + sec.rows * (sec.left + sec.right),
    0
  );

  const isFull = bookedSeats.length >= totalSeats;

  // 🚀 REAL-TIME SEATS
  useEffect(() => {
    const eventSource = new EventSource(
      `/api/live-seats?movie=${movie}&time=${time}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setBookedSeats(data);
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, [movie, time]);

  useEffect(() => {
    if (isFull) setSelectedSeats([]);
  }, [isFull]);

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat) || isFull) return;

    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );

    setError("");
  };

  const getPrice = (seat) => {
    const type = seat.split("-")[0];
    if (type === "DIAMOND") return 300;
    if (type === "GOLD") return 200;
    return 150;
  };

  const total = selectedSeats.reduce(
    (sum, seat) => sum + getPrice(seat),
    0
  );

  // 🔥 CENTERED SECTION FIX
  const renderSection = (section) => {
    return (
      <div
        key={section.name}
        className="mb-8 sm:mb-10 flex flex-col items-center"
      >
        <h2 className="text-center text-xs sm:text-sm text-gray-400 mb-3 tracking-widest">
          {section.name} ₹{section.price}
        </h2>

        {Array.from({ length: section.rows }).map((_, rowIndex) => {
          const rowLabel = String.fromCharCode(65 + rowIndex);

          return (
            <div
              key={rowIndex}
              className="flex items-center justify-center gap-2 sm:gap-3 mb-2 w-full"
            >
              {/* Row Label */}
              <span className="text-[10px] sm:text-xs text-gray-500 w-4 text-center">
                {rowLabel}
              </span>

              {/* CENTER BLOCK */}
              <div className="flex justify-center items-center">
                {/* LEFT */}
                <div className="flex gap-1 sm:gap-2">
                  {Array.from({ length: section.left }).map((_, colIndex) => {
                    const seat = `${section.code}-${rowLabel}${colIndex + 1}`;
                    const isSelected = selectedSeats.includes(seat);
                    const isBooked = bookedSeats.includes(seat);

                    return (
                      <motion.div
                        key={seat}
                        onClick={() => toggleSeat(seat)}
                        whileHover={!isBooked ? { scale: 1.1 } : {}}
                        whileTap={!isBooked ? { scale: 0.9 } : {}}
                        className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-[8px] sm:text-[10px] rounded-md
                          ${
                            isBooked
                              ? "bg-red-500 cursor-not-allowed opacity-80"
                              : isSelected
                              ? "bg-yellow-400 text-black"
                              : section.code === "DIAMOND"
                              ? "bg-purple-500/30"
                              : section.code === "GOLD"
                              ? "bg-yellow-500/20"
                              : "bg-white/10"
                          }`}
                      >
                        {colIndex + 1}
                      </motion.div>
                    );
                  })}
                </div>

                {/* AISLE */}
                <div className="w-4 sm:w-8" />

                {/* RIGHT */}
                <div className="flex gap-1 sm:gap-2">
                  {Array.from({ length: section.right }).map((_, colIndex) => {
                    const seat = `${section.code}-${rowLabel}${
                      colIndex + section.left + 1
                    }`;

                    const isSelected = selectedSeats.includes(seat);
                    const isBooked = bookedSeats.includes(seat);

                    return (
                      <motion.div
                        key={seat}
                        onClick={() => toggleSeat(seat)}
                        whileHover={!isBooked ? { scale: 1.1 } : {}}
                        whileTap={!isBooked ? { scale: 0.9 } : {}}
                        className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-[8px] sm:text-[10px] rounded-md
                          ${
                            isBooked
                              ? "bg-red-500 cursor-not-allowed opacity-80"
                              : isSelected
                              ? "bg-yellow-400 text-black"
                              : section.code === "DIAMOND"
                              ? "bg-purple-500/30"
                              : section.code === "GOLD"
                              ? "bg-yellow-500/20"
                              : "bg-white/10"
                          }`}
                      >
                        {colIndex + section.left + 1}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-black text-white pt-16 sm:pt-20 px-3 sm:px-6">
      <h1 className="text-xl sm:text-3xl font-bold text-yellow-400 text-center mb-6">
        🎬 Book Your Show
      </h1>

      {/* SELECT */}
      <div className="max-w-md mx-auto mb-6 space-y-3 sm:space-y-4">
        <Select
          value={movie}
          onChange={setMovie}
          options={["Leo", "KGF Chapter 2", "RRR", "Pushpa"]}
        />
        <Select
          value={time}
          onChange={setTime}
          options={["7:30 PM", "10:45 PM"]}
        />
      </div>

      {/* FULL */}
      {isFull && (
        <div className="text-center text-red-500 font-semibold mb-4 text-sm">
          🚫 Bookings Full
        </div>
      )}

      {/* SCREEN */}
      <div className="text-center mb-6">
        <div className="w-[95%] sm:w-[80%] mx-auto h-2 sm:h-3 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full blur-[2px]" />
        <p className="text-gray-500 text-[10px] sm:text-xs mt-2">
          SCREEN
        </p>
      </div>

      {/* SECTIONS */}
      {sections.map((section) => renderSection(section))}

      {/* LEGEND */}
      <div className="flex flex-wrap justify-center gap-4 mt-6 text-[10px] sm:text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-white/20 rounded" />
          Silver ₹150
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-500/20 rounded" />
          Gold ₹200
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-purple-500/30 rounded" />
          Diamond ₹300
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded" />
          Booked
        </div>
      </div>

      {/* SUMMARY */}
      {/* SUMMARY */}
<div className="mt-10 flex flex-col items-center justify-center w-full px-2">

  <p className="text-gray-400 text-xs sm:text-sm text-center break-words max-w-[95%]">
    {selectedSeats.length > 0
      ? selectedSeats.join(", ")
      : "No seats selected"}
  </p>

  <p className="text-yellow-400 text-lg sm:text-xl font-bold mt-2">
    ₹{total}
  </p>

  {error && (
    <div className="mt-2 text-red-400 text-xs sm:text-sm text-center">
      {error}
    </div>
  )}

  {/* ✅ FIXED BUTTON */}
  <div className="w-full max-w-md mt-4">
    <Button
      className="w-full py-3 text-sm sm:text-base rounded-xl"
      disabled={isFull}
      onClick={() => {
        if (selectedSeats.length === 0) {
          setError("Please select at least one seat");
          return;
        }

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
      {isFull ? "Bookings Full" : "Proceed to Payment"}
    </Button>
  </div>

</div>
    </main>
  );
}