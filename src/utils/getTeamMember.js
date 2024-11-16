// 用于获取每个组队的组长和成员
import { importExcelFile } from "@/store/excelOptions";
import { ref } from "vue";

const teamAllStudent = ref([]);
/**
 * 获取组团队成员，
 * @returns teamAllStudent.value 组队信息
 */
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

/**
 * 获取团队id
 * @param   studentName 学生姓名
 * @returns teamId      组id
 */
export const getTeamIdforMember = async (studentName) => {
    const importFile = importExcelFile();
    let teamId = "";
    // 遍历teamObjList数组
    for (let i = 0; i < importFile.teamLists.length; i++) {
        if (importFile.teamLists[i].leader == studentName) {
            // 获取该组id
            teamId = importFile.teamLists[i].teamId;
        }
        // 使用 split 方法按逗号分割字符串，并去除多余的空字符串，结果添加到数组里
        const member = importFile.teamLists[i].member.split('，').map(name => `'${name.trim()}'`).filter(name => name !== '');
        // member的结果为['李欣怡，陈伊锳，张雨欣']；
        // console.log("member", member);
        for (let j = 0; j < member.length; j++) {
            // memberItem为['李欣怡','陈伊彤','张雨欣']
            const memberItem = member[j].split("'").filter(name => name !== '').toString();
            // console.log("memberItem", memberItem);
            // 判断当前学生是否为该组中的组员
            if (memberItem == studentName) {
                // 获取该组id
                teamId = importFile.teamLists[i].teamId;
            }
        }
    }
    return teamId;
}
