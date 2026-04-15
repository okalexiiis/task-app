// services/groups/get-group-by-id.ts
import { db } from "@/db";
import { GroupSchema } from "@/db/schemas/Groups";
import { Group } from "@/entities/Group";
import { fail, ok, Result } from "@/shared/result";
import { eq } from "drizzle-orm";

export async function getGroupById(
  groupId: string,
): Promise<Result<Group>> {
  try {
    const results = await db
      .select()
      .from(GroupSchema)
      .where(eq(GroupSchema.id, groupId));

    const group = results[0];
    if (!group) return fail(404, { message: "Grupo no encontrado" });

    return ok(group);
  } catch {
    return fail(500, { message: "Error al obtener el grupo" });
  }
}
