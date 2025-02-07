import { ElNotification } from "element-plus";

/**
 * 创建一个Element Plus Notification 通知限制一次弹出次数为3
 * @param {string} title - 通知标题
 * @param {string} message - 通知内容
 * @param {string} type - 通知类型（可选：'success', 'warning', 'info', 'error'）
 * @param {number} duration - 通知显示时间（毫秒）
 * @param {boolean} showClose - 是否显示关闭按钮
 */
const createElNotification = (() => {
    let notificationCount = 0;  // 记录当前显示的通知数量
    const maxNotifications = 3; // 最大通知数量

    return (title, message, type, duration, showClose = false) => {
        if (notificationCount < maxNotifications) {
            ElNotification({
                title: title,
                message: message,
                type: type,
                duration: duration,
                showClose: showClose,
                // 关闭时重置状态, 通知数量减1
                onClose: () => { notificationCount-- },
            });
            notificationCount++;
        }
    };
})();

export {
    createElNotification,
}
