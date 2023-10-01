import type { Request, Response } from 'express';

import { createUser } from '../services/user.service';
import type { TCreateUserSchema } from '../schemas/user.schema';
import { log } from '../utils/logger';
import { sendEmail } from '../utils/mailer';

export const createUserHandler = async (
  req: Request<object, object, TCreateUserSchema>,
  res: Response
) => {
  try {
    // CREATE USER
    const user = await createUser(req.body);
    log.info('User Controller: User created successfully');

    // SEND E-MAIL
    await sendEmail({
      from: 'test@example.com',
      to: user.email,
      subject: 'Please verify your account!',
      text: `Verification code ${user.verificationCode}. Id: ${user._id}`,
    });

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
