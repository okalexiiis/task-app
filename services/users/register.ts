import { db } from "@/db";
import { UserSchema } from "@/db/schemas/User";
import { RegisterUser } from "@/entities/User";

export async function registerUser(user: RegisterUser) {
  const newUser = await db
    .insert(UserSchema)
    .values({
      ...user,
    })
    .returning();
  return newUser[0];
}
