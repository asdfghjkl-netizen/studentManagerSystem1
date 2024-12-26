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
    // console.log('req.body', student, studyStatus, dateTime, score, teamId);
    const key = `stuStudyStatus:${student}`;
    const addData = { dateTime, score, studyStatus };
    let pushData = redisClient.rpush(key, JSON.stringify(addData));

    if (!pushData) {
        res.send({ code: 500, msg: '添加失败' })
        return;
    }

    // TODO 修改Redis中key为team下的团队里的学生数据
    redisClient.hgetall(`team:${teamId}`, (err, data) => {
        if (err) {
            console.error('Error retrieving data from Redis:', err);
            res.status(500).json({ error: 'Error retrieving data from Redis' });
        }
        // 将每个学生的字符串数据转换为 JSON 对象
        const teamData = {};
        for (const stu in data) {
            try {
                teamData[stu] = JSON.parse(data[stu]);

                // TODO 修改整个团队数据
                teamData[stu].totalScore += score;
                redisClient.hset(`team:${teamId}`, stu, JSON.stringify(teamData[stu]));
            } catch (parseErr) {
                console.error(`Error parsing data for student ${student}:`, parseErr);
                res.status(500).json({ error: 'Error parsing data for student ${student}' });
                return;
            }
        }
        // console.log("teamData", teamData);
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
            msg: `添加第${student}信息成功`,
        });
    });
})

// /table/team/add   添加团队信息数据
optDataRouter.post('/table/team/add', (req, res) => {
    const { teamId, studyStatus, dateTime, score } = req.body;
    const teamNameForExcel = teamId + "组";
    // console.log('req.body', teamId, teamNameForExcel, studyStatus, dateTime, score);

    const key = `teamStudyStatus:${teamNameForExcel}`;
    const addData = { dateTime, score, studyStatus };
    let pushData = redisClient.rpush(key, JSON.stringify(addData));

    if (!pushData) {
        res.send({ code: 500, msg: `添加第${teamNameForExcel}信息失败` })
        return;
    }

    // TODO 修改Redis中key为team下的团队里的学生数据
    redisClient.hgetall(`team:${teamId}`, (err, data) => {
        if (err) {
            console.error('Error retrieving data from Redis:', err);
            res.status(500).json({ error: 'Error retrieving data from Redis' });
        }
        // 将每个团队的字符串数据转换为 JSON 对象
        const teamData = {};
        for (const stu in data) {
            try {
                teamData[stu] = JSON.parse(data[stu]);

                // TODO 修改整个团队数据
                teamData[stu].totalScore += score;

                // 修改改hash的所有数据
                redisClient.hset(`team:${teamId}`, stu, JSON.stringify(teamData[stu]));
            } catch (parseErr) {
                console.error(`Error parsing data for team ${teamNameForExcel}:`, parseErr);
                res.status(500).json({ error: `Error parsing data for team ${teamNameForExcel}` });
                return;
            }
        }
        // console.log("teamData", teamData);
        res.status(200).json({
            code: 200,
            msg: `添加第${teamNameForExcel}信息成功`,
        });
    });
})

// /table/student/remove   删除学生信息数据
optDataRouter.post('/table/student/remove', (req, res) => {
    // 获取前端传入的数据
    const { student, dateTime, score, teamId } = req.body;
    // console.log('req.body', student, dateTime, score, teamId);
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
                    res.status(500).json({ error: 'Internal Server Error' });
                    throw new Error('Error removing item from Redis:', err);
                } else {
                    // TODO 修改Redis中key为team下的团队里的学生数据
                    redisClient.hgetall(`team:${teamId}`, (err, data) => {
                        if (err) {
                            console.error('Error retrieving data from Redis:', err);
                            res.status(500).json({ error: 'Error retrieving data from Redis' });
                        }
                        // 将每个学生的字符串数据转换为 JSON 对象
                        const teamData = {};
                        for (const stu in data) {
                            try {
                                teamData[stu] = JSON.parse(data[stu]);

                                // TODO 修改整个团队数据
                                teamData[stu].totalScore -= score;
                                redisClient.hset(`team:${teamId}`, stu, JSON.stringify(teamData[stu]));
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
                        teamData[student].studyStatus -= score;

                        // 修改单个学生的hash数据
                        redisClient.hset(`team:${teamId}`, student, JSON.stringify(teamData[student]));

                        res.status(200).json({
                            code: 200,
                            message: `删除${student}信息成功`
                        });
                    });
                }
            });
        });
    });
});

// /table/team/remove   删除团队信息数据
optDataRouter.post('/table/team/remove', (req, res) => {
    // 获取前端传入的数据
    const { teamId, dateTime, score } = req.body;
    const teamNameForExcel = teamId + "组";
    const key = `teamStudyStatus:${teamNameForExcel}`;
    // console.log('req.body', teamId, teamNameForExcel, dateTime, score, key);

    redisClient.lrange(key, 0, -1, (err, data) => {
        if (err) {
            console.error('Error retrieving data from Redis:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        // 解析每个条目并检查 dateTime
        const itemsToRemove = data.filter(item => JSON.parse(item).dateTime === dateTime);

        // 移除每个需要移除的条目
        itemsToRemove.forEach(item => {
            redisClient.lrem(key, 0, item, (err, count) => {
                if (err) {
                    // throw new Error('Error removing item from Redis:', err);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    // TODO 修改Redis中key为team下的团队里的学生数据
                    redisClient.hgetall(`team:${teamId}`, (err, data) => {
                        if (err) {
                            console.error('Error retrieving data from Redis:', err);
                            res.status(500).json({ error: 'Error retrieving data from Redis' });
                        }
                        // 将每个团队的字符串数据转换为 JSON 对象
                        const teamData = {};
                        for (const stu in data) {
                            try {
                                teamData[stu] = JSON.parse(data[stu]);

                                // TODO 修改整个团队数据
                                teamData[stu].totalScore -= score;

                                // 修改改hash的所有数据
                                redisClient.hset(`team:${teamId}`, stu, JSON.stringify(teamData[stu]));
                            } catch (parseErr) {
                                console.error(`Error parsing data for team ${teamNameForExcel}:`, parseErr);
                                res.status(500).json({ error: `Error parsing data for team ${teamNameForExcel}` });
                                return;
                            }
                        }
                        // console.log("teamData", teamData);
                        res.status(200).json({
                            code: 200,
                            message: `删除第${teamNameForExcel}信息成功`
                        });
                    });
                }
            });
        });
    });
})

module.exports = optDataRouter;
