import { db } from "@/db";
import { UserSchema } from "@/db/schemas/User";
import { eq } from "drizzle-orm";

export async function updateUser(
  id: string,
  data: { username?: string; email?: string; pfp?: string },
) {
  const result = await db
    .update(UserSchema)
    .set(data)
    .where(eq(UserSchema.id, id))
    .returning();

  if (result.length === 0) {
    return null;
  }
  return result[0];
}
