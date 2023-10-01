import express from 'express';

import { validateResource } from '../middlewares/validateResource';
import {
  createUserSchema,
  verifyUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../schemas/user.schema';
import {
  createUserHandler,
  verifyUserHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  getCurrentUserHandler,
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

userRouter.post(
  '/api/users/reset-password/:id/:passwordResetCode',
  validateResource(resetPasswordSchema),
  resetPasswordHandler
);

userRouter.get('/api/users/whoami', getCurrentUserHandler);
