import { Controller, Get } from '@nestjs/common';
import { SERVICE_NAME } from '../app.constants';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: 'ok',
      service: SERVICE_NAME,
      timestamp: new Date().toISOString(),
    };
  }
}
