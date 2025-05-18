/**
 * @file createClass.js
 * @description 处理创建班级的路由
 * @module createClassRouter
 */
const express = require('express');
const { headerConfig } = require('../config/publicConfig');
const { createConnectionPool, executeTransaction, queryDatabase } = require('../config/mysqlConfig');

const createClassRouter = express.Router();

// 允许跨域请求
createClassRouter.all('*', function (req, res, next) { headerConfig(req, res, next) });



module.exports = createClassRouter;