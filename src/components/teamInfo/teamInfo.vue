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
          <span style="margin-right: 35px;">小组总分 {{ teamScore + teamMemberScore }}分</span>
          <div style="width: 150px; position: absolute; left: 510px; top: 125px;">
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
          <el-input v-model="otherStatus" style="width: 240px" clearable :disabled="selectStudyStatus != 5" />
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
    <el-button type="primary" style="width: 100%;" @click="submit">提交</el-button>
  </div>
</template>

<script lang="ts" setup>
import { importExcelFile } from "@/store/excelOptions";
import { onMounted, ref, defineProps, reactive, computed, watch, watchEffect } from "vue";
import ExcelJS from "exceljs";
import { ElMessage } from "element-plus";
import * as FileSaver from "file-saver";
import { getDateTime } from "@/utils/dateTime"
import { getTeamInfo, getStudentsInfo } from "@/utils/getTableData";
import { getMemberforTeam } from "@/utils/getTeamMember";

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
// 每个组成员的分数（组）
const teamMemberScores = ref();
// 获取组分数
const teamMemberScore = ref(0);

// 接收父组件传递过来的studentName
const props = defineProps({
  teamId: { type: String, default: "" },
})

// 获取组员数据
const getTeamMemberScore = () => {
  getMemberforTeam().then(res => {
    // 扁平化数组
    const flat = res.flat();
    // 获取学生信息
    getStudentsInfo(flat, res).then(res => {
      // console.log("res", res);
      teamMemberScores.value = res.totalScore;
      // console.log(teamMemberScore.value);
      setInterval(() => {
        const obj = new Proxy(teamMemberScores.value, {
          get(target, prop, receiver) {
            // 实现获取属性时的行为
            return Reflect.get(target, prop, receiver);
          },
          set(target, prop, value, receiver) {
            // 实现设置属性时的行为
            return Reflect.set(target, prop, value, receiver);
          }
        });
        for (let key in obj) {
          if (props.teamId === key) {
            // console.log(`Key: ${key}, Value: ${obj[key]}`);
            teamMemberScore.value = obj[key];
          }
        }
      }, 100);
    });
  })
}

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
const submit = () => {
  // 定义团队名称
  let teamId = "第" + props.teamId + "组";
  //创建Workbook实例
  const workbook = new ExcelJS.Workbook();
  // 使用FileReader对象来读取文件内容
  const fileReader = new FileReader()
  // 二进制字符串的形式加载文件  文件信息存储在pinia中
  fileReader.readAsArrayBuffer(importFile.files[0])

  fileReader.onload = ev => {
    // 从 buffer中加载数据解析
    workbook.xlsx.load(ev.target.result as ArrayBuffer).then(workbook => {
      // 获取第一个worksheet内容（学生信息表）
      let worksheet = workbook.getWorksheet(teamId)
      // 创建要写入的数据
      const data = [
        { dateTime: dateTime.value, studyStatus: studyStatusString.value, score: score.value },
      ];
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
        ElMessage.success('提交成功')
      } if (worksheet) {
        /**
         * 有两行数据:
         * 时间	                钟雯靖学习表现	得分
         *  2024-09-2814:32:07	回答问题	      6
         *  现在要在下一行逐行添加新的数据，如何用exceljs来写 
         */
        // 1. 获取最后一行的行号，
        let lastRowNumber = worksheet.lastRow.number;
        // 再根据行号获取最后一行的数据
        worksheet.addRow(lastRowNumber + 1).values = [dateTime.value, studyStatusString.value, score.value];
        ElMessage.success('数据已更新');
      }
      // 保存工作表到excel文件buffer  writeBuffer
      workbook.xlsx.writeBuffer().then((buffer) => {
        // 创建一个Blob对象
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        // // 创建一个a标签
        // const a = document.createElement('a')
        // // 创建一个URL对象
        // const url = URL.createObjectURL(blob)
        // // 设置a标签的href属性为URL对象
        // a.href = url
        // // 设置a标签的download属性为文件名
        // a.download = '学生信息表.xlsx'
        // // 模拟点击a标签
        // a.click()
        // // 释放URL对象
        // URL.revokeObjectURL(url)
        // 定义文件的路径
        const fileName = importFile.files[0].name;
        // 保存文件
        FileSaver.saveAs(blob, fileName);
        ElMessage.success("保存成功")
      }).catch(err => {
        ElMessage.error("保存失败", err)
      })
    }).catch(err => {
      ElMessage.error("读取失败", err)
    })
  }
}

watchEffect(() => {
  getTeamMemberScore();
  getDateTime().then(res => { dateTime.value = res });
  getTeamInfo(props.teamId).then(res => { teamStatus.value = res })
  teamScore.value;
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
