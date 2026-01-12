import { drizzle } from 'drizzle-orm/node-postgres-js';
import pg from 'pg';
import * as schema from '../schema';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/ppdu',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle(pool, { schema });

export { schema };
