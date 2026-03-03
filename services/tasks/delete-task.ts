import { db } from "@/db";
import { TaskSchema } from "@/db/schemas/Task";
import { eq } from "drizzle-orm";

export async function deleteTask(id: string): Promise<boolean> {
  const result = await db
    .delete(TaskSchema)
    .where(eq(TaskSchema.id, id))
    .returning({ id: TaskSchema.id });

  return result.length > 0;
}
