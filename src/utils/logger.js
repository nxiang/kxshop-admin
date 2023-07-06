// import BrowserLogger from 'alife-logger'
import pack from "../../package.json";
import BrowserLogger from 'alife-logger'

// arms 监听
const logger = () => {
  // 日志环境
  const environment =
    {
      // 测试环境
      "testh5.kxll.com": "local",
      // 生产环境
      "kxcube.kxll.com": "prod",
    }[location.hostname] || "local";
    
  return BrowserLogger.singleton({
    pid: "difgzidqfh@4deab8a7a00b77c",
    // 日志环境
    environment,
    // 是否为了便于排查错误而记录报错的用户行为
    behavior: true,
    // 监听页面的hashchange事件并重新上报PV，适用于单页面应用场景。
    enableSPA: true,
    // 禁用AJAX请求监听，默认会监听并用于API调用成功率上报
    disableHook: true,
    // 版本号
    release: `v${pack.version}`,
    // 解析页面名字
    parseHash: () => document.title || "kxshop管理端",
  });
};

export default logger;
