import type { DocumentType } from '@typegoose/typegoose';
import type mongoose from 'mongoose';
import { omit } from 'lodash';

import { SessionModel } from '../models/session.model';
import { privateFields } from '../models/user.model';
import { signJwt } from '../utils/jwt';
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
  const payload = omit(user.toJSON(), privateFields);

  return signJwt(payload, 'accessTokenPrivateKey');
};
