import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./src/db/drizzle",
  driver: "pg",
  dbCredentials: { connectionString: process.env.DATABASE_URL! },
  strict: true,
  verbose: true,
} satisfies Config;
