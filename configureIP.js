const os = require('os');
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
 * 设置环境变量
 */
function setEnvironmentVariables() {
  const matchingIPs = getMatchingIPs();  // 获取匹配的IP地址列表
  if (matchingIPs.length > 0) {
    process.env.VUE_APP_IP = matchingIPs[0];  // 设置VUE_APP_IP环境变量
    process.env.REDIS_HOST = matchingIPs[0];  // 设置REDIS_HOST环境变量
    process.env.SERVER_IP = matchingIPs[0];  // 设置SERVER_IP环境变量
    // console.log('Configured IPs:', process.env.VUE_APP_IP, process.env.REDIS_HOST);
  } else {
    process.env.VUE_APP_IP = "localhost" || "127.0.0.1";
    process.env.REDIS_HOST = "localhost" || "127.0.0.1";
    process.env.SERVER_IP = "localhost" || "127.0.0.1";
    console.error('No matching IPs found.');
  }
}
setEnvironmentVariables();

module.exports = {
  getLocalIPs,
  getMatchingIPs,
  setEnvironmentVariables
};
