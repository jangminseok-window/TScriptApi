"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mybatis_mapper_1 = __importDefault(require("mybatis-mapper"));
const log_1 = __importDefault(require("./log"));
const mybatisMapper = {
    createMapper: mybatis_mapper_1.default.createMapper,
    getStatement: function (namespace, sql, param, format) {
        const query = mybatis_mapper_1.default.getStatement(namespace, sql, param, format);
        if (log_1.default.level === 'debug' || log_1.default.level === 'trace') {
            log_1.default.debug(`Executing query for ${namespace}.${sql}: ${query}`);
        }
        return query;
    }
};
exports.default = mybatisMapper;
