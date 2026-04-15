import { NextRequest, NextResponse } from "next/server";
import { getUserByResetToken } from "@/services/users/get-user-by-reset-token";
import { resetPassword } from "@/services/users/reset-password";

export async function POST(req: NextRequest) {
  const { resetToken, newPassword } = await req.json();

  if (!resetToken || !newPassword) {
    return NextResponse.json(
      { message: "Token y nueva contraseña requeridos" },
      { status: 400 }
    );
  }

  const user = await getUserByResetToken(resetToken);

  if (!user) {
    return NextResponse.json(
      { message: "Token inválido o expirado" },
      { status: 400 }
    );
  }

  await resetPassword(resetToken, newPassword);

  return NextResponse.json({ message: "Contraseña actualizada" }, { status: 200 });
}