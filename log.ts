import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import config from 'config';

// config에서 로그 레벨 가져오기
const logLevel: string = config.get('logLevel') || 'info';

const logger = winston.createLogger({
  level: logLevel, // 여기서 config에서 가져온 로그 레벨 사용
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.DailyRotateFile({
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
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;