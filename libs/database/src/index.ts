import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';

export type DatabaseModuleOptions = {
  databaseUrl?: string;
  logging?: boolean;
  models?: Array<new () => unknown>;
  pool?: {
    max?: number;
    min?: number;
    idle?: number;
    acquire?: number;
  };
};

export const SEQUELIZE_CONNECTION = Symbol('SEQUELIZE_CONNECTION');

export const createSequelize = (
  databaseUrl: string,
  options: DatabaseModuleOptions = {},
) => {
  const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging:
      options.logging ?? (process.env.DB_LOGGING === 'true' ? console.log : false),
    pool: options.pool,
  });

  if (options.models && options.models.length > 0) {
    sequelize.addModels(options.models as any[]);
  }

  return sequelize;
};

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(options: DatabaseModuleOptions = {}): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: SEQUELIZE_CONNECTION,
          inject: [ConfigService],
          useFactory: (config: ConfigService) => {
            const url =
              options.databaseUrl ??
              config.get<string>('DATABASE_URL') ??
              process.env.DATABASE_URL;

            if (!url) {
              throw new Error('DATABASE_URL is required to initialize Sequelize');
            }

            return createSequelize(url, options);
          },
        },
        {
          provide: Sequelize,
          useExisting: SEQUELIZE_CONNECTION,
        },
      ],
      exports: [SEQUELIZE_CONNECTION, Sequelize],
    };
  }
}
