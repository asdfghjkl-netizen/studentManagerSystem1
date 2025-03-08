<template>
  <el-tooltip :placement="tipPlacement" :visible="visible">
    <template #content>
      <slot name="content"></slot>
    </template>
    <el-button v-if="elementName === 'button'" :size="btnSize" :type="btnType" :plain="isBtnPlain" @click="handleClick"
      @mouseenter="visible = true" @mouseleave="visible = false" class="button">
      <slot></slot>
    </el-button>
  </el-tooltip>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

defineProps({
  /** 提示框位置 */
  tipPlacement: { type: String as () => 'top' | 'bottom' | 'left' | 'right', default: 'bottom' },

  /** 按钮类型，在设置color时，后者优先。 */
  btnType: {
    type: String as () => 'primary' | 'default' | 'text' | 'success' | 'warning' | 'info' | 'danger',
    default: 'primary'
  },
  /** 是否朴素按钮 */
  isBtnPlain: { type: Boolean, default: false },
  /** 按钮大小尺寸 */
  btnSize: {
    type: String as () => 'default' | 'small' | 'large',
    default: 'default'
  },

  /** 判断组件名称 */
  elementName: { type: String, default: 'button' },
});
const emits = defineEmits(['click']);  // 点击事件  
const visible = ref(false);  // 是否显示弹窗

// 点击事件
const handleClick = () => emits('click');
</script>

<style lang="scss" scoped>
</style>