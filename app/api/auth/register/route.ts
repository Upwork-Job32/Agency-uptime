import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, agencyName } = body;

    // Validate required fields
    if (!name || !email || !password || !agencyName) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Hash the password
    // 2. Check if user already exists
    // 3. Save to database
    // 4. Send welcome email
    // 5. Generate proper JWT token

    // Mock user creation for demo purposes
    // Check if user already exists (mock check)
    const existingUsers = ["admin@agency.com", "demo@agency.com"];

    if (existingUsers.includes(email)) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Generate a mock JWT token (in production, use a proper JWT library)
    const token = btoa(
      JSON.stringify({
        email: email,
        name: name,
        agencyName: agencyName,
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        iat: Date.now(),
      })
    );

    // Return success response with token
    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        token: token,
        user: {
          name: name,
          email: email,
          agencyName: agencyName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
