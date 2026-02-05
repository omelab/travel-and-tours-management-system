import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import proxy from '@fastify/http-proxy';
import rateLimit from '@fastify/rate-limit';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DEFAULT_PORT, SERVICE_NAME } from './app.constants';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { logger: ['error', 'warn', 'log'] },
  );

  const config = app.get(ConfigService);
  const jwtService = app.get(JwtService);
  const fastify = app.getHttpAdapter().getInstance();

  await fastify.register(rateLimit, {
    max: Number(config.get<string>('RATE_LIMIT_MAX') ?? 200),
    timeWindow: config.get<string>('RATE_LIMIT_WINDOW') ?? '1 minute',
  });

  const enableSwagger = config.get<string>('ENABLE_SWAGGER') === 'true';
  if (enableSwagger) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Zedtrago API Gateway')
      .setDescription('API Gateway for Zedtrago microservices')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  const publicPrefixes = ['/auth', '/health'];

  fastify.addHook('onRequest', async (request: any, reply: any) => {
    request.startTime = process.hrtime.bigint();
    const path = (request.raw?.url ?? request.url ?? '').split('?')[0];
    if (publicPrefixes.some((prefix) => path.startsWith(prefix))) {
      return;
    }

    const authHeader = request.headers?.authorization ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      reply.code(401).send({ statusCode: 401, message: 'Missing bearer token' });
      return;
    }

    try {
      const payload = await jwtService.verifyAsync<{ sub?: string; role?: string; id?: string }>(token);
      request.headers['x-user-id'] = payload.sub ?? payload.id ?? '';
      request.headers['x-user-role'] = payload.role ?? '';
    } catch {
      reply.code(401).send({ statusCode: 401, message: 'Invalid token' });
      return;
    }
  });

  fastify.addHook('onResponse', async (request: any, reply: any) => {
    const startTime = request.startTime as bigint | undefined;
    const durationMs = startTime ? Number(process.hrtime.bigint() - startTime) / 1_000_000 : 0;
    Logger.log(
      `${request.method} ${request.url} ${reply.statusCode} ${durationMs.toFixed(1)}ms`,
      SERVICE_NAME,
    );
  });

  const routes: Array<{ prefix: string; upstream?: string }> = [
    { prefix: '/auth', upstream: config.get<string>('AUTH_SERVICE_URL') },
    { prefix: '/users', upstream: config.get<string>('USER_SERVICE_URL') },
    { prefix: '/hotels', upstream: config.get<string>('HOTEL_SERVICE_URL') },
    { prefix: '/tours', upstream: config.get<string>('TOUR_SERVICE_URL') },
    { prefix: '/bookings', upstream: config.get<string>('BOOKING_SERVICE_URL') },
    { prefix: '/payments', upstream: config.get<string>('PAYMENT_SERVICE_URL') },
    { prefix: '/notifications', upstream: config.get<string>('NOTIFICATION_SERVICE_URL') },
    { prefix: '/reports', upstream: config.get<string>('REPORTING_SERVICE_URL') },
    { prefix: '/currency', upstream: config.get<string>('CURRENCY_SERVICE_URL') },
    { prefix: '/search', upstream: config.get<string>('SEARCH_SERVICE_URL') },
  ];

  for (const route of routes) {
    if (!route.upstream) {
      Logger.warn(`Missing upstream for ${route.prefix}; route disabled.`);
      continue;
    }

    await fastify.register(proxy, {
      upstream: route.upstream,
      prefix: route.prefix,
      rewritePrefix: route.prefix,
    });
  }

  const port = Number(process.env.PORT ?? DEFAULT_PORT);
  await app.listen(port, '0.0.0.0');
  Logger.log(`${SERVICE_NAME} listening on ${port}`);
}

bootstrap();
