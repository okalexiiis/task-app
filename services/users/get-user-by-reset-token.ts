import { db } from "@/db";
import { UserSchema } from "@/db/schemas/User";
import { eq, and, isNotNull } from "drizzle-orm";

export async function getUserByResetToken(resetToken: string) {
  const users = await db
    .select()
    .from(UserSchema)
    .where(
      and(
        eq(UserSchema.resetToken, resetToken),
        isNotNull(UserSchema.resetTokenExpiry)
      )
    );

  const user = users[0];

  if (!user) {
    return null;
  }

  if (user.resetTokenExpiry && new Date(user.resetTokenExpiry) < new Date()) {
    return null;
  }

  return user;
}