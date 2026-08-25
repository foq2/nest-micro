import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { NodeEnv } from '@repo/nest-common';
import path from 'path';

export default defineConfig({
  driver: PostgreSqlDriver,
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
  dbName: process.env.DB_NAME || 'user',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  schema: process.env.DB_SCHEMA,

  debug: process.env.NODE_ENV != NodeEnv.Production,

  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],

  extensions: [Migrator],
  migrations: {
    pathTs: path.join(process.cwd(), 'src/database/migrations'),
    path: path.join(process.cwd(), 'dist/database/migrations'),
  },
});
