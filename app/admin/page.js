"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [tab, setTab] = useState("overview");

  const fetchData = async () => {
    try {
      const [analyticsRes, bookingsRes] = await Promise.all([
        fetch("/api/dashboard/analytics"),
        fetch("/api/dashboard/bookings"),
      ]);
      const analyticsData = await analyticsRes.json();
      const bookingsData = await bookingsRes.json();
      setAnalytics(analyticsData);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    setDeleting(id);
    try {
      const res = await fetch("/api/dashboard/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
        fetchData();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/60 text-sm">Loading dashboard...</p>
        </motion.div>
      </main>
    );
  }

  const stats = [
    {
      label: "Total Bookings",
      value: analytics?.totalBookings ?? 0,
      icon: "🎬",
      color: "from-yellow-400/20 to-yellow-600/5",
      border: "border-yellow-400/30",
    },
    {
      label: "Revenue",
      value: `₹${(analytics?.revenue ?? 0).toLocaleString()}`,
      icon: "💰",
      color: "from-green-400/20 to-green-600/5",
      border: "border-green-400/30",
    },
    {
      label: "Seats Sold",
      value: analytics?.seatsSold ?? 0,
      icon: "💺",
      color: "from-purple-400/20 to-purple-600/5",
      border: "border-purple-400/30",
    },
    {
      label: "Today's Bookings",
      value: analytics?.todayBookings ?? 0,
      icon: "📅",
      color: "from-blue-400/20 to-blue-600/5",
      border: "border-blue-400/30",
    },
    {
      label: "Active Shows",
      value: analytics?.activeShows ?? 0,
      icon: "🎭",
      color: "from-pink-400/20 to-pink-600/5",
      border: "border-pink-400/30",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text">
              Admin Dashboard
            </h1>
            <p className="text-white/50 text-sm mt-1">
              Manage your cinema bookings and analytics
            </p>
          </div>
          <button
            onClick={() => {
              setLoading(true);
              fetchData();
            }}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-sm transition-all flex items-center gap-2"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {["overview", "bookings"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {t === "overview" ? "📊 Overview" : "📋 Bookings"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`glass rounded-xl p-5 bg-gradient-to-br ${stat.color} border ${stat.border}`}
                  >
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <div className="text-2xl sm:text-3xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-white/50 text-xs mt-1 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Popular Movies */}
                <div className="glass rounded-xl p-6 border border-white/10">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    🎥 Popular Movies
                  </h2>
                  {analytics?.movies?.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.movies.map((movie, i) => {
                        const max = Math.max(
                          ...analytics.movies.map((m) => m.count)
                        );
                        const pct = (movie.count / max) * 100;
                        return (
                          <div key={movie.name} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-white/80 truncate mr-2">
                                {movie.name}
                              </span>
                              <span className="text-yellow-400 font-medium shrink-0">
                                {movie.count} booking{movie.count !== 1 && "s"}
                              </span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{
                                  delay: 0.3 + i * 0.1,
                                  duration: 0.6,
                                }}
                                className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-white/30 text-sm">No data yet</p>
                  )}
                </div>

                {/* Popular Times */}
                <div className="glass rounded-xl p-6 border border-white/10">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    ⏰ Popular Show Times
                  </h2>
                  {analytics?.times?.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.times.map((time, i) => {
                        const max = Math.max(
                          ...analytics.times.map((t) => t.count)
                        );
                        const pct = (time.count / max) * 100;
                        return (
                          <div key={time.name} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-white/80">{time.name}</span>
                              <span className="text-purple-400 font-medium">
                                {time.count} booking{time.count !== 1 && "s"}
                              </span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{
                                  delay: 0.3 + i * 0.1,
                                  duration: 0.6,
                                }}
                                className="h-full rounded-full bg-gradient-to-r from-purple-400 to-violet-500"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-white/30 text-sm">No data yet</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {tab === "bookings" && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass rounded-xl border border-white/10 overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    All Bookings ({bookings.length})
                  </h2>
                </div>

                {bookings.length === 0 ? (
                  <div className="p-12 text-center text-white/30">
                    <div className="text-4xl mb-3">📭</div>
                    <p>No bookings yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-white/50 text-left border-b border-white/10">
                          <th className="px-4 py-3 font-medium">ID</th>
                          <th className="px-4 py-3 font-medium">Movie</th>
                          <th className="px-4 py-3 font-medium">Time</th>
                          <th className="px-4 py-3 font-medium">Seats</th>
                          <th className="px-4 py-3 font-medium">Total</th>
                          <th className="px-4 py-3 font-medium">Paid</th>
                          <th className="px-4 py-3 font-medium">Date</th>
                          <th className="px-4 py-3 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b, i) => (
                          <motion.tr
                            key={b.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.03 }}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                          >
                            <td className="px-4 py-3 text-white/60">
                              #{b.id}
                            </td>
                            <td className="px-4 py-3 font-medium text-white">
                              {b.movie}
                            </td>
                            <td className="px-4 py-3 text-white/70">
                              {b.time}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {(Array.isArray(b.seats)
                                  ? b.seats
                                  : []
                                ).map((s, idx) => (
                                  <span
                                    key={idx}
                                    className="px-1.5 py-0.5 bg-yellow-400/10 text-yellow-400 rounded text-xs"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-green-400 font-medium">
                              ₹{b.total}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  b.paid
                                    ? "bg-green-400/10 text-green-400"
                                    : "bg-red-400/10 text-red-400"
                                }`}
                              >
                                {b.paid ? "Paid" : "Unpaid"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-white/50 text-xs">
                              {b.created_at
                                ? new Date(b.created_at).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )
                                : "—"}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleDelete(b.id)}
                                disabled={deleting === b.id}
                                className="px-3 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium transition-all disabled:opacity-50"
                              >
                                {deleting === b.id ? "..." : "Delete"}
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}