import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres-js';
import pg from 'pg';
import * as schema from '../schema';

@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE_POOL',
      useFactory: (configService: ConfigService) => {
        return new pg.Pool({
          connectionString: configService.get('DATABASE_URL') || 'postgresql://localhost:5432/ppdu',
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'DATABASE',
      useFactory: (pool: pg.Pool) => {
        return drizzle(pool, { schema });
      },
      inject: ['DATABASE_POOL'],
    },
  ],
  exports: ['DATABASE_POOL', 'DATABASE'],
})
export class DatabaseModule {}
