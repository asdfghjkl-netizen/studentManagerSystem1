<template>
  <div class="common-layout">
    <div ref="container" class="layout-container-demo">
      <el-container>
        <el-aside style="background-color: #545c64;" :width="isMenuCollapsed ? '64px' : '210px'">
          <MenuData :is-collapsed="isMenuCollapsed" />
        </el-aside>
        <el-container>
          <el-header>
            <div class="header-content">
              <div class="left-section">
                <el-button type="primary" class="collapse-btn" @click="toggleCollapse">
                  <el-icon>
                    <Menu />
                  </el-icon>
                </el-button>
                <el-breadcrumb separator="/">
                  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                  <el-breadcrumb-item :to="{ path: '/seatData' }">座位表</el-breadcrumb-item>
                  <el-breadcrumb-item>{{ currentRoute }}</el-breadcrumb-item>
                </el-breadcrumb>
              </div>
              <div class="center-section">
                <h2 class="system-title">后台管理系统</h2>
              </div>
              <div class="right-section">
                <el-dropdown trigger="hover" placement="bottom">
                  <div class="user-info">
                    <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                    <span class="username">管理员</span>
                    <el-icon class="el-icon--right">
                      <arrow-down />
                    </el-icon>
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="handleProfile">个人信息</el-dropdown-item>
                      <el-dropdown-item @click="handleSettings">系统设置</el-dropdown-item>
                      <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
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
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Menu, ArrowDown, House, Setting, List } from '@element-plus/icons-vue';
import MenuData from './Layout/Aside/Menu.vue';
import { ElMessage } from 'element-plus';
import { Component } from 'vue';

const isMenuCollapsed = ref(false);
const route = useRoute();

// 计算当前路由名称
const currentRoute = computed(() => {
  return route.meta.title || route.name || '未知页面';
});

// 菜单折叠切换
const toggleCollapse = () => {
  isMenuCollapsed.value = !isMenuCollapsed.value;
};

// 用户操作处理函数
const handleProfile = () => {
  console.log('查看个人信息');
};

const handleSettings = () => {
  console.log('打开系统设置');
};

const handleLogout = () => {
  console.log('退出登录');
};

// 添加接口定义
interface TagItem {
  title: string;
  path: string;
  icon: Component;
  active: boolean;
}

// 默认标签页数据
const defaultTags = ref([
  {
    title: '首页',
    path: '/dashboard',
    icon: House,
    active: true
  },
  {
    title: '系统设置',
    path: '/settings',
    icon: Setting,
    active: false
  },
  {
    title: '用户列表',
    path: '/users',
    icon: List,
    active: false
  }
]);

// 标签点击事件
const handleClick = (tag: TagItem) => {
  defaultTags.value.forEach(item => {
    item.active = item.path === tag.path;
  });
  console.log('切换到:', tag.title);
};

// 关闭标签事件
const handleClose = (tag: TagItem) => {
  const tags = defaultTags.value;
  
  if (tags.length <= 1) {
    return ElMessage.warning('最后一个标签不能关闭');
  }
  
  const index = tags.findIndex(item => item.path === tag.path);
  tags.splice(index, 1);
  
  if (tag.active) {
    handleClick(tags[index - 1] || tags[index]);
  }
};
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

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;

  .left-section {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 20px;

    .collapse-btn {
      padding: 6px;
      height: 32px;
    }

    .el-breadcrumb {
      margin-left: 8px;
      font-size: 16px;

      &__inner {
        cursor: pointer;
      }
    }
  }

  .center-section {
    flex: 1;
    display: flex;
    justify-content: center;
    
    .system-title {
      margin: 0;
      font-size: 25px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      white-space: nowrap;
    }
  }

  .right-section {
    flex: 1;
    display: flex;
    justify-content: flex-end;

    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 5px 12px;
      border-radius: 4px;
      transition: background-color 0.3s;

      &:hover {
        background-color: var(--el-color-primary-light-9);
      }

      .username {
        margin: 0 8px;
        font-size: 14px;
        color: var(--el-text-color-primary);
      }
    }
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

// 全局样式
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.common-layout {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 2.5vh);
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
