// 用于获取每个组队的组长和成员
import { importExcelFile } from "@/store/excelOptions";
import { ref } from "vue";

const teamAllStudent = ref([]);
// 获取组团队成员，
export const getMemberforTeam = async () => {
    const importFile = importExcelFile();
    teamAllStudent.value = [];

    // 遍历teamObjList数组
    for (let i = 0; i < importFile.teamLists.length; i++) {
        // 分割leader 和 member
        const leader = await importFile.teamLists[i].leader.split('，').map(name => `${name.trim()}`).filter(name => name !== '');
        // 使用 split 方法按逗号分割字符串，并去除多余的空字符串，结果添加到数组里
        const member = await importFile.teamLists[i].member.split('，').map(name => `${name.trim()}`).filter(name => name !== '');
        // 把 leader 和 member 合并成一个数组
        teamAllStudent.value.push([...leader, ...member]);
    }
    return teamAllStudent.value;
}
