const path = require('path');
const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const swaggerInit = require('./node/config/swaggerConfig');
const { queryDatabase } = require('./node/config/mysqlConfig');
const { getFilePath } = require('./node/tools/option/fileOption');
const { setEnvironmentVariables } = require('./configureIP'); // 引入ip配置文件
const { publicPath, PORT, headerConfig, currentDir } = require('./node/config/publicConfig');
// 引用路由
const filesOptionRouter = require('./node/router/seatData/filesOptions');
const dataOptionsRouter = require('./node/router/seatData/dataOptions');
const createClassRouter = require('./node/router/createClass');
const getAllDataRouter = require('./node/router/getAllData');

setEnvironmentVariables();  // 设置环境变量
// 创建 express 应用程序
const app = express();
// 静态资源目录
app.use(express.static(publicPath));
// 用于解析 JSON 格式的数据
app.use(bodyParser.json());
// 初始化 swagger
swaggerInit(app)
// 引用路由
app.use(filesOptionRouter);
app.use(createClassRouter);
app.use(dataOptionsRouter);
app.use(getAllDataRouter);

// 允许跨域请求
app.all('*', function (req, res, next) { headerConfig(req, res, next) });

// 处理所有路由，返回 index.html
app.get('*', function (req, res, next) {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(currentDir, process.env.VUE_APP_OUTPUT_DIR, 'index.html'));
  } else {
    next();
  }
});

// /file-list 获取文件列表接口
app.get('/file-list', async (req, res) => {
  const filesList = await getFilePath(publicPath);
  console.log('filesList', filesList);
  res.status(200).json({
    data: filesList,
    code: 200,
    msg: '获取文件列表成功'
  });
});

// 新增接口，查询 MySQL 中所有数据库
app.get('/databases', async (req, res) => {
  // 注意：为了查询所有数据库，这里直接使用 mysql.createPool
  const poolForDBs = mysql.createPool({
    host: process.env.DB_HOST,
    port: 3306,
    user: 'root',
    password: '',
    connectionLimit: 10,
    waitForConnections: true,
  });

  // 使用已有的 queryDatabase 方法执行查询
  queryDatabase(poolForDBs, 'SHOW DATABASES')
    .then(({ results, fields }) => {
      // 筛选出数据库名称中包含“名单”的项,并返回数据库名称
      // console.log('databases', results);
      const filteredArray = results
        .filter(item => item.Database.includes('名单'))
        .map(item => ({ label: item.Database.replace('名单', '') }));
      res.status(200).json({
        code: 200,
        data: filteredArray,
      });
      poolForDBs.end();
    }).catch(error => {
      res.status(500).json({
        code: 500,
        error: error.message
      });
      // poolForDBs.end();
    });
});

// 启动服务器  ${process.env.SERVER_IP}
app.listen(PORT, () => {
  console.log(`Server is running on ${publicPath} http://localhost:${PORT}`);
});
