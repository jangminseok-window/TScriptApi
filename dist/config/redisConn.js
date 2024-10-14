"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRedisPool = void 0;
exports.getRedisPool = getRedisPool;
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = __importDefault(require("config"));
const redisConfig = config_1.default.get('redis');
function createRedisPool() {
    return new ioredis_1.default({
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
let redisPool = null;
function getRedisPool() {
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
exports.initRedisPool = getRedisPool;
