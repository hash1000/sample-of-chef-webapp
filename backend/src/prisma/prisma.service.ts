import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // Prisma Client v6 types do not expose `beforeExit` on `$on` in TS,
    // but the hook still works at runtime for graceful shutdown.
    (this as any).$on('beforeExit', async () => {
      await app.close();
    });
  }
}

