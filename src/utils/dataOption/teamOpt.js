import { importExcelFile } from "@/store/excelOptions";
import { getTeamListFromBackend } from "@/utils/api/DataOptions";
import { ref } from "vue";

// 得到组号的方法
const teamId = ref('');
export const getTeamNum = async (student) => {
    const importFile = importExcelFile();
    const teamList = importFile.teamLists;
    // console.log("teamList", teamList);
    teamList.forEach(item => {
        // console.log("item", item);
        if (item.stuName === student) {
            teamId.value = item.teamId;
        }
    })
    return teamId.value;
}

// 获取组信息(整合)
let student = ref([]);
// 从后端获取组信息
export const getTeamList = async (teamId) => {
    student.value = [];
    await getTeamListFromBackend(teamId).then((res) => {
        // console.log("teamList", res, res.teamData);
        for (const item in res.teamData) {
            if (Object.prototype.hasOwnProperty.call(res.teamData, item)) {
                student.value.push(res.teamData[item]);
                // console.log("student", student);
            }
        }
    })
    return student.value;
}
