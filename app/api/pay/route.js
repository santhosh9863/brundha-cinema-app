export async function POST(req) {
  const body = await req.json();

  const { seats, total } = body;

  // ❌ basic validation
  if (!seats || seats.length === 0) {
    return Response.json(
      { success: false, message: "No seats selected" },
      { status: 400 }
    );
  }

  if (!total || total <= 0) {
    return Response.json(
      { success: false, message: "Invalid amount" },
      { status: 400 }
    );
  }

  // 💰 simulate payment gateway delay
  await new Promise((res) => setTimeout(res, 1500));

  // 🎲 simulate real payment result
  const isSuccess = Math.random() > 0.2;

  if (!isSuccess) {
    return Response.json(
      { success: false, message: "Payment failed" },
      { status: 402 }
    );
  }

  // ✅ success
  return Response.json({
    success: true,
    transactionId: "TXN_" + Date.now(),
  });
}