/**
 * 模块名称：Browser check
 * 职责描述：用 Playwright 快速确认地图页面基础 DOM、路线卡片和移动端无横向溢出。
 * 输入/输出：输入本地或远程 URL；输出检查结果，失败时抛出断言。
 * 依赖关系：依赖 Playwright 与 Node.js 标准库。
 * 注意事项：Leaflet 地图瓦片依赖外网；本脚本重点验证页面结构和可交互骨架。
 */
const assert = require("assert");
const { chromium } = require("playwright");

const url = process.argv[2];
if (!url) {
  throw new Error("Usage: node scripts/browser-check.cjs <url>");
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector(".leaflet-container");

  const markerCount = await page.locator(".leaflet-interactive").count();
  assert(markerCount >= 9, `expected map shapes, got ${markerCount}`);
  const arrowCount = await page.locator(".direction-arrow").count();
  assert(arrowCount >= 11, `expected directional arrows, got ${arrowCount}`);
  await page.getByText("鲁迅故里").first().click();
  await page.getByRole("button", { name: "总览路线" }).click();

  const text = await page.locator("body").innerText();
  assert(text.includes("D3107 48 分钟"));
  assert(text.includes("汉庭绍兴鲁迅故里店"));

  await page.setViewportSize({ width: 390, height: 844 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  assert(!overflow, "mobile viewport should not have horizontal overflow");

  await browser.close();
  console.log("Browser check passed.");
})().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
