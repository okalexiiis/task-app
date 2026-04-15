import { NextRequest, NextResponse } from "next/server";
import { changePassword } from "@/services/users/change-password";

export async function POST(req: NextRequest) {
  const { userId, currentPassword, newPassword } = await req.json();

  if (!userId || !currentPassword || !newPassword) {
    return NextResponse.json(
      { message: "Todos los campos son requeridos" },
      { status: 400 }
    );
  }

  const result = await changePassword(userId, currentPassword, newPassword);

  if (!result.success) {
    return NextResponse.json(
      { message: result.message },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { message: "Contraseña actualizada" },
    { status: 200 }
  );
}