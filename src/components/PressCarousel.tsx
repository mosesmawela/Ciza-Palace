import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "motion/react";

/**
 * Press carousel — awards & milestones only.
 *
 * Spring-physics one-card-at-a-time slider:
 * - AnimatePresence handles enter/exit with direction-aware slide+blur
 * - Drag with rubber-band elastic + velocity-aware swipe
 * - Hero image has subtle parallax (slides slower than text overlay)
 * - Tap-and-hold for inertia: long drag carries momentum into snap
 */

export type PressItem = {
  badge: string;
  title: string;
  source: string;
  stat: string;
  heroImage: string;
  thumb?: string;
  url: string;
};

const SLIDE_SPRING = { type: "spring" as const, stiffness: 240, damping: 32, mass: 0.7 };

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
    filter: "blur(8px)",
    scale: 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
    filter: "blur(8px)",
    scale: 0.96,
  }),
};

export default function PressCarousel({ items }: { items: PressItem[] }) {
  const [[active, dir], setActive] = useState<[number, number]>([0, 0]);

  const next = () => setActive(([i]) => [(i + 1) % items.length, 1]);
  const prev = () => setActive(([i]) => [(i - 1 + items.length) % items.length, -1]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const dx = info.offset.x;
    const vx = info.velocity.x;
    const swipe = Math.abs(dx) + Math.abs(vx) * 0.18;
    if (swipe > 60) {
      if (dx + vx * 0.2 < 0) next();
      else prev();
    }
  };

  const item = items[active];

  return (
    <div className="relative w-full">
      <div
        className="relative overflow-hidden rounded-3xl w-full aspect-[16/9] md:aspect-[21/9]"
      >
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.a
            key={active}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={SLIDE_SPRING}
            drag="x"
            dragElastic={0.22}
            dragConstraints={{ left: 0, right: 0 }}
            dragMomentum={false}
            onDragEnd={onDragEnd}
            className="absolute inset-0 flex cursor-grab active:cursor-grabbing"
          >
            {/* Hero image with subtle slow parallax — moves slower than text on drag */}
            <motion.img
              src={item.heroImage}
              alt=""
              aria-hidden
              loading="eager"
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Dark gradient — left to right for text legibility */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, rgba(8,8,10,0.92) 0%, rgba(8,8,10,0.72) 30%, rgba(8,8,10,0.35) 55%, rgba(8,8,10,0.0) 80%)",
              }}
            />
            {/* Bottom dim */}
            <div
              className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
              style={{
                background:
                  "linear-gradient(0deg, rgba(8,8,10,0.7) 0%, rgba(8,8,10,0) 100%)",
              }}
            />

            {/* Content overlay — slides up slightly faster than the bg for parallax */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex items-center gap-4 md:gap-6 p-5 md:p-8 w-full"
            >
              {item.thumb && (
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ ...SLIDE_SPRING, delay: 0.18 }}
                  className="flex-shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-xl overflow-hidden border border-white/15"
                  style={{ boxShadow: "0 8px 24px -8px rgba(0,0,0,0.6)" }}
                >
                  <img
                    src={item.thumb}
                    alt=""
                    aria-hidden
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </motion.div>
              )}

              <div className="flex-1 min-w-0">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.22, duration: 0.45 }}
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent text-bg font-mono text-[9px] md:text-[10px] uppercase tracking-[0.22em] font-bold mb-2 md:mb-3"
                >
                  ★ {item.badge}
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.28, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-xl md:text-3xl lg:text-4xl font-bold text-fg leading-[1.1] tracking-tight mb-1 md:mb-2 line-clamp-2"
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.34, duration: 0.45 }}
                  className="text-fg/75 text-sm md:text-base mb-2"
                >
                  {item.source}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.45 }}
                  className="font-mono text-[10px] md:text-xs uppercase tracking-[0.18em] text-accent"
                >
                  {item.stat}
                </motion.p>
              </div>
            </motion.div>
          </motion.a>
        </AnimatePresence>
      </div>

      {/* Controls below */}
      <div className="flex items-center justify-between gap-4 mt-5">
        <motion.button
          type="button"
          onClick={prev}
          aria-label="Previous press item"
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.06 }}
          className="w-10 h-10 rounded-full inline-flex items-center justify-center border border-white/15 text-fg/85 hover:text-accent hover:border-accent/45 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </motion.button>

        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <motion.button
              key={i}
              type="button"
              onClick={() => setActive(([cur]) => [i, i > cur ? 1 : -1])}
              aria-label={`Press ${i + 1} of ${items.length}`}
              animate={{
                width: i === active ? 22 : 7,
                backgroundColor: i === active ? "#F5A623" : "rgba(255,255,255,0.25)",
              }}
              transition={SLIDE_SPRING}
              style={{ height: 7, borderRadius: 999 }}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <motion.span
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted/85 tabular-nums"
          >
            {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </motion.span>
          <motion.button
            type="button"
            onClick={next}
            aria-label="Next press item"
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.06 }}
            className="w-10 h-10 rounded-full inline-flex items-center justify-center border border-white/15 text-fg/85 hover:text-accent hover:border-accent/45 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
