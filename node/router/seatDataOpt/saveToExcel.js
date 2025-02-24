const express = require('express');
const multer = require('multer');
const ExcelJS = require('exceljs'); // 导入 ExcelJS
const fsPromises = require('fs').promises;
const { publicPath, headerConfig, stuManageInfoTitle } = require('../../config/publicConfig');
const { findFilePath } = require('../../tools/option/fileOption');
const { RedisOpt } = require('../../tools/option/redisOpt'); // 导入 Redis 操作类
const { translate } = require('../../../translations/translator.cjs');

// 创建路由实例
const saveToExcelRouter = express.Router();
const { lrange } = new RedisOpt();

// 允许跨域请求
saveToExcelRouter.all('*', function (req, res, next) { headerConfig(req, res, next); });

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

// /download-excel 上传Excel文件  , upload.single('file')
saveToExcelRouter.post('/save-excel', async (req, res) => {
  // 获取上传的文件
  const { filePath, fileName, stuManageInfoData, studentList, teamList } = req.body;
  // console.log('ecxelFile', filePath, fileName, studentList, teamList);
  // console.log('stuManageInfoData', stuManageInfoData);

  // 判断文件是否为空
  if (!fileName) {
    res.status(400).send({ error: `未接收到文件${fileName}` });
    return;
  }
  if (!filePath) {
    res.status(400).send({ error: `未接收到文件路径${filePath}` });
    return;
  }

  // 获取文件路径
  const theExcelPath = await findFilePath(filePath, fileName);
  // console.log('theExcelPath', theExcelPath);

  try {
    // 读取文件内容
    const buffer = await fsPromises.readFile(theExcelPath);
    // 创建 Workbook 实例
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    // 获取工作表
    const stuManageInfo = workbook.getWorksheet(stuManageInfoTitle);
    // 获取表头行并建立字段映射
    const headerRow = stuManageInfo.getRow(1);
    // 获取表头并构建动态字段映射
    const fieldMap = {};
    headerRow.eachCell((cell, colNumber) => {
      const headerText = cell.text.trim();
      // console.log('headerText', headerText);

      // 将表头翻译回原始字段名
      const originalField = translate(headerText);
      // console.log('originalField', originalField);

      // if (originalField) fieldMap[headerText] = originalField;
      if (originalField) {
        // 使用列号而不是字段名作为映射值
        fieldMap[headerText] = colNumber;
      }
    });

    // 从第二行开始写入数据
    let rowIndex = 2;
    // 直接遍历数组
    for (const student of stuManageInfoData) {
      const row = stuManageInfo.getRow(rowIndex);
      // console.log('student', student);
      // console.log('fieldMap', fieldMap);
      // 遍历字段映射，将学生数据写入Excel
      Object.entries(fieldMap).forEach(([header, colNumber]) => {
        const field = translate(header);
        // console.log('header', header, 'field', field);
        // console.log('header', fieldMap[header], 'student', student[field]);
        if (student[field] !== undefined) {
          // console.log('row', row.getCell(colNumber).value);
          // console.log("is ok");
          row.getCell(colNumber).value = student[field];
        }
      });
      rowIndex++;
    }

    // 保存修改后的Excel文件
    try {
      await workbook.xlsx.writeFile(theExcelPath);
      res.status(200).send({ message: '文件保存成功' });
    } catch (error) {
      console.error('Error writing file:', error);
      res.status(500).send({ error: '文件保存失败' });
    }
  } catch (error) {
    console.error('Error reading file, buffer:', error);
    res.status(500).send({ error: '文件读取失败' + error });
  }
});

module.exports = saveToExcelRouter;
