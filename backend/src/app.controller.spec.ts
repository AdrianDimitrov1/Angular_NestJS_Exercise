import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PG_POOL } from './database/database.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: PG_POOL, useValue: { query: jest.fn().mockResolvedValue({ rows: [] }) } },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should report the database as connected', async () => {
      await expect(appController.checkHealth()).resolves.toEqual({
        status: 'ok',
        database: 'connected',
      });
    });
  });
});
