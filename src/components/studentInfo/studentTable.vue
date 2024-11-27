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
          <!--  trigger="hover" -->
          <el-popconfirm confirmButtonText="Yes" cancelButtonText="No" :icon="InfoFilled" icon-color="#626AEF"
            title="确定删除此信息？" @confirm="handleContextmenu(scope.row, scope.column, $event)" @cancel="cancelEvent"
            width="auto">
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
import { studentInfo } from "@/utils/dataOption/getTableData";
import { InfoFilled } from '@element-plus/icons-vue';
import { ElMessage } from "element-plus";
import ExcelJS from 'exceljs';
import { importExcelFile } from "@/store/excelOptions";
import { saveExcel, changeSorceforExcelData } from "@/utils/dataOption/saveExcel";
import { getTeamIdforMember } from "@/utils/getTeamMember";

const importFile = importExcelFile();
// 获取学生学习状态
const studentStatus = ref([]);
// 获取学生所在组队id
const getTeamId = ref("");
// 接收父组件传递过来的studentName
const props = defineProps({
  studentName: { type: String, default: "" },
  isStudentData: { type: Boolean, default: true }
})
// 获取学生学习状态数据列表
const tableData = ref(studentStatus);

// 右键表格菜单
async function handleContextmenu(row: any, column: any, event: Event) {
  console.log(row, row.score, column, event);
  //创建Workbook实例
  const workbook = new ExcelJS.Workbook();

  try {
    // 从 buffer中加载数据解析
    await workbook.xlsx.load(importFile.buffer.data);

    let worksheet = workbook.getWorksheet(props.studentName);

    // 查找并删除所有匹配的行
    let rowsToDelete = [];
    // 遍历所有行
    for (let i = 1; i <= worksheet.rowCount; i++) {
      const cellValue = worksheet.getCell(i, 1).value; // dateTime 在第一列
      if (cellValue === row.dateTime) { rowsToDelete.push(i) }
    }
    // 从后往前删除行，避免索引变化导致的问题
    rowsToDelete.sort((a, b) => b - a).forEach(rowIndex => {
      worksheet.spliceRows(rowIndex, 1);
    });

    // 更改excel文件中的小组工作表中的分数数据
    let teamWorkSheet = workbook.getWorksheet("team");
    await changeSorceforExcelData(teamWorkSheet, getTeamId.value, {},
      null, row.score, null, props.isStudentData);

    // 上传文件的代码块
    const buffer = await workbook.xlsx.writeBuffer();
    saveExcel(null, buffer);
  } catch (error) {
    ElMessage.error('Error loading Excel file:', error);
  }
  ElMessage.success({ message: '成功删除', duration: 1000 });
}
function cancelEvent() { ElMessage.info({ message: '操作取消', duration: 1000 }) }

watchEffect(() => {
  getTeamIdforMember(props.studentName).then(res => {
    // console.log("resstudentName", res);
    getTeamId.value = res
  })
  studentInfo(props.studentName).then(res => { studentStatus.value = res })
})
</script>

<style scoped lang="scss">
.table-container {
  margin: auto;
  width: 89%;
}
</style>
