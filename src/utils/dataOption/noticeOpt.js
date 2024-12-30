import { ElNotification } from "element-plus";

// 显示通知一次，过时后重新显示
export const createElNotification = (() => {
    let shown = false;
    return (title, message, type, duration) => {
        if (!shown) {
            ElNotification({
                title: title,
                message: message,
                type: type,
                duration: duration,
            });
            shown = true;
            // 判断是否已经显示过
            setTimeout(() => {
                shown = false;
            }, duration);
        }
    };
})();
