import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req) {
  try {
    const [rows] = await db.query(`
      SELECT id, movie, time, seats, total, paid, created_at
      FROM bookings
      ORDER BY id DESC
    `);

    const formatted = rows.map((b) => ({
      ...b,
      seats: typeof b.seats === "string"
        ? JSON.parse(b.seats)
        : b.seats,
      paid: Boolean(b.paid),
      created_at: b.created_at
        ? new Date(b.created_at).toISOString()
        : new Date().toISOString(),
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