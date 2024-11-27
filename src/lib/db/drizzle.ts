import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

import * as schema from "@/lib/db/schema";

dotenv.config({
  path: ".env.local",
});

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const sql = neon(dbUrl);

export const db = drizzle({ client: sql, schema });
