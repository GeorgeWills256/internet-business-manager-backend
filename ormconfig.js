// ormconfig.ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,         // Supabase PostgreSQL URL
  synchronize: true,                     // set to false in production after first deploy
  logging: false,
  entities: ['dist/**/*.entity.js'],     // compiled entities folder
  migrations: ['dist/migrations/*.js'], // compiled migrations folder
  subscribers: [],
  ssl: {
    rejectUnauthorized: false,          // Supabase requires this for Node.js
  },
});
