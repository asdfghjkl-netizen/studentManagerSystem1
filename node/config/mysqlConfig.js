const mysql = require('mysql2');

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

module.exports = {
  createConnectionPool,
  queryDatabase
};
