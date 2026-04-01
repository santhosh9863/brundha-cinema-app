"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [heatmap, setHeatmap] = useState([]);

  // 🔥 Fetch bookings
  const fetchBookings = async () => {
    const res = await fetch("/api/admin/bookings");
    const data = await res.json();
    setBookings(data);

    // Build heatmap
    let seats = [];
    data.forEach(b => {
      const s = Array.isArray(b.seats) ? b.seats : JSON.parse(b.seats);
      seats.push(...s);
    });
    setHeatmap(seats);
  };

  // 📊 Fetch analytics
  const fetchStats = async () => {
    const res = await fetch("/api/admin/analytics");
    const data = await res.json();
    setStats(data);
  };

  useEffect(() => {
    fetchBookings();
    fetchStats();

    // ⚡ LIVE REFRESH EVERY 3s
    const interval = setInterval(() => {
      fetchBookings();
      fetchStats();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // ❌ Delete
  const deleteBooking = async (id) => {
    await fetch("/api/admin/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    fetchBookings();
    fetchStats();
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">

  <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
    🎬 Admin Dashboard
  </h1>

  {/* CONTAINER */}
  <div className="max-w-6xl mx-auto overflow-x-auto">

    <table className="w-full border border-gray-700 rounded-lg overflow-hidden">

      <thead className="bg-white/10 text-sm">
        <tr>
          <th className="p-3 text-left">Movie</th>
          <th className="p-3 text-left">Time</th>
          <th className="p-3 text-left">Seats</th>
          <th className="p-3 text-left">Total</th>
          <th className="p-3 text-left">Action</th>
        </tr>
      </thead>

      <tbody>
        {bookings.map((booking) => (
          <tr
            key={booking.id}
            className="border-t border-gray-700 hover:bg-white/5 transition"
          >
            <td className="p-3">{booking.movie}</td>

            <td className="p-3">{booking.time}</td>

            <td className="p-3 text-xs break-words max-w-[200px]">
              {booking.seats.join(", ")}
            </td>

            <td className="p-3 text-yellow-400 font-semibold">
              ₹{booking.total}
            </td>

            <td className="p-3">
              <button
                onClick={() => deleteBooking(booking.id)}
                className="bg-red-500 px-3 py-1 rounded text-xs hover:bg-red-600"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>

    </table>

  </div>
</main>
  );
}