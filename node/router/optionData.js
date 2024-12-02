const express = require('express');
const headerConfig = require('../config/requestConfig');

// 创建路由实例
const optDataRouter = express.Router();

// 允许跨域请求
optDataRouter.all('*', function (req, res, next) { headerConfig(req, res, next) });

module.exports = optDataRouter;
