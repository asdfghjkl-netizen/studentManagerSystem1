const express = require('express');
const headerConfig = require('../config/requestConfig');
const redisClient = require('../config/redisConfig');

// 创建路由实例
const optDataRouter = express.Router();

// 允许跨域请求
optDataRouter.all('*', function (req, res, next) { headerConfig(req, res, next) });

// /table/student/add   添加学生信息数据
optDataRouter.post('/table/student/add', (req, res) => {
    const { student, studyStatus, dateTime, score, teamId } = req.body;
    console.log('req.body', student, studyStatus, dateTime, score, teamId);
    const key = `stuStudyStatus:${student}`;
    const addData = { dateTime, score, studyStatus };
    redisClient.rpush(key, JSON.stringify(addData));

    // TODO 修改Redis中key为team下的团队里的学生数据
    redisClient.hgetall(`team:${teamId}`, (err, data) => {
        if (err) {
            console.error('Error retrieving data from Redis:', err);
            res.status(500).json({ error: 'Error retrieving data from Redis' });
        }
        // 将每个学生的字符串数据转换为 JSON 对象
        const teamData = {};
        for (const student in data) {
            try {
                teamData[student] = JSON.parse(data[student]);
            } catch (parseErr) {
                console.error(`Error parsing data for student ${student}:`, parseErr);
                res.status(500).json({ error: 'Error parsing data for student ${student}' });
                return;
            }
        }
        console.log("teamData", teamData);
        /**
         * TODO 要修改的数据
         * 
         * 1. 获取当前学生学习状态分数
         */
        teamData[student].studyStatus += score;

        // 修改单个学生的hash数据
        redisClient.hset(`team:${teamId}`, student, JSON.stringify(teamData[student]));

        res.status(200).json({
            code: 200,
            msg: '添加成功',
        });
    });
})

// /table/team/add   添加团队信息数据
optDataRouter.post('/table/team/add', (req, res) => {

})

// /table/team/remove   删除团队信息数据
optDataRouter.post('/table/team/remove', (req, res) => {
    // 获取前端传入的数据
    const { team, dateTime, score } = req.body;
    console.log('req.body', team, dateTime, score);
})

// /table/student/remove   删除学生信息数据
optDataRouter.post('/table/student/remove', (req, res) => {
    // 获取前端传入的数据
    const { student, dateTime, score } = req.body;
    console.log('req.body', student, dateTime, score);
    redisClient.lrange(`stuStudyStatus:${student}`, 0, -1, (err, data) => {
        if (err) {
            console.error('Error retrieving data from Redis:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        // console.log("data", data);

        // 解析每个条目并检查 dateTime
        const itemsToRemove = data.filter(item => JSON.parse(item).dateTime === dateTime);

        // 移除每个需要移除的条目
        itemsToRemove.forEach(item => {
            redisClient.lrem(`stuStudyStatus:${student}`, 0, item, (err, count) => {
                if (err) {
                    // throw new Error('Error removing item from Redis:', err);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    // console.log(`Removed ${count} occurrences of item:`, item);
                    res.status(200).json({
                        code: 200,
                        message: `删除${student}信息成功`
                    });
                }
            });
        });
    });
});

module.exports = optDataRouter;
