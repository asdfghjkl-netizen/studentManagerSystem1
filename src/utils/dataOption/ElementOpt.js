import { ElNotification } from "element-plus";
import { en, zhCn } from 'element-plus/es/locale';
import { computed, ref } from 'vue';

/**
 * 创建一个Element Plus Notification 通知限制一次弹出次数为3
 * @param {string} title - 通知标题
 * @param {string} message - 通知内容
 * @param {string} type - 通知类型（可选：'success', 'warning', 'info', 'error'）
 * @param {number} duration - 通知显示时间（毫秒）
 */
const createElNotification = (() => {
    let notificationCount = 0;  // 记录当前显示的通知数量
    const maxNotifications = 3; // 最大通知数量

    return (title, message, type, duration) => {
        if (notificationCount < maxNotifications) {
            ElNotification({
                title: title,
                message: message,
                type: type,
                duration: duration,
                // 关闭时重置状态, 通知数量减1
                onClose: () => { notificationCount-- },
            });
            notificationCount++;
        }
    };
})();

const language = ref('zh-cn'); // 设置语言包
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en));

export {
    createElNotification,
    language,
    locale
}
