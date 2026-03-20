import dotenv from 'dotenv';

dotenv.config();

const serverConfig = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/golf-charity-db',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_change_in_production',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_MONTHLY_PRICE_ID: process.env.STRIPE_MONTHLY_PRICE_ID,
  STRIPE_YEARLY_PRICE_ID: process.env.STRIPE_YEARLY_PRICE_ID,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: parseInt(process.env.MAIL_PORT) || 587,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
  MAIL_FROM: process.env.MAIL_FROM || 'Golf Charity Platform <noreply@golfcharity.com>',
  REDIS_URL: process.env.REDIS_URL || '',
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: parseInt(process.env.REDIS_PORT) || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || 'golf-charity-proofs',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  MONTHLY_PLAN_AMOUNT: parseInt(process.env.MONTHLY_PLAN_AMOUNT) || 1000,
  YEARLY_PLAN_AMOUNT: parseInt(process.env.YEARLY_PLAN_AMOUNT) || 10000,
  PRIZE_POOL_PERCENT: parseFloat(process.env.PRIZE_POOL_PERCENT) || 30,
  MIN_CHARITY_PERCENT: parseFloat(process.env.MIN_CHARITY_PERCENT) || 10,
};

export default serverConfig;
