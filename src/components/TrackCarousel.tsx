import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate, type PanInfo } from "motion/react";

/**
 * Spotify-style coverflow track carousel — liquid spring physics.
 *
 * - Each cover lives at an offset relative to `active`. Position +
 *   tilt + scale interpolate via Framer Motion springs (not CSS) so
 *   they continuously follow the playhead, not snap-cut.
 * - During drag, every cover's x-offset gets a real-time delta from
 *   the pointer — rubber-band feel.
 * - On drag end, momentum + velocity decide whether to advance.
 * - Active cover subtly breathes (scale 1 ↔ 1.025, 4s loop).
 * - Keyboard arrows + dots remain.
 */

export type Track = {
  name: string;
  cover_url: string;
  spotify_url: string;
  streams?: string;
  metaSlot?: React.ReactNode;
};

const COVER_GAP = 130; // px between cover centers in resting state
const SPRING = { type: "spring" as const, stiffness: 220, damping: 28, mass: 0.7 };
const DRAG_DAMP = 0.6; // how much pointer drag actually moves covers (rubber-band)

export default function TrackCarousel({ tracks }: { tracks: Track[] }) {
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const dragX = useMotionValue(0);

  // Keyboard arrows
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % tracks.length);
      if (e.key === "ArrowLeft") setActive((i) => (i - 1 + tracks.length) % tracks.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tracks.length]);

  const next = () => setActive((i) => (i + 1) % tracks.length);
  const prev = () => setActive((i) => (i - 1 + tracks.length) % tracks.length);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const dx = info.offset.x;
    const vx = info.velocity.x;
    // Combine displacement + flick velocity into a "swipe score"
    const swipe = Math.abs(dx) * 1 + Math.abs(vx) * 0.15;
    if (swipe > 50) {
      if (dx + vx * 0.2 < 0) next();
      else prev();
    }
    animate(dragX, 0, { type: "spring", stiffness: 320, damping: 30 });
  };

  const current = tracks[active];

  return (
    <div className="relative w-full" ref={wrapRef}>
      <motion.div
        className="relative h-[360px] md:h-[420px] flex items-center justify-center select-none touch-pan-y"
        style={{ perspective: "1400px" }}
        drag="x"
        dragElastic={0.18}
        dragConstraints={{ left: 0, right: 0 }}
        dragMomentum={false}
        onDrag={(_e, info) => dragX.set(info.offset.x * DRAG_DAMP)}
        onDragEnd={onDragEnd}
      >
        {tracks.map((t, idx) => {
          // Compute shortest signed distance around the ring
          let raw = idx - active;
          if (raw > tracks.length / 2) raw -= tracks.length;
          if (raw < -tracks.length / 2) raw += tracks.length;
          const isCenter = raw === 0;
          // Reuse dragX so during drag, covers track the finger fluidly
          const x = useTransform(dragX, (d) => raw * COVER_GAP + d);
          const scale = useTransform(dragX, (d) => {
            const offset = raw + d / COVER_GAP;
            const abs = Math.abs(offset);
            return offset === 0
              ? 1
              : abs < 1
              ? 1 - abs * 0.22
              : 0.78 - Math.min(1, abs - 1) * 0.08;
          });
          const ry = useTransform(dragX, (d) => {
            const offset = raw + d / COVER_GAP;
            return offset === 0 ? 0 : offset > 0 ? -22 : 22;
          });
          const opacity = useTransform(dragX, (d) => {
            const offset = raw + d / COVER_GAP;
            const abs = Math.abs(offset);
            return abs > 2.4 ? 0 : abs < 0.5 ? 1 : Math.max(0, 0.7 - (abs - 0.5) * 0.35);
          });
          const z = -Math.abs(raw);
          // Hide far-out covers entirely for perf
          if (Math.abs(raw) > 2) return null;

          return (
            <motion.button
              key={idx}
              type="button"
              onClick={() => setActive(idx)}
              aria-label={`Select ${t.name}`}
              className="absolute rounded-2xl overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{
                width: "min(72vw, 280px)",
                aspectRatio: "1 / 1",
                x,
                scale,
                rotateY: ry,
                opacity,
                zIndex: 10 - Math.abs(raw),
                pointerEvents: isCenter ? "auto" : "auto",
                background: "#111",
                border: "1px solid rgba(255,255,255,0.08)",
                transformStyle: "preserve-3d",
              }}
              transition={SPRING}
              whileTap={{ scale: 0.98 }}
            >
              <motion.img
                src={`${t.cover_url}${t.cover_url.includes("?") ? "&" : "?"}tr=w-640,q-82,f-auto`}
                alt={t.name}
                loading={Math.abs(raw) > 1 ? "lazy" : "eager"}
                draggable={false}
                className="w-full h-full object-cover"
                animate={
                  isCenter
                    ? { scale: [1, 1.03, 1] }
                    : { scale: 1 }
                }
                transition={
                  isCenter
                    ? { duration: 5.2, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.4 }
                }
              />
            </motion.button>
          );
        })}
      </motion.div>

      {/* Now-selected info + player bar */}
      <div className="mt-6 max-w-md mx-auto">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-4"
        >
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
        </motion.div>

        <div
          className="flex items-center gap-3 px-4 py-3 rounded-full border border-white/10"
          style={{
            background: "rgba(14,14,16,0.65)",
            backdropFilter: "blur(20px) saturate(160%)",
            WebkitBackdropFilter: "blur(20px) saturate(160%)",
          }}
        >
          <motion.button
            type="button"
            onClick={prev}
            aria-label="Previous track"
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.1 }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-fg/85 hover:text-accent transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </motion.button>
          <motion.a
            href={current.spotify_url}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.97 }}
            className="beam-border beam-border-white flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold text-bg bg-accent hover:bg-accent/90 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
              <path d="M12 0a12 12 0 100 24 12 12 0 000-24zm5.521 17.34c-.226.371-.706.49-1.076.262-2.946-1.8-6.654-2.207-11.022-1.21a.783.783 0 11-.347-1.526c4.778-1.09 8.879-.62 12.18 1.398.371.226.49.706.265 1.076zm1.473-3.272a.978.978 0 01-1.345.323c-3.372-2.073-8.514-2.673-12.504-1.464a.978.978 0 11-.567-1.873c4.56-1.382 10.215-.71 14.090 1.668a.978.978 0 01.326 1.346zm.127-3.402c-4.043-2.4-10.706-2.621-14.563-1.451a1.174 1.174 0 11-.682-2.247c4.426-1.343 11.787-1.083 16.443 1.682a1.174 1.174 0 11-1.198 2.016z" />
            </svg>
            <span>Play on Spotify</span>
          </motion.a>
          <motion.button
            type="button"
            onClick={next}
            aria-label="Next track"
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.1 }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-fg/85 hover:text-accent transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </motion.button>
        </div>

        {/* Dot indicators with morphing pill */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {tracks.map((_, i) => (
            <motion.button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Go to track ${i + 1}`}
              animate={{
                width: i === active ? 22 : 6,
                backgroundColor: i === active ? "#F5A623" : "rgba(255,255,255,0.25)",
              }}
              transition={SPRING}
              style={{ height: 6, borderRadius: 999 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
