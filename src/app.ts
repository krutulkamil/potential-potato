import express from 'express';
import config from 'config';

import { connect } from './utils/connect';
import { log } from './utils/logger';
import { router } from './routes';

const host = config.get<string>('host');
const port = config.get<number>('port');
const protocol = config.get<boolean>('https') ? 'https' : 'http';

const app = express();

app.use(express.json());
app.use(router);

app.listen(port, async () => {
  log.info(`Server is running on ${protocol}://${host}:${port}`);

  await connect();
});
