// services/groups/delete-group.ts
import { db } from "@/db";
import { GroupMemberSchema, GroupSchema } from "@/db/schemas/Groups";
import { TaskSchema } from "@/db/schemas/Task";
import { fail, ok, Result } from "@/shared/result";
import { eq } from "drizzle-orm";

export async function deleteGroup(groupId: string): Promise<Result<void>> {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(TaskSchema).where(eq(TaskSchema.groupId, groupId));
      await tx.delete(GroupMemberSchema).where(eq(GroupMemberSchema.group_id, groupId));
      const deleted = await tx.delete(GroupSchema).where(eq(GroupSchema.id, groupId)).returning();
      if (!deleted[0]) {
        throw new Error("Grupo no encontrado");
      }
    });
    return ok(undefined as void);
  } catch (error) {
    console.error("Delete group error:", error);
    return fail(500, { message: "Error al eliminar el grupo" });
  }
}
