import { db } from "@/db";
import { UserSchema } from "@/db/schemas/User";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function resetPassword(resetToken: string, newPassword: string) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const result = await db
    .update(UserSchema)
    .set({
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    })
    .where(eq(UserSchema.resetToken, resetToken))
    .returning();

  return result[0];
}