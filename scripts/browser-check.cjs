/**
 * 模块名称：Browser check
 * 职责描述：用 Playwright 快速确认高德地图页面、原生方向路线状态、行程文案和移动端布局。
 * 输入/输出：输入本地或远程 URL；输出检查结果，失败时抛出断言。
 * 依赖关系：依赖 Playwright 与 Node.js 标准库。
 * 注意事项：重点验证页面结构和高德渲染状态，不替代 12306 或景区预约刷新。
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
  await page.waitForFunction(() => {
    const status = JSON.parse(document.documentElement.dataset.amapRouteStatus || "null");
    return status?.directional >= 17;
  }, null, { timeout: 15000 });

  const status = await page.evaluate(() => JSON.parse(document.documentElement.dataset.amapRouteStatus || "null"));
  assert(status.completed >= 17, `expected Amap routes, got ${JSON.stringify(status)}`);
  assert.strictEqual(await page.locator(".direction-arrow").count(), 0, "manual arrow DOM should not exist");
  assert(await page.locator(".amap-layers canvas").count() >= 1, "Amap canvas should render");

  const text = await page.locator("body").innerText();
  for (const phrase of ["2026-06-08", "C3897", "G7539", "D3107", "D3296", "D3126", "浙江传媒学院桐乡校区", "鲁迅故里"]) {
    assert(text.includes(phrase), `${phrase} should be visible`);
  }

  await page.getByRole("button", { name: /总览路线/ }).click();
  await page.getByRole("button", { name: /鲁迅故里/ }).first().click();
  await page.setViewportSize({ width: 390, height: 844 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  assert(!overflow, "mobile viewport should not have horizontal overflow");

  await browser.close();
  console.log("Browser check passed.");
})().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
