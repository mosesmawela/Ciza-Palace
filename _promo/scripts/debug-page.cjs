const { chromium } = require("playwright");
const path = require("path");
const COMP = "file://" + path.resolve(__dirname, "../composition.html").replace(/\\/g, "/");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on("console", m => console.log("[CONSOLE]", m.type(), m.text()));
  page.on("pageerror", e => console.log("[PAGEERROR]", e.message));
  page.on("requestfailed", r => console.log("[REQFAIL]", r.url(), r.failure()?.errorText));
  await page.goto(`${COMP}?aspect=9-16&still=1&scene=1&u=0.9`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  const state = await page.evaluate(() => ({
    rootHtml: document.getElementById("root")?.innerHTML.slice(0, 200),
    hasAnimations: typeof window.Animations,
    hasReact: typeof window.React,
    stillReady: window.__stillReady,
  }));
  console.log("[STATE]", JSON.stringify(state, null, 2));
  await browser.close();
})();
