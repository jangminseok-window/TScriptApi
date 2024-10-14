declare module 'mybatis-mapper' {
    export function createMapper(xmls: string[]): void;
    export function getStatement(namespace: string, sql: string, param?: any, format?: any): string;
  }