<template>
  <!-- 选择区域 -->
  <div style="position: absolute; margin-top: -10px; margin-left: 10px;">
    <!-- 座位表选择 -->
    <el-radio-group v-model="radio1" @change="handleSelectRoom($event as any)" style="margin-right: 30px;">
      <el-radio value="1" size="large" border>班级座位表</el-radio>
      <el-radio value="2" size="large" border style="margin-left: -20px;">机房座位表</el-radio>
    </el-radio-group>
    <!-- 随机学生选择 -->
    <el-button-group>
      <el-button type="success" plain @click="selectStudent">随机选择学生</el-button>
      <el-button type="info" plain @click="data.selectList.splice(0)">取消选择</el-button>
    </el-button-group>
  </div>

  <!-- 内容区域 -->
  <div class="alarm">
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="grid-content ep-bg-purple" />
      </el-col>
      <el-col :span="16">
        <div class="grid-content ep-bg-purple" style="text-align: center;font-size: 30px;font-family: '楷体';">
          {{ className }}上课座位表</div>
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
            <div :class="['seat', data.selectTeamList.indexOf(item) > -1 ? 'active' : '']" @click="addTeam(item)">
              <h3 style="color: red;">{{ item }}组</h3>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="7" style="margin-left: -15px;">
        <el-row :gutter="20">
          <el-col :span="6" v-for="item in list['0']" :key="item">
            <div :class="['seat', data.selectList.indexOf(item) > -1 ? 'active' : '']" @click="add(item)">
              <h3 :style="{ color: importFile.teamLeaders.includes(data.stuSeat[item - 1].stu) ? 'blue' : '' }"
                v-if="data.stuSeat[item - 1]">{{ data.stuSeat[item - 1].stu }}</h3>
              <h3 v-else></h3>
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
            <div :class="['seat', data.selectTeamList.indexOf(item) > -1 ? 'active' : '']" @click="addTeam(item)">
              <h3 style="color: red;">{{ item }}组</h3>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="10" style="margin-left: -15px;">
        <el-row :gutter="20">
          <el-col :span="4" v-for="item in list['1']" :key="item">
            <div :class="['seat', data.selectList.indexOf(item) > -1 ? 'active' : '']" @click="add(item)">
              <h3 :style="{ color: importFile.teamLeaders.includes(data.stuSeat[item - 1].stu) ? 'blue' : '' }"
                v-if="data.stuSeat[item - 1]">{{ data.stuSeat[item - 1].stu }}</h3>
              <h3 v-else></h3>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="20">
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
  </div>
  <!-- 导入导出按钮 -->
  <div class="btn-group">
    <el-button type="primary" @click="exportExcel">
      <el-icon>
        <Download />
      </el-icon>
      导出excel</el-button>
    <el-upload :ref="fileInput" class="upload-demo upload-container" :on-change="importExcel">
      <el-button type="primary">
        <el-icon>
          <Upload />
        </el-icon>
        导入excel文件
      </el-button>
    </el-upload>
  </div>

  <!--  
    弹出的学生卡对话框   
      require==>返回依赖项的导出。调用是同步的。不会触发对服务器的请求。编译器确保依赖项可用。
      close-on-click-modal==>是否可以通过点击 modal 关闭 Dialog
      destroy-on-close==>当关闭 Dialog 时，销毁其中的元素
    -->
  <el-dialog draggable destroy-on-close v-model="dialogVisibleForStu" :title="`${data.studentName}的学习卡`" width="720"
    style="background-color: #f8f6f6">
    <!--  有内容加载  -->
    <div v-if="data.studentName" class="student_info">
      <div class="top">
        <div class="stu-img">
          <el-image :src="require(`/public/images/${reqStudentIMGURL}/${data.studentName}.jpg`)" :alt="data.studentName"
            style="height: 315px;" class="img" />
        </div>
        <StudentInfo :student-name="data.studentName" :team-list="data.teamList" :is-student="data.isStudent" />
      </div>
      <!--  下部表格部分:team-leaders="data.teamLeaders"   -->
      <div class="student-info-bottom">
        <StudentTable :student-name="data.studentName" :is-student-data="data.isStudentData" />
      </div>
    </div>
    <!--  无内容加载  -->
    <span v-else>无法加载该地区图片和信息</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogVisibleForStu = false">确定</el-button>
      </div>
    </template>
  </el-dialog>

  <!--  弹出的团队卡对话框 -->
  <el-dialog draggable destroy-on-close v-model="dialogVisible" :title="`第${data.teamId}组学习卡`" width="750"
    style="background-color: #f8f6f6">
    <!--  有内容加载  -->
    <div v-if="data.teamId" class="student_info">
      <div class="top">
        <div class="stu-img">
          <el-image :src="require('../../public/images/image/team.jpg')" style="height: 250px;" class="img" />
        </div>
        <TeamInfo :team-id="data.teamId" :is-student="data.isStudent = false" />
      </div>
      <!--  下部表格部分  -->
      <div class="student-info-bottom">
        <TeamTable :team-id="data.teamId" :is-student-data="data.isStudentData = false" />
      </div>
    </div>
    <!--  无内容加载  -->
    <span v-else>无法加载该地区图片和信息</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确定</el-button>
      </div>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>
import type { UploadProps } from 'element-plus';
import ExcelJS from "exceljs";
import StudentTable from "@/components/studentInfo/studentTable.vue";
import TeamTable from "@/components/teamInfo/teamTable.vue";
import StudentInfo from "@/components/studentInfo/studentInfo.vue";
import TeamInfo from "@/components/teamInfo/teamInfo.vue";
import { reactive, computed, ref, onMounted, watchEffect } from 'vue';
import { ElMessage, ElNotification } from "element-plus";
import { importExcelFile } from "@/store/excelOptions";
import { getFileList, getStudentStatus, getTeamStatus } from "@/utils/api/apiPromiss";
import { uploadExcelFile } from "@/utils/api/apiPromiss";

const importFile = importExcelFile();
const fileInput = ref("");
// 学生座位表选择数据，默认为1---》班级座位表
const radio1 = ref("1");
// 定义学生卡对话框的状态
const dialogVisibleForStu = ref(false)
const dialogVisible = ref(false)
// 获取图片路径
const reqStudentIMGURL = ref([]);
const data = reactive({
  stuSeat: [] as any[],              // 获取学生的数据==》studentList的对象
  // 模拟后台返回的座位表
  seatList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
    61, 62, 63, 64, 65, 66, 67, 68, 69, 70],
  // 模拟后台返回的团队列表getExcelFile
  teamList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  studentList: {} as any,          // 将seatList和stuSeat合并成新的对象
  selectedStuIndices: [],          // 记录已选择的学生索引(随机选择的学生列表)
  selectList: [] as number[],      // 所选座位表id
  selectTeamList: [] as number[],  // 获取所选团队的id
  studentName: '' as string,       // 获取学生姓名
  teamId: '' as any,               // 获取团队id
  teamLists: importFile.teamLists, // 获取团队列表 
  isStudent: true,                 // 判断是否是学生的信息块
  isStudentData: true,             // 判断是否是学生的数据块
})
// 过滤掉无效的学生
let stuSta = ref({});

// 随机选择学生
const selectStudent = () => {
  try {
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
    if (data.selectList.indexOf(seatId) > -1) {
      let index = data.selectList.indexOf(seatId);
      data.selectList.splice(index, 1);
    } else if (data.selectList.length > 0) {
      data.selectList.splice(0);
      data.selectList.push(seatId);
    } else {
      data.selectList.push(seatId);
    }
    // console.log("randomStudent", randomIndex, randomStudent, data.selectedStuIndices);
    // 弹出学生信息对话框
    dialogVisibleForStu.value = true;
  } catch (error) {
    ElMessage.error('Error selecting random student:', error);
    throw new Error('Failed to select random student');
  }
}

// （座位表）根据每行多少列拆分数组，目前1行8列(根据自己需求来，如果只有6列修改%8=>%6)
const list = computed(() => {
  let arr = [[] as number[], [] as number[]]  // 定义二维数组的变位表

  for (const key in data.seatList) {
    let item = data.seatList[key]
    // 第一、二列添加到一个数组
    if (item % 10 == 1 || item % 10 == 2 || item % 10 == 3 || item % 10 == 4) {
      arr['0'].push(item)
      // 第七、八列添加打一个数组, ==7位列数减一(根据自己需求来)
    } else {
      // 中间列
      arr['1'].push(item)
    }
  }
  return arr
})

// （组位）根据每行多少列拆分数组，目前1行8列(根据自己需求来，如果只有6列修改%8=>%6)
const teamList = computed(() => {
  let arr = [[] as number[], [] as number[]]  // 定义二维数组的变位表

  for (const key in data.teamList) {
    let item = data.teamList[key]
    // 第一、二列添加到一个数组
    if (item % 2 == 0) {
      arr['0'].push(item)
      // 第七、八列添加打一个数组, ==7位列数减一(根据自己需求来)
    } else {
      // 中间列
      arr['1'].push(item);
    }
  }
  // 在循环结束后对两个数组进行倒序
  arr['0'].reverse();
  arr['1'].reverse();
  return arr
})

// 获取班级名称
const className = ref("");

// 截取文件名
const getclassName = () => {
  const filename = importFile.fileName;
  // 找到 '.' 的位置
  const dotIndex = filename.indexOf('.');
  // 截取从开头到 '.' 之前的部分
  const classNamefront = filename.substring(0, dotIndex);
  // 如果需要进一步截取到“班”为止
  // 找到 '班' 的位置，并加上1确保包含“班”字
  const classEndIndex = classNamefront.indexOf('班') + 1;
  className.value = classNamefront.substring(0, classEndIndex);
  // console.log(className.value);
}

// 导入excel   event: { target: { files: any } }
const importExcel: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
  importFile.importExcel(uploadFile);
  fileInput.value = importFile.fileName;

  // 使用 setTimeout 延时 2 秒
  // const delay = Math.floor(Math.random() * 1000) + 4000; // 随机延时 4 秒
  setTimeout(() => {
    ImportFile();
  }, 4000);
}
// 解析文件 -- 发送给后端操作
const ImportFile = () => {
  try {
    for (let i = 0; i < data.teamList.length; i++) {
      const team = data.teamList[i];
      // console.log("team", team);
      getTeamStatus(team).then(res => {
        console.log("teamstatus", res);
      });
    }
    importFile.students.forEach(student => {
      console.log("student", student.stuName);
      getStudentStatus(student.stuName).then(res => {
        console.log("student", res)
        stuSta.value = res.data;
        // console.log("stuSta", stuSta);
      });
    });
  } catch (error) {
    ElMessage.error(error);
  }
}

// 导出excel文件(测试阶段)
const exportExcel = () => {
  // 创建工作簿
  const workbook = new ExcelJS.Workbook();
  // 添加工作表，名为sheet1
  const sheet1 = workbook.addWorksheet("sheet1");
  // 添加表头列数据
  sheet1.columns = [
    { header: "姓名", key: "name", width: 20 },
    { header: "年龄", key: "age", width: 10 },
    { header: "身高", key: "height", width: 10 },
    { header: "体重", key: "weight", width: 10 },
  ];
  // 添加内容列数据
  sheet1.addRow({ sort: 1, name: "张三", age: 18, height: 175, weight: 74 });
  sheet1.addRow({ sort: 2, name: "李四", age: 22, height: 177, weight: 88 });
  sheet1.addRow({ sort: 3, name: "王五", age: 53, height: 155, weight: 62 });
  // 读取行数据
  sheet1.getRow(1).eachCell((cell, rowIdx) => {
    console.log("行数据", cell.value, rowIdx);
  });
  // 读取列数据,可以通过键(name)，字母(B)和基于id(1)的列号访问单个列
  sheet1.getColumn("name").eachCell((cell, rowIdx) => {
    console.log("列数据", cell.value, rowIdx);
  });
  // 保存文件
  workbook.xlsx.writeBuffer().then(buffer => {
    // 创建一个Blob对象
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    // 定义文件的名称sessionStorage.getItem("fileName")
    const fileName = "123.xlsx";
    const encodedFileName = encodeURIComponent(fileName); // 对文件名进行编码
    // 创建一个FormData对象，并将Blob对象作为文件添加进去
    const formData = new FormData();
    formData.append('file', blob, encodedFileName);
    // 调用上传文件的接口
    uploadExcelFile(formData).then(res => {
      // console.log(res);
      if (res.status != 200) {
        ElMessage.error(res.data.error);
        return;
      }
      ElMessage.success(res.data.message + '\xa0' + res.data.fileName);
    }).catch(error => {
      ElMessage.error("保存失败", error);
    });
    // 监听页面刷新
    window.onbeforeunload = function (event) {
      event.returnValue = "我在这写点东西...";
    };
  });
}

// 学生座位表的选择
const handleSelectRoom = (event: any) => {
  radio1.value = event;

  if (radio1.value == "1") {
    data.studentList = data.seatList.map((seatId, stu) => ({ seatId, stu: importFile.classSeat[stu] }));
  } else {
    data.studentList = data.seatList.map((seatId, stu) => ({ seatId, stu: importFile.computerRoomSeat[stu] }));
  }
  data.stuSeat = data.studentList;
}

// 点击座位的代码复用
const chlickSeat = (seatId: number) => {
  /** 如果已经有一个被选择（selectList 的 length 大于1），
    * 则取消被选中的（selectList 的 index 为0的）*/
  data.selectList.push(seatId);
  // data.studentList的id是 data.studentList的数组下标 所以-1
  data.studentName = data.studentList[seatId - 1].stu;
  // 如果选中的位置没有名字，则不执行后面代码
  if (data.studentName == '**') {
    ElNotification.warning({
      title: "提示",
      message: "该座位并没有学生，可在此处添加学生信息，或选择其他座位",
      duration: 2000
    });
    return false;
  }
  dialogVisibleForStu.value = true;
}

// 选择座位表
const add = (id: number) => {
  // 已选则删除，否则添加
  if (data.selectList.indexOf(id) > -1) {
    let index = data.selectList.indexOf(id);
    data.selectList.splice(index, 1);
  }
  // 如果有选项，则清空后再添加
  else if (data.selectList.length > 0) {
    data.selectList.splice(0);
    chlickSeat(id);
  }
  // 否则直接添加
  else {
    chlickSeat(id);
  }
}

const chlickTeam = (seatId: number) => {
  /** 如果已经有一个被选择（selectTeamList 的 length 大于1），
    * 则取消被选中的（selectTeamList 的 index 为0的）*/
  data.selectTeamList.push(seatId);
  // data.studentList的id是 data.studentList的数组下标 所以-1
  // data.teamId = importFile.teamIdList[seatId - 1];
  // console.log("data.teamId", data.teamId);
  data.teamId = data.teamList[seatId - 1];

  dialogVisible.value = true;
}

// 选择组队列表
const addTeam = (id: number) => {
  // 已选则删除，否则添加
  if (data.selectTeamList.indexOf(id) > -1) {
    let index = data.selectTeamList.indexOf(id);
    data.selectTeamList.splice(index, 1);
  }
  // 如果有选项，则清空后再添加
  else if (data.selectTeamList.length > 0) {
    data.selectTeamList.splice(0);
    chlickTeam(id);
  }
  // 否则直接添加
  else {
    chlickTeam(id);
  }
}

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
  })
  // console.log(secondLevelDirs);

  // 提取二级目录的Set对象并转换成数组
  const myArray = [];
  for (const secondLevelDirsString of secondLevelDirs) {
    //  在这里，secondLevelDirsString 已经是字符串了，所以我们直接将其添加到数组中
    myArray.push(secondLevelDirsString);
  }
  // console.log(myArray);
  reqStudentIMGURL.value = myArray[0]
}

watchEffect(() => {
  importFile.getTeamList(data.teamLists);
  handleSelectRoom(radio1.value);
  getclassName();
})
onMounted(() => {
  getImgURL()
  getFileList().then(res => { console.log(res) })
})
</script>

<style lang="scss" scoped>
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
  justify-content: space-around;
  margin-top: 2rem;
  width: 30%;
  height: 70px;
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
    display: flex;
    align-items: center;
    margin-bottom: 2rem;

    .stu-img {
      background-color: white;

      .img {
        border-radius: 5px;
        margin: 15px 30px;
      }
    }
  }
}
</style>
