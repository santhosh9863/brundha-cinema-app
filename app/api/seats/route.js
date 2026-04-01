import db from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const movie = searchParams.get("movie");
    const time = searchParams.get("time");

    if (!movie || !time) {
      return Response.json({ error: "Missing movie or time parameter" }, { status: 400 });
    }

    const [rows] = await db.execute(
      "SELECT seats FROM bookings WHERE movie = ? AND time = ?",
      [movie, time]
    );

    const bookedSeats = rows.flatMap((row) => {
      try {
        return JSON.parse(row.seats || "[]");
      } catch {
        return [];
      }
    });

    return Response.json({ bookedSeats });
  } catch (err) {
    console.error("SEATS API ERROR:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
