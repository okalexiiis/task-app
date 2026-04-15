// services/groups/rename-group.ts
import { db } from "@/db";
import { GroupSchema } from "@/db/schemas/Groups";
import { Group } from "@/entities/Group";
import { fail, ok, Result } from "@/shared/result";
import { eq } from "drizzle-orm";

export async function renameGroup(
  group_id: string,
  groupName: string,
): Promise<Result<Group>> {
  try {
    const results = await db
      .update(GroupSchema)
      .set({ groupName })
      .where(eq(GroupSchema.id, group_id))
      .returning();

    const updated = results[0];
    if (!updated) return fail(404, { message: "Grupo no encontrado" });

    return ok(updated);
  } catch {
    return fail(500, { message: "Error al renombrar el grupo" });
  }
}
