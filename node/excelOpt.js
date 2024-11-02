// nodejs 模块
const { ref } = require('vue');

const studentsHeaders = ref([]);
const teamHeaders = ref([]);
const students = ref([]);
const classSeat = ref([]);
const computerRoomSeat = ref([]);
const teamLists = ref([]);

// 获取表格第一行数据
function getFirstRow(worksheet) {
    if (worksheet.id == 1) {
        studentsHeaders.value = [];
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
            studentsHeaders.value.push(cell.value);
        });
    }
    if (worksheet.id == 4) {
        teamHeaders.value = [];
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
            teamHeaders.value.push(cell.value);
        });
    }
}

// 重新解析文件内容
function parseExcelFile(workbook) {
    // 获取第一个worksheet内容（学生信息表）
    let worksheet = workbook.getWorksheet(1);
    // 获取第一行的标题
    getFirstRow(worksheet);
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
            rowData[studentsHeaders.value[colNumber]] = cell.value;
            colNumber++;
        });
        // 将当前行的数据对象添加到数组中
        dataexl.push(rowData);
    }
    students.value = dataexl
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
    classSeat.value = dataexl1
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
    computerRoomSeat.value = dataexl2
    // console.log("dataexl2", data.computerRoomSeat);


    // 获取第一个worksheet内容（学生信息表）
    const worksheetFour = workbook.getWorksheet(4);
    // 获取第一行的标题
    getFirstRow(worksheetFour);
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
            rowData[teamHeaders.value[colNumber]] = cell.value;
            colNumber++;
        });
        // 将当前行的数据对象添加到数组中
        dataexl4.push(rowData);
    }
    teamLists.value = dataexl4
    // console.log("dataexl4", this.teamLists)
    console.log("文件读取成功！");
    return {
        students: students.value,
        classSeat: classSeat.value,
        computerRoomSeat: computerRoomSeat.value,
        teamLists: teamLists.value
    }
}

module.exports = parseExcelFile;
