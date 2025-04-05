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
  // console.log('ecxelFile', filePath, fileName);
  // console.log('listData', studentList, teamList);

  // 判断文件是否为空
  if (!fileName) {
    res.status(400).send({ error: `未接收到文件${fileName}` });
    return;
  }
  if (!filePath) {
    res.status(400).send({ error: `未接收到文件路径${filePath}` });
    return;
  }

  // 对 stuManageInfoData 按照 stuId 排序
  stuManageInfoData.sort((a, b) => a.stuId - b.stuId);
  console.log('stuManageInfoData', stuManageInfoData);

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
    // 获取表头并构建动态字段映射
    const manageFieldMap = {};
    parseExcelFile(stuManageInfo, manageFieldMap, stuManageInfoData);

    studentList.forEach(async (student, index) => {
      // console.log('student', student, index);
      const stuStudyStatusKey = `stuStudyStatus:${student}`;
      const studyStatusData = await lrange(stuStudyStatusKey);
      let dataList = [];
      studyStatusData.forEach(item => {
        dataList.push(JSON.parse(item));
      });
      console.log('stuStudyStatusKey', dataList);

      const studentTable = workbook.getWorksheet(student);
      // 获取表头并构建动态字段映射
      const stuStudyFieldMap = {};
      parseExcelFile(studentTable, stuStudyFieldMap, dataList);
      // 保存修改后的Excel文件
      await workbook.xlsx.writeFile(theExcelPath);
    });

    teamList.forEach(async (teamId, index) => {
      // console.log('student', teamId, index);
      const teamNameForExcel = teamId + "组";
      const teamStudyKey = `teamStudyStatus:${teamNameForExcel}`;  // 组号作为key
      const studyStatusData = await lrange(teamStudyKey);
      let dataList = [];
      studyStatusData.forEach(item => {
        dataList.push(JSON.parse(item));
      });
      console.log('teamStudyKey', dataList);

      const teamTable = workbook.getWorksheet(teamNameForExcel);
      // 获取表头并构建动态字段映射
      const teamStudyFieldMap = {};
      parseExcelFile(teamTable, teamStudyFieldMap, dataList);
      // 保存修改后的Excel文件
      await workbook.xlsx.writeFile(theExcelPath);
    });

    // 保存修改后的Excel文件
    try {
      await workbook.xlsx.writeFile(theExcelPath);
      res.status(200).send({ message: '文件保存成功' });
    } catch (error) {
      console.error('Error writing file:', error);
      res.status(500).send({ error: '文件保存失败' });
    }
    // res.status(200).send({ message: '文件保存成功' });
  } catch (error) {
    console.error('Error reading file, buffer:', error);
    res.status(500).send({ error: '文件读取失败' + error });
  }
});

/**
 * 解析Excel文件
 * 
 * @param {*} worksheet  Excel工作表
 * @param {*} fieldMap   获取表头并构建动态字段映射
 * @param {*} sourceData 源数据
 */
function parseExcelFile(worksheet, fieldMap, sourceData) {
  // 获取表头行并建立字段映射
  const headerRow = worksheet.getRow(1);
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
  for (const item of sourceData) {
    const row = worksheet.getRow(rowIndex);
    // console.log('student', item);
    // console.log('fieldMap', fieldMap);
    // 遍历字段映射，将学生数据写入Excel
    Object.entries(fieldMap).forEach(([header, colNumber]) => {
      const field = translate(header);
      // console.log('header', header, 'field', field);
      // console.log('header', fieldMap[header], 'student', item[field]);
      if (item[field] !== undefined) {
        // console.log('row', row.getCell(colNumber).value);
        // console.log("is ok");
        row.getCell(colNumber).value = item[field];
      }
    });
    rowIndex++;
  }
}

module.exports = saveToExcelRouter;
