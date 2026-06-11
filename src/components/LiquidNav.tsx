import { useEffect, useRef, useState } from "react";

/**
 * Liquid nav with a single bubble that tracks the active section.
 * - IntersectionObserver tags which section is currently in the viewport
 * - The bubble's transform + width interpolate to the active tab's bbox
 *   with a springy cubic-bezier — feels like a water drop sliding
 * - Springy easing + slight Y-bounce mid-flight creates the "drop" feel
 * - prefers-reduced-motion → bubble snaps without animation
 */
type Item = { id: string; label: string };

export default function LiquidNav({
  items,
  logoSrc,
  topId = "top",
}: {
  items: Item[];
  logoSrc: string;
  topId?: string;
}) {
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bubbleRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const [reduced, setReduced] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll when drawer is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : prev || "";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  // Close on escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Track which section is currently in view
  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    // Use a rootMargin that triggers when section's mid crosses 1/3 viewport
    const obs = new IntersectionObserver(
      (entries) => {
        // Pick the entry with highest intersection ratio
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length) {
          setActiveId((visible[0].target as HTMLElement).id);
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0, 0.1, 0.3, 0.5, 0.7, 1],
      }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [items]);

  // Move the bubble whenever activeId changes (or on resize)
  useEffect(() => {
    const move = () => {
      const link = linkRefs.current[activeId];
      const container = containerRef.current;
      const bubble = bubbleRef.current;
      if (!link || !container || !bubble) return;
      const linkRect = link.getBoundingClientRect();
      const contRect = container.getBoundingClientRect();
      const x = linkRect.left - contRect.left;
      const w = linkRect.width;
      bubble.style.width = `${w}px`;
      bubble.style.transform = `translate3d(${x}px, 0, 0)`;
      bubble.style.opacity = "1";
    };
    move();
    window.addEventListener("resize", move);
    return () => window.removeEventListener("resize", move);
  }, [activeId]);

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <a
          href={`#${topId}`}
          className="flex items-center gap-3"
          aria-label="CIZA"
        >
          <img src={logoSrc} alt="CIZA" className="h-7 w-auto" />
        </a>

        {/* Mobile hamburger — opens the side drawer */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/10 text-fg/90 hover:text-accent hover:border-accent/40 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h10" />
          </svg>
        </button>

        <div
          ref={containerRef}
          className="hidden md:flex relative items-center"
        >
          {/* Liquid bubble — single element, transforms between tabs */}
          <div
            ref={bubbleRef}
            aria-hidden
            className="liquid-nav-bubble"
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              height: "32px",
              borderRadius: "999px",
              opacity: 0,
              pointerEvents: "none",
              background:
                "linear-gradient(135deg, rgba(245,166,35,0.22) 0%, rgba(245,166,35,0.10) 100%)",
              border: "1px solid rgba(245,166,35,0.45)",
              boxShadow:
                "0 0 18px -2px rgba(245,166,35,0.35), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.18)",
              transform: "translate3d(0, 0, 0)",
              marginTop: "-16px",
              transition: reduced
                ? "none"
                : "transform 620ms cubic-bezier(0.34, 1.4, 0.64, 1), width 560ms cubic-bezier(0.22, 1, 0.36, 1)",
              willChange: "transform, width",
            }}
          />

          {/* Tab labels — sit on top of bubble (z-index higher) */}
          <ul className="relative flex gap-1 text-xs uppercase tracking-widest list-none m-0 p-0">
            {items.map((it) => (
              <li key={it.id}>
                <a
                  ref={(el) => {
                    linkRefs.current[it.id] = el;
                  }}
                  href={`#${it.id}`}
                  className={`relative inline-block px-4 py-2 rounded-full transition-colors duration-300 ${
                    activeId === it.id
                      ? "text-accent"
                      : "text-muted hover:text-white"
                  }`}
                  onClick={() => setActiveId(it.id)}
                >
                  {it.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <style>{`
        /* Subtle wobble during transit — adds the "water drop" personality.
           Applied via animation that's re-triggered whenever the bubble
           changes its transform target (using CSS transition events would
           be ideal but this is more performant). */
        @keyframes liquidWobble {
          0%   { filter: blur(0); }
          40%  { filter: blur(0.6px); }
          100% { filter: blur(0); }
        }
        .liquid-nav-bubble {
          animation: liquidWobble 620ms ease-out;
          animation-fill-mode: backwards;
        }
      `}</style>
    </nav>

      {/* === Mobile side drawer ===
          Rendered OUTSIDE <nav> because nav has backdrop-filter which
          creates a containing block for position:fixed descendants —
          would trap the drawer inside the 64px-tall nav. */}
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={() => setMenuOpen(false)}
        className="md:hidden fixed inset-0 z-[60] transition-opacity duration-300"
        style={{
          background: "rgba(5, 5, 7, 0.65)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      />
      {/* Panel */}
      <aside
        aria-hidden={!menuOpen}
        data-open={menuOpen ? "true" : "false"}
        className="liquid-nav-drawer md:hidden fixed top-0 right-0 bottom-0 z-[61] w-[78%] max-w-[340px] flex flex-col"
        style={{
          background: "rgba(12, 12, 14, 0.92)",
          backdropFilter: "blur(28px) saturate(160%)",
          WebkitBackdropFilter: "blur(28px) saturate(160%)",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "-24px 0 60px -20px rgba(0,0,0,0.7)",
        }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <img src={logoSrc} alt="CIZA" className="h-7 w-auto" />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/10 text-fg/90 hover:text-accent hover:border-accent/40 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
              <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        {/* Section list */}
        <nav className="flex-1 overflow-y-auto px-6 py-8">
          <ul className="flex flex-col gap-1 list-none m-0 p-0">
            {items.map((it, i) => (
              <li
                key={it.id}
                style={{
                  transitionDelay: menuOpen ? `${i * 60 + 80}ms` : "0ms",
                  transitionProperty: "opacity, transform",
                  transitionDuration: "440ms",
                  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "translate3d(0,0,0)" : "translate3d(16px, 0, 0)",
                }}
              >
                <a
                  href={`#${it.id}`}
                  onClick={() => {
                    setActiveId(it.id);
                    setMenuOpen(false);
                  }}
                  className={`flex items-center justify-between gap-4 px-2 py-4 border-b border-white/[0.04] font-display text-2xl tracking-tight transition-colors ${
                    activeId === it.id
                      ? "text-accent"
                      : "text-fg/90 hover:text-accent"
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                      0{i + 1}
                    </span>
                    <span>{it.label}</span>
                  </span>
                  <span aria-hidden className="text-muted/70">→</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Drawer footer CTA */}
        <div
          className="px-6 py-6 border-t border-white/[0.06]"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)",
          }}
        >
          <a
            href="https://ciza.lvrn.dev"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="beam-border beam-border-white flex items-center justify-center gap-3 w-full px-6 py-4 rounded-full text-xs uppercase tracking-[0.3em] font-bold text-bg bg-accent hover:bg-accent/90 transition-colors"
          >
            <span>View Full EPK</span>
            <span aria-hidden>→</span>
          </a>
          <p className="text-center mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted/70">
            Booking · Press · Rates
          </p>
        </div>
      </aside>

      <style>{`
        @keyframes liquidWobble {
          0%   { filter: blur(0); }
          40%  { filter: blur(0.6px); }
          100% { filter: blur(0); }
        }
        .liquid-nav-bubble {
          animation: liquidWobble 620ms ease-out;
          animation-fill-mode: backwards;
        }
        /* Drawer position via data attribute. Uses opacity + visibility
           for the in/out feel (browser-CSS animations on transform
           are wedging at currentTime 0 in this app's CSS environment —
           likely a clash with @property + reduced-motion blanket rule). */
        .liquid-nav-drawer {
          transform: translateX(100%);
          opacity: 0;
          visibility: hidden;
          transition: opacity 320ms ease, visibility 0s linear 320ms;
        }
        .liquid-nav-drawer[data-open="true"] {
          transform: translateX(0);
          opacity: 1;
          visibility: visible;
          transition: opacity 280ms ease, visibility 0s linear 0s;
        }
      `}</style>
    </>
  );
}
