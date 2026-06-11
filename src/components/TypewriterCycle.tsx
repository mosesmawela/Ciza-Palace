import { useEffect, useState } from "react";

/**
 * Typewriter that cycles through an array of copy lines.
 * - Types each line char-by-char (TYPE_MS per char)
 * - Holds the full line for HOLD_MS
 * - Deletes char-by-char (DEL_MS per char)
 * - Advances to next line, loops indefinitely
 * - Blinking caret while idle
 * - prefers-reduced-motion → shows first line statically
 */
const TYPE_MS = 38;
const DEL_MS = 18;
const HOLD_MS = 2400;

export default function TypewriterCycle({
  lines,
  className = "",
}: {
  lines: string[];
  className?: string;
}) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"type" | "hold" | "del">("type");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) {
      setText(lines[0] ?? "");
      return;
    }
    const current = lines[idx] ?? "";
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "type") {
      if (text.length < current.length) {
        timeout = setTimeout(
          () => setText(current.slice(0, text.length + 1)),
          TYPE_MS
        );
      } else {
        timeout = setTimeout(() => setPhase("hold"), 0);
      }
    } else if (phase === "hold") {
      timeout = setTimeout(() => setPhase("del"), HOLD_MS);
    } else if (phase === "del") {
      if (text.length > 0) {
        timeout = setTimeout(
          () => setText(current.slice(0, text.length - 1)),
          DEL_MS
        );
      } else {
        setIdx((i) => (i + 1) % lines.length);
        setPhase("type");
      }
    }
    return () => clearTimeout(timeout);
  }, [text, phase, idx, lines, reduced]);

  return (
    <span className={`relative inline-flex items-baseline ${className}`}>
      <span>{text}</span>
      {!reduced && (
        <span
          aria-hidden
          className="inline-block align-baseline ml-[2px] w-[2px] bg-accent typewriter-caret"
          style={{ height: "1em" }}
        />
      )}
      <style>{`
        @keyframes typewriterCaret { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        .typewriter-caret { animation: typewriterCaret 0.95s steps(1) infinite; }
      `}</style>
    </span>
  );
}
