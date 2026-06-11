import { useEffect, useRef, useState } from "react";

/**
 * Tracks scroll velocity as a normalized 0..1 value, decaying over time.
 * Used to drive kinetic type (weight, tracking) and audio volume — the
 * faster the user scrolls, the more the visuals respond.
 *
 * Returns a ref to the latest velocity so consumers can read it without
 * re-rendering. Also exposes a React state version for components that
 * want re-renders.
 */
export function useScrollVelocity({
  decay = 0.92,
  maxPxPerFrame = 60,
}: { decay?: number; maxPxPerFrame?: number } = {}) {
  const velocityRef = useRef(0);
  const [velocity, setVelocity] = useState(0);
  const lastY = useRef(0);
  const lastT = useRef(0);
  const rafId = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    lastY.current = window.scrollY;
    let stateUpdateCounter = 0;

    const tick = () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastT.current);
      const dy = Math.abs(window.scrollY - lastY.current);
      // px per 16ms frame, clipped + normalized to 0..1
      const instant = Math.min(1, dy / (maxPxPerFrame * (dt / 16)));
      velocityRef.current = velocityRef.current * decay + instant * (1 - decay);
      // Throttle React state updates to every 4 frames
      if (++stateUpdateCounter % 4 === 0) setVelocity(velocityRef.current);

      lastY.current = window.scrollY;
      lastT.current = now;
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId.current);
  }, [decay, maxPxPerFrame]);

  return { velocity, velocityRef };
}
