// services/groups/members/remove-member.ts
import { db } from "@/db";
import { GroupMemberSchema } from "@/db/schemas/Groups";
import { GroupMember } from "@/entities/Group";
import { fail, ok, Result } from "@/shared/result";
import { and, eq } from "drizzle-orm";

export async function removeMember(
  group_id: string,
  member_id: string,
): Promise<Result<GroupMember>> {
  try {
    const results = await db
      .delete(GroupMemberSchema)
      .where(
        and(
          eq(GroupMemberSchema.group_id, group_id),
          eq(GroupMemberSchema.member_id, member_id),
        ),
      )
      .returning();

    const removed = results[0];
    if (!removed) return fail(404, { message: "Miembro no encontrado" });

    return ok(removed);
  } catch {
    return fail(500, { message: "Error al eliminar el miembro" });
  }
}
