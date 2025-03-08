<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">请选择或创建新的班级</el-header>
      <el-main>
        <div class="content">
          <div class="main-header">
            <el-switch v-model="music" active-text="音乐：on" inactive-text="音乐：off"></el-switch>
            <div class="class-select-group">
              <h3>班级：</h3>
              <el-select v-model="selectedClass" @change="handleSelectClass" placeholder="请选择班级：">
                <el-option v-for="item in classList" :key="item.value" :label="item.label" :value="item.label" />
              </el-select>
              <TooltipButton tip-placement="top" element-name="button" btn-type="primary" btn-plain
                @click="isSelectClass">
                <template #content>
                  <span>需要管理员权限<br />点击进入管理界面<br />能够修改学生信息</span>
                </template>确定选择？
              </TooltipButton>
            </div>
          </div>
          <div class="buttons">
            <TooltipButton element-name="button" btn-type="success" btn-plain @click="handleToManage">
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
          <div class="buttons">
            <el-button type="primary" @click="handleToCeate">创建新的班级</el-button>
          </div>
        </div>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { handleManage } from '@/utils/dataOption/routerOpt';
import TooltipButton from '@/components/TooltipButton.vue';
import { useConfig } from "@/store/globalConfig";
import { useDataOptions } from "@/store/dataOptions";
import router from '@/router';
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';

const dataOptionsStore = useDataOptions();
const configStore = useConfig();
const music = ref(false);   // 音乐开关
const selectedClass = ref(''); // 选择班级
const classList = reactive([
  {
    label: '班级12',
    value: 1
  },
  {
    label: '班级34',
    value: 2
  }
]); // 班级列表
// 语言切换 1 中文 2 英文
const lang = ref(configStore.lang);

// 切换语言
const changeLang = (event: any) => configStore.changeGlobalLang(event);

// 跳转创建班级界面
const handleToCeate = () => router.push("/createClass");

// 跳转座位界面
const handleToSeat = () => router.push("/seatData");

// 跳转管理员界面
const handleToManage = () => handleManage();

// 选择班级
const handleSelectClass = () => {
  ElMessage.success('确定选择班级：' + selectedClass.value);
};

// 确定选择班级
const isSelectClass = () => {
  dataOptionsStore.setSelectClass(selectedClass.value);
  ElMessage.success('已确定选择班级：' + selectedClass.value);
};

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
      // justify-content: space-between;
      width: 80%;
      align-items: center;
      margin-bottom: 20px;
      gap: 20px;
      justify-content: center;

      .class-select-group {
        display: flex;
        align-items: center;
        gap: 10px;

        h3 {
          white-space: nowrap;
          margin: 0;
        }

        .el-select {
          width: 300px;
        }
      }
    }

    .buttons {
      display: flex;
      justify-content: space-around;
      width: 80%;
      margin-top: 20px;

      .radio-group {
        display: flex;
        justify-content: center;

        .el-radio {
          margin-right: 0;
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
