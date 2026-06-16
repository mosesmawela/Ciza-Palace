import { useEffect, useRef, useState } from "react";

/**
 * Animated stream counter — counts up from 0 to `target` over `duration`ms
 * once it enters the viewport. Slick tabular-num display with auto-suffix
 * (140000000 → "140M+"). Idempotent (only animates once per mount).
 */
export default function StreamCounter({
  target,
  duration = 2200,
  suffix = "+",
  className = "",
}: {
  target: number;
  duration?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(target);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || startedRef.current) continue;
          startedRef.current = true;
          obs.disconnect();
          const start = performance.now();
          const ease = (t: number) =>
            t === 1 ? 1 : 1 - Math.pow(2, -10 * t); // expoOut
          const tick = (now: number) => {
            const elapsed = now - start;
            const p = Math.min(1, elapsed / duration);
            setValue(Math.round(target * ease(p)));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  const display = (() => {
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    if (value >= 1_000_000) return Math.floor(value / 1_000_000) + "M";
    if (value >= 1_000) return Math.floor(value / 1_000) + "K";
    return value.toString();
  })();

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {display}
      {value >= target && suffix}
    </span>
  );
}
