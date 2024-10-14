"use strict";
// appApi.ts
Object.defineProperty(exports, "__esModule", { value: true });
const app_context_1 = require("./app-context");
app_context_1.app.use(app_context_1.bodyParser.json());
app_context_1.app.use(app_context_1.bodyParser.urlencoded({ extended: true }));
app_context_1.app.use((0, app_context_1.cors)());
const port = process.env.PORT || 3000;
app_context_1.app.get('/', (req, res) => {
    res.send('Hello, TypeScript with Express on Windows!');
});
// 라우터 설정
//app.use('/api', router);
app_context_1.app.listen(port, () => {
    app_context_1.logger.info(`Server running on port ${port}`);
});
