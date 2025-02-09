const crypto = require('crypto');

// 加密密钥（建议从环境变量获取）
const secret = 'abcdefghijklmnopqrstuvwxyz123456';
// 加密算法
const algorithm = 'aes-256-cbc';

/**
 * 加密函数
 * @param   {string}  text 要加密的文本
 * @returns {string}       加密后的文本
 */
function encrypt(text) {
    // console.log('secret', secret, text);
    // 生成随机初始化向量
    const iv = crypto.randomBytes(16);
    // 创建加密器
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secret), iv);

    // 加密文本
    let encrypted = cipher.update(text);
    // 将加密后的文本和初始化向量连接起来
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    // 返回初始化向量和加密后的文本
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * 解密函数
 * @param   {string} text 要解密的文本
 * @returns {string}      解密后的文本
 */
function decrypt(text) {
    try {
        // 将初始化向量和加密后的文本分开
        const textParts = text.split(':');
        // 将初始化向量转换为缓冲区
        const iv = Buffer.from(textParts.shift(), 'hex');
        // 将加密后的文本转换为缓冲区
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        // 创建解密器
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secret), iv);
        // 解密文本
        let decrypted = decipher.update(encryptedText);
        // 将解密后的文本和初始化向量连接起来
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        // 返回解密后的文本
        return JSON.parse(decrypted.toString());
    } catch (err) {
        console.error('解密失败', err);
        return null;
    }
}

module.exports = {
    encrypt,
    decrypt
};
