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
const app_context_1 = require("./app-context");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const redis = (0, app_context_1.getRedisPool)();
// 로그인
router.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, password } = req.body;
        // 입력 검증
        if (!userId || !password) {
            res.status(400).json({ error: 'userId and password are required' });
        }
        const params = { id: userId, secretkey: app_context_1.my_secret_key };
        const query = app_context_1.mybatisMapper.getStatement('userMapper', 'selectById', params);
        const [rows] = yield app_context_1.mysqlpool.execute(query, [userId, app_context_1.my_secret_key]);
        if (rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
        }
        app_context_1.logger.info(`User found: ${userId}`);
        app_context_1.logger.info(`User found: ${rows[0]}`);
    }
    catch (error) {
        app_context_1.logger.error(`Login error : ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}));
exports.default = router;
