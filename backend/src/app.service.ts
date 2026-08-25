import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from './database/database.module';

@Injectable()
export class AppService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async checkHealth(): Promise<{ status: string; database: string }> {
    await this.pool.query('SELECT 1');
    return { status: 'ok', database: 'connected' };
  }
}
