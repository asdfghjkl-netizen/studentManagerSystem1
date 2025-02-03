<template>
  <div class="table-data" ref="tableContainer">
    <el-scrollbar>
      <el-table :data="currentPageData" :height="elTableHeight">
        <el-table-column prop="date" label="Date" width="140" />
        <el-table-column prop="name" label="Name" width="120" />
        <el-table-column prop="address" label="Address" />
      </el-table>
      <div ref="pagination" class="pagination">
        <!-- page-sizes:分页大小  page-size:分页数量  current-page:当前页数  
        pager-count：最大显示页数 -->
        <el-pagination 
          background 
          :current-page="currentPage" 
          :page-size="pageSize" 
          :page-sizes="[5, 10, 15, 20, 50]"
          size="default" 
          :pager-count="pagerCount" 
          layout="total, sizes, prev, pager, next, jumper" 
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange" 
        />
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useResizeObserver } from '@vueuse/core';

const item = {
  date: '2016-05-02',
  name: 'Tom',
  address: 'No. 189, Grove St, Los Angeles',
}
const tableData = ref(Array.from({ length: 20 }).fill(item));
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
// console.log(total.value, tableData.value.length);

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
</style>
