<template>
  <div class="common-layout">
    <div ref="container" class="layout-container-demo">
      <el-container>
        <el-aside style="background-color: #545c64;" :width="isMenuCollapsed ? '64px' : '210px'">
          <MenuData :is-collapsed="isMenuCollapsed" @menu-title-click="handleMenuTitleClick"
            @menu-tag-click="handleClick" />
        </el-aside>
        <el-container>
          <el-header>
            <MainHeader :menu-name="menuName" @click-collapse="isMenuCollapsed = !isMenuCollapsed" />
          </el-header>
          <el-main>
            <div class="main-container">
              <div class="tabs-view-container">
                <el-scrollbar class="tabs-view" horizontal>
                  <div class="tabs-wrapper">
                    <el-tag v-for="tag in defaultTags" :key="tag.path" :class="{ 'active-tag': tag.active }" closable
                      :disable-transitions="false" @close="handleClose(tag)" @click="handleClick(tag)">
                      <el-icon class="tag-icon">
                        <component :is="tag.icon" />
                      </el-icon>
                      {{ tag.title }}
                    </el-tag>
                  </div>
                </el-scrollbar>
              </div>
              <div class="content-container">
                <router-view />
              </div>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElScrollbar, ElContainer, ElMain, ElAside, ElHeader, ElTag, ElIcon } from 'element-plus';
import MainHeader from '@/views/Manager/Layout/Header/Header.vue';
import MenuData from '@/views/Manager/Layout/Aside/Menu.vue';
import { ref, watchEffect, watch, onMounted } from 'vue';
import { useMenuStore } from '@/store/menu';
import router from '@/router';

const isMenuCollapsed = ref(false);  // 侧边栏折叠状态
const menuName = ref('');            // 菜单名称
const menuStore = useMenuStore();
const menuTags = menuStore.selectedMenuTags; // 菜单标签数据

// 默认标签页数据
const defaultTags = ref([...menuTags]);

// 处理菜单标题点击事件
const handleMenuTitleClick = (menu: string) => {
  watchEffect(() => { menuName.value = menu });
};

// 标签点击事件  TODO： 进来时默认选中当前路由
const handleClick = (tag) => {
  // 设置标签页选中状态
  defaultTags.value.forEach(item => {
    // 把其他标签页设置为非选中状态
    if (item.path !== tag.path) {
      item.active = false;
    }
    item.active = item.path === tag.path;
  });
  // console.log('切换到:', tag.title);

  // 同步到菜单高亮
  if (tag.path !== '/') menuStore.setActiveIndex(tag.path);
  router.push(tag.path);
};

// 关闭标签事件
const handleClose = (tag) => {
  console.log('标签:', tag);
  // 首页标签不能关闭
  if (tag.path === '/') {
    return ElMessage.warning('首页标签不能关闭');
  }
  // 当前选中的标签不可关闭
  if (tag.active) {
    return ElMessage.warning('当前标签不能关闭');
  }

  menuStore.removeSelectedMenuTag(tag); // 从 store 中移除标签
};

// 监听路由变化，更新菜单名称
watch(() => menuStore.selectedMenuTags, // 监听 store 的响应式属性
  (newTags) => {
    defaultTags.value = [...newTags];
  },
  { immediate: true, deep: true }   // 立即执行，深度监听
);

onMounted(() => {
  defaultTags.value.forEach(item => {
    // 把标签页设置为非选中状态
    item.active = false;
    item.active = item.path === menuStore.activeIndex;
  });
});
</script>

<style lang="scss" scoped>
.layout-container-demo {
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;

  .el-header {
    position: relative;
    background-color: var(--el-color-primary-light-7);
    color: var(--el-text-color-primary);
  }

  .el-aside {
    color: var(--el-text-color-primary);
    background: var(--el-color-primary-light-8);
    transition: width 0.15s;
    -webkit-transition: width 0.15s;
    -moz-transition: width 0.15s;
    -o-transition: width 0.15s;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .el-main {
    padding: 0;
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .el-menu {
    border-right: none;
  }

  .toolbar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    right: 20px;
  }
}

.tabs-view-container {
  background-color: #fff;
  padding: 6px 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .tabs-view {
    .tabs-wrapper {
      padding: 0 10px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }

  .el-tag {
    cursor: pointer;
    height: 26px;
    line-height: 26px;
    border: 1px solid #d8dce5;
    color: #495060;
    background: #fff;
    padding: 0 8px;
    font-size: 12px;
    margin-right: 5px;
    display: flex;
    align-items: center;

    &:hover {
      background-color: #f5f7fa;
    }

    .tag-icon {
      margin-right: 4px;
      width: 12px;
      height: 12px;
    }

    &.active-tag {
      background-color: var(--el-color-primary);
      border-color: var(--el-color-primary);
      color: #fff;

      &:hover {
        background-color: var(--el-color-primary);
      }
    }
  }
}

.main-container {
  display: flex;
  flex-direction: column;
  height: 100%;

  .content-container {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background-color: #f0f2f5;
  }
}

.common-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
}

.el-container {
  height: 100%;
}

.page-scroll {
  height: 100%;

  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
