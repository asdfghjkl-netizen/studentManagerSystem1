/**
 * seat界面下载、保存等文件操作--以及SQL文件的备份与还原等操作
 */
const express = require('express');
const { headerConfig } = require('../../config/publicConfig');
const { createConnectionPool, executeTransaction, queryDatabase } = require('../../config/mysqlConfig');

const filesOptionRouter = express.Router();  // 创建路由实例

filesOptionRouter.all('*', (req, res, next) => { headerConfig(req, res, next) });

/**
 * 保存文件操作
 */
filesOptionRouter.post('/save', async (req, res) => {
    
});

module.exports = filesOptionRouter;