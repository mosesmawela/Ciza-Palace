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
  "Maria (w/ Francis Mercier)",
  "Other / Hard to choose",
];
const WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029Vb8ZDeX2v1IqAwco081Y";

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

        <div className={compact ? "" : "md:col-span-2"}>
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

      {/* Secondary CTA — public WhatsApp channel (broadcast, not user input).
          Always shown so fans on WhatsApp can plug in without committing
          their email yet. */}
      <a
        href="https://whatsapp.com/channel/0029Vb8ZDeX2v1IqAwco081Y"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-full text-[10px] uppercase tracking-[0.3em] font-mono text-fg/90 border border-[#25D366]/50 hover:border-[#25D366] hover:text-[#25D366] hover:bg-[#25D366]/[0.06] transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        <span>Join WhatsApp Channel</span>
      </a>

      <p className="text-center mt-3 font-mono text-[9px] uppercase tracking-[0.3em] text-muted/55">
        No spam · Unsubscribe anytime
      </p>
    </form>
  );
}
