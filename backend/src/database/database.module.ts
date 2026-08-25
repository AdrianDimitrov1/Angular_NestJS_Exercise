import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

export const PG_POOL = 'PG_POOL';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PG_POOL,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Pool => {
        return new Pool({
          host: config.get<string>('PGHOST', 'localhost'),
          port: config.get<number>('PGPORT', 5432),
          database: config.get<string>('PGDATABASE', 'shopfront'),
          user: config.get<string>('PGUSER', 'shopfront_dev'),
          password: config.get<string>('PGPASSWORD', 'shopfront_dev'),
        });
      },
    },
  ],
  exports: [PG_POOL],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }
}
