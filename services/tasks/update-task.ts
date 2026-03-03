import { db } from "@/db";
import { TaskSchema } from "@/db/schemas/Task";
import { eq } from "drizzle-orm";
import { Task } from "@/entities/Task";

type TaskUpdate = Partial<Omit<Task, "id" | "userId" | "createdAt">>;

export async function updateTask(
  id: string,
  taskData: TaskUpdate,
): Promise<Task | null> {
  const result = await db
    .update(TaskSchema)
    .set(taskData)
    .where(eq(TaskSchema.id, id))
    .returning();

  return result[0] || null;
}
