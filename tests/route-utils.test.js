/**
 * 模块名称：Route utilities test
 * 职责描述：验证地图路线工具能为每个相邻交通段生成方向角，供箭头指引渲染使用。
 * 输入/输出：读取前端工具模块并构造测试日程；输出 Node.js 断言结果。
 * 依赖关系：依赖 Node.js 标准库和一个轻量 Leaflet 边界对象桩。
 * 注意事项：只验证方向角计算和数据形态，不验证浏览器中的像素渲染。
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const source = fs.readFileSync(path.join(__dirname, "..", "src", "route-utils.js"), "utf8");
const sandbox = {
  window: {},
  L: {
    latLngBounds(coords) {
      return { coords };
    }
  }
};

vm.runInNewContext(source, sandbox);

const day = {
  stops: [
    ["start", "Start", 30.0, 120.0, ""],
    ["east", "East", 30.0, 120.1, ""],
    ["north", "North", 30.1, 120.1, ""]
  ],
  labels: ["eastbound", "northbound"]
};

const segments = sandbox.window.RouteUtils.segments(day);

assert.strictEqual(typeof sandbox.window.RouteUtils.directionDegrees, "function");
const midpoint = sandbox.window.RouteUtils.pointBetween(day.stops[0], day.stops[1], 0.5);
assert.strictEqual(midpoint[0], 30);
assert.strictEqual(midpoint[1], 120.05);
assert.strictEqual(segments.length, 2);
assert(Number.isFinite(segments[0].bearingDeg), "first segment should include a finite bearing");
assert(Number.isFinite(segments[1].bearingDeg), "second segment should include a finite bearing");
assert(segments[0].bearingDeg > 80 && segments[0].bearingDeg < 100, `expected eastbound bearing, got ${segments[0].bearingDeg}`);
assert(segments[1].bearingDeg >= 0 && segments[1].bearingDeg < 10, `expected northbound bearing, got ${segments[1].bearingDeg}`);

console.log("Route utility tests passed.");
