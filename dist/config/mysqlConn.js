"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = exports.init = void 0;
const config_1 = __importDefault(require("config"));
const promise_1 = __importDefault(require("mysql2/promise"));
const mysqlConfig = config_1.default.get('mysql');
const db_info = {
    host: mysqlConfig.host,
    port: 3306,
    user: mysqlConfig.user,
    password: mysqlConfig.password,
    database: mysqlConfig.database,
    connectionLimit: 10 // 연결 풀의 최대 연결 수
};
let pool = null;
const init = () => {
    if (!pool) {
        pool = promise_1.default.createPool(db_info);
    }
    return pool;
};
exports.init = init;
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!pool) {
            pool = (0, exports.init)();
        }
        const connection = yield pool.getConnection();
        console.log("MySQL pool connected successfully!");
        connection.release();
        return pool;
    }
    catch (err) {
        console.error("MySQL pool connection error:", err);
        throw err;
    }
});
exports.connect = connect;
exports.default = { init: exports.init, connect: exports.connect };
