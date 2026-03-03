import { db } from "@/db";
import { TaskSchema } from "@/db/schemas/Task";
import { Task } from "@/entities/Task";
import { eq } from "drizzle-orm";

export async function getAllTasks(id: string): Promise<Task[]> {
  const tasks = db.select().from(TaskSchema).where(eq(TaskSchema.userId, id));

  return tasks;
}
