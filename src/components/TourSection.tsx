import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  TOUR_SHOWS,
  REGION_LABELS,
  STATUS_LABELS,
  type Show,
  type Region,
  type ShowStatus,
} from "../data/tourDates";
import GlassCard from "./GlassCard";
import EyebrowBubble from "./EyebrowBubble";

/**
 * Tour section — combines:
 *  1. Per-row ticket / notify CTAs
 *  2. Status badges (color-coded)
 *  3. Live show countdown per row
 *  4. Add-to-calendar (.ics download)
 *  5. Per-show notify-me (bell → email capture scoped to one city)
 *  6. Region filter chips
 *  7. List / Map view toggle (map = desktop only)
 *  8. Animated routing line drawing across the map on view
 */

// ====== Countdown helpers ======
type DiffParts = { days: number; hours: number; mins: number; live: boolean };
function diffFromIso(iso: string, endIso?: string): DiffParts {
  const start = new Date(iso).getTime();
  const end = endIso ? new Date(endIso).getTime() : start + 4 * 3600 * 1000;
  const now = Date.now();
  if (now >= end) return { days: 0, hours: 0, mins: 0, live: false };
  if (now >= start) return { days: 0, hours: 0, mins: 0, live: true };
  const ms = start - now;
  const totalSeconds = Math.floor(ms / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    mins: Math.floor((totalSeconds % 3600) / 60),
    live: false,
  };
}
function isPast(iso: string, endIso?: string): boolean {
  const end = endIso ? new Date(endIso).getTime() : new Date(iso).getTime() + 4 * 3600 * 1000;
  return Date.now() > end;
}

// ====== ICS export ======
function isoToIcsStamp(iso: string): string {
  // Convert "2026-05-30T19:00:00+01:00" → "20260530T190000" in local then add Z by converting to UTC
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}
function buildIcs(show: Show): string {
  const start = isoToIcsStamp(show.iso);
  const end = isoToIcsStamp(show.iso_end ?? new Date(new Date(show.iso).getTime() + 4 * 3600 * 1000).toISOString());
  const stamp = isoToIcsStamp(new Date().toISOString());
  const summary = `CIZA — ${show.venue}`;
  const location = `${show.city}, ${show.country}`;
  const desc = `CIZA live at ${show.venue}. Tickets and details at https://ciza-palace.lvrn.dev`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CIZA//Tour//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${show.id}@ciza-palace.lvrn.dev`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${summary}`,
    `LOCATION:${location}`,
    `DESCRIPTION:${desc}`,
    `URL:https://ciza-palace.lvrn.dev`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
function downloadIcs(show: Show) {
  const blob = new Blob([buildIcs(show)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ciza-${show.id}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

// ====== Status badge ======
const STATUS_STYLES: Record<ShowStatus, string> = {
  "on-sale": "text-[#23d160] border-[#23d160]/45 bg-[#23d160]/10",
  "selling-fast": "text-accent border-accent/55 bg-accent/10",
  "last-tickets": "text-red-300 border-red-400/55 bg-red-500/10",
  "sold-out": "text-muted border-white/15 bg-white/5",
  invite: "text-fg/85 border-white/25 bg-white/5",
  announced: "text-accent border-accent/45 bg-accent/[0.08]",
};

function StatusBadge({ status }: { status: ShowStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-[0.22em] border ${STATUS_STYLES[status]}`}
    >
      {status !== "sold-out" && status !== "invite" && (
        <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
      )}
      {STATUS_LABELS[status]}
    </span>
  );
}

// ====== Countdown pill (live ticking) ======
function CountdownPill({ show }: { show: Show }) {
  const [parts, setParts] = useState<DiffParts>(() => diffFromIso(show.iso, show.iso_end));
  useEffect(() => {
    const id = setInterval(() => setParts(diffFromIso(show.iso, show.iso_end)), 1000);
    return () => clearInterval(id);
  }, [show.iso, show.iso_end]);
  if (parts.live) {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        Live now
      </span>
    );
  }
  if (isPast(show.iso, show.iso_end)) return null;
  const label =
    parts.days > 0
      ? `in ${parts.days}d ${parts.hours}h`
      : parts.hours > 0
      ? `in ${parts.hours}h ${parts.mins}m`
      : `in ${parts.mins}m`;
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/85">
      {label}
    </span>
  );
}

// ====== Notify-me popover (per show) ======
function NotifyMe({ show }: { show: Show }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = fd.get("email")?.toString().trim();
    if (!email) {
      setState("err");
      setMsg("Email?");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website: "", source: `tour:${show.id}` }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setState("ok");
      setMsg("✓ You're on the list");
      setTimeout(() => {
        setOpen(false);
        setState("idle");
        setMsg("");
        form.reset();
      }, 1800);
    } catch (err: unknown) {
      setState("err");
      setMsg(err instanceof Error ? err.message : "Try again");
    }
  };

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        type="button"
        aria-label={`Notify me when ${show.city} tickets drop`}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/15 text-fg/80 hover:text-accent hover:border-accent/45 transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      </button>
      {open && (
        <form
          onSubmit={onSubmit}
          className="absolute top-[120%] right-0 z-30 w-[260px] rounded-2xl p-3 border border-white/10 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]"
          style={{
            background: "rgba(14,14,16,0.96)",
            backdropFilter: "blur(18px) saturate(160%)",
            WebkitBackdropFilter: "blur(18px) saturate(160%)",
          }}
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-accent mb-2">
            Notify · {show.city}
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@email.com"
              disabled={state === "loading" || state === "ok"}
              className="flex-1 bg-white/5 border border-white/15 rounded-full px-3 py-2 text-xs text-fg placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
            />
            <button
              type="submit"
              disabled={state === "loading" || state === "ok"}
              className="px-3 py-2 bg-accent text-bg rounded-full text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-accent/90 disabled:opacity-50"
            >
              {state === "loading" ? "..." : state === "ok" ? "✓" : "Notify"}
            </button>
          </div>
          {msg && (
            <p
              className={`mt-2 text-[10px] uppercase tracking-[0.18em] font-mono ${
                state === "ok" ? "text-accent" : "text-red-300"
              }`}
            >
              {msg}
            </p>
          )}
        </form>
      )}
    </div>
  );
}

// ====== One tour row ======
const TourRow: React.FC<{ show: Show }> = ({ show }) => {
  const past = isPast(show.iso, show.iso_end);
  const dimmed = past || show.status === "sold-out";
  return (
    <div
      className={`grid grid-cols-12 gap-3 py-5 border-b border-white/10 items-center ${
        dimmed ? "opacity-55" : ""
      }`}
    >
      <div className="col-span-3 md:col-span-2 font-mono text-[11px] md:text-xs uppercase tracking-[0.18em] text-accent">
        {show.display}
      </div>
      <div className="col-span-9 md:col-span-4 flex flex-col gap-1">
        <div className="flex items-center gap-2.5 text-fg/95 text-sm md:text-base">
          <span aria-hidden className="text-base md:text-lg">{show.flag}</span>
          <span>{show.city}</span>
        </div>
        <div className="text-muted text-xs md:text-sm font-light leading-tight">
          {show.venue}
        </div>
        {/* Mobile-only badge + countdown row */}
        <div className="md:hidden flex items-center gap-2 mt-1 flex-wrap">
          <StatusBadge status={show.status} />
          {!past && <CountdownPill show={show} />}
        </div>
      </div>
      <div className="hidden md:flex md:col-span-3 flex-col items-start gap-1.5">
        <StatusBadge status={show.status} />
        {!past && <CountdownPill show={show} />}
      </div>
      <div className="col-span-12 md:col-span-3 flex items-center justify-end gap-2 mt-2 md:mt-0">
        {/* Calendar */}
        {!past && (
          <button
            type="button"
            onClick={() => downloadIcs(show)}
            aria-label={`Add ${show.city} to calendar`}
            title="Add to calendar"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/15 text-fg/80 hover:text-accent hover:border-accent/45 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </button>
        )}
        {/* Notify-me bell */}
        {!past && (show.status === "announced" || show.status === "sold-out" || show.status === "invite") && (
          <NotifyMe show={show} />
        )}
        {/* Ticket CTA */}
        {!past && show.ticketUrl && (show.status === "on-sale" || show.status === "selling-fast" || show.status === "last-tickets") && (
          <a
            href={show.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="beam-border inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent text-bg text-[10px] uppercase tracking-[0.22em] font-bold hover:bg-accent/90 transition-colors"
          >
            Tickets
            <span aria-hidden>→</span>
          </a>
        )}
        {past && (
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted/60">
            Past
          </span>
        )}
      </div>
    </div>
  );
};

// ====== Map view ======
const MAP_W = 1100;
const MAP_H = 520;
function project([lng, lat]: [number, number]): [number, number] {
  const x = ((lng + 180) / 360) * MAP_W;
  const y = ((90 - lat) / 180) * MAP_H;
  return [x, y];
}

function TourMap({ shows }: { shows: Show[] }) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [drawn, setDrawn] = useState(false);

  const pathD = useMemo(() => {
    if (shows.length === 0) return "";
    return shows
      .map((s, i) => {
        const [x, y] = project(s.coords);
        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
  }, [shows]);

  // Trigger the routing line draw on enter
  useEffect(() => {
    if (!wrapRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDrawn(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setTimeout(() => setDrawn(true), 250);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  // Compute path length once available so we can animate stroke-dashoffset
  useEffect(() => {
    if (!pathRef.current) return;
    const len = pathRef.current.getTotalLength();
    pathRef.current.style.strokeDasharray = `${len}`;
    pathRef.current.style.strokeDashoffset = drawn ? "0" : `${len}`;
  }, [drawn, pathD]);

  return (
    <div ref={wrapRef} className="hidden md:block relative">
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="World tour map"
      >
        {/* Background graticule — subtle grid */}
        <defs>
          <pattern id="tour-grid" width="55" height="55" patternUnits="userSpaceOnUse">
            <path d="M 55 0 L 0 0 0 55" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="pin-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(245,166,35,0.55)" />
            <stop offset="100%" stopColor="rgba(245,166,35,0)" />
          </radialGradient>
        </defs>
        <rect width={MAP_W} height={MAP_H} fill="url(#tour-grid)" />

        {/* Routing line — draws on scroll into view */}
        {shows.length > 1 && (
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="rgba(245,166,35,0.85)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: "drop-shadow(0 0 6px rgba(245,166,35,0.45))",
              transition: "stroke-dashoffset 2400ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        )}

        {/* Pins */}
        {shows.map((s, i) => {
          const [x, y] = project(s.coords);
          return (
            <g key={s.id} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
              <circle r="22" fill="url(#pin-glow)" />
              <circle r="5" fill="rgba(245,166,35,0.95)" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" />
              <text
                x="0"
                y="-13"
                textAnchor="middle"
                fill="rgba(245,245,245,0.95)"
                fontFamily="JetBrains Mono, monospace"
                fontSize="10"
                style={{ letterSpacing: "0.15em", textTransform: "uppercase" }}
              >
                {s.city}
              </text>
              <text
                x="0"
                y="18"
                textAnchor="middle"
                fill="rgba(245,245,245,0.55)"
                fontFamily="JetBrains Mono, monospace"
                fontSize="8"
                style={{ letterSpacing: "0.1em" }}
              >
                {String(i + 1).padStart(2, "0")} · {s.display}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="md:hidden mt-4 text-center text-xs text-muted/80">
        Map view best on desktop. Tap List for full details.
      </p>
    </div>
  );
}

// ====== Main section ======
export default function TourSection() {
  const [region, setRegion] = useState<Region | "all">("all");
  const [view, setView] = useState<"list" | "map">("list");

  const filtered = useMemo(
    () => (region === "all" ? TOUR_SHOWS : TOUR_SHOWS.filter((s) => s.region === region)),
    [region]
  );
  const regionCounts = useMemo(() => {
    const counts: Record<Region | "all", number> = {
      all: TOUR_SHOWS.length,
      africa: 0,
      europe: 0,
      americas: 0,
    };
    TOUR_SHOWS.forEach((s) => {
      counts[s.region] += 1;
    });
    return counts;
  }, []);

  return (
    <section id="events" className="max-w-5xl mx-auto px-6 py-32">
      <GlassCard className="p-8 md:p-12">
        <EyebrowBubble number="04">Tour 2026</EyebrowBubble>

        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95]">
            The Palace
            <br />
            <span className="text-accent">Goes Global</span>
          </h2>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted/85">
            Routing · May → Sept 2026
          </div>
        </div>

        {/* Controls: region filter + view toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="flex flex-wrap gap-1.5">
            {(["all", "africa", "europe", "americas"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                className={`px-3.5 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[0.22em] border transition-colors ${
                  region === r
                    ? "bg-accent/15 border-accent/50 text-accent"
                    : "bg-white/[0.025] border-white/10 text-fg/75 hover:text-white hover:border-white/25"
                }`}
              >
                {REGION_LABELS[r]}
                <span className="ml-1.5 text-muted/70">{regionCounts[r]}</span>
              </button>
            ))}
          </div>
          {/* List / Map toggle (desktop only) */}
          <div className="hidden md:inline-flex items-center rounded-full border border-white/10 bg-white/[0.025] p-1">
            {(["list", "map"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`px-3.5 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[0.22em] transition-colors ${
                  view === v
                    ? "bg-accent text-bg"
                    : "text-fg/75 hover:text-white"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Body — list or map */}
        {view === "list" || filtered.length < 2 ? (
          filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted/85 font-mono uppercase tracking-[0.2em]">
              No shows in this region yet
            </div>
          ) : (
            <div className="space-y-px border-t border-white/10">
              {filtered.map((show) => (
                <TourRow key={show.id} show={show} />
              ))}
            </div>
          )
        ) : (
          <TourMap shows={filtered} />
        )}

        <p className="mt-8 text-xs md:text-sm text-muted/85 leading-relaxed">
          Cities, venues and ticket links update as each leg is announced.{" "}
          <a
            href="#subscribe"
            className="text-accent hover:text-white transition-colors"
          >
            Join the Inner Circle
          </a>{" "}
          for presale codes before public on-sale.
        </p>
      </GlassCard>
    </section>
  );
}
