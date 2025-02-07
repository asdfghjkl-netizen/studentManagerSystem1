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
import { Loading } from '@element-plus/icons-vue';
import { ElButton, ElTooltip } from 'element-plus';
import { ref, defineProps, defineEmits } from 'vue';

defineProps({
  /** 提示框触发方式 */
  tipTrigger: { type: String as () => 'hover' | 'click' | 'focus' | 'contextmenu', default: 'hover' },
  /** 提示框追加到哪个元素 */
  tipAppendTo: { type: String },
  /** 提示框效果 */
  tipEffect: { type: String as () => 'light' | 'dark', default: 'dark' },
  /** 提示框内容，也可被 slot#content 覆盖 */
  tipContent: { type: String, default: '' },
  /** 提示框内容是否为原始内容,content 中的内容是否作为 HTML 字符串处理 */
  isTipRawContent: { type: Boolean, default: false },
  /** 提示框位置 */
  tipPlacement: { type: String as () => 'top' | 'bottom' | 'left' | 'right', default: 'bottom' },
  /** 提示框 fallback 位置，https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements */
  tipFallbackPlacements: { type: Array as () => ('top' | 'bottom' | 'left' | 'right')[] },
  /** 提示框是否禁用 */
  isTipDisabled: { type: Boolean },
  /** 提示框偏移量 */
  tipOffset: { type: Number },
  /** 提示框过渡动画 */
  tipTransition: { type: String },
  /** 提示框 popper 选项 */
  tipPopperOptions: { type: Object },
  /** 提示框显示延迟 */
  tipShowAfter: { type: Number },
  /** 提示框隐藏延迟 */
  tipHideAfter: { type: Number },


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
  /** 是否为文字按钮 */
  isBtnText: { type: Boolean, default: false },
  /** 是否显示文字按钮背景颜色 */
  isBtnBg: { type: Boolean, default: false },
  /** 是否为链接按钮 */
  isBtnLink: { type: Boolean, default: false },
  /** 是否为圆角按钮 */
  isBtnRound: { type: Boolean, default: false },
  /** 是否为圆形按钮 */
  isBtnCircle: { type: Boolean, default: false },
  /** 是否为加载状态 */
  isBtnLoading: { type: Boolean, default: false },
  /** 自定义加载中状态图标组件 */
  btnLoadingIcon: { type: String, default: Loading },
  /** 是否为禁用状态 */
  isBtnDisabled: { type: Boolean, default: false },
  /** 按钮图标 */
  btnIcon: { type: String, default: '' },
  /** 是否自动聚焦-原生 autofocus 属性 */
  isBtnAutofocus: { type: Boolean, default: false },
  /** 按钮原生 type 类型 */
  btnNativeType: { type: String as () => 'button' | 'reset' | 'submit', default: 'button' },
  /** 按钮颜色 */
  btnColor: { type: String, default: '' },
  /** 是否为深色按钮 */
  isBtnDark: { type: Boolean, default: false },
  /** 按钮标签 */
  btnTag: { type: String, default: 'button' },

  /** 判断组件名称 */
  elementName: { type: String, default: 'button' },
});
const emits = defineEmits(['click']);  // 点击事件  
const visible = ref(false);  // 是否显示弹窗

// 点击事件
const handleClick = () => emits('click');
</script>

<style scoped>
.button {
  /* 这里可以添加按钮的样式 */
}
</style>