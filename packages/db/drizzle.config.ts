import type { Config } from "drizzle-kit";

if (!process.env.POSTGRES_URL) {
  throw new Error("Missing POSTGRES_URL");
}

if (!process.env.POSTGRES_SCHEMA) {
  throw new Error("Missing POSTGRES_SCHEMA");
}

const nonPoolingUrl = process.env.POSTGRES_URL.replace(":6543", ":5432");

export default {
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: nonPoolingUrl,
    ssl: process.env.NODE_ENV === "production" ? "require" : "prefer",
  },
  schemaFilter: [`${process.env.POSTGRES_SCHEMA}`],
  casing: "camelCase",
} satisfies Config;
