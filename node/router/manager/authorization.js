/**
 * 用户验证路由
 * @description 处理用户验证相关的路由
 */
const jwt = require('jsonwebtoken');  // token 生成器
const { createConnectionPool, queryDatabase } = require('../../config/mysqlConfig');
const express = require('express');
const { headerConfig } = require('../../config/publicConfig');

const authorizationRouter = express.Router();
// JWT 密钥
const JWT_SECRET = process.env.JWT_SECRET || 'qwertyuiopasdfghjklzxcvbnm1234567890';

authorizationRouter.all('*', function (req, res, next) { headerConfig(req, res, next) });

/**
 * 登录验证
 * @description 处理用户登录验证的请求
 */
authorizationRouter.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    // console.log('Received login data:', username, password);

    // 创建一个连接池
    const poolForDBs = createConnectionPool('stumanagementinfo');

    // 使用已有的 queryDatabase 方法执行查询
    queryDatabase(poolForDBs, 'SELECT * FROM authorinfo WHERE username = ? AND password = ?',
        [username, password]).then(({ results, fields }) => {
            // console.log('Received login data:', results);
            const un = results[0]?.username || '';
            const passwd = results[0]?.password || '';
            // 模拟验证逻辑
            if (username === un && password === passwd) {
                // 生成token
                const token = jwt.sign(
                    { userId: 1, username: 'admin', role: 'administrator' },
                    JWT_SECRET,
                    { expiresIn: '2h' }, // 设置token过期时间为2小时
                );
                res.json({
                    code: 200,
                    message: '登录成功',
                    data: {
                        userId: 1,
                        username: un,
                        role: 'administrator',
                        token // 返回token
                    }
                });
            } else {
                res.json({
                    code: 401,
                    message: '用户名或密码错误'
                });
            }
            poolForDBs.end();
        }).catch(error => {
            res.json({
                code: 500,
                error: error.message
            });
            // poolForDBs.end();
        });
});

module.exports = authorizationRouter;