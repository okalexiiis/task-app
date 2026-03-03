import { db } from "@/db";
import { UserSchema } from "@/db/schemas/User";
import { User } from "@/entities/User";
import { eq } from "drizzle-orm";

export async function getUserById(id: string): Promise<User> {
  const user = await db.select().from(UserSchema).where(eq(UserSchema.id, id));

  if (!user) {
    throw new Error("Usuario no Encontrado");
  }

  return user[0];
}
