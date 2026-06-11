import { useEffect, useRef, useState } from "react";

/**
 * Page-wide magnetic cursor system.
 * - Cyan-tinted 8px dot tracks the mouse precisely
 * - 40px outline ring lags ~80ms behind with eased physics
 * - Both swell to 1.6× on hover over <a>, <button>, [role="button"]
 * - Magnetic pull when within 60px of an interactive element
 * - Killed on (hover: none) — touch devices keep native scroll
 * - Killed on (prefers-reduced-motion: reduce) — no lag, just hidden
 */
export default function MagneticCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: none), (prefers-reduced-motion: reduce)");
    setEnabled(!mq.matches);
    const onChange = () => setEnabled(!mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX, dotY = mouseY;
    let ringX = mouseX, ringY = mouseY;
    let hovering = false;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Magnetic pull — when within 60px of an interactive element, snap toward it
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const interactive = el?.closest("a, button, [role='button'], input, textarea, label, summary");
      if (interactive) {
        const rect = interactive.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - e.clientX;
        const dy = cy - e.clientY;
        const dist = Math.hypot(dx, dy);
        if (dist < 60) {
          const pull = 1 - dist / 60; // 0..1
          mouseX = e.clientX + dx * pull * 0.35;
          mouseY = e.clientY + dy * pull * 0.35;
        }
        if (!hovering) {
          hovering = true;
          ring.classList.add("is-hover");
          dot.classList.add("is-hover");
        }
      } else if (hovering) {
        hovering = false;
        ring.classList.remove("is-hover");
        dot.classList.remove("is-hover");
      }
    };

    const tick = () => {
      // Dot snaps tight to mouse
      dotX += (mouseX - dotX) * 0.6;
      dotY += (mouseY - dotY) * 0.6;
      // Ring lags with eased physics
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      dot.style.transform = `translate3d(${dotX - 4}px, ${dotY - 4}px, 0)`;
      ring.style.transform = `translate3d(${ringX - 20}px, ${ringY - 20}px, 0)`;
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <style>{`
        body { cursor: none; }
        a, button, [role='button'], input, textarea, label, summary { cursor: none; }
        .magnetic-dot {
          position: fixed; top: 0; left: 0; width: 8px; height: 8px;
          border-radius: 50%; background: rgb(30, 144, 255);
          mix-blend-mode: difference;
          pointer-events: none; z-index: 9998;
          transition: width 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                      height 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                      background 0.25s ease;
          will-change: transform;
        }
        .magnetic-dot.is-hover {
          width: 14px; height: 14px;
          background: rgb(245, 166, 35);
        }
        .magnetic-ring {
          position: fixed; top: 0; left: 0; width: 40px; height: 40px;
          border-radius: 50%; border: 1px solid rgba(245, 245, 245, 0.4);
          pointer-events: none; z-index: 9997;
          transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1),
                      height 0.3s cubic-bezier(0.22, 1, 0.36, 1),
                      border-color 0.3s ease, opacity 0.3s ease;
          will-change: transform;
        }
        .magnetic-ring.is-hover {
          width: 64px; height: 64px;
          border-color: rgba(245, 166, 35, 0.7);
          opacity: 0.85;
        }
      `}</style>
      <div ref={ringRef} className="magnetic-ring" aria-hidden="true" />
      <div ref={dotRef} className="magnetic-dot" aria-hidden="true" />
    </>
  );
}
