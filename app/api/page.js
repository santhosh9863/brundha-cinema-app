"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data));
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">
        Admin Dashboard
      </h1>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-400 border-b border-white/10">
            <th className="p-2">Movie</th>
            <th className="p-2">Time</th>
            <th className="p-2">Seats</th>
            <th className="p-2">Amount</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b, i) => (
            <tr key={i} className="border-b border-white/10">
              <td className="p-2">{b.movie}</td>
              <td className="p-2">{b.time}</td>
              <td className="p-2">{b.seats.join(", ")}</td>
              <td className="p-2">₹{b.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}