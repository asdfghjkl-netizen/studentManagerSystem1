const express = require('express');
// const multer = require('multer');
const headerConfig = require('../config/requestConfig');

// 创建路由实例
const saveToExcelRouter = express.Router();

// 允许跨域请求
saveToExcelRouter.all('*', function (req, res, next) { headerConfig(req, res, next) });
// // 配置multer存储， 存储在public目录下
// const uploadStorage = multer.diskStorage({
//   // 在服务器端保存文件
//   destination: function (req, file, cb) {
//     cb(null, publicPath); // 指定保存到Vue 3项目的public目录
//   },
//   // 为文件生成一个唯一的名称
//   filename: function (req, file, cb) {
//     console.log('file', file, decodeURIComponent(file.originalname));
//     cb(null, decodeURIComponent(file.originalname)); // 保留原始文件名
//   }
// });
// // 创建multer实例
// const upload = multer({ storage: uploadStorage });

// // /upload-excel 上传Excel文件
// app.post('/upload-excel', upload.single('file'), (req, res) => {
//   // 获取上传的文件·上传保存excel文件
//   const ecxelFile = req.file;
//   console.log('ecxelFile', ecxelFile);
//   // 判断文件是否为空
//   if (!ecxelFile) {
//     res.status(400).send({ error: `未接收到文件${ecxelFile}` });
//   }
//   res.status(200).send({ message: '文件保存成功', fileName: ecxelFile.filename });
// });

module.exports = saveToExcelRouter;
