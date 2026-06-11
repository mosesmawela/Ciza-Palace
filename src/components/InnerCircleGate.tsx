import { FormEvent, useEffect, useRef, useState } from "react";

/**
 * Inner Circle gate — the simple, intimate landing surface.
 * - Personal note from CIZA ("Don Cizario") typed out char-by-char
 * - Small portrait avatar near the greeting (DM-style)
 * - Cinematic exit: gate scales up + dissolves like passing through a
 *   portal; a single white ring pulses outward from the wings on enter
 * - Remembers state in localStorage so returning fans skip the gate
 */

const STORAGE_KEY = "ciza-palace:gate-opened";
const PORTRAIT_SRC =
  "https://ik.imagekit.io/iwuf0njwbf/LVRN/CIZA.jpg?tr=w-180,h-180,fo-face,q-82";

// The Don's note, typed out. Newlines are paragraph breaks.
const MESSAGE = [
  "Don Cizario checking in!",
  "",
  "If you're reading this, you're already part of something special. Sign up to get exclusive access to the world of CIZA — from new music and behind-the-scenes content to first access to shows, experiences, and everything happening at Ciza's Palace.",
  "",
  "Trust me, you don't want to miss what's coming next.",
  "",
  "See you inside the Palace.",
  "",
  "Love,",
  "Ciza",
].join("\n");

const TYPE_MS = 18;
const TYPE_START_DELAY = 700; // wait for the wings + greeting to settle

export default function InnerCircleGate({
  onEnter,
}: {
  onEnter: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"mounted" | "leaving">("mounted");
  const formRef = useRef<HTMLFormElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reducedRef = useRef(false);

  // If the visitor has already entered before, skip the gate immediately
  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") {
        onEnter();
      }
    } catch {
      /* localStorage blocked — gate just shows once per visit */
    }
  }, [onEnter]);

  // Typewriter loop — reveals the Don's note char-by-char.
  // Reduced motion shows it instantly.
  useEffect(() => {
    if (reducedRef.current) {
      setTyped(MESSAGE);
      return;
    }
    let i = 0;
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const startTimeout = setTimeout(() => {
      const tick = () => {
        if (cancelled) return;
        i += 1;
        setTyped(MESSAGE.slice(0, i));
        if (i < MESSAGE.length) {
          timeout = setTimeout(tick, TYPE_MS);
        }
      };
      tick();
    }, TYPE_START_DELAY);
    return () => {
      cancelled = true;
      clearTimeout(startTimeout);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  // Allow tapping anywhere on the message to skip the typewriter
  const skipType = () => setTyped(MESSAGE);

  const enter = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    if (reducedRef.current) {
      onEnter();
      return;
    }
    setPhase("leaving");
    // After the exit anim completes, mount the site
    setTimeout(onEnter, 980);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = fd.get("email")?.toString().trim();
    const website = fd.get("website");
    if (!email) {
      setStatus("err");
      setMessage("Need an email first.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setStatus("ok");
      setMessage("You're in. Welcome, Cizarian.");
      // Hold the confirmation for a beat, then enter cinematically
      setTimeout(enter, 1400);
    } catch (err: unknown) {
      setStatus("err");
      setMessage(err instanceof Error ? err.message : "Something broke. Try again.");
    }
  };

  // Split typed text back into paragraphs for layout
  const paragraphs = typed.split("\n");
  const isDone = typed.length === MESSAGE.length;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[80] flex items-center justify-center px-5 py-10 overflow-y-auto"
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, rgba(10,10,12,0.55) 0%, rgba(8,8,10,0.85) 60%, rgba(5,5,7,0.95) 100%)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        opacity: phase === "leaving" ? 0 : 1,
        transform:
          phase === "leaving"
            ? "scale(1.18) translateZ(0)"
            : "scale(1) translateZ(0)",
        filter: phase === "leaving" ? "blur(14px)" : "blur(0px)",
        transition:
          "opacity 880ms cubic-bezier(0.22, 1, 0.36, 1), transform 980ms cubic-bezier(0.22, 1, 0.36, 1), filter 880ms cubic-bezier(0.22, 1, 0.36, 1)",
        pointerEvents: phase === "leaving" ? "none" : "auto",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-heading"
    >
      <div className="relative w-full max-w-[520px] flex flex-col items-center text-center">
        {/* Wings mark at the top — with a single expanding ring on enter */}
        <div className="relative inline-flex items-center justify-center mb-7">
          <span
            aria-hidden
            className="enter-pulse-ring"
            data-firing={phase === "leaving" ? "true" : "false"}
          />
          <img
            src="/logos/wings.svg"
            alt="CIZA"
            className="relative w-28 md:w-36 h-auto opacity-95 wings-entry"
            style={{ filter: "drop-shadow(0 6px 30px rgba(245,166,35,0.25))" }}
          />
        </div>

        {/* Avatar + greeting row */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="relative">
            <img
              src={PORTRAIT_SRC}
              alt=""
              aria-hidden
              loading="eager"
              className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-accent/55"
              style={{
                boxShadow:
                  "0 0 0 4px rgba(10,10,10,0.6), 0 8px 24px -8px rgba(245,166,35,0.45)",
              }}
            />
            {/* Online dot */}
            <span
              aria-hidden
              className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#23d160] border-2 border-[#0a0a0a]"
            />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent/85">
            A note from the Don
          </div>
          <h1
            id="gate-heading"
            className="font-display text-3xl md:text-4xl leading-[1.1] text-fg"
            style={{ letterSpacing: "-0.005em" }}
          >
            Hey Cizarian,
          </h1>
        </div>

        {/* Typed message — tap to skip the typewriter */}
        <div
          onClick={skipType}
          className="cursor-text mb-7 max-w-[460px] text-left md:text-center"
          style={{ minHeight: "210px" }}
        >
          {paragraphs.map((p, i) => {
            if (p === "") return <div key={i} style={{ height: "0.6em" }} />;
            const isHook = p === "Don Cizario checking in!";
            const isSignoff = p === "Love," || p === "Ciza";
            const isPunch =
              p === "Trust me, you don't want to miss what's coming next.";
            return (
              <p
                key={i}
                className={`leading-[1.65] ${
                  isHook
                    ? "text-accent font-medium text-base md:text-[17px] mb-1"
                    : isPunch
                    ? "text-fg italic text-[15px] md:text-base"
                    : isSignoff
                    ? "text-fg/70 text-[13px] md:text-sm font-mono uppercase tracking-[0.18em]"
                    : "text-fg/85 text-[14px] md:text-[15px] font-light"
                }`}
              >
                {p}
                {/* Blinking caret on the last visible line while typing */}
                {!isDone && !reducedRef.current && i === paragraphs.length - 1 && (
                  <span
                    aria-hidden
                    className="inline-block align-baseline w-[2px] bg-accent ml-[2px] type-caret"
                    style={{ height: "1em" }}
                  />
                )}
              </p>
            );
          })}
        </div>

        {/* Subscribe form */}
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="w-full flex flex-col gap-3 mb-5"
        >
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            style={{
              position: "absolute",
              left: "-9999px",
              width: 1,
              height: 1,
              opacity: 0,
            }}
            aria-hidden="true"
          />
          <input
            type="email"
            name="email"
            placeholder="you@email.com"
            required
            autoComplete="email"
            disabled={status === "loading" || status === "ok"}
            className="w-full bg-white/[0.04] border border-white/15 rounded-full px-5 py-3.5 text-sm text-fg placeholder:text-muted focus:outline-none focus:border-accent transition-colors disabled:opacity-60"
            style={{ textAlign: "center" }}
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "ok"}
            className="beam-border beam-border-white w-full px-6 py-3.5 bg-accent text-bg rounded-full text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-accent/90 disabled:opacity-50 transition-all"
          >
            {status === "loading"
              ? "..."
              : status === "ok"
              ? "✓ You're In"
              : "Join the Family"}
          </button>
          {message && (
            <p
              className={`text-center text-[11px] uppercase tracking-[0.2em] font-mono mt-1 ${
                status === "ok" ? "text-accent" : "text-red-400/90"
              }`}
              role="status"
              aria-live="polite"
            >
              {message}
            </p>
          )}
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full max-w-[260px] my-1 mb-5">
          <span className="flex-1 h-px bg-white/10" />
          <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-muted/70">
            or
          </span>
          <span className="flex-1 h-px bg-white/10" />
        </div>

        {/* Soft reveal — explore without subscribing */}
        <button
          type="button"
          onClick={enter}
          className="text-[11px] uppercase tracking-[0.35em] font-mono text-fg/70 hover:text-accent transition-colors py-2 px-2 inline-flex items-center gap-2 group"
        >
          <span>Enter the Palace</span>
          <span
            aria-hidden
            className="inline-block transition-transform duration-500 group-hover:translate-x-1"
          >
            →
          </span>
        </button>

        {/* Footer hint */}
        <p className="mt-7 font-mono text-[9px] uppercase tracking-[0.35em] text-muted/55">
          No spam · Real updates only
        </p>
      </div>

      <style>{`
        @keyframes typeCaret {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .type-caret { animation: typeCaret 0.95s steps(1) infinite; }

        @keyframes wingsEntry {
          0%   { opacity: 0; transform: translate3d(0, 6px, 0) scale(0.92); }
          100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }
        .wings-entry { animation: wingsEntry 1.4s cubic-bezier(0.22, 1, 0.36, 1) both; }

        /* Single expanding ring fired by the cinematic enter */
        .enter-pulse-ring {
          position: absolute;
          top: 50%; left: 50%;
          width: 60%;
          aspect-ratio: 1 / 1;
          transform: translate(-50%, -50%) scale(0.6);
          border: 1px solid rgba(245, 166, 35, 0.55);
          border-radius: 50%;
          opacity: 0;
          pointer-events: none;
        }
        .enter-pulse-ring[data-firing="true"] {
          animation: enterPulse 1100ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes enterPulse {
          0%   { opacity: 0.75; transform: translate(-50%, -50%) scale(0.6); border-color: rgba(255, 255, 255, 0.85); }
          60%  { opacity: 0.45; }
          100% { opacity: 0;    transform: translate(-50%, -50%) scale(3.6); border-color: rgba(245, 166, 35, 0.0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .wings-entry { animation: none !important; }
          .type-caret { animation: none !important; opacity: 0; }
          .enter-pulse-ring { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
