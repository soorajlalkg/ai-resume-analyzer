import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from './config/config';

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_PORT, DB_NAME, DB_LOGGING, DB_SSL } = config;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: false,
  logging: !!DB_LOGGING,
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  entities: [__dirname + '/entities/*.{ts,js}'],
  migrationsTableName: 'migrations',
  ssl: DB_SSL ? { rejectUnauthorized: false } : false,
});
