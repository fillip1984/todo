import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./index";
import * as relations from "./schema/relations";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not set");
}

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn =
  globalForDb.conn ??
  postgres(process.env.POSTGRES_URL, {
    prepare: false,
    ssl: process.env.NODE_ENV === "production" ? "require" : "prefer",
  });
if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle({
  client: conn,
  ...schema,
  ...relations,
  logger: process.env.NODE_ENV !== "production",
});
