import express from 'express';

import { validateResource } from '../middlewares/validateResource';
import { createSessionSchema } from '../schemas/auth.schema';
import { createSessionHandler } from '../controllers/auth.controller';

export const authRouter = express.Router();

authRouter.post(
  '/api/sessions',
  validateResource(createSessionSchema),
  createSessionHandler
);
