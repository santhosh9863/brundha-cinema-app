import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const rows = await query("SELECT * FROM bookings");
    let revenue = 0;
    let seatsSold = 0;
    let todayBookings = 0;
    const movieMap = {};
    const timeMap = {};

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    rows.forEach((b) => {
      const total = Number(b.total) || 0;
      revenue += total;

      try {
        const seats = JSON.parse(b.seats || "[]");
        seatsSold += seats.length;
      } catch {
        // skip malformed
      }

      if (b.created_at) {
        try {
          const createdAt = new Date(b.created_at);
          if (createdAt >= todayStart) {
            todayBookings++;
          }
        } catch {
          // skip bad dates
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

    const activeShows = times.filter((t) => t.count > 0).length;

    return NextResponse.json({
      totalBookings: rows.length,
      revenue,
      seatsSold,
      todayBookings,
      activeShows,
      movies,
      times,
    });
  } catch (error) {
    console.error("ANALYTICS API ERROR:", error.message);
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
