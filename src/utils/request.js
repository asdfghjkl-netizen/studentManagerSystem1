import axios from "axios";
import { decrypt } from "./setCrypt";  // 解密

// 获取配置
const globalConfig = decrypt(sessionStorage.getItem("globalConfig"));
// 获取 IP
const IP = globalConfig ? globalConfig.VUE_APP_IP : '127.0.0.1';

/** 创建axios实例 */
const instance = axios.create({
    baseURL: `http://${IP}:3000/`,
    timeout: 1000 * 10,
});

/**
 * 请求拦截器
 * @param {Object} config - 请求配置
 * @returns {Object} - 请求配置
 */
instance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * 响应拦截器
 * @param {Object} response - 响应对象
 * @returns {Object} - 响应对象
 */
instance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        const config = error.config; // 获取请求配置
        const globalConfig = decrypt(sessionStorage.getItem("globalConfig"));
        // 获取 IP
        const IP = globalConfig ? globalConfig.VUE_APP_IP : '127.0.0.1';
        // 如果配置不存在或未设置重试选项，则拒绝
        if (!config || !config.retry) return Promise.reject(error);
        // 重试次数
        config.__retryCount = config.__retryCount || 0;

        // 检查是否已经达到重试次数
        if (config.__retryCount >= config.retry) {
            return Promise.reject(error);
        }

        // 增加重试次数
        config.__retryCount += 1;

        // 重置 IP 地址
        config.baseURL = `http://${IP}:3000/`;

        // 创建新的Promise来处理重试
        const backoff = new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, config.retryDelay || 1000);
        });

        // 返回Promise以重新发起请求
        return backoff.then(() => {
            return instance(config);
        });
    }
);

// 设置重试次数和重试延迟
instance.defaults.retry = 5;
instance.defaults.retryDelay = 1000;

export default instance;
