import { importExcelFile } from "@/store/excelOptions";
import { ref } from "vue";

const teamId = ref('');

// 得到组号
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
