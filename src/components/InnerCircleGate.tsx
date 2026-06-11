import { FormEvent, useEffect, useRef, useState } from "react";

/**
 * Inner Circle gate — the simple, intimate landing surface.
 * Renders as a full-viewport overlay above the canvas/focal-blur backdrop.
 * - Personal note from CIZA ("Don Cizario") at the centre
 * - One-field subscribe form
 * - "Enter the Palace" reveal button (no subscribe required — soft gate)
 * - Remembers state in localStorage so returning fans skip the gate
 */

const STORAGE_KEY = "ciza-palace:gate-opened";

export default function InnerCircleGate({
  onEnter,
}: {
  onEnter: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);

  // If the visitor has already entered before, skip the gate immediately
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") {
        onEnter();
      }
    } catch {
      /* localStorage blocked — gate just shows once per visit */
    }
  }, [onEnter]);

  const enter = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    onEnter();
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
      // Auto-advance into the site after a beat so the user reads the confirmation
      setTimeout(enter, 1400);
    } catch (err: unknown) {
      setStatus("err");
      setMessage(err instanceof Error ? err.message : "Something broke. Try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center px-5 py-10 overflow-y-auto"
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, rgba(10,10,12,0.55) 0%, rgba(8,8,10,0.85) 60%, rgba(5,5,7,0.95) 100%)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-heading"
    >
      <div className="relative w-full max-w-[480px] flex flex-col items-center text-center">
        {/* Wings mark at the top */}
        <img
          src="/logos/wings.svg"
          alt="CIZA"
          className="w-32 md:w-40 h-auto mb-7 opacity-95"
          style={{ filter: "drop-shadow(0 6px 30px rgba(245,166,35,0.25))" }}
        />

        {/* Eyebrow */}
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent/85 mb-3">
          A note from the Don
        </div>

        {/* Personal greeting */}
        <h1
          id="gate-heading"
          className="font-display text-3xl md:text-4xl leading-[1.15] text-fg mb-5"
          style={{ letterSpacing: "-0.005em" }}
        >
          Hey Cizarian,
        </h1>

        <p className="text-fg/85 text-[15px] md:text-base leading-[1.6] max-w-[420px] mb-8 font-light">
          It's your Don here,{" "}
          <span className="text-accent font-medium">Don Cizario</span>. Join the
          family by subscribing for exciting first-hand experiences of{" "}
          <span className="text-accent font-medium">Ciza's Palace</span> coming
          to a city near you.
        </p>

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
        <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.35em] text-muted/55">
          No spam · Real updates only
        </p>
      </div>
    </div>
  );
}
