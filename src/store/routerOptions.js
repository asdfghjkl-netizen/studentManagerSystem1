import { defineStore } from 'pinia';

export const useRouterStore = defineStore('router', {
  state: () => ({
    isLoading: false,   // 是否加载中
    toRoute: null,       // 上一个路由路径
    fromRoute: null,     // 下一个路由路径
  }),
  actions: {
    // 设置加载状态
    setLoading(isLoading) {
      this.isLoading = isLoading;
    },
  },

  persist: {
    enabled: true,
    storage: localStorage,
    key: "router",
    path: [
      "isLoading",
      "toRoute",
      "fromRoute",
    ]
  }
});
