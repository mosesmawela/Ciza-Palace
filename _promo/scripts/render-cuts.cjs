#!/usr/bin/env node
/**
 * Renders the 3 CIZA promo cuts end-to-end:
 *   1. ciza-promo-9x16-15s.mp4   (vertical short)
 *   2. ciza-promo-9x16-30s.mp4   (vertical full)
 *   3. ciza-promo-16x9-30s.mp4   (landscape full)
 *
 * Pipeline per cut:
 *   a. Serve _promo/ over local HTTP (file:// CORS blocks babel)
 *   b. Playwright warmup + recordVideo capture → WebM
 *   c. ffmpeg WebM → MP4 (trim front-loading flash, set duration)
 *   d. ffmpeg + adelay/amix → mux SFX cue list into MP4 audio track
 *   e. (vertical cuts only) ffmpeg → palette-optimized GIF derivative
 */
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const http = require("http");
const { spawnSync } = require("child_process");

const PROMO_ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(PROMO_ROOT, "out");
const SFX_DIR = path.join(PROMO_ROOT, "assets/sfx");
const TMP_DIR = path.join(PROMO_ROOT, ".tmp-render");
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(TMP_DIR, { recursive: true });

const PORT = 4788;
const MIME = {
  ".html":"text/html",".js":"text/javascript",".jsx":"text/babel",".css":"text/css",
  ".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml",".json":"application/json",".mp3":"audio/mpeg",
};
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  const file = path.join(PROMO_ROOT, url === "/" ? "/composition.html" : url);
  if (!file.startsWith(PROMO_ROOT) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream", "Access-Control-Allow-Origin": "*" });
  fs.createReadStream(file).pipe(res);
});

// Cut definitions
const CUTS = [
  {
    name: "ciza-promo-9x16-15s",
    aspect: "9-16", duration: 15, scenes: "1,4,5,6,7",
    width: 1080, height: 1920,
    sfx: [
      { at: 0.0,  file: "rise.mp3" },
      { at: 1.0,  file: "whoosh.mp3" },
      { at: 4.5,  file: "whoosh.mp3" },
      { at: 7.5,  file: "whoosh.mp3" },
      { at: 11.0, file: "drop.mp3" },
      { at: 13.5, file: "tail.mp3" },
    ],
    makeGif: true,
  },
  {
    name: "ciza-promo-9x16-30s",
    aspect: "9-16", duration: 30, scenes: "1,2,3,4,5,6,7",
    width: 1080, height: 1920,
    sfx: [
      { at: 0.0,  file: "rise.mp3" },
      { at: 1.5,  file: "drop.mp3" },
      { at: 4.5,  file: "whoosh.mp3" },
      { at: 8.0,  file: "whoosh.mp3" },
      { at: 13.0, file: "whoosh.mp3" },
      { at: 18.0, file: "dissolve.mp3" },
      { at: 24.0, file: "whoosh.mp3" },
      { at: 28.5, file: "tail.mp3" },
    ],
    makeGif: true,
  },
  {
    name: "ciza-promo-16x9-30s",
    aspect: "16-9", duration: 30, scenes: "1,2,3,4,5,6,7",
    width: 1920, height: 1080,
    sfx: [
      { at: 0.0,  file: "rise.mp3" },
      { at: 1.5,  file: "drop.mp3" },
      { at: 4.5,  file: "whoosh.mp3" },
      { at: 8.0,  file: "whoosh.mp3" },
      { at: 13.0, file: "whoosh.mp3" },
      { at: 18.0, file: "dissolve.mp3" },
      { at: 24.0, file: "whoosh.mp3" },
      { at: 28.5, file: "tail.mp3" },
    ],
    makeGif: false,
  },
];

function ffmpeg(args, label) {
  const r = spawnSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", ...args], { stdio: ["ignore", "inherit", "inherit"] });
  if (r.status !== 0) {
    console.error(`  ✗ ffmpeg [${label}] failed`);
    process.exit(1);
  }
}

async function renderCut(cut, browser) {
  const url = `http://localhost:${PORT}/composition.html?aspect=${cut.aspect}&duration=${cut.duration}&scenes=${cut.scenes}`;
  const webmTmp = path.join(TMP_DIR, cut.name);
  fs.mkdirSync(webmTmp, { recursive: true });
  console.log(`\n▸ ${cut.name}  (${cut.width}×${cut.height}, ${cut.duration}s)`);

  // Phase 1: warmup
  const wctx = await browser.newContext({ viewport: { width: cut.width, height: cut.height } });
  const wpage = await wctx.newPage();
  await wpage.goto(url, { waitUntil: "load", timeout: 60000 });
  await wpage.waitForTimeout(1200);
  await wctx.close();

  // Phase 2: record
  const rctx = await browser.newContext({
    viewport: { width: cut.width, height: cut.height },
    deviceScaleFactor: 1,
    recordVideo: { dir: webmTmp, size: { width: cut.width, height: cut.height } },
  });
  await rctx.addInitScript(() => { window.__recording = true; });
  const rpage = await rctx.newPage();
  await rpage.goto(url, { waitUntil: "load" });
  await rpage.waitForFunction(() => window.__ready === true, { timeout: 8000 }).catch(() => {});
  await rpage.waitForTimeout(cut.duration * 1000 + 800);
  const videoPath = await rpage.video().path();
  await rpage.close();
  await rctx.close();

  // Phase 3: WebM → MP4 (trim to exact duration, encode h264)
  const baseMp4 = path.join(TMP_DIR, `${cut.name}-base.mp4`);
  console.log(`  ▸ trim + encode → ${path.basename(baseMp4)}`);
  ffmpeg([
    "-i", videoPath,
    "-t", String(cut.duration),
    "-vf", `scale=${cut.width}:${cut.height}:flags=lanczos,fps=30`,
    "-c:v", "libx264", "-preset", "medium", "-crf", "20",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    "-an",
    baseMp4,
  ], "encode");

  // Phase 4: SFX mux
  const finalMp4 = path.join(OUT_DIR, `${cut.name}.mp4`);
  console.log(`  ▸ SFX mux (${cut.sfx.length} cues) → ${path.basename(finalMp4)}`);
  // Build ffmpeg args: -i base.mp4 -i sfx1 -i sfx2 ... -filter_complex "..."
  const sfxInputs = cut.sfx.map(s => ["-i", path.join(SFX_DIR, s.file)]).flat();
  const filterParts = cut.sfx.map((s, i) => {
    const ms = Math.round(s.at * 1000);
    return `[${i + 1}:a]adelay=${ms}|${ms},volume=0.85[s${i}]`;
  });
  const mixIns = cut.sfx.map((_, i) => `[s${i}]`).join("");
  const filter = `${filterParts.join(";")};${mixIns}amix=inputs=${cut.sfx.length}:duration=longest:normalize=0,volume=1.5,asetpts=PTS-STARTPTS[aout]`;
  ffmpeg([
    "-i", baseMp4,
    ...sfxInputs,
    "-filter_complex", filter,
    "-map", "0:v", "-map", "[aout]",
    "-c:v", "copy",
    "-c:a", "aac", "-b:a", "192k",
    "-shortest",
    finalMp4,
  ], "mux");

  const sz = fs.statSync(finalMp4).size;
  console.log(`  ✓ ${path.basename(finalMp4)}  ${(sz / 1024 / 1024).toFixed(2)} MB`);

  // Phase 5: GIF derivative
  if (cut.makeGif) {
    const gifOut = path.join(OUT_DIR, `${cut.name}.gif`);
    const paletteTmp = path.join(TMP_DIR, `${cut.name}-palette.png`);
    console.log(`  ▸ palette + GIF → ${path.basename(gifOut)}`);
    ffmpeg([
      "-i", finalMp4,
      "-vf", `fps=15,scale=540:-1:flags=lanczos,palettegen=stats_mode=full`,
      paletteTmp,
    ], "palette");
    ffmpeg([
      "-i", finalMp4, "-i", paletteTmp,
      "-filter_complex", `fps=15,scale=540:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=sierra2_4a`,
      gifOut,
    ], "gif");
    console.log(`  ✓ ${path.basename(gifOut)}  ${(fs.statSync(gifOut).size / 1024 / 1024).toFixed(2)} MB`);
  }
}

server.listen(PORT, async () => {
  console.log(`[server] http://localhost:${PORT}`);
  const browser = await chromium.launch();
  try {
    for (const cut of CUTS) {
      await renderCut(cut, browser);
    }
  } finally {
    await browser.close();
    server.close();
  }
  // Clean tmp
  fs.rmSync(TMP_DIR, { recursive: true, force: true });
  console.log("\n✓ all cuts rendered to _promo/out/");
});
