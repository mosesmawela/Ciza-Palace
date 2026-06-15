#!/usr/bin/env node
/**
 * Renders still PNGs from composition.html, one per scene, at vertical 9:16.
 * Serves _promo/ via local HTTP (file:// CORS blocks external babel script).
 */
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const http = require("http");

const PROMO_ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(PROMO_ROOT, "stills");
fs.mkdirSync(OUT_DIR, { recursive: true });

const PORT = 4787;
const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".jsx": "text/babel",
  ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg",
  ".svg": "image/svg+xml", ".json": "application/json", ".mp3": "audio/mpeg",
};

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  const file = path.join(PROMO_ROOT, url === "/" ? "/composition.html" : url);
  if (!file.startsWith(PROMO_ROOT) || !fs.existsSync(file)) {
    res.writeHead(404); res.end("404"); return;
  }
  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream", "Access-Control-Allow-Origin": "*" });
  fs.createReadStream(file).pipe(res);
});

const SHOTS = [
  { scene: 1, u: 0.95, label: "01-logo-burst" },
  { scene: 2, u: 0.45, label: "02-frame-stutter" },
  { scene: 3, u: 0.80, label: "03-pull-quote" },
  { scene: 4, u: 0.50, label: "04-tour-ticker" },
  { scene: 5, u: 0.55, label: "05-press-ripple" },
  { scene: 6, u: 0.80, label: "06-inner-circle" },
  { scene: 7, u: 0.75, label: "07-end-card" },
];

server.listen(PORT, async () => {
  console.log(`[server] http://localhost:${PORT}`);
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 } });
  const page = await ctx.newPage();
  page.on("pageerror", e => console.log("[PAGEERROR]", e.message));

  for (const s of SHOTS) {
    const url = `http://localhost:${PORT}/composition.html?aspect=9-16&still=1&scene=${s.scene}&u=${s.u}`;
    console.log(`→ ${s.label}`);
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.__stillReady === true, { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(900);
    const outPath = path.join(OUT_DIR, `${s.label}.png`);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`  ${(fs.statSync(outPath).size / 1024).toFixed(1)} KB`);
  }
  await browser.close();
  server.close();
  console.log(`\n${SHOTS.length} stills rendered`);
});
