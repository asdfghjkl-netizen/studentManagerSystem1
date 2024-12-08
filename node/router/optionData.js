const express = require('express');
const headerConfig = require('../config/requestConfig');
const redisClient = require('../config/redisConfig');

// 创建路由实例
const optDataRouter = express.Router();

// 允许跨域请求
optDataRouter.all('*', function (req, res, next) { headerConfig(req, res, next) });

// /table/student/add   添加学生信息数据
optDataRouter.post('/table/student/add', (req, res) => {
    const { student, studyStatus, dateTime, score } = req.body;
    console.log('req.body', student, studyStatus, dateTime, score);
})

// /table/student/remove   删除学生信息数据
optDataRouter.post('/table/student/remove', (req, res) => {
    // 获取前端传入的数据
    const { student, dateTime, score } = req.body;
    console.log('req.body', student, dateTime, score);
});

// /table/team/add   添加团队信息数据
optDataRouter.post('/table/team/add', (req, res) => {

})

// /table/team/remove   删除团队信息数据
optDataRouter.post('/table/team/remove', (req, res) => {
    // 获取前端传入的数据
    const { team, dateTime, score } = req.body;
    console.log('req.body', team, dateTime, score);
})

module.exports = optDataRouter;
