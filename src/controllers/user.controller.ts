import type { Request, Response } from 'express';
import { nanoid } from 'nanoid';

import {
  createUser,
  findByEmail,
  findUserById,
} from '../services/user.service';
import { sendEmail } from '../utils/mailer';
import { log } from '../utils/logger';
import type {
  TCreateUserSchema,
  TForgotPasswordSchema,
  TVerifyUserSchema,
} from '../schemas/user.schema';

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
      html: `<p>Verification code <span style="color: red; font-weight: bold">${user.verificationCode}</span>. Id: <span style="color: red; font-weight: bold;">${user._id}</span></p>`,
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

export const verifyUserHandler = async (
  req: Request<TVerifyUserSchema>,
  res: Response
) => {
  const id = req.params.id;
  const verificationCode = req.params.verificationCode;

  // FIND USER BY ID

  try {
    const user = await findUserById(id);
    if (!user) return res.status(404).send({ error: 'User not found' });

    // CHECK IF ALREADY VERIFIED
    if (user.verified) {
      return res.status(400).send({ error: 'User already verified' });
    }

    // CHECK IF VERIFICATION CODE MATCHES
    if (user.verificationCode === verificationCode) {
      user.verified = true;

      await user.save();

      return res.status(200).send({ message: 'User verified successfully' });
    }

    return res.status(400).send({ error: 'Invalid verification code' });
  } catch (error) {
    if (error instanceof Error) {
      log.error(`User Controller Error: ${error.message}`);
      return res.status(400).send({ error: error.message });
    }

    return res
      .status(500)
      .send({ error: 'User Controller: An unexpected error occurred' });
  }
};

export const forgotPasswordHandler = async (
  req: Request<object, object, TForgotPasswordSchema>,
  res: Response
) => {
  const message =
    'If a user with this email exists, a reset password link will be sent to it';

  const { email } = req.body;

  try {
    // FIND USER BY EMAIL
    const user = await findByEmail(email);
    if (!user) {
      log.debug('ForgotPassword: User not found by email');
      return res.send({ message });
    }

    if (!user.verified) {
      log.debug('ForgotPassword: User not verified');
      return res.status(400).send({ error: 'User is not verified' });
    }

    const passwordResetCode = nanoid();
    user.passwordResetCode = passwordResetCode;

    await user.save();

    // SEND E-MAIL
    await sendEmail({
      from: 'test@example.com',
      to: user.email,
      subject: 'Reset your password',
      text: `Password reset code: ${passwordResetCode}. Id: ${user._id}`,
      html: `<p>Password reset code: <span style="color: red; font-weight: bold">${passwordResetCode}</span>. Id: <span style="color: red; font-weight: bold;">${user._id}</span></p>`,
    });

    log.debug(`ForgotPassword: Password reset code sent to ${email}`);

    return res.send({ message });
  } catch (error) {
    if (error instanceof Error) {
      log.error(`User Controller Error: ${error.message}`);
      return res.status(400).send({ error: error.message });
    }

    return res
      .status(500)
      .send({ error: 'User Controller: An unexpected error occurred' });
  }
};
