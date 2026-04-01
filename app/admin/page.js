"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MOVIES = ["Leo", "KGF Chapter 2", "RRR", "Pushpa"];
const TIMES = ["7:30 PM", "10:45 PM"];

export default function AdminPage() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterMovie, setFilterMovie] = useState("all");
  const [filterTime, setFilterTime] = useState("all");
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/bookings");

      if (!res.ok) {
        console.error("Bookings API returned:", res.status);
        setBookings([]);
        return;
      }

      const data = await res.json();

      console.log("BOOKINGS DATA 👉", data); // ✅ DEBUG

      // ✅ FIX: support both formats
      if (Array.isArray(data)) {
        setBookings(data);
      } else if (Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      } else {
        console.error("Unexpected bookings format:", data);
        setBookings([]);
      }

    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/analytics");

      if (!res.ok) {
        console.error("Analytics API returned:", res.status);
        setStats({
          totalBookings: 0,
          revenue: 0,
          seatsSold: 0,
          todayBookings: 0,
          activeShows: 0,
          movies: [],
          times: [],
        });
        return;
      }

      const data = await res.json();
      setStats(data);

    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setStats({
        totalBookings: 0,
        revenue: 0,
        seatsSold: 0,
        todayBookings: 0,
        activeShows: 0,
        movies: [],
        times: [],
      });
    }
  }, []);

  useEffect(() => {
    fetchBookings();
    fetchStats();

    const interval = setInterval(() => {
      fetchBookings();
      fetchStats();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchBookings, fetchStats]);

  const deleteBooking = useCallback(async (id) => {
    setDeleting(id);
    try {
      const res = await fetch("/api/admin/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        fetchBookings();
        fetchStats();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(null);
    }
  }, [fetchBookings, fetchStats]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        search === "" ||
        b.movie?.toLowerCase().includes(search.toLowerCase()) ||
        (Array.isArray(b.seats) &&
          b.seats.some((s) =>
            s.toLowerCase().includes(search.toLowerCase())
          ));

      const matchMovie =
        filterMovie === "all" || b.movie === filterMovie;

      const matchTime =
        filterTime === "all" || b.time === filterTime;

      return matchSearch && matchMovie && matchTime;
    });
  }, [bookings, search, filterMovie, filterTime]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm animate-pulse">
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 sm:p-6 pb-16">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400">
            Admin Dashboard
          </h1>
          <button
            onClick={() => {
              fetchBookings();
              fetchStats();
            }}
            className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-gray-400 hover:text-white transition"
          >
            Refresh
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Bookings", value: stats.totalBookings, color: "text-yellow-400" },
              { label: "Revenue", value: `₹${stats.revenue}`, color: "text-green-400" },
              { label: "Seats Sold", value: stats.seatsSold, color: "text-purple-400" },
              { label: "Active Shows", value: stats.activeShows, color: "text-orange-400" },
            ].map((card) => (
              <div key={card.label} className="glass rounded-xl p-4 border border-white/10">
                <p className="text-xs text-gray-500 uppercase">{card.label}</p>
                <p className={`text-2xl font-bold mt-1 ${card.color}`}>
                  {card.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <p className="text-lg">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.movie}</td>
                    <td>{b.time}</td>
                    <td>{Array.isArray(b.seats) ? b.seats.join(", ") : b.seats}</td>
                    <td>₹{b.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </main>
  );
}