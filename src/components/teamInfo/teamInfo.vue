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
import { importExcelFile } from "@/store/excelOptions";
import { onMounted, ref, defineProps, reactive, computed, watch, watchEffect } from "vue";
import ExcelJS from "exceljs";
import { ElMessage } from "element-plus";
import { getDateTime } from "@/utils/dateTime";
import { getTeamInfo } from "@/utils/dataOption/getTableData";
import { saveExcel, changeSorceforExcelData } from "@/utils/dataOption/saveExcel";
import { teamMembersScore } from "@/utils/dataOption/getScore";

// 创建一个pinia实例
const importFile = importExcelFile();
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
const teamStatus = ref([]);
// 获取组分数
const teamMemberScore = ref(0);
// 获取小组总分数
const teamTotalScoreAll = ref(0);

// 接收父组件传递过来的studentName
const props = defineProps({
  teamId: { type: String, default: "" },
  isStudent: { type: Boolean, default: false },
})

// 计算该组团队分
const teamScore = computed(() => {
  let totalScore = 0;
  totalScore = teamStatus.value.reduce((acc, cur) => {
    return acc + cur.score;
  }, 0);
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
  let teamId = "第" + props.teamId + "组";
  //创建Workbook实例
  const workbook = new ExcelJS.Workbook();

  try {
    // 从 buffer中加载数据解析
    await workbook.xlsx.load(importFile.buffer.data);

    let worksheet = workbook.getWorksheet(teamId)
    // 创建要写入的数据
    const data = [{
      dateTime: dateTime.value,
      studyStatus: studyStatusString.value,
      score: score.value
    }];

    // 判断当前学生是否已存在，如果不存在，则创建新的工作表并添加数据；否则在原有工作表中添加数据
    if (!worksheet) {
      let stuWorkSheet = workbook.addWorksheet(teamId);
      // 添加表头
      stuWorkSheet.columns = [
        { header: "时间", key: "dateTime", width: 25 },
        { header: teamId + '学习表现', key: "studyStatus", width: 20 },
        { header: "得分", key: "score", width: 10 },
      ];
      // 设置表头居中 和加粗
      stuWorkSheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
      stuWorkSheet.getRow(1).font = { bold: true };
      // 写入数据
      stuWorkSheet.addRows(data);
    } if (worksheet) {
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
    await changeSorceforExcelData(teamWorkSheet, props.teamId, {
      teamScore: teamScore.value + score.value,
      totalTeamScore: teamTotalScoreAll.value + score.value,
      teamMemberScore: teamMemberScore.value
    }, score.value, null, props.isStudent, null);

    const buffer = await workbook.xlsx.writeBuffer();
    saveExcel({ score, otherStatus }, buffer);
  } catch (error) {
    ElMessage.error({ message: '读取失败' + error, duration: 1000 });
  }
}

watchEffect(() => {
  teamMembersScore(props.teamId).then(res => { teamMemberScore.value = res })
  getDateTime().then(res => { dateTime.value = res });
  getTeamInfo(props.teamId).then(res => { teamStatus.value = res })
  teamScore.value;
  teamTotalScoreAll.value = teamScore.value + teamMemberScore.value;
})
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
