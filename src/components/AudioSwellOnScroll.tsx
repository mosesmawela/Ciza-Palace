import { useEffect, useRef, useState } from "react";
import { useScrollVelocity } from "../hooks/useScrollVelocity";

/**
 * Quiet, invitational audio that responds to scroll velocity.
 * - Loads a preview clip muted on mount
 * - First user-scroll (counts as user-gesture) unmutes + starts playback
 * - Volume tracks scroll velocity, capped at MAX_VOL (0.18 — barely-there)
 * - Pauses after 3s of stillness
 * - Honors prefers-reduced-motion (skips entirely)
 *
 * To wire the actual Isaka 6am preview: drop the 30s clip into
 *   public/audio/isaka-preview.mp3
 * The component fails silently if the file doesn't exist.
 */
const MAX_VOL = 0.18;
const IDLE_PAUSE_MS = 3000;

export default function AudioSwellOnScroll({
  src = "/audio/isaka-preview.mp3",
}: { src?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastScrollTime = useRef(0);
  const [enabled, setEnabled] = useState(false);
  const { velocityRef } = useScrollVelocity({ decay: 0.93, maxPxPerFrame: 50 });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(!reduced);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const audio = audioRef.current;
    if (!audio) return;

    let started = false;
    let rafId = 0;

    // First scroll wakes the audio (user gesture proxy)
    const onFirstScroll = async () => {
      if (started) return;
      started = true;
      try {
        audio.muted = false;
        audio.volume = 0;
        await audio.play();
      } catch {
        // Autoplay blocked — try again on next interaction
        started = false;
      }
    };

    const onScroll = () => {
      lastScrollTime.current = performance.now();
      onFirstScroll();
    };

    const tick = () => {
      if (started && !audio.paused) {
        const now = performance.now();
        const idle = now - lastScrollTime.current;
        if (idle > IDLE_PAUSE_MS) {
          // Fade out + pause when user has been still
          audio.volume = Math.max(0, audio.volume - 0.01);
          if (audio.volume <= 0.005) {
            audio.pause();
            started = false;
            audio.currentTime = 0;
          }
        } else {
          // Track scroll velocity, capped at MAX_VOL
          const target = velocityRef.current * MAX_VOL;
          audio.volume += (target - audio.volume) * 0.15;
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onScroll, { passive: true });

    // Handle 404 gracefully — log once and stop trying
    const onError = () => {
      console.warn(`[AudioSwellOnScroll] Could not load ${src}. Drop a 30s preview file at public/audio/ to enable.`);
      cancelAnimationFrame(rafId);
    };
    audio.addEventListener("error", onError);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onScroll);
      audio.removeEventListener("error", onError);
    };
  }, [enabled, velocityRef, src]);

  if (!enabled) return null;

  return (
    <audio
      ref={audioRef}
      src={src}
      loop
      muted
      preload="auto"
      style={{ display: "none" }}
      aria-hidden="true"
    />
  );
}
