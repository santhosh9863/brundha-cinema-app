import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req) {
  try {
    const [rows] = await db.query("SELECT * FROM bookings");

    let revenue = 0;
    let seatsSold = 0;

    rows.forEach((b) => {
      revenue += b.total || 0;

      try {
        const seats = JSON.parse(b.seats || "[]");
        seatsSold += seats.length;
      } catch {
        // skip malformed rows
      }
    });

    return NextResponse.json({
      totalBookings: rows.length,
      revenue,
      seatsSold,
    });
  } catch (error) {
    console.error("ANALYTICS ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}