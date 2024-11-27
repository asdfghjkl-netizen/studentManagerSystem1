// TODO excel文件保存方法
import { uploadExcelFile, getExcelFile } from "@/utils/api/apiPromiss";
import { ElMessage } from "element-plus";
import { importExcelFile } from "@/store/excelOptions";
import { watchEffect } from "vue";
import { teamMembersScore, getTeamTotalScore } from "@/utils/dataOption/getScore";

/**
 * 保存文件
 * @param targetObj  分数对象：：分数清零和其他学习状态
 * @param buffer     文件的buffer对象->blob对象
 */
export const saveExcel = (targetObj, buffer) => {
    console.log(targetObj);
    const importFile = importExcelFile();
    // 创建一个Blob对象
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    // 定义文件的名称
    const fileName = sessionStorage.getItem("fileName");
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
        // 获取后端传入文件的buffer
        getExcelFile({ file: fileName }).then(res => {
            importFile.buffer = res.data.buffer;
        }).catch(error => {
            ElMessage.error("获取文件失败", error);
        });
        // 判断targetObj是否为空
        if (targetObj == null) return;
        // TODO 重置  查看targetObj包含的属性，并遍历
        for (let key in targetObj) {
            // console.log(key);
            // 获取当前键的值
            const value = targetObj[key];
            // 检查值的类型并进行相应处理
            if (typeof value === 'object' && value !== null) {
                // 如果值是一个对象，进一步检查其内部的 value 属性
                if (typeof value.value === 'number') {
                    value.value = 0;
                } else if (typeof value.value === 'string') {
                    value.value = '';
                }
            } else if (typeof value === 'number') {
                targetObj[key] = 0;
            } else if (typeof value === 'string') {
                targetObj[key] = '';
            }
        }
        ElMessage.success(res.data.message + '\xa0' + res.data.fileName);
    }).catch(error => {
        ElMessage.error("保存失败", error);
    });
    // 监听页面刷新
    window.onbeforeunload = function (event) {
        event.returnValue = "我在这写点东西...";
    };
}

/**
 * 更改excel文件中的小组工作表中的分数数据
 * @param  workSheet      excel工作表
 * @param  teamId         小组id
 * @param  targetObj      目标对象（传入分数的对象）
 * @param  addSorce       修改的分数(增加)
 * @param  redSorce       修改的分数(减少)
 * @param  isStudent      是否是学生分数 true：学生 false：团队  用于判断是学生分数还是团队分数
 * @param  isStudentData  是否是学生数据 true：学生 false：团队  用于判断是学生数据还是团队数据
 */
export const changeSorceforExcelData = async (workSheet, teamId, targetObj, addSorce, redSorce, isStudent, isStudentData) => {
    watchEffect(() => { targetObj, teamId });
    // console.log("targetObj", targetObj, isStudent, isStudentData);
    // 获取每个组成员的分数
    const memberObj = await teamMembersScore(teamId);
    const teamObj = await getTeamTotalScore(teamId);

    // 获取第二行开始到最后一行的数据
    for (let i = 2; i <= workSheet.rowCount; i++) {
        const cellValue = workSheet.getRow(i); // dateTime 在第一列
        // console.log("cellValue", i, cellValue.values);
        // 修改excel指定格的数据
        if (i - 1 == teamId) {
            // console.log("memberObj", memberObj);
            // console.log("teamObj", teamObj);
            if (isStudent == true) {
                // 团队得分
                cellValue.getCell(5).value = targetObj.teamScore || teamObj;
                // 成员得分
                cellValue.getCell(6).value = memberObj + addSorce ||
                    targetObj.teamMemberScore;
                // 小组总分
                cellValue.getCell(7).value = targetObj.totalTeamScore ||
                    teamObj + memberObj + addSorce;
            } else if (isStudent == false) {
                // 团队得分
                cellValue.getCell(5).value = targetObj.teamScore || teamObj + addSorce;
                // 成员得分
                cellValue.getCell(6).value = memberObj ||
                    targetObj.teamMemberScore;
                // 小组总分
                cellValue.getCell(7).value = targetObj.totalTeamScore ||
                    teamObj + memberObj + addSorce;
            } else if (isStudentData == true) {
                // 成员得分
                cellValue.getCell(6).value -= redSorce;
                // 小组总分
                cellValue.getCell(7).value -= redSorce;
            } else if (isStudentData == false) {
                // 团队得分
                cellValue.getCell(5).value -= redSorce;
                // 小组总分
                cellValue.getCell(7).value -= redSorce;
            }
        }
    }
}
