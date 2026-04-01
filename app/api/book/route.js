import db from "@/lib/db";
export async function POST(req) {
  try {
    const body = await req.json();
    const { movie, time, seats, total, paid } = body;

    if (!seats || seats.length === 0) {
      return Response.json({ error: "No seats selected" }, { status: 400 });
    }

    // 🔥 CHECK IF SEATS ALREADY BOOKED
    const [existing] = await db.execute(
      "SELECT seats FROM bookings WHERE movie = ? AND time = ?",
      [movie, time]
    );

    const bookedSeats = existing.flatMap(row =>
      JSON.parse(row.seats)
    );

    const conflict = seats.find(seat => bookedSeats.includes(seat));

    if (conflict) {
      return Response.json(
        { error: `Seat ${conflict} already booked` },
        { status: 400 }
      );
    }

    // ✅ INSERT
    await db.execute(
      "INSERT INTO bookings (movie, time, seats, total, paid) VALUES (?, ?, ?, ?, ?)",
      [movie, time, JSON.stringify(seats), total, paid]
    );

    return Response.json({ success: true });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}