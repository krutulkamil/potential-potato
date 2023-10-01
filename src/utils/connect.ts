import mongoose from 'mongoose';
import config from 'config';

import { log } from './logger';

export const connect = async () => {
  const dbUri = config.get<string>('dbUri');

  try {
    await mongoose.connect(dbUri);
    log.info('Connected to mongoDB');
  } catch (error) {
    log.error('Error! Could not connect to mongoDB', error);
    process.exit(1);
  }
};
