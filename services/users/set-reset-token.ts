import { db } from "@/db";
import { UserSchema } from "@/db/schemas/User";
import { eq } from "drizzle-orm";

export async function setResetToken(email: string) {
  const resetToken = crypto.randomUUID();
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  await db
    .update(UserSchema)
    .set({
      resetToken,
      resetTokenExpiry,
    })
    .where(eq(UserSchema.email, email));

  return resetToken;
}