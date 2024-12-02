const express = require('express');
const fsPromises = require('fs').promises;
const path = require('path');
const ExcelJS = require('exceljs');
const { parseExcelFile, parseWorkSheetLong } = require('../excelOpt');
const redisClient = require('../config/redisConfig');
const { ref } = require('vue');
const headerConfig = require('../config/requestConfig');

// 创建路由实例
const getExcelDataRouter = express.Router();
// 获取当前执行目录
const currentDir = process.cwd();
// 使用获取 public 目录的路径
const publicPath = path.join(currentDir, 'public');

// 允许跨域请求
getExcelDataRouter.all('*', function (req, res, next) { headerConfig(req, res, next) });

// /get-excel-file  获取并读取Excel文件
getExcelDataRouter.post('/get-excel-file', async (req, res) => {
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
        // console.log('buffer', buffer);
        // 创建 Workbook 实例
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        // 解析 Excel 文件
        const parsedData = parseExcelFile(workbook);
        // 返回解析后的数据和二进制数据
        // res.status(200).json({ parsedData, buffer: buffer });
        redisClient.set('excel-data', JSON.stringify({ parsedData, buffer }));
        redisClient.get('excel-data', (err, data) => {
            if (err) {
                console.error('Error retrieving data from Redis:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(200).json({
                data: JSON.parse(data),
                code: 200,
                message: '上传成功'
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to read or parse file' });
    }
});

// /get-excel-file/student  获取对应学生的excel表格
getExcelDataRouter.post('/get-excel-file/student', async (req, res) => {
    const student = req.body.student;
    // console.log("student", student);

    // 获取 excel-data 数据，并拿到里面的 buffer 字段
    redisClient.get('excel-data', async (err, data) => {
        if (err) {
            console.error('Error retrieving data from Redis:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        const buffer = JSON.parse(data).buffer.data; // 解析 JSON 字符串
        // console.log("buffer", buffer);

        // 创建 Workbook 实例
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const parsedData = parseStudentData(workbook, student);

        redisClient.set(student, JSON.stringify(parsedData));
        redisClient.get(student, (err, data) => {
            // 获取数据
            const parsedStuData = JSON.parse(data);

            if (err) {
                console.error('Error retrieving data from Redis:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            }
            if (parsedStuData.length == 0) {
                // console.log('信息为空');
                res.status(200).json({
                    // data: parsedStuData,
                    code: 201,
                    message: `成功获取${student}的信息，但是信息为空`
                });
                return true;  // 返回 true 表示已处理数据
            }
            res.status(200).json({
                data: parsedStuData,
                code: 200,
                message: `成功获取${student}的信息`
            });
        });
    });
});

// /get-excel-file/team  获取对应团队的excel表格
getExcelDataRouter.post('/get-excel-file/team', async (req, res) => {
    const team = req.body.team;
    const teamNameForExcel = team + "组";
    // console.log("team", teamNameForExcel);

    // 获取 excel-data 数据，并拿到里面的 buffer 字段
    redisClient.get('excel-data', async (err, data) => {
        if (err) {
            console.error('Error retrieving data from Redis:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        const buffer = JSON.parse(data).buffer.data; // 解析 JSON 字符串
        // console.log("buffer", buffer);

        // 创建 Workbook 实例
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const parsedData = parseTeamData(workbook, teamNameForExcel);

        redisClient.set(teamNameForExcel, JSON.stringify(parsedData));
        redisClient.get(teamNameForExcel, (err, data) => {
            // 获取数据
            const parsedStuData = JSON.parse(data);

            // 添加一条数据
            // 如果你需要将新数据添加到现有的 teamNameForExcel 数据中（例如，合并对象或数组），
            // 你需要先获取现有数据，然后进行合并操作，最后再设置回去。以下是一个示例：
            // // 合并新数据
            // const newData = { ...parsedStuData, ...{
            //     日期: "2023-05-05",
            //     得分: 100,
            //     学习表现: "已学习"
            // }};

            // redisClient.set(teamNameForExcel, JSON.stringify(newData), (err) => {
            //     if (err) {
            //         console.error('Error setting data to Redis:', err);
            //     } else {
            //         console.log('Data updated successfully');
            //     }
            // });

            if (err) {
                console.error('Error retrieving data from Redis:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            }
            if (parsedStuData.length == 0) {
                // console.log('信息为空');
                res.status(200).json({
                    // data: parsedStuData,
                    code: 201,
                    message: `成功获取${teamNameForExcel}的信息，但是信息为空`
                });
                return true;  // 返回 true 表示已处理数据
            }
            res.status(200).json({
                data: parsedStuData,
                code: 200,
                message: `成功获取${teamNameForExcel}的信息`
            });
        });
    });
});

// 解析获取学生信息
const students = ref({});
const studentHeaders = ref([]);
function parseStudentData(workbook, student) {
    // 获取第一个worksheet内容（学生信息表）
    const worksheet = workbook.getWorksheet(student);
    // console.log('worksheet', worksheet.id, worksheet.name);
    studentHeaders.value = [];
    // 获取第一行的标题
    worksheet.getRow(1).eachCell((cell) => {
        studentHeaders.value.push(cell.value);
    });
    // console.log('headers', headers.value);
    // 创建一个空的JavaScript对象数组，用于存储解析后的数据
    const studentPush = []
    parseWorkSheetLong(studentPush, worksheet, studentHeaders, students);

    return students.value
}

// 解析获取团队信息
const teams = ref({});
const teamsHeaders = ref([]);
function parseTeamData(workbook, teamName) {
    // 获取第一个worksheet内容（学生信息表）
    const worksheet = workbook.getWorksheet(teamName);
    // console.log('worksheet', worksheet.id, worksheet.name);
    teamsHeaders.value = [];
    // 获取第一行的标题
    worksheet.getRow(1).eachCell((cell) => {
        teamsHeaders.value.push(cell.value);
    });
    // console.log('headers', headers.value);
    // 创建一个空的JavaScript对象数组，用于存储解析后的数据
    const teamsPush = []
    parseWorkSheetLong(teamsPush, worksheet, teamsHeaders, teams);

    return teams.value
}

module.exports = getExcelDataRouter;
