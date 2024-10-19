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
    <el-button type="primary" style="width: 100%;" @click="submit">提交</el-button>
  </div>
</template>

<script lang="ts" setup>
import { getDateTime } from "@/utils/dateTime"
import { importExcelFile } from "@/store/excelOptions";
import { onMounted, ref, defineProps, reactive, computed, watch, watchEffect } from "vue";
import ExcelJS from "exceljs";
import { ElMessage } from "element-plus";
import * as FileSaver from "file-saver";
import { studentInfo, getTeamInfo, getStudentsInfo } from "@/utils/getTableData";
import { getMemberforTeam } from "@/utils/getTeamMember";

// 创建一个pinia实例
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

const props = defineProps({
  studentName: { type: String, default: "" },
  teamList: [] as any,
})

// 判断是否为组员或组长
const isLeaderorMember = computed(() => {
  const isTeamLeader = ref("");
  importFile.teamLeaders.includes(props.studentName) ? isTeamLeader.value = "组长" : isTeamLeader.value = "组员"
  return isTeamLeader.value;
})

// 获取组长的团队id
const getTeamIdforLeader = computed(() => {
  let teamId = "";
  // 遍历teamObjList数组
  for (let i = 0; i < importFile.teamLists.length; i++) {
    // 判断当前学生是否为该组中的组长
    if (importFile.teamLists[i].leader == props.studentName) {
      // 获取该组id
      teamId = importFile.teamLists[i].teamId;
    }
  }
  return teamId;
})

// 获取组员的团队id
const getTeamIdforMember = computed(() => {
  let teamId = "";
  // 遍历teamObjList数组
  for (let i = 0; i < importFile.teamLists.length; i++) {
    // 使用 split 方法按逗号分割字符串，并去除多余的空字符串，结果添加到数组里
    const member = importFile.teamLists[i].member.split('，').map(name => `'${name.trim()}'`).filter(name => name !== '');
    // member的结果为['李欣怡，陈伊锳，张雨欣']；
    // console.log("member", member);
    for (let j = 0; j < member.length; j++) {
      // memberItem为['李欣怡','陈伊彤','张雨欣']
      const memberItem = member[j].split("'").filter(name => name !== '').toString();
      // console.log("memberItem", memberItem);
      // 判断当前学生是否为该组中的组员
      if (memberItem == props.studentName) {
        // 获取该组id
        teamId = importFile.teamLists[i].teamId;
      }
    }
  }
  return teamId;
})

// 提取团队id（汇总）
const getTeamId = computed(() => {
  let getId = "";
  if (isLeaderorMember.value == "组长") {
    getId = getTeamIdforLeader.value;
  }
  if (isLeaderorMember.value == "组员") {
    getId = getTeamIdforMember.value;
  }
  return getId;
})

// 计算每个组员总分
const memberScore = computed(() => {
  let totalScore = 0;
  totalScore = studentStatus.value?.reduce((acc, cur) => {
    return acc + cur.score;
  }, 0) || 0;
  return totalScore;
})

// 定义团队分数
const teamScore = ref(0);
// 每个组成员的分数（组）
const teamMemberScores = ref();
// 定义团队队员分数总和
const teamMemberScore = ref(0);
// 小组得分（总）
const totalTeamScore = ref(0);
// 获取团队总分
const teamTotalScore = () => {
  // 获取组队信息
  getTeamInfo(getTeamId.value).then(res => {
    // console.log("res", res);
    if (res.length == 1) {
      teamScore.value = res[0].score;
    } else {
      teamScore.value = 0;
    }
    // console.log("teamScore", teamScore.value);
  })
  // 获取团队组员总分
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
          if (getTeamId.value === key) {
            // console.log(`Key: ${key}, Value: ${obj[key]}`);
            teamMemberScore.value = obj[key];
            // console.log("teamMemberScore", teamMemberScore.value);
            totalTeamScore.value = teamScore.value + teamMemberScore.value;
          }
        }
      }, 100);
    });
  })
}

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
      let worksheet = workbook.getWorksheet(props.studentName)
      // 创建要写入的数据
      const data = [
        { dateTime: dateTime.value, studyStatus: studyStatusString.value, score: score.value },
      ];
      // 判断当前学生是否已存在，如果不存在，则创建新的工作表并添加数据；否则在原有工作表中添加数据
      if (!worksheet) {
        let stuWorkSheet = workbook.addWorksheet(props.studentName);
        // 添加表头
        stuWorkSheet.columns = [
          { header: "时间", key: "dateTime", width: 25 },
          { header: props.studentName + '学习表现', key: "studyStatus", width: 20 },
          { header: "得分", key: "score", width: 10 },
        ];
        // 设置表头居中 和加粗
        stuWorkSheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        stuWorkSheet.getRow(1).font = { bold: true };
        // 写入数据
        stuWorkSheet.addRows(data);
        ElMessage.success('提交成功')
      } else {
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
        // const fileName = '学生信息表.xlsx'
        // // 创建一个a标签
        // const a = document.createElement('a')
        // // 创建一个URL对象
        // const url = URL.createObjectURL(blob)
        // // 设置a标签的href属性为URL对象
        // a.href = url
        // // 设置a标签的download属性为文件名
        // a.download = fileName
        // // 模拟点击a标签
        // a.click()
        // // 释放URL对象
        // // 释放URL对象
        // setTimeout(() => {
        //     URL.revokeObjectURL(url);
        //     // ElMessage.success("保存成功");
        // }, 100);
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
  studentInfo(props.studentName).then(res => { studentStatus.value = res })
  getDateTime().then(res => { dateTime.value = res });
  teamTotalScore();
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
