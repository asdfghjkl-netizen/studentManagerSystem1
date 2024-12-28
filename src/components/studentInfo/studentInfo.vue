<template>
  <!--  右边部分  -->
  <tr class="student-info-right">
    <td class="stu-img">
      <el-image :src="require(`../../../public/images/${reqStudentImgUrl}/${studentName}.jpg`)" :alt="studentName"
        style="height: 315px;" class="img" />
    </td>
    <td class="student-team">
      <!--  小组情况  -->
      <div class="stdent-team-name">
        <h1>
          第{{ getTeamId }}团队：{{ studentName }}
        </h1>
      </div>
      <div class="stdent-team-source">
        <h2>
          <span style="margin-right: 40px;">小组得分:{{ totalTeamScore }}分</span>
          <span>个人贡献:{{ memberScore }}分</span>
        </h2>
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
  </td>
  </tr>

  <div class="table-container" style="position: relative; top: 20px;">
    <el-table :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ textAlign: 'center' }" empty-text="暂无数据"
      height="200" :default-sort="{ prop: 'dateTime', order: 'descending' }" :data="tableData"
      style="width: 100%; text-align: center" border>
      <el-table-column prop="id" label="序号" width="55">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="dateTime" label="日期" width="180" />
      <el-table-column prop="studyStatus" :label="`${studentName}学习表现`" width="200" />
      <el-table-column prop="score" label="得分" width="80" />
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <!--  trigger="hover":icon="InfoFilled" -->
          <el-popconfirm confirmButtonText="Yes" cancelButtonText="No" icon-color="#626AEF" title="确定删除此信息？"
            @confirm="handleContextmenu(scope.row, scope.column, $event)" @cancel="cancelEvent" width="auto">
            <el-icon>
              <InfoFilled />
            </el-icon>
            <template #reference>
              <el-button type="primary" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { getDateTime } from "@/utils/dateTime";
import { onMounted, ref, defineProps, reactive, watch } from "vue";
import { addStudentTableData, removeStudentTableData, getStudentTableData } from "@/utils/api/DataOptions";
import { ElMessage, ElNotification } from "element-plus";
import { getTeamNum, getTeamList } from "@/utils/dataOption/teamOpt";

const memberScore = ref(0);
// 小组得分（总）
const totalTeamScore = ref(0);
// 获取时间数据
const dateTime = ref("");
// 获取学生学习状态数据列表
const tableData = ref([]);
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
// 提取studyStatus的字符串(为studyStatus的label或otherStatus)
const studyStatusString = ref("");
// 获取学生所在组队id
const getTeamId = ref("");
const props = defineProps({
  studentName: { type: String, default: "" },
  reqStudentImgUrl: { type: String, default: "" },
})

// 获取学生数据(封装),==》 信息引用
const getStudentData = (student: string) => {
  getStudentTableData(student).then((res: any) => {
    // console.log("studentData", res);
    if (res.code === 200) {
      tableData.value = res.data;
      memberScore.value = res.totalScore;
    }
  })
}

// TODO 给totalTeamScore去重  获取团队列表数据(封装),==》 信息引用 
const getTeamData = (teamId: any) => {
  getTeamList(teamId).then((res: any) => {
    console.log("teamData", res);
    // 创建一个 Set 来存储所有团队的小组总分
    const teamTotalScore = new Set();
    // 获取二级目录
    res.forEach((key: any) => {
      // 添加到 Set 中以去重
      teamTotalScore.add(key.totalScore);
    })
    // console.log(teamTotalScore);
    // 判断 teamTotalScore 的大小  ==》 等于0 或 大于1(错误)
    if (teamTotalScore.size == 0 || teamTotalScore.size > 1) {
      totalTeamScore.value = 0;
      throw new Error("团队数据异常");
    }
    totalTeamScore.value = teamTotalScore.values().next().value;
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
const submit = async () => {
  try {
    const addData: any = await addStudentTableData({
      student: props.studentName,
      dateTime: dateTime.value,
      score: score.value,
      studyStatus: studyStatusString.value,
      teamId: getTeamId.value,
    });
    // console.log("addData", addData);
    if (addData.code == 200) {
      ElMessage.success({ message: addData.msg, duration: 1000 });
      score.value = 0;
      otherStatus.value = "";
      getStudentData(props.studentName)
      getTeamData(getTeamId.value)
    }
  } catch (err) {
    ElMessage.error({ message: '读取失败' + err, duration: 1000 });
  }
}

// 右键表格菜单
function handleContextmenu(row: any, column: any, event: Event) {
  console.log(row, row.score, column, event);
  removeStudentTableData({
    student: props.studentName,
    dateTime: row.dateTime,
    score: row.score,
    teamId: getTeamId.value,
  }).then((res: any) => {
    console.log(res);
    if (res.code == 200) {
      ElMessage.success({ message: res.message, duration: 1000 });
      getStudentData(props.studentName)
      getTeamData(getTeamId.value)
    }
  }).catch(error => {
    ElNotification.error({ message: '删除失败' + error, duration: 1000 });
  });
}
function cancelEvent() { ElMessage.info({ message: '操作取消', duration: 1000 }) }

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
onMounted(() => {
  handleChangeValue(selectStudyStatus.value);
  getTeamNum(props.studentName).then((res) => {
    getTeamId.value = res
    getTeamData(res)
  });
  getStudentData(props.studentName);
});
</script>

<style scoped lang="scss">
.stu-img {
  background-color: white;

  .img {
    border-radius: 5px;
    margin: 15px 30px;
  }
}

.student-team {
  float: right;
  margin-left: 20px;
}

.student-info-right {
  // padding-left: 20px;
  margin-bottom: 50px;

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

.table-container {
  position: relative;
  right: 15px;
  margin-top: 30px;
  margin: auto;
  width: 89%;
}
</style>
