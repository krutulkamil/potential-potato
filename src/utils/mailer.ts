import nodemailer, { type SendMailOptions } from 'nodemailer';
import config from 'config';

import { log } from './logger';

interface ISmtpConfig {
  user: string;
  pass: string;
  host: string;
  port: number;
  secure: boolean;
}

const smtp = config.get<ISmtpConfig>('smtp');

const transporter = nodemailer.createTransport({
  ...smtp,
  auth: { user: smtp.user, pass: smtp.pass },
});

export const sendEmail = async (payload: SendMailOptions) => {
  transporter.sendMail(payload, (error, info) => {
    if (error) {
      log.error(`Error sending email: ${error.message}`);
      return;
    }

    log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  });
};
