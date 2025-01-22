<template>
  <div class="table-data" ref="tableContainer">
    <el-scrollbar>
      <el-table :data="tableData" :height="elTableHeight">
        <el-table-column prop="date" label="Date" width="140" />
        <el-table-column prop="name" label="Name" width="120" />
        <el-table-column prop="address" label="Address" />
      </el-table>
      <div ref="pagination" class="pagination">
        <el-pagination background layout="prev, pager, next" :total="1000" />
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useResizeObserver } from '@vueuse/core';

const item = {
  date: '2016-05-02',
  name: 'Tom',
  address: 'No. 189, Grove St, Los Angeles',
}
const tableData = ref(Array.from({ length: 20 }).fill(item));
// 用于监听容器高度变化
const tableContainer = ref<HTMLElement | null>(null);
// 表格高度
const elTableHeight = ref<number>(0);
const pagination = ref<HTMLElement | null>(null);

const updateTableHeight = () => {
  // console.log(tableContainer.value.clientHeight, pagination.value.offsetHeight);
  if (tableContainer.value) {
    // 减去一些额外的空间，根据需要调整
    elTableHeight.value = tableContainer.value.clientHeight - pagination.value.offsetHeight - 90;
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
