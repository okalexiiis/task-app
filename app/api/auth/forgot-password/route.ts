import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/services/users/get-user-by-email";
import { setResetToken } from "@/services/users/set-reset-token";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { message: "Correo electrónico requerido" },
      { status: 400 }
    );
  }

  const result = await getUserByEmail(email);

  if (!result.success) {
    return NextResponse.json(
      { message: "Si el correo existe, recibirás un enlace para restablecer tu contraseña" },
      { status: 200 }
    );
  }

  const resetToken = await setResetToken(email);

  await sendPasswordResetEmail(email, result.data.username, resetToken);

  return NextResponse.json(
    { message: "Si el correo existe, recibirás un enlace para restablecer tu contraseña" },
    { status: 200 }
  );
}