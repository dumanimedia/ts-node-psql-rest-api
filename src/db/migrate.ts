import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL as string,
  });

  const db = drizzle(pool);

  console.log(`[migrate] Running migrations ...`);
  await migrate(db, { migrationsFolder: "./src/db/drizzle" });
  console.log(`[migrate] All migrations ran successfully, exiting ...`);
  await pool.end();
}

main();
