import React, { useEffect, useRef, useState } from "react";

/**
 * Spotify-style coverflow track carousel.
 * - Center cover large + side covers preview (3D-tilted)
 * - Prev/next chevrons + dot indicators + keyboard arrows
 * - Drag / swipe support on touch devices
 * - Bottom "now-selected" player bar with cover + title + listen CTA
 *
 * Visual reference: iOS Music coverflow + Spotify mini player.
 */

export type Track = {
  name: string;
  cover_url: string;
  spotify_url: string;
  streams?: string;
  // Optional render override for the meta line — e.g. an animated counter
  // for the breakout track.
  metaSlot?: React.ReactNode;
};

export default function TrackCarousel({ tracks }: { tracks: Track[] }) {
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const dragStart = useRef<{ x: number; t: number } | null>(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const next = () => setActive((i) => (i + 1) % tracks.length);
  const prev = () => setActive((i) => (i - 1 + tracks.length) % tracks.length);

  // Keyboard arrow keys when carousel is focused
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!wrapRef.current?.contains(document.activeElement) && document.activeElement !== document.body) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

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
    // Swipe threshold: 60px OR fast flick (>0.5 px/ms)
    if (Math.abs(dx) > 60 || (Math.abs(dx) > 30 && Math.abs(dx) / dt > 0.5)) {
      if (dx < 0) next();
      else prev();
    }
  };

  const trackForIndex = (i: number) => tracks[(i + tracks.length) % tracks.length];
  const current = tracks[active];

  return (
    <div className="relative w-full" ref={wrapRef}>
      {/* Cover row — touch-friendly drag area */}
      <div
        className="relative h-[360px] md:h-[420px] flex items-center justify-center select-none touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        style={{ perspective: "1400px" }}
      >
        {[-2, -1, 0, 1, 2].map((offset) => {
          const idx = (active + offset + tracks.length) % tracks.length;
          const t = trackForIndex(idx);
          const isCenter = offset === 0;
          // 3D transform for coverflow
          const tx = offset * 130;
          const ry = offset === 0 ? 0 : offset > 0 ? -22 : 22;
          const scale = offset === 0 ? 1 : 0.78 - Math.min(1, Math.abs(offset) - 1) * 0.08;
          const opacity = Math.abs(offset) > 2 ? 0 : offset === 0 ? 1 : 0.55 - (Math.abs(offset) - 1) * 0.18;
          const z = -Math.abs(offset);
          return (
            <button
              key={`${idx}-${offset}`}
              type="button"
              onClick={() => setActive(idx)}
              aria-label={`Select ${t.name}`}
              className="absolute rounded-2xl overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{
                width: "min(72vw, 280px)",
                aspectRatio: "1 / 1",
                transform: `translate3d(${tx}px, 0, ${z * 100}px) scale(${scale}) rotateY(${ry}deg)`,
                opacity,
                transition: reducedRef.current ? "none" : "transform 540ms cubic-bezier(0.22, 1, 0.36, 1), opacity 420ms ease",
                zIndex: 10 - Math.abs(offset),
                pointerEvents: isCenter ? "auto" : "none",
                cursor: isCenter ? "default" : "pointer",
                background: "#111",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <img
                src={`${t.cover_url}${t.cover_url.includes("?") ? "&" : "?"}tr=w-640,q-82,f-auto`}
                alt={t.name}
                loading={Math.abs(offset) > 1 ? "lazy" : "eager"}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </button>
          );
        })}
      </div>

      {/* Now-selected info + player bar */}
      <div className="mt-6 max-w-md mx-auto">
        <div className="text-center mb-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted/85 mb-1.5">
            {String(active + 1).padStart(2, "0")} · CATALOG
          </div>
          <div className="font-display text-2xl md:text-3xl font-bold tracking-tight">
            {current.name}
          </div>
          {current.metaSlot ? (
            <div className="mt-1 text-xs md:text-sm text-fg/85">{current.metaSlot}</div>
          ) : current.streams ? (
            <div className="mt-1 text-xs md:text-sm text-muted">{current.streams}</div>
          ) : null}
        </div>

        {/* Player bar */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-full border border-white/10"
          style={{
            background: "rgba(14,14,16,0.65)",
            backdropFilter: "blur(20px) saturate(160%)",
            WebkitBackdropFilter: "blur(20px) saturate(160%)",
          }}
        >
          <button
            type="button"
            onClick={prev}
            aria-label="Previous track"
            className="w-9 h-9 rounded-full flex items-center justify-center text-fg/85 hover:text-accent transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <a
            href={current.spotify_url}
            target="_blank"
            rel="noopener noreferrer"
            className="beam-border beam-border-white flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold text-bg bg-accent hover:bg-accent/90 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
              <path d="M12 0a12 12 0 100 24 12 12 0 000-24zm5.521 17.34c-.226.371-.706.49-1.076.262-2.946-1.8-6.654-2.207-11.022-1.21a.783.783 0 11-.347-1.526c4.778-1.09 8.879-.62 12.18 1.398.371.226.49.706.265 1.076zm1.473-3.272a.978.978 0 01-1.345.323c-3.372-2.073-8.514-2.673-12.504-1.464a.978.978 0 11-.567-1.873c4.56-1.382 10.215-.71 14.090 1.668a.978.978 0 01.326 1.346zm.127-3.402c-4.043-2.4-10.706-2.621-14.563-1.451a1.174 1.174 0 11-.682-2.247c4.426-1.343 11.787-1.083 16.443 1.682a1.174 1.174 0 11-1.198 2.016z" />
            </svg>
            <span>Play on Spotify</span>
          </a>
          <button
            type="button"
            onClick={next}
            aria-label="Next track"
            className="w-9 h-9 rounded-full flex items-center justify-center text-fg/85 hover:text-accent transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {tracks.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Go to track ${i + 1}`}
              className="transition-all"
              style={{
                width: i === active ? 20 : 6,
                height: 6,
                borderRadius: 999,
                background: i === active ? "#F5A623" : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
