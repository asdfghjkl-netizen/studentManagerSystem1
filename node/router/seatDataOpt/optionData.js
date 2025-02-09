const express = require('express');
const { headerConfig } = require('../../config/publicConfig');
const { RedisOpt } = require('../../tools/redisOpt');

// 创建路由实例
const optDataRouter = express.Router();
const { rpush, hset, hgetall, lrange, lremove } = new RedisOpt();

// 允许跨域请求
optDataRouter.all('*', function (req, res, next) { headerConfig(req, res, next) });

// /table/student/add   添加学生信息数据
optDataRouter.post('/table/student/add', async (req, res) => {
    const { student, studyStatus, dateTime, score, teamId } = req.body;
    const key = `stuStudyStatus:${student}`;
    const addData = { dateTime, score, studyStatus };
    let pushData = rpush(key, addData);
    if (!pushData) {
        res.status(500).send({ msg: '添加失败' })
        return;
    }

    // TODO 修改Redis中key为team下的团队里的学生数据
    const resetStuDataforAdd = await hgetall(`team:${teamId}`);
    // console.log('resetStuData', resetStuDataforAdd);
    // 将每个学生的字符串数据转换为 JSON 对象
    const teamData = {};
    for (const stu in resetStuDataforAdd) {
        try {
            teamData[stu] = JSON.parse(resetStuDataforAdd[stu]);

            // TODO 修改整个团队数据
            teamData[stu].totalScore += score;
            hset(`team:${teamId}`, stu, teamData[stu]);
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
    hset(`team:${teamId}`, student, teamData[student]);
    res.status(200).json({
        code: 200,
        msg: `添加第${student}信息成功`,
    });
})

// /table/team/add   添加团队信息数据
optDataRouter.post('/table/team/add', async (req, res) => {
    const { teamId, studyStatus, dateTime, score } = req.body;
    const teamNameForExcel = teamId + "组";
    const key = `teamStudyStatus:${teamNameForExcel}`;
    const addData = { dateTime, score, studyStatus };
    let pushData = rpush(key, addData);
    if (!pushData) {
        res.status(500).send({ msg: `添加第${teamNameForExcel}信息失败` })
        return;
    }

    // TODO 修改Redis中key为team下的团队里的学生数据
    const resetTeamDataforAdd = await hgetall(`team:${teamId}`);
    // console.log('resetTeamDataforAdd', resetTeamDataforAdd);
    // 将每个团队的字符串数据转换为 JSON 对象
    const teamData = {};
    for (const stu in resetTeamDataforAdd) {
        try {
            teamData[stu] = JSON.parse(resetTeamDataforAdd[stu]);

            // TODO 修改整个团队数据
            teamData[stu].totalScore += score;

            // 修改改hash的所有数据
            hset(`team:${teamId}`, stu, teamData[stu]);
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
})

// /table/student/remove   删除学生信息数据
optDataRouter.post('/table/student/remove', async (req, res) => {
    // 获取前端传入的数据
    const { student, dateTime, score, teamId } = req.body;
    // console.log('req.body', student, dateTime, score, teamId);
    const getStuDataforRem = await lrange(`stuStudyStatus:${student}`);
    // console.log('getStuData', getStuData);

    // 解析每个条目并检查 dateTime
    const itemsToRemove = getStuDataforRem.filter(item => JSON.parse(item).dateTime === dateTime);

    // 移除每个需要移除的条目
    itemsToRemove.forEach(async (item) => {
        lremove(`stuStudyStatus:${student}`, 0, item);

        // TODO 修改Redis中key为team下的团队里的学生数据
        const resetStuDataforRem = await hgetall(`team:${teamId}`);
        // console.log('resetStuData', resetStuData);
        // 将每个学生的字符串数据转换为 JSON 对象
        const teamData = {};
        for (const stu in resetStuDataforRem) {
            try {
                teamData[stu] = JSON.parse(resetStuDataforRem[stu]);

                // TODO 修改整个团队数据
                teamData[stu].totalScore -= score;
                hset(`team:${teamId}`, stu, teamData[stu]);
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
        teamData[student].studyStatus -= score;

        // 修改单个学生的hash数据
        hset(`team:${teamId}`, student, teamData[student]);

        res.status(200).json({
            code: 200,
            message: `删除${student}信息成功`
        });
    });
});

// /table/team/remove   删除团队信息数据
optDataRouter.post('/table/team/remove', async (req, res) => {
    const { teamId, dateTime, score } = req.body;
    const teamNameForExcel = teamId + "组";
    const key = `teamStudyStatus:${teamNameForExcel}`;

    const getTeamDataforRem = await lrange(key);
    // console.log('getStuData', getStuData);
    // 解析每个条目并检查 dateTime
    const itemsToRemove = getTeamDataforRem.filter(item => JSON.parse(item).dateTime === dateTime);

    // 移除每个需要移除的条目
    itemsToRemove.forEach(async (item) => {
        lremove(key, 0, item);

        // TODO 修改Redis中key为team下的团队里的学生数据
        const resetTeamDataforRem = await hgetall(`team:${teamId}`);
        // console.log('resetTeamData', resetTeamData);
        // 将每个团队的字符串数据转换为 JSON 对象
        const teamData = {};
        for (const stu in resetTeamDataforRem) {
            try {
                teamData[stu] = JSON.parse(resetTeamDataforRem[stu]);

                // TODO 修改整个团队数据
                teamData[stu].totalScore -= score;

                // 修改改hash的所有数据
                hset(`team:${teamId}`, stu, teamData[stu]);
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
})

module.exports = optDataRouter;
