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
        <el-radio-group v-model="lang" @change="changeLang($event as any)">
            <el-radio value="1" size="large" border>中文</el-radio>
            <el-radio value="2" size="large" border style="margin-left: -30px;">英文</el-radio>
        </el-radio-group>
    </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { ref } from 'vue';
import { useConfig } from "@/store/config";

const config: any = useConfig();
const visible = ref(false)  // 显示导入文件弹窗
// 语言切换 1 中文 2 英文
const lang = ref(config.lang)

const handleToSeat = () => {
    router.push("/seatData");
}
const handleToManage = () => {
    // TODO 判断是否有权限
    router.push("/manage");
}

// 切换语言
const changeLang = (event: any) => { config.changeGlobalLang(event) }
</script>

<style lang="scss" scoped></style>
