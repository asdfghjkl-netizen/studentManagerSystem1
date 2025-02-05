const express = require('express');
const multer = require('multer');
const ExcelJS = require('exceljs'); // 导入 ExcelJS
const { publicPath, headerConfig } = require('../../config/publicConfig');
const { RedisOpt } = require('../../tools/redisOpt'); // 导入 Redis 操作类

// 创建路由实例
const saveToExcelRouter = express.Router();

// 允许跨域请求
saveToExcelRouter.all('*', function (req, res, next) { headerConfig(req, res, next) });

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

// /download-excel 上传Excel文件
saveToExcelRouter.post('/download-excel', upload.single('file'), async (req, res) => {
    // 获取上传的文件
    const ecxelFile = req.file;
    console.log('ecxelFile', ecxelFile);
    // 判断文件是否为空
    if (!ecxelFile) {
        res.status(400).send({ error: `未接收到文件${ecxelFile}` });
        return;
    }

    // 从 Redis 获取数据
    const { get } = new RedisOpt();
    const studentsData = await get('students'); // 假设我们要获取所有学生数据
    const teamData = await get('team'); // 假设我们要获取所有团队数据

    // 将 Redis 数据转换为 JSON
    const studentsJson = JSON.parse(studentsData);
    const teamJson = JSON.parse(teamData);

    // 创建一个新的 Excel 工作簿
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // 写入学生数据
    worksheet.addRow(['学生姓名', '学习状态', '得分']); // 添加表头
    studentsJson.forEach(student => {
        worksheet.addRow([student.stuName, student.studyStatus, student.score]);
    });

    // 写入团队数据
    worksheet.addRow([]); // 添加空行分隔
    worksheet.addRow(['团队ID', '团队信息']); // 添加表头
    teamJson.forEach(team => {
        worksheet.addRow([team.teamId, JSON.stringify(team)]);
    });

    // 保存 Excel 文件
    await workbook.xlsx.writeFile(`${publicPath}/${ecxelFile.filename}`);
    
    res.status(200).send({ message: '文件保存成功', fileName: ecxelFile.filename });
});

module.exports = saveToExcelRouter;
