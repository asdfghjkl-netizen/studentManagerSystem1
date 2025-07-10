<template>
  <div>
    <el-scrollbar>
      <!-- :default-active="activeIndex == '' ? route.path : activeIndex" -->
      <el-menu class="el-menu-vertical" :default-active="activeIndex" :default-openeds="['4']" :collapse="isCollapsed"
        :collapse-transition="false" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b"
        @select="handleSelect">
        <el-sub-menu v-for="menu in menus" :key="menu.index" :index="menu.index">
          <template #title>
            <el-icon>
              <component :is="menu.icon"></component>
            </el-icon>
            <span v-if="!isCollapsed">{{ menu.title }}</span>
          </template>
          <!-- 如果有 groups，则渲染 groups -->
          <template v-if="menu.groups">
            <el-menu-item-group v-for="group in menu.groups" :key="group.title" :title="group.title">
              <el-menu-item v-for="item in group.items" :key="item.index" :index="item.index">{{ item.title
              }}</el-menu-item>
            </el-menu-item-group>
          </template>
          <!-- 如果有 subMenus，则渲染 subMenus -->
          <template v-if="menu.subMenus">
            <el-sub-menu v-for="subMenu in menu.subMenus" :key="subMenu.index" :index="subMenu.index">
              <template #title>{{ subMenu.title }}</template>
              <el-menu-item v-for="item in subMenu.items" :key="item.index" :index="item.index">{{ item.title
              }}</el-menu-item>
            </el-sub-menu>
          </template>
          <!-- 如果有 items，则直接渲染 items -->
          <template v-if="menu.items">
            <el-menu-item v-for="item in menu.items" :key="item.index" :index="item.index">{{ item.title
            }}</el-menu-item>
          </template>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElScrollbar, ElMenu, ElSubMenu, ElMenuItem, ElMenuItemGroup, ElIcon } from 'element-plus';
import { findMenuTitleByIndex, findParentTitleByIndex } from '@/utils/dataOption/menuOpt';
import { defineProps, onMounted, computed } from 'vue';
import { useMenuStore } from '@/store/menu';
import router from '@/router';

const menuStore: any = useMenuStore();
const menus = menuStore.menus;   // 菜单数据
// 用计算属性保证activeIndex和menuStore.activeIndex同步
const activeIndex = computed(() => menuStore.activeIndex);
defineProps({
  // 是否折叠
  isCollapsed: { type: Boolean, required: false }
});
// 点击菜单获取菜单名称，并传递给父组件
const emits = defineEmits(['menuTitleClick', 'menuTagClick']);

// 选择菜单
const handleSelect = (index: string) => {
  if (!index) return; // 如果index为空，则不执行后续操作

  // 获取目录名称
  const { path, title, icon } = findMenuTitleByIndex(menus, index);
  console.log('目录名称:', title, '图标:', icon);

  // 检查路由是否存在
  const resolved = router.resolve({ path: index });
  if (resolved.matched.length > 0) {
    // 更新 Pinia store 中的 activeIndex
    menuStore.setActiveIndex(index);
    // 获取上一级菜单的标题
    const parentTitle = findParentTitleByIndex(menus, path);
    // console.log('上一级菜单title:', parentTitle);
    // 通过事件传递目录名称
    if (title || icon) {
      emits('menuTitleClick', { title, parentTitle });
    }
    // console.log('activeIndex', menuStore.activeIndex);
    router.push(index);
    const tag = { title, path: index, icon, active: true };
    // 把选中的菜单项添加到 selectedMenuTags 中
    menuStore.pushSelectedMenuTag(tag);
    emits('menuTagClick', tag);  // 新增：通知父组件
  } else {
    ElMessage.error('路由不存在，请检查路径是否正确！');
    // 不做 router.push 和 activeIndex 变更，保持当前选中项不变
    const activeIndex = menuStore.getActiveIndex();
    // console.log('当前菜单:', activeIndex);
    // 通过事件传递目录名称，只在 path 与 activeIndex 一致时传递 title
    const parentTitle = findParentTitleByIndex(menus, activeIndex);
    // console.log('上一级菜单title:', parentTitle);
    if (path === activeIndex && (title || icon)) {
      emits('menuTitleClick', { title, parentTitle });
    };
  }
};

// 组件挂载时初始化
onMounted(() => {
  if (!menuStore.activeIndex || menuStore.activeIndex === '') {
    menuStore.setActiveIndex('/manage/test/table');  // 设置默认选中项
    const parentTitle = findParentTitleByIndex(menus, '/manage/test/table');
    emits('menuTitleClick', { title: "表格测试", parentTitle });
    menuStore.pushSelectedMenuTag({ title: '表格测试', path: '/manage/test/table', active: true });
    router.push('/manage/test/table');
  }
  const { title } = findMenuTitleByIndex(menus, menuStore.activeIndex);
  const parentTitle = findParentTitleByIndex(menus, menuStore.activeIndex);
  emits('menuTitleClick', { title, parentTitle });
  router.push(menuStore.activeIndex);
});
</script>

<style lang="scss" scoped>
.el-menu {
  border: 0 !important;
}

.el-menu-vertical {
  border: 0 !important;
}
</style>
