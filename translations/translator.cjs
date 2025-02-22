// node common.js 模块
const zhEnTranslations = require('./zh-en.json');
const enZhTranslations = require('./en-zh.json');

/** 判断字符串是否包含中文字符 */
function isChinese(text) {
    // 判断字符串是否包含中文字符
    return /[\u4e00-\u9fa5]/.test(text);
}

/** 翻译字符串 */
function translate(text, reverse = false) {
    // 如果启用reverse模式，强制使用反向翻译字典
    if (reverse) {
        return enZhTranslations[text] || text;
    }
    
    // 自动检测语言并选择对应的翻译字典
    const translationDict = isChinese(text) ? zhEnTranslations : enZhTranslations;

    // 查找翻译
    if (translationDict[text]) {
        return translationDict[text];
    }

    // 如果找不到翻译，返回原文本
    return text;
}

module.exports = {
    translate,
};