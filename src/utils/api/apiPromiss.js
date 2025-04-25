import instance from "@/utils/request";

export function getClassNameforHomePage() {
    return instance({
        url: 'databases',
        method: 'get'
    })
}

export function studata(data) {
    return instance({
        url: 'get_stu_data',
        method: 'post',
        data
    })
}

// 下载桌面应用程序的接口获取
export function downloadDesktopApp() {
    return instance({
        url: 'downloadApp',
        method: 'post',
        // responseType: 'blob', // important
        // data: { team }
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
export function getExcelFile(data) {
    // console.log("fileName", fileName);
    return instance({
        url: 'get-excel-file',
        method: 'post',
        data
    })
}

// 写入并保存文件的接口获取
export function saveExcelFile(data) {
    return instance({
        url: 'save-excel',
        method: 'post',
        data,
        // headers: { "Content-Type": "multipart/form-data" },
    })
}
