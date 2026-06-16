import { FormEvent, useRef, useState } from "react";

/**
 * Inner Circle full subscribe form.
 * Captures: first name (required), email (required), country (required),
 * WhatsApp (optional), favorite CIZA track (optional).
 *
 * - Same /api/subscribe endpoint, extended payload
 * - Used in two places: the welcome gate (compact variant) and the
 *   in-page Inner Circle section (full variant)
 * - Honeypot bypass + email regex validation server-side
 */

const TRACKS = [
  "Isaka (6am)",
  "Isaka II (6am)",
  "Yivule",
  "Mngani Wam",
  "Other / Hard to choose",
];

export default function FullSubscribeForm({
  variant = "full",
  ctaLabel = "Join the Family",
  onSuccess,
}: {
  variant?: "full" | "compact";
  ctaLabel?: string;
  /** Fires after successful submission so parent can close gate / scroll, etc. */
  onSuccess?: (data: { firstName: string; email: string }) => void;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const firstName = fd.get("firstName")?.toString().trim();
    const email = fd.get("email")?.toString().trim();
    const country = fd.get("country")?.toString().trim();
    const whatsapp = fd.get("whatsapp")?.toString().trim();
    const favoriteTrack = fd.get("favoriteTrack")?.toString().trim();
    const website = fd.get("website");

    if (!firstName) {
      setStatus("err");
      setMessage("Your name?");
      return;
    }
    if (!email) {
      setStatus("err");
      setMessage("Need an email.");
      return;
    }
    if (!country) {
      setStatus("err");
      setMessage("Where you reppin' from?");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          country,
          whatsapp: whatsapp || undefined,
          favoriteTrack: favoriteTrack || undefined,
          website,
          source: "inner-circle",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setStatus("ok");
      setMessage(`✓ You're in, ${firstName}. Welcome, Cizarian.`);
      onSuccess?.({ firstName, email });
      // Don't reset the form — keep the confirmation visible
    } catch (err: unknown) {
      setStatus("err");
      setMessage(err instanceof Error ? err.message : "Something broke. Try again.");
    }
  };

  const compact = variant === "compact";
  const inputBase =
    "w-full bg-white/[0.04] border border-white/15 rounded-2xl px-4 py-3 text-[13px] text-fg placeholder:text-muted focus:outline-none focus:border-accent transition-colors disabled:opacity-60";
  const labelBase =
    "block font-mono text-[9px] uppercase tracking-[0.3em] text-muted/85 mb-1.5";

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className={`w-full ${compact ? "max-w-[400px]" : "max-w-[520px]"} mx-auto`}
    >
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        aria-hidden="true"
      />

      <div className={`grid gap-3 ${compact ? "" : "md:grid-cols-2"}`}>
        <div className={compact ? "" : "md:col-span-2"}>
          <label className={labelBase}>First name</label>
          <input
            type="text"
            name="firstName"
            required
            autoComplete="given-name"
            placeholder="Enter your name"
            disabled={status === "loading" || status === "ok"}
            className={inputBase}
          />
        </div>

        <div className={compact ? "" : "md:col-span-2"}>
          <label className={labelBase}>Email</label>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@email.com"
            disabled={status === "loading" || status === "ok"}
            className={inputBase}
          />
        </div>

        <div>
          <label className={labelBase}>Country / City</label>
          <input
            type="text"
            name="country"
            required
            autoComplete="country-name"
            placeholder="Johannesburg, ZA"
            disabled={status === "loading" || status === "ok"}
            className={inputBase}
          />
        </div>

        <div>
          <label className={labelBase}>
            WhatsApp <span className="text-muted/55 normal-case tracking-normal">· optional</span>
          </label>
          <input
            type="tel"
            name="whatsapp"
            autoComplete="tel"
            placeholder="+27 71 234 5678"
            disabled={status === "loading" || status === "ok"}
            className={inputBase}
          />
        </div>

        <div className={compact ? "" : "md:col-span-2"}>
          <label className={labelBase}>
            Favourite track <span className="text-muted/55 normal-case tracking-normal">· optional</span>
          </label>
          <select
            name="favoriteTrack"
            disabled={status === "loading" || status === "ok"}
            defaultValue=""
            className={inputBase}
            style={{ backgroundImage: "none" }}
          >
            <option value="">— Pick one —</option>
            {TRACKS.map((t) => (
              <option key={t} value={t} style={{ background: "#111" }}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "loading" || status === "ok"}
        className="beam-border beam-border-white w-full mt-5 px-6 py-3.5 bg-accent text-bg rounded-full text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-accent/90 disabled:opacity-50 transition-all"
      >
        {status === "loading"
          ? "..."
          : status === "ok"
          ? "✓ You're In"
          : ctaLabel}
      </button>

      {message && (
        <p
          className={`text-center text-[11px] uppercase tracking-[0.2em] font-mono mt-3 ${
            status === "ok" ? "text-accent" : "text-red-400/90"
          }`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      )}

      <p className="text-center mt-4 font-mono text-[9px] uppercase tracking-[0.3em] text-muted/55">
        No spam · Unsubscribe anytime
      </p>
    </form>
  );
}
