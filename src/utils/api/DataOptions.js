import instance from "@/utils/request";

// 添加学生学习数据
export function addStudentTableData(data) {
    return instance({
        url: 'table/student/add',
        method: 'post',
        data
    })
}

// 获取学生学习数据
export function getStudentTableData(student) {
    return instance({
        url: 'table/student',
        method: 'post',
        data: { student }
    })
}

// 删除学生学习数据
export function removeStudentTableData(data) {
    return instance({
        url: 'table/student/remove',
        method: 'post',
        data
    })
}

// 获取团队学习数据
export function getTeamTableData(team) {
    return instance({
        url: 'table/team',
        method: 'post',
        data: { team }
    })
}

// 增加团队学习数据
export function addTeamTableData(data) {
    return instance({
        url: 'table/team/add',
        method: 'post',
        data
    })
}

// 删除团队学习数据
export function removeTeamTableData(data) {
    return instance({
        url: 'table/team/remove',
        method: 'post',
        data
    })
}

// 获取团队列表
export function getTeamListFromBackend(teamId) {
    return instance({
        url: 'dialog/all/team',
        method: 'post',
        data: { teamId }
    })
}
