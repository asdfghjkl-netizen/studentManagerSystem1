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

// 读取excel配置文件（获取班级配置文件）
export function getClassConfig() {
    return instance({
        url: 'excel/class-config',
        method: 'get'
    })
}

// 读取文件（传入文件名）
export function getExcelFile(data) {
    // console.log("fileName", fileName);
    return instance({
        url: 'get-excel-file',
        method: 'post',
        data
    })
}

// 写入并保存文件的接口获取
export function downloadExcelFile(data) {
    return instance({
        url: 'download-excel',
        method: 'post',
        data,
        headers: { "Content-Type": "multipart/form-data" },
    })
}
