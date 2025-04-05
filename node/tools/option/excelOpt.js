const { ref } = require('vue');
const { translate } = require('../../../translations/translator.cjs');
const { stuManageInfoTitle } = require('../../config/publicConfig');

// 公共变量
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
 * @param {Array} headers       标题数组
 */
const processRow = async (row, headers) => {
    headers.value = [];
    await row.eachCell((cell) => {
        cell.value = translate(cell.value); // 翻译
        headers.value.push(cell.value);     // 将每个单元格的值添加到headers.value数组中
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
    dataArray = [];
    // for (let rowNumber = 1; rowNumber <= worksheet.rowCount; rowNumber++) {
    //     const row = worksheet.getRow(rowNumber);
    //     row.eachCell((cell) => {
    //         dataArray.push(cell.value);
    //     })
    // }
    for (let rowNumber = 1; rowNumber <= worksheet.rowCount; rowNumber++) {
        const row = worksheet.getRow(rowNumber);
        const rowData = [];
        row.eachCell((cell) => {
            rowData.push(cell.value);
        })
        dataArray.push(rowData);
    }
    targetArray.value = dataArray;
    // console.log("data", dataArray);
}

// 获取表格第一行数据
async function getFirstRow(worksheet) {
    // 获取第一个worksheet内容（学生信息表）
    if (worksheet.id == 1) {
        await processRow(worksheet.getRow(1), studentsHeaders);
        // 获取第四个worksheet内容（组员信息表）
    } else if (worksheet.id == 4) {
        await processRow(worksheet.getRow(1), teamHeaders);
    }
}

// 重新解析文件内容
async function parseExcelFile(workbook, file = null) {
    // 获取第一个worksheet内容（学生信息表）
    let worksheet = workbook.getWorksheet(1);
    // 获取第一行的标题
    await getFirstRow(worksheet);
    // 创建一个空的JavaScript对象数组，用于存储解析后的数据
    const dataexl = [];
    parseWorkSheetLong(dataexl, worksheet, studentsHeaders, students);

    // 获取第二个工作表中的内容（班级座位表）
    const dataexl1 = [];
    parseWorkSheetShort(dataexl1, workbook.getWorksheet(2), classSeat);

    // 获取第三个工作表中的内容（机房座位表）
    const dataexl2 = [];
    parseWorkSheetShort(dataexl2, workbook.getWorksheet(3), computerRoomSeat);

    // 获取第一个worksheet内容（学生信息表 stuManageInfo）
    const worksheetFour = workbook.getWorksheet(stuManageInfoTitle);
    if (worksheetFour) {
        // 获取第一行的标题
        await getFirstRow(worksheetFour);
        // 创建一个空的JavaScript对象数组，用于存储解析后的数据
        const dataexl4 = [];
        parseWorkSheetLong(dataexl4, worksheetFour, teamHeaders, teamLists);
    }
    else {
        // 创建一个新的工作表
        const createsheet = workbook.addWorksheet(stuManageInfoTitle);
        /** 
         * 复制第一个工作表的全部数据 
         * 使用 worksheet.eachRow 遍历第一个工作表的所有行。
         * 使用 row.eachCell 遍历每一行的所有单元格，并将单元格的值添加到 rowData 数组中。
         * 使用 createsheet.addRow(rowData) 将 rowData 添加到新工作表中。
         */
        // worksheet.eachRow((row, rowNumber) => {
        //     const rowData = [];
        //     row.eachCell((cell) => {
        //         rowData.push(cell.value);
        //     });
        //     createsheet.addRow(rowData);
        // });
        // 将新工作表插入到第四位置
        workbook.worksheets.splice(3, 0, createsheet);

        try {
            await workbook.xlsx.writeFile(file);
            // 重新解析新创建的工作表
            await parseExcelFile(workbook);
        } catch (error) {
            console.error('Error writing file:', error);
            throw new Error('Error creating stuManageInfoTitle sheet');
        }
        // // 设置列标题
        // createsheet.columns = [
        //     { header: '班级', key: 'class', width: 10 },
        //     { header: '学号', key: 'stuId', width: 20 },
        //     { header: '姓名', key: 'stuName', width: 10 },
        //     { header: '性别', key: 'sex', width: 10 },
        //     { header: '是否组长科代表', key: 'isLeader', width: 30 },
        //     { header: '小组号', key: 'teamId', width: 10 },
        //     { header: '学习表现', key: 'studyStatus', width: 10 },
        //     { header: '期中考', key: 'midtermScore', width: 10 },
        //     { header: '期末考', key: 'finalScore', width: 10 },
        //     { header: '作业情况', key: 'homeworkStatus', width: 10 },
        //     { header: '测试', key: 'testScore', width: 10 },
        //     { header: '平时成绩1', key: 'normalScore1', width: 10 },
        //     { header: '平时成绩2', key: 'normalScore2', width: 10 },
        //     { header: '平时成绩3', key: 'normalScore3', width: 10 },
        //     { header: '总评', key: 'totalScore', width: 10 },
        //     { header: '头像', key: 'avatar', width: 10 },
        // ];
    }

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
