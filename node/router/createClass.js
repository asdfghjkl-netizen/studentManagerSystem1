/**
 * @file createClass.js
 * @description 处理创建班级的路由
 * @module createClassRouter
*/
const { createConnectionPool, executeTransaction, createTable, createDatabase } = require('../config/mysqlConfig');
const { headerConfig } = require('../config/publicConfig');
const sqlTableConfig = require('../config/sqlTableConfig');
const express = require('express');

const createClassRouter = express.Router();

// 允许跨域请求
createClassRouter.all('*', function (req, res, next) { headerConfig(req, res, next) });

createClassRouter.post('/create-class', async (req, res) => {
    const { className, courseName, rows, columns, studentData, groupData } = req.body;
    // 按 groupName 从小到大排序
    const sortedGroupData = groupData.slice().sort((a, b) => Number(a.groupName) - Number(b.groupName));
    console.log('Sorted Group Data:', sortedGroupData);
    console.log('Received data:', className, courseName, rows, columns);
    console.log('Student Data:', studentData);

    try {
        const connection = createConnectionPool();
        const dbName = `${className}名单`;  // 数据库名称

        // 创建班级数据库
        createDatabase(connection, dbName).then(() => {
            console.log("创建成功");

            // 创建学生表
            executeTransaction(connection, (conn) => {
                return [
                    // createTable(conn, dbName, 'student', sqlTableConfig.createStudentTable),
                    // createTable(conn, dbName, 'studentmanagentinfo', sqlTableConfig.createStudentmanagentinfoTable),
                ]
            }).then((result) => {

            }).catch((error) => {
                console.error('Transaction Error:', error);
            });

        }).catch((error) => {
            console.error('Error:', error);
        });
        connection.end();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = createClassRouter;