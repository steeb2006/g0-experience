import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    // Check against environment variable
    const correctPassword = process.env.AUTH_PASSWORD;

    if (!correctPassword) {
      console.error("AUTH_PASSWORD environment variable not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (password === correctPassword) {
      const response = NextResponse.json({ success: true });

      // Set auth cookie - expires in 7 days
      response.cookies.set("g0-auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
