import { omit } from 'lodash';

import { UserModel } from '../models/user.model';
import type { TCreateUserSchema } from '../schemas/user.schema';

export const createUser = async (input: TCreateUserSchema) => {
  const user = await UserModel.create(input);

  return omit(user.toJSON(), ['password', '__v']);
};

export const findUserById = (id: string) => {
  return UserModel.findById(id);
};

export const findByEmail = (email: string) => {
  return UserModel.findOne({ email });
};
