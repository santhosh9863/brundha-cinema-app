import { NextResponse } from "next/server";
import { query } from "@/lib/db";

const VALID_MOVIES = ["Leo", "KGF Chapter 2", "RRR", "Pushpa"];
const VALID_TIMES = ["7:30 PM", "10:45 PM"];

export async function POST(req) {
  try {
    const body = await req.json();
    const { movie, time, seats, total } = body;

    if (!VALID_MOVIES.includes(movie)) {
      return NextResponse.json({ error: "Invalid movie" }, { status: 400 });
    }

    if (!VALID_TIMES.includes(time)) {
      return NextResponse.json({ error: "Invalid time" }, { status: 400 });
    }

    if (!Array.isArray(seats) || seats.length === 0) {
      return NextResponse.json({ error: "No seats selected" }, { status: 400 });
    }

    const existing = await query(
      "SELECT seats FROM bookings WHERE movie = ? AND time = ?",
      [movie, time]
    );

    const bookedSeats = existing.flatMap((row) => {
      try {
        return JSON.parse(row.seats || "[]");
      } catch {
        return [];
      }
    });

    const conflict = seats.find((s) => bookedSeats.includes(s));
    if (conflict) {
      return NextResponse.json(
        { error: `Seat already booked: ${conflict}` },
        { status: 400 }
      );
    }

    await query(
      "INSERT INTO bookings (movie, time, seats, total, created_at) VALUES (?, ?, ?, ?, NOW())",
      [movie, time, JSON.stringify(seats), total]
    );

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("BOOK API ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
