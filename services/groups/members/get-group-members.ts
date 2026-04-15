// services/groups/members/get-group-members.ts
import { db } from "@/db";
import { GroupMemberSchema } from "@/db/schemas/Groups";
import { UserSchema } from "@/db/schemas/User";
import { GroupMember } from "@/entities/Group";
import { fail, ok, Result } from "@/shared/result";
import { eq } from "drizzle-orm";

type GroupMemberWithUser = GroupMember & {
  userName: string | null;
  userEmail: string | null;
};

export async function getGroupMembers(
  groupId: string,
): Promise<Result<GroupMemberWithUser[]>> {
  try {
    const results = await db
      .select({
        group_id: GroupMemberSchema.group_id,
        member_id: GroupMemberSchema.member_id,
        role: GroupMemberSchema.role,
        createdAt: GroupMemberSchema.createdAt,
        updatedAt: GroupMemberSchema.updatedAt,
        userName: UserSchema.username,
        userEmail: UserSchema.email,
      })
      .from(GroupMemberSchema)
      .innerJoin(UserSchema, eq(GroupMemberSchema.member_id, UserSchema.id))
      .where(eq(GroupMemberSchema.group_id, groupId));

    return ok(results);
  } catch {
    return fail(500, { message: "Error al obtener los miembros" });
  }
}
