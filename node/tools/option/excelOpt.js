// nodejs 模块
const { ref } = require('vue');

const studentsHeaders = ref([]);
const teamHeaders = ref([]);
const students = ref([]);
const classSeat = ref([]);
const computerRoomSeat = ref([]);
const teamLists = ref([]);

/**
 * 公共代码段（获取worksheet内容）
 * 
 * @param {Object} row          行对象
 * @param {object} valueMapping 映射对象
 * @param {Array} headers       标题数组
 */
const processRow = (row, valueMapping, headers) => {
    headers.value = [];
    row.eachCell(cell => {
        // 使用映射对象来更新cell.value
        if (valueMapping[cell.value]) {
            cell.value = valueMapping[cell.value];
        }
        headers.value.push(cell.value);
    });
}

/**
 * 公共代码段（遍历工作表的每一行（从第二行开始，因为第一行通常是标题行））
 * 
 * @param {Array} dataArray   数据数组
 * @param {Object} worksheet  工作表对象
 * @param {Array} targetArray 目标数组
 * @param {Array} headers     标题数组
 * @param {Number} startRow   工作表开始行数-默认为2
 */
const parseWorkSheetLong = (dataArray, worksheet, headers, targetArray, startRow = 2) => {
    dataArray = [];
    // 遍历工作表的每一行（从第二行开始，因为第一行通常是标题行）
    for (let rowNumber = startRow; rowNumber <= worksheet.rowCount; rowNumber++) {
        const rowData = {};
        const row = worksheet.getRow(rowNumber);
        let colNumber = 0;
        // 遍历当前行的每个单元格
        row.eachCell((cell) => {
            rowData[headers.value[colNumber]] = cell.value;
            colNumber++;
        });
        // 将当前行的数据对象添加到数组中
        dataArray.push(rowData);
    }
    targetArray.value = dataArray;
    // console.log("data", dataArray);
}

/**
 * 公共代码段（遍历工作表的每一行（从第二行开始，因为第一行通常是标题行））
 * 
 * @param {Array} dataArray   数据数组
 * @param {Object} worksheet  工作表对象
 * @param {Array} targetArray 目标数组
 */
const parseWorkSheetShort = (dataArray, worksheet, targetArray) => {
    // dataArray = [];
    // for (let rowNumber = 1; rowNumber <= worksheet.rowCount; rowNumber++) {
    //     const row = worksheet.getRow(rowNumber);
    //     row.eachCell((cell) => {
    //         dataArray.push(cell.value);
    //     })
    // }
    // targetArray.value = dataArray;
    // // console.log("data", dataArray);
    dataArray = [];
    for (let rowNumber = 1; rowNumber <= worksheet.rowCount; rowNumber++) {
        const row = worksheet.getRow(rowNumber);
        const rowData = [];
        row.eachCell((cell) => {
            rowData.push(cell.value);
        })
        dataArray.push(rowData);
    }
    targetArray.value = dataArray;
}

// 获取表格第一行数据
function getFirstRow(worksheet) {
    // 获取第一个worksheet内容（学生信息表）
    if (worksheet.id == 1) {
        // 定义一个映射对象
        const valueMapping = {
            "班级": "class",
            "学号": "stuId",
            "姓名": "stuName",
            "性别": "sex",
        };
        processRow(worksheet.getRow(1), valueMapping, studentsHeaders);
        // 获取第四个worksheet内容（组员信息表）
    } else if (worksheet.id == 4) {
        // 定义一个映射对象
        const valueMapping = {
            "班级": "class",
            "学号": "stuId",
            "姓名": "stuName",
            "性别": "sex",
            "是否组长科代表": "isLeader",
            "小组号": "teamId",
            "学习表现": "studyStatus",
            "期中考": "midtermScore",
            "期末考": "finalScore",
            "作业情况": "homeworkStatus",
            "测试": "testScore",
            "平时成绩1": "normalScore1",
            "平时成绩2": "normalScore2",
            "平时成绩3": "normalScore3",
            "总评": "totalScore",
            "头像": "avatar",
        };
        processRow(worksheet.getRow(1), valueMapping, teamHeaders);
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
    parseWorkSheetLong(dataexl, worksheet, studentsHeaders, students);

    // 获取第二个工作表中的内容（班级座位表）
    const dataexl1 = [];
    parseWorkSheetShort(dataexl1, workbook.getWorksheet(2), classSeat);

    // 获取第三个工作表中的内容（机房座位表）
    const dataexl2 = [];
    parseWorkSheetShort(dataexl2, workbook.getWorksheet(3), computerRoomSeat);

    // 获取第一个worksheet内容（学生信息表）
    const worksheetFour = workbook.getWorksheet(4);
    // 获取第一行的标题
    getFirstRow(worksheetFour);
    // 创建一个空的JavaScript对象数组，用于存储解析后的数据
    const dataexl4 = [];
    parseWorkSheetLong(dataexl4, worksheetFour, teamHeaders, teamLists);

    console.log("文件读取成功！");
    return {
        students: students.value,
        classSeat: classSeat.value,
        computerRoomSeat: computerRoomSeat.value,
        teamLists: teamLists.value
    }
}

module.exports = {
    processRow,
    parseExcelFile,
    parseWorkSheetLong
};
