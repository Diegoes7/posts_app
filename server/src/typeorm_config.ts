import 'reflect-metadata'
import { DataSource } from "typeorm"
import { User } from "./entities/User"
import { Post } from "./entities/Post"
// import path from 'path';
import { Updoot } from './entities/Updoot'


export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  //! connect to my local database
  username: 'postgres',
  password: 'victoria7',
  database: 'kuejeriets',
  //! hosted database, which is created and its empty
  // url: process.env.DATABASE_URL,
  entities: [Post, User, Updoot],
  synchronize: true,
  logging: false,
  migrations: ['dist/migrations/*.js'],
})
