import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt"; // tu función de verificación
import { getUserById } from "@/services/users/get-user-by-id";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.json({ message: "No session" }, { status: 401 });
  }

  try {
    const payload = verifyToken(token); // lanza si el token es inválido/expirado
    const result = await getUserById(payload.userId);

    if (!result.success) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    const { data } = result;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = data;
    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
