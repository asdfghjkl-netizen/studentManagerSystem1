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
          { index: '/manage/test/table1', title: '表格1测试' },
        ]
      }, {
        index: '3',
        icon: 'Setting',
        title: '系统设置',
        items: [
          { index: '/manage/system', title: '系统设置', icon: 'Setting' },
        ]
      },
    ],
    activeIndex: '',       // 当前激活的菜单
    selectedMenuTags: [{
      title: '首页',
      path: '/',
      icon: 'House',
      active: false
    }],  // 选中的菜单名称，用于显示在标签栏
  }),
  actions: {
    /**
     * 设置当前激活的菜单
     * @param index {string} 菜单索引
     */
    setActiveIndex(index) {
      this.activeIndex = index;
    },
    /**
     * 设置当前激活的菜单
     */
    getActiveIndex() {
      return this.activeIndex;
    },
    /**
     * 设置当前激活的tag菜单
     * @param tag  {string} 菜单名称对象
     */
    pushSelectedMenuTag(tag) {
      // console.log("tag", tag);
      // 查询当前选中的菜单名称是否包含该菜单名称
      const exists = this.selectedMenuTags.some(item => item.path === tag.path);
      // 如果当前选中的菜单名称不包含该菜单名称，则添加
      if (exists) return;
      this.selectedMenuTags.push(tag);
    },
    /**
     * 删除当前激活的tag菜单
     * @param {*} tag 
     */
    removeSelectedMenuTag(tag) {
      // console.log("tag", tag);
      // 查询当前选中的菜单名称是否包含该菜单名称
      const index = this.selectedMenuTags.findIndex(item => item.path === tag.path);
      // 如果当前选中的菜单名称不包含该菜单名称，则不执行删除
      if (index === -1) return;
      this.selectedMenuTags.splice(index, 1);
    },
  },

  persist: {
    enabled: true,
    storage: localStorage,
    key: "menu",
    path: ["menus", "activeIndex", "selectedMenuTags"],
  }
});
