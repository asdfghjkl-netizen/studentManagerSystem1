<template>
  <div class="common-layout">
    <div ref="container" class="layout-container-demo">
      <el-container>
        <el-aside style="background-color: #545c64;" :width="isMenuCollapsed ? '64px' : '210px'">
          <MenuData :is-collapsed="isMenuCollapsed" />
        </el-aside>
        <el-container>
          <el-header>
            <MainHeader @click-collapse="isMenuCollapsed = !isMenuCollapsed" />
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
import MainHeader from '@/views/Manager/Layout/Header/Header.vue';
import { House, Setting, List } from '@element-plus/icons-vue';
import MenuData from '@/views/Manager/Layout/Aside/Menu.vue';
import { ElMessage } from 'element-plus';
import { ref, Component } from 'vue';

const isMenuCollapsed = ref(false);  // is menu collapsed

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
