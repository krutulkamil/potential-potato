import type { DocumentType } from '@typegoose/typegoose';
import type mongoose from 'mongoose';

import { signJwt } from '../utils/jwt';
import { SessionModel } from '../models/session.model';
import type { User } from '../models/user.model';

interface IUserId {
  userId: mongoose.Types.ObjectId;
}

export const createSession = async ({ userId }: IUserId) => {
  return await SessionModel.create({ user: userId });
};

export const signRefreshToken = async ({ userId }: IUserId) => {
  const session = await createSession({ userId });

  return signJwt({ session: session._id }, 'refreshTokenPrivateKey');
};

export const signAccessToken = (user: DocumentType<User>) => {
  const payload = user.toJSON();

  return signJwt(payload, 'accessTokenPrivateKey');
};
