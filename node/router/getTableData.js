const express = require('express');
const redisClient = require('../config/redisConfig');
const headerConfig = require('../config/requestConfig');

// 创建路由实例
const getTableDataRouter = express.Router();

// 允许跨域请求
getTableDataRouter.all('*', function (req, res, next) { headerConfig(req, res, next) });

// /table/student  post  获取学生学习信息
getTableDataRouter.post('/table/student', (req, res) => {
    const studentName = req.body.student;
    // console.log('studentName', studentName);
    redisClient.get(studentName, (err, data) => {
        if (err) {
            console.error('Error retrieving data from Redis:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json({
            data: JSON.parse(data),
            code: 200,
            message: `获取${studentName}信息成功`
        });
    });
});

// /table/team  post  获取团队学习信息
getTableDataRouter.post('/table/team', (req, res) => {
    const team = req.body.team;
    const teamName = team + "组";
    // console.log('teamName', teamName);
    redisClient.get(teamName, (err, data) => {
        if (err) {
            console.error('Error retrieving data from Redis:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json({
            data: JSON.parse(data),
            code: 200,
            message: `获取${teamName}信息成功`
        });
    });
});

// /dialog/student/score  post  获取学生学习分数
getTableDataRouter.post('/dialog/student/score', (req, res) => {

});

// /dialog/team/score  post  获取团队学习分数
getTableDataRouter.post('/dialog/team/score', (req, res) => {

});

module.exports = getTableDataRouter;
