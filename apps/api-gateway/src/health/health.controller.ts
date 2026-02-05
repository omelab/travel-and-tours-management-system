import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Public } from '../auth/public.decorator';
import { SERVICE_NAME } from '../app.constants';

@Controller('health')
export class HealthController {
  constructor(private readonly config: ConfigService) {}

  @Public()
  @Get()
  getHealth() {
    return {
      status: 'ok',
      service: SERVICE_NAME,
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('ready')
  async getReadiness() {
    const upstreams = [
      { name: 'auth-service', url: this.config.get<string>('AUTH_SERVICE_URL') },
      { name: 'user-service', url: this.config.get<string>('USER_SERVICE_URL') },
      { name: 'hotel-service', url: this.config.get<string>('HOTEL_SERVICE_URL') },
      { name: 'tour-service', url: this.config.get<string>('TOUR_SERVICE_URL') },
      { name: 'booking-service', url: this.config.get<string>('BOOKING_SERVICE_URL') },
      { name: 'payment-service', url: this.config.get<string>('PAYMENT_SERVICE_URL') },
      { name: 'notification-service', url: this.config.get<string>('NOTIFICATION_SERVICE_URL') },
      { name: 'reporting-service', url: this.config.get<string>('REPORTING_SERVICE_URL') },
      { name: 'currency-service', url: this.config.get<string>('CURRENCY_SERVICE_URL') },
      { name: 'search-service', url: this.config.get<string>('SEARCH_SERVICE_URL') },
    ];

    const fetchFn = (globalThis as unknown as { fetch: (input: string, init?: any) => Promise<any> }).fetch;

    const results = await Promise.all(
      upstreams.map(async (service) => {
        if (!service.url) {
          return { name: service.name, status: 'missing', ok: false };
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);

        try {
          const response = await fetchFn(`${service.url}/health`, {
            method: 'GET',
            signal: controller.signal,
          });
          const ok = response?.ok ?? false;
          return { name: service.name, status: ok ? 'ok' : 'error', ok };
        } catch {
          return { name: service.name, status: 'error', ok: false };
        } finally {
          clearTimeout(timeout);
        }
      }),
    );

    const failed = results.filter((result) => !result.ok);
    return {
      status: failed.length === 0 ? 'ok' : 'degraded',
      service: SERVICE_NAME,
      timestamp: new Date().toISOString(),
      dependencies: results,
    };
  }
}
