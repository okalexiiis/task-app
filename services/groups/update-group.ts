// services/groups/update-group.ts
import { db } from "@/db";
import { GroupSchema } from "@/db/schemas/Groups";
import { fail, ok, Result } from "@/shared/result";
import { eq } from "drizzle-orm";

export async function updateGroup(
  groupId: string,
  groupName: string,
): Promise<Result<void>> {
  try {
    const updated = await db
      .update(GroupSchema)
      .set({ groupName })
      .where(eq(GroupSchema.id, groupId))
      .returning();

    if (!updated[0]) {
      return fail(404, { message: "Grupo no encontrado" });
    }

    return ok(undefined);
  } catch {
    return fail(500, { message: "Error al actualizar el grupo" });
  }
}