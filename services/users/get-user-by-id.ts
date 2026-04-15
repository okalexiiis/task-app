import { db } from "@/db";
import { UserSchema } from "@/db/schemas/User";
import { User } from "@/entities/User";
import { eq } from "drizzle-orm";
import { ok, fail, Result } from "@/shared/result"; // ajusta path

export async function getUserById(id: string): Promise<Result<User>> {
  const users = await db.select().from(UserSchema).where(eq(UserSchema.id, id));

  const user = users[0];

  if (!user) {
    return fail(404, {
      message: "Usuario no encontrado",
      cause: { id },
    });
  }

  return ok(user);
}
