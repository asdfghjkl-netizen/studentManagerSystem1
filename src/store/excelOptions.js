import { defineStore } from "pinia";
import { getExcelFile } from "@/utils/api/apiPromiss";
import { watchEffect } from "vue";
import { ElMessage } from "element-plus";

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
        filePath: '',         // 获取excel文件路径
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
                    if (res.code != 200) {
                        ElMessage.error("获取文件失败");
                        return;
                    }
                    this.filePath = res.filePath;    // 文件路径
                    this.teamLists = res.data.teamLists;  // 团队信息
                    this.classSeat = res.data.classSeat;  // 教室坐位信息
                    this.computerRoomSeat = res.data.computerRoomSeat;  // 计算机教室坐位信息
                    this.students = res.data.students;  // 学生信息
                    // this.buffer = res.data.buffer;   // 文件buffer
                    ElMessage.success({ message: res.message, duration: 1000 })
                })
            })
            // console.log("this.buffer", this.buffer);
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
