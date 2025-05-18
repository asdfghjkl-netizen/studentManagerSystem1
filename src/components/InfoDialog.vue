<template>
  <el-dialog draggable destroy-on-close overflow :v-model="dialogVisible" :title="mainTitle" :width="width" :style="dialogStyle">
    <div class="student_info">
      <div class="top">
        <slot />
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleChangeStatu">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElDialog, ElButton } from 'element-plus';
import { defineProps, defineEmits } from 'vue';

defineProps({
  dialogVisible: Boolean,  // 弹窗显示隐藏
  dialogStyle: Object,     // 弹窗样式
  mainTitle: String,       // 弹窗标题
  width: Number,           // 弹窗宽度
});

// 点击确定按钮逻辑
const emit = defineEmits(['updateStatu']);
const handleChangeStatu = () => emit('updateStatu');
</script>

<style lang="scss" scoped>
.student_info {
  .top {
    margin-bottom: 2rem;
  }
}
</style>