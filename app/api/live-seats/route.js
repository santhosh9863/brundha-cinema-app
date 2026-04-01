import { db } from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const movie = searchParams.get("movie");
  const time = searchParams.get("time");

  const stream = new ReadableStream({
    async start(controller) {

      const sendData = async () => {
        const [rows] = await db.execute(
          "SELECT seats FROM bookings WHERE movie = ? AND time = ?",
          [movie, time]
        );

        const bookedSeats = rows.flatMap((row) =>
          JSON.parse(row.seats)
        );

        controller.enqueue(
          new TextEncoder().encode(
            `data: ${JSON.stringify(bookedSeats)}\n\n`
          )
        );
      };

      // 🔥 SEND FIRST DATA
      await sendData();

      // 🔥 PUSH UPDATES EVERY 1 SEC (NEAR REALTIME)
      const interval = setInterval(sendData, 1000);

      return () => clearInterval(interval);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}