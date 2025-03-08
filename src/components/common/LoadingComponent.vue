<template>
    <transition name="fade">
        <div v-if="visible" class="loading-container">
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p class="loading-text">{{ message }}</p>
                <div class="loading-dots">
                    <span class="dot dot-1"></span>
                    <span class="dot dot-2"></span>
                    <span class="dot dot-3"></span>
                </div>
            </div>
        </div>
    </transition>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

defineProps({
    message: { type: String, default: '加载中' },
    visible: { type: Boolean, default: true },
})
</script>

<style scoped>
.loading-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.loading-content {
    text-align: center;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1.2s linear infinite;
}

.loading-text {
    margin-top: 1rem;
    color: #666;
    font-size: 1.2rem;
    animation: text-bounce 1.5s infinite;
}

.loading-dots {
    margin-top: 1rem;
}

.dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #3498db;
    margin: 0 4px;
    animation: dot-bounce 1.4s infinite ease-in-out;
}

.dot-1 {
    animation-delay: -0.32s;
}

.dot-2 {
    animation-delay: -0.16s;
}

/* Animations */
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@keyframes text-bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-5px);
    }
}

@keyframes dot-bounce {

    0%,
    80%,
    100% {
        transform: translateY(0);
    }

    40% {
        transform: translateY(-12px);
    }
}

/* Transition effects */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>