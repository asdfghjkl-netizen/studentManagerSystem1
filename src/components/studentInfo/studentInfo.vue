<template>
  <!--  右边部分  -->
  <div class="student-info-right">
    <!--  小组情况 {{ memberScore }} {{ isLeaderorMember }}-->
    <div class="student-team">
      <div class="stdent-team-name">
        <h1>
          第{{ getTeamId }}团队：{{ studentName }}
        </h1>
      </div>
      <div class="stdent-team-source">
        <h2>
          <span style="margin-right: 40px;">小组得分 {{ totalTeamScore }}分</span>
          <span>个人贡献 分</span>
        </h2>
      </div>
    </div>
    <div class="datetime datetime-title">今日日期：<span class="datetime">{{ dateTime }}</span></div>
    <!--  学习表现  -->
    <div class="study">
      <tr>
        <td>学习表现：</td>
        <td>
          <el-select v-model="selectStudyStatus" placeholder="Select" @change="handleChangeValue" style="width: 240px">
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
          <el-input v-model="otherStatus" style="width: 240px" clearable :disabled="selectStudyStatus != 14" />
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
import { getDateTime } from "@/utils/dateTime";
import { onMounted, ref, defineProps, reactive, watch, watchEffect } from "vue";
import { addStudentTableData } from "@/utils/api/DataOptions";
import { ElMessage } from "element-plus";

// 小组得分（总）
const totalTeamScore = ref(0);
// 获取时间数据
const dateTime = ref("");
// 定义学生课程状态列表
const studyStatus = reactive([
  {
    value: 1,
    label: '回答问题',
  }, {
    value: 2,
    label: '抢答',
  }, {
    value: 3,
    label: '帮忙完成任务',
  }, {
    value: 4,
    label: '上台展示',
  }, {
    value: 5,
    label: '超前学习',
  }, {
    value: 6,
    label: '自创项目',
  }, {
    value: 7,
    label: '作业优秀',
  }, {
    value: 8,
    label: '不按时完成作业',
  }, {
    value: 9,
    label: '睡觉',
  }, {
    value: 10,
    label: '讲话',
  }, {
    value: 11,
    label: '玩游戏',
  }, {
    value: 12,
    label: '玩手机',
  }, {
    value: 13,
    label: '开小差',
  }, {
    value: 14,
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
// 获取学生学习状态
// const studentStatus = ref([]);
// 获取学生所在组队id
const getTeamId = ref("");
const props = defineProps({
  studentName: { type: String, default: "" },
  teamList: { type: Array, default: () => [] },
  isStudent: { type: Boolean, default: true },
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
    const addData = await addStudentTableData({
      student: props.studentName,
      dateTime: dateTime.value,
      score: score.value,
      studyStatus: studyStatusString.value
    });
    console.log("addData", addData);

    ElMessage.success({ message: '提交成功', duration: 1000 });
  } catch (err) {
    ElMessage.error({ message: '读取失败' + err, duration: 1000 });
  }
}

watchEffect(() => { })

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
