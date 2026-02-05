import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@zedtrago/database';
import { join } from 'path';
import { SERVICE_NAME } from './app.constants';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(process.cwd(), 'apps', SERVICE_NAME, '.env'),
        join(process.cwd(), '.env'),
      ],
    }),
    DatabaseModule.forRoot(),
  ],
  controllers: [HealthController],
})
export class AppModule {}
