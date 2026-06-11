import { useState } from "react";

/**
 * Infinite horizontal marquee.
 * - Duplicates items so the loop is seamless
 * - Hover pauses the animation
 * - Fade gradient mask on both edges for elegance
 * - Variable speed via the `duration` prop (seconds for one full loop)
 * - Respects prefers-reduced-motion
 */
type Item = { label: string; accent?: boolean };

export default function Marquee({
  items,
  duration = 38,
  className = "",
}: {
  items: Item[];
  duration?: number;
  className?: string;
}) {
  const [paused, setPaused] = useState(false);
  // Triple the items so the wrap-around is always full
  const loop = [...items, ...items, ...items];

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
        maskImage:
          "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex items-center gap-12 whitespace-nowrap"
        style={{
          animation: `marqueeScroll ${duration}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
          willChange: "transform",
          width: "max-content",
        }}
      >
        {loop.map((it, i) => (
          <span
            key={i}
            className={`flex items-center gap-3 text-sm md:text-base font-mono uppercase tracking-[0.25em] ${
              it.accent ? "text-accent" : "text-fg/65"
            }`}
          >
            {it.label}
            <span
              aria-hidden
              className="inline-block w-1.5 h-1.5 rounded-full bg-accent/70"
            />
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marqueeScroll {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-33.3333%, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="marqueeScroll"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
