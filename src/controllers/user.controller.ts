import type { Request, Response } from 'express';

import { createUser } from '../services/user.service';
import type { TCreateUserSchema } from '../schemas/user.schema';
import { log } from '../utils/logger';

export const createUserHandler = async (
  req: Request<object, object, TCreateUserSchema>,
  res: Response
) => {
  try {
    const user = await createUser(req.body);
    log.info('User Controller: User created successfully');

    return res.status(200).send(user);
  } catch (error) {
    if (error instanceof Error) {
      log.error(`User Controller Error: ${error.message}`);
      return res
        .status(409)
        .send({ error: 'User with that email already exists!' });
    }

    return res
      .status(500)
      .send({ error: 'User Controller: An unexpected error occurred' });
  }
};
