import type { Request, Response } from 'express';
import { get } from 'lodash';

import type { TCreateSessionSchema } from '../schemas/auth.schema';
import { findUserByEmail, findUserById } from '../services/user.service';
import { log } from '../utils/logger';
import {
  findSessionById,
  signAccessToken,
  signRefreshToken,
} from '../services/auth.service';
import { verifyJwt } from '../utils/jwt';

export const createSessionHandler = async (
  req: Request<object, object, TCreateSessionSchema>,
  res: Response
) => {
  const message = 'Invalid email or password';
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).send({ error: message });
    }

    if (!user.verified) {
      return res.status(401).send({ error: 'User not verified' });
    }

    const isValid = await user.validatePassword(password);

    if (!isValid) {
      return res.status(401).send({ error: message });
    }

    // SIGN ACCESS TOKEN
    const accessToken = signAccessToken(user);

    // SIGN REFRESH TOKEN
    const refreshToken = await signRefreshToken({ userId: user._id });

    // SEND TOKENS
    return res.status(200).send({ accessToken, refreshToken });
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

export const refreshAccessTokenHandler = async (
  req: Request,
  res: Response
) => {
  const errorMessage = 'Could not refresh access token';
  const refreshToken = String(get(req, 'headers.x-refresh', ''));

  const decoded = verifyJwt<{ session: string }>(
    refreshToken,
    'refreshTokenPublicKey'
  );
  if (!decoded) {
    return res.status(401).send({ error: errorMessage });
  }

  const sessionId = decoded.session;
  if (!sessionId) {
    return res.status(401).send({ error: errorMessage });
  }

  const session = await findSessionById(sessionId);
  if (!session || !session.valid) {
    return res.status(401).send({ error: errorMessage });
  }

  const user = await findUserById(String(session.user));
  if (!user) {
    return res.status(401).send({ error: errorMessage });
  }

  const accessToken = signAccessToken(user);
  return res.send({ accessToken });
};
