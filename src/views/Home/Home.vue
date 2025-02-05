<template>
  <div class="home-container">
    <el-button type="primary" @click="handleToSeat" class="button">进入seat界面</el-button>
    <el-tooltip placement="top" :visible="visible">
      <template #content>
        <span>需要管理员权限<br />点击进入管理界面<br />能够修改学生信息</span>
      </template>
      <el-button type="success" plain @click="handleToManage" @mouseenter="visible = true" @mouseleave="visible = false"
        class="button">进入管理界面</el-button>
    </el-tooltip>
    <el-radio-group v-model="lang" @change="changeLang($event as any)" class="radio-group">
      <el-radio value="1" size="default" border>中文</el-radio>
      <el-radio value="2" size="default" border>英文</el-radio>
    </el-radio-group>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { ref } from 'vue';
import { useConfig } from "@/store/config";
import { useMenuStore } from '@/store/menu';

const menuStore = useMenuStore();
const config: any = useConfig();
const visible = ref(false)  // 显示导入文件弹窗
// 语言切换 1 中文 2 英文
const lang = ref(config.lang)

// 跳转座位界面
const handleToSeat = () => router.push("/seatData");

// 跳转管理员界面
const handleToManage = () => {
  // TODO 判断是否有权限

  // 判断 activeIndex 是否为空
  if (menuStore.activeIndex === "") {
    router.push("/manage");  // 默认管理界面
  } else {
    router.push(menuStore.activeIndex);  // 有 activeIndex 则跳转到 activeIndex
  }
}

// 切换语言
const changeLang = (event: any) => config.changeGlobalLang(event);
</script>

<style lang="scss" scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;  // 减少内边距
  height: 100%;
  max-width: 100vw;  // 限制最大宽度
  box-sizing: border-box;
  overflow: auto;  // 确保内容不会超出
}

.button {
  margin: 10px 0;
}

.radio-group {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
