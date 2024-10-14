import originalMybatisMapper from 'mybatis-mapper';
import logger from './log';

interface MybatisMapper {
  createMapper: typeof originalMybatisMapper.createMapper;
  getStatement: (namespace: string, sql: string, param?: any, format?: any) => string;
}

const mybatisMapper: MybatisMapper = {
  createMapper: originalMybatisMapper.createMapper,
  getStatement: function(namespace: string, sql: string, param?: any, format?: any): string {
    const query = originalMybatisMapper.getStatement(namespace, sql, param, format);
    if (logger.level === 'debug' || logger.level === 'trace') {
      logger.debug(`Executing query for ${namespace}.${sql}: ${query}`);
    }
    return query;
  }
};

export default mybatisMapper;