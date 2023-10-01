import express, { type Request, type Response } from 'express';

export const authRouter = express.Router();

authRouter.get('/api/auth', (_: Request, res: Response) => {
  return res.sendStatus(200);
});
