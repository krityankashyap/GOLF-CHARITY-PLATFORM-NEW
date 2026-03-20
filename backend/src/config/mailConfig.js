import nodemailer from 'nodemailer';
import serverConfig from './serverConfig.js';

const transporter = nodemailer.createTransport({
  host: serverConfig.MAIL_HOST,
  port: serverConfig.MAIL_PORT,
  secure: serverConfig.MAIL_PORT === 465,
  auth: {
    user: serverConfig.MAIL_USER,
    pass: serverConfig.MAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error('Mail transporter verification failed:', error.message);
  } else {
    console.log('Mail transporter ready');
  }
});

export default transporter;
