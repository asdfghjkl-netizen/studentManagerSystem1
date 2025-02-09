const defaultGateway = require('default-gateway'); // 获取默认网关
const prettier = require('prettier');    // 格式化代码
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const os = require('os');

// 获取所有以 server 开头的文件
const serverFiles = glob.sync('server*', { cwd: path.join(__dirname, '..') });
// 获取所有以 .bat 结尾的文件
const batFiles = glob.sync('*.bat', { cwd: path.join(__dirname, '..') });
// 排除的文件名称
const excludeFiles = [
  'server-linux',
  'server-macos',
  'index.html',
  'favicon.ico',
  'start-production.bat',
];
// 输出目录
const outputDir = process.env.VUE_APP_OUTPUT_DIR;

module.exports = {
  outputDir,
  // 配置 copy-webpack-plugin
  patterns: [
    {
      // 添加 copy-webpack-plugin 配置 public 目录
      from: path.resolve(path.join(__dirname, '../', 'public')),
      to: path.resolve(path.join(__dirname, '../', outputDir, 'public')),
      filter: source => !excludeFiles.includes(path.basename(source)) // 排除特定文件
    }, {
      // 添加 copy-webpack-plugin 配置 node 目录
      from: path.resolve(path.join(__dirname, '../', 'node')),
      to: path.resolve(path.join(__dirname, '../', outputDir, 'node'))
    },
    // 添加 copy-webpack-plugin 配置 server 文件
    ...serverFiles.map(file => ({
      from: path.resolve(path.join(__dirname, '../', file)),
      to: path.resolve(path.join(__dirname, '../', outputDir, file)),
      filter: source => !excludeFiles.includes(path.basename(source)) // 排除特定文件
    })),
    // 添加 copy-webpack-plugin 配置 .bat 文件
    ...batFiles.map(file => ({
      from: path.resolve(path.join(__dirname, '../', file)),
      to: path.resolve(path.join(__dirname, '../', outputDir, file)),
      filter: source => !excludeFiles.includes(path.basename(source)) // 排除特定文件
    })), {
      // 添加 copy-webpack-plugin 配置 markdown 文件
      from: path.resolve(path.join(__dirname, '../', 'README.md')),
      to: path.resolve(path.join(__dirname, '../', outputDir))
    }, {
      // 添加 copy-webpack-plugin 配置 favicon.ico 图标
      from: path.resolve(path.join(__dirname, '../', 'public/favicon.ico')),
      to: path.resolve(path.join(__dirname, '../', outputDir))
    }, {
      // 添加 copy-webpack-plugin 配置 redis-server 目录
      from: path.resolve(path.join(__dirname, '../', 'redis-server')),
      to: path.resolve(path.join(__dirname, '../', outputDir, 'redis-server'))
    },
  ],
  formatFiles,
  filterWarnings,
  setTerserOptions,
}

/** 
 * 通用文件格式化函数
 * @param {Array} files 文件路径数组
 * @param {String} extension 文件扩展名
 * @param {String} parser 解析器
 */
async function formatFiles(files, extension, parser) {
  await Promise.all(files.map(async (file) => {
    // console.log(`Processing ${extension} file: ${file}`);
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const formattedContent = await prettier.format(content, { parser });
      fs.writeFileSync(file, formattedContent, 'utf-8');
    } catch (error) {
      console.error(`Error processing ${extension} file ${file}:`, error);
    }
  }));
}

/** 
 * 过滤警告的函数
 * @param {Object} error 错误对象
 * @returns {Object} 过滤后的错误对象
 */
function filterWarnings(error) {
  if (error.severity === 'warning') {
    const warningMessagesToIgnore = [
      // 忽略警告信息
      '<tr> cannot be child of <div>',
      'Another warning message to ignore',
      'Yet another warning message to ignore',
      "Compiled with  warnings",
      // 可以继续添加更多的警告信息
      "warning",
      "eprecation Warning",
      "WARNING",
      "Deprecation Warning",
    ];

    if (warningMessagesToIgnore.some(warningMessage => error.message.includes(warningMessage))) {
      return null; // 过滤掉匹配的警告
    }
  }
  return error; // 返回其他类型的错误
}

/** 
 * 异步设置 Terser 选项
 * @param {Object} config 配置对象
 */
async function setTerserOptions(config) {
  return new Promise((resolve, reject) => {
    try {
      // 移除console
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
      // 移除debugger
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true;
      // 移除console.log
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log'];
      // 移除无用的 getter
      config.optimization.minimizer[0].options.terserOptions.compress.pure_getters = true;
      // 移除无用的 setter
      config.optimization.minimizer[0].options.terserOptions.compress.keep_fargs = false;
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
