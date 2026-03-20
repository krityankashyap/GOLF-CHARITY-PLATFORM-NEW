import { Worker } from 'bullmq';
import redisConnection from '../config/redisConfig.js';
import transporter from '../config/mailConfig.js';
import createMailObject from '../utils/common/mailObject.js';

const mailProcessor = new Worker(
  'mail',
  async (job) => {
    const { to, subject, html, text } = job.data;

    const mailOptions = createMailObject({ to, subject, html, text });

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${subject}`);
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

mailProcessor.on('completed', (job) => {
  console.log(`Mail job ${job.id} completed`);
});

mailProcessor.on('failed', (job, err) => {
  console.error(`Mail job ${job.id} failed:`, err.message);
});

export default mailProcessor;
