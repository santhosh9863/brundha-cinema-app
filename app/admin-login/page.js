"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ SUCCESS → redirect
      router.push("/admin");

    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-4">

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-6 rounded-xl w-full max-w-sm space-y-4 text-center"
      >
        <h1 className="text-xl text-yellow-400 font-semibold">
          🔐 Admin Login
        </h1>

        {/* USERNAME */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 rounded bg-white/10 border border-white/20 focus:outline-none"
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-white/10 border border-white/20 focus:outline-none"
        />

        {/* ERROR */}
        {error && (
          <div className="text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full bg-yellow-400 text-black py-2 rounded font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </motion.div>
    </main>
  );
}