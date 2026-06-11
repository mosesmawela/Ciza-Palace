import { useEffect, useRef } from "react";
import { useScrollVelocity } from "../hooks/useScrollVelocity";

/**
 * Kinetic wordmark — splits text into per-character spans, each rendered
 * at a slightly different z-depth + scroll-velocity-driven font weight.
 *
 * Idle (scroll velocity 0): font-weight 800, tracking -0.02em, dense, monolithic
 * Active (scroll velocity 1): font-weight 200, tracking 0.04em, characters drift apart
 *
 * Each character has a subtle baseline offset to break the wordmark's
 * monolithic feel — gives it the "wordmark is alive" energy without
 * crossing into novelty animation.
 */
export default function KineticWordmark({
  text = "CIZA",
  className = "",
  style = {},
}: {
  text?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  const { velocityRef } = useScrollVelocity({ decay: 0.88, maxPxPerFrame: 40 });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !ref.current) return;

    const chars = Array.from(ref.current.querySelectorAll<HTMLSpanElement>("[data-kinetic-char]"));
    let rafId = 0;

    const tick = () => {
      const v = velocityRef.current; // 0..1
      // Map velocity → font weight (800 → 200), tracking, z offset
      const weight = Math.round(800 - v * 600);
      const tracking = (-0.02 + v * 0.06).toFixed(3);
      ref.current!.style.fontWeight = String(weight);
      ref.current!.style.letterSpacing = `${tracking}em`;
      // Per-character z-depth pulse, phase-offset so they ripple
      const t = performance.now() / 1000;
      chars.forEach((ch, i) => {
        const phase = (i / chars.length) * Math.PI * 2;
        const breath = Math.sin(t * 0.6 + phase) * (0.3 + v * 0.7);
        ch.style.transform = `translate3d(0, ${breath * 4}px, ${breath * 12}px)`;
      });
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [velocityRef]);

  return (
    <h1
      ref={ref}
      className={className}
      style={{
        perspective: "1200px",
        ...style,
      }}
      aria-label={text}
    >
      {text.split("").map((ch, i) => (
        <span
          key={i}
          data-kinetic-char
          aria-hidden="true"
          style={{
            display: "inline-block",
            transformStyle: "preserve-3d",
            willChange: "transform",
            // H1's background-clip:text doesn't propagate through
            // inline-block children — re-apply the same gradient mask
            // on each character so the gold fill renders properly.
            background: "inherit",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </h1>
  );
}
