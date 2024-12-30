<template>
  <el-config-provider :locale="locale" :message="config" :button="btn">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus';
import { en, zhCn } from 'element-plus/es/locale';
import { computed, reactive, ref } from 'vue';

const language = ref('zh-cn'); // 设置语言包
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en));
// 设置提示信息
const config = reactive({
  max: 1,
});
// 设置按钮
const btn = reactive({
  autoInsertSpace: true,
});
</script>
