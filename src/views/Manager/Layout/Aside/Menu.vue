<template>
  <div>
    <el-scrollbar>
      <el-menu class="el-menu-vertical" :default-active="activeIndex == '' ? route.path : activeIndex"
        :default-openeds="['4']" :collapse="isCollapsed" :collapse-transition="false" background-color="#545c64"
        text-color="#fff" active-text-color="#ffd04b" @select="handleSelect">
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
              <el-menu-item v-for="item in group.items" :key="item.index"
                :index="item.index">{{ item.title }}</el-menu-item>
            </el-menu-item-group>
          </template>
          <!-- 如果有 subMenus，则渲染 subMenus -->
          <template v-if="menu.subMenus">
            <el-sub-menu v-for="subMenu in menu.subMenus" :key="subMenu.index" :index="subMenu.index">
              <template #title>{{ subMenu.title }}</template>
              <el-menu-item v-for="item in subMenu.items" :key="item.index"
                :index="item.index">{{ item.title }}</el-menu-item>
            </el-sub-menu>
          </template>
          <!-- 如果有 items，则直接渲染 items -->
          <template v-if="menu.items">
            <el-menu-item v-for="item in menu.items" :key="item.index"
              :index="item.index">{{ item.title }}</el-menu-item>
          </template>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { ElMessage } from 'element-plus';
import { defineProps, ref, onMounted } from 'vue';
import { useMenuStore } from '@/store/menu';
import { useRoute } from 'vue-router';

const route = useRoute();
const menuStore: any = useMenuStore();
const menus = menuStore.menus;   // 菜单数据  , watch
const activeIndex = ref(menuStore.activeIndex);  // 当前激活的菜单项

defineProps({
  // 是否折叠
  isCollapsed: { type: Boolean, required: false }
});

// 选择菜单
const handleSelect = (index: string) => {
  if (!index) return; // 如果index为空，则不执行后续操作

  // 检查路由是否存在
  const resolved = router.resolve({ path: index });
  if (resolved.matched.length > 0) {
    router.push(index);
    // 更新 Pinia store 中的 activeIndex
    menuStore.setActiveIndex(index);
    // console.log('activeIndex', menuStore.activeIndex);
  } else {
    ElMessage.error('路由不存在，请检查路径是否正确！');
    menuStore.setActiveIndex('/manage/test/table');
    console.warn(`Route with path ${index} does not exist.`);
  }
};

// 组件挂载时初始化
onMounted(() => {
  if (!menuStore.activeIndex) {
    menuStore.setActiveIndex('/manage/test/table');
    router.push('/manage/test/table');
  }
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
