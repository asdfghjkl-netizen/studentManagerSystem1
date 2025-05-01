const express = require('express');
const { headerConfig } = require('../config/publicConfig');
const { createConnectionPool, executeTransaction, queryDatabase } = require('../config/mysqlConfig');

const dataOptionsRouter = express.Router();

// 允许跨域请求
dataOptionsRouter.all('*', function (req, res, next) { headerConfig(req, res, next) });

dataOptionsRouter.post('/table/student/add', async (req, res) => {
    const { data, student, dateTime, score, studyStatus, teamId } = req.body;
    // console.log('Received data:', data, student, dateTime, score, studyStatus, teamId);
    if (!data) {
        return res.status(400).json({
            code: 400,
            msg: '数据库名称不能为空'
        });
    }

    try {
        const connection = createConnectionPool(data);

        // 开始事务处理
        executeTransaction(connection, (connection) => {
            return [
                queryDatabase(connection, `INSERT INTO ${student} (date_time, study_statu, score)
                    VALUES (?, ?, ?)`, [dateTime, studyStatus, score]),
                queryDatabase(connection, `UPDATE studentmanagentinfo SET study_status = study_status + ?
                    WHERE student_name = ?`, [score, student]),
            ]
        }).then(result => {
            console.log('事务处理成功');
            res.status(200).json({
                code: 200,
                msg: '数据添加成功'
            });
        }).catch(err => {
            console.error('事务处理失败：', err);
            res.status(500).json({
                code: 500,
                msg: '数据添加失败'
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

dataOptionsRouter.post('/table/student/remove', async (req, res) => {
    const { data, student, dateTime, score, teamId } = req.body;
    // console.log('Received data:', data, student, dateTime, score, teamId);
    if (!data) {
        return res.status(400).json({
            code: 400,
            msg: '数据库名称不能为空'
        });
    }

    try {
        const connection = createConnectionPool(data);

        // 开始事务处理
        executeTransaction(connection, (connection) => {
            return [
                queryDatabase(connection, `DELETE FROM ${student} WHERE date_time = ?`, [dateTime]),
                queryDatabase(connection, `UPDATE studentmanagentinfo SET study_status = study_status - ${score}
                    WHERE student_name = ?`, [student]),
            ]
        }).then(result => {
            console.log('事务处理成功');
            res.status(200).json({
                code: 200,
                msg: '数据删除成功'
            });
        }).catch(err => {
            console.error('事务处理失败：', err);
            res.status(500).json({
                code: 500,
                msg: '数据删除失败'
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

dataOptionsRouter.post('/table/team/add', async (req, res) => {
    const { data, dateTime, score, studyStatus, teamId } = req.body;
    const teamName = teamId + '组';
    // console.log('Received data:', data, dateTime, score, studyStatus, teamId);
    if (!data) {
        return res.status(400).json({
            code: 400,
            msg: '数据库名称不能为空'
        });
    }

    try {
        const connection = createConnectionPool(data);

        // 开始事务处理
        executeTransaction(connection, (connection) => {
            return [
                queryDatabase(connection, `INSERT INTO ${teamName} (date_time, study_statu, score)
                    VALUES (?, ?, ?)`, [dateTime, studyStatus, score]),
            ]
        }).then(result => {
            console.log('事务处理成功');
            res.status(200).json({
                code: 200,
                msg: '数据添加成功'
            });
        }).catch(err => {
            console.error('事务处理失败：', err);
            res.status(500).json({
                code: 500,
                msg: '数据添加失败'
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

dataOptionsRouter.post('/table/team/remove', async (req, res) => {
    const { data, dateTime, score, teamId } = req.body;
    const teamName = teamId + '组';
    console.log('Received data:', data, dateTime, score, teamId);
    if (!data) {
        return res.status(400).json({
            code: 400,
            msg: '数据库名称不能为空'
        });
    }

    try {
        const connection = createConnectionPool(data);

        // 开始事务处理
        executeTransaction(connection, (connection) => {
            return [
                queryDatabase(connection, `DELETE FROM ${teamName} WHERE date_time = ?`, [dateTime]),
            ]
        }).then(result => {
            console.log('事务处理成功');
            res.status(200).json({
                code: 200,
                msg: '数据删除成功'
            });
        }).catch(err => {
            console.error('事务处理失败：', err);
            res.status(500).json({
                code: 500,
                msg: '数据删除失败'
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = dataOptionsRouter;
