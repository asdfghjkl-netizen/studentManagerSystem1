import { ref } from "vue";
import { dateClass } from '@/utils/date/dateClass.js'

// 获取时间数据
const dateTime = ref("");
// 创建类的实例
const date = new dateClass();

/**
 * 设置时间格式
 * @returns dateTime.value  返回时间格式
 */
export const getDateTime = async () => {
    date.updateTime();
    dateTime.value = date.getDate() + '\xa0' + date.getTime();
    return dateTime.value;
}
