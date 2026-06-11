import { useEffect, useRef, useState } from "react";

/**
 * One-shot typewriter for press quotes.
 * - Fires on IntersectionObserver entry (40% visible)
 * - Optional staggered delay so cards in a grid feel naturally varied
 * - Variable type speed (each card can pass its own ms-per-char)
 * - Caret blinks while typing, then fades after completion
 * - prefers-reduced-motion → renders the full text instantly
 */
export default function TypewriterQuote({
  text,
  className = "",
  msPerChar = 22,
  startDelay = 0,
}: {
  text: string;
  className?: string;
  msPerChar?: number;
  startDelay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const [armed, setArmed] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Wait for viewport entry
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      setTyped(text);
      setDone(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => setArmed(true), startDelay);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced, startDelay, text]);

  // Type out
  useEffect(() => {
    if (!armed || reduced) return;
    if (typed.length >= text.length) {
      setDone(true);
      return;
    }
    const t = setTimeout(
      () => setTyped(text.slice(0, typed.length + 1)),
      msPerChar
    );
    return () => clearTimeout(t);
  }, [armed, typed, text, msPerChar, reduced]);

  return (
    <blockquote ref={ref} className={className}>
      <span>{typed || (armed || reduced ? "" : " ")}</span>
      {!reduced && !done && armed && (
        <span
          aria-hidden
          className="inline-block align-baseline ml-[2px] w-[2px] typewriter-quote-caret"
          style={{
            height: "0.95em",
            background: "currentColor",
            transform: "translateY(2px)",
          }}
        />
      )}
      <span className="sr-only">{text}</span>
      <style>{`
        @keyframes typewriterQuoteCaret { 0%, 49% { opacity: 0.85; } 50%, 100% { opacity: 0; } }
        .typewriter-quote-caret { animation: typewriterQuoteCaret 0.85s steps(1) infinite; }
      `}</style>
    </blockquote>
  );
}
