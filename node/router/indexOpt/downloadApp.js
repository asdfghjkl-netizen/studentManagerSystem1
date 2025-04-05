const path = require('path');
const fs = require('fs');
const express = require('express');
const { headerConfig, currentDir } = require('../../config/publicConfig');

// 创建路由实例
const addAPPRouter = express.Router();

// 允许跨域请求
addAPPRouter.all('*', function (req, res, next) { headerConfig(req, res, next) });

// 下载应用程序的路由处理函数
addAPPRouter.post('/downloadApp', (req, res) => {
    // TODO: 这里可以根据需要动态生成文件路径
    // 例如，可以根据请求参数来决定下载哪个文件
    const filePath = path.join(currentDir, 'build/Seat Setup.exe'); // 根据实际情况调整路径

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found'); // 文件不存在时返回404状态码
    }

    // 设置响应头，告诉浏览器这是一个下载文件
    res.setHeader('Content-Disposition', 'attachment; filename=Seat Setup.exe'); // 设置下载文件的名称
    res.setHeader('Content-Type', 'application/octet-stream'); // 设置文件类型为二进制流
    res.setHeader('Content-Length', fs.statSync(filePath).size); // 设置响应头的 Content-Length，告诉浏览器文件大小
    // res.download(filePath); // 开始下载
    // 也可以使用 res.sendFile() 方法来实现
    res.sendFile(filePath, { headers: { 'Content-Disposition': 'attachment; filename=Seat Setup.exe' } });
    // 也可以使用 fs.createReadStream() 方法来实现
    // fs.createReadStream(filePath).pipe(res);
});

module.exports = addAPPRouter;