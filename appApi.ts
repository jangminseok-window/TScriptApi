// appApi.ts

import { v4 as uuidv4 } from 'uuid';
import { 
  config,
  mysqlConfig, 
  logger, 
  express, 
  my_secret_key, 
  router, 
  serverConfig, 
  app,
  cors,
  bodyParser,
  cryptoUtil,
  getRedisPool,
  mysqlpool 
} from './app-context';

import { Request, Response, NextFunction ,ErrorRequestHandler } from 'express';


interface CustomRequest extends Request {
  common?: {
    sessionVal: string | null;
  };
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

logger.info(`apiApp Start---->`);
//logger.info(`prometeus Start---->`);

const redis = getRedisPool();

app.use(async (req: CustomRequest, res: Response, next: NextFunction) => {
  try { 
    logger.info(`app user`);
    const sessionVal = req.headers['x-session-id'] as string | undefined || null;
  
    logger.info(`sessionVal::${sessionVal}`);
  
    req.common = {
      sessionVal: sessionVal
    };
      
    logger.info(`Request Body: ${JSON.stringify(req.body)}`);
  
    if (sessionVal) { // session 값이 있다면 시간 갱신
      logger.info(`sessionVal 1::`);
      const exists = await redis.exists(sessionVal);
      logger.info(`sessionVal 2::`);
      
      if (exists === 1) {
        const result = await redis.expire(sessionVal, serverConfig.sessionTimeout);
      } 
      
      logger.info(`sessionVal 3::`);
    }
  
  } catch (error) {
    logger.info(`sessionVal 4::`);
    logger.error(`Error updating session TTL: ${error}`);
  }    

  next();
});


const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
      logger.error('Bad JSON', err);
      res.status(400).send({ status: 400, message: "Bad JSON" });
    } else {
      next(err);
    }
  };

app.use(errorHandler);

const port = serverConfig.port || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express on Windows!');
});

// 라우터 설정
//app.use('/api', router);


import authRoutes from './auth';
//import userRoutes from './user';

// 라우트 연결
//app.use('/board', boardRoutes);
app.use('/auth', authRoutes);
//app.use('/user', userRoutes);
//app.use('/vote', voteRoutes);



app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});