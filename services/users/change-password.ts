import { db } from "@/db";
import { UserSchema } from "@/db/schemas/User";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const users = await db
    .select()
    .from(UserSchema)
    .where(eq(UserSchema.id, userId));

  const user = users[0];

  if (!user) {
    return { success: false, message: "Usuario no encontrado" };
  }

  const passwordMatch = await bcrypt.compare(currentPassword, user.password);

  if (!passwordMatch) {
    return { success: false, message: "Contraseña actual incorrecta" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db
    .update(UserSchema)
    .set({ password: hashedPassword })
    .where(eq(UserSchema.id, userId));

  return { success: true };
}