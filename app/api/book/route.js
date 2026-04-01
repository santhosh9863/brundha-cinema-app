import db from "@/lib/db";

const VALID_MOVIES = ["Leo", "KGF Chapter 2", "RRR", "Pushpa"];
const VALID_TIMES = ["7:30 PM", "10:45 PM"];

export async function POST(req) {
  let connection;
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { movie, time, seats, total, paid } = body;

    if (!movie || typeof movie !== "string" || !VALID_MOVIES.includes(movie)) {
      return Response.json({ error: "Invalid movie selection" }, { status: 400 });
    }

    if (!time || typeof time !== "string" || !VALID_TIMES.includes(time)) {
      return Response.json({ error: "Invalid show time" }, { status: 400 });
    }

    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      return Response.json({ error: "No seats selected" }, { status: 400 });
    }

    if (seats.length > 10) {
      return Response.json({ error: "Maximum 10 seats per booking" }, { status: 400 });
    }

    if (!total || typeof total !== "number" || total <= 0) {
      return Response.json({ error: "Invalid total amount" }, { status: 400 });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    const [existing] = await connection.execute(
      "SELECT id, seats FROM bookings WHERE movie = ? AND time = ? FOR UPDATE",
      [movie, time]
    );

    const bookedSeats = existing.flatMap((row) => {
      try {
        return JSON.parse(row.seats || "[]");
      } catch {
        return [];
      }
    });

    const conflicts = seats.filter((seat) => bookedSeats.includes(seat));

    if (conflicts.length > 0) {
      await connection.rollback();
      return Response.json(
        { error: `Seat${conflicts.length > 1 ? "s" : ""} ${conflicts.join(", ")} already booked` },
        { status: 400 }
      );
    }

    await connection.execute(
      "INSERT INTO bookings (movie, time, seats, total, paid) VALUES (?, ?, ?, ?, ?)",
      [movie, time, JSON.stringify(seats), total, paid ? 1 : 0]
    );

    await connection.commit();

    return Response.json({ success: true });

  } catch (err) {
    if (connection) {
      try { await connection.rollback(); } catch {}
    }
    console.error("BOOK API ERROR:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    if (connection) {
      try { connection.release(); } catch {}
    }
  }
}
