import mailQueue from '../queues/mailQueue.js';

const addMailJob = async (mailData) => {
  const job = await mailQueue.add('send-email', mailData, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
  });
  return job;
};

export { addMailJob };
