import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { entities } from './src/entities/index';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  host: process.env.DB_HOST,
  entities: entities,
  migrations: ['src/migrations/*.js'],
  migrationsRun: true,
  migrationsTableName: 'migrations',
  schema: 'gamiotics-tickets',
};

const PostgresDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  entities: entities,
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  schema: 'gamiotics-tickets',
});

export default PostgresDataSource;
