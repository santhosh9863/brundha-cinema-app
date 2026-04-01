import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req) {
  try {
    const { seat, movie, time } = await req.json();

    if (!seat || !movie || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const rows = await query(
      "SELECT id, seats FROM bookings WHERE movie = ? AND time = ?",
      [movie, time]
    );

    for (let row of rows) {
      let seats;
      try {
        seats = JSON.parse(row.seats || "[]");
      } catch {
        continue;
      }

      if (seats.includes(seat)) {
        const updatedSeats = seats.filter((s) => s !== seat);

        if (updatedSeats.length === 0) {
          await query("DELETE FROM bookings WHERE id = ?", [row.id]);
        } else {
          await query(
            "UPDATE bookings SET seats = ? WHERE id = ?",
            [JSON.stringify(updatedSeats), row.id]
          );
        }

        return NextResponse.json({ success: true });
      }
    }

    return NextResponse.json({ error: "Seat not found" }, { status: 404 });
  } catch (err) {
    console.error("DELETE SEAT ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
