const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

const currentDir = process.cwd();   // 获取当前执行目录
const IP = process.env.VUE_APP_IP || 'localhost';  // 获取服务器IP地址
console.log('IP:', IP);

function createWindow() {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { // 预加载脚本
      // preload: "preload.js",
      nodeIntegration: false,  // 是否集成 Node.js
      contextIsolation: true,  // 是否启用上下文隔离
      enableRemoteModule: true, // 是否启用远程模块
    },
    show: true,  // 是否显示窗口
    frame: true,  // 是否显示窗口边框
    autoHideMenuBar: true,  // 是否隐藏窗口菜单栏
    // webSecurity: false, // 是否禁用网页安全
  });

  // 最大化窗口
  mainWindow.maximize();

  // 加载应用的 index.html 文件
  mainWindow.loadFile(path.join(currentDir, process.env.VUE_APP_OUTPUT_DIR || 'dist', 'index.html'));
  // mainWindow.loadURL(`http://${IP}:8033/`);

  // 创建右键菜单模板
  const menuTemplate = [{
    label: '刷新',
    click() { mainWindow.reload() }
  }, {
    label: '开发者工具',
    click() { mainWindow.webContents.toggleDevTools() }
  }, {
    type: 'separator'  // 分割线
  }, {
    label: '退出',
    click() { app.quit() }
  }];
  // 创建右键菜单
  const menu = Menu.buildFromTemplate(menuTemplate);
  // 将菜单附加到窗口
  mainWindow.webContents.on('context-menu', (e) => {
    e.preventDefault();
    menu.popup({ window: mainWindow });
  });

  // 监听加载失败事件
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    console.error(`Failed to load URL: ${validatedURL}`);
    console.error(`Error Code: ${errorCode}, Description: ${errorDescription}`);
    // 重新加载页面
    // mainWindow.loadURL(`http://${IP}:8033/`);
    mainWindow.loadFile(path.join(currentDir, process.env.VUE_APP_OUTPUT_DIR || 'dist', 'index.html'));
  });

  // 监听加载完成事件
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page loaded successfully');
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});