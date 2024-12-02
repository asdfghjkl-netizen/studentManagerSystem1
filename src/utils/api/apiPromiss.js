import instance from "@/utils/request";

// 上传文件的接口获取
export function uploadExcelFile(data) {
    return instance({
        url: 'upload-excel',
        method: 'post',
        data,
        headers: { "Content-Type": "multipart/form-data" },
    })
}

// 获取文件列表
export function getFileList() {
    return instance({
        url: 'file-list',
        method: 'get'
    })
}

// 读取文件（传入文件名）
export function getExcelFile(fileName) {
    // console.log("fileName", fileName);
    return instance({
        url: 'get-excel-file',
        method: 'post',
        // data: { file: fileName }
        data: fileName
    })
}

// 获取学生学习数据
export function getStudentStatus(student) {
    // console.log("fileName", fileName);
    return instance({
        url: 'get-excel-file/student',
        method: 'post',
        data: { student }
    })
}

// 获取团队学习数据
export function getTeamStatus(team) {
    // console.log("fileName", fileName);
    return instance({
        url: 'get-excel-file/team',
        method: 'post',
        data: { team }
    })
}
