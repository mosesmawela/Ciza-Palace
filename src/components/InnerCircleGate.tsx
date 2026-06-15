import { useEffect, useRef, useState } from "react";
import FullSubscribeForm from "./FullSubscribeForm";

const SITE_URL = "https://ciza-palace.lvrn.dev";
const SHORT_URL = "https://r.lvrn.dev/ciza-epk-fan-hub";
// QR is generated via the LVRN-QR CLI (lvrn-qr/cli/lvrn_qr.py) and
// committed to public/qr/. Encodes the r.lvrn.dev short link so the
// destination can be re-routed in lvrn-qr/redirects/links.json without
// re-printing anything that's already in the wild.
const QR_SRC = "/qr/ciza-palace.png";
const QR_SVG = "/qr/ciza-palace.svg";

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
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"mounted" | "leaving">("mounted");
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const [qrOpen, setQrOpen] = useState(false);
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

  const onShare = async () => {
    const payload = {
      title: "CIZA — Ciza's Palace",
      text: "Hey Cizarian — join the family.",
      url: SITE_URL,
    };
    try {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await (navigator as Navigator & { share: (d: ShareData) => Promise<void> }).share(payload);
        return;
      }
    } catch {
      // user cancelled or share blocked — fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(SITE_URL);
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 1800);
    } catch {
      /* ignore */
    }
  };

  const downloadQR = async () => {
    try {
      const res = await fetch(QR_SRC);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ciza-palace-qr.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch {
      // Fallback — open in new tab
      window.open(QR_SRC, "_blank");
    }
  };

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

  // Submission is delegated to FullSubscribeForm — on success we just
  // run the cinematic enter sequence to drop into the site.
  const onSubscribeSuccess = () => {
    setTimeout(enter, 1400);
  };

  // Split typed text back into paragraphs for layout
  const paragraphs = typed.split("\n");
  const isDone = typed.length === MESSAGE.length;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[80] flex items-center justify-center px-5 py-6 overflow-y-auto"
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
      <div className="relative w-full max-w-[460px] flex flex-col items-center text-center">
        {/* Wings mark at the top — with a single expanding ring on enter */}
        <div className="relative inline-flex items-center justify-center mb-4">
          <span
            aria-hidden
            className="enter-pulse-ring"
            data-firing={phase === "leaving" ? "true" : "false"}
          />
          <img
            src="/logos/wings.svg"
            alt="CIZA"
            className="relative w-20 md:w-24 h-auto opacity-95 wings-entry"
            style={{ filter: "drop-shadow(0 5px 22px rgba(245,166,35,0.25))" }}
          />
        </div>

        {/* Avatar + greeting row */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="relative">
            <img
              src={PORTRAIT_SRC}
              alt=""
              aria-hidden
              loading="eager"
              className="w-11 h-11 md:w-12 md:h-12 rounded-full object-cover border-2 border-accent/55"
              style={{
                boxShadow:
                  "0 0 0 3px rgba(10,10,10,0.6), 0 6px 18px -8px rgba(245,166,35,0.45)",
              }}
            />
            {/* Online dot */}
            <span
              aria-hidden
              className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#23d160] border-2 border-[#0a0a0a]"
            />
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-accent/85">
            A note from the Don
          </div>
          <h1
            id="gate-heading"
            className="font-display text-[26px] md:text-[30px] leading-[1.1] text-fg"
            style={{ letterSpacing: "-0.005em" }}
          >
            Hey Cizarian,
          </h1>
        </div>

        {/* Typed message — tap to skip the typewriter */}
        <div
          onClick={skipType}
          className="cursor-text mb-5 max-w-[420px] text-left md:text-center"
          style={{ minHeight: "168px" }}
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
                className={`leading-[1.55] ${
                  isHook
                    ? "text-accent font-medium text-[14px] md:text-[15px] mb-0.5"
                    : isPunch
                    ? "text-fg italic text-[13px] md:text-[14px]"
                    : isSignoff
                    ? "text-fg/70 text-[11px] md:text-[12px] font-mono uppercase tracking-[0.18em]"
                    : "text-fg/85 text-[12.5px] md:text-[13.5px] font-light"
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

        {/* Full Inner Circle subscribe form — first name + email + country +
            whatsapp (optional) + favorite track (optional). Compact variant
            single-column for the gate. */}
        <div className="w-full mb-4">
          <FullSubscribeForm
            variant="compact"
            ctaLabel="Join the Family"
            onSuccess={onSubscribeSuccess}
          />
        </div>

        {/* Share with friends + QR toggle — side by side, compact */}
        <div className="flex items-center gap-2 mb-3">
          <button
            type="button"
            onClick={onShare}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[10px] uppercase tracking-[0.22em] font-mono text-fg/85 border border-white/12 hover:border-accent/40 hover:text-white transition-colors"
            aria-label="Share with friends"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-3.5 h-3.5" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
            <span>{shareState === "copied" ? "Link Copied" : "Share With Friends"}</span>
          </button>
          <button
            type="button"
            onClick={() => setQrOpen((v) => !v)}
            aria-expanded={qrOpen}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[10px] uppercase tracking-[0.22em] font-mono border transition-colors ${
              qrOpen
                ? "border-accent/55 text-accent bg-accent/[0.06]"
                : "border-white/12 text-fg/85 hover:border-accent/40 hover:text-white"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-3.5 h-3.5" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
            </svg>
            <span>{qrOpen ? "Hide QR" : "Show QR Code"}</span>
          </button>
        </div>

        {/* QR panel — expands inline below the buttons */}
        {qrOpen && (
          <div
            className="w-full max-w-[260px] flex flex-col items-center gap-3 mb-3 p-4 rounded-2xl border border-white/10"
            style={{
              background: "rgba(14,14,16,0.6)",
              backdropFilter: "blur(14px) saturate(150%)",
              WebkitBackdropFilter: "blur(14px) saturate(150%)",
            }}
          >
            <img
              src={QR_SRC}
              alt="QR code for ciza-palace.lvrn.dev"
              className="w-44 h-44 rounded-lg"
              style={{
                imageRendering: "pixelated",
                boxShadow: "0 8px 30px -10px rgba(245,166,35,0.35)",
              }}
            />
            <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-accent/85 text-center leading-relaxed">
              Scan to enter the Palace
            </p>
            <button
              type="button"
              onClick={downloadQR}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.25em] font-mono font-bold text-bg bg-accent hover:bg-accent/90 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-3.5 h-3.5" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span>Download QR</span>
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 w-full max-w-[240px] mb-3">
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
          className="text-[10px] uppercase tracking-[0.35em] font-mono text-fg/70 hover:text-accent transition-colors py-1.5 px-2 inline-flex items-center gap-2 group"
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
        <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.35em] text-muted/55">
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
