<template>
  <!-- 主体内容区域 -->
  <div class="alarm">
    <!-- 选择区域 -->
    <el-affix :offset="15">
      <div class="select-area">
        <!-- 座位表选择 -->
        <el-radio-group v-model="selectRoom" @change="handleSelectRoom($event as any)">
          <el-radio :value="1" size="large" border>班级座位表</el-radio>
          <el-radio :value="2" size="large" border style="margin-left: -30px;">机房座位表</el-radio>
        </el-radio-group>
        <el-divider direction="vertical" border-style="solid" style="margin-left: 15px;margin-right: 15px;" />
        <!-- 随机学生选择 -->
        <el-button-group>
          <el-button type="success" plain @click="selectStudent">随机选择学生</el-button>
          <el-button type="info" plain @click="data.selectList.splice(0)">取消选择</el-button>
        </el-button-group>
        <el-divider direction="vertical" border-style="solid" style="margin-left: 15px;margin-right: 15px;" />
        <!-- 成绩分数选择 -->
        <el-radio-group v-model="selectScore" @change="handleSelectScore($event as any)">
          <el-radio :value="1" size="large" border>全部</el-radio>
          <el-radio :value="2" size="large" border style="margin-left: -30px;">平时分</el-radio>
          <el-radio :value="3" size="large" border style="margin-left: -30px;">期中</el-radio>
          <el-radio :value="4" size="large" border style="margin-left: -30px;">期末</el-radio>
        </el-radio-group>
        <el-divider direction="vertical" border-style="solid" style="margin-left: 15px;margin-right: 15px;" />
        <!-- 点击进入管理界面 -->
        <TooltipButton element-name="button" btn-type="success" btn-plain @click="handleToManage">
          <template #content>
            <span>需要管理员权限<br />点击进入管理界面<br />能够修改学生信息</span>
          </template>进入管理界面
        </TooltipButton>
        <el-divider direction="vertical" border-style="hidden" style="margin-left: 15px;margin-right: 15px;" />
      </div>
      <el-divider class="divider" direction="horizontal" border-style="solid" />
    </el-affix>

    <!-- 座位表 -->
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="grid-content ep-bg-purple" />
      </el-col>
      <el-col :span="16">
        <div v-if="className" class="grid-content ep-bg-purple"
          style="text-align: center;font-size: 30px;font-family: '楷体';">
          {{ className }}上课座位表</div>
        <div v-else class="grid-content ep-bg-purple" style="text-align: center;font-size: 30px;font-family: '楷体';">
          上课座位表(请选择班级)</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content ep-bg-purple" />
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="1">
        <div class="passage">
          走廊
        </div>
      </el-col>
      <el-col :span="2">
        <el-row v-for="item in teamList['1']" :key="item">
          <el-col :span="20">
            <div class="seat" @click="addTeam(item)">
              <h3 class="font-sizes" style="color: red;">{{ item }}</h3>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="7" style="margin-left: -15px;">
        <el-row :gutter="20">
          <el-col :span="6" v-for="item in list['0']" :key="item">
            <div class="seat" @click="add(item)">
              <div class="font-sizes" v-if="data.stuSeat[item - 1]">
                <h3 :style="{ color: data.studentRoles[data.stuSeat[item - 1].stu] == '组长' ? 'red' : 'black' }">
                  {{ data.stuSeat[item - 1].stu }}
                </h3>
                <div style="margin-top: 10px;" v-if="data.stuSeat[item - 1].stu != ''">
                  <div v-if="selectScore === 1 || selectScore === 2">
                    <span>平时分：{{ data.stuSeat[item - 1].normalScore1 ? data.stuSeat[item - 1].normalScore1 : 0 }}</span>
                  </div>
                  <div v-if="selectScore === 1 || selectScore === 3">
                    <span>期中：{{ data.stuSeat[item - 1].midtermScore ? data.stuSeat[item - 1].midtermScore : 0 }}</span>
                  </div>
                  <div v-if="selectScore === 1 || selectScore === 4">
                    <span>期末：{{ data.stuSeat[item - 1].finalScore ? data.stuSeat[item - 1].finalScore : 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="1">
        <div class="passage">
          过道
        </div>
      </el-col>
      <el-col :span="2">
        <el-row v-for="item in teamList['0']" :key="item">
          <el-col :span="20">
            <div class="seat" @click="addTeam(item)">
              <h3 class="font-sizes" style="color: red;">{{ item }}</h3>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="10" style="margin-left: -15px;">
        <el-row :gutter="14">
          <el-col :span="4" v-for="item in list['1']" :key="item">
            <div class="seat" @click="add(item)">
              <div class="font-sizes" v-if="data.stuSeat[item - 1]">
                <h3 :style="{ color: data.studentRoles[data.stuSeat[item - 1].stu] == '组长' ? 'red' : 'black' }">
                  {{ data.stuSeat[item - 1].stu }}
                </h3>
                <div style="margin-top: 10px;" v-if="data.stuSeat[item - 1].stu != ''">
                  <div v-if="selectScore === 1 || selectScore === 2">
                    <span>平时分：{{ data.stuSeat[item - 1].normalScore1 ? data.stuSeat[item - 1].normalScore1 : 0 }}</span>
                  </div>
                  <div v-if="selectScore === 1 || selectScore === 3">
                    <span>期中：{{ data.stuSeat[item - 1].midtermScore ? data.stuSeat[item - 1].midtermScore : 0 }}</span>
                  </div>
                  <div v-if="selectScore === 1 || selectScore === 4">
                    <span>期末：{{ data.stuSeat[item - 1].finalScore ? data.stuSeat[item - 1].finalScore : 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom: 20px;">
      <el-col :span="8">
        <div class="grid-content ep-bg-purple" />
      </el-col>
      <el-col :span="8">
        <div class="grid-content ep-bg-purple" style="text-align: center;font-size: 30px;border: 2px solid black;">讲台
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content ep-bg-purple" />
      </el-col>
    </el-row>

    <!-- 导入导出按钮区域 -->
    <el-affix position="bottom" :offset="0">
      <el-divider class="divider-bottom" direction="horizontal" border-style="solid" />
      <div class="btn-group background-color-white">
        <el-button type="primary" @click="exportExcel">
          <el-icon>
            <Download />
          </el-icon>导出excel</el-button>
        <el-upload :limit="1" :ref="fileInput" class="upload-demo upload-container" :on-change="importExcel">
          <el-button type="primary">
            <el-icon>
              <Upload />
            </el-icon>
            导入excel文件
          </el-button>
        </el-upload>
      </div>
    </el-affix>
  </div>

  <!--  弹出的学生卡对话框  -->
  <StudentDialog v-model="dialogVisibleForStu" @updateStatu="dialogVisibleForStu = false" :width="720"
    :main-title="`${data.studentName}的学习卡`" :dialog-style="{ backgroundColor: '#f8f6f6' }">
    <StudentInfo :student-name="data.studentName" :req-student-img-url="reqStudentIMGURL"
      :env-image-path="data.envImagePath" @changeStatus="changeStatus" />
  </StudentDialog>

  <!--  弹出的团队卡对话框 -->
  <StudentDialog v-model="dialogVisibleForTeam" @updateStatu="dialogVisibleForTeam = false" :width="750"
    :main-title="`第${data.teamId}组学习卡`" :dialog-style="{ backgroundColor: '#f8f6f6' }">
    <TeamInfo :team-id="data.teamId" :env-image-path="data.envImagePath" @changeStatus="changeStatus" />
  </StudentDialog>
</template>

<script lang="ts" setup>
import { pushStudentStatusToRedis, pushTeamStatusToRedis } from "@/utils/api/pushToRedis";
import { reactive, computed, ref, onMounted, watchEffect } from 'vue';
import { createElNotification } from "@/utils/dataOption/ElementOpt";
import { handleManage } from '@/utils/dataOption/routerOpt';
import { importAsyncComponent } from "@/component.ts";
import { saveExcelFile } from "@/utils/api/apiPromiss";
import StudentDialog from "@/components/InfoDialog.vue";
import TooltipButton from '@/components/TooltipButton.vue';
import { Download, Upload } from '@element-plus/icons-vue';
import type { UploadProps } from 'element-plus';
import { ElMessage } from "element-plus";
import { useDataOptions } from "@/store/dataOptions";
import { useConfig } from "@/store/globalConfig";
// 导入异步组件
const StudentInfo = importAsyncComponent(() => import("@/views/SeatData/studentInfo/studentInfo.vue"));
const TeamInfo = importAsyncComponent(() => import("@/views/SeatData/teamInfo/teamInfo.vue"));

const configStore = useConfig();
const importFileStore = useDataOptions();
const fileInput = ref("");
const selectRoom = ref(configStore.selectedSeatData);     // 获取座位表状态
const selectScore = ref(configStore.selectedScoreStatu);  // 获取成绩状态
const className = ref("");  // 获取班级名称
const dialogVisibleForStu = ref(false);  // 定义学生卡对话框的状态
const dialogVisibleForTeam = ref(false); // 定义团队卡对话框的状态
// 获取成员团队状态
let teamListData = ref([]);
// 获取图片路径
const reqStudentIMGURL = ref<any>([]);
const rows = ref(7);  // 行数
const cols = ref(10);  // 列数
// let stuManageInfoData = ref({});  // 保存团队数据
const data = reactive({
  stuSeat: [] as any[],            // 获取学生的数据==》studentList的对象
  //  变量的值动态生成一个 7 行 10 列的二维数组，并且座位编号也会按照顺序排列。
  seatList: Array.from({ length: rows.value }, (_, rowIndex) =>
    Array.from({ length: cols.value }, (_, colIndex) => rowIndex * cols.value + colIndex + 1)
  ) as any[][],
  // 模拟后台返回的团队列表getExcelFile
  teamList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  studentList: {} as any,          // 将seatList和stuSeat合并成新的对象
  selectedStuIndices: [],          // 记录已选择的学生索引(随机选择的学生列表)
  selectList: [] as number[],      // 所选座位表id
  selectTeamList: [] as number[],  // 获取所选团队的id
  studentName: '' as string,       // 获取学生姓名
  teamId: '' as any,               // 获取团队id
  filePath: importFileStore.filePath,   // 获取文件路径(用于获取文件名路径，并写入保存文件)
  envImagePath: process.env.VUE_APP_IMAGE_PATH, // 获取环境图片路径
  // 新增字段，用于存储学生角色信息  {} as { [key: string]: string }
  studentRoles: importFileStore.studentRoles,
});

const list = computed(() => {
  let arr = [[] as number[], [] as number[]];  // 定义二维数组的变位表

  data.seatList.forEach(row => {
    row.forEach(item => {
      // 第一、二列添加到一个数组
      if (item % 10 == 1 || item % 10 == 2 || item % 10 == 3 || item % 10 == 4) {
        arr['0'].push(item);
      } else {
        // 中间列
        arr['1'].push(item);
      }
    });
  });
  return arr;
});
// （组位）根据每行多少列拆分数组，目前1行8列(根据自己需求来，如果只有6列修改%8=>%6)
const teamList = computed(() => {
  let arr = [[] as number[], [] as number[]];  // 定义二维数组的变位表

  for (const key in data.teamList) {
    let item = data.teamList[key];
    // 第一、二列添加到一个数组
    if (item % 2 == 0) {
      arr['0'].push(item);
      // 第七、八列添加打一个数组, ==7位列数减一(根据自己需求来)
    } else {
      // 中间列
      arr['1'].push(item);
    }
  }
  // 在循环结束后对两个数组进行倒序
  arr['0'].reverse();
  arr['1'].reverse();
  return arr;
});

// 获取学生管理信息
const getStuManageInfoData = async () => {
  return new Promise((resolve, reject) => {
    let setStudentTeamStatu = new Set();

    importFileStore.getStudentTeamStatu(data.teamList, teamListData).then((res: any) => {
      // console.log("getStudentTeamStatu", res);
      for (let i = 0; i < res.length; i++) { // 遍历数组
        const element = res[i];
        setStudentTeamStatu.add(element);
      }
      const result = setStudentTeamStatu.values().next().value;
      resolve(result);  // 返回结果
    }).catch(error => {
      reject(error);  // 处理错误
    });
  });
};
const requestData = async () => {
  let setStudentTeamStatu: any = new Set();

  // 获取学生管理信息
  const res: any = await getStuManageInfoData();
  // 遍历结果并添加到 Set 中以确保唯一性
  res.forEach((item: any) => {
    setStudentTeamStatu.add(JSON.stringify(item));
  });
  // 将 Set 转换为数组并解析 JSON 字符串
  setStudentTeamStatu = Array.from(setStudentTeamStatu).map((item: any) => JSON.parse(item));

  // 合并 stuManageInfoData 到 data.stuSeat
  data.stuSeat = data.stuSeat.map(seat => {
    const studentInfo = setStudentTeamStatu.find((info: any) => info.stuName === seat.stu);
    return studentInfo ? { ...seat, ...studentInfo } : seat;
  });

  // console.log("data.stuSeat", data.stuSeat);
  // console.log("setStudentTeamStatu", setStudentTeamStatu);
  return setStudentTeamStatu;
};

// 点击进入管理页面（管理员用户使用）
const handleToManage = () => handleManage();

// 随机选择学生
const selectStudent = () => {
  try {
    data.selectList = [];
    const validStudents = data.studentList.filter(student =>
      student.stu && student.stu !== '**' && student.stu !== '');
    // 获取所有有效的学生索引
    const validIndices = validStudents.map((_, index) => index);
    // console.log("validIndices", validStudents, validIndices);

    // 检查学生列表是否为空
    if (validIndices.length == 0) {
      ElMessage.error('学生列表为空，无法选择随机学生，请查看文件是否有数据或是否正确导入！');
      return false;
    }
    // 如果data.selectedStuIndices长度等于学生validStudents的长度，则清空已选学生列表
    if (data.selectedStuIndices.length == validIndices.length) {
      data.selectedStuIndices = [];
    }

    let randomIndex;
    // 确保随机索引不重复
    do {
      randomIndex = Math.floor(Math.random() * validIndices.length);
    } while (data.selectedStuIndices.includes(randomIndex));

    // 将随机索引添加到已选择的索引列表中，用于存储已选择的学生，防止重复选择
    data.selectedStuIndices.push(randomIndex);
    // 获取随机选择的学生对象
    const randomStudent = validStudents[randomIndex];
    data.studentName = randomStudent.stu;
    // 获取随机选择的座位id，用于标注
    // 如果已选座位列表中已存在该座位，则删除该座位，否则直接添加
    const seatId = randomStudent.seatId;
    data.selectList.push(seatId);
    // 弹出学生信息对话框
    dialogVisibleForStu.value = true;
  } catch (error) {
    ElMessage.error('Error selecting random student:', error);
    throw new Error('Failed to select random student');
  }
};

// 截取文件名
const getclassName = () => {
  const filename = importFileStore.fileName;
  // 找到 '.' 的位置
  const dotIndex = filename.indexOf('.');
  // 截取从开头到 '.' 之前的部分
  const classNamefront = filename.substring(0, dotIndex);
  /* 如果需要进一步截取到"班"为止
   找到 '班' 的位置，并加上1确保包含"班"字 */
  const classEndIndex = classNamefront.indexOf('班') + 1;
  className.value = classNamefront.substring(0, classEndIndex);
  // console.log(className.value);
};

// 导入excel   event: { target: { files: any } }
const importExcel: UploadProps['onChange'] = async (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
  importFileStore.importExcel(uploadFile);
  // 获取团队状态
  importFileStore.getStudentTeamStatu(data.teamList, teamListData);
  getStuManageInfoData();
  await requestData();
  getImgURL();

  setTimeout(() => {
    fileInput.value = importFileStore.fileName;
    ImportFile();
  }, 4000);
};
const ImportFile = () => {
  try {
    for (let i = 0; i < data.teamList.length; i++) {
      const team = data.teamList[i];
      // console.log("team", team);
      pushTeamStatusToRedis(team);
    }
    importFileStore.students.forEach(student => {
      // console.log("student", student.stuName);
      pushStudentStatusToRedis(student.stuName);
    });
  } catch (error) {
    ElMessage.error(error);
  }
};

// 学生座位表的选择(二维数组写法)
const handleSelectRoom = (event: any) => {
  // console.log("radio1.value", event);
  configStore.setSelectedSeatData(event);  // 设置学生座位表选择数据

  // 扁平化 seatList
  const flatSeatList = data.seatList.flat();
  // 扁平化 classSeat
  const classSeatList = importFileStore.classSeat.flat();
  // 扁平化 classSeat
  const computerRoomSeat = importFileStore.computerRoomSeat.flat();
  // 判断是否为空，如果为空，则返回
  if (classSeatList.length == 0 || computerRoomSeat.length == 0) return;

  if (configStore.selectedSeatData == 1) {
    data.studentList = flatSeatList.map((seatId, index) => ({
      seatId,
      stu: classSeatList[index] !== undefined
        ? (classSeatList[index] === '**' ? '' : classSeatList[index])
        : null  // 确保不会超出范围
    }));
  } else {
    data.studentList = flatSeatList.map((seatId, index) => ({
      seatId,
      stu: computerRoomSeat[index] !== undefined
        ? (computerRoomSeat[index] === '**' ? '' : computerRoomSeat[index])
        : null   // 确保不会超出范围
    }));
  }
  data.stuSeat = data.studentList;
};

// 选择成绩表
const handleSelectScore = (event: any) => configStore.setSelectedScoreStatu(event);

// 选择座位表
const add = (id: number) => {
  data.selectList = [];
  /** 如果已经有一个被选择（selectList 的 length 大于1），
    * 则取消被选中的（selectList 的 index 为0的）*/
  data.selectList.push(id);
  // console.log("data.studentList", data.studentList);
  // 如果data.studentList为空，则弹出错误提示
  if (Object.keys(data.studentList).length === 0) {
    createElNotification('错误', '请先导入数据！', 'error', 2000);
    return false;
  }
  // data.studentList的id是 data.studentList的数组下标 所以-1
  data.studentName = data.studentList[id - 1].stu;
  // 如果选中的位置没有名字，则不执行后面代码
  if (data.studentName == '') {
    createElNotification('提示', '该座位并没有学生，可在此处添加学生信息，或选择其他座位', 'warning', 2000);
    return false;
  }
  dialogVisibleForStu.value = true;
};

// 选择组队列表
const addTeam = (id: number) => {
  data.selectTeamList = [];
  /** 如果已经有一个被选择（selectTeamList 的 length 大于1），
    * 则取消被选中的（selectTeamList 的 index 为0的）*/
  data.selectTeamList.push(id);
  // data.studentList的id是 data.studentList的数组下标 所以-1
  // data.teamId = importFile.teamIdList[seatId - 1];
  // console.log("data.teamId", data.teamId);
  data.teamId = data.teamList[id - 1];

  dialogVisibleForTeam.value = true;
};

// 改变状态，并获取学生管理信息
const changeStatus = async (event: any) => {
  console.log("changeStatus", event);
  if (event) {
    getStuManageInfoData();
    await requestData();
  }
};

// 导出excel文件(测试阶段)
const exportExcel = async () => {
  const validStudents = data.studentList
    .filter(student => student.stu && student.stu !== '**' && student.stu !== '')
    .map(student => student.stu);
  // console.log("validStudents", validStudents);
  saveExcelFile({
    fileName: importFileStore.fileName,
    filePath: importFileStore.filePath,
    stuManageInfoData: await requestData(),
    studentList: validStudents,
    teamList: data.teamList,
  }).then(res => {
    console.log(res);
  });
  ElMessage.success({ message: '导出成功', duration: 1000 });
};

// 搜索图片路径
const getImgURL = () => {
  const imgFiles = require.context("/public/images/", true, /\.jpg$/).keys();
  // 创建一个 Set 来存储所有第二级目录的名称
  const secondLevelDirs = new Set();

  // 获取二级目录
  imgFiles.forEach(key => {
    // 假设路径是类似 "/dir1/dir2/image1.jpg" 的形式
    // 我们通过分割路径把 '/' 去掉，并把 '.' 去掉，最后把数组的最后一个（包含.jpg）元素删除
    const parts = key.split('/').slice(1);
    parts.pop();
    // console.log(parts, parts.length);
    // 把['24应2', '24应2照片']转成字符串，在字符串之间添加/号，并添加到 Set 中
    const secondLevelDir = parts.join('/');
    // console.log(secondLevelDir);
    // 添加到 Set 中以去重
    secondLevelDirs.add(secondLevelDir);
  });
  // 把 Set 转换为数组
  const myArray = [];
  for (const secondLevelDirsString of secondLevelDirs) {
    //  在这里，secondLevelDirsString 已经是字符串了，所以我们直接将其添加到数组中
    myArray.push(secondLevelDirsString);
  }
  // 筛选出包含 className 的数组元素
  const match = myArray.filter(item => item.includes(className.value));
  // 如果存在匹配的数组元素，则将其赋值给 reqStudentIMGURL,
  // 如果不存在匹配的数组元素，则使用默认值
  match.length > 0 ? reqStudentIMGURL.value = match[0] : reqStudentIMGURL.value = myArray[0];
};

watchEffect(() => {
  handleSelectRoom(selectRoom.value);
  getclassName();
  getStuManageInfoData();
});
onMounted(() => { getImgURL(); });
</script>

<style lang="scss" scoped>
.divider {
  margin: 0 0 10px 0;
}

.select-area {
  margin-top: -30px;
  padding-top: 20px;
  padding-left: 20px;
  padding-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  /* 添加此行，确保背景色 */
}

.alarm {
  padding: 2rem;
  margin: 2rem;
  border-radius: 7px;
  background: #fff;

  .passage {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .seat {
    width: 100%;
    height: 100px;
    border: solid 1px blue;
    text-align: center;
    cursor: pointer;
  }

  .seat:hover {
    background: rgba(0, 0, 255, 0.1);
    border: solid 1px blue;
    color: #000;
    box-shadow: 0 0 5px #000;
    cursor: pointer;
  }

  // .seat.active {
  //   background: rgba(0, 0, 255, 0.1);
  //   border: solid 1px blue;
  //   color: #000;
  //   box-shadow: 0 0 5px #000;
  //   cursor: pointer;
  // }

  ::v-deep(.el-col) {
    margin: 0.5rem 0;
  }
}

.btn-group {
  display: flex;
  // justify-content: space-around;
  justify-content: flex-start;
  padding-top: 2rem;
  padding-left: 20px;
  width: 30%;
  height: 70px;
}

.background-color-white {
  width: 100%;
  background-color: white;
}

.el-upload-list {
  list-style: none;
  margin: 10px 0 0;
  padding: 0;
  position: relative;
  float: left;
}

.student_info {
  .top {
    margin-bottom: 2rem;
  }
}

.upload-container {
  margin-left: 100px;
}

.font-sizes {
  font-size: 14px;
}

.el-divider--horizontal {
  margin: 0 0;
}
</style>
