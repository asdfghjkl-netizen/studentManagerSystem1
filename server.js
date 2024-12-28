const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const swaggerInit = require('./node/config/swaggerConfig');
const headerConfig = require('./node/config/requestConfig');
// 引用路由
const getExcelDataRouter = require('./node/router/getExcelData');
const getTableDataRouter = require('./node/router/getTableData');
const saveToExcelRouter = require('./node/router/saveToExcel');
const addExcelRouter = require('./node/router/addExcelFile');
const optDataRouter = require('./node/router/optionData');

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
  console.log(`Server is running on ${publicPath} http://localhost:${PORT}`);
});

// 递归获取目录下所有 .xlsx 和 .xls 文件的文件名
async function getFilePath(dir) {
  let filesList = [];
  const files = fs.readdirSync(dir);
  // 遍历每个文件
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      // 如果是目录，则递归调用
      filesList = filesList.concat(await getFilePath(filePath));
    } else if (filePath.endsWith('.xlsx') || filePath.endsWith('.xls')) {
      // 如果是 .xlsx 或 .xls 文件，则添加文件名到列表中
      filesList.push(file);
    }
  }
  return filesList;
}
