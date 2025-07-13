import { Request, Response } from 'express';
import { Redis } from 'ioredis';

import 'express-session';
import { createUserLoader } from './utils/createUserLoader';
import { createUpdootLoader } from './utils/createUpdootLoader';

declare module 'express-session' {
  interface Session {
    userID: number;
  }
}

export type MyContext = {
  req: Request,
  redis: Redis;
  res: Response,
  userLoader: ReturnType<typeof createUserLoader>; //! give return value of the function
  updootLoader: ReturnType<typeof createUpdootLoader>; 
};