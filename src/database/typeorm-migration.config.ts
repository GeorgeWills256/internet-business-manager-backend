import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const MigrationDataSource = new DataSource({
  type: 'postgres',

  // Use the pooler connection (same as the app)
  url: process.env.DATABASE_URL,

  // Pooler already terminates TLS, so no SSL config needed
  ssl: false,

  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],

  synchronize: false,
  logging: false,
});
