const md5 = require("md5");
const axios = require("axios");
const apiUrl = 'http://api.fanyi.baidu.com/api/trans/vip/translate';
const appid = "20231029001862767" //process.env.APPID;
const secret = "vXTFksCevr2EGGU5cnhL" // process.env.SECRET;

const requestTranslate = (q) => {
    const salt = Math.random();
    const sign = md5(appid + q + salt + secret);
    const params = {
        q,
        from: 'zh',
        to: 'en',
        salt,
        appid,
        sign,
    };
    return axios.get(apiUrl, {
        params,
    });
};

// 辅助函数：将字符串转换为大驼峰命名法
function toCamelCase(str) {
    return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
}

module.exports = {
    requestTranslate,
    toCamelCase
};
