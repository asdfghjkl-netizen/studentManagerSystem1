import instance from "@/utils/request";

/**
 * 登录
 * @param {Object} data - 登录数据
 * @returns {Promise} - 登录结果
 */
export function login(data) {
    return instance({
        url: 'auth/login',
        method: 'post',
        data
    });
}
