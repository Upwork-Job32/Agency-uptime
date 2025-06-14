import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Hash the password and compare with stored hash
    // 2. Validate against your database
    // 3. Generate a proper JWT token
    // 4. Handle rate limiting and security measures

    // Mock authentication for demo purposes
    // Replace this with your actual authentication logic
    const validCredentials = [
      { email: "admin@agency.com", password: "password123" },
      { email: "demo@agency.com", password: "demo123" },
    ];

    const user = validCredentials.find(
      (cred) => cred.email === email && cred.password === password
    );

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate a mock JWT token (in production, use a proper JWT library)
    const token = btoa(
      JSON.stringify({
        email: user.email,
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        iat: Date.now(),
      })
    );

    // Return success response with token
    return NextResponse.json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        email: user.email,
        name: user.email.split("@")[0],
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
