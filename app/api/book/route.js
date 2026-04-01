import { NextResponse } from "next/server";
import { query } from "@/lib/db";

const VALID_MOVIES = ["Leo", "KGF Chapter 2", "RRR", "Pushpa"];
const VALID_TIMES = ["7:30 PM", "10:45 PM"];

export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { movie, time, seats, total, paid } = body;

    if (!movie || typeof movie !== "string" || !VALID_MOVIES.includes(movie)) {
      return NextResponse.json({ error: "Invalid movie selection" }, { status: 400 });
    }

    if (!time || typeof time !== "string" || !VALID_TIMES.includes(time)) {
      return NextResponse.json({ error: "Invalid show time" }, { status: 400 });
    }

    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      return NextResponse.json({ error: "No seats selected" }, { status: 400 });
    }

    if (seats.length > 10) {
      return NextResponse.json({ error: "Maximum 10 seats per booking" }, { status: 400 });
    }

    if (!total || typeof total !== "number" || total <= 0) {
      return NextResponse.json({ error: "Invalid total amount" }, { status: 400 });
    }

    const existing = await query(
      "SELECT id, seats FROM bookings WHERE movie = ? AND time = ?",
      [movie, time]
    );

    const bookedSeats = existing.flatMap((row) => {
      try {
        return JSON.parse(row.seats || "[]");
      } catch {
        return [];
      }
    });

    const conflicts = seats.filter((seat) => bookedSeats.includes(seat));

    if (conflicts.length > 0) {
      return NextResponse.json(
        { error: `Seat${conflicts.length > 1 ? "s" : ""} ${conflicts.join(", ")} already booked` },
        { status: 400 }
      );
    }

    await query(
      "INSERT INTO bookings (movie, time, seats, total) VALUES (?, ?, ?, ?)",
      [movie, time, JSON.stringify(seats), total]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("BOOK API ERROR:", err.message);
    return NextResponse.json({ error: err.message || "Booking failed" }, { status: 500 });
  }
}
