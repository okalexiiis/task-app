import { db } from "@/db";
import { UserSchema } from "@/db/schemas/User";
import { User } from "@/entities/User";
import { fail, ok, Result } from "@/shared/result";
import { like } from "drizzle-orm";

export async function getUserByUsername(
  username: string,
): Promise<Result<User>> {
  const users = await db
    .select()
    .from(UserSchema)
    .where(like(UserSchema.username, username));

  const user = users[0];

  if (!user) {
    return fail(404, {
      message: "Usuario no encontrado",
      cause: { username },
    });
  }

  return ok(user);
}
