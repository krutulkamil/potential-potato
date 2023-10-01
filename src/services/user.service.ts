import { omit } from 'lodash';

import { privateFields, UserModel } from '../models/user.model';
import type { TCreateUserSchema } from '../schemas/user.schema';

export const createUser = async (input: TCreateUserSchema) => {
  const user = await UserModel.create(input);

  return omit(user.toJSON(), privateFields);
};
