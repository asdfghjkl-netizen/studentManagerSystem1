const express = require('express');  
const app = express();  
const cors = require("cors");

const PORT = process.env.PORT || 3000;  

// 允许跨域请求
app.use(cors())

// 定义一个简单的路由  
app.get('/helloWorld', (req, res) => {  
  res.send('Hello, World!');  
}); 

// 定义一个上传excel文件的接口
app.post('/upload-excel', (req, res) => {  
  res.send('Hello from Node.js server!');  
});
  
// 启动服务器  
app.listen(PORT, () => {  
  console.log(`Server is running on http://localhost:${PORT}`);  
});
