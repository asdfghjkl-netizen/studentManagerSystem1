const { createConnectionPool, queryDatabase } = require('../../config/mysqlConfig');
const express = require('express');
const { headerConfig } = require('../../config/publicConfig');

const manageOpt = express.Router();

manageOpt.all('*', function (req, res, next) { headerConfig(req, res, next) });

module.exports = manageOpt;