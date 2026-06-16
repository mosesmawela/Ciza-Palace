import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  type PanInfo,
  type MotionValue,
} from "motion/react";

/**
 * Spotify-style coverflow track carousel.
 *
 * Architecture — one continuous "position" motion value drives every cover.
 * - `position` MV holds a float (e.g. 2.0 = on track 2, 1.6 = between 1 and 2)
 * - On click/arrow/dot: animate `position` to integer with spring
 * - On drag: update `position` directly from drag offset / cover gap
 * - On drag end: snap to nearest integer with velocity-aware spring
 *
 * Each cover renders its own transforms from `position` — no hooks-in-loop,
 * single source of truth, fluid through the whole interaction.
 */

export type Track = {
  name: string;
  cover_url: string;
  spotify_url: string;
  streams?: string;
  metaSlot?: React.ReactNode;
};

const COVER_GAP = 130;
const SNAP_SPRING = { type: "spring" as const, stiffness: 260, damping: 30, mass: 0.65 } as const;
const SOFT_SPRING = { type: "spring" as const, stiffness: 200, damping: 24, mass: 0.6 } as const;

// Shortest signed distance considering wrap-around
function signedDist(idx: number, pos: number, total: number): number {
  let d = idx - pos;
  if (d > total / 2) d -= total;
  if (d < -total / 2) d += total;
  return d;
}

type CoverProps = {
  track: Track;
  index: number;
  total: number;
  position: MotionValue<number>;
  isCenter: boolean;
  onSelect: () => void;
};

const Cover: React.FC<CoverProps> = ({
  track,
  index,
  total,
  position,
  isCenter,
  onSelect,
}) => {
  const x = useTransform(position, (p: number) => signedDist(index, p, total) * COVER_GAP);
  const scale = useTransform(position, (p: number) => {
    const d = signedDist(index, p, total);
    const abs = Math.abs(d);
    if (abs < 1) return 1 - abs * 0.22;
    return Math.max(0.55, 0.78 - (abs - 1) * 0.08);
  });
  const rotateY = useTransform(position, (p: number) => {
    const d = signedDist(index, p, total);
    if (d === 0) return 0;
    // ease the tilt across the centre — feels smoother than constant ±22°
    const sign = d > 0 ? -1 : 1;
    return sign * Math.min(22, Math.abs(d) * 22);
  });
  const opacity = useTransform(position, (p: number) => {
    const abs = Math.abs(signedDist(index, p, total));
    if (abs > 2.4) return 0;
    if (abs < 0.5) return 1;
    return Math.max(0, 0.95 - (abs - 0.5) * 0.4);
  });
  const zIndex = useTransform(position, (p: number) => 100 - Math.round(Math.abs(signedDist(index, p, total)) * 10));

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-label={`Select ${track.name}`}
      className="absolute rounded-2xl overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] outline-none focus-visible:ring-2 focus-visible:ring-accent"
      style={{
        width: "min(72vw, 280px)",
        aspectRatio: "1 / 1",
        x,
        scale,
        rotateY,
        opacity,
        zIndex,
        background: "#111",
        border: "1px solid rgba(255,255,255,0.08)",
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      }}
      whileTap={{ scale: 0.97 }}
    >
      <motion.img
        src={`${track.cover_url}${track.cover_url.includes("?") ? "&" : "?"}tr=w-640,q-82,f-auto`}
        alt={track.name}
        loading="lazy"
        draggable={false}
        className="w-full h-full object-cover"
        animate={isCenter ? { scale: [1, 1.03, 1] } : { scale: 1 }}
        transition={
          isCenter ? { duration: 5.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.35 }
        }
      />
    </motion.button>
  );
};

export default function TrackCarousel({ tracks }: { tracks: Track[] }) {
  const [active, setActive] = useState(0);
  const total = tracks.length;

  // The continuous playhead. position.get() is a float; integer = snapped.
  const position = useMotionValue(0);
  // Spring-smoothed view of the position — what covers actually read.
  const smoothPos = useSpring(position, { stiffness: 280, damping: 32, mass: 0.65 });

  // Snap to integer when active changes (button / dot / keyboard click)
  useEffect(() => {
    animate(position, active, SNAP_SPRING);
  }, [active]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % total);
      if (e.key === "ArrowLeft") setActive((i) => (i - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  const next = () => setActive((i) => (i + 1) % total);
  const prev = () => setActive((i) => (i - 1 + total) % total);

  // Track the position at drag start so onDrag updates relative to it
  const dragStartPosRef = useRef(0);

  const onDragStart = () => {
    dragStartPosRef.current = position.get();
  };
  const onDrag = (_: unknown, info: PanInfo) => {
    // Convert pixel drag to fractional track movement.
    // Negative drag (leftward) increases position (next track).
    const fractional = -info.offset.x / COVER_GAP;
    position.set(dragStartPosRef.current + fractional * 0.65);
  };
  const onDragEnd = (_: unknown, info: PanInfo) => {
    const fractional = -info.offset.x / COVER_GAP;
    const projected = dragStartPosRef.current + fractional * 0.65 + (-info.velocity.x / COVER_GAP) * 0.18;
    const rounded = Math.round(projected);
    // Wrap into [0, total)
    const targetIdx = ((rounded % total) + total) % total;
    setActive(targetIdx);
    // Smooth spring into the snapped value (active effect handles it but
    // we also animate position directly from the released drag value)
    animate(position, targetIdx, SOFT_SPRING);
  };

  const current = tracks[active];

  return (
    <div className="relative w-full">
      <motion.div
        className="relative h-[360px] md:h-[420px] flex items-center justify-center select-none touch-pan-y cursor-grab active:cursor-grabbing"
        style={{ perspective: "1400px" }}
        drag="x"
        dragElastic={0.18}
        dragConstraints={{ left: 0, right: 0 }}
        dragMomentum={false}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
      >
        {tracks.map((track, idx) => (
          <Cover
            key={idx}
            track={track}
            index={idx}
            total={total}
            position={smoothPos}
            isCenter={idx === active}
            onSelect={() => setActive(idx)}
          />
        ))}
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
              transition={SNAP_SPRING}
              style={{ height: 6, borderRadius: 999 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
