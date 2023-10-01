import express from 'express';

import { validateResource } from '../middlewares/validateResource';
import { createSessionSchema } from '../schemas/auth.schema';
import {
  createSessionHandler,
  refreshAccessTokenHandler,
} from '../controllers/auth.controller';

export const authRouter = express.Router();

authRouter.post(
  '/api/sessions',
  validateResource(createSessionSchema),
  createSessionHandler
);

authRouter.post('/api/sessions/refresh', refreshAccessTokenHandler);
