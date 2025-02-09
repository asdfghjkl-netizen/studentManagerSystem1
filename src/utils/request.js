import axios from "axios";
import { decrypt } from "./setCrypt";  // 解密

// 解密ip
const config = decrypt(sessionStorage.getItem("globalConfig"));
// console.log("config", config)

/** 创建axios实例 */
const instance = axios.create({
    baseURL: `http://${config ? config.VUE_APP_IP : '127.0.0.1'}:3000/`,
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
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
