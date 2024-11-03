const express = require('express');
const multer = require('multer');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const cors = require("cors");
const bodyParser = require('body-parser');
const ExcelJS = require('exceljs');
const swaggerInit = require('./node/swagger.js')
const parseExcelFile = require('./node/excelOpt.js');

// 创建 express 应用程序
const app = express();
// 端口号
const PORT = process.env.PORT || 3000;
// 获取当前执行目录
const currentDir = process.cwd();
// 使用获取 public 目录的路径
const publicPath = path.join(currentDir, 'public');

// 允许跨域请求
app.use(cors())
// 静态资源目录
app.use(express.static(publicPath));
// 用于解析 JSON 格式的数据
app.use(bodyParser.json());
// 初始化 swagger
swaggerInit(app)

// 配置multer存储， 存储在public目录下
const uploadStorage = multer.diskStorage({
  // 在服务器端保存文件
  destination: function (req, file, cb) {
    cb(null, publicPath); // 指定保存到Vue 3项目的public目录
  },
  // 为文件生成一个唯一的名称
  filename: function (req, file, cb) {
    console.log('file', file, decodeURIComponent(file.originalname));
    cb(null, decodeURIComponent(file.originalname)); // 保留原始文件名
  }
});
// 创建multer实例
const upload = multer({ storage: uploadStorage });

/**
 * @api {post} /upload-excel 上传Excel文件
 * @apiDescription 上传Excel文件并保存到服务器。
 * @apiName uploadExcel
 * @apiGroup FileUpload
 * @apiVersion 1.0.0
 * 
 * @apiParam  {File} file 上传的Excel文件。
 * 
 * @apiSuccess (200) {String} message 上传成功的消息。
 * @apiSuccess (200) {String} fileName 保存的文件名。
 * 
 * @apiParamExample  {form-data} Request-Example:
 * {
 *     "file": (binary file)
 * }
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     "message": "文件保存成功",
 *     "fileName": "example.xlsx"
 * }
 * 
 * @apiErrorExample {json} Error-Response - 未接收到文件:
 * HTTP/1.1 400 Bad Request
 * {
 *     "error": "未接收到文件"
 * }
 * @apiSampleRequest  http://localhost:3000/upload-excel
 */
app.post('/upload-excel', upload.single('file'), (req, res) => {
  // 获取上传的文件·上传保存excel文件
  const ecxelFile = req.file;
  console.log('ecxelFile', ecxelFile);
  // 判断文件是否为空
  if (!ecxelFile) {
    res.status(400).send({ error: `未接收到文件${ecxelFile}` });
  }
  res.status(200).send({ message: '文件保存成功', fileName: ecxelFile.filename });
});

/**
 * @api               {get} /file-list 获取文件列表接口
 * @apiDescription    获取文件列表接口
 * @apiName           file-list
 * @apiGroup          fileOptions
 * @apiSuccess        {Array} filesList 文件列表
 * @apiSuccessExample {Array} Success-Response:
 * [
 *    "24应用2班名单.xlsx", ...
 * ]
 * @apiSampleRequest  http://localhost:3000/file-list
 * @apiVersion        1.0.0
 */
app.get('/file-list', (req, res) => {
  const files = fs.readdirSync(publicPath);
  // 找出文件名中包含xlsx或者xls的文件
  const filesList = files.filter(file => file.includes('.xlsx') || file.includes('.xls'));
  console.log('filesList', filesList);
  res.status(200).send(filesList);
});

/**
 * @api {post} /get-excel-file  获取并读取Excel文件
 * @apiDescription    获取前端uploadFile传入的excel文件(文件名是通过前端传入的)，并读取Excel文件里的内容
 * @apiName get-excel-file
 * @apiGroup  fileOptions
 * @apiVersion  1.0.0
 * @apiParam {String} file 前端上传的文件名。
 *
 * @apiSuccess (200) {Object} parsedData 解析后的Excel数据。
 * @apiSuccess (200) {Buffer} buffer 文件的二进制数据。
 *
 * @apiParamExample  {json} 请求示例:
 * {
 *   "file": "example.xlsx"
 * }
 *
 * @apiSuccessExample {json} 成功响应:
 * {
 *   "parsedData": {...},
 *   "buffer": "<Buffer ...>"
 * }
 * 
 *  @apiErrorExample {json} 错误响应 - 未提供文件名:
 * HTTP/1.1 400 Bad Request
 * {
 *   "error": "未提供文件名"
 * }
 *
 * @apiErrorExample {json} 错误响应 - 读取或解析文件失败:
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "error": "读取或解析文件失败"
 * }
 * @apiSampleRequest  http://localhost:3000/get-excel-file
 */
app.post('/get-excel-file', async (req, res) => {
  // 获取前端传入的文件名，包装成json对象
  const fileName = req.body.file;
  console.log('fileName', fileName);

  if (!fileName) {
    res.status(400).json({ error: 'No file name provided' });
  }

  const filePath = path.join(publicPath, fileName);
  console.log('filePath', filePath);

  // 异步读取文件
  try {
    // 读取文件内容
    const buffer = await fsPromises.readFile(filePath);
    console.log('buffer', buffer);
    // 创建 Workbook 实例
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    // 解析 Excel 文件
    const parsedData = parseExcelFile(workbook);
    // 返回解析后的数据和二进制数据
    res.status(200).json({ parsedData, buffer: buffer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read or parse file' });
  }
});

// 定义一个简单的测试路由
app.get('/helloWorld', (req, res) => {
  res.send('Hello, World!');
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on ${publicPath} ${path.join(__dirname, './public')} http://localhost:${PORT}`);
});
