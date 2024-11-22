import Redis from 'ioredis';

if (!process.env.REDIS_URL) {
  throw new Error('Please add your Redis URL to .env.local');
}

let redis: Redis;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithRedis = global as typeof globalThis & {
    redis?: Redis;
  };

  if (!globalWithRedis.redis) {
    globalWithRedis.redis = new Redis(process.env.REDIS_URL);
  }
  redis = globalWithRedis.redis;
} else {
  // In production mode, it's best to not use a global variable.
  redis = new Redis(process.env.REDIS_URL);
}

export function getRedisClient() {
  return redis;
}
