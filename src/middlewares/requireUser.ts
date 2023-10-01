import type { Request, Response, NextFunction } from 'express';

export const requireUser = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;

  if (!user) {
    return res.status(403).send({ error: 'Unauthorized' });
  }

  return next();
};
