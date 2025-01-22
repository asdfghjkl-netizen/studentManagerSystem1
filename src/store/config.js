import { defineStore } from "pinia";
import { locale, language } from '@/utils/dataOption/ElementOpt';

// defineStore('config',{})  config就是这个仓库的名称name
export const useConfig = defineStore('config', {
    // 初始化数据
    state: () => ({
        lang: "1",
        language: language,
    }),
    // 计算属性 
    getters: {},
    // 方法
    actions: {
        changeGlobalLang(event) {
            // TODO 切换语言
            // console.log(event);
            this.lang = event;

            if (this.lang === "1") {
                language.value = "zh-cn";
                console.log(locale.value)
            } else {
                language.value = "en";
                console.log(locale.value)
            }
        },
    },

    // 使用持久化
    persist: {
        enabled: true,
        storage: localStorage,
        key: "config",
        path: ["lang", "language"]
    },
})
