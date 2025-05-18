<template>
  <div class="container">
    <div class="main-title">
      <h2>创建班级</h2>
    </div>
    <el-divider class="divider" direction="horizontal" border-style="solid" />
    <div class="main-content">
      <div class="steps">
        <el-steps style="max-width: 600px" :active="active" align-center finish-status="success">
          <el-step title="Step 1" description="填写班级、课程与学生信息" />
          <el-step title="Step 2" description="填写小组信息" />
          <el-step title="Step 3" description="Some description" />
        </el-steps>
      </div>
      <div class="steps-content">
        <div v-if="active === 0" class="form-container">
          <!-- 班级和课程名称在一行 -->
          <el-col :span="12">
            <el-row :gutter="0" class="form">
              <el-col :span="12">
                <el-form-item label="班级：">
                  <el-input v-model="form.className" placeholder="请输入班级名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="课程名称：">
                  <el-input v-model="form.courseName" placeholder="请输入课程名称" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

          <!-- 座位表行数和列数在同一行 -->
          <el-col :span="12">
            <el-form-item label="座位表：">
              <el-row :gutter="0">
                <el-col :span="12">
                  <el-form-item label="行数：" label-width="70px">
                    <el-input-number v-model="form.rows" :min="1" placeholder="行数" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="列数：" label-width="60px">
                    <el-input-number v-model="form.columns" :min="1" placeholder="列数" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>

          <div class="table-container">
            <!-- 表头 -->
            <el-row class="table-header">
              <el-col :span="6" class="header-cell">学号</el-col>
              <el-col :span="6" class="header-cell">姓名</el-col>
              <el-col :span="6" class="header-cell">性别</el-col>
              <el-col :span="6" class="header-cell">头像文件</el-col>
            </el-row>
            <!-- 输入框行 -->
            <el-row v-for="(row, index) in studentData" :key="index" class="table-row">
              <el-col :span="6" class="input-cell">
                <el-input v-model="row.studentId" placeholder="请输入学号" @input="handleInput(index)" />
              </el-col>
              <el-col :span="6" class="input-cell">
                <el-input v-model="row.name" placeholder="请输入姓名" @input="handleInput(index)" />
              </el-col>
              <el-col :span="6" class="input-cell">
                <el-input v-model="row.gender" placeholder="请输入性别" @input="handleInput(index)" />
              </el-col>
              <el-col :span="6" class="input-cell">
                <el-input v-model="row.avatar" placeholder="请输入头像文件" @input="handleInput(index)" />
              </el-col>
            </el-row>
          </div>

          <el-button type="primary" @click="handleToNextStep">下一步</el-button>
        </div>

        <div v-if="active === 1">
          <div>
            <!-- 班级和课程名称在一行 -->
            <el-col :span="12">
              <el-row :gutter="0" class="form">
                <el-col :span="12">
                  <el-form-item label="班级：">
                    <el-input v-model="form.className" placeholder="请输入班级名称" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="课程名称：">
                    <el-input disabled v-model="form.courseName" placeholder="请输入课程名称" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>

            <!-- 座位表行数和列数在同一行 -->
            <el-col :span="12">
              <el-form-item label="座位表：">
                <el-row :gutter="0">
                  <el-col :span="12">
                    <el-form-item label="行数：" label-width="70px">
                      <el-input-number disabled v-model="form.rows" :min="1" placeholder="行数" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="列数：" label-width="60px">
                      <el-input-number disabled v-model="form.columns" :min="1" placeholder="列数" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </div>

          <el-row>
            <el-col :span="12">
              <div class="group-table">
                <el-row class="table-header">
                  <el-col :span="6" class="header-cell">组名</el-col>
                  <el-col :span="6" class="header-cell">组长</el-col>
                  <el-col :span="12" class="header-cell">成员</el-col>
                </el-row>
                <el-row v-for="(group, index) in groupData" :key="index" class="table-row">
                  <el-col :span="6" class="input-cell">
                    <el-input v-model="group.groupName" placeholder="组名" />
                  </el-col>
                  <el-col :span="6" class="input-cell">
                    <el-input v-model="group.leader" placeholder="组长" />
                  </el-col>
                  <el-col :span="12" class="input-cell">
                    <el-input v-model="group.members" placeholder="成员" />
                  </el-col>
                </el-row>
              </div>
            </el-col>

            <el-col :span="12">
              <div class="group-table">
                <el-row class="table-header">
                  <el-col :span="6" class="header-cell">组名</el-col>
                  <el-col :span="6" class="header-cell">组长</el-col>
                  <el-col :span="12" class="header-cell">成员</el-col>
                </el-row>
                <el-row v-for="(group, index) in groupData" :key="'second-' + index" class="table-row">
                  <el-col :span="6" class="input-cell">
                    <el-input v-model="group.groupName" placeholder="组名" />
                  </el-col>
                  <el-col :span="6" class="input-cell">
                    <el-input v-model="group.leader" placeholder="组长" />
                  </el-col>
                  <el-col :span="12" class="input-cell">
                    <el-input v-model="group.members" placeholder="成员" />
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>

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
        </div>

        <div v-if="active === 2"></div>

        <div v-if="active === 3"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElButton, ElStep, ElCol, ElDivider, ElFormItem, ElIcon, ElInput, ElInputNumber, ElPopconfirm, ElRow, ElSteps } from 'element-plus';
import { InfoFilled } from '@element-plus/icons-vue';
import { ref } from 'vue';

// 从第一步开始
const active = ref(0);
// 表单数据
const form = ref({
  className: '',
  rows: 1,
  columns: 1,
  courseName: '',
});
// 初始化表格数据
const studentData = ref([
  { studentId: '', name: '', gender: '', avatar: '' },
]);
// 初始化组数据
const groupData = ref([
  { groupName: '', leader: '', members: '' },
]);

// 处理输入事件，动态添加新行
const handleInput = (index: number) => {
  // 如果当前是最后一行且有输入，则添加新行
  const isLastRow = index === studentData.value.length - 1;
  const isRowFilled = Object.values(studentData.value[index]).some((value) => value.trim() !== '');
  if (isLastRow && isRowFilled) {
    studentData.value.push({ studentId: '', name: '', gender: '', avatar: '' });
  }
};

// 提交表单数据
const handleToNextStep = () => {
  active.value++;     // 提交后跳转到第二步
  console.log('提交表单数据：', form.value, studentData.value || groupData.value);
};

// 提交数据，弹出气泡框
const handleSubmit = () => {
  // 过滤掉空行
  studentData.value = studentData.value.filter(row =>
    Object.values(row).some(value => value.trim() !== '')
  );
  // 
  console.log('提交数据：', [groupData.value, form.value, studentData.value]);
};
</script>

<style lang="scss" scoped>
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
      justify-content: space-around;
    }

    .steps-content {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.el-divider--horizontal {
  margin: 0 0 20px 0;
}

.form {
  margin-bottom: 20px;
}

.el-table {
  width: 100%;
}

.el-row {
  margin-bottom: 10px;
}

.table-container {
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;

  .table-header {
    background-color: #d9f0ff;
    text-align: center;
    font-weight: bold;
    padding: 10px 0;

    .header-cell {
      text-align: center;
      padding: 5px 0;
    }
  }

  .table-row {
    margin-top: 10px;
    display: flex;
    align-items: center;

    .input-cell {
      padding: 0 10px;

      .el-input {
        width: 100%;
        text-align: center;
      }
    }
  }
}

.group-table {
  background-color: #d9f0ff;
  padding: 20px;
  border-radius: 8px;

  .table-header {
    text-align: center;
    font-weight: bold;
    padding: 10px 0;

    .header-cell {
      text-align: center;
      padding: 5px 0;
    }
  }

  .table-row {
    margin-top: 10px;
    display: flex;
    align-items: center;

    .input-cell {
      padding: 0 10px;

      .el-input {
        width: 100%;
        text-align: center;
      }
    }
  }
}

.el-button {
  margin-top: 20px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
