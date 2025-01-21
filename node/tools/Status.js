class StatusCode {
    // 1xx Informational responses
    static CONTINUE = 100;  // 请求已收到，客户端应继续发送请求的其余部分。
    static SWITCHING_PROTOCOLS = 101;  // 服务器同意客户端切换到新的协议。
    static PROCESSING = 102;  //

    // 2xx Success 
    static OK = 200;    // 请求成功，服务器返回所请求的数据。
    static CREATED = 201;  // 服务器已创建新资源，并且返回该资源的元数据。
    static ACCEPTED = 202; // 服务器已接受请求，但尚未完成。
    static NON_AUTHORITATIVE_INFORMATION = 203;  
    static NO_CONTENT = 204;  // 服务器成功接收到请求，但未返回任何内容。
    static RESET_CONTENT = 205; //
    static PARTIAL_CONTENT = 206; //
    static MULTI_STATUS = 207; //
    static ALREADY_REPORTED = 208; //
    static IM_USED = 226; //

    // 3xx Redirection
    static MULTIPLE_CHOICES = 300;
    static MOVED_PERMANENTLY = 301;  // 请求的资源已永久移动到新位置。
    static FOUND = 302;   // 请求的资源临时移动到新位置。
    static SEE_OTHER = 303; //
    static NOT_MODIFIED = 304;  // 请求的资源未被修改，可以使用缓存的版本。
    static USE_PROXY = 305; //
    static TEMPORARY_REDIRECT = 307; //
    static PERMANENT_REDIRECT = 308; //

    // 4xx Client errors
    static BAD_REQUEST = 400;  // 请求有误，服务器无法理解。
    static UNAUTHORIZED = 401;  // 请求需要身份验证。
    static PAYMENT_REQUIRED = 402; // 
    static FORBIDDEN = 403;  // 服务器拒绝请求。
    static NOT_FOUND = 404;  // 请求的资源未找到。
    static METHOD_NOT_ALLOWED = 405; // 请求方法不允许。
    static NOT_ACCEPTABLE = 406; //
    static PROXY_AUTHENTICATION_REQUIRED = 407; //
    static REQUEST_TIMEOUT = 408; // 请求超时。
    static CONFLICT = 409; //
    static GONE = 410; //
    static LENGTH_REQUIRED = 411; //
    static PRECONDITION_FAILED = 412; //
    static PAYLOAD_TOO_LARGE = 413; //
    static URI_TOO_LONG = 414; //
    static UNSUPPORTED_MEDIA_TYPE = 415; //
    static RANGE_NOT_SATISFIABLE = 416; //
    static EXPECTATION_FAILED = 417; //
    static IM_A_TEAPOT = 418; //
    static MISDIRECTED_REQUEST = 421; //
    static UNPROCESSABLE_ENTITY = 422; //
    static LOCKED = 423; //
    static FAILED_DEPENDENCY = 424; //
    static TOO_EARLY = 425; //
    static UPGRADE_REQUIRED = 426; //
    static PRECONDITION_REQUIRED = 428; //
    static TOO_MANY_REQUESTS = 429; //
    static REQUEST_HEADER_FIELDS_TOO_LARGE = 431; //
    static UNAVAILABLE_FOR_LEGAL_REASONS = 451; //

    // 5xx Server errors
    static INTERNAL_SERVER_ERROR = 500; // 服务器遇到错误，无法完成请求。
    static NOT_IMPLEMENTED = 501; // 服务器不支持请求的功能。
    static BAD_GATEWAY = 502; // 服务器作为网关或代理，从上游服务器收到无效响应。
    static SERVICE_UNAVAILABLE = 503; // 服务器目前无法使用（由于超载或进行停机维护）。
    static GATEWAY_TIMEOUT = 504; // 服务器作为网关或代理，从上游服务器收到超时响应。
    static HTTP_VERSION_NOT_SUPPORTED = 505; //
    static VARIANT_ALSO_NEGOTIATES = 506; //
    static INSUFFICIENT_STORAGE = 507; //
    static LOOP_DETECTED = 508; //
    static NOT_EXTENDED = 510; //
    static NETWORK_AUTHENTICATION_REQUIRED = 511; //
}

module.exports = StatusCode;
