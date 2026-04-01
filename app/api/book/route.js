import db from "@/lib/db";

export async function POST(req) {
  let connection;
  try {
    const body = await req.json();
    const { movie, time, seats, total, paid } = body;

    if (!seats || seats.length === 0) {
      return Response.json({ error: "No seats selected" }, { status: 400 });
    }

    // Get a connection from the pool for transaction
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Lock existing bookings for this movie+time to prevent race conditions
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

    const conflict = seats.find((seat) =>
      bookedSeats.includes(seat)
    );

    if (conflict) {
      await connection.rollback();
      return Response.json(
        { error: `Seat ${conflict} already booked` },
        { status: 400 }
      );
    }

    // INSERT with paid status
    await connection.execute(
      "INSERT INTO bookings (movie, time, seats, total, paid) VALUES (?, ?, ?, ?, ?)",
      [movie, time, JSON.stringify(seats), total, paid ? 1 : 0]
    );

    await connection.commit();

    return Response.json({ success: true });

  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error("BOOK API ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}