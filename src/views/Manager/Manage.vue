<template>
  <div class="container-demo common-layout">
    <el-page-header @back="handleToLast">
      <template #breadcrumb>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/seatData' }">座位表</el-breadcrumb-item>
          <el-breadcrumb-item>此位置</el-breadcrumb-item>
        </el-breadcrumb>
      </template>
      <template #content>
        <div class="flex items-center">
          <el-avatar class="mr-3" :size="32"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <span class="text-large font-600 mr-3"> Title </span>
          <span class="text-sm mr-2" style="color: var(--el-text-color-regular)">
            Sub title
          </span>
          <el-tag>Default</el-tag>
        </div>
      </template>
      <template #extra>
        <div class="flex items-center">
          <el-button>Print</el-button>
          <el-button type="primary" class="ml-2">Edit</el-button>
        </div>
      </template>
    </el-page-header>
    <el-divider />

    <el-container class="layout-container-demo">
      <el-aside width="200px">
        <MenuData />
      </el-aside>
      <el-container>
        <el-header></el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import MenuData from './Layout/Aside/Menu.vue';
import router from '@/router';

// 返回上一个页面
const handleToLast = () => {
  // console.log('handleToLast',window.history );
  window.history.length > 1 ? router.go(-1) : router.push('/');
}
</script>

<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 15px 0;
}

.el-breadcrumb__inner {
  cursor: pointer;
}

.el-breadcrumb {
  font-size: 16px;
}

.common-layout {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 15px;
}

.el-container {
  height: 100%;
}

.layout-container-demo,
.container-demo {
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-container-demo .el-main {
  padding: 0;
}

.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}

.page-scroll {
  height: 100%;
}

.page-scroll .el-scrollbar__wrap {
  overflow-x: hidden;
}

.el-aside::-webkit-scrollbar,
.el-main::-webkit-scrollbar {
  display: none;
}
</style>
