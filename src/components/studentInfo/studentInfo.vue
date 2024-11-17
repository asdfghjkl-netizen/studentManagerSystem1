<template>
  <!--  右边部分  -->
  <div class="student-info-right">
    <!--  小组情况  -->
    <div class="student-team">
      <div class="stdent-team-name">
        <h1>
          第{{ getTeamId }}团队{{ isLeaderorMember }}：{{ studentName }}
        </h1>
      </div>
      <div class="stdent-team-source">
        <h2>
          <span style="margin-right: 40px;">小组得分 {{ totalTeamScore }}分</span>
          <span>个人贡献 {{ memberScore }}分</span>
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
import { importExcelFile } from "@/store/excelOptions";
import { onMounted, ref, defineProps, reactive, computed, watch, watchEffect } from "vue";
import ExcelJS from "exceljs";
import { getTeamIdforMember } from "@/utils/getTeamMember";
import { ElMessage } from "element-plus";
import { studentInfo } from "@/utils/dataOption/getTableData";
import { saveExcel, changeSorceforExcelData } from "@/utils/dataOption/saveExcel";
import { teamMembersScore, getTeamTotalScore } from "@/utils/dataOption/getScore";

// 小组得分（总）
const totalTeamScore = ref(0);
// 创建一个pinia实例, getTeamInfo
const importFile = importExcelFile();
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
const studentStatus = ref([]);
// 获取学生所在组队id
const getTeamId = ref("");

const props = defineProps({
  studentName: { type: String, default: "" },
  teamList: { type: Array, default: () => [] },
  isStudent: { type: Boolean, default: true },
})

// 判断是否为组员或组长
const isLeaderorMember = computed(() => {
  const isTeamLeader = ref("");
  importFile.teamLeaders.includes(props.studentName) ? isTeamLeader.value = "组长" : isTeamLeader.value = "组员"
  return isTeamLeader.value;
})

// 计算每个组员总分
const memberScore = computed(() => {
  let totalScore = 0;
  totalScore = studentStatus.value?.reduce((acc, cur) => {
    return acc + cur.score;
  }, 0) || 0;
  return totalScore;
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
  //创建Workbook实例
  const workbook = new ExcelJS.Workbook();

  try {
    // 从 buffer中加载数据解析
    await workbook.xlsx.load(importFile.buffer.data);

    let worksheet = workbook.getWorksheet(props.studentName);
    // 创建要写入的数据
    const data = [{
      dateTime: dateTime.value,
      studyStatus: studyStatusString.value,
      score: score.value
    }];

    // 判断当前学生是否已存在，如果不存在，则创建新的工作表并添加数据；否则在原有工作表中添加数据
    if (!worksheet) {
      let stuWorkSheet = workbook.addWorksheet(props.studentName);
      // 添加表头
      stuWorkSheet.columns = [
        { header: "时间", key: "dateTime", width: 25 },
        { header: props.studentName + '学习表现', key: "studyStatus", width: 20 },
        { header: "得分", key: "score", width: 10 },
      ];
      // 设置表头居中 和 加粗
      stuWorkSheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
      stuWorkSheet.getRow(1).font = { bold: true };
      // 写入数据
      stuWorkSheet.addRows(data);
    } else {
      // 1. 获取最后一行的行号，
      let lastRowNumber = worksheet.lastRow.number;
      // 再根据行号获取最后一行的数据 
      worksheet.addRow(lastRowNumber + 1).values = [
        dateTime.value,
        studyStatusString.value,
        score.value
      ];
    }

    // 更改excel文件中的小组工作表中的分数数据
    let teamWorkSheet = workbook.getWorksheet("team");
    await changeSorceforExcelData(teamWorkSheet, getTeamId.value, {
      totalTeamScore: totalTeamScore.value + score.value
    }, score.value, null, props.isStudent, null);

    const buffer = await workbook.xlsx.writeBuffer();
    saveExcel(score, buffer);
  } catch (err) {
    ElMessage.error("读取失败", err);
  }
}

watchEffect(() => {
  getTeamIdforMember(props.studentName).then(res => { getTeamId.value = res })
  studentInfo(props.studentName).then(res => { studentStatus.value = res })
  getDateTime().then(res => { dateTime.value = res });
  // 获取组队信息
  getTeamTotalScore(getTeamId.value).then(teamTotalScore => {
    // console.log("resgetTeamTotalScore", teamTotalScore);
    // 组队成员学习状态
    teamMembersScore(getTeamId.value).then(teamMembersScore => {
      // console.log("resgetTeamId", teamMembersScore);
      totalTeamScore.value = teamMembersScore + teamTotalScore;
    })
  })
})
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
