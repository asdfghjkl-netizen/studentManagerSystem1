import { defineStore } from "pinia";
// import ExcelJS from "exceljs";
import { getExcelFile } from "@/utils/api/excelFiles";
import { watchEffect } from "vue";

// defineStore('userInfo',{})  userInfo就是这个仓库的名称name
export const importExcelFile = defineStore('excelFile', {
    // 初始化数据
    state: () => ({
        teamLists: [],        // 获取团队列表数据（团队名称，团队人数，团队成员）
        students: [],         // 获取学生列表数据（学号，姓名，性别）
        classSeat: [],        // 获取班级的座位表数据
        computerRoomSeat: [], // 获取学生机房座位表的数据
        studentsHeaders: [],  // 获取学生信息第一行数据
        teamHeaders: [],      // 获取团队列表第一行数据
        ecxelFile: '',        // 获取excel路径+文件名
        files: File,            // 获取上传的文件的文件对象
        fileName: '',         // 获取excel文件名
        buffer: '',           // 获取上传的文件的二进制流

        teamLeaders: [],      // 获取团队负责人
        teamIdList: [],       // 获取团队id
        teamMembers: [],      // 获取团队成员

        studentStatusHeaders: [],
        studentStatus: [],
    }),
    // 计算属性 
    getters: {},
    // 方法
    actions: {
        // 获取表格第一行数据 de
        getFirstRow(worksheet) {
            if (worksheet.id == 1) {
                this.studentsHeaders = [];
                worksheet.getRow(1).eachCell((cell) => {
                    // 定义一个映射对象
                    const valueMapping = {
                        "班级": "class",
                        "学号": "stuId",
                        "姓名": "stuName",
                        "性别": "sex"
                    };
                    // 使用映射对象来更新cell.value
                    if (valueMapping[cell.value]) {
                        cell.value = valueMapping[cell.value];
                    }
                    // this.studentsHeaders.push(cell.value);
                });
            }
            if (worksheet.id == 4) {
                this.teamHeaders = [];
                worksheet.getRow(1).eachCell((cell) => {
                    // 定义一个映射对象
                    const valueMapping = {
                        "组号": "teamId",
                        "组名": "teamName",
                        "成员": "member",
                        "组长": "leader",
                        "团队得分": "teamScore",
                        "成员得分": "memberScore",
                        "小组总分": "teamTotalScore",
                    };
                    // 使用映射对象来更新cell.value
                    if (valueMapping[cell.value]) {
                        cell.value = valueMapping[cell.value];
                    }
                    this.teamHeaders.push(cell.value);
                });
            }
            // console.log("headers", this.studentsHeaders)
            // console.log("headers", this.teamHeaders)
        },
        // 重新解析文件内容 de
        parseExcelFile(workbook) {
            // 获取第一个worksheet内容（学生信息表）
            let worksheet = workbook.getWorksheet(1);
            // 获取第一行的标题
            this.getFirstRow(worksheet);
            // 创建一个空的JavaScript对象数组，用于存储解析后的数据
            const dataexl = [];
            // 遍历工作表的每一行（从第二行开始，因为第一行通常是标题行）
            for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
                const rowData = {};
                const row = worksheet.getRow(rowNumber);
                let colNumber = 0;
                // 遍历当前行的每个单元格
                row.eachCell((cell) => {
                    // 获取标题对应的键，并将当前单元格的值存储到相应的属性名中
                    rowData[this.studentsHeaders[colNumber]] = cell.value;
                    colNumber++;
                });
                // 将当前行的数据对象添加到数组中
                dataexl.push(rowData);
            }
            this.students = dataexl
            // console.log("dataexl", this.students)


            // 获取第二个工作表中的内容（班级座位表）
            const dataexl1 = [];
            worksheet = workbook.getWorksheet(2);
            for (let rowNumber = 1; rowNumber <= worksheet.rowCount; rowNumber++) {
                const row = worksheet.getRow(rowNumber);
                row.eachCell((cell) => {
                    dataexl1.push(cell.value)
                })
            }
            this.classSeat = dataexl1
            // console.log("dataexl1", data.classSeat);


            // 获取第三个工作表中的内容（机房座位表）
            const dataexl2 = [];
            worksheet = workbook.getWorksheet(3);
            for (let rowNumber = 1; rowNumber <= worksheet.rowCount; rowNumber++) {
                const row = worksheet.getRow(rowNumber);
                row.eachCell((cell) => {
                    dataexl2.push(cell.value)
                })
            }
            this.computerRoomSeat = dataexl2
            // console.log("dataexl2", data.computerRoomSeat);


            // 获取第一个worksheet内容（学生信息表）
            const worksheetFour = workbook.getWorksheet(4);
            // 获取第一行的标题
            this.getFirstRow(worksheetFour);
            // 创建一个空的JavaScript对象数组，用于存储解析后的数据
            const dataexl4 = [];
            // 遍历工作表的每一行（从第二行开始，因为第一行通常是标题行）
            for (let rowNumber = 2; rowNumber <= worksheetFour.rowCount; rowNumber++) {
                const rowData = {};
                const row = worksheetFour.getRow(rowNumber);
                let colNumber = 0;
                // 遍历当前行的每个单元格
                row.eachCell((cell) => {
                    // 获取标题对应的键，并将当前单元格的值存储到相应的属性名中
                    rowData[this.teamHeaders[colNumber]] = cell.value;
                    colNumber++;
                });
                // 将当前行的数据对象添加到数组中
                dataexl4.push(rowData);
            }
            this.teamLists = dataexl4
            // console.log("dataexl4", this.teamLists)
            console.log("文件读取成功！");
        },
        // 导入excel 以下载点击获取
        // importExcel(event) {
        //     //获取选择的文件
        //     this.files = event.target.files[0];
        //     if (!this.files) {
        //         console.log('No file selected');
        //         return;
        //     }
        //     this.fileName = this.files.name
        //     const baseURI = event.target.baseURI;
        //     // 检查event.target.baseURI的字符中是否存在index.html的字符串
        //     if (baseURI.includes("index.html")) {
        //         baseURI.split("index.html");
        //     }
        //     watchSyncEffect(() => {
        //         getExcelFile(this.fileName).then(res => {
        //             console.log("res", res);
        //             this.teamLists = res.data.teamLists;
        //             this.classSeat = res.data.classSeat;
        //             this.computerRoomSeat = res.data.computerRoomSeat;
        //             this.students = res.data.students;
        //         })
        //     })
        //     // //创建Workbook实例
        //     // const workbook = new ExcelJS.Workbook();
        //     // // 使用FileReader对象来读取文件内容
        //     // const fileReader = new FileReader()
        //     // // 二进制字符串的形式加载文件
        //     // fileReader.readAsArrayBuffer(this.files)

        //     // // 获取第一个工作表中的内容
        //     // fileReader.onload = ev => {
        //     //     // 从 buffer中加载数据解析
        //     //     workbook.xlsx.load(ev.target.result).then(() => {
        //     //         getExcelFile(ev.target.result).then(res => {
        //     //             console.log("res", res);
        //     //             this.teamLists = res.data.teamLists;
        //     //             this.classSeat = res.data.classSeat;
        //     //             this.computerRoomSeat = res.data.computerRoomSeat;
        //     //             this.students = res.data.students;
        //     //         })
        //     //     })
        //     // }
        //     // console.log("fileName", this.fileName);
        //     // http://localhost:8080/   ../../public/
        //     this.ecxelFile = baseURI + this.fileName
        //     // console.log("excelFile", this.ecxelFile)
        // },
        // 导入excel 以文件名导入
        importExcel(uploadFile) {
            console.log("uploadFile", uploadFile);
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
            console.log('this.files', this.files);
            
            // 获取学生信息
            watchEffect(() => {
                getExcelFile({file : this.fileName}).then(res => {
                    console.log("res", res);
                    this.teamLists = res.data.parsedData.teamLists;
                    this.classSeat = res.data.parsedData.classSeat;
                    this.computerRoomSeat = res.data.parsedData.computerRoomSeat;
                    this.students = res.data.parsedData.students;
                    this.buffer = res.data.buffer;
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
            // console.log(this.teamLeaders);
            // console.log(this.teamIdList);
            // console.log(this.teamMembers);
        },
    },

    // 使用持久化
    persist: {
        enabled: true,
        storage: localStorage,
        key: "excelFile",
        path: ["students", "classSeat", "computerRoomSeat", "files",
            "teamLists", "ecxelFile", "teamLeaders", "teamIdList",
            "teamMembers"]
    },
})
