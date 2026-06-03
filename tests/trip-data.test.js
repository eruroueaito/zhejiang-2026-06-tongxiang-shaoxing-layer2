/**
 * 模块名称：Trip data test
 * 职责描述：验证浙江桐乡-绍兴 Layer 2 地图数据包含用户确认的车次、酒店和路线顺序。
 * 输入/输出：读取 JSON 行程数据；输出 Node.js 断言结果。
 * 依赖关系：依赖 Node.js 标准库。
 * 注意事项：只验证结构和已确认决策，不验证实时余票或开放状态。
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "trip-data.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const poiIds = new Set(data.pois.map((poi) => poi.id));
assert(poiIds.has("luxun_native_place"), "Lu Xun Native Place must exist");
assert(poiIds.has("shaoxing_hanting_luxun"), "Selected Shaoxing Hanting must exist");
assert.strictEqual(data.rail[0].train, "D3107");
assert.strictEqual(data.rail[0].depart, "10:57");
assert.strictEqual(data.rail[0].arrive, "11:45");
assert.strictEqual(data.days[0].pois[3], "shaoxing_hanting_luxun");
assert(data.days[0].pois.includes("cangqiao_street"), "Version A should include Cangqiao Street");
assert(!data.days.flatMap((day) => day.pois).includes("lanting"), "Version A should not include Lanting");
assert.strictEqual(data.days[1].pois.at(-1), "shaoxing_north");

for (const day of data.days) {
  assert.strictEqual(day.segments.length, day.pois.length - 1, `${day.id} segment count`);
}

console.log("Trip data tests passed.");
