import type { DocumentType } from '@typegoose/typegoose';
import {
  getModelForClass,
  modelOptions,
  pre,
  prop,
  Severity,
} from '@typegoose/typegoose';
import { nanoid } from 'nanoid';
import argon2 from 'argon2';

import { log } from '../utils/logger';

@pre<User>('save', async function (this: DocumentType<User>) {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await argon2.hash(this.password);
  return;
})
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({ lowercase: true, required: true, unique: true })
  email: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true, default: () => nanoid() })
  verificationCode: string;

  @prop()
  passwordResetCode: string | null;

  @prop({ default: false })
  verified: boolean;

  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword);
    } catch (error) {
      log.error('Could not validate password');
      return false;
    }
  }
}

export const UserModel = getModelForClass(User);

type TUserFields = keyof User | '__v';

export const privateFields: TUserFields[] = [
  'password',
  'verificationCode',
  'passwordResetCode',
  'verified',
  '__v',
];
