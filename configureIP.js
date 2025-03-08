const os = require('os');
const fs = require('fs');
const path = require('path');
const { encrypt } = require('./node/tools/setCrypt');
const defaultGateway = require('default-gateway');

/**
 * 获取本机IP地址
 * @returns {Array} 本机IP地址列表
 */
function getLocalIPs() {
  const interfaces = os.networkInterfaces();  // 获取本机网络接口
  const ips = [];  // 存储本机IP地址
  // 遍历所有网络接口
  for (const name of Object.keys(interfaces)) {
    // 遍历当前接口的所有IP地址
    for (const iface of interfaces[name]) {
      // 如果IP地址是IPv4且不是内部IP地址
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

/**
 * 获取匹配同网关的IP地址
 * @returns {Array} 匹配的IP地址列表
 */
function getMatchingIPs() {
  try {
    const gatewayInfo = defaultGateway.v4.sync();  // 获取IPv4网关信息
    const gatewayIP = gatewayInfo.gateway;  // 获取网关IP地址
    // console.log('gatewayIP', gatewayIP);
    const localIPs = getLocalIPs();  // 获取本机IP地址列表

    // 获取网关IP地址的子网掩码
    const subnet = gatewayIP.split('.').slice(0, 3).join('.');
    // 过滤出匹配的IP地址
    return localIPs.filter(ip => ip.startsWith(subnet));  // 返回匹配的IP地址列表
  } catch (error) {
    console.error('Error retrieving gateway:', error);
    return [];
  }
}

/**
 * 根据匹配的IP地址设置环境变量。
 * 如果找到匹配的IP地址，则将环境变量设置为第一个匹配的IP地址。
 * 否则，将环境变量默认为“localhost”。另外，它会生成一个加密的配置文件。
 */
function setEnvironmentVariables() {
  const matchingIPs = getMatchingIPs();  // 获取匹配的IP地址列表
  if (matchingIPs.length > 0) {
    // 设置环境变量
    const envs = ['VUE_APP_IP', 'REDIS_HOST', 'SERVER_IP'];
    envs.forEach(env => process.env[env] = matchingIPs[0]);
    console.log("配置环境变量成功");
    // 动态生成config.js加密配置
    generateConfigContent();
  } else {
    // 设置环境变量
    const envs = ['VUE_APP_IP', 'REDIS_HOST', 'SERVER_IP'];
    envs.forEach(env => process.env[env] = "localhost" || "127.0.0.1");
    console.error('没有匹配的IP地址！已设置为localhost');
    // 动态生成config.js加密配置
    generateConfigContent();
  }
}

module.exports = {
  getLocalIPs,
  getMatchingIPs,
  setEnvironmentVariables
};

/** 动态生成config.js加密配置 */
function generateConfigContent() {
  try {
    // 加密配置
    const configContent = encrypt(JSON.stringify({
      VUE_APP_IP: process.env.VUE_APP_IP,
      REDIS_HOST: process.env.REDIS_HOST,
      SERVER_IP: process.env.SERVER_IP
    }));
    // 生成配置文件
    const configPath = path.join(__dirname, 'public', 'config.js');
    fs.writeFileSync(configPath, `window.globalConfig = '${configContent}';`);
  } catch (error) {
    console.error('配置文件生成失败:', error);
  }
}
