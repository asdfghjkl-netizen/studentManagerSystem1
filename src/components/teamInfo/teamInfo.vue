<template>
  <!--  右边部分  -->
  <tr class="student-info-right">
    <td class="stu-img">
      <el-image :src="`${envImagePath}/image/team.jpg`" style="height: 250px;" class="img" />
    </td>
    <td class="student-team">
      <!--  小组情况  -->
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
      <div class="datetime datetime-title">今日日期：<span class="datetime">{{ dateTime }}</span></div>
      <!--  学习表现  -->
      <div class="study">
        <InfoTitle title="学习表现">
          <el-select v-model="selectStudyStatus" placeholder="Select" @change="handleChangeValue" style="width: 250px">
            <el-option v-for="item in studyStatus" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </InfoTitle>
      </div>
      <!--  其他  -->
      <div class="other" style="margin-left: 36px;">
        <InfoTitle title="其他">
          <el-input v-model="otherStatus" style="width: 250px" clearable :disabled="selectStudyStatus != 5" />
        </InfoTitle>
      </div>
      <!--  得分  -->
      <div class="source" style="margin-left: 36px;">
        <InfoTitle title="得分">
          <el-input-number v-model="score" />
          <span class="fen">分</span>
        </InfoTitle>
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
      <el-table-column prop="studyStatus" :label="`第${teamId}组学习表现`" width="200" />
      <el-table-column prop="score" label="得分" width="80" />
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <!--  trigger="hover" :icon="InfoFilled"-->
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
import InfoTitle from "@/components/InfoTitle.vue";
import { InfoFilled } from "@element-plus/icons-vue";
import { onMounted, ref, defineProps, reactive, watch } from "vue";
import { ElMessage } from "element-plus";
import { getDateTime } from "@/utils/dateTime";
import { addTeamTableData, getTeamTableData, removeTeamTableData } from "@/utils/api/DataOptions";
import { getTeamList } from "@/utils/dataOption/teamOpt";

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
// 获取学生学习状态数据列表
const tableData = ref([]);
// 定义字符输入框输入的数据
const otherStatus = ref("");
// 提取studyStatus的字符串
const studyStatusString = ref("");
// 获取组成员分数
const teamMemberScore = ref(0);
// 获取小组分数
const teamScore = ref(0);
// 获取小组总分数
const teamTotalScoreAll = ref(0);
// 接收父组件传递过来的数据  
const props = defineProps({
  teamId: { type: String, default: "" },
  envImagePath: { type: String, default: "" },
})

// 获取团队数据(封装),==》 信息引用
const getTeamData = (teamId: any) => {
  getTeamTableData(teamId).then((res: any) => {
    // console.log("teamData", res);
    tableData.value = res.data;
    teamScore.value = res.totalScore;
  })
  // TODO 给totalTeamScore去重
  getTeamList(teamId).then((res: any) => {
    console.log("teamData", res);
    // 创建一个 Set 来存储所有团队的小组总分
    const teamTotalScore = new Set();
    // 获取二级目录
    res.forEach((key: any) => {
      // 添加到 Set 中以去重
      teamTotalScore.add(key.totalScore);
      // console.log("studyStatus", key.studyStatus);
      teamMemberScore.value += key.studyStatus;
    })
    // console.log(teamTotalScore);
    // 判断 teamTotalScore 的大小  ==》 等于0 或 大于1(错误)
    if (teamTotalScore.size == 0 || teamTotalScore.size > 1) {
      teamTotalScoreAll.value = 0;
      throw new Error("团队数据异常");
    }
    teamTotalScoreAll.value = teamTotalScore.values().next().value;
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
    const addData: any = await addTeamTableData({
      dateTime: dateTime.value,
      score: score.value,
      studyStatus: studyStatusString.value,
      teamId: props.teamId,
    });
    console.log("addData", addData);
    if (addData.code == 200) {
      ElMessage.success({ message: addData.msg, duration: 1000 });
      score.value = 0;
      otherStatus.value = "";
      getTeamData(props.teamId)
    }
  } catch (error) {
    ElMessage.error({ message: '读取失败' + error, duration: 1000 });
  }
}

// 右键表格菜单
async function handleContextmenu(row: any, column: any, event: Event) {
  console.log(row, column, event, props.teamId);
  removeTeamTableData({
    teamId: props.teamId,
    dateTime: row.dateTime,
    score: row.score,
  }).then((res: any) => {
    console.log("removeTeam", res);
    if (res.code == 200) {
      ElMessage.success({ message: res.message, duration: 1000 });
      getTeamData(props.teamId);
    }
  }).catch(error => {
    ElMessage.error({ message: '删除失败' + error, duration: 1000 });
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
  getTeamData(props.teamId);
});
</script>

<style scoped lang="scss">
.table-container {
  margin: auto;
  width: 85.5%;
}

.student-team {
  float: right;
  margin-left: 20px;
}

.student-info-right {
  padding-left: 20px;
  margin-bottom: 50px;

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

.stu-img {
  background-color: white;

  .img {
    border-radius: 5px;
    margin: 15px 30px;
  }
}
</style>
