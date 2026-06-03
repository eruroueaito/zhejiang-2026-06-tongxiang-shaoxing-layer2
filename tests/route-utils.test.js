/**
 * 模块名称：Amap route utility test
 * 职责描述：验证路线工具为高德 JSAPI 生成 [lng, lat] 路径，并要求页面使用高德原生 showDir 箭头而非手工 DOM 箭头。
 * 输入/输出：读取前端数据、工具模块和源码；输出 Node.js 断言结果。
 * 依赖关系：依赖 Node.js 标准库和浏览器全局变量沙箱。
 * 注意事项：只验证数据形态与源码约束，不替代浏览器中的高德渲染检查。
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const tripDataSource = fs.readFileSync(path.join(root, "src", "trip-data.js"), "utf8");
const routeSource = fs.readFileSync(path.join(root, "src", "route-utils.js"), "utf8");
const appSource = fs.readFileSync(path.join(root, "src", "app.js"), "utf8");
const indexSource = fs.readFileSync(path.join(root, "index.html"), "utf8");
const styleSource = fs.readFileSync(path.join(root, "styles.css"), "utf8");

assert(indexSource.includes("https://webapi.amap.com/loader.js"), "index must load Amap JSAPI loader");
assert(!indexSource.toLowerCase().includes("leaflet"), "index must not load Leaflet");
assert(appSource.includes("new AMap.Polyline"), "app must render Amap polylines");
assert(appSource.includes("showDir: true"), "Amap polyline must enable native direction arrows");
assert(!appSource.includes("direction-arrow"), "app must not render manual direction-arrow markers");
assert(!styleSource.includes(".direction-arrow"), "CSS must not keep manual direction-arrow styling");

const sandbox = { window: {} };
vm.runInNewContext(tripDataSource, sandbox);
vm.runInNewContext(routeSource, sandbox);

const segments = sandbox.window.RouteUtils.createRouteSegments(sandbox.window.TRIP_DATA);

assert(segments.length >= 17, `expected at least 17 route segments, got ${segments.length}`);
assert(segments.some((segment) => segment.train === "C3897"), "segments must include C3897");
assert(segments.some((segment) => segment.train === "D3126"), "segments must include D3126");

for (const segment of segments) {
  assert.strictEqual(segment.showDir, true, `${segment.id} should request native direction arrows`);
  assert(Array.isArray(segment.path), `${segment.id} should have a path`);
  assert.strictEqual(segment.path.length, 2, `${segment.id} should have a fallback connector path`);
  for (const point of segment.path) {
    assert.strictEqual(point.length, 2, `${segment.id} point should be [lng, lat]`);
    assert(point[0] > 100 && point[0] < 130, `${segment.id} longitude should be first`);
    assert(point[1] > 20 && point[1] < 40, `${segment.id} latitude should be second`);
  }
}

console.log("Amap route utility tests passed.");
