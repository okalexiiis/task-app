import { db } from "@/db";
import { UserSchema } from "@/db/schemas/User";
import { eq } from "drizzle-orm";

export async function getUserByEmail(email: string) {
  const user = await db
    .select()
    .from(UserSchema)
    .where(eq(UserSchema.email, email));
  return user[0];
}
