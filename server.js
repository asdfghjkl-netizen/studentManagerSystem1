const express = require('express');
const bodyParser = require('body-parser');
const swaggerInit = require('./node/config/swaggerConfig');
const { getFilePath } = require('./node/tools/fileOption');
const { setEnvironmentVariables } = require('./configureIP'); // 引入ip配置文件
const { publicPath, PORT, headerConfig } = require('./node/config/publicConfig');
// 引用路由
const getExcelDataRouter = require('./node/router/seatDataOpt/getExcelData');
const getTableDataRouter = require('./node/router/seatDataOpt/getTableData');
const saveToExcelRouter = require('./node/router/seatDataOpt/saveToExcel');
const optDataRouter = require('./node/router/seatDataOpt/optionData');
const addExcelRouter = require('./node/router/indexOpt/addExcelFile');

setEnvironmentVariables();
// 创建 express 应用程序
const app = express();
// 静态资源目录
app.use(express.static(publicPath));
// 用于解析 JSON 格式的数据
app.use(bodyParser.json());
// 初始化 swagger
swaggerInit(app)
// 引用路由
app.use(getExcelDataRouter);
app.use(getTableDataRouter);
app.use(saveToExcelRouter);
app.use(addExcelRouter);
app.use(optDataRouter);

// 允许跨域请求
app.all('*', function (req, res, next) { headerConfig(req, res, next) });

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

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on ${publicPath} http://${process.env.SERVER_IP}:${PORT}`);
});
