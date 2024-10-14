
import { v4 as uuidv4 } from 'uuid';

import { 
  config,
  mysqlConfig, 
  logger, 
  my_secret_key, 
  serverConfig, 
  app,
  cors,
  bodyParser,
  cryptoUtil,
  getRedisPool,
  mysqlpool,
  mybatisMapper 
} from './app-context';

import express, { Request, Response, NextFunction, Router } from 'express';
import { RowDataPacket } from 'mysql2';


const router: Router = express.Router();
const redis = getRedisPool();



interface CustomRequest extends Request {
  common?: {
    sessionVal: string | null;
  };
}

interface LoginRequest extends CustomRequest {
  body: {
    userId: string;
    password: string;
  };
}

// 로그인
router.post('/login', async (req: LoginRequest, res: Response, next: NextFunction) => {

  try { 
    const { userId, password } = req.body;

    // 입력 검증
    if (!userId || !password) {
      res.status(400).json({ error: 'userId and password are required' });
    }
     
    const params = { id: userId, secretkey: my_secret_key };
    const query = mybatisMapper.getStatement('userMapper', 'selectById', params);
    
    const [rows] = await mysqlpool.execute(query, [userId, my_secret_key]) as unknown as [RowDataPacket[], any];

    if (rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
    }

    logger.info(`User found: ${userId}`);
    logger.info(`User found: ${rows[0]}`);
   
  } catch (error) {
    logger.error(`Login error : ${(error as Error).message}`);
    res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
  }
} );



export default router;