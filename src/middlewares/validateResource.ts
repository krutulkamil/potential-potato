import type { Request, Response, NextFunction } from 'express';
import { ZodError, type AnyZodObject } from 'zod';

import { log } from '../utils/logger';

export const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const issues = error.issues.map((issue) => issue.message);
        log.error(`Zod Validation: ${issues.join(', ')}`);

        res.status(400).send({ error: issues });
      } else {
        log.error('An unexpected error occurred:', error);
        res.status(400).send(error);
      }
    }
  };
