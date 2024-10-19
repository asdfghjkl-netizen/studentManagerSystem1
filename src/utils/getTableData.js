// 获取Excel文件数据，用于处理表格的数据，(封装方法)
import ExcelJS from "exceljs";
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { importExcelFile } from "@/store/excelOptions";

// 获取学生学习状态表的头部数据
const studentStatusHeaders = ref([]);
// 获取学生学习状态
const studentStatus = ref([]);
// 初始化结果数组
const allStudentStatus = ref([]);
// 计算组员总分
const totalScore = ref({});
// 查询学生学习卡信息
async function getStudentInfo(student) {
    // 创建pinia实例
    const importFile = importExcelFile();
    //创建Workbook实例
    const workbook = new ExcelJS.Workbook();
    // 使用FileReader对象来读取文件内容
    const fileReader = new FileReader()
    // 二进制字符串的形式加载文件  文件信息存储在pinia中
    fileReader.readAsArrayBuffer(importFile.files[0])

    fileReader.onload = ev => {
        // 从 buffer中加载数据解析
        workbook.xlsx.load(ev.target.result).then(() => {
            // 获取第一个worksheet内容（学生信息表）
            const worksheet = workbook.getWorksheet(student);
            if (worksheet === undefined) {
                studentStatus.value = [];
                return;
            } else {
                studentStatusHeaders.value = [];
                // 获取第一行的标题
                worksheet.getRow(1).eachCell((cell) => {
                    // 定义一个映射对象
                    const valueMapping = {
                        时间: 'dateTime',
                        得分: 'score'
                    };
                    // 获取学生学习卡状态标题（变动的值）
                    const stuStatusTitle = student + "学习表现";
                    // 更新 headerMap 包含变动的值
                    valueMapping[stuStatusTitle] = 'studyStatus';
                    // 使用映射对象来更新cell.value
                    if (valueMapping[cell.value]) {
                        cell.value = valueMapping[cell.value];
                    }
                    studentStatusHeaders.value.push(cell.value);
                });

                // 创建一个空的JavaScript对象数组，用于存储解析后的数据
                const stuStatus = [];
                // 遍历工作表的每一行（从第二行开始，因为第一行通常是标题行）
                for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
                    const rowData = {};
                    const row = worksheet.getRow(rowNumber);
                    let colNumber = 0;
                    // 遍历当前行的每个单元格
                    row.eachCell((cell) => {
                        // 获取标题对应的键，并将当前单元格的值存储到相应的属性名中
                        rowData[studentStatusHeaders.value[colNumber]] = cell.value;
                        colNumber++;
                    });
                    // 将当前行的数据对象添加到数组中
                    stuStatus.push(rowData);
                }
                studentStatus.value[student] = stuStatus
                // console.log("dataexl", studentStatus.value)
            }
        }).catch((err) => {
            studentStatus.value = [];
            ElMessage.error("解析失败", err);
        })
    }
    await new Promise(resolve => setTimeout(resolve, 100));
    return studentStatus.value[student];
}

// 存储学生信息
let studentInfoData = ref([]);
export async function studentInfo(student) {
    getStudentInfo(student).then(data => { studentInfoData.value = data; })
    return studentInfoData.value;
}

// 查询学生学习卡信息(多表查询)
export async function getStudentsInfo(students, teamLists) {
    // 创建pinia实例
    const importFile = importExcelFile();
    //创建Workbook实例
    const workbook = new ExcelJS.Workbook();
    // 使用FileReader对象来读取文件内容
    const fileReader = new FileReader()
    // 二进制字符串的形式加载文件  文件信息存储在pinia中
    fileReader.readAsArrayBuffer(importFile.files[0])

    fileReader.onload = ev => {
        // 从 buffer中加载数据解析
        workbook.xlsx.load(ev.target.result).then(() => {
            // totalScore.value = 0;
            // 遍历每个学生
            for (const student of students) {
                // console.log("student", student);
                // 获取第一个worksheet内容（学生信息表）
                const worksheet = workbook.getWorksheet(student);
                if (worksheet === undefined) {
                    // console.log("没有找到对应表", student);
                    allStudentStatus.value[student] = [];
                } else {
                    studentStatusHeaders.value = [];
                    // memberTotalScore = {};
                    // 获取第一行的标题
                    worksheet.getRow(1).eachCell((cell) => {
                        // 定义一个映射对象
                        const valueMapping = {
                            时间: 'dateTime',
                            得分: 'score'
                        };
                        // 获取学生学习卡状态标题（变动的值）
                        const stuStatusTitle = student + "学习表现";
                        // 更新 headerMap 包含变动的值
                        valueMapping[stuStatusTitle] = 'studyStatus';
                        // 使用映射对象来更新cell.value
                        if (valueMapping[cell.value]) {
                            cell.value = valueMapping[cell.value];
                        }
                        studentStatusHeaders.value.push(cell.value);
                    });
                    // console.log("studentStatusHeaders", studentStatusHeaders.value);

                    // 创建一个空的JavaScript对象数组，用于存储解析后的数据
                    const stuStatus = [];
                    // 遍历工作表的每一行（从第二行开始，因为第一行通常是标题行）
                    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
                        const rowData = {};
                        const row = worksheet.getRow(rowNumber);
                        let colNumber = 0;
                        // 遍历当前行的每个单元格
                        row.eachCell((cell) => {
                            // 获取标题对应的键，并将当前单元格的值存储到相应的属性名中
                            rowData[studentStatusHeaders.value[colNumber]] = cell.value;
                            colNumber++;
                        });
                        // 将当前行的数据对象添加到数组中
                        stuStatus.push(rowData);
                    }
                    allStudentStatus.value[student] = stuStatus
                }

                // 遍历每组————计算每组的总和
                for (let i = 0; i < teamLists.length; i++) {
                    const team = teamLists[i];
                    // console.log(`团队 ${i + 1}`, team);
                    // 初始化当前组的分数总和
                    totalScore.value[i + 1] = 0;

                    // 遍历当前组的每个成员
                    for (const student of team) {
                        // console.log(`检查学生 ${student}`);
                        // 计算每个组员总分
                        const memberScore = allStudentStatus.value[student]?.reduce((acc, cur) => {
                            return acc + cur.score;
                        }, 0) || 0;
                        // console.log(`学生 ${student} 的总分:`, memberScore);

                        // 累加到当前组的总分
                        totalScore.value[i + 1] += memberScore;
                    }
                    // console.log(`团队 ${i + 1} 的总分:`, totalScore.value[i + 1]);
                }
            }
        }).catch((err) => {
            allStudentStatus.value = [];
            ElMessage.error("解析失败", err);
        })
    }
    return { totalScore: totalScore.value, allStudentStatus };
}


// 获取团队学习状态表的头部数据
const teamStatusHeaders = ref([]);
// 获取团队学习状态
const teamStatus = ref([]);
// 查询学生学习卡信息
export async function getTeamInfo(teamId) {
    // 定义团队名称
    let teamName = "第" + teamId + "组";
    // 创建pinia实例
    const importFile = importExcelFile();
    //创建Workbook实例
    const workbook = new ExcelJS.Workbook();
    // 使用FileReader对象来读取文件内容
    const fileReader = new FileReader()
    // 二进制字符串的形式加载文件  文件信息存储在pinia中
    fileReader.readAsArrayBuffer(importFile.files[0])

    fileReader.onload = ev => {
        // 从 buffer中加载数据解析
        workbook.xlsx.load(ev.target.result).then(workbook => {
            // 获取第一个worksheet内容（学生信息表）
            const worksheet = workbook.getWorksheet(teamName);
            if (worksheet === undefined) {
                teamStatus.value = [];
                return;
            } else {
                // 获取第一行的标题
                worksheet.getRow(1).eachCell((cell) => {
                    // 定义一个映射对象
                    const valueMapping = {
                        时间: 'dateTime',
                        得分: 'score'
                    };
                    // 获取学生学习卡状态标题（变动的值）
                    const stuStatusTitle = teamName + "学习表现";
                    // 更新 headerMap 包含变动的值
                    valueMapping[stuStatusTitle] = 'studyStatus';
                    // 使用映射对象来更新cell.value
                    if (valueMapping[cell.value]) {
                        cell.value = valueMapping[cell.value];
                    }
                    teamStatusHeaders.value.push(cell.value);
                });

                // 创建一个空的JavaScript对象数组，用于存储解析后的数据
                const stuStatus = [];
                // 遍历工作表的每一行（从第二行开始，因为第一行通常是标题行）
                for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
                    const rowData = {};
                    const row = worksheet.getRow(rowNumber);
                    let colNumber = 0;
                    // 遍历当前行的每个单元格
                    row.eachCell((cell) => {
                        // 获取标题对应的键，并将当前单元格的值存储到相应的属性名中
                        rowData[teamStatusHeaders.value[colNumber]] = cell.value;
                        colNumber++;
                    });
                    // 将当前行的数据对象添加到数组中
                    stuStatus.push(rowData);
                }
                teamStatus.value = stuStatus
                // console.log("dataexl", teamStatus.value)
            }
        }).catch((err) => {
            teamStatus.value = [];
            ElMessage.error("解析失败", err);
        })
    }
    return teamStatus.value;
}
