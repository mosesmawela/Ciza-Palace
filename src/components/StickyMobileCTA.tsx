import { useEffect, useState } from "react";

/**
 * Sticky mobile CTA — floats above the viewport bottom on small screens.
 * - Hidden on desktop (`md:hidden`)
 * - Slides up after the user scrolls past the hero (avoids covering the
 *   initial impression)
 * - Honors safe-area-inset-bottom for iPhone notch devices
 */
export default function StickyMobileCTA({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after 80% of one viewport-height has been scrolled
      const threshold = window.innerHeight * 0.8;
      setVisible(window.scrollY > threshold);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="md:hidden fixed left-0 right-0 z-40 px-4 transition-all duration-500 ease-out"
      style={{
        bottom: `calc(env(safe-area-inset-bottom, 0px) + 16px)`,
        transform: visible ? "translateY(0)" : "translateY(140%)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="beam-border beam-border-white flex items-center justify-center gap-3 w-full px-6 py-4 rounded-full text-xs uppercase tracking-[0.3em] font-bold text-bg bg-accent shadow-[0_18px_50px_-12px_rgba(245,166,35,0.65)] active:scale-[0.97] transition-transform"
      >
        <span>{label}</span>
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}
