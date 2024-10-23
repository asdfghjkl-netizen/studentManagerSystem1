import instance from "../request";

export function uploadExcelFile() {
    return instance({
        url: 'upload-excel',
        method: 'post'
    })
}
