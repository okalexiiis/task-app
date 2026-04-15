// services/tasks/get-group-tasks.ts
import { db } from "@/db";
import { TaskSchema } from "@/db/schemas/Task";
import { GroupMemberSchema } from "@/db/schemas/Groups";
import { Task } from "@/entities/Task";
import { fail, ok, Result } from "@/shared/result";
import { eq, and, inArray } from "drizzle-orm";

export async function getGroupTasks(groupId: string): Promise<Result<Task[]>> {
  try {
    const members = await db
      .select({ member_id: GroupMemberSchema.member_id })
      .from(GroupMemberSchema)
      .where(eq(GroupMemberSchema.group_id, groupId));

    const memberIds = members.map((m) => m.member_id);

    if (memberIds.length === 0) {
      return ok([]);
    }

    const tasks = await db
      .select()
      .from(TaskSchema)
      .where(
        and(
          inArray(TaskSchema.userId, memberIds),
          eq(TaskSchema.groupId, groupId)
        )
      );

    console.log("TASKS getGroupTasks", tasks);

    return ok(tasks);
  } catch {
    return fail(500, { message: "Error al obtener las tareas del grupo" });
  }
}
