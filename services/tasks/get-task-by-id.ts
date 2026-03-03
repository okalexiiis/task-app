import { db } from "@/db";
import { TaskSchema } from "@/db/schemas/Task";
import { eq } from "drizzle-orm";

export async function getTaskById(id: string) {
  const task = await db
    .select()
    .from(TaskSchema)
    .where(eq(TaskSchema.id, id));
  return task[0] || null;
}
