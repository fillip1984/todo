import { createId } from "@paralleldrive/cuid2";
import { pgSchema, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./schema";

// if (!process.env.POSTGRES_SCHEMA) {
//   throw new Error("Missing POSTGRES_SCHEMA");
// }

/**
 * Table schema is used to separate different applications using the same database.
 */
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const appSchema = pgSchema(process.env.POSTGRES_SCHEMA!);

/**
 * Base fields for all tables.
 */
export const baseFields = {
  // id: uuid().primaryKey().defaultRandom(),
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().$onUpdate(() => /* @__PURE__ */ new Date()),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
};
