import db from "@/lib/db";
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const movie = searchParams.get("movie");
    const time = searchParams.get("time");

    const [rows] = await db.execute(
      "SELECT seats FROM bookings WHERE movie = ? AND time = ?",
      [movie, time]
    );

    const bookedSeats = rows.flatMap((row) =>
      JSON.parse(row.seats)
    );

    return Response.json({ bookedSeats });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}