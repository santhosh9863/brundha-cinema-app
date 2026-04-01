import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  const [rows] = await db.query("SELECT * FROM bookings");

  let revenue = 0;
  let seatsSold = 0;

  rows.forEach((b) => {
    revenue += b.total;

    const seats = JSON.parse(b.seats || "[]");
    seatsSold += seats.length;
  });

  return NextResponse.json({
    totalBookings: rows.length,
    revenue,
    seatsSold,
  });
}