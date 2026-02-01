import { relations } from "drizzle-orm";

// import { pgEnum } from "drizzle-orm/pg-core";

import { user } from "./auth-schema";
import { appSchema, baseFields } from "./db-utils";

export const list = appSchema.table("list", (t) => ({
  ...baseFields,
  name: t.varchar({ length: 256 }).notNull(),
  description: t.text(),
}));

export const task = appSchema.table("task", (t) => ({
  ...baseFields,
  name: t.varchar({ length: 256 }).notNull(),
  description: t.text(),
  complete: t.boolean().default(false).notNull(),
  listId: t
    .text()
    .notNull()
    .references(() => list.id, { onDelete: "cascade" }),
  // type: ListTypeEnum.default("GENERAL").notNull(),
}));

// enums
// export const ListTypeEnum = pgEnum("list_type", ["GENERAL", "TMDB"]);

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
