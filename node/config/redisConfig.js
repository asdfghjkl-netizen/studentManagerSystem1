const redis = require('redis');
const path = require('path');
const { currentDir } = require('./publicConfig')
const { exec } = require('child_process');

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
// console.log("process.env.REDIS_HOST", process.env.REDIS_HOST);

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  retry_strategy: options => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // 当连接被拒绝时，尝试重新连接
      return 1000; // 重新连接的延迟时间（毫秒）
    }
    if (options.total_retry_time > 1000 * 60) {
      // 当重试时间超过一分钟时，停止重试
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  },
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

redisClient.on('close', () => {
  console.log('Redis client closed');
});

module.exports = redisClient;
