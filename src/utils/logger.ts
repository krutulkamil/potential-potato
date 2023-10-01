import logger from 'pino';
import dayjs from 'dayjs';

export const log = logger({
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    },
  },
  base: {
    pid: false,
  },
});
