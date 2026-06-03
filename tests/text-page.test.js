/**
 * 模块名称：Text itinerary page test
 * 职责描述：验证纯文字静态行程页存在，并覆盖三天路线、关键车次、酒店和必去景点。
 * 输入/输出：读取静态 HTML；输出 Node.js 断言结果。
 * 依赖关系：依赖 Node.js 标准库。
 * 注意事项：只验证静态内容完整性，不验证实时余票或预约状态。
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const pagePath = path.join(__dirname, "..", "itinerary-text.html");
const indexPath = path.join(__dirname, "..", "index.html");

assert(fs.existsSync(pagePath), "itinerary-text.html should exist");

const page = fs.readFileSync(pagePath, "utf8");
const index = fs.readFileSync(indexPath, "utf8");

assert(page.includes("<html lang=\"zh-CN\">"), "text page should be Chinese HTML");
assert(!page.includes("webapi.amap.com"), "text page should not load Amap");
assert(!page.includes("<script"), "text page should be static text without scripts");

for (const phrase of [
  "2026-06-08",
  "2026-06-09",
  "2026-06-10",
  "C3897",
  "G7539",
  "D3107",
  "D3296",
  "D3126",
  "汉庭酒店(桐乡校场东路店)",
  "浙江传媒学院桐乡校区",
  "汉庭酒店(绍兴鲁迅故里店)",
  "鲁迅故里",
  "书圣故里",
  "八字桥",
  "回到泰州",
]) {
  assert(page.includes(phrase), `${phrase} should be present in text page`);
}

assert(index.includes("itinerary-text.html"), "map page should link to the text itinerary page");

console.log("Text itinerary page tests passed.");
