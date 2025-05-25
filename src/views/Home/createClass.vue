<template>
  <div class="container">
    <div class="main-title">
      <h2>创建班级</h2>
    </div>
    <el-divider class="divider" :space="500" direction="horizontal" border-style="solid" align-center />
    <div class="main-content">
      <!-- 步骤条 -->
      <div class="steps">
        <el-steps style="max-width: 600px" :space="400" :active="active" align-center finish-status="success">
          <el-step title="Step 1" description="填写班级、课程与学生信息" />
          <el-step title="Step 2" description="填写小组信息" />
          <!-- <el-step title="Step 3" description="Some description" /> -->
        </el-steps>
      </div>
      <!-- 步骤、表单内容 -->
      <div class="steps-content">
        <div v-if="active === 0" class="form-container">
          <el-form :model="form" ref="classFormRef" :rules="rules" class="class-form-compact">
            <div class="form-row">
              <el-form-item label="班级：" prop="className" class="form-item-compact">
                <el-input v-model="form.className" placeholder="请输入班级名称" class="input-compact" />
              </el-form-item>
              <el-form-item label="课程名称：" prop="courseName" class="form-item-compact">
                <el-input v-model="form.courseName" placeholder="请输入课程名称" class="input-compact" />
              </el-form-item>
            </div>
            <div class="form-row">
              <el-form-item label="座位表：" class="form-item-compact">
                <span style="margin-right: 10px;" />
                <span>行数：</span>
                <el-input-number v-model="form.rows" :min="1" class="input-number-compact" />
                <span style="margin: 0 10px;">列数：</span>
                <el-input-number v-model="form.columns" :min="1" class="input-number-compact" />
              </el-form-item>
            </div>
          </el-form>

          <el-form :model="studentData" ref="studentFormRef" :rules="rules">
            <div ref="tableContainer" class="table-container" style="position: relative;"
              :class="{ fullscreen: isFullscreen }" @mouseenter="showFullscreenIcon = true"
              @mouseleave="showFullscreenIcon = false">
              <!-- 表头 -->
              <div ref="tableHeader">
                <el-row class="table-header">
                  <el-col :span="6" class="header-cell">学号</el-col>
                  <el-col :span="6" class="header-cell">姓名</el-col>
                  <el-col :span="6" class="header-cell">性别</el-col>
                  <el-col :span="6" class="header-cell">头像文件</el-col>
                </el-row>
              </div>
              <!-- 显示标签 ---》小屏放大，大屏缩小 -->
              <span v-show="showFullscreenIcon && studentData.length > 5" @click="fullscreen"
                class="iconfont fullscreen-svg" :class="isFullscreen ? 'icon-suoxiao' : 'icon-quanping'" />
              <!-- 输入框内容，只显示5行，其余行滚动显示 -->
              <div :class="!isFullscreen ? 'scroll-container' : 'scroll-container-fullscreen'"
                :style="isFullscreen ? { maxHeight: fullscreenScrollMaxHeight } : {}">

                <el-row v-for="(row, index) in studentData" :key="index" class="table-row">
                  <el-col :span="6" class="input-cell">
                    <el-input v-model="row.studentId" placeholder="请输入学号" clearable @input="handleInput(index)" />
                  </el-col>
                  <el-col :span="6" class="input-cell">
                    <el-input v-model="row.stuName" placeholder="请输入姓名" clearable @input="handleInput(index)" />
                  </el-col>
                  <el-col :span="6" class="input-cell">
                    <el-input v-model="row.gender" placeholder="请输入性别" clearable @input="handleInput(index)" />
                  </el-col>
                  <el-col :span="6" class="input-cell">
                    <el-input v-model="row.avatar" placeholder="请输入头像文件" clearable @input="handleInput(index)" />
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-form>

          <el-button type="primary" @click="handleToNextStep">下一步</el-button>
        </div>

        <div v-if="active === 1">
          <el-form :model="form" ref="classFormRef" :rules="rules">
            <div class="form-row form-row-inline">
              <el-form-item label="班级：" prop="className">
                <el-input v-model="form.className" placeholder="请输入班级名称" />
              </el-form-item>
              <el-form-item label="课程名称：">
                <el-input v-model="form.courseName" disabled />
              </el-form-item>
            </div>
            <div class="form-row">
              <el-form-item label="座位表：">
                <span style="margin-right: 10px;" />
                <span>行数：</span>
                <el-input-number v-model="form.rows" disabled />
                <span style="margin: 0 10px;">列数：</span>
                <el-input-number v-model="form.columns" disabled />
              </el-form-item>
            </div>
          </el-form>

          <!-- 组信息表输入框，根据座位表行列生成 -->
          <el-form :model="studentData" ref="studentFormRef" :rules="rules">
            <el-row>
              <el-col :span="12">
                <div class="group-table">
                  <el-row class="table-header">
                    <el-col :span="2" class="header-cell">组号</el-col>
                    <el-col :span="6" class="header-cell">组名</el-col>
                    <el-col :span="4" class="header-cell">组长</el-col>
                    <el-col :span="12" class="header-cell">成员</el-col>
                  </el-row>
                  <el-row v-for="(group, index) in form.rows" :key="index" class="table-row">
                    <el-col :span="2" class="start-item">
                      <el-input :value="getGroupName(index, 'left')"
                        @input="(val) => groupData[index].groupName = val" />
                    </el-col>
                    <el-col :span="6" class="input-cell">
                      <el-input v-model="groupData[index].groupNick" placeholder="组名" clearable />
                    </el-col>
                    <el-col :span="4" class="input-cell">
                      <el-input v-model="groupData[index].leader" placeholder="组长" clearable />
                    </el-col>
                    <el-col :span="12" class="last-item">
                      <el-input v-model="groupData[index].members" placeholder="成员" clearable />
                    </el-col>
                  </el-row>
                </div>
              </el-col>

              <el-col :span="12">
                <div class="group-table">
                  <el-row class="table-header">
                    <el-col :span="2" class="header-cell">组号</el-col>
                    <el-col :span="6" class="header-cell">组名</el-col>
                    <el-col :span="4" class="header-cell">组长</el-col>
                    <el-col :span="12" class="header-cell">成员</el-col>
                  </el-row>
                  <el-row v-for="(group, index) in form.rows" :key="'second-' + index" class="table-row">
                    <el-col :span="2" class="start-item">
                      <el-input :value="getGroupName(index, 'right')"
                        @input="(val) => groupData[index + form.rows].groupName = val" />
                    </el-col>
                    <el-col :span="6" class="input-cell">
                      <el-input v-model="groupData[index + form.rows].groupNick" placeholder="组名" clearable />
                    </el-col>
                    <el-col :span="4" class="input-cell">
                      <el-input v-model="groupData[index + form.rows].leader" placeholder="组长" clearable />
                    </el-col>
                    <el-col :span="12" class="last-item">
                      <el-input v-model="groupData[index + form.rows].members" placeholder="成员" clearable />
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>
          </el-form>

          <!-- 提交按钮组 -->
          <el-button-group class="center-btn-group">
            <el-button type="primary" @click="handleToBefore">上一步</el-button>
            <!-- 提交按钮，确认提交气泡框 -->
            <el-popconfirm confirmButtonText="确定" cancelButtonText="取消" icon-color="#626AEF" title="确定提交此信息，并创建一个班级？"
              @confirm="handleSubmit" @cancel="" width="auto">
              <el-icon>
                <InfoFilled />
              </el-icon>
              <template #reference>
                <el-button type="primary">提交</el-button>
              </template>
            </el-popconfirm>
          </el-button-group>
        </div>

        <div v-if="active === 2"></div>

        <div v-if="active === 3"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElButton, ElButtonGroup, ElStep, ElCol, ElDivider, ElForm, ElFormItem, ElIcon, ElInput, ElInputNumber, ElPopconfirm, ElRow, ElSteps } from 'element-plus';
import { InfoFilled } from '@element-plus/icons-vue';
import { ref, computed, watch, reactive } from 'vue';

// 步骤条
const tableContainer = ref<HTMLElement | null>(null);
const tableHeader = ref<HTMLElement | null>(null); // 表头
const showFullscreenIcon = ref(false);  // 是否显示全屏按钮
const isFullscreen = ref(false);        // 是否全屏
const classFormRef = ref();                   // 表单引用
const studentFormRef = ref();                 // 学生表单引用
// 从第一步开始
const active = ref(0);
// 表单数据
const form = reactive({
  className: '',
  rows: 1,
  columns: 1,
  courseName: '',
});
// 初始化表格数据
const studentData = ref([
  { studentId: '', stuName: '', gender: '', avatar: '' },
]);
// 初始化组数据
const groupData = ref([
  { groupName: '', groupNick: '', leader: '', members: '' },
]);
// 表单验证规则
const rules = reactive({
  className: [
    { required: true, message: '请输入班级名称', trigger: 'blur' }
  ],
  courseName: [
    { required: true, message: '请输入课程名称', trigger: 'blur' }
  ],
})

// 返回上一步
const handleToBefore = () => active.value--;
// 全屏显示
const fullscreen = () => isFullscreen.value = !isFullscreen.value;

// 获取当前页面滚动条最大高度
const fullscreenScrollMaxHeight = computed(() => {
  // 150px 可根据你的布局调整
  return isFullscreen.value ? `calc(100vh - ${tableHeader.value.clientHeight}px - 100px)` : '';
});

// 获取固定组名
const getGroupName = (index: number, side: 'left' | 'right') => {
  const total = form.rows;
  if (side === 'left') {
    // 最大奇数到1
    return `${total * 2 - 1 - index * 2}`;
  } else {
    // 最大偶数到2
    return `${total * 2 - index * 2}`;
  }
};

// 提交表单数据 0->1数据互通
const handleToNextStep = () => {
  if (active.value === 0) {
    // 校验班级信息表单
    const classForm = classFormRef.value;
    const studentForm = studentFormRef.value;
    if (classForm && studentForm) {
      classForm.validate((classValid: boolean) => {
        if (!classValid) return;
        studentForm.validate((studentValid: boolean) => {
          if (!studentValid) return;
          // 先确保 groupData 长度为 rows*2
          const total = form.rows;
          while (groupData.value.length < total * 2) {
            groupData.value.push({ groupName: '', groupNick: '', leader: '', members: '' });
          }
          while (groupData.value.length > total * 2) {
            groupData.value.pop();
          }
          for (let i = 0; i < total; i++) {
            groupData.value[i].groupName = getGroupName(i, 'left');
            groupData.value[i + total].groupName = getGroupName(i, 'right');
          }
          active.value++;  // 下一步
        });
      });
    }
  }
}

// 提交数据，弹出气泡框
const handleSubmit = () => {
  // 过滤掉空行
  studentData.value = studentData.value.filter(row =>
    Object.values(row).some(value => value.trim() !== '')
  );
  // 数据上传到服务器的逻辑
  console.log('提交数据：', [groupData.value, form, studentData.value]);
};

// 处理输入事件，动态添加新行
const handleInput = (index: number) => {
  // 如果当前是最后一行且有输入，则添加新行
  const isLastRow = index === studentData.value.length - 1;
  const isRowFilled = Object.values(studentData.value[index]).some((value) => value.trim() !== '');
  if (isLastRow && isRowFilled) {
    studentData.value.push({ studentId: '', stuName: '', gender: '', avatar: '' });
  }
};

// 监听 rows 改变时，更新 groupData
watch(() => form.rows, (newRows) => {
  while (groupData.value.length < newRows) {
    groupData.value.push({ groupName: '', groupNick: '', leader: '', members: '' });
  }
  while (groupData.value.length > newRows) {
    groupData.value.pop();
  }
});
</script>

<style lang="scss" scoped>
@import "../../assets/font/iconfont.css";

// 通用表头样式
.header-cell {
  text-align: center;
  padding: 5px 0;
  font-weight: bold;
}

// 通用表格行样式
.table-row {
  display: flex;
  align-items: center;
  margin: 2px 0;
}

// 通用输入单元格样式
.input-cell {
  padding: 0 2px;
}

.el-input {
  width: 100%;

  // 新增：输入框内容居中
  .el-input__inner {
    text-align: center;
  }
}

// 通用表头
.table-header {
  background-color: #d9f0ff;
  text-align: center;
  font-weight: bold;
  padding: 10px 0;
}

// 通用表单行
.form-row,
.form-row-inline {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 24px;

  .el-form-item {
    margin-bottom: 0;
    display: flex;
    align-items: center;

    .el-form-item__label {
      min-width: 60px;
      font-size: 16px;
      padding-right: 8px;
      text-align: right;
    }

    .el-input {
      width: 180px;

      // 新增：输入框内容居中
      .el-input__inner {
        text-align: center;
      }
    }
  }
}

// 精简版表单项
.form-item-compact {
  margin-right: 24px;
  margin-bottom: 0;

  .el-form-item__label {
    font-size: 18px;
    min-width: 60px;
    text-align: right;
    padding-right: 8px;
  }
}

// 精简输入框
.input-compact {
  width: 180px;

  // 新增：输入框内容居中
  .el-input__inner {
    text-align: center;
  }
}

// 精简数字输入框
.input-number-compact {
  width: 120px;
  margin: 0 4px;
}

// 组表格样式
.group-table {
  background-color: #d9f0ff;
  padding: 20px 0px;
  border-radius: 8px;
  margin-bottom: 20px;

  .table-row {
    margin-top: 10px;
  }
}

// 头尾单元格
.start-item {
  padding-left: 10px;
}

.last-item {
  padding-right: 10px;
}

.container {
  padding: 20px;

  .main-title {
    margin-bottom: 20px;

    h2 {
      font-size: 24px;
      text-align: center;
      font-weight: bold;
    }
  }

  .main-content {
    .steps {
      display: flex;
      justify-content: center;
      margin-bottom: 30px;
    }

    .steps-content {
      margin-top: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .form-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;

        .class-form-compact {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 10px;
        }

        .form {
          margin-bottom: 20px;
        }

        .table-container {
          padding: 20px;
          background-color: #f9f9f9;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          position: relative;

          &.fullscreen {
            position: fixed !important;
            top: 0;
            left: 0;
            width: 100vw !important;
            height: 100vh !important;
            background: #fff;
            z-index: 9999;
            margin: 0;
            padding: 40px 20px 20px 20px;
            box-sizing: border-box;
            overflow: auto;
            border-radius: 0;
          }

          .fullscreen-svg {
            position: absolute;
            font-size: 30px;
            top: 5px;
            right: 8px;
            width: 24px;
            height: 24px;
            cursor: pointer;
            z-index: 10;
          }

          .scroll-container,
          .scroll-container-fullscreen {
            max-height: 200px;
            overflow-y: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .scroll-container::-webkit-scrollbar,
          .scroll-container-fullscreen::-webkit-scrollbar {
            display: none;
          }
        }
      }
    }
  }
}

.center-btn-group {
  display: flex;
  justify-content: center;
  margin-top: -40px;
}

.el-divider--horizontal {
  margin: 0 0 20px 0;
}

.el-button {
  margin-top: 20px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.el-row {
  margin-bottom: 10px;
}

.el-col {
  width: 100%;
}
</style>