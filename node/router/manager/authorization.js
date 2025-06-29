/**
 * 用户验证路由
 * @description 处理用户验证相关的路由
 */
const express = require('express');
const { headerConfig } = require('../../config/publicConfig');

const authorizationRouter = express.Router();

authorizationRouter.all('*', function (req, res, next) { headerConfig(req, res, next) });

/**
 * 登录验证
 * @description 处理用户登录验证的请求
 */
authorizationRouter.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Received login data:', username, password);

    // 注意：为了查询所有数据库，这里直接使用 mysql.createPool
    const poolForDBs = mysql.createPool({
        host: process.env.DB_HOST,
        port: 3306,
        user: 'root',
        password: '',
        database: 'seatmanagerdata', // 使用指定数据库来查询用户数据
        connectionLimit: 10,
        waitForConnections: true,
    });

    // 使用已有的 queryDatabase 方法执行查询
    queryDatabase(poolForDBs, 'SHOW DATABASES')
        .then(({ results, fields }) => {
            // 模拟验证逻辑
            if (username === 'admin' && password === 'password') {
                res.json({
                    code: 200,
                    message: '登录成功',
                    data: {
                        userId: 1,
                        username: 'admin',
                        role: 'administrator'
                    }
                });
            } else {
                res.status(401).json({
                    code: 401,
                    message: '用户名或密码错误'
                });
            }
            poolForDBs.end();
        }).catch(error => {
            res.status(500).json({
                code: 500,
                error: error.message
            });
            // poolForDBs.end();
        });
});

module.exports = authorizationRouter;