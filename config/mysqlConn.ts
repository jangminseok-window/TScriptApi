import config from 'config';
import mysql from 'mysql2/promise';

interface MySQLConfig {
  host: string;
  user: string;
  password: string;
  database: string;
}

const mysqlConfig: MySQLConfig = config.get('mysql');

const db_info: mysql.PoolOptions = {
  host: mysqlConfig.host,
  port: 3306,
  user: mysqlConfig.user,
  password: mysqlConfig.password,
  database: mysqlConfig.database,
  connectionLimit: 10 // 연결 풀의 최대 연결 수
};

let pool: mysql.Pool | null = null;

export const init = (): mysql.Pool => {
  if (!pool) {
    pool = mysql.createPool(db_info);
  }
  return pool;
};

export const connect = async (): Promise<mysql.Pool> => {
  try {
    if (!pool) {
      pool = init();
    }
    const connection = await pool.getConnection();
    console.log("MySQL pool connected successfully!");
    connection.release();
    return pool;
  } catch (err) {
    console.error("MySQL pool connection error:", err);
    throw err;
  }
};

export default { init, connect };