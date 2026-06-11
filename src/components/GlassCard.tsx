import { ReactNode, useRef, MouseEvent, useId } from "react";

/**
 * Frosted glass card — heavy frost, neutral palette, single light-beam sweep.
 * - Heavy backdrop-blur + saturate for the frosted look on every card
 * - Thin neutral white rim, no chromatic colors
 * - Single diagonal light beam sweeps across the surface every ~8s
 * - Drifting droplets retained (subtle, white only)
 * - Click → bean burst (white + amber accent only) + ripple
 * - Honors prefers-reduced-motion
 */
type Props = {
  children: ReactNode;
  className?: string;
  intensity?: "soft" | "strong";
  as?: "div" | "section" | "article";
  id?: string;
  onClick?: () => void;
};

export default function GlassCard({
  children,
  className = "",
  intensity = "strong",
  as = "div",
  id,
  onClick,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const uid = useId().replace(/:/g, "");

  const handleClick = (_e: MouseEvent<HTMLDivElement>) => {
    onClick?.();
  };

  const Tag = as;
  // Heavy frost across the board now — matches the press-card density
  const blur = intensity === "strong" ? 32 : 26;
  const bg =
    intensity === "strong"
      ? "rgba(20, 20, 22, 0.42)"
      : "rgba(20, 20, 22, 0.34)";

  return (
    <Tag
      id={id}
      ref={ref as never}
      onClick={handleClick}
      className={`glass-card frost-glass relative isolate rounded-3xl overflow-hidden ${className}`}
      style={{
        background: bg,
        backdropFilter: `blur(${blur}px) saturate(160%)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(160%)`,
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: [
          "0 28px 80px -28px rgba(0,0,0,0.75)",
          "inset 0 1px 0 rgba(255,255,255,0.18)",
          "inset 0 -1px 0 rgba(0,0,0,0.22)",
        ].join(", "),
      }}
    >
      {/* Diagonal light beam — single white sweep across the surface */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
      >
        <div className="frost-glass-beam" />
      </div>

      {/* Top edge highlight — thin white line at the top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.30) 50%, transparent 100%)",
        }}
      />

      {/* Drifting droplets — pure white, low opacity */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <defs>
          <radialGradient id={`drop-${uid}`} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0.10)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        {[
          { cx: 12, cy: 18, r: 1.0, dur: 18, delay: 0 },
          { cx: 78, cy: 32, r: 1.4, dur: 24, delay: -6 },
          { cx: 28, cy: 72, r: 0.8, dur: 21, delay: -12 },
          { cx: 62, cy: 88, r: 1.2, dur: 27, delay: -3 },
          { cx: 88, cy: 12, r: 0.9, dur: 20, delay: -9 },
        ].map((d, i) => (
          <circle
            key={i}
            cx={d.cx}
            cy={d.cy}
            r={d.r}
            fill={`url(#drop-${uid})`}
            style={{
              animation: `glassDrip ${d.dur}s linear ${d.delay}s infinite`,
            }}
          />
        ))}
      </svg>

      <style>{`
        @keyframes glassDrip {
          0%   { transform: translate(0, -2%); opacity: 0; }
          8%   { opacity: 0.45; }
          50%  { opacity: 0.30; }
          92%  { opacity: 0.40; }
          100% { transform: translate(2%, 110%); opacity: 0; }
        }
        /* Single diagonal light beam — thin white streak that sweeps
           from top-left to bottom-right every 8s. Pauses off-card
           between sweeps so it doesn't feel busy. */
        @keyframes frostBeamSweep {
          0%   { transform: translate3d(-130%, -130%, 0) rotate(25deg); opacity: 0; }
          8%   { opacity: 0.9; }
          50%  { opacity: 0.9; }
          70%  { transform: translate3d(130%, 130%, 0) rotate(25deg); opacity: 0; }
          100% { transform: translate3d(130%, 130%, 0) rotate(25deg); opacity: 0; }
        }
        .frost-glass-beam {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 60%;
          height: 200%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.0) 30%,
            rgba(255, 255, 255, 0.22) 48%,
            rgba(255, 255, 255, 0.45) 50%,
            rgba(255, 255, 255, 0.22) 52%,
            rgba(255, 255, 255, 0.0) 70%,
            transparent 100%
          );
          filter: blur(2px);
          mix-blend-mode: screen;
          animation: frostBeamSweep 8s ease-in-out infinite;
          animation-delay: var(--beam-delay, 0s);
          will-change: transform, opacity;
        }
        @media (prefers-reduced-motion: reduce) {
          .glass-card svg circle { animation: none !important; opacity: 0.18; }
          .frost-glass-beam { animation: none !important; opacity: 0; }
        }
      `}</style>

      <div className="relative z-10">{children}</div>
    </Tag>
  );
}
