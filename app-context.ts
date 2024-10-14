import config from 'config';
import express, { Router } from 'express';
import mysql  from './config/mysqlConn';
import logger from './log';
import bodyParser from 'body-parser';
import cors from 'cors';
import cryptoUtil from './crypto/cryptoutil';



const mysqlConfig = config.get('mysql') as any;
const redisConfig = config.get('redis') as any;
const serverConfig = config.get('server') as any;

const my_secret_key = mysqlConfig.secretkey;




const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');

const mysqlpool = mysql.init();

const router = express.Router();

export {
  config,
  mysqlConfig,
  redisConfig,
  serverConfig,
  logger,
  express,
  my_secret_key,
  router,
  cors,
  bodyParser,
  app,
  cryptoUtil,
  mysqlpool
};