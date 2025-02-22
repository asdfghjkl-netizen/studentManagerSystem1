// 公共配置文件
const path = require('path');

const currentDir = process.cwd();   // 获取当前执行目录
// 使用获取 public 目录的路径
const publicPath = path.join(currentDir, 'public');
// 学生组队，管理信息表头
const stuManageInfoTitle = "stuManageInfo";

// 跨域配置
function headerConfig(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    next();
}

module.exports = {
    stuManageInfoTitle,
    currentDir,
    publicPath,
    PORT: process.env.PORT || 3000,  // 端口号
    headerConfig,    // 跨域配置
};
