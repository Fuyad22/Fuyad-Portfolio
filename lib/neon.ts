// This file contains the Neon database connection logic for Next.js API routes.
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default pool;