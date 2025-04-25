// 用于在 Electron 中预加载脚本
// 该脚本在 Electron 的主进程中运行，并在渲染进程加载之前执行
window.addEventListener('DOMContentLoaded', () => {
    // 替换页面中指定元素的文本内容
    console.log('Preload script loaded');
    // 该函数接受一个选择器和要替换的文本作为参数
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
        console.log(`Replaced ${selector} with ${text}`);
        // 也可以在此处添加其他功能，如检查应用是否在后台运行等
    };
    // 遍历 Electron 版本信息中的每个类型，并替换页面中对应元素的文本内容
    // 该信息包括 Chrome、Node 和 Electron 的版本号
    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type]);
        console.log(`Replaced ${type}-version with ${process.versions[type]}`);
        // 也可以在此处添加其他功能，如检查应用是否在后台运行等
    }
});