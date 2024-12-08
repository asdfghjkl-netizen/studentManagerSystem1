const express = require('express');
const fsPromises = require('fs').promises;
const path = require('path');
const ExcelJS = require('exceljs');
const { parseExcelFile, parseWorkSheetLong, processRow } = require('../tools/excelOpt');
const redisClient = require('../config/redisConfig');
const { ref } = require('vue');
const headerConfig = require('../config/requestConfig');

// 创建路由实例
const getExcelDataRouter = express.Router();
// 获取当前执行目录
const currentDir = process.cwd();
// 使用获取 public 目录的路径
const publicPath = path.join(currentDir, 'public');
// 定义一个映射对象
const valueMapping = {
    日期: 'dateTime',
    学习表现: 'studyStatus',
    得分: 'score'
};

// 允许跨域请求
getExcelDataRouter.all('*', function (req, res, next) { headerConfig(req, res, next) });

/**
 * @route POST /get-excel-file
 * @summary 获取并读取Excel文件
 * @description 获取并读取Excel文件，并将解析后的数据存入 Redis。
 * @param {Object} fileName - 文件名
 * @returns {Object} - 响应对象
 */
getExcelDataRouter.post('/get-excel-file', async (req, res) => {
    // 获取前端传入的文件名，包装成json对象
    const { fileName } = req.body;
    // console.log('fileName', fileName);

    if (!fileName) {
        res.status(400).json({ error: 'No file name provided' });
    }

    const filePath = path.join(publicPath, fileName);
    console.log('filePath', filePath);

    // 异步读取文件
    try {
        // 读取文件内容
        const buffer = await fsPromises.readFile(filePath);
        // 将二进制数据保存到 Redis
        redisClient.set('buffer', JSON.stringify(buffer))
        // console.log('buffer', buffer);
        // 创建 Workbook 实例
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        // 解析 Excel 文件
        const parsedData = parseExcelFile(workbook);

        // 存储 students 数据到 Redis  hmset模式
        parsedData.students.forEach(student => {
            const key = `students:${student.stuName}`;
            redisClient.hmset(key, student);
        });
        // 存储 classSeat 数据到 Redis    hmset模式
        pushStudentData("classSeat", parsedData.classSeat)
        // 存储 computerRoomSeat 数据到 Redis   hmset模式
        pushStudentData("computerRoomSeat", parsedData.computerRoomSeat)
        // 存储 teamLists 数据到 Redis  hset模式
        parsedData.teamLists.forEach(team => {
            const key = `team:${team.teamId}`;
            const { teamId, ...teamInfo } = team;
            redisClient.hset(key, team.stuName, JSON.stringify(teamInfo));
        });
        res.status(200).json({
            data: parsedData,
            code: 200,
            message: '上传成功'
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to read or parse file' });
    }
});

/**
 * @route POST /get-excel-file/student
 * @summary 获取对应学生的excel表格
 * @description 获取对应学生的excel表格，并将解析后的数据存入 Redis。
 * @param {Object} student - 学生名
 * @returns {Object} - 响应对象
 */
getExcelDataRouter.post('/get-excel-file/student', async (req, res) => {
    const student = req.body.student;
    // console.log("student", student);

    // 获取 excel-data 数据，并拿到里面的 buffer 字段
    redisClient.get('buffer', async (err, data) => {
        if (err) {
            console.error('Error retrieving data from Redis:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        const getData = JSON.parse(data);
        const buffer = getData.data; // 解析 JSON 字符串
        // console.log("buffer", buffer);

        try {
            // 创建 Workbook 实例
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(buffer);
            const parsedData = parseStudentData(workbook, student);
            // console.log('parsedData', parsedData);

            parsedData.forEach(item => {
                const hashKey = `studyData:${student}`;
                redisClient.hmset(hashKey, item);
            });
            res.status(200).json();
        } catch (error) {
            console.error('Error parsing Excel data:', error);
            res.status(500).json({ error: 'Failed to parse Excel data' });
        }
    });
});

/**
 * @route POST /get-excel-file/team
 * @summary 获取对应团队的excel表格
 * @description 获取对应团队的excel表格，并将解析后的数据存入 Redis。
 * @param {Object} team - 组号名
 * @returns {Object} - 响应对象
 */
getExcelDataRouter.post('/get-excel-file/team', async (req, res) => {
    const team = req.body.team;
    const teamNameForExcel = team + "组";

    // 获取 excel-data 数据，并拿到里面的 buffer 字段
    redisClient.get('buffer', async (err, data) => {
        if (err) {
            console.error('Error retrieving data from Redis:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        const getData = JSON.parse(data);
        const buffer = getData.data; // 解析 JSON 字符串

        // 创建 Workbook 实例
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const parsedData = parseTeamData(workbook, teamNameForExcel);

        parsedData.forEach(item => {
            const hashKey = teamNameForExcel;
            redisClient.hmset(hashKey, item);
        });
        res.status(200).json();
    });
});

// 解析获取学生信息
const students = ref({});
const studentHeaders = ref([]);
function parseStudentData(workbook, student) {
    // 获取第一个worksheet内容（学生信息表）
    const worksheet = workbook.getWorksheet(student);
    studentHeaders.value = [];
    // 获取第一行的标题
    processRow(worksheet.getRow(1), valueMapping, studentHeaders);
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
    teamsHeaders.value = [];
    // 获取第一行的标题
    processRow(worksheet.getRow(1), valueMapping, teamsHeaders);
    // 创建一个空的JavaScript对象数组，用于存储解析后的数据
    const teamsPush = []
    parseWorkSheetLong(teamsPush, worksheet, teamsHeaders, teams);
    return teams.value
}

// TODO 判断使用方法 + 座位表的存储
function pushStudentData(nick, seat) {
    // console.log('parseStudentData', nick, seat);
    let seatKey;
    if (nick == 'classSeat') {
        seatKey = "class_seat";
    }
    if (nick == 'computerRoomSeat') {
        seatKey = "computerRoom_seat";
    }
    seat.forEach((row, rowIndex) => {
        const key = `${seatKey}:${rowIndex}`;
        const hashFields = {};
        row.forEach((student, colIndex) => {
            hashFields[`col${colIndex}`] = student;
        });
        redisClient.hmset(key, hashFields);
    });
}

module.exports = getExcelDataRouter;
