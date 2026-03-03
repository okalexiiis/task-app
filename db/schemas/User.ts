import { date, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

const default_pfp =
  "https://i.pinimg.com/736x/a9/5e/7a/a95e7a415633a614613e757bac4246ed.jpg";

export const UserSchema = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  username: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  pfp: varchar({ length: 255 })
    .notNull()
    .$default(() => default_pfp),
  createdAt: date({ mode: "string" }).notNull().defaultNow(),
  updatedAt: date({ mode: "string" })
    .notNull()
    .$onUpdateFn(() => new Date().toISOString())
    .defaultNow(),
});
