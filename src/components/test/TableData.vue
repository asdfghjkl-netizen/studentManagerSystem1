<template>
  <div class="table-data" ref="tableContainer">
    <el-scrollbar>
      <el-table :data="currentPageData" border :height="elTableHeight"
        :default-sort="{ prop: 'date', order: 'descending' }" :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange" @row-click="handleRowClick">
        <el-table-column type="selection" width="55" />
        <!-- <el-table-column type="index" label="Index" width="70" /> -->
        <el-table-column prop="date" label="Date" sortable width="140" />
        <el-table-column prop="name" label="Name" width="120" />
        <el-table-column prop="address" label="Address" />
        <el-table-column fixed="right" label="Operations" min-width="120">
          <template #default>
            <el-button link type="primary" size="small">
              Detail
            </el-button>
            <el-button link type="primary" size="small">Edit</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div ref="pagination" class="pagination">
        <!-- page-sizes:分页大小  page-size:分页数量  current-page:当前页数  
        pager-count：最大显示页数 -->
        <el-pagination background :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 15, 20, 50]"
          size="default" :pager-count="pagerCount" layout="total, sizes, prev, pager, next, jumper" :total="total"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import { useResizeObserver } from '@vueuse/core';

const item = reactive([
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-03',
    name: 'Toms',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Toms',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-05',
    name: 'Toms',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-06',
    name: 'Toms',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-07',
    name: 'Toms',
    address: 'No. 189, Grove St, Los Angeles',
  },
])
const tableData = ref(item)
// const item = {
//   date: '2016-05-02',
//   name: 'Tom',
//   address: 'No. 189, Grove St, Los Angeles',
// }
// const tableData = ref(Array.from({ length: 20 }).fill(item));
// 用于监听容器高度变化 元数据=表格容器
const tableContainer = ref<HTMLElement | null>(null);
// 表格高度
const elTableHeight = ref<number>(0);
// 分页器元数据=分页器容器
const pagination = ref<HTMLElement | null>(null);
const currentPage = ref(1)   // 当前页码
const pageSize = ref(10)     // 分页大小
const pagerCount = ref(10)   // 最大显示页数
// 分页数据
let total = ref(tableData.value.length);

const tableRowClassName = ({ row }) => {
  if (row.date === '2016-05-02') {
    return 'warning-row';
  } else if (row.date === '2016-05-04') {
    return 'success-row';
  }
  return '';
}

// 计算分页属性
const currentPageData = computed(() => {
  // 开始的计算：从0开始  (当前页码-1)x分页大小
  const start = (currentPage.value - 1) * pageSize.value;
  // 结束的计算：从0开始  从起始0开始+5(包括0)
  const end = start + pageSize.value;
  // 返回商品数据值并截取 开始到结束的 5条数据
  return tableData.value.slice(start, end);
})
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  console.log(`current page: ${val}`)
}

// 用于存储选中的行
const selectedRows = ref([]);
// 修改：处理行选择事件，确保单选
const handleSelectionChange = (selection) => {
  if (selection.length > 0) {
    const row = selection[selection.length - 1];
    const index = currentPageData.value.findIndex(item => item === row);
    selectedRows.value = [{ row, index }];
  } else {
    selectedRows.value = [];
  }
  console.log('SelectionChange rows:', selectedRows.value);
}
// 修改：处理单行选择，使用索引
const handleRowClick = (row, column, event) => {
  console.log('handleRowClick row:', row, column, event);
  const index = currentPageData.value.findIndex(item => item === row);
  selectedRows.value = [{ row, index }];
  console.log('handleRowClick row:', selectedRows.value);
}

// 更新表格高度
const updateTableHeight = () => {
  // console.log(tableContainer.value.clientHeight, pagination.value.offsetHeight);
  if (tableContainer.value) {
    // 减去一些额外的空间，根据需要调整
    elTableHeight.value = tableContainer.value.clientHeight - pagination.value.offsetHeight;
  }
}

onMounted(() => { updateTableHeight() })
useResizeObserver(tableContainer, () => { updateTableHeight() })
</script>

<style lang="scss" scoped>
.table-data {
  height: 100%;
  /* 确保容器有高度 */
}

.pagination {
  padding: 20px 0 15px 0;
}

.el-pagination {
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
}

.warning-row {
  background: red;
}

.success-row {
  background: lightgreen;
}
</style>
