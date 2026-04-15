import { Resend } from "resend";
import { render } from "@react-email/components";
import { PasswordResetEmail } from "@/emails/PasswordReset";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(
  email: string,
  username: string,
  resetToken: string
) {
  const html = await render(
    PasswordResetEmail({
      username,
      resetToken,
    })
  );

  await resend.emails.send({
    from: "Task <onboarding@resend.dev>",
    to: email,
    subject: "Restablece tu contraseña",
    html,
  });
}