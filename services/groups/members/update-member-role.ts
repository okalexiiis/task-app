// services/groups/members/update-member-role.ts
import { db } from "@/db";
import { GroupMemberSchema } from "@/db/schemas/Groups";
import { GroupMember, GroupRoleEnum } from "@/entities/Group";
import { fail, ok, Result } from "@/shared/result";
import { and, eq } from "drizzle-orm";

export async function updateMemberRole(
  group_id: string,
  member_id: string,
  role: GroupRoleEnum,
): Promise<Result<GroupMember>> {
  try {
    const results = await db
      .update(GroupMemberSchema)
      .set({ role })
      .where(
        and(
          eq(GroupMemberSchema.group_id, group_id),
          eq(GroupMemberSchema.member_id, member_id),
        ),
      )
      .returning();

    const updated = results[0];
    if (!updated) return fail(404, { message: "Miembro no encontrado" });

    return ok(updated);
  } catch {
    return fail(500, { message: "Error al actualizar el rol" });
  }
}
