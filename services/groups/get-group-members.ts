import { db } from "@/db";
import { GroupMemberSchema } from "@/db/schemas/Groups";
import { UserSchema } from "@/db/schemas/User";
import { eq } from "drizzle-orm";

export async function getGroupMembersForNotification(groupId: string) {
  const results = await db
    .select({
      member_id: GroupMemberSchema.member_id,
      role: GroupMemberSchema.role,
      username: UserSchema.username,
      email: UserSchema.email,
    })
    .from(GroupMemberSchema)
    .innerJoin(UserSchema, eq(GroupMemberSchema.member_id, UserSchema.id))
    .where(eq(GroupMemberSchema.group_id, groupId));

  console.log("getGroupMembersForNotification:", results);
  return results;
}