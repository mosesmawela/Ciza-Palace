import { useEffect, useRef, useState } from "react";

/**
 * Canvas-based scroll frame painter.
 * - Pre-loads 59 JPEG frames as Image() objects on mount.
 * - On scroll, paints the appropriate frame onto a fixed-position <canvas>.
 * - No browser video decoder involved — frames change visibly, guaranteed.
 *
 * Pattern: same one Apple/Stripe scroll sequences use.
 */
const DESKTOP_FRAMES = 119;
const MOBILE_FRAMES = 79;
const desktopFramePath = (i: number) =>
  `/frames/frame_${String(i + 1).padStart(3, "0")}.jpg`;
const mobileFramePath = (i: number) =>
  `/frames-mobile/frame_${String(i + 1).padStart(3, "0")}.jpg`;

export default function ScrollFrameBackground(_props: { poster?: string } = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const blurRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ready, setReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 720px), (hover: none)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsMobile(mqMobile.matches);
    setReducedMotion(mqReduced.matches);
    const mu = () => setIsMobile(mqMobile.matches);
    const mr = () => setReducedMotion(mqReduced.matches);
    mqMobile.addEventListener("change", mu);
    mqReduced.addEventListener("change", mr);
    return () => {
      mqMobile.removeEventListener("change", mu);
      mqReduced.removeEventListener("change", mr);
    };
  }, []);

  // Frame source — swaps between desktop (16:9) and mobile (9:16) sets
  const frameCount = isMobile ? MOBILE_FRAMES : DESKTOP_FRAMES;
  const framePath = isMobile ? mobileFramePath : desktopFramePath;

  // Pre-load all frames (mobile + desktop both run this)
  useEffect(() => {
    setReady(false);
    setLoadedCount(0);
    let cancelled = false;
    const images: HTMLImageElement[] = [];
    let loaded = 0;
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        if (cancelled) return;
        loaded += 1;
        setLoadedCount(loaded);
        if (loaded === frameCount) setReady(true);
      };
      img.onerror = () => {
        loaded += 1;
        setLoadedCount(loaded);
        if (loaded === frameCount) setReady(true);
      };
      images.push(img);
    }
    imagesRef.current = images;
    return () => {
      cancelled = true;
    };
  }, [isMobile, frameCount, framePath]);

  // Paint loop — runs on both desktop AND mobile (mobile gets portrait frames)
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    sizeCanvas();

    let lastIdx = -1;
    let easedProgress = 0;
    let targetProgress = 0;
    let rafLoopActive = false;
    const paint = (idx: number) => {
      const img = imagesRef.current[idx];
      if (!img || !img.complete || !img.naturalWidth) return;
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      // cover fit
      const scale = Math.max(cw / iw, ch / ih);
      const w = iw * scale;
      const h = ih * scale;
      const x = (cw - w) / 2;
      const y = (ch - h) / 2;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, x, y, w, h);
    };

    // Continuous rAF loop that eases the painted progress toward the
    // scroll position. With 119/79 frames + ~0.20 ease factor, fast
    // scrolls slide through smoothly and slow scrolls anchor — no
    // visible "skip" between frames.
    const tick = () => {
      // Lerp eased toward target
      const delta = targetProgress - easedProgress;
      if (Math.abs(delta) > 0.0001) {
        easedProgress += delta * 0.22;
      } else {
        easedProgress = targetProgress;
      }
      const idx = Math.min(
        frameCount - 1,
        Math.round(easedProgress * (frameCount - 1))
      );
      if (idx !== lastIdx) {
        lastIdx = idx;
        paint(idx);
      }
      if (rafLoopActive) requestAnimationFrame(tick);
    };
    rafLoopActive = true;
    requestAnimationFrame(tick);

    const update = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      targetProgress =
        maxScroll > 0
          ? Math.max(0, Math.min(1, window.scrollY / maxScroll))
          : 0;
      // Focal blur: progress 0 = full screen blurred 32px, no transparent center
      // progress 1 = sides blurred 10px, center fully open
      const blurEl = blurRef.current;
      if (blurEl) {
        // Use 0..0.5 window for the focal-open animation; after 0.5 keep state stable
        const focal = Math.min(1, targetProgress / 0.5);
        const blurAmt = 32 - focal * 22; // 32 → 10
        const innerR = focal * 38; // 0 → 38% transparent radius
        const outerR = 60 + focal * 35; // 60 → 95% blur falloff edge
        blurEl.style.backdropFilter = `blur(${blurAmt.toFixed(1)}px) saturate(115%)`;
        (blurEl.style as unknown as { webkitBackdropFilter: string }).webkitBackdropFilter = `blur(${blurAmt.toFixed(1)}px) saturate(115%)`;
        const mask = `radial-gradient(circle at 50% 42%, transparent 0%, transparent ${innerR.toFixed(1)}%, black ${outerR.toFixed(1)}%)`;
        blurEl.style.mask = mask;
        (blurEl.style as unknown as { webkitMaskImage: string }).webkitMaskImage = mask;
      }
    };

    const onScroll = () => {
      update();
    };

    const onResize = () => {
      sizeCanvas();
      lastIdx = -1;
      update();
    };

    // Initial paint + sync target
    paint(0);
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onScroll, { passive: true });
    window.addEventListener("touchmove", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      rafLoopActive = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onScroll);
      window.removeEventListener("touchmove", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [isMobile, ready, reducedMotion]);

  return (
    <>
      {/* Solid black backdrop — paints first, prevents any pre-load flash */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -3,
          background: "#0a0a0a",
        }}
      />

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: -2,
          opacity: ready ? 1 : 0,
          transition: "opacity 600ms ease",
          pointerEvents: "none",
        }}
      />

      {/* Loading fallback gradient while frames preload */}
      {!ready && (
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -2,
            background:
              "radial-gradient(ellipse at center, #1a1a1a 0%, #0a0a0a 100%)",
          }}
        />
      )}

      {/* Focal scroll-blur overlay — sits above the canvas, blurs it
          through backdrop-filter. Initially uniform 32px blur over the
          whole screen. As user scrolls, a radial-gradient mask opens
          a transparent circle at the center (CIZA wordmark) and the
          blur strength drops from 32 → 10px. Sides remain softly
          blurred at the end. */}
      {!isMobile && (
        <div
          ref={blurRef}
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -1,
            pointerEvents: "none",
            backdropFilter: "blur(32px) saturate(115%)",
            WebkitBackdropFilter: "blur(32px) saturate(115%)",
            // Initial mask: black everywhere = blur visible everywhere
            mask: "radial-gradient(circle at 50% 42%, transparent 0%, transparent 0%, black 60%)",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 42%, transparent 0%, transparent 0%, black 60%)",
            transition: reducedMotion
              ? "none"
              : "backdrop-filter 120ms linear",
          }}
        />
      )}

      {/* Faint top/bottom vignette for content legibility */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          pointerEvents: "none",
          background:
            "linear-gradient(rgba(10,10,10,0.22) 0%, rgba(10,10,10,0) 18%, rgba(10,10,10,0) 78%, rgba(10,10,10,0.45) 100%)",
        }}
      />

      {/* Loading indicator (only shown until all frames preload) */}
      {!isMobile && !ready && loadedCount > 0 && loadedCount < frameCount && (
        <div
          aria-hidden
          style={{
            position: "fixed",
            bottom: 24,
            left: 24,
            zIndex: 10,
            fontSize: 10,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.4)",
            fontFamily: "monospace",
          }}
        >
          LOADING · {Math.floor((loadedCount / frameCount) * 100)}%
        </div>
      )}
    </>
  );
}
