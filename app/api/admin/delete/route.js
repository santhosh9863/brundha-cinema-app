import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Booking ID required" }, { status: 400 });
    }

    await query("DELETE FROM bookings WHERE id = ?", [id]);

    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ message: "Failed to delete booking" }, { status: 500 });
  }
}
