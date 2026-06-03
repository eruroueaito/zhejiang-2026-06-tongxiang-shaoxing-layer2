/**
 * 模块名称：Trip data test
 * 职责描述：验证浙江桐乡绍兴行程数据覆盖 6/8-6/10 全程，并包含用户确认的大交通、酒店和版本 A 路线。
 * 输入/输出：读取 JSON 行程数据；输出 Node.js 断言结果。
 * 依赖关系：依赖 Node.js 标准库。
 * 注意事项：只验证结构和已确认/已刷新的行程事实，不替代出行前实时购票与预约刷新。
 */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "trip-data.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const allText = JSON.stringify(data);
const poiIds = new Set(data.pois.map((poi) => poi.id));

assert.deepStrictEqual(
  data.days.map((day) => day.date),
  ["2026-06-08", "2026-06-09", "2026-06-10"],
  "itinerary must cover all three calendar days"
);

for (const requiredPoi of [
  "taizhou_station",
  "zhangjiagang_station",
  "tongxiang_station",
  "zhejiang_media_university_tongxiang",
  "tongxiang_hanting",
  "shaoxing_hanting_luxun",
  "luxun_native_place",
  "hangzhou_east",
]) {
  assert(poiIds.has(requiredPoi), `${requiredPoi} must exist`);
}

assert.strictEqual(data.days[0].pois[0], "taizhou_station", "day 1 must start from Taizhou Station");
assert(data.days[0].pois.includes("zhejiang_media_university_tongxiang"), "day 1 must include the Tongxiang campus visit");
assert.strictEqual(data.days[1].pois[1], "tongxiang_station", "day 2 must leave from Tongxiang Station");
assert.strictEqual(data.days[1].pois[3], "shaoxing_hanting_luxun", "day 2 must use selected Shaoxing Hanting");
assert(data.days[1].pois.includes("cangqiao_street"), "version A should include Cangqiao Street");
assert(!data.days.flatMap((day) => day.pois).includes("lanting"), "version A should not include Lanting");
assert.strictEqual(data.days[2].pois.at(-1), "taizhou_station", "day 3 must end back at Taizhou Station");

for (const train of ["C3897", "G7539", "D3107", "D3296", "D3126"]) {
  assert(allText.includes(train), `${train} must be listed in the itinerary`);
}

for (const phrase of ["鲁迅故里", "浙江传媒学院桐乡校区", "汉庭酒店(绍兴鲁迅故里店)", "汉庭酒店(桐乡校场东路店)"]) {
  assert(allText.includes(phrase), `${phrase} must be present`);
}

for (const day of data.days) {
  assert(day.schedule.length >= 6, `${day.date} should have a detailed timeline`);
  assert.strictEqual(day.segments.length, day.pois.length - 1, `${day.id} segment count`);
}

console.log("Trip data tests passed.");
