import { PrismaClient } from '@prisma/client';

export const createPrismaClient = (connectionString?: string) => {
  const url = connectionString ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is required to initialize PrismaClient');
  }

  return new PrismaClient({ datasources: { db: { url } } });
};
