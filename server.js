const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const swaggerInit = require('./node/config/swaggerConfig');
const headerConfig = require('./node/config/requestConfig');
// 引用路由
const getExcelDataRouter = require('./node/router/getExcelData');
const getTableDataRouter = require('./node/router/getTableData');
const optDataRouter = require('./node/router/optionData');
const saveToExcelRouter = require('./node/router/saveToExcel');

// 创建 express 应用程序
const app = express();
// 端口号
const PORT = process.env.PORT || 3000;
// 获取当前执行目录
const currentDir = process.cwd();
// 使用获取 public 目录的路径
const publicPath = path.join(currentDir, 'public');

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
app.use(optDataRouter);

// 允许跨域请求
app.all('*', function (req, res, next) { headerConfig(req, res, next) });

// /file-list 获取文件列表接口
app.get('/file-list', (req, res) => {
  const files = fs.readdirSync(publicPath);
  // 找出文件名中包含xlsx或者xls的文件
  const filesList = files.filter(file => file.includes('.xlsx') || file.includes('.xls'));
  console.log('filesList', filesList);
  res.status(200).json({
    data: filesList,
    code: 200,
    msg: '获取文件列表成功'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on ${publicPath} http://localhost:${PORT}`);
});
