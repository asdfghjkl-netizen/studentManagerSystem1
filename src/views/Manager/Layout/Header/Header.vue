<template>
  <div class="header-content">
    <div class="left-section">
      <el-button type="primary" class="collapse-btn" @click="changeCollapse">
        <el-icon>
          <Menu />
        </el-icon>
      </el-button>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="className != ''" :to="{ path: '/seatData' }">座位表</el-breadcrumb-item>
        <el-breadcrumb-item v-if="lastMenu != ''">{{ lastMenu }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ menuName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="center-section">
      <h2 class="system-title">后台管理系统</h2>
    </div>
    <div class="right-section">
      <el-dropdown trigger="hover" placement="bottom">
        <div class="user-info">
          <el-avatar :size="32" :src="img" />
          <span class="username">{{ username }}</span>
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleProfile">个人信息</el-dropdown-item>
            <el-dropdown-item @click="handleSettings">系统设置</el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElBreadcrumb, ElBreadcrumbItem, ElAvatar, ElDropdown, ElDropdownMenu, ElDropdownItem, ElIcon } from 'element-plus';
import { ref, defineEmits, watch } from 'vue';
import { Menu, ArrowDown } from '@element-plus/icons-vue';
import { useDataOptions } from '@/store/dataOptions';

const dataStore = useDataOptions();
let className = '';
// 图片路径
const img = require('@/assets/imgs/avatar.png');
const prop = defineProps<{ menuName: { title?: string; parentTitle?: string } }>();
const menuName = ref('');  // 菜单名称
const lastMenu = ref('');  // 上一级菜单数据
const username = window.sessionStorage.getItem('username') || '管理员';

// 侧边栏折叠处理函数
const emit = defineEmits(["clickCollapse"]);
const changeCollapse = () => emit("clickCollapse");

// 用户操作处理函数
const handleProfile = () => {
  console.log('查看个人信息');
};

// 系统设置处理函数
const handleSettings = () => {
  console.log('打开系统设置');
};

// 退出登录处理函数
const handleLogout = () => {
  console.log('退出登录');
};

watch(() => dataStore.selectedClass, // 监听 store 的响应式属性
  (newTags) => { className = newTags },
  { immediate: true, deep: true }   // 立即执行，深度监听
);
watch(() => prop.menuName, // 监听 menuName 的响应式属性
  (newTags) => {
    menuName.value = newTags.title;
    lastMenu.value = newTags.parentTitle;
    // console.log('菜单名称:', menuName.value, '上一级菜单:', lastMenu.value);
  },
  { immediate: true, deep: true }   // 立即执行，深度监听
);
</script>

<style lang="scss" scoped>
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;

  .left-section {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 20px;

    .collapse-btn {
      padding: 6px;
      height: 32px;
    }

    .el-breadcrumb {
      margin-left: 8px;
      font-size: 16px;

      &__inner {
        cursor: pointer;
      }
    }
  }

  .center-section {
    flex: 1;
    display: flex;
    justify-content: center;

    .system-title {
      margin: 0;
      font-size: 25px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      white-space: nowrap;
    }
  }

  .right-section {
    flex: 1;
    display: flex;
    justify-content: flex-end;

    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 5px 12px;
      border-radius: 4px;
      transition: background-color 0.3s;

      &:hover {
        background-color: var(--el-color-primary-light-9);
      }

      .username {
        margin: 0 8px;
        font-size: 14px;
        color: var(--el-text-color-primary);
      }
    }
  }
}
</style>