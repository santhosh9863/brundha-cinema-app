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

    for (const b of rows) {
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
    }

    return NextResponse.json({
      totalBookings: rows.length,
      revenue,
      seatsSold,
      todayBookings,
      activeShows: Object.keys(timeMap).length,
      movies: Object.entries(movieMap).map(([name, count]) => ({ name, count })),
      times: Object.entries(timeMap).map(([name, count]) => ({ name, count })),
    });
  } catch (error) {
    console.error("DASHBOARD API ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
