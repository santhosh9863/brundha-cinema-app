import { query } from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const movie = searchParams.get("movie");
  const time = searchParams.get("time");

  let interval;

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const sendData = async () => {
        try {
          const rows = await query(
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

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(bookedSeats)}\n\n`)
          );
        } catch (err) {
          console.error("SSE error:", err);
        }
      };

      // initial send
      await sendData();

      // repeat
      interval = setInterval(sendData, 1000);
    },

    cancel() {
      if (interval) clearInterval(interval);
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