// services/groups/members/new-member.ts
import { GroupMemberSchema } from "@/db/schemas/Groups";
import { GroupMember, GroupRoleEnum } from "@/entities/Group";
import { fail, ok, Result } from "@/shared/result";
import { db } from "@/db";

type NewMember = Pick<GroupMember, "group_id" | "member_id"> & {
  role?: GroupRoleEnum;
};
type DbOrTx = Parameters<Parameters<typeof db.transaction>[0]>[0] | typeof db;

export async function newMember(
  data: NewMember,
  tx?: DbOrTx,
): Promise<Result<GroupMember>> {
  try {
    const client = tx ?? db;
    const results = await client
      .insert(GroupMemberSchema)
      .values({ role: "MEMBER", ...data })
      .returning();

    const saved = results[0];
    if (!saved) return fail(500, { message: "Miembro no guardado" });

    return ok(saved);
  } catch {
    return fail(500, { message: "Error al guardar el miembro" });
  }
}
