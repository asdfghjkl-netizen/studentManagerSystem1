class Exception extends Error {
    constructor(title, type, message, statusCode = 500, details = {}) {
        super(message);
        this.title = title;
        this.type = type;
        this.statusCode = statusCode;
        this.details = details;
        this.timestamp = new Date().toISOString();
        this.stackTrace = this.stack;
    }

    toJSON() {
        return {
            success: false,
            error: {
                title: this.title,
                type: this.type,
                message: this.message,
                statusCode: this.statusCode,
                timestamp: this.timestamp,
                details: this.details,
                stackTrace: process.env.NODE_ENV === 'development' ? this.stackTrace : undefined
            }
        };
    }

    toString() {
        return `[${this.timestamp}] ${this.type}: ${this.title} - ${this.message}`;
    }

    static createFromError(error, title = 'Internal Server Error', type = 'INTERNAL_ERROR') {
        return new Exception(
            title,
            type,
            error.message,
            error.statusCode || 500,
            {
                originalError: error.name,
                stack: error.stack
            }
        );
    }
}

module.exports = Exception;
