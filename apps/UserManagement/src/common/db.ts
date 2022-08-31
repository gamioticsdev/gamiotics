import 'reflect-metadata';
import { createConnection, ConnectionOptions } from 'typeorm';
import { join } from 'path';
import { readJson } from 'fs-extra';
import dotenv from "dotenv"
dotenv.config();

export async function createDbConnection() {
  const configJson = await readJson(join(process.cwd(), '/ormconfig.json'));
  configJson.host = process.env.DB_HOST;
  configJson.username = process.env.DB_USERNAME;
  configJson.password = process.env.DB_PASSWORD;
  configJson.database = process.env.DATABASE;
  const config: ConnectionOptions = configJson
  const connection = await createConnection(config);
  await connection.runMigrations({
    transaction: 'none',
  });
  return 'connected to db';
}
