"use strict";
// appApi.ts
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
app_context_1.app.use(app_context_1.bodyParser.json());
app_context_1.app.use(app_context_1.bodyParser.urlencoded({ extended: true }));
app_context_1.app.use((0, app_context_1.cors)());
app_context_1.logger.info(`apiApp Start---->`);
//logger.info(`prometeus Start---->`);
const redis = (0, app_context_1.getRedisPool)();
app_context_1.app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        app_context_1.logger.info(`app user`);
        const sessionVal = req.headers['x-session-id'] || null;
        app_context_1.logger.info(`sessionVal::${sessionVal}`);
        req.common = {
            sessionVal: sessionVal
        };
        app_context_1.logger.info(`Request Body: ${JSON.stringify(req.body)}`);
        if (sessionVal) { // session 값이 있다면 시간 갱신
            app_context_1.logger.info(`sessionVal 1::`);
            const exists = yield redis.exists(sessionVal);
            app_context_1.logger.info(`sessionVal 2::`);
            if (exists === 1) {
                const result = yield redis.expire(sessionVal, app_context_1.serverConfig.sessionTimeout);
            }
            app_context_1.logger.info(`sessionVal 3::`);
        }
    }
    catch (error) {
        app_context_1.logger.info(`sessionVal 4::`);
        app_context_1.logger.error(`Error updating session TTL: ${error}`);
    }
    next();
}));
const errorHandler = (err, req, res, next) => {
    if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
        app_context_1.logger.error('Bad JSON', err);
        res.status(400).send({ status: 400, message: "Bad JSON" });
    }
    else {
        next(err);
    }
};
app_context_1.app.use(errorHandler);
const port = app_context_1.serverConfig.port || 3000;
app_context_1.app.get('/', (req, res) => {
    res.send('Hello, TypeScript with Express on Windows!');
});
// 라우터 설정
//app.use('/api', router);
const auth_1 = __importDefault(require("./auth"));
//import userRoutes from './user';
// 라우트 연결
//app.use('/board', boardRoutes);
app_context_1.app.use('/auth', auth_1.default);
//app.use('/user', userRoutes);
//app.use('/vote', voteRoutes);
app_context_1.app.listen(port, () => {
    app_context_1.logger.info(`Server running on port ${port}`);
});
