import { db } from "@/db";
import { UserSchema } from "@/db/schemas/User";
import { User } from "@/entities/User";
import { like } from "drizzle-orm";

export async function getUserByUsername(username: string): Promise<User> {
  const user = await db
    .select()
    .from(UserSchema)
    .where(like(UserSchema.username, username));

  if (!user) {
    throw new Error("Usuario no Encontrado");
  }

  return user[0];
}
