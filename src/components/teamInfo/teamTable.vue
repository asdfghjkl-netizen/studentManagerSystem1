<template>
  <div class="table-container">
    <el-table height="200" :data="tableData" style="width: 100%; text-align: center" border>
      <el-table-column prop="id" label="序号" width="70">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="dateTime" label="日期" width="200" />
      <el-table-column prop="studyStatus" :label="`第${teamId}组学习表现`" width="200" />
      <el-table-column prop="score" label="得分" width="70" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, watchEffect } from "vue";
import { getTeamInfo } from "@/utils/getTableData";

// 获取学生学习状态
const teamStatus = ref([]);
// 接收父组件传递过来的studentName
const props = defineProps({ teamId: { type: String, default: "" } })
// 获取学生学习状态数据列表
const tableData = ref(teamStatus);

watchEffect(() => {
  getTeamInfo(props.teamId).then(res => { teamStatus.value = res })
})
</script>

<style scoped lang="scss">
.table-container {
  margin: auto;
  width: 78.5%;
}
</style>
