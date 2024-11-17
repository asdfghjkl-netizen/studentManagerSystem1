const glob = require('glob');
const path = require('path');

// 获取所有以 server 开头的文件
const serverFiles = glob.sync('server*', { cwd: path.join(__dirname, '..') });
// 排除的文件名称
const excludeFiles = ['server-linux', 'server-macos', 'index.html', 'favicon.ico'];
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
        })), {
            // 添加 copy-webpack-plugin 配置 markdown 文件
            from: path.resolve(path.join(__dirname, '../', 'README.md')),
            to: path.resolve(path.join(__dirname, '../', outputDir))
        }, {
            // 添加 copy-webpack-plugin 配置 favicon.ico 图标
            from: path.resolve(path.join(__dirname, '../', 'public/favicon.ico')),
            to: path.resolve(path.join(__dirname, '../', outputDir))
        },
    ]
}
