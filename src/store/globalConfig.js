import { defineStore } from "pinia";
import { en, zhCn } from 'element-plus/es/locale';

// defineStore('config',{})  config就是这个仓库的名称name
export const useConfig = defineStore('config', {
    // 初始化数据
    state: () => ({
        lang: '1',             // 语言切换 1 中文 2 英文
        language: 'zh-cn',     // 设置语言包
        ipConfig: '',          // 解密ip
        /** 学生座位表选择数据，默认为1---》班级座位表 */ 
        selectedSeatData: 1, 
        /** 分数选择数据，默认为1---》隐藏 */ 
        selectedScoreStatu: 1,
    }),
    // 计算属性 
    getters: {
        /**
         * 设置语言包
         * @param {*} state 
         */
        locale: (state) => {
            return state.language === 'zh-cn' ? zhCn : en;
        }
    },
    // 方法
    actions: {
        /**
         * 切换语言
         * @param {string} event 
         */
        changeGlobalLang(event) {
            // TODO 切换语言
            // console.log(event);
            this.lang = event;
            
            if (this.lang === "1") {
                this.language = "zh-cn";
                console.log(this.locale)
            } else {
                this.language = "en";
                console.log(this.locale)
            }
        },
        /**
         * 设置ip
         * @param {string} event 
         */
        setIpConfig(event) {
            this.ipConfig = event;
            if (event) {
                sessionStorage.setItem("globalConfig", event);
                console.log("设置ip成功");
            }
        },
        /** 获取ip */
        getIpConfig() {
            return sessionStorage.getItem("globalConfig");
        },
        /** 设置学生座位表选择数据 */
        setSelectedSeatData(event) {
            this.selectedSeatData = event;
        },
        /** 设置分数选择数据 */
        setSelectedScoreStatu(event) {
            this.selectedScoreStatu = event;
        },
    },

    // 使用持久化
    persist: {
        enabled: true,
        storage: localStorage,
        key: "config",
        path: ["lang", "language", "locale", "selectedSeatData"]
    },
})
