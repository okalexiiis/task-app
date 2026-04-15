// db/schemas/Groups.ts
import {
  date,
  pgTable,
  primaryKey,
  uuid,
  varchar,
  text,
} from "drizzle-orm/pg-core";
import { UserSchema } from "./User";
import { GroupRole } from "@/entities/Group";

export const GroupSchema = pgTable("groups", {
  id: uuid().primaryKey().defaultRandom(),
  owner: uuid()
    .references(() => UserSchema.id)
    .notNull(),
  groupName: varchar({ length: 255 }).notNull(),
  createdAt: date({ mode: "string" }).notNull().defaultNow(),
  updatedAt: date({ mode: "string" })
    .notNull()
    .$onUpdateFn(() => new Date().toISOString()),
});

export const GroupMemberSchema = pgTable(
  "group_members",
  {
    group_id: uuid()
      .references(() => GroupSchema.id)
      .notNull(),
    member_id: uuid()
      .references(() => UserSchema.id)
      .notNull(),
    role: text({ enum: GroupRole }).notNull().default("MEMBER"),
    createdAt: date({ mode: "string" }).notNull().defaultNow(),
    updatedAt: date({ mode: "string" })
      .notNull()
      .$onUpdateFn(() => new Date().toISOString()),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.group_id, table.member_id] }),
  }),
);
