import express from 'express';

import { validateResource } from '../middlewares/validateResource';
import {
  createUserSchema,
  verifyUserSchema,
  forgotPasswordSchema,
} from '../schemas/user.schema';
import {
  createUserHandler,
  verifyUserHandler,
  forgotPasswordHandler,
} from '../controllers/user.controller';

export const userRouter = express.Router();

userRouter.post(
  '/api/users',
  validateResource(createUserSchema),
  createUserHandler
);

userRouter.post(
  '/api/users/verify/:id/:verificationCode',
  validateResource(verifyUserSchema),
  verifyUserHandler
);

userRouter.post(
  '/api/users/forgot-password',
  validateResource(forgotPasswordSchema),
  forgotPasswordHandler
);
