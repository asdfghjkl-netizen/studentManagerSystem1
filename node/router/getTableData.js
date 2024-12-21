const express = require('express');
const redisClient = require('../config/redisConfig');
const headerConfig = require('../config/requestConfig');

// 创建路由实例
const getTableDataRouter = express.Router();

// 允许跨域请求
getTableDataRouter.all('*', function (req, res, next) { headerConfig(req, res, next) });

/**
 * @route POST /table/student
 * @summary 获取学生学习信息
 * @description 获取学生学习信息，并将解析后的数据存入 Redis。
 * @param {String} studentName - 学生姓名
 * @returns {Object} - 响应对象
 */
getTableDataRouter.post('/table/student', (req, res) => {
    const student = req.body.student;
    // 查询Redis中key为stuStudyStatus:${student}的数据
    redisClient.lrange(`stuStudyStatus:${student}`, 0, -1, (err, data) => {
        if (err) {
            console.error('Error retrieving data from Redis:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        // console.log("data", data);
        let dataList = [];
        data.forEach(item => {
            dataList.push(JSON.parse(item));
        });

        // 计算出学生的总分
        let totalScore = 0;
        dataList.forEach(item => {
            totalScore += item.score;
        });

        res.status(200).json({
            totalScore: totalScore,
            data: dataList,
            code: 200,
            message: `获取${student}信息成功`
        });
    });
});

/**
 * @route POST /table/team
 * @summary 获取团队学习信息
 * @description 获取团队学习信息，并将解析后的数据存入 Redis。
 * @param {String} team 团队号
 * @returns {Object} - 响应对象
 */
getTableDataRouter.post('/table/team', (req, res) => {
    const team = req.body.team;
    const teamName = team + "组";
    // 查询Redis中key为stuStudyStatus:${teamName}的数据
    redisClient.lrange(`teamStudyStatus:${teamName}`, 0, -1, (err, data) => {
        if (err) {
            console.error('Error retrieving data from Redis:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        // console.log("data", data);
        let dataList = [];
        data.forEach(item => {
            dataList.push(JSON.parse(item));
        });
        res.status(200).json({
            data: dataList,
            code: 200,
            message: `获取第${teamName}信息成功`
        });
    });
});

/**
 * @route POST /dialog/student/score
 * @summary 获取学生学习分数
 * @description 在前端的dialog对话框中获取学生学习分数
 * @returns {Object} - 响应对象
 */
getTableDataRouter.post('/dialog/student/score', (req, res) => {

});

/**
 * @route POST /dialog/team/score
 * @summary 获取团队学习分数
 * @description 在前端的dialog对话框中获取团队学习分数
 * @returns {Object} - 响应对象
 */
getTableDataRouter.post('/dialog/team/score', (req, res) => {

});

module.exports = getTableDataRouter;
