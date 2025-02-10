<template>
  <el-config-provider :locale="configStore.locale" :message="config" :button="btn">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { translate } from "../translations/translator";
import { reactive, onMounted, onBeforeMount } from 'vue';
import { getFileList } from "@/utils/api/apiPromiss";
import { useConfig } from '@/store/config';

const configStore = useConfig();
// 设置提示信息
const config = reactive({
  max: 2,
});
// 设置按钮
const btn = reactive({
  autoInsertSpace: true,
});

onMounted(() => {
  getFileList().then(res => { console.log(res); });
  // console.log("APP_CONFIG_SECRET", process.env.APP_CONFIG_SECRET);
  console.log(translate('你好')); // 输出: Hello
  console.log(translate('谢谢')); // 输出: Thank you
  // 英译中
  console.log(translate('Goodbye')); // 输出: 再见
  console.log(translate('Thank you')); // 输出: 谢谢
});
onBeforeMount(() => {
  console.log("window.globalConfig", window.globalConfig);
  configStore.setIpConfig(window.globalConfig);
});
</script>
