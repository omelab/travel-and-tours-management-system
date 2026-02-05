import { defineConfig, env } from 'prisma/config';
import { join } from 'node:path';

export default defineConfig({
  engine: 'classic',
  schema: join('prisma', 'schema.prisma'),
  datasource: {
    url: env('DATABASE_URL'),
  },
});
