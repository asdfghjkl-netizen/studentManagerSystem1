class Status {
    static get CATEGORY() {
        return Object.freeze({
            INFORMATIONAL: '1xx',
            SUCCESS: '2xx',
            REDIRECTION: '3xx',
            CLIENT_ERROR: '4xx',
            SERVER_ERROR: '5xx'
        });
    }

    static get CODE() {
        return Object.freeze({
            // 信息类状态码
            CONTINUE: 100,
            SWITCHING_PROTOCOLS: 101,

            // 成功类状态码
            OK: 200,
            CREATED: 201,
            ACCEPTED: 202,
            NO_CONTENT: 204,

            // 重定向类状态码
            MULTIPLE_CHOICES: 300,
            MOVED_PERMANENTLY: 301,
            FOUND: 302,
            SEE_OTHER: 303,
            NOT_MODIFIED: 304,

            // 客户端错误类状态码
            BAD_REQUEST: 400,
            UNAUTHORIZED: 401,
            FORBIDDEN: 403,
            NOT_FOUND: 404,
            METHOD_NOT_ALLOWED: 405,
            CONFLICT: 409,
            GONE: 410,
            UNSUPPORTED_MEDIA_TYPE: 415,

            // 服务器错误类状态码
            INTERNAL_SERVER_ERROR: 500,
            NOT_IMPLEMENTED: 501,
            BAD_GATEWAY: 502,
            SERVICE_UNAVAILABLE: 503,
            GATEWAY_TIMEOUT: 504
        });
    }

    static getStatusText(code) {
        const statusTexts = {
            [this.CODE.OK]: 'OK',
            [this.CODE.CREATED]: 'Created',
            [this.CODE.ACCEPTED]: 'Accepted',
            [this.CODE.NO_CONTENT]: 'No Content',
            [this.CODE.MULTIPLE_CHOICES]: 'Multiple Choices',
            [this.CODE.MOVED_PERMANENTLY]: 'Moved Permanently',
            [this.CODE.FOUND]: 'Found',
            [this.CODE.SEE_OTHER]: 'See Other',
            [this.CODE.NOT_MODIFIED]: 'Not Modified',
            [this.CODE.BAD_REQUEST]: 'Bad Request',
            [this.CODE.UNAUTHORIZED]: 'Unauthorized',
            [this.CODE.FORBIDDEN]: 'Forbidden',
            [this.CODE.NOT_FOUND]: 'Not Found',
            [this.CODE.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
            [this.CODE.BAD_GATEWAY]: 'Bad Gateway',
            [this.CODE.SERVICE_UNAVAILABLE]: 'Service Unavailable',
            [this.CODE.GATEWAY_TIMEOUT]: 'Gateway Timeout'
        };
        return statusTexts[code] || 'Unknown Status';
    }

    static getCategory(code) {
        if (!code || typeof code !== 'number') {
            return 'Invalid Code';
        }
        const firstDigit = Math.floor(code / 100);
        return Object.values(this.CATEGORY)[firstDigit - 1] || 'Unknown Category';
    }

    static checkStatus(code) {
        if (!code || typeof code !== 'number') {
            return {
                isSuccess: false,
                isClientError: false,
                isServerError: false
            };
        }
        
        return {
            isSuccess: code >= 200 && code < 300,
            isClientError: code >= 400 && code < 500,
            isServerError: code >= 500 && code < 600
        };
    }
}

// 确保类不能被修改
Object.freeze(Status);

module.exports = Status;