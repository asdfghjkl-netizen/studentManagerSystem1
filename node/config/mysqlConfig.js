const mysql = require('mysql2');
const { currentDir } = require('./publicConfig');
const path = require('path');
const sqlFilePath = path.join(currentDir, 'sql'); // SQL 文件路径

/**
 * 根据传入的数据库名称，创建一个 MySQL 连接池
 * @param {string} database - 数据库名称
 * @return {Pool} - 返回创建的连接池对象
 */
const createConnectionPool = (database) => {
  // 如果数据库名称中不包含“名单”，则追加该后缀
  if (!database.includes('名单')) {
    database = database + '名单';
  }

  return mysql.createPool({
    port: 3306,               // 数据库端口号
    host: process.env.DB_HOST,// 数据库主机地址
    user: 'root',             // 数据库用户名
    password: '',             // 数据库密码
    database: database,       // 传入的数据库名称
    connectionLimit: 10,      // 连接池最大连接数
    waitForConnections: true, // 等待连接池中的连接可用
    queueLimit: 0,            // 连接请求队列的最大长度，0表示不限制
    multipleStatements: true, // 允许执行多条 SQL 语句
    acquireTimeout: 10000,    // 获取连接的超时时间（毫秒）
    connectTimeout: 30000,    // 连接超时时间（毫秒）
    ssl: false,               // 是否使用 SSL 连接
  });
}

/**
 * 执行 SQL 查询
 * @param {Pool} pool - MySQL 连接池对象
 * @param {string} sql - SQL 查询语句
 * @param {Array} params - SQL 查询参数
 * @return {Promise} - 返回一个 Promise 对象，解析为查询结果
 *                     或者在查询失败时被拒绝，并返回错误信息
 */
const queryDatabase = (pool, sql, params = []) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (error, results, fields) => {
      error ? reject(error) : resolve({ results, fields });
    });
  });
}

/**
 * 执行一系列 SQL 操作的事务，当操作失败时将回滚事务
 * @param {Pool} pool - MySQL 连接池对象
 * @param {Function} transactionCallback - 回调函数，包含一系列的事务操作，该函数接收连接对象作为参数，需返回 Promise
 * @return {Promise} - 返回一个 Promise 对象，当事务成功提交时解析，否则被拒绝
 */
const executeTransaction = (pool, transactionCallback) => {
  return new Promise((resolve, reject) => {
    // 从连接池中获取一个连接对象
    pool.getConnection((err, connection) => {
      if (err) return reject(err);
      // 开始事务，传入回调函数，回调函数中可以执行多条 SQL 语句
      connection.beginTransaction(err => {
        if (err) {
          connection.release();
          return reject(err);
        }
        // 执行回调函数，传入连接对象，该函数中可以执行多条 SQL 语句，并返回一个 Promise
        // Promise.resolve(transactionCallback(connection)).then(result => {
        //   // 提交事务
        //   connection.commit(commitErr => {
        //     // 如果提交失败，则回滚事务 
        //     if (commitErr) {
        //       return connection.rollback(() => {
        //         connection.release();
        //         reject(commitErr);
        //       });
        //     }
        //     // 事务提交成功，释放连接并返回结果
        //     connection.release();
        //     resolve(result);
        //   });
        // })
        // 执行回调函数，要求传入连接对象后返回一个 Promise 数组，每个元素都是一个 Promise
        Promise.all(transactionCallback(connection)).then(resultsArray => {
          // 提交事务
          connection.commit(commitErr => {
            if (commitErr) {
              return connection.rollback(() => {
                connection.release();
                reject(commitErr);
              });
            }
            connection.release();
            resolve(resultsArray);
          });
        }).catch(callbackError => {
          connection.rollback(() => {
            connection.release();
            reject(callbackError);
          });
        });
      });
    });
  });
};

/** 
 * MySQL数据库备份， 
 * 使用BACKUP DATABASE语句将数据库备份到指定的磁盘路径
 * @param {Pool} pool - MySQL 连接池对象
 * @param {string} databaseName - 要备份的数据库名称
 * @return {Promise} - 返回一个 Promise 对象，解析为备份结果，或者在备份失败时被拒绝，并返回错误信息
 */
const backupDatabase = (pool, databaseName) => {
  return new Promise((resolve, reject) => {
    const sql = `BACKUP DATABASE ${databaseName} TO DISK = '${sqlFilePath}\\${databaseName}.bak'`;
    pool.query(sql, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
}

/**
 * mysql还原备份数据库
 * 使用RESTORE语句将备份的数据库还原到指定的磁盘路径
 * @param {Pool} pool - MySQL 连接池对象
 * @param {string} databaseName - 要还原的数据库名称
 * @return {Promise} - 返回一个 Promise 对象，解析为还原结果，或者在还原失败时被拒绝，并返回错误信息
 */
const restoreDatabase = (pool, databaseName) => {
  return new Promise((resolve, reject) => {
    const sql = `RESTORE DATABASE ${databaseName} FROM DISK = '${sqlFilePath}\\${databaseName}.bak'`;
    pool.query(sql, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
}

module.exports = {
  createConnectionPool, // 创建连接池的函数
  queryDatabase,        // 执行 SQL 查询的函数
  executeTransaction,   // 执行事务的函数
  backupDatabase,       // 备份数据库的函数
  restoreDatabase,      // 还原数据库的函数
};
