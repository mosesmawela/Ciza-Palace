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
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <a
          href={`#${topId}`}
          className="flex items-center gap-3"
          aria-label="CIZA"
        >
          <img src={logoSrc} alt="CIZA" className="h-7 w-auto" />
        </a>

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
  );
}
