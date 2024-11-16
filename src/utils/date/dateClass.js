export class dateClass {
    // 结构体
    constructor() { this.updateTime() }
    // 定义时间参数
    updateTime() {
        const time = new Date();
        this.year = this.formatDateTime(time.getFullYear());
        this.month = this.formatDateTime(time.getMonth() + 1);
        this.day = this.formatDateTime(time.getDate());
        this.hour = this.formatDateTime(time.getHours());
        this.minute = this.formatDateTime(time.getMinutes());
        this.second = this.formatDateTime(time.getSeconds());
    }
    // 定义时间格式化
    formatDateTime(value) { return value < 10 ? `0${value}` : `${value}` }
    // 获取时间 年月日
    getDate() { return `${this.year}-${this.month}-${this.day}` }
    // 获取时间 时分秒
    getTime() { return `${this.hour}:${this.minute}:${this.second}` }
}
