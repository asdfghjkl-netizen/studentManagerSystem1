import instance from "@/utils/request";

// 存储学生学习数据
export function pushStudentStatusToRedis(student) {
    // console.log("fileName", fileName);
    return instance({
        url: 'get-excel-file/student',
        method: 'post',
        data: { student }
    })
}

// 存储团队学习数据
export function pushTeamStatusToRedis(team) {
    // console.log("fileName", fileName);
    return instance({
        url: 'get-excel-file/team',
        method: 'post',
        data: { team }
    })
}
