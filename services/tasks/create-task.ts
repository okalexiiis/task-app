import { db } from "@/db";
import { TaskSchema } from "@/db/schemas/Task";
import { Task } from "@/entities/Task";

type NewTask = Omit<Task, "id" | "_id" | "createdAt" | "updatedAt">;

export async function createTask(taskData: NewTask): Promise<Task> {
  const result = await db.insert(TaskSchema).values(taskData).returning();
  return result[0];
}
