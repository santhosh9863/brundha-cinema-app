"use client";

import { createContext, useContext, useState, useEffect } from "react";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState({
    seats: [],
    total: 0,
    movie: "",
    time: "",
    paid: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("booking");
    if (saved) {
      setBooking(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("booking", JSON.stringify(booking));
  }, [booking]);

  return (
    <BookingContext.Provider value={{ booking, setBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error("useBooking must be used inside BookingProvider");
  }

  return context;
}