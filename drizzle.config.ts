import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  driver: "pg",
  out: "./src/db/drizzle",
  schema: "./src/db/schema.ts",
  dbCredentials: { connectionString: process.env.DATABASE_URL as string },
  strict: true,
  verbose: true,
} satisfies Config;
