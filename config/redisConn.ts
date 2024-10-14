import Redis from 'ioredis';
import config from 'config';

const redisConfig = config.get('redis') as any;

function createRedisPool(): Redis {
  return new Redis({
    host: redisConfig.host,
    port: 6379,
    password: redisConfig.password,
    db: 0,
    enableReadyCheck: false,
    // Redis 5.0 이상에서는 poolSize 대신 maxRetriesPerRequest를 사용합니다
    maxRetriesPerRequest: 10, // poolSize 대신 사용
    // minIdle은 ioredis에서 지원하지 않습니다. 필요하다면 다른 방식으로 구현해야 합니다.
  });
}

let redisPool: Redis | null = null;

export function getRedisPool(): Redis {
  if (!redisPool) {
    redisPool = createRedisPool();
    
    redisPool.on('error', (err) => {
      console.error('Redis pool error:', err);
    });

    redisPool.on('connect', () => {
      console.log('Connected to Redis');
    });
  }
  return redisPool;
}

export const initRedisPool = getRedisPool;