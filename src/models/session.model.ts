import type { Ref } from '@typegoose/typegoose';
import { getModelForClass, prop } from '@typegoose/typegoose';

import { User } from './user.model';

export class Session {
  @prop({ ref: () => User })
  user: Ref<User>;

  @prop({ default: true })
  valid: boolean;
}

export const SessionModel = getModelForClass(Session, {
  schemaOptions: {
    timestamps: true,
  },
});
