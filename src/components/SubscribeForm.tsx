import { FormEvent, useRef, useState } from "react";

/**
 * Move 6 — Subscribe form with focus-state + particle burst.
 * - Focusing the input dims the rest of the page (CSS body class) +
 *   scales the form 1.05× with eased transition
 * - Submitting fires a particle burst from the button (gold + blue
 *   particles, ~28 of them, 1.2s lifetime)
 * - POSTs to /api/subscribe (Express + Resend audience)
 */
export default function SubscribeForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Particle burst removed — felt like confetti, not on-brand

  const onFocus = () => {
    document.body.classList.add("subscribe-focused");
    formRef.current?.classList.add("subscribe-form-focused");
  };
  const onBlur = (e: React.FocusEvent) => {
    // Only blur if focus leaves the form entirely
    if (!formRef.current?.contains(e.relatedTarget as Node)) {
      document.body.classList.remove("subscribe-focused");
      formRef.current?.classList.remove("subscribe-form-focused");
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Capture refs BEFORE the await — React pools synthetic events,
    // so e.currentTarget can be null by the time the promise resolves.
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
      setMessage("✓ You're in. First access, no spam.");
      // Use the captured form ref (or fall back to formRef) — never e.currentTarget
      (formRef.current ?? form)?.reset();
      setTimeout(() => {
        document.body.classList.remove("subscribe-focused");
        formRef.current?.classList.remove("subscribe-form-focused");
      }, 800);
    } catch (err: unknown) {
      setStatus("err");
      setMessage(err instanceof Error ? err.message : "Something broke. Try again.");
    }
  };

  return (
    <>
      <style>{`
        body.subscribe-focused .bio-section,
        body.subscribe-focused #release,
        body.subscribe-focused #catalog,
        body.subscribe-focused #events,
        body.subscribe-focused #press,
        body.subscribe-focused #follow,
        body.subscribe-focused footer {
          transition: opacity 360ms ease, filter 360ms ease;
          opacity: 0.28;
          filter: blur(4px);
        }
        .subscribe-form-focused {
          transition: transform 360ms cubic-bezier(0.22, 1, 0.36, 1) !important;
          transform: scale(1.04);
        }
      `}</style>
      <form
        ref={formRef}
        id="subscribe-form"
        data-resend
        onSubmit={onSubmit}
        onFocus={onFocus}
        onBlur={onBlur}
        className="flex gap-2 max-w-md mx-auto mt-8 origin-center"
      >
        {/* honeypot — bots fill, humans don't see */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} aria-hidden="true" />
        <input
          type="email"
          name="email"
          placeholder="you@email.com"
          required
          autoComplete="email"
          disabled={status === "loading"}
          className="flex-1 bg-card border border-white/10 rounded-full px-5 py-3 text-sm text-fg placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
        />
        <button
          ref={buttonRef}
          type="submit"
          disabled={status === "loading"}
          className="beam-border beam-border-white px-6 py-3 bg-accent text-bg rounded-full text-xs uppercase tracking-widest font-bold hover:bg-accent/90 disabled:opacity-50 transition-all"
        >
          {status === "loading" ? "..." : status === "ok" ? "✓ In" : "Submit"}
        </button>
      </form>
      {message && (
        <p
          className={`text-center mt-4 text-xs uppercase tracking-widest ${status === "ok" ? "text-accent" : "text-red-400"}`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </>
  );
}
