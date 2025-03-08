import { useMenuStore } from '@/store/menu';
import router from '@/router';

/** 跳转管理员界面 */
export const handleManage = () => {
    const menuStore = useMenuStore();
    // TODO 判断是否有权限


    // 判断 activeIndex 是否为空
    if (menuStore.activeIndex === "") {
        router.push("/manage");  // 默认管理界面
    } else {
        router.push(menuStore.activeIndex);  // 有 activeIndex 则跳转到 activeIndex
    }
};