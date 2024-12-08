import instance from "@/utils/request";

// 获取学生学习数据
export function getStudentTableData(student) {
    return instance({
        url: 'table/student',
        method: 'post',
        data: { student }
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

// 删除学生学习数据
export function removeStudentTableData(data) {
    return instance({
        url: 'table/student/remove',
        method: 'post',
        data
    })
}

// 添加学生学习数据
export function addStudentTableData(data) {
    return instance({
        url: 'table/student/add',
        method: 'post',
        data
    })
}
