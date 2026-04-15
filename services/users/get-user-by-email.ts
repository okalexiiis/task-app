import { db } from "@/db";
import { UserSchema } from "@/db/schemas/User";
import { User } from "@/entities/User";
import { fail, ok, Result } from "@/shared/result";
import { eq } from "drizzle-orm";

export async function getUserByEmail(email: string): Promise<Result<User>> {
  const users = await db
    .select()
    .from(UserSchema)
    .where(eq(UserSchema.email, email));

  const user = users[0];

  if (!user) {
    return fail(404, {
      message: "Usuario no encontrado",
      cause: { email },
    });
  }

  return ok(user);
}
