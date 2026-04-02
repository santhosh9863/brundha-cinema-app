import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // Admin credentials — change these or move to env variables
    const ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
    const ADMIN_PASS = process.env.ADMIN_PASSWORD || "admin123";

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const response = NextResponse.json({ message: "Login successful" });

      // Set admin-token cookie (checked by middleware.js)
      response.cookies.set("admin-token", "authenticated", {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });

      return response;
    }

    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
