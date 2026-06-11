import { useEffect, useState } from "react";

/**
 * Rotating headline — slides the current word/phrase up out of view
 * while the next slides up from below. Used to swap a single
 * highlighted word inside a longer headline ("In the Press" → "On
 * the Record" → "On the Wire").
 *
 * - Vertical "stack" of phrases, only one visible at a time
 * - Slides up with 1.5em translateY + opacity, eased
 * - HOLD_MS between rotations
 * - prefers-reduced-motion → first phrase static
 */
const HOLD_MS = 2800;

export default function RotatingHeadline({
  phrases,
  className = "",
  width,
}: {
  phrases: string[];
  className?: string;
  width?: string;
}) {
  const [idx, setIdx] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced || phrases.length <= 1) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % phrases.length);
    }, HOLD_MS);
    return () => clearInterval(t);
  }, [phrases.length, reduced]);

  if (reduced) {
    return <span className={className}>{phrases[0]}</span>;
  }

  return (
    <span
      className={`relative inline-block align-baseline overflow-hidden ${className}`}
      style={{ width, lineHeight: 1, verticalAlign: "baseline" }}
      aria-live="polite"
    >
      <span className="sr-only">{phrases[idx]}</span>
      {phrases.map((p, i) => {
        const state =
          i === idx ? "current" : i === (idx - 1 + phrases.length) % phrases.length ? "exit" : "enter";
        return (
          <span
            key={i}
            aria-hidden
            className="rotating-headline-item"
            data-state={state}
          >
            {p}
          </span>
        );
      })}
      <style>{`
        .rotating-headline-item {
          position: absolute;
          left: 0;
          top: 0;
          white-space: nowrap;
          transition:
            transform 620ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity   520ms cubic-bezier(0.22, 1, 0.36, 1),
            filter    520ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, opacity, filter;
        }
        .rotating-headline-item[data-state="enter"] {
          transform: translate3d(0, 100%, 0);
          opacity: 0;
          filter: blur(8px);
        }
        .rotating-headline-item[data-state="current"] {
          transform: translate3d(0, 0, 0);
          opacity: 1;
          filter: blur(0);
        }
        .rotating-headline-item[data-state="exit"] {
          transform: translate3d(0, -100%, 0);
          opacity: 0;
          filter: blur(8px);
        }
      `}</style>
      {/* invisible spacer to reserve the largest phrase width */}
      <span style={{ visibility: "hidden" }}>
        {phrases.reduce((a, b) => (a.length > b.length ? a : b))}
      </span>
    </span>
  );
}
