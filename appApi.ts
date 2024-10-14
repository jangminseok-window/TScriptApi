// appApi.ts

import { 
        config,
         mysqlConfig, 
         logger, 
         express, 
         my_secret_key, 
         router, 
         serverConfig, 
         app,
         cors,
         bodyParser,
         cryptoUtil,
         mysqlpool } 
from './app-context';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express on Windows!');
});

// 라우터 설정
//app.use('/api', router);



app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});