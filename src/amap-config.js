/**
 * 模块名称：Amap runtime config
 * 职责描述：为静态 GitHub Pages 地图提供高德 JSAPI 浏览器端配置。
 * 输入/输出：无入参；向浏览器全局暴露 `window.AMAP_CONFIG`。
 * 依赖关系：依赖高德 JSAPI v2.0 loader 和浏览器 `atob`。
 * 注意事项：这是公开演示页的轻量混淆；真实生产保护仍应使用域名白名单、轮换密钥或服务端代理。
 */

const decodeConfigPart = (parts) => parts.map((part) => atob(part)).join("");

window.AMAP_CONFIG = {
  jsApiKey: decodeConfigPart([
    "ZjMzZGU5NWQ=",
    "MDhhMTVjN2I=",
    "ODYzNWE5OWQ=",
    "ODI3ZjRiOTE=",
  ]),
  securityJsCode: decodeConfigPart([
    "Y2Q3M2ExZGE=",
    "ODcyN2ZlZjk=",
    "ZTZiMGMwZjU=",
    "OGYxMGJlZGM=",
  ]),
};
