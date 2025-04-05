const express = require('express');
const { headerConfig } = require('../../config/publicConfig');
const { RedisOpt } = require('../../tools/option/redisOpt');

// 创建路由实例
const getTableDataRouter = express.Router();
const { lrange, hgetall } = new RedisOpt();

// 允许跨域请求
getTableDataRouter.all('*', async function (req, res, next) { headerConfig(req, res, next) });

/**
 * @route POST /table/student
 * @summary 获取学生学习信息
 * @description 获取学生学习信息，并将解析后的数据存入 Redis。
 * @param {String} studentName - 学生姓名
 * @returns {Object} - 响应对象
 */
getTableDataRouter.post('/table/student', async (req, res) => {
    const student = req.body.student;
    const redisKey = `stuStudyStatus:${student}`;

    try {
        const { dataList, totalScore } = await getStudyStatusData(redisKey);

        res.status(200).json({
            totalScore: totalScore,
            data: dataList,
            code: 200,
            message: `获取${student}信息成功`
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: `获取${student}信息失败: ${error.message}`
        });
    }
});

/**
 * @route POST /table/team
 * @summary 获取团队学习信息
 * @description 获取团队学习信息，并将解析后的数据存入 Redis。
 * @param {String} team 团队号
 * @returns {Object} - 响应对象
 */
getTableDataRouter.post('/table/team', async (req, res) => {
    const team = req.body.team;
    const teamName = team + "组";
    const redisKey = `teamStudyStatus:${teamName}`;

    try {
        const { dataList, totalScore } = await getStudyStatusData(redisKey);

        res.status(200).json({
            totalScore: totalScore,
            data: dataList,
            code: 200,
            message: `获取第${teamName}信息成功`
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: `获取第${teamName}信息失败: ${error.message}`
        });
    }
});

/**
 * @route POST /dialog/all/team
 * @summary 获取团队学习信息
 * @description 获取团队学习信息，并将解析后的数据存入 Redis。
 * @param {String} teamId 团队号
 * @returns {Object} - 响应对象
 */
getTableDataRouter.post('/dialog/all/team', async (req, res) => {
    const { teamId } = req.body;

    // TODO 拿到teamId里的hash数据（该组的所有数据）
    const teamStatusData = await hgetall(`team:${teamId}`)
    // console.log('teamStatusData', teamStatusData);
    // 将每个团队的字符串数据转换为 JSON 对象
    const teamData = {};
    for (const stu in teamStatusData) {
        try {
            teamData[stu] = JSON.parse(teamStatusData[stu]);
        } catch (parseErr) {
            console.error(`Error parsing data for team:`, parseErr);
            res.status(500).json({ error: `Error parsing data for team` });
            return;
        }
    }
    res.status(200).json({
        teamData: teamData,
        code: 200,
        message: `获取第${teamId}组信息成功`
    });
})

/**
 * 解析并提取redis中的列表数据
 * @param redisKey  redisKey
 * @returns {Object} {dataList, totalScore}  dataList:解析后的数据，totalScore:总分
 */
async function getStudyStatusData(redisKey) {
    const studyStatusData = await lrange(redisKey);
    // console.log("studyStatusData", studyStatusData);
    let dataList = [];
    let totalScore = 0;

    studyStatusData.forEach(item => {
        dataList.push(JSON.parse(item));
    });
    dataList.forEach((item) => {
        totalScore += item.score;
    });
    return { dataList, totalScore };
}

module.exports = getTableDataRouter;
