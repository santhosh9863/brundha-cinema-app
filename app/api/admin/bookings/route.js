import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const rows = await query("SELECT * FROM bookings ORDER BY id DESC");

    const formatted = rows.map((b) => {
      let seats = [];
      try {
        seats = typeof b.seats === "string" ? JSON.parse(b.seats) : b.seats;
      } catch {
        seats = [];
      }
      return {
        id: b.id,
        movie: b.movie || "Unknown",
        time: b.time || "Unknown",
        seats,
        total: Number(b.total) || 0,
        paid: Boolean(b.paid),
        created_at: b.created_at || null,
      };
    });

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("BOOKINGS API ERROR:", err.message);
    return NextResponse.json([], { status: 200 });
  }
}
