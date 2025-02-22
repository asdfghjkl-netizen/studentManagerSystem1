import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menus: [
      {
        index: '1',
        icon: 'Message',
        title: 'Navigator One',
        groups: [
          {
            title: 'Group 1',
            items: [
              { index: '1-1', title: 'Option 1' },
              { index: '1-2', title: 'Option 2' }
            ]
          }, {
            title: 'Group 2',
            items: [
              { index: '1-3', title: 'Option 3' }
            ]
          }
        ],
        subMenus: [
          {
            index: '1-4',
            title: 'Option 4',
            items: [
              { index: '1-4-1', title: 'Option 4-1' }
            ]
          }
        ]
      }, {
        index: '2',
        icon: 'Tools',
        title: '测试配置',
        items: [
          { index: '/manage/test/table', title: '表格测试' },
          { index: '/manage/test/table1', title: '表格1测试' }
        ]
      },
    ],
    activeIndex: '',  // 当前激活的菜单
  }),
  actions: {
    // 设置当前激活的菜单
    setActiveIndex(index) {
      this.activeIndex = index;
    },
  },

  persist: {
    enabled: true,
    storage: localStorage,
    key: "menu",
    path: ["menus", "activeIndex"]
  }
});
