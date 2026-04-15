import { db } from "@/db";
import { TaskSchema } from "@/db/schemas/Task";
import { eq } from "drizzle-orm";
import { Task, Priority, TaskStatus } from "@/entities/Task";

type TaskUpdate = {
  name?: string;
  description?: string | null;
  priority?: (typeof Priority)[number];
  status?: (typeof TaskStatus)[number];
  groupId?: string | null;
  dueDate?: string | null;
};

export async function updateTask(
  id: string,
  taskData: TaskUpdate,
): Promise<Task | null> {
  console.log("updateTask service:", id, taskData);
  const result = await db
    .update(TaskSchema)
    .set(taskData)
    .where(eq(TaskSchema.id, id))
    .returning();

  return result[0] || null;
}
