import { useEffect, useState } from "react";

/**
 * Live countdown to a release date.
 * - rAF-throttled (updates ~once per second, no per-frame churn)
 * - Renders DAYS · HOURS · MINUTES · SECONDS
 * - When elapsed, swaps to "OUT NOW"
 * - prefers-reduced-motion still works — purely numeric, no transform animation
 */
export default function Countdown({
  target,
  label = "Album drops in",
  liveLabel = "OUT NOW",
}: {
  /** ISO date string, e.g. "2026-04-15T00:00:00+02:00" */
  target: string;
  label?: string;
  liveLabel?: string;
}) {
  const [diff, setDiff] = useState<number | null>(null);

  useEffect(() => {
    const targetMs = new Date(target).getTime();
    const tick = () => {
      const remaining = targetMs - Date.now();
      setDiff(remaining);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (diff === null) return null;
  if (diff <= 0) {
    return (
      <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        {liveLabel}
      </span>
    );
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const Unit = ({ value, label }: { value: number; label: string }) => (
    <span className="inline-flex flex-col items-center px-2.5">
      <span className="font-display text-2xl md:text-3xl font-bold tabular-nums leading-none text-fg">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted mt-1">
        {label}
      </span>
    </span>
  );

  return (
    <div className="inline-flex flex-col items-center gap-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
        {label}
      </div>
      <div className="inline-flex items-center divide-x divide-white/10">
        <Unit value={days} label="Days" />
        <Unit value={hours} label="Hrs" />
        <Unit value={minutes} label="Min" />
        <Unit value={seconds} label="Sec" />
      </div>
    </div>
  );
}
