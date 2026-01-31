import { NextRequest, NextResponse } from "next/server";

const CREDENTIALS: Record<string, { password: string; role: "student" | "admin" }> = {
  student: { password: "1234", role: "student" },
  admin: { password: "1234", role: "admin" },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const username = (body.username ?? body.email ?? "").toString().trim().toLowerCase();
    const password = (body.password ?? "").toString();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 }
      );
    }

    const creds = CREDENTIALS[username];
    if (!creds || creds.password !== password) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: { username, role: creds.role },
      role: creds.role,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
