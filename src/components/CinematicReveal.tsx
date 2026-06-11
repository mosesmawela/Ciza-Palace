import { useEffect, useRef, ReactNode } from "react";

/**
 * Move 4 — Film-cut section transitions.
 * Wraps a section, observes when it enters the viewport, applies a
 * cinematic reveal: slight off-axis slide-in (alternating sides) +
 * 6px motion-blur decay over 220ms cubic-bezier(0.22, 1, 0.36, 1).
 *
 * Feels like camera blocking, not page scroll.
 */
export function FilmCutSection({
  children,
  side = "left",
  className = "",
  id,
}: {
  children: ReactNode;
  side?: "left" | "right" | "up";
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      ref.current.style.opacity = "1";
      ref.current.style.transform = "none";
      ref.current.style.filter = "none";
      return;
    }
    const el = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("film-cut-revealed");
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const initialTransform =
    side === "left"
      ? "translate3d(-24px, 0, 0)"
      : side === "right"
      ? "translate3d(24px, 0, 0)"
      : "translate3d(0, 28px, 0)";

  return (
    <section
      ref={ref}
      id={id}
      className={`film-cut ${className}`}
      style={{
        opacity: 0,
        transform: initialTransform,
        filter: "blur(6px)",
        transition:
          "opacity 220ms cubic-bezier(0.22, 1, 0.36, 1), transform 360ms cubic-bezier(0.22, 1, 0.36, 1), filter 280ms cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "opacity, transform, filter",
      }}
    >
      <style>{`
        .film-cut.film-cut-revealed {
          opacity: 1 !important;
          transform: translate3d(0, 0, 0) !important;
          filter: blur(0) !important;
        }
      `}</style>
      {children}
    </section>
  );
}

/**
 * Move 5 — Character-stagger reveal for press quotes.
 * When the quote enters viewport, characters fade in one-by-one at
 * 14ms stagger. After all settle, tracking opens 0.02em over 600ms
 * — a quiet "now-reading" cue.
 */
export function KineticQuote({
  text,
  className = "",
  charDelay = 14,
}: {
  text: string;
  className?: string;
  charDelay?: number;
}) {
  const ref = useRef<HTMLQuoteElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const el = ref.current;
    const chars = el.querySelectorAll<HTMLSpanElement>("[data-kq-char]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            chars.forEach((c, i) => {
              c.style.transitionDelay = `${i * charDelay}ms`;
              c.style.opacity = "1";
              c.style.transform = "translate3d(0, 0, 0)";
            });
            const totalDelay = chars.length * charDelay + 400;
            setTimeout(() => {
              el.style.transition = "letter-spacing 600ms cubic-bezier(0.22, 1, 0.36, 1)";
              el.style.letterSpacing = "0.02em";
            }, totalDelay);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [charDelay]);

  return (
    <blockquote ref={ref} className={className} style={{ letterSpacing: 0 }}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          data-kq-char
          aria-hidden="true"
          style={{
            display: "inline-block",
            opacity: 0,
            transform: "translate3d(0, 4px, 0)",
            transition:
              "opacity 320ms cubic-bezier(0.22, 1, 0.36, 1), transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
            willChange: "opacity, transform",
            whiteSpace: ch === " " ? "pre" : undefined,
          }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </blockquote>
  );
}
