import express, { type Request, type Response } from 'express';

export const userRouter = express.Router();

userRouter.post('/api/users', (_: Request, res: Response) => {
  return res.sendStatus(200);
});
