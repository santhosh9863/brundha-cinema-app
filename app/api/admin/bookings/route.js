import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    // 🔥 GET ALL BOOKINGS
    const [rows] = await db.query(`
      SELECT id, movie, time, seats, total 
      FROM bookings
      ORDER BY id DESC
    `);

    // ✅ PARSE SEATS (important)
    const formatted = rows.map((b) => ({
      ...b,
      seats: typeof b.seats === "string"
        ? JSON.parse(b.seats)
        : b.seats,
    }));

    return NextResponse.json(formatted);

  } catch (error) {
    console.error("BOOKINGS ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}