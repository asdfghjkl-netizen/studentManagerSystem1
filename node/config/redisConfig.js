const redis = require('redis');
const path = require('path');
const { exec } = require('child_process');

// 获取当前执行目录
const currentDir = process.cwd();

// 使用 exec 运行 .bat 文件，并处理结果
function startRedisServer() {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(currentDir, 'start-redis.bat');
    exec(scriptPath, { encoding: 'utf8' }, (error, stderr, stdout) => {
      if (error || stderr) {
        const message = error ? `Error executing ${scriptPath}: ${error}` : `Error output from ${scriptPath}: ${stderr}`;
        console.error(message);
        // reject(new Error(message));  
      } else {
        console.log(`Output from ${scriptPath}:`, stdout);
        resolve();
      }
    });
  });
}
startRedisServer();
new Promise(resolve => setTimeout(resolve, 100));

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
});

// 监听错误信息
redisClient.on('error', err => {
  console.error('Redis client error:', err);
});

// 监听成功连接信息
redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('ready', () => {
  console.log('Redis client ready');
});

redisClient.on('end', () => {
  console.log('Redis client end');
});

redisClient.on('reconnecting', () => {
  console.log('Redis client reconnecting');
});

module.exports = redisClient;
