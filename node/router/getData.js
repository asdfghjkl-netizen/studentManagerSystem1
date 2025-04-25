const express = require('express');
const { headerConfig } = require('../config/publicConfig');
const { createConnectionPool, queryDatabase } = require('../config/mysqlConfig');

const getAllDataRouter = express.Router();

// 允许跨域请求
getAllDataRouter.all('*', function (req, res, next) { headerConfig(req, res, next) });

/**
 * @route POST /get-stu-data
 * @summary 获取所有表的数据
 * @description 获取所有表的数据，并返回给前端。
 * @param {Object} data - 数据库连接信息
 * @returns {Object} result - 包含所有表的数据
 */
getAllDataRouter.post('/get_stu_data', async (req, res) => {
    // 获取前端传入的数据库连接信息，包装成json对象
    const { data } = req.body;
    // console.log('Received data:', data);
    // 如果没有传入数据库名称，则返回错误信息
    if (!data) {
        return res.status(400).json({
            code: 400,
            msg: '数据库名称不能为空'
        });
    }

    try {
        const connection = createConnectionPool(data);
        // 获取所有表的信息
        const { results, fields } = await queryDatabase(connection, 'SHOW TABLES');
        // console.log('tablesResult', results);
        // 获取返回对象的 key，如 Tables_in_yourDatabase
        const tableKey = Object.keys(results[0] || {})[0];
        // console.log('tableKey', tableKey);
        // 得到当前数据库所有表名
        const tableNames = results.map(row => row[tableKey]);
        // console.log('tableNames', tableNames);
        // 过滤只保留指定的表名
        // const specificTables = ['class_seat', 'computer_room_seat', 'student', 'studentmanagentinfo'];
        // const filteredTableNames = tableNames.filter(tableName => specificTables.includes(tableName));
        // 对每个表执行 SELECT * 查询，使用 Promise.all 并发执行
        const dataPromises = tableNames.map(tableName =>
            queryDatabase(connection, `SELECT * FROM \`${tableName}\``)
                .then(({ results, fields }) => ({ tableName, results }))
        );

        const dataArr = await Promise.all(dataPromises);
        // 拼装结果对象
        const tablesResult = {};
        dataArr.forEach(({ tableName, results }) => {
            tablesResult[tableName] = results;
        });

        res.status(200).json({
            data: tablesResult,
            code: 200,
            msg: '获取数据成功'
        });
        connection.end();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * @route POST /table/student
 * @summary 获取学生表的数据
 * @description 获取指定表的数据，并返回给前端。
 * @param {Object} data - 数据库连接信息
 * @param {string} studentName - 表名
 * @returns {Object} result - 包含指定表的数据
 */
getAllDataRouter.post('/table/student', async (req, res) => {
    // 获取前端传入的数据库连接信息，包装成json对象
    const { data, studentName } = req.body;
    // console.log('Received data:', data, studentName);
    // 如果没有传入数据库名称，则返回错误信息
    if (!data) {
        return res.status(400).json({
            code: 400,
            msg: '数据库名称不能为空'
        });
    }

    try {
        let totalScore = 0;
        const connection = createConnectionPool(data);
        queryDatabase(connection, `SELECT * FROM \`${studentName}\``)
            .then(({ results, fields }) => {
                // 单个学生分数统计
                results.forEach((item) => {
                    totalScore += item.score;
                });
                res.status(200).json({
                    data: results,
                    totalScore: totalScore,
                    code: 200,
                    msg: '获取数据成功'
                });
            }).catch((error) => {
                console.error('Error:', error);
                res.status(500).json(error);
            })
        // connection.end();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

getAllDataRouter.post('/table/team', async (req, res) => {
    // 获取前端传入的数据库连接信息，包装成json对象
    const { data, teamId } = req.body;
    const teamTableName = teamId + '组';
    // console.log('Received data:', data, studentName);
    // 如果没有传入数据库名称，则返回错误信息
    if (!data) {
        return res.status(400).json({
            code: 400,
            msg: '数据库名称不能为空'
        });
    }

    try {
        let totalScore = 0;
        const connection = createConnectionPool(data);
        queryDatabase(connection, `SELECT * FROM \`${teamTableName}\``)
            .then(({ results, fields }) => {
                // 单个学生分数统计
                results.forEach((item) => {
                    totalScore += item.score;
                });
                res.status(200).json({
                    data: results,
                    totalScore: totalScore,
                    code: 200,
                    msg: '获取数据成功'
                });
            }).catch((error) => {
                console.error('Error:', error);
                res.status(500).json(error);
            })
        // connection.end();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = getAllDataRouter;