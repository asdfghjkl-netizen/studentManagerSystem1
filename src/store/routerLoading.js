import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false,
  }),
    actions: {
    // 设置加载状态
    setLoading(isLoading) {
      this.isLoading = isLoading;
    },
  },
});
