/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";
import { getUserByUsername } from "@/services/users/get-user-by-username";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { message: "Usuario y contraseña requeridos" },
      { status: 400 },
    );
  }

  const result = await getUserByUsername(username);

  if (!result.success) {
    return NextResponse.json(
      { message: "Usuario no existente" },
      { status: 401 },
    );
  }

  const { data } = result;

  const passwordMatch = await bcrypt.compare(password, data.password);

  if (!passwordMatch) {
    return NextResponse.json(
      { message: "Credenciales inválidas" },
      { status: 401 },
    );
  }

  const token = signToken({
    userId: data.id,
    username: data.username,
  });

  const { password: _, ...safeUser } = data;

  const response = NextResponse.json({ user: safeUser });

  // Cookie HttpOnly — el frontend NO puede leerla con JS, solo el servidor
  response.cookies.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 días en segundos
    path: "/",
  });

  return response;
}
