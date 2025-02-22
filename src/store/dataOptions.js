import { getTeamList } from "@/utils/dataOption/teamOpt";
import { getExcelFile } from "@/utils/api/apiPromiss";
import { ElMessage } from "element-plus";
import { defineStore } from "pinia";

// defineStore('userInfo',{})  userInfo就是这个仓库的名称name
export const useDataOptions = defineStore('dataOptions', {
    // 初始化数据
    state: () => ({
        selectedClass: '',    // 选择班级的值
        selectClassList: [],  // 班级列表

        teamLists: [],        // 获取团队列表数据（团队名称，团队人数，团队成员）
        students: [],         // 获取学生列表数据（学号，姓名，性别）
        classSeat: [],        // 获取班级的座位表数据
        computerRoomSeat: [], // 获取学生机房座位表的数据
        fileName: '',         // 获取excel文件名
        filePath: '',         // 获取excel文件路径

        studentRoles: {},     // 学生角色信息
    }),
    // 计算属性 
    getters: {},
    // 方法
    actions: {
        /**
         * 导入excel 以文件名导入
         * @param {*} uploadFile 上传的文件
         */
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

            // 获取学生信息
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
                ElMessage.success({ message: res.message, duration: 1000 });
            });
        },
        /**
         * 学生团队状态获取
         * @param {*} teamList 团队列表
         * @param {*} targetArray 目标数组
         */
        async getStudentTeamStatu(teamList, targetArray) {
            targetArray.value = [];
            const uniqueItems = new Set();  // 去重

            await Promise.all(teamList.map(async (team) => {
                const res = await getTeamList(team);
                // 将对象转换为 JSON 字符串，以便 Set 可以去重
                const resString = JSON.stringify(res);
                if (!uniqueItems.has(resString)) {
                    uniqueItems.add(resString);
                    targetArray.value.push(res);
                }
            }));
            // console.log("targetArray", targetArray.value);

            // 遍历每个团队的数据
            targetArray.value.forEach(teamData => {
                teamData.forEach(member => {
                    // 假设 member 对象包含 stuName 和 isLeader 字段
                    this.studentRoles[member.stuName] = member.isLeader === 0 ? '成员' : '组长';
                });
            });
            // console.log("this.studentRoles", this.studentRoles);
            return targetArray.value;
        },
        /**
         * 存储选择班级
         * @param {*} value 
         */
        setSelectClass(value) {
            this.selectedClass = value;
        },
        /**
         * 获取选择班级
         * @returns 
         */
        getSelectClass() {
            return this.selectedClass;
        },
    },

    // 使用持久化
    persist: {
        enabled: true,
        storage: localStorage,
        key: "dataOptions",
        path: [
            "selectedClass",
            "selectClassList",
            "teamLists",
            "students",
            "classSeat",
            "fileName",
            "computerRoomSeat",
            "filePath",
            "studentRoles"
        ],
    },
});
