<template>
    <div>
        <el-button type="primary" @click="handleToSeat">进入seat界面</el-button>
        <el-tooltip placement="top" :visible="visible">
            <template #content>
                <span>需要管理员权限<br />点击进入管理界面<br />能够修改学生信息</span>
            </template>
            <el-button type="success" plain @click="handleToManage" @mouseenter="visible = true"
                @mouseleave="visible = false">进入管理界面</el-button>
        </el-tooltip>
    </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { ref } from 'vue';

const visible = ref(false)  // 显示导入文件弹窗

const handleToSeat = () => {
    router.push("/seatData");
}
const handleToManage = () => {
    // TODO 判断是否有权限
    router.push("/manage");
}
</script>

<style lang="scss" scoped></style>
