<template>
    <div class="error-container">
        <div class="error-icon">⚠️</div>
        <h2 class="error-title">{{ title }}</h2>
        <p class="error-message">{{ message }}</p>
        <button v-if="showRetry" @click="handleRetry" class="retry-button">
            重试
        </button>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
    title: { type: String, default: '发生错误' },  // 标题
    message: { type: String, required: true },    // 错误信息
    showRetry: { type: Boolean, default: false }, // 是否显示重试按钮
});
const emit = defineEmits(['retry']);  // 定义 retry 事件
const handleRetry = () => {
    emit('retry');
};
</script>

<style scoped>
.error-container {
    text-align: center;
    padding: 2rem;
    border: 1px solid #ff4444;
    border-radius: 8px;
    background-color: #ffeeee;
    max-width: 500px;
    margin: 2rem auto;
}

.error-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.error-title {
    color: #ff4444;
    margin-bottom: 1rem;
}

.error-message {
    color: #666;
    margin-bottom: 1.5rem;
}

.retry-button {
    padding: 0.5rem 1rem;
    background-color: #ff4444;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.retry-button:hover {
    background-color: #cc0000;
}
</style>