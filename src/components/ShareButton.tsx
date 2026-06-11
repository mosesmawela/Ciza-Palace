import { useState } from "react";

/**
 * Share button.
 * - Uses navigator.share() on mobile/supported browsers
 * - Falls back to clipboard copy with a 2s "Copied" feedback state
 * - prefers-reduced-motion respected (no scale bounce on copy)
 */
export default function ShareButton({
  url,
  title,
  text,
  className = "",
}: {
  url: string;
  title?: string;
  text?: string;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  const handle = async () => {
    const data = { title, text, url };
    try {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await (navigator as Navigator & { share: (d: ShareData) => Promise<void> }).share(data);
        return;
      }
    } catch {
      // user cancelled or share failed — fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handle}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em] font-mono text-fg/85 border border-white/10 hover:border-accent/40 hover:text-white transition-colors duration-300 ${className}`}
      aria-label="Share this page"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
      </svg>
      <span>
        {state === "copied" ? "Link Copied" : state === "error" ? "Try Again" : "Share"}
      </span>
    </button>
  );
}
