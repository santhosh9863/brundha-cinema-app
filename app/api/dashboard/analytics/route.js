import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const rows = await query("SELECT * FROM bookings");

    let revenue = 0;
    let seatsSold = 0;
    let todayBookings = 0;

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const movieMap = {};
    const timeMap = {};

    rows.forEach((b) => {
      const total = Number(b.total) || 0;
      revenue += total;

      try {
        const seats = JSON.parse(b.seats || "[]");
        seatsSold += seats.length;
      } catch {}

      if (b.created_at) {
        const createdAt = new Date(b.created_at);
        if (createdAt >= todayStart) {
          todayBookings++;
        }
      }

      const movieName = b.movie || "Unknown";
      movieMap[movieName] = (movieMap[movieName] || 0) + 1;

      const timeName = b.time || "Unknown";
      timeMap[timeName] = (timeMap[timeName] || 0) + 1;
    });

    const movies = Object.entries(movieMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const times = Object.entries(timeMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const activeShows = new Set(rows.map((b) => b.time)).size;

    return NextResponse.json({
      totalBookings: rows.length,
      revenue,
      seatsSold,
      todayBookings,
      activeShows,
      movies,
      times,
    });

  } catch (err) {
    console.error("ANALYTICS API ERROR:", err);

    return NextResponse.json({
      totalBookings: 0,
      revenue: 0,
      seatsSold: 0,
      todayBookings: 0,
      activeShows: 0,
      movies: [],
      times: [],
    });
  }
}