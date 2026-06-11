import { ReactNode, useEffect, useRef } from "react";

/**
 * Animated section number bubble.
 * - Small SVG circle with stroke-dashoffset draw-in on viewport entry
 * - Number sits inside the circle, fades up after stroke completes
 * - Pulsing outer ring loop after draw-in resolves
 * - Respects prefers-reduced-motion (renders static)
 */
export default function EyebrowBubble({
  number,
  children,
}: {
  number: string;
  children: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const circleRef = useRef<SVGCircleElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const circle = circleRef.current;
    if (!wrap || !circle) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      circle.style.strokeDashoffset = "0";
      wrap.classList.add("eyebrow-bubble-revealed");
      return;
    }
    const r = circle.r.baseVal.value;
    const c = 2 * Math.PI * r;
    circle.style.strokeDasharray = `${c}`;
    circle.style.strokeDashoffset = `${c}`;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            circle.style.transition =
              "stroke-dashoffset 720ms cubic-bezier(0.22, 1, 0.36, 1)";
            circle.style.strokeDashoffset = "0";
            setTimeout(() => wrap.classList.add("eyebrow-bubble-revealed"), 480);
            obs.unobserve(wrap);
          }
        });
      },
      { threshold: 0.3 }
    );
    obs.observe(wrap);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="eyebrow-bubble flex items-center gap-3 mb-4">
      <span className="relative inline-flex items-center justify-center w-9 h-9">
        <svg
          aria-hidden
          width="36"
          height="36"
          viewBox="0 0 36 36"
          className="absolute inset-0"
        >
          <circle
            ref={circleRef}
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="rgba(245, 166, 35, 0.9)"
            strokeWidth="1"
            strokeLinecap="round"
            transform="rotate(-90 18 18)"
          />
          {/* Pulse ring — kicks in after the main draw completes */}
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="rgba(245, 166, 35, 0.55)"
            strokeWidth="1"
            className="eyebrow-pulse"
          />
        </svg>
        <span className="relative font-mono text-[10px] text-accent eyebrow-num">
          {number}
        </span>
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
        {children}
      </span>
      <style>{`
        .eyebrow-num { opacity: 0; transform: translateY(2px); transition: opacity 380ms ease, transform 380ms ease; }
        .eyebrow-bubble-revealed .eyebrow-num { opacity: 1; transform: translateY(0); }
        .eyebrow-pulse { opacity: 0; transform-origin: 18px 18px; }
        .eyebrow-bubble-revealed .eyebrow-pulse {
          animation: eyebrowPulse 3.4s ease-out infinite;
        }
        @keyframes eyebrowPulse {
          0%   { opacity: 0.55; transform: scale(1); }
          100% { opacity: 0;    transform: scale(1.7); }
        }
        @media (prefers-reduced-motion: reduce) {
          .eyebrow-pulse { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
