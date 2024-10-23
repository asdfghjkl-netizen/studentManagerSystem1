在 Node.js 中使用 `fs.write` 将一个 Buffer 形式的 Excel 文件写入到 Vue 3 项目的 `public/` 目录下，并在前端获取这个数据，可以通过以下步骤实现。我们将使用 `exceljs` 库来创建 Excel 文件。

### 后端部分（Node.js + Express）

1. **安装依赖**

   首先，确保你已经安装了 Node.js 和 npm，然后安装必要的包：

   ```bash
   npm install express exceljs fs
   ```

2. **创建 Express 服务器并生成 Excel 文件**

   ```javascript
   // server.js
   const express = require('express');
   const fs = require('fs');
   const path = require('path');
   const ExcelJS = require('exceljs');
   const app = express();
   const PORT = 3000;

   app.use(express.static(path.join(__dirname, 'public')));

   app.get('/generate-excel', (req, res) => {
     const workbook = new ExcelJS.Workbook();
     const worksheet = workbook.addWorksheet('My Sheet');

     // 示例数据
     worksheet.columns = [
       { header: 'Id', key: 'id', width: 10 },
       { header: 'Name', key: 'name', width: 32 },
       { header: 'D.O.B.', key: 'dob', width: 15 }
     ];

     const rows = [
       { id: 1, name: 'John Doe', dob: new Date(1980, 6, 20) },
       { id: 2, name: 'Anna Smith', dob: new Date(1992, 1, 14) },
       { id: 3, name: 'Peter Brown', dob: new Date(2000, 11, 25) }
     ];

     rows.forEach((row) => worksheet.addRow(row));

     // 写入到Buffer
     workbook.xlsx.writeBuffer().then((buffer) => {
       const filePath = path.join(__dirname, 'public', 'file.xlsx');
       fs.writeFile(filePath, buffer, (err) => {
         if (err) {
           return res.status(500).send('Error writing file.');
         }
         res.sendFile(filePath); // 或者 res.send('File generated successfully.');
       });
     }).catch((err) => {
       res.status(500).send('Error generating Excel file.');
     });
   });

   app.listen(PORT, () => {
     console.log(`Server is running on http://localhost:${PORT}`);
   });
   ```

### 前端部分（Vue 3）

1. **在 Vue 3 项目中创建一个组件来下载 Excel 文件**

   ```vue
   <!-- DownloadExcel.vue -->
   <template>
     <div>
       <button @click="downloadExcel">Download Excel File</button>
     </div>
   </template>

   <script>
   import axios from 'axios';

   export default {
     name: 'DownloadExcel',
     methods: {
       async downloadExcel() {
         try {
           const response = await axios.get('/generate-excel', {
             responseType: 'blob' // 告诉axios期望服务器返回的是blob类型
           });

           const url = window.URL.createObjectURL(new Blob([response.data]));
           const link = document.createElement('a');
           link.href = url;
           link.setAttribute('download', 'file.xlsx');
           document.body.appendChild(link);
           link.click();
           document.body.removeChild(link);
         } catch (error) {
           console.error('Error downloading Excel file:', error);
         }
       }
     }
   };
   </script>

   <style scoped>
   button {
     padding: 10px 20px;
     font-size: 16px;
   }
   </style>
   ```

2. **在 Vue 3 项目的主文件中引入并使用这个组件**

   ```vue
   <!-- App.vue -->
   <template>
     <div id="app">
       <DownloadExcel />
     </div>
   </template>

   <script>
   import DownloadExcel from './components/DownloadExcel.vue';

   export default {
     name: 'App',
     components: {
       DownloadExcel
     }
   };
   </script>

   <style>
   #app {
     font-family: Avenir, Helvetica, Arial, sans-serif;
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
     text-align: center;
     color: #2c3e50;
     margin-top: 60px;
   }
   </style>
   ```

### 运行项目

1. **启动后端服务器**

   ```bash
   node server.js
   ```

2. **启动 Vue 3 前端项目**

   确保你在 Vue 3 项目目录下，然后运行：

   ```bash
   npm run serve
   ```

现在，你应该能够通过访问 Vue 3 项目，并点击按钮来生成并下载 Excel 文件。Excel 文件会保存在 `public/` 目录下，并且可以通过后端接口生成和下载。
