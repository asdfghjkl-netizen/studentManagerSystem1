const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path');

/**
 * 遍历目录及其子目录以找到匹配的文件
 * @param dir          要遍历的目录
 * @param fileName     要查找的文件名
 * @returns            文件路径，如果没有找到匹配的文件，则返回 null
 */
async function findFilePath(dir, fileName) {
  const files = await fsPromises.readdir(dir, { withFileTypes: true });

  // 遍历每个文件
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    // 如果是目录，递归调用
    if (file.isDirectory()) {
      const result = await findFilePath(filePath, fileName);
      if (result) return result;
      // 如果是文件，判断文件名是否匹配
    } else if (file.name === fileName) {
      return filePath;
    }
  }
  return null;
}

/**
 * 递归获取目录下所有 .xlsx 和 .xls 文件的文件名
 * @param dir          要遍历的目录
 * @returns            文件路径，如果没有找到匹配的文件，则返回 null
 */
async function getFilePath(dir) {
  let filesList = [];
  const files = fs.readdirSync(dir);
  // 遍历每个文件
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      // 如果是目录，则递归调用
      filesList = filesList.concat(await getFilePath(filePath));
    } else if (filePath.endsWith('.xlsx') || filePath.endsWith('.xls')) {
      // 如果是 .xlsx 或 .xls 文件，则添加文件名到列表中
      filesList.push(file);
    }
  }
  return filesList;
}

module.exports = {
  findFilePath,
  getFilePath
};
