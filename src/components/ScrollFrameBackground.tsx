import { useEffect, useRef, useState } from "react";

/**
 * Scroll-driven video background.
 * - Maps document scroll progress to video.currentTime (scrubbing).
 * - Direct mapping (no easing) — video tracks scroll position 1:1
 * - Forces frame decode via requestVideoFrameCallback when available
 * - Honors prefers-reduced-motion: plays slow muted loop instead
 * - Mobile: hides video, uses a static fallback
 *
 * NO poster attribute — we don't want a pre-load flash of any image.
 * The video element starts black until the first frame decodes.
 */
export default function ScrollFrameBackground(_props: { poster?: string } = {}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ready, setReady] = useState(false);

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

  useEffect(() => {
    if (isMobile) return;
    const video = videoRef.current;
    if (!video) return;

    let videoDuration = 0;
    let primed = false;

    // Prime the buffer: play muted briefly to force the browser to
    // download the full video data, otherwise paused-seek renders black.
    const prime = async () => {
      if (primed) return;
      try {
        video.muted = true;
        await video.play();
        // Let it run for 200ms so the buffer fills then pause
        await new Promise((r) => setTimeout(r, 200));
        video.pause();
        video.currentTime = 0;
        primed = true;
        setReady(true);
      } catch {
        primed = true;
        setReady(true);
      }
    };

    const onLoaded = () => {
      videoDuration = video.duration || 0;
      prime();
    };
    video.addEventListener("loadedmetadata", onLoaded);
    if (video.readyState >= 1) onLoaded();

    if (reducedMotion) {
      video.loop = true;
      video.playbackRate = 0.25;
      video.play().catch(() => {});
      return () => video.removeEventListener("loadedmetadata", onLoaded);
    }

    // Direct mapping: scroll position → currentTime, no easing.
    // This is the reliable way — easing makes it look stuck on slow scroll.
    let rafScheduled = false;
    const update = () => {
      rafScheduled = false;
      if (!primed || !videoDuration) return;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0;
      const target = progress * videoDuration;
      // Direct snap to target, browser will decode
      if (Math.abs(video.currentTime - target) > 0.01) {
        video.currentTime = target;
      }
    };

    const onScroll = () => {
      if (rafScheduled) return;
      rafScheduled = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Initial sync
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onScroll);
      window.removeEventListener("resize", onScroll);
      video.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [isMobile, reducedMotion]);

  return (
    <>
      {/* Solid black backdrop — paints first, prevents any flash of
          a placeholder image. The video paints on top once it's ready. */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -3,
          background: "#0a0a0a",
        }}
      />

      {!isMobile && (
        <video
          ref={videoRef}
          id="ciza-scroll-bg"
          muted
          playsInline
          preload="auto"
          // NO poster — eliminates the pre-decode image flash
          style={{
            position: "fixed",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -2,
            opacity: ready ? 1 : 0,
            transition: "opacity 400ms ease",
          }}
        >
          <source src="/video/ciza-scroll.webm" type="video/webm" />
          <source src="/video/ciza-scroll.mp4" type="video/mp4" />
        </video>
      )}

      {isMobile && (
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -2,
            background: "radial-gradient(ellipse at center, #1a1a1a 0%, #0a0a0a 100%)",
          }}
        />
      )}

      {/* Subtle vignette only — no heavy dimming. Video frames are the star. */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          pointerEvents: "none",
          background:
            "linear-gradient(rgba(10,10,10,0.18) 0%, rgba(10,10,10,0.0) 25%, rgba(10,10,10,0.0) 70%, rgba(10,10,10,0.4) 100%)",
        }}
      />
    </>
  );
}
