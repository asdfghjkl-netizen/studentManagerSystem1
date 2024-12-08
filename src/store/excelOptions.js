import { defineStore } from "pinia";
import { getExcelFile } from "@/utils/api/apiPromiss";
import { watchEffect } from "vue";
import { ElMessage } from "element-plus";
// import { getStudentStatus } from "@/utils/api/apiPromiss";

// defineStore('userInfo',{})  userInfo就是这个仓库的名称name
export const importExcelFile = defineStore('excelFile', {
    // 初始化数据
    state: () => ({
        teamLists: [],        // 获取团队列表数据（团队名称，团队人数，团队成员）
        students: [],         // 获取学生列表数据（学号，姓名，性别）
        classSeat: [],        // 获取班级的座位表数据
        computerRoomSeat: [], // 获取学生机房座位表的数据
        files: File,          // 获取上传的文件的文件对象
        fileName: '',         // 获取excel文件名
        // buffer: '',           // 获取上传的文件的二进制流
    }),
    // 计算属性 
    getters: {},
    // 方法
    actions: {
        // 导入excel 以文件名导入
        importExcel(uploadFile) {
            // console.log("uploadFile", uploadFile);
            if (!uploadFile.name) {
                console.log('No file selected');
                return;
            }
            // 设置文件名
            this.fileName = uploadFile.name;
            sessionStorage.setItem('fileName', this.fileName);
            // 去除uploadFile.raw里的uid
            delete uploadFile.raw.uid;
            // 设置原始文件信息
            this.files = uploadFile.raw;
            // console.log('this.files', this.files);

            // 获取学生信息
            watchEffect(() => {
                getExcelFile({ fileName: this.fileName }).then(res => {
                    console.log("resFile", res);
                    this.teamLists = res.data.teamLists;
                    this.classSeat = res.data.classSeat;
                    this.computerRoomSeat = res.data.computerRoomSeat;
                    this.students = res.data.students;
                    // res.data.students.forEach(student => {
                    //     // console.log("student", student.stuName);
                    //     getStudentStatus(student.stuName).then(res => {
                    //         console.log("student", res)
                    //     });
                    // });
                    // this.buffer = res.data.buffer;
                    ElMessage.success({ message: res.message, duration: 1000 })
                })
            })
            console.log("this.buffer", this.buffer);
        },
        // 获取importFile.teamLists的数据
        getTeamList(teamLists) {
            // 定义定时器
            let timerId = null;
            teamLists = this.teamLists;
            // console.log(teamLists);
            this.teamLeaders = [];
            this.teamIdList = [];
            this.teamMembers = [];
            // 先转换成数组
            teamLists.forEach((item) => {
                // console.log(item, item.leader);
                this.teamLeaders.push(item.leader);
                this.teamIdList.push(item.teamId);
                this.teamMembers.push(item.member);
            })
            timerId = setTimeout(() => {
                this.getTeamList(teamLists)
            }, 1000);
            if (timerId) {
                clearTimeout(timerId);
                timerId = null;
            }
        },
    },

    // 使用持久化
    persist: {
        enabled: true,
        storage: localStorage,
        key: "excelFile",
        path: ["students", "classSeat", "computerRoomSeat", "files",
            "teamLists", "ecxelFile", "buffer"]
    },
})
