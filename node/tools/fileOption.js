const fsPromises = require('fs').promises;
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

module.exports = {
    findFilePath,
};
