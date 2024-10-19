import { ref } from "vue";

// 时间类
class dateClass {
    // 结构体
    constructor() {
        this.updateTime();
    }
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
    formatDateTime(value) {
        return value < 10 ? `0${value}` : `${value}`;
    }
}

// 获取时间数据
const dateTime = ref("");
// 创建类的实例
const dateInstance = new dateClass();

// 设置时间格式
export const getDateTime = async () => {
    dateInstance.updateTime();
    const date = dateInstance.year + "-" + dateInstance.month + "-" + dateInstance.day;
    const timeValue = dateInstance.hour + ":" + dateInstance.minute + ":" + dateInstance.second;
    dateTime.value = date + '\xa0' + timeValue;
    return dateTime.value;
}
