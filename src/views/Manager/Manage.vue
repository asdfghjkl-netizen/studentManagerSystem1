<template>
  <div aria-label="A complete example of page header">
    <el-page-header @back="handleToLast">
      <template #breadcrumb>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/' }">座位表</el-breadcrumb-item>
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
  </div>
</template>

<script setup lang="ts">
import router from '@/router';

// 返回上一个页面
const handleToLast = () => {
  // console.log('handleToLast',window.history );
  window.history.length > 1 ? router.go(-1) : router.push('/');
}
</script>

<style scoped>
.el-breadcrumb__inner {
  cursor: pointer;
}
</style>
