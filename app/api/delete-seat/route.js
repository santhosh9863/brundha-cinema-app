import db from "@/lib/db";
export async function POST(req) {
  try {
    const { seat, movie, time } = await req.json();

    const [rows] = await db.execute(
      "SELECT id, seats FROM booksings WHERE movie = ? AND time = ?",
      [movie, time]
    );

    for (let row of rows) {
      const seats = JSON.parse(row.seats);

      if (seats.includes(seat)) {
        const updatedSeats = seats.filter((s) => s !== seat);

        if (updatedSeats.length === 0) {
          // ❌ delete whole row if no seats left
          await db.execute("DELETE FROM bookings WHERE id = ?", [row.id]);
        } else {
          // ✅ update remaining seats
          await db.execute(
            "UPDATE bookings SET seats = ? WHERE id = ?",
            [JSON.stringify(updatedSeats), row.id]
          );
        }

        return Response.json({ success: true });
      }
    }

    return Response.json({ error: "Seat not found" }, { status: 404 });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}