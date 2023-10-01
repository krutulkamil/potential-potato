import express from 'express';
import config from 'config';

import { log } from './utils/logger';

const host = config.get<string>('host');
const port = config.get<number>('port');
const protocol = config.get<boolean>('https') ? 'https' : 'http';

const app = express();

app.use(express.json());

app.listen(port, async () => {
  log.info(`Server is running on ${protocol}://${host}:${port}`);
});
