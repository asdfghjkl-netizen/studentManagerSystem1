<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">请选择或创建新的班级</el-header>
      <el-main>
        <div class="content">
          <div class="main-header">
            <el-switch v-model="music" active-text="音乐：on" inactive-text="音乐：off"></el-switch>
            <el-select v-model="selectedClass" placeholder="班级：">
              <el-option label="班级1" value="1"></el-option>
              <el-option label="班级2" value="2"></el-option>
            </el-select>
          </div>
          <div class="buttons">
            <TooltipButton element-name="button" btn-type="success" btn-plain @click="handleManage">
              <template #content>
                <span>需要管理员权限<br />点击进入管理界面<br />能够修改学生信息</span>
              </template>设置管理
            </TooltipButton>
            <el-button type="primary" @click="handleMidExam">期中考</el-button>
            <el-button type="primary" @click="handleFinalExam">期末考</el-button>
            <el-button type="primary" @click="handleToSeat">进入座位表</el-button>
            <el-button type="primary" @click="handleDraw">抽签</el-button>
            <el-radio-group v-model="lang" @change="changeLang($event as any)" class="radio-group">
              <el-radio value="1" size="default" border>中文</el-radio>
              <el-radio value="2" size="default" border>英文</el-radio>
            </el-radio-group>
          </div>
        </div>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import TooltipButton from '@/components/TooltipButton.vue';
import { useMenuStore } from '@/store/menu';
import { useConfig } from "@/store/config";
import router from '@/router';
import { ref } from 'vue';

const menuStore = useMenuStore();
const config: any = useConfig();
const music = ref(true);   // 音乐开关
const selectedClass = ref(''); // 选择班级
// 语言切换 1 中文 2 英文
const lang = ref(config.lang)

// 切换语言
const changeLang = (event: any) => config.changeGlobalLang(event);

// 跳转座位界面
const handleToSeat = () => router.push("/seatData");

// 跳转管理员界面
const handleManage = () => {
  // TODO 判断是否有权限

  // 判断 activeIndex 是否为空
  if (menuStore.activeIndex === "") {
    router.push("/manage");  // 默认管理界面
  } else {
    router.push(menuStore.activeIndex);  // 有 activeIndex 则跳转到 activeIndex
  }
}

// 点击期中考
const handleMidExam = () => {
  console.log('期中考');
};

// 点击期末考
const handleFinalExam = () => {
  console.log('期末考');
};

// 点击抽签
const handleDraw = () => {
  console.log('抽签');
}; 
</script>

<style lang="scss" scoped>
.common-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;

  //   background-image: url('@/assets/images/background.png');
  .header {
    text-align: center;
    font-weight: bold;
    text-transform: uppercase;
    height: 100px;
    font-size: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    letter-spacing: 10px;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-size: cover;

    .main-header {
      display: flex;
      justify-content: space-between;
      width: 80%;
      margin-bottom: 20px;
    }

    .buttons {
      display: flex;
      justify-content: space-around;
      width: 80%;
    }
  }
}

.radio-group {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
