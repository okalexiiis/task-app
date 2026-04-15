// services/groups/new-group.ts
import { db } from "@/db";
import { GroupSchema } from "@/db/schemas/Groups";
import { Group, GroupMember } from "@/entities/Group";
import { fail, ok, Result } from "@/shared/result";
import { newMember } from "./members/new-member";

type NewGroup = Omit<Group, "id" | "createdAt" | "updatedAt">;
type NewGroupResult = Group & { members: GroupMember[] };

export async function newGroup(
  group: NewGroup,
): Promise<Result<NewGroupResult>> {
  try {
    const result = await db.transaction(async (tx) => {
      const groups = await tx.insert(GroupSchema).values(group).returning();
      const groupSaved = groups[0];
      if (!groupSaved) return null;

      // ✅ Pasa tx para que opere en la misma transacción
      const memberResult = await newMember(
        { group_id: groupSaved.id, member_id: group.owner, role: "OWNER" },
        tx,
      );
      if (!memberResult.success) return null;

      return { ...groupSaved, members: [memberResult.data] };
    });

    if (!result) return fail(500, { message: "Error al crear el grupo" });
    return ok(result);
  } catch (e) {
    // 👇 Loguea el error real para debuggear
    console.error("[newGroup]", e);
    return fail(500, { message: "Error al crear el grupo" });
  }
}
