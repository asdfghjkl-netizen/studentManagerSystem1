<template>
  <div>
    <el-button type="primary" @click="downloadApp">下载桌面端</el-button>
    <el-button type="primary" @click=""></el-button>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElButton } from 'element-plus';
import { downloadDesktopApp } from '@/utils/api/apiPromiss';

// 下载桌面端
const downloadApp = () => {
  downloadDesktopApp().then((response: any) => {
    console.log('Download response:', response);

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Seat Setup.exe');
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url); // 释放内存
  }).catch((error) => {
    console.error('Download error:', error);
  });
}
</script>

<style scoped></style>