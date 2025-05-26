import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString, {
  ssl: { rejectUnauthorized: false },
  max: 1,
});

export const db = drizzle(sql);