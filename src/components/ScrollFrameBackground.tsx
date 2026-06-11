import { useEffect, useRef, useState } from "react";

/**
 * Scroll-driven video background.
 * - Maps document scroll progress to video.currentTime (scrubbing).
 * - Honors prefers-reduced-motion: plays slow muted loop instead of scrubbing.
 * - Mobile / coarse-pointer: hides video, falls back to gradient + first-frame poster.
 */
export default function ScrollFrameBackground({ poster }: { poster?: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 720px), (hover: none)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMobile = () => setIsMobile(mqMobile.matches);
    const updateReduced = () => setReducedMotion(mqReduced.matches);
    updateMobile();
    updateReduced();
    mqMobile.addEventListener("change", updateMobile);
    mqReduced.addEventListener("change", updateReduced);
    return () => {
      mqMobile.removeEventListener("change", updateMobile);
      mqReduced.removeEventListener("change", updateReduced);
    };
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const video = videoRef.current;
    if (!video) return;

    let videoDuration = 0;
    let bufferReady = false;
    let targetTime = 0;
    let currentTime = 0;
    let rafId = 0;

    // Prime the buffer by briefly playing then pausing. Browsers won't
    // download the full video data until play() is called, which means
    // paused-seek to a faraway timestamp renders a black frame. Playing
    // once forces the buffer to fill.
    const primeBuffer = async () => {
      try {
        video.muted = true;
        await video.play();
        // Let it play through a couple of frames so the buffer fills,
        // then pause so scroll-scrub takes over.
        setTimeout(() => {
          video.pause();
          video.currentTime = 0;
          bufferReady = true;
        }, 80);
      } catch {
        bufferReady = true; // try seeking anyway
      }
    };

    const onLoaded = () => {
      videoDuration = video.duration || 0;
      primeBuffer();
    };
    video.addEventListener("loadedmetadata", onLoaded);
    if (video.readyState >= 1) onLoaded();

    if (reducedMotion) {
      // No scrubbing — gentle muted loop at 0.25x
      video.loop = true;
      video.playbackRate = 0.25;
      video.play().catch(() => {});
      return () => {
        video.removeEventListener("loadedmetadata", onLoaded);
      };
    }

    // Smooth interpolation loop — every frame, ease currentTime toward
    // the scroll-derived target. This produces buttery scrubbing on rapid
    // wheel input AND keeps the video "active" so the browser keeps
    // decoding frames instead of dropping to a static poster.
    const tick = () => {
      if (bufferReady && videoDuration) {
        const diff = targetTime - currentTime;
        if (Math.abs(diff) > 0.005) {
          currentTime += diff * 0.18; // ease factor
          video.currentTime = currentTime;
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const recalcTarget = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        maxScroll > 0
          ? Math.max(0, Math.min(1, window.scrollY / maxScroll))
          : 0;
      if (videoDuration) targetTime = progress * videoDuration;
    };

    window.addEventListener("scroll", recalcTarget, { passive: true });
    window.addEventListener("wheel", recalcTarget, { passive: true });
    window.addEventListener("resize", recalcTarget, { passive: true });
    recalcTarget();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", recalcTarget);
      window.removeEventListener("wheel", recalcTarget);
      window.removeEventListener("resize", recalcTarget);
      video.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [isMobile, reducedMotion]);

  return (
    <>
      {!isMobile && (
        <video
          ref={videoRef}
          id="ciza-scroll-bg"
          muted
          playsInline
          preload="auto"
          poster={poster}
          style={{
            position: "fixed",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -2,
          }}
        >
          <source src="/video/ciza-scroll.webm" type="video/webm" />
          <source src="/video/ciza-scroll.mp4" type="video/mp4" />
        </video>
      )}
      {isMobile && poster && (
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -2,
            backgroundImage: `url(${poster})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      {/* Subtle vignette + tiny top/bottom fade for legibility — let the
          actual video frames dominate. Was 60-85% black which buried them. */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          pointerEvents: "none",
          background:
            "linear-gradient(rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.0) 25%, rgba(10,10,10,0.0) 70%, rgba(10,10,10,0.35) 100%)",
        }}
      />
    </>
  );
}
