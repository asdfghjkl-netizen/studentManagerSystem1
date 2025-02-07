<template>
  <!-- 在 @/utils/dataOption/ElementOpt 有 :locale="locale" 的配置项 -->
  <el-config-provider :locale="configStore.locale" :message="config" :button="btn">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus';
import { reactive, onMounted } from 'vue';
import { getFileList } from "@/utils/api/apiPromiss";
import { useConfig } from '@/store/config';

const configStore: any = useConfig();
// 设置提示信息
const config = reactive({
  max: 2,
});
// 设置按钮
const btn = reactive({
  autoInsertSpace: true,
});

onMounted(() => {
  getFileList().then(res => { console.log(res) })
});
</script>
