import 'reflect-metadata';
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Post } from "../entities/Post";
import { Updoot } from '../entities/Updoot';
import { AuditLog } from '../entities/Audit_log';


export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST?.toString(),
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD?.toString(),
  database: process.env.POSTGRES_DB,
  entities: [Post, User, Updoot, AuditLog],
  synchronize: false,
  logging: false,

  //! localhost setup
  // type: "postgres",
  // host: "localhost", // must match docker-compose service name
  // port: 5432,
  // username: "postgres",
  // password: "victoria7",
  // database: "posts_db",
  // entities: [Post, User, Updoot, AuditLog],
  // synchronize: true,
  // logging: true,
  // migrations: ['dist/migrations/*.js'], //* for runtime use
});


////////////////$ create a migration file ////////////
//! npx typeorm migration:generate dist/migrations/CreateAuditLogTable -d dist/db/typeorm_config.js
//? npx typeorm-ts-node-commonjs migration:generate src/migrations/CreateAuditLogTable -d src/db/typeorm_config.ts
//& npx typeorm migration:run -d dist/typeorm_config.js // migration in production, after compile
