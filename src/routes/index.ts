import express, { type Request, type Response } from 'express';

import { userRouter } from './user.routes';
import { authRouter } from './auth.routes';

export const router = express.Router();

router.get('/healthcheck', (_: Request, res: Response) => {
  return res.sendStatus(200);
});

router.use(userRouter);
router.use(authRouter);
