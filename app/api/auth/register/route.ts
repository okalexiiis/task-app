import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/services/users/register";
import bcrypt from "bcryptjs";
import { getUserByUsername } from "@/services/users/get-user-by-username";
import { getUserByEmail } from "@/services/users/get-user-by-email";

export async function POST(req: NextRequest) {
  const { username, email, password } = await req.json();

  if (!username || !email || !password) {
    return NextResponse.json(
      { message: "Todos los campos son requeridos" },
      { status: 400 },
    );
  }

  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    return NextResponse.json(
      { message: "El nombre de usuario ya existe" },
      { status: 409 },
    );
  }

  const existingEmail = await getUserByEmail(email);
  if (existingEmail) {
    return NextResponse.json(
      { message: "El correo electrónico ya está en uso" },
      { status: 409 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await registerUser({
      username,
      email,
      password: hashedPassword,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return NextResponse.json(
      { message: "Ocurrió un error en el servidor" },
      { status: 500 },
    );
  }
}
