// services/groups/delete-group.ts
import { db } from "@/db";
import { GroupMemberSchema, GroupSchema } from "@/db/schemas/Groups";
import { fail, ok, Result } from "@/shared/result";
import { eq } from "drizzle-orm";

export async function deleteGroup(group_id: string): Promise<Result<void>> {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(GroupMemberSchema).where(eq(GroupMemberSchema.group_id, group_id));
      const deleted = await tx.delete(GroupSchema).where(eq(GroupSchema.id, group_id)).returning();
      if (!deleted[0]) return fail(404, { message: "Grupo no encontrado" });
    });
    return ok(undefined);
  } catch {
    return fail(500, { message: "Error al eliminar el grupo" });
  }
}
