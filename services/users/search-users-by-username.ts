// services/users/search-users-by-username.ts
import { db } from "@/db";
import { UserSchema } from "@/db/schemas/User";
import { User } from "@/entities/User";
import { fail, ok, Result } from "@/shared/result";
import { ilike } from "drizzle-orm";

type SafeUser = Omit<User, "password">;

export async function searchUsersByUsername(
  username: string,
): Promise<Result<SafeUser[]>> {
  try {
    const users = await db
      .select({
        id: UserSchema.id,
        username: UserSchema.username,
        email: UserSchema.email,
        pfp: UserSchema.pfp,
        createdAt: UserSchema.createdAt,
        updatedAt: UserSchema.updatedAt,
      })
      .from(UserSchema)
      .where(ilike(UserSchema.username, `%${username}%`));

    return ok(users);
  } catch {
    return fail(500, { message: "Error al buscar usuarios" });
  }
}
