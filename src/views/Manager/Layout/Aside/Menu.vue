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
import { defineProps, ref, onMounted, onBeforeMount, computed } from 'vue';
import { useMenuStore } from '@/store/menu';
import router from '@/router';

interface MenuItem {
  index: string;
  title: string;
  icon?: string;
  groups?: Array<{ title: string; items: MenuItem[] }>;
  subMenus?: Array<{ index: string; title: string; items: MenuItem[] }>;
  items?: MenuItem[];
}
interface MenuStore {
  menus: MenuItem[];
  activeIndex: string;
  setActiveIndex: (index: string) => void;
}

const menuStore: MenuStore = useMenuStore();
const menus = menuStore.menus;   // 菜单数据
// const activeIndex = ref(menuStore.activeIndex); 
// 用计算属性保证activeIndex和menuStore.activeIndex同步
const activeIndex = computed(() => menuStore.activeIndex);

defineProps({
  // 是否折叠
  isCollapsed: { type: Boolean, required: false }
});
// 点击菜单获取菜单名称，并传递给父组件
const emits = defineEmits(['menuTitleClick', 'menuTagClick']);

/**
 * 递归查找菜单项名称
 * @param menus 菜单数据数组
 * @param index 需要查找的菜单项 index
 * @returns 返回对应 index 的菜单项名称，未找到则返回 null
 */
function findMenuTitleByIndex(menus: MenuItem[], index: string) {
  for (const menu of menus) {
    // 如果当前菜单项的 index 匹配，返回其 title
    if (menu.index === index) return { title: menu.title, icon: menu.icon };
    // 如果有 groups，遍历每个 group
    if (menu.groups) {
      for (const group of menu.groups) {
        // 在 group.items 中查找 index 匹配的项，找到则返回其 title
        const found = group.items.find(item => item.index === index);
        if (found) return { title: found.title, icon: found.icon };
      }
    }
    // 如果有 subMenus，遍历每个 subMenu
    if (menu.subMenus) {
      for (const subMenu of menu.subMenus) {
        // 如果 subMenu 的 index 匹配，返回其 title
        if (subMenu.index === index) return { title: subMenu.title, icon: subMenu.icon };
        // 在 subMenu.items 中查找 index 匹配的项，找到则返回其 title
        const found = subMenu.items.find(item => item.index === index);
        if (found) return { title: found.title, icon: found.icon };
      }
    }
    // 如果有 items，遍历 items 查找 index 匹配的项，找到则返回其 title
    if (menu.items) {
      const found = menu.items.find(item => item.index === index);
      if (found) return { title: found.title, icon: found.icon };
    }
  }
  return null;
}

// 选择菜单
const handleSelect = (index: string) => {
  if (!index) return; // 如果index为空，则不执行后续操作

  // 获取目录名称
  const { title, icon } = findMenuTitleByIndex(menus, index);
  console.log('目录名称:', title, '图标:', icon);

  // 检查路由是否存在
  const resolved = router.resolve({ path: index });
  if (resolved.matched.length > 0) {
    // 更新 Pinia store 中的 activeIndex
    menuStore.setActiveIndex(index);
    // 通过事件传递目录名称
    if (title || icon) emits('menuTitleClick', title);
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
    console.log('当前菜单:', activeIndex);
    // 通过事件传递目录名称
    if (title || icon) emits('menuTitleClick', activeIndex);
  }
};

// 组件挂载时初始化
onMounted(() => {
  if (!menuStore.activeIndex) {
    menuStore.setActiveIndex('/manage/test/table');
    router.push('/manage/test/table');
  }
  router.push(menuStore.activeIndex);
});
// 组件加载前获取菜单名称
onBeforeMount(() => {
  emits('menuTitleClick', "表格测试");
  menuStore.pushSelectedMenuTag({ title: '表格测试', path: '/manage/test/table', active: true });
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
