import { useDataOptions } from "@/store/dataOptions";
import { getTeamListFromBackend } from "@/utils/api/DataOptions";
import { ref } from "vue";

const teamId = ref('');
/**
 * 得到组号的方法
 * @param   {string} student - 学生姓名
 * @returns {string}         - 组号
 */
export const getTeamNum = async (student) => {
    const importFileStore = useDataOptions();
    const teamList = importFileStore.teamLists;
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
/**
 * 从后端获取组信息
 * @param {string}    teamId - 组号
 * @returns {Promise<Array>} - 组信息
 */
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
