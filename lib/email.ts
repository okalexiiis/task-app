import { Resend } from "resend";
import { render } from "@react-email/components";
import { PasswordResetEmail } from "@/emails/PasswordReset";
import { TaskNotificationEmail } from "@/emails/TaskNotification";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM || "onboarding@resend.dev";

const emailRateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW = 60 * 1000;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const record = emailRateLimit.get(key);

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    emailRateLimit.set(key, { count: 1, timestamp: now });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }

  record.count++;
  return false;
}

function sanitizeEmail(email: string): string {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const sanitized = email.trim().toLowerCase();
  return emailRegex.test(sanitized) ? sanitized : "";
}

function sanitizeUsername(username: string): string {
  return username.replace(/[<>"/\\&]/g, "").slice(0, 100);
}

function sanitizeTaskName(taskName: string): string {
  return taskName.replace(/[<>"/\\&]/g, "").slice(0, 255);
}

export async function sendPasswordResetEmail(
  email: string,
  username: string,
  resetToken: string,
  pfp?: string,
) {
  const sanitizedEmail = sanitizeEmail(email);
  const sanitizedUsername = sanitizeUsername(username);

  if (!sanitizedEmail) {
    return;
  }

  const html = await render(
    PasswordResetEmail({
      username: sanitizedUsername,
      resetToken,
      pfp,
    }),
  );

  await resend.emails.send({
    from: `Task <${FROM_EMAIL}>`,
    to: sanitizedEmail,
    subject: "Restablece tu contraseña",
    html,
  });
}

export async function sendTaskNotification(
  recipientEmail: string,
  recipientUsername: string,
  taskName: string,
  oldStatus: string,
  newStatus: string,
  groupName?: string,
  changerUsername?: string, // 👈 quien hizo el cambio
) {
  const sanitizedEmail = sanitizeEmail(recipientEmail);
  const sanitizedUsername = sanitizeUsername(recipientUsername);
  const sanitizedTaskName = sanitizeTaskName(taskName);
  const sanitizedGroupName = groupName
    ? sanitizeUsername(groupName)
    : undefined;

  if (!sanitizedEmail || !sanitizedTaskName) {
    return;
  }

  if (isRateLimited(sanitizedEmail)) {
    console.log(`Rate limited email: ${sanitizedEmail}`);
    return;
  }

  const html = await render(
    TaskNotificationEmail({
      assigneeUsername: sanitizedUsername,
      taskName: sanitizedTaskName,
      oldStatus,
      newStatus,
      groupName: sanitizedGroupName,
      changerUsername, // 👈 pasar al template
    }),
  );

  await resend.emails.send({
    from: `Task <${FROM_EMAIL}>`,
    to: sanitizedEmail,
    subject: `Tarea "${sanitizedTaskName}" ${newStatus === "DONE" ? "completada" : "cancelada"}`,
    html,
  });
}
