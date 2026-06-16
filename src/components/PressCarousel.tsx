import React, { useEffect, useRef, useState } from "react";

/**
 * Press carousel — awards & milestones only, one card visible at a time
 * with swipe / arrow navigation. Each card is a horizontal hero with the
 * article image as a full-bleed right-side photo + text overlay on the left.
 *
 * Visual reference: Concertyy "Top Trending" cards (big photo background +
 * small thumbnail + title + stat line).
 */

export type PressItem = {
  /** Award name shown as the eyebrow tag */
  badge: string;
  /** Headline (the achievement) */
  title: string;
  /** Subhead (org / publication) */
  source: string;
  /** Single-line stat */
  stat: string;
  /** Article hero image (right-side full bleed) */
  heroImage: string;
  /** Optional small thumbnail (left-side avatar) */
  thumb?: string;
  /** Article URL */
  url: string;
};

export default function PressCarousel({ items }: { items: PressItem[] }) {
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const dragStart = useRef<{ x: number; t: number } | null>(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const next = () => setActive((i) => (i + 1) % items.length);
  const prev = () => setActive((i) => (i - 1 + items.length) % items.length);

  // Drag / swipe
  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = { x: e.clientX, t: performance.now() };
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dt = performance.now() - dragStart.current.t;
    dragStart.current = null;
    if (Math.abs(dx) > 60 || (Math.abs(dx) > 30 && Math.abs(dx) / dt > 0.5)) {
      if (dx < 0) next();
      else prev();
    }
  };

  return (
    <div className="relative w-full" ref={wrapRef}>
      {/* Card stage — one item visible at a time, slides in from side */}
      <div
        className="relative overflow-hidden rounded-3xl touch-pan-y select-none"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        style={{ aspectRatio: "16 / 9", maxHeight: 360 }}
      >
        {items.map((p, i) => {
          const isActive = i === active;
          const offset = i - active;
          return (
            <a
              key={i}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-hidden={!isActive}
              tabIndex={isActive ? 0 : -1}
              className="absolute inset-0 flex"
              style={{
                transform: `translateX(${offset * 100}%)`,
                opacity: Math.abs(offset) > 1 ? 0 : 1,
                transition: reducedRef.current
                  ? "none"
                  : "transform 540ms cubic-bezier(0.22, 1, 0.36, 1), opacity 420ms ease",
                pointerEvents: isActive ? "auto" : "none",
              }}
            >
              {/* Background image — full bleed */}
              <img
                src={p.heroImage}
                alt=""
                aria-hidden
                loading={Math.abs(offset) > 1 ? "lazy" : "eager"}
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />
              {/* Left-to-right dark gradient so text on left is legible */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(8,8,10,0.92) 0%, rgba(8,8,10,0.72) 30%, rgba(8,8,10,0.35) 55%, rgba(8,8,10,0.0) 80%)",
                }}
              />
              {/* Bottom shadow for extra contrast on text */}
              <div
                className="absolute inset-x-0 bottom-0 h-1/2"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(8,8,10,0.7) 0%, rgba(8,8,10,0) 100%)",
                }}
              />

              {/* Content overlay */}
              <div className="relative z-10 flex items-center gap-4 md:gap-6 p-5 md:p-8 w-full">
                {/* Small thumbnail */}
                {p.thumb && (
                  <div
                    className="flex-shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-xl overflow-hidden border border-white/15"
                    style={{ boxShadow: "0 8px 24px -8px rgba(0,0,0,0.6)" }}
                  >
                    <img
                      src={p.thumb}
                      alt=""
                      aria-hidden
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>
                )}

                {/* Text block */}
                <div className="flex-1 min-w-0">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent text-bg font-mono text-[9px] md:text-[10px] uppercase tracking-[0.22em] font-bold mb-2 md:mb-3">
                    ★ {p.badge}
                  </div>
                  <h3 className="font-display text-xl md:text-3xl lg:text-4xl font-bold text-fg leading-[1.1] tracking-tight mb-1 md:mb-2 line-clamp-2">
                    {p.title}
                  </h3>
                  <p className="text-fg/75 text-sm md:text-base mb-2">{p.source}</p>
                  <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.18em] text-accent">
                    {p.stat}
                  </p>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Controls below */}
      <div className="flex items-center justify-between gap-4 mt-5">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous press item"
          className="w-10 h-10 rounded-full inline-flex items-center justify-center border border-white/15 text-fg/85 hover:text-accent hover:border-accent/45 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Press ${i + 1} of ${items.length}`}
              className="transition-all"
              style={{
                width: i === active ? 22 : 7,
                height: 7,
                borderRadius: 999,
                background: i === active ? "#F5A623" : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted/85 tabular-nums">
            {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={next}
            aria-label="Next press item"
            className="w-10 h-10 rounded-full inline-flex items-center justify-center border border-white/15 text-fg/85 hover:text-accent hover:border-accent/45 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
