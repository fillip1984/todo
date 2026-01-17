import { relations } from "drizzle-orm";

import { user } from "./auth-schema";
import { appSchema, baseFields } from "./db-utils";

export const list = appSchema.table("list", (t) => ({
  ...baseFields,
  name: t.varchar({ length: 256 }).notNull(),
  description: t.text(),
  userId: t
    .text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
}));

export const task = appSchema.table("task", (t) => ({
  ...baseFields,
  title: t.varchar({ length: 256 }).notNull(),
  complete: t.boolean().default(false).notNull(),
  listId: t
    .text()
    .notNull()
    .references(() => list.id, { onDelete: "cascade" }),
  userId: t
    .text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
}));

// relationships
export const listRelations = relations(list, ({ one, many }) => ({
  tasks: many(task),
  user: one(user, {
    fields: [list.userId],
    references: [user.id],
  }),
}));

export const taskRelations = relations(task, ({ one }) => ({
  list: one(list, {
    fields: [task.listId],
    references: [list.id],
  }),
  user: one(user, {
    fields: [task.userId],
    references: [user.id],
  }),
}));

export * from "./auth-schema";
