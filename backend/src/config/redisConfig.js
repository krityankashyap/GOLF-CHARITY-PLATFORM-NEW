import Redis from 'ioredis';
import serverConfig from './serverConfig.js';

const redisConnection = serverConfig.REDIS_URL
  ? new Redis(serverConfig.REDIS_URL, { maxRetriesPerRequest: null })
  : new Redis({
      host: serverConfig.REDIS_HOST,
      port: serverConfig.REDIS_PORT,
      password: serverConfig.REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: null,
    });

redisConnection.on('connect', () => {
  console.log('Redis connected');
});

redisConnection.on('error', (err) => {
  console.error('Redis connection error:', err.message);
});

export default redisConnection;
