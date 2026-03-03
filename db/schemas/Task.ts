import { Priority, TaskStatus } from "@/entities/Task";
import { date, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { UserSchema } from "./User";

export const TaskSchema = pgTable("tasks", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .references(() => UserSchema.id)
    .notNull(),
  name: varchar({ length: 255 }).notNull(),
  priority: text({ enum: Priority }).notNull().default(Priority[1]),
  status: text({ enum: TaskStatus }).notNull().default(TaskStatus[0]),
  description: varchar({ length: 255 }),
  dueDate: date(),
  createdAt: date({ mode: "string" }).notNull().defaultNow(),
  updatedAt: date({ mode: "string" })
    .notNull()
    .$onUpdateFn(() => new Date().toISOString()),
});
