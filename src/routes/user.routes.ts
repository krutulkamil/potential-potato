import express from 'express';

import { validateResource } from '../middlewares/validateResource';
import { createUserSchema } from '../schemas/user.schema';
import { createUserHandler } from '../controllers/user.controller';

export const userRouter = express.Router();

userRouter.post(
  '/api/users',
  validateResource(createUserSchema),
  createUserHandler
);
