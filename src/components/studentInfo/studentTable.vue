<template>
  <div class="table-container">
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
            <el-icon><InfoFilled /></el-icon>
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
import { defineProps, ref, watchEffect } from "vue";
import { ElMessage } from "element-plus";
import { getStudentTableData, removeStudentTableData } from "@/utils/api/DataOptions";

// 接收父组件传递过来的studentName
const props = defineProps({
  studentName: { type: String, default: "" },
  isStudentData: { type: Boolean, default: true }
})
// 获取学生学习状态数据列表
const tableData = ref([]);

// 右键表格菜单
async function handleContextmenu(row: any, column: any, event: Event) {
  console.log(row, row.score, column, event);
  removeStudentTableData({
    student: props.studentName,
    dateTime: row.dateTime,
    score: row.score,
  }).then((res: any) => {
    ElMessage.success({ message: res.msg, duration: 1000 });
  }).catch(error => {
    ElMessage.error({ message: '删除失败' + error, duration: 1000 });
  });
}
function cancelEvent() { ElMessage.info({ message: '操作取消', duration: 1000 }) }

watchEffect(() => {
  getStudentTableData(props.studentName).then(res => {
    // console.log("resstudentName", res);
    tableData.value = res.data
  })
  tableData.value;
})
</script>

<style scoped lang="scss">
.table-container {
  margin: auto;
  width: 89%;
}
</style>
