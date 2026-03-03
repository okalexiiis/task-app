import { db } from "@/db";
import { UserSchema } from "@/db/schemas/User";
import { eq } from "drizzle-orm";

export async function deleteUser(id: string) {
  const deletedUser = await db
    .delete(UserSchema)
    .where(eq(UserSchema.id, id))
    .returning();
  return deletedUser[0];
}
