import { createId } from "@paralleldrive/cuid2";
import { pgSchema, text, timestamp } from "drizzle-orm/pg-core";

if (!process.env.POSTGRES_SCHEMA) {
  throw new Error("Missing POSTGRES_SCHEMA");
}

/**
 * Table schema is used to separate different applications using the same database.
 */
export const baseSchema = pgSchema(process.env.POSTGRES_SCHEMA);

/**
 * Base fields for all tables.
 */
export const baseFields = {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().$onUpdate(() => /* @__PURE__ */ new Date()),
};
