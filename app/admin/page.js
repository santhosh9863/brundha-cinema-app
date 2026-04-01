"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "border-green-400/30 bg-green-500/10 text-green-300",
    error: "border-red-400/30 bg-red-500/10 text-red-300",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg ${colors[type]}`}
    >
      <span className="text-lg">{type === "success" ? "✓" : "✕"}</span>
      <span className="text-sm font-medium">{message}</span>
    </motion.div>
  );
}

function ConfirmModal({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative glass rounded-2xl p-6 max-w-sm w-full border border-white/10"
      >
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-white/20 text-gray-300 hover:bg-white/5 text-sm transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ icon, label, value, prefix, accent, delay }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (typeof value !== "number") return;
    let start = 0;
    const duration = 1200;
    const steps = 40;
    const increment = value / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4, boxShadow: `0 8px 30px ${accent}20` }}
      className="glass rounded-2xl p-5 border border-white/10 relative overflow-hidden group"
    >
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-1">
            {prefix}{typeof value === "number" ? display.toLocaleString() : value}
          </p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </motion.div>
  );
}

function BarChart({ data, accent = "#ffd700" }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-600 py-8 text-sm">No data available</div>
    );
  }

  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="group"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-300 font-medium truncate max-w-[140px]">
              {item.name}
            </span>
            <span className="text-xs text-gray-500">{item.count} booking{item.count !== 1 ? "s" : ""}</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(item.count / max) * 100}%` }}
              transition={{ duration: 0.8, delay: i * 0.08 + 0.3, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${accent}, ${accent}88)`,
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

const MOVIES = ["Leo", "KGF Chapter 2", "RRR", "Pushpa"];
const TIMES = ["7:30 PM", "10:45 PM"];

export default function AdminPage() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterMovie, setFilterMovie] = useState("all");
  const [filterTime, setFilterTime] = useState("all");
  const [deleting, setDeleting] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchAll = useCallback(async () => {
    try {
      const [bookingsRes, statsRes] = await Promise.all([
        fetch("/api/admin/bookings"),
        fetch("/api/admin/analytics"),
      ]);

      if (bookingsRes.status === 401 || statsRes.status === 401) {
        setError("Unauthorized. Please log in as admin.");
        setLoading(false);
        return;
      }

      if (!bookingsRes.ok || !statsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const bookingsData = await bookingsRes.json();
      const statsData = await statsRes.json();

      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setStats(statsData);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 10000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const handleDeleteRequest = useCallback((booking) => {
    setConfirmModal({
      booking,
      title: "Delete Booking",
      message: `Are you sure you want to delete the booking for "${booking.movie}" (${booking.seats.length} seat${booking.seats.length > 1 ? "s" : ""})? This cannot be undone.`,
    });
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!confirmModal) return;

    const id = confirmModal.booking.id;
    setDeleting(id);

    try {
      const res = await fetch("/api/admin/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        addToast("Booking deleted successfully", "success");
        fetchAll();
      } else {
        const data = await res.json();
        addToast(data.message || "Failed to delete booking", "error");
      }
    } catch (err) {
      addToast("Network error. Please try again.", "error");
    } finally {
      setDeleting(null);
      setConfirmModal(null);
    }
  }, [confirmModal, addToast, fetchAll]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        search === "" ||
        b.movie.toLowerCase().includes(search.toLowerCase()) ||
        (Array.isArray(b.seats) && b.seats.some((s) => s.toLowerCase().includes(search.toLowerCase())));

      const matchMovie = filterMovie === "all" || b.movie === filterMovie;
      const matchTime = filterTime === "all" || b.time === filterTime;

      return matchSearch && matchMovie && matchTime;
    });
  }, [bookings, search, filterMovie, filterTime]);

  const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm animate-pulse">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pb-16">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Dashboard
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage bookings and monitor performance
              </p>
            </div>
            <button
              onClick={fetchAll}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 text-sm transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </motion.div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
          <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4 text-red-300 text-sm">
            {error}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon="🎫"
              label="Total Bookings"
              value={stats.totalBookings}
              accent="#ffd700"
              delay={0}
            />
            <StatCard
              icon="₹"
              label="Total Revenue"
              value={stats.revenue}
              prefix="₹"
              accent="#22c55e"
              delay={0.1}
            />
            <StatCard
              icon="💺"
              label="Seats Booked"
              value={stats.seatsSold}
              accent="#a855f7"
              delay={0.2}
            />
            <StatCard
              icon="🎬"
              label="Active Shows"
              value={stats.activeShows || 0}
              accent="#f97316"
              delay={0.3}
            />
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-5 border border-white/10"
            >
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Bookings by Movie
              </h3>
              <BarChart data={stats.movies || []} accent="#ffd700" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-2xl p-5 border border-white/10"
            >
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Bookings by Show Time
              </h3>
              <BarChart data={stats.times || []} accent="#a855f7" />
            </motion.div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl p-4 border border-white/10"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by movie or seat..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20 transition"
              />
            </div>
            <select
              value={filterMovie}
              onChange={(e) => setFilterMovie(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-yellow-400/50 transition appearance-none cursor-pointer"
            >
              <option value="all" className="bg-black">All Movies</option>
              {MOVIES.map((m) => (
                <option key={m} value={m} className="bg-black">{m}</option>
              ))}
            </select>
            <select
              value={filterTime}
              onChange={(e) => setFilterTime(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-yellow-400/50 transition appearance-none cursor-pointer"
            >
              <option value="all" className="bg-black">All Times</option>
              {TIMES.map((t) => (
                <option key={t} value={t} className="bg-black">{t}</option>
              ))}
            </select>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass rounded-2xl border border-white/10 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Bookings
            </h3>
            <span className="text-xs text-gray-600">
              {filteredBookings.length} result{filteredBookings.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg mb-1">No bookings found</p>
              <p className="text-gray-700 text-sm">
                {search || filterMovie !== "all" || filterTime !== "all"
                  ? "Try adjusting your filters"
                  : "Bookings will appear here"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-5 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-medium">Movie</th>
                    <th className="px-5 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-medium">Time</th>
                    <th className="px-5 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-medium">Seats</th>
                    <th className="px-5 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-medium">Total</th>
                    <th className="px-5 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-medium">Status</th>
                    <th className="px-5 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-medium">Date</th>
                    <th className="px-5 py-3 text-right text-xs text-gray-500 uppercase tracking-wider font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking, i) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-medium text-white">{booking.movie}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-gray-400">{booking.time}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-gray-500 max-w-[160px] block truncate">
                          {Array.isArray(booking.seats) ? booking.seats.join(", ") : booking.seats}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-semibold text-yellow-400">₹{booking.total}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            booking.paid
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${booking.paid ? "bg-green-400" : "bg-amber-400"}`} />
                          {booking.paid ? "Paid" : "Pending"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-gray-600">{formatDate(booking.created_at)}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleDeleteRequest(booking)}
                          disabled={deleting === booking.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deleting === booking.id ? (
                            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                          {deleting === booking.id ? "..." : "Delete"}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {confirmModal && (
          <ConfirmModal
            open={!!confirmModal}
            title={confirmModal.title}
            message={confirmModal.message}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setConfirmModal(null)}
            loading={deleting !== null}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
}
