// services/groups/members/get-member-role.ts
import { db } from "@/db";
import { GroupMemberSchema } from "@/db/schemas/Groups";
import { GroupRoleEnum } from "@/entities/Group";
import { fail, ok, Result } from "@/shared/result";
import { and, eq } from "drizzle-orm";

export async function getMemberRole(
  group_id: string,
  member_id: string,
): Promise<Result<GroupRoleEnum>> {
  try {
    const rows = await db
      .select({ role: GroupMemberSchema.role })
      .from(GroupMemberSchema)
      .where(
        and(
          eq(GroupMemberSchema.group_id, group_id),
          eq(GroupMemberSchema.member_id, member_id),
        ),
      );

    const row = rows[0];
    if (!row) return fail(403, { message: "No eres miembro de este grupo" });

    return ok(row.role);
  } catch {
    return fail(500, { message: "Error al obtener el rol" });
  }
}
