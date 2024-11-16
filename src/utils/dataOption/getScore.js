import { getMemberforTeam } from "@/utils/getTeamMember";
import { getStudentsInfo, getTeamInfo } from "@/utils/dataOption/getTableData";
import { ref, watchEffect } from "vue";

// 成员总分
const teamMemberScore = ref(0);
// 定义团队分数
const teamScore = ref(0);

/**
 * 获取组员数据，并获取团队组员总分
 * @param   teamId  小组id
 * @returns teamMemberScore.value  小组成员的总分
 */
export const teamMembersScore = async (teamId) => {
    // 每个组成员的分数（组）
    const teamMemberScores = ref();
    await getMemberforTeam().then(res => {
        // 扁平化数组
        const flat = res.flat();
        // 获取学生信息
        getStudentsInfo(flat, res).then(res => {
            // console.log("res", res);
            teamMemberScores.value = res.totalScore;
            watchEffect(() => {
                const obj = new Proxy(teamMemberScores.value, {
                    get(target, prop, receiver) {
                        // 实现获取属性时的行为
                        return Reflect.get(target, prop, receiver);
                    },
                    set(target, prop, value, receiver) {
                        // 实现设置属性时的行为
                        return Reflect.set(target, prop, value, receiver);
                    }
                });
                for (let key in obj) {
                    if (teamId === key) {
                        // console.log(`Key: ${key}, Value: ${obj[key]}`);
                        teamMemberScore.value = obj[key];
                    }
                }
            }, 100);
        });
    })
    return teamMemberScore.value;
}

/**
 * 获取组队信息团队分
 * @param   teamId 小组id
 * @return  teamScore.value  小组总分
 */
export const getTeamTotalScore = async (teamId) => {
    await getTeamInfo(teamId).then(res => {
        // console.log("res", res);
        // 如果存在数据，则计算团队分
        if (res.length >= 1) {
            teamScore.value = 0; // 重置 teamScore
            for (let i = 0; i < res.length; i++) {
                const element = res[i];
                teamScore.value += element.score;
            }
        } else {
            teamScore.value = 0;
        }
    })
    return teamScore.value;
}
