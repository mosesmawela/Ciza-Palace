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

  const burst = () => {
    const btn = buttonRef.current;
    if (!btn) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const container = document.createElement("div");
    container.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999;";
    document.body.appendChild(container);

    const count = 28;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = 90 + Math.random() * 110;
      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed;
      const colors = ["#F5A623", "#1E90FF", "#f5f5f5"];
      const color = colors[i % colors.length];
      p.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:6px;height:6px;border-radius:50%;background:${color};box-shadow:0 0 12px ${color};transition:transform 1100ms cubic-bezier(0.22,1,0.36,1),opacity 1100ms ease-out;will-change:transform,opacity;`;
      container.appendChild(p);
      requestAnimationFrame(() => {
        p.style.transform = `translate3d(${dx}px, ${dy + 60}px, 0) scale(0.3)`;
        p.style.opacity = "0";
      });
    }
    setTimeout(() => container.remove(), 1300);
  };

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
    const fd = new FormData(e.currentTarget);
    const email = fd.get("email")?.toString().trim();
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
        body: JSON.stringify({ email, website: fd.get("website") }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setStatus("ok");
      setMessage("✓ You're in. First access, no spam.");
      burst();
      (e.currentTarget as HTMLFormElement).reset();
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
          className="px-6 py-3 bg-accent text-bg rounded-full text-xs uppercase tracking-widest font-bold hover:bg-accent/90 disabled:opacity-50 transition-all"
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
