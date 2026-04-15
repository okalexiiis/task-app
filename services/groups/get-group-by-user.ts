import { db } from "@/db";
import { GroupMemberSchema } from "@/db/schemas/Groups";
import { GroupSchema } from "@/db/schemas/Groups";
import { fail, ok, Result } from "@/shared/result";
import { eq } from "drizzle-orm";

type UserGroup = {
  group: typeof GroupSchema.$inferSelect;
  role: string;
};

export async function getGroupsByUser(
  userId: string,
): Promise<Result<UserGroup[]>> {
  try {
    const rows = await db
      .select({
        group: GroupSchema,
        role: GroupMemberSchema.role,
      })
      .from(GroupMemberSchema)
      .innerJoin(GroupSchema, eq(GroupMemberSchema.group_id, GroupSchema.id))
      .where(eq(GroupMemberSchema.member_id, userId));

    return ok(rows);
  } catch {
    return fail(500, { message: "Error al obtener los grupos del usuario" });
  }
}
