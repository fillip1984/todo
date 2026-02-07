import { user } from "./auth";
import { baseFields, baseSchema } from "./base";
import { ListTypeEnum } from "./enums";

export const list = baseSchema.table("list", (t) => ({
  ...baseFields,
  name: t.varchar({ length: 256 }).notNull(),
  description: t.text(),
  type: ListTypeEnum().default("GENERAL").notNull(),
  userId: t
    .text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
}));

export const task = baseSchema.table("task", (t) => ({
  ...baseFields,
  name: t.varchar({ length: 256 }).notNull(),
  description: t.text(),
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
