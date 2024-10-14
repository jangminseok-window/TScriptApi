"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
require("winston-daily-rotate-file");
const config_1 = __importDefault(require("config"));
// config에서 로그 레벨 가져오기
const logLevel = config_1.default.get('logLevel') || 'info';
const logger = winston_1.default.createLogger({
    level: logLevel, // 여기서 config에서 가져온 로그 레벨 사용
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.DailyRotateFile({
            filename: './log/webApp-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        })
    ]
});
// 개발 환경에서는 콘솔에도 로그 출력
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple()
    }));
}
exports.default = logger;
