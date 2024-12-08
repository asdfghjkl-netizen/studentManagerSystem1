<template>
  <!--  右边部分  -->
  <div class="student-info-right">
    <!--  小组情况  -->
    <div class="student-team">
      <div class="stdent-team-name">
        <h1>第{{ teamId }}团队：</h1>
      </div>
      <div class="stdent-team-source">
        <h2>
          <span style="margin-right: 35px;">小组总分 {{ teamTotalScoreAll }}分</span>
          <div style="width: 200px; position: absolute; left: 510px; top: 125px;">
            <div style="margin-bottom: 10px;">团队得分 {{ teamScore }}分</div>
            <div>成员得分 {{ teamMemberScore }}分</div>
          </div>
        </h2>
      </div>
    </div>
    <div class="datetime datetime-title">今日日期：<span class="datetime">{{ dateTime }}</span></div>
    <!--  学习表现  -->
    <div class="study">
      <tr>
        <td>学习表现：</td>
        <td>
          <el-select v-model="selectStudyStatus" placeholder="Select" @change="handleChangeValue" style="width: 250px">
            <el-option v-for="item in studyStatus" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </td>
      </tr>
    </div>
    <!--  其他  -->
    <div class="other" style="margin-left: 36px;">
      <tr>
        <td>其他：</td>
        <td>
          <!-- @change="changeOtherStatus" -->
          <el-input v-model="otherStatus" style="width: 250px" clearable :disabled="selectStudyStatus != 5" />
        </td>
      </tr>
    </div>
    <!--  得分  -->
    <div class="source" style="margin-left: 36px;">
      <tr>
        <td>得分：</td>
        <td>
          <el-input-number v-model="score" />
          <span class="fen">分</span>
        </td>
      </tr>
    </div>
    <el-button type="primary" style="width: 100%;" @click.prevent="submit">提交</el-button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, defineProps, reactive, watch, watchEffect } from "vue";
import { ElMessage } from "element-plus";
import { getDateTime } from "@/utils/dateTime";

// 获取时间数据
const dateTime = ref("");
// 定义学生课程状态列表
const studyStatus = reactive([
  {
    value: 1,
    label: '完成任务',
  }, {
    value: 2,
    label: '上台展示',
  }, {
    value: 3,
    label: '自创项目',
  }, {
    value: 4,
    label: '表现优秀',
  }, {
    value: 5,
    label: '其他',
  },
])
// 定义选择器
const selectStudyStatus = ref(1);
// 定义数字输入框的数据
const score = ref(0);
// 定义字符输入框输入的数据
const otherStatus = ref("");
// 提取studyStatus的字符串
const studyStatusString = ref("");
// 定义团队学习状态
// const teamStatus = ref([]);
// 获取组分数
const teamMemberScore = ref(0);
// 获取小组总分数
const teamTotalScoreAll = ref(0);

// 接收父组件传递过来的数据  const props = 
defineProps({
  teamId: { type: String, default: "" },
  isStudent: { type: Boolean, default: false },
})

// 课程状态的字符提取
const handleChangeValue = (index: any) => {
  // 如果选着的状态为 14：其他 ， 课程状态应为字符输入框输入的数据
  if (studyStatus[index - 1].label != "其他") {
    studyStatusString.value = studyStatus[index - 1].label;
  } else {
    watch(otherStatus, () => { studyStatusString.value = otherStatus.value })
  }
}

// 提交事件
const submit = async () => {
  try {
    ElMessage.success({ message: '提交成功', duration: 1000 });
  } catch (error) {
    ElMessage.error({ message: '读取失败' + error, duration: 1000 });
  }
}

watchEffect(() => {})

let timer;
watch(
  () => true,
  () => {
    getDateTime().then(res => { dateTime.value = res })
    timer = setInterval(() => {
      getDateTime().then(res => { dateTime.value = res })
    }, 1000); // 每秒更新一次
    return () => { clearInterval(timer) };
  }, { immediate: true, flush: 'post' }
)
onMounted(() => { handleChangeValue(selectStudyStatus.value) });
</script>

<style scoped lang="scss">
.student-info-right {
  padding-left: 20px;
  margin-bottom: 20px;

  .datetime-title {
    font-size: 18px;
    margin-top: 40px;
    margin-bottom: 15px;
  }

  .study {
    font-size: 18px;
    margin-bottom: 15px;
  }

  .other {
    font-size: 18px;
    margin-bottom: 15px;
  }

  .source {
    font-size: 18px;
    margin-bottom: 15px;

    .fen {
      margin-left: 5px;
    }
  }
}

.stdent-team-name h1 {
  font-weight: 500;
}

.stdent-team-source h2 {
  font-weight: 500;
}
</style>
