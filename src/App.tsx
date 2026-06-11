import React from "react";
import { motion } from "motion/react";
import cizaPortrait from "./assets/images/ciza_roman_gold_1781179874045.png";
import ScrollFrameBackground from "./components/ScrollFrameBackground";
import MagneticCursor from "./components/MagneticCursor";
import AudioSwellOnScroll from "./components/AudioSwellOnScroll";
import TypewriterQuote from "./components/TypewriterQuote";
import RotatingHeadline from "./components/RotatingHeadline";
import Countdown from "./components/Countdown";
import ShareButton from "./components/ShareButton";
import StickyMobileCTA from "./components/StickyMobileCTA";
import SubscribeForm from "./components/SubscribeForm";
import GlassCard from "./components/GlassCard";
import Marquee from "./components/Marquee";
import EyebrowBubble from "./components/EyebrowBubble";
import LiquidNav from "./components/LiquidNav";
import TypewriterCycle from "./components/TypewriterCycle";
import { SpotifyIcon, AppleMusicIcon, YouTubeIcon, InstagramIcon, TikTokIcon } from "./components/SocialIcons";

const cizaContent = {
  bio: "Working across Afro House, 3-step, and the broader dance & electronic space — CIZA built a catalogue that moves between club culture and global streaming audiences without losing its African identity.\n\nDJ. Producer. Recording artist. Built for the dancefloor, made for the world stage. From Johannesburg sets to Lagos, Nairobi, Kampala — CIZA is the engine of African dance music's next wave.",
  tagline: "South Africa's most exciting voice in African dance music. DJ, producer, recording artist — built for dancefloors, radio, and the world stage.",
  top_tracks: [
    { name: "Isaka (6am)", spotify_url: "https://open.spotify.com/track/7c5uGV9Rys18JP2570ykTu", cover_url: "https://ik.imagekit.io/iwuf0njwbf/LVRN/isaka-6am.webp", streams: "ft. Jazzworx & Thukuthela · 140M+ streams" },
    { name: "Isaka II (6am)", spotify_url: "https://open.spotify.com/track/4lz4aKs60vUoyZP4pNy3aD", cover_url: "https://ik.imagekit.io/iwuf0njwbf/LVRN/isaka-ii-tems-omah-lay.webp", streams: "w/ Tems, Omah Lay · 50M+ streams" },
    { name: "Yivule", spotify_url: "https://open.spotify.com/track/783s9jQYL85ipURwgyIB6I", cover_url: "https://ik.imagekit.io/iwuf0njwbf/LVRN/yivule.webp", streams: "Ciza's Palace · April 2026" },
    { name: "Mngani Wam", spotify_url: "https://open.spotify.com/track/00ZJMP9jkShSJcmCufqOlj", cover_url: "https://ik.imagekit.io/iwuf0njwbf/LVRN/mngani-wam.webp", streams: "w/ Oscar Mbo, Makhanj, Mpho.Wav, Danya Devs" },
  ],
  press_quotes: [
    { quote: "CIZA — September 2025 African Rookie of the Month. Isaka (6am) blends the rhythmic depth of Amapiano and radiates from Johannesburg to Lagos, Nairobi to Kampala.", source: "Billboard · Sep 2025", url: "https://www.billboard.com/music/music-news/ciza-isaka-6am-september-african-rookie-of-the-month-1236071954/" },
    { quote: "Ciza helped craft one of 3-Step's defining records, pushing the bustling genre further into mainstream consciousness and inspiring a wave of offshoots in the process.", source: "OkayAfrica · Jan 2026", url: "https://www.okayafrica.com/the-african-musicians-to-watch-in-2026/1421012" },
    { quote: "The pan-African and global rise of Isaka (6am) — Black Coffee at Hï Ibiza, Keinemusik at Brunch Electronik. CIZA is the engine of African dance music's next wave.", source: "Turntable Charts · 2026", url: "https://www.turntablecharts.com/news/1736" },
    { quote: "His understanding of house music is homegrown in the most literal sense. 'Isaka' introduced him as a global force; with 'Yivule,' he raises the stakes even higher.", source: "OkayAfrica · Apr 2026", url: "https://www.okayafrica.com/the-african-music-you-need-to-hear-this-week/1428205" },
    { quote: "CIZA selected for Apple Music's Africa Rising: Class of 2026 — recognising him as one of Africa's most promising musical talents.", source: "The Yanos Magazine · Jan 2026", url: "https://theyanos.co.za/2026/01/ciza-celebrates-selection-as-apple-musics-africa-rising-class-of-2026/" },
    { quote: "Global rising star Ciza is turning up the heat with the release of 'Isaka II (6AM),' a stunning reimagining of his viral hit. It cements Ciza as a fearless innovator shaping the next wave of African music.", source: "That Grape Juice · Aug 2025", url: "https://thatgrapejuice.net/2025/08/listen-ciza-taps-tems-omah-lay-for-electrifying-isaka-ii-6am/" },
    { quote: "CIZA is a young artist who is redefining the African sound with bold, genre-blending music — earning his place as one of Africa's fastest-rising stars.", source: "Beatportal · May 2026", url: "https://www.beatportal.com/articles/1428030-deep-root-records-welcomes-south-african-star-ciza-to-its-artist-roster" },
    { quote: "The dreamy house production gives an immaculate soundscape to float over. This reimagined version of 'Isaka' combines the best aspects of the West and South of Africa, showing just how much our ears for groove interlap.", source: "OkayAfrica · Aug 2025", url: "https://www.okayafrica.com/the-top-african-songs-you-need-to-hear-this-week-august-29-2025/1409416" },
    { quote: "Carrying the torch of Mafikizolo's legacy while forging his own Afro-pop path — CIZA's musical journey reflects a deep exploration of sound.", source: "Culture Custodian · 2025", url: "https://culturecustodian.com/ciza-carrying-the-torch-of-mafikizolos-legacy-while-forging-his-own-afro-pop-path/" },
  ],
  socials: {
    spotify: "https://open.spotify.com/artist/71hPkbyih5bdlHVPBgav33",
    apple: "https://music.apple.com/us/artist/ciza/1472059692",
    youtube: "https://www.youtube.com/@iamciza",
    instagram: "https://www.instagram.com/ciza_sa/",
    tiktok: "https://www.tiktok.com/@cizarioo",
  },
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  // Pulls the leading "NN ·" out of "01 · Bio" → bubble + label
  const text = typeof children === "string" ? children : "";
  const m = text.match(/^(\d+)\s*·\s*(.*)$/);
  if (m) {
    return <EyebrowBubble number={m[1]}>{m[2]}</EyebrowBubble>;
  }
  return <div className="eyebrow mb-4">{children}</div>;
}

// BorderBeam removed — replaced by .beam-border CSS class
// (smooth conic-gradient orbit, see index.css)

function ScrollReveal({
  children,
  delay = 0,
  side = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  side?: "left" | "right" | "up";
}) {
  // Move 4 — film-cut reveal: off-axis slide + motion-blur decay
  const fromTransform =
    side === "left"
      ? { x: -28, y: 0 }
      : side === "right"
      ? { x: 28, y: 0 }
      : { x: 0, y: 28 };
  return (
    <motion.div
      initial={{ opacity: 0, ...fromTransform, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.78,
        delay,
        ease: [0.22, 1, 0.36, 1],
        filter: { duration: 0.5, delay },
      }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const featured = cizaContent.top_tracks[0];

  return (
    <div className="bg-grain min-h-screen text-fg">
      <MagneticCursor />
      <AudioSwellOnScroll />
      <ScrollFrameBackground poster={cizaPortrait} />
      <LiquidNav
        logoSrc="/logos/wordmark-white.svg"
        items={[
          { id: "bio", label: "Bio" },
          { id: "release", label: "Release" },
          { id: "catalog", label: "Catalog" },
          { id: "events", label: "Events" },
          { id: "press", label: "Press" },
          { id: "subscribe", label: "Subscribe" },
        ]}
      />

      <section id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden">

        <div className="relative z-10 text-center px-6 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="mb-6 text-[10px] md:text-xs font-mono uppercase tracking-[0.6em] text-accent/85"
          >
            Welcome to
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative inline-flex items-center justify-center"
          >
            {/* Orbit rings — 2 expanding gold circles pulsing outward
                from the center of the wings mark. Premium "focal point"
                cue from the animation rubric, matches the focal-blur
                circle language already on the page. */}
            <span aria-hidden className="orbit-ring orbit-ring-1" />
            <span aria-hidden className="orbit-ring orbit-ring-2" />
            <motion.img
              src="/logos/wings.svg"
              alt="CIZA"
              className="relative w-[68vw] md:w-[44vw] lg:w-[38vw] max-w-[640px] h-auto"
              style={{
                filter: "drop-shadow(0 8px 40px rgba(0,0,0,0.55))",
              }}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <style>{`
              .orbit-ring {
                position: absolute;
                top: 50%; left: 50%;
                width: 70%;
                aspect-ratio: 1 / 1;
                transform: translate(-50%, -50%);
                border: 1px solid rgba(245, 166, 35, 0.45);
                border-radius: 50%;
                pointer-events: none;
                opacity: 0;
                animation: orbitPulse 3.6s ease-out infinite;
              }
              .orbit-ring-2 { animation-delay: 1.8s; }
              @keyframes orbitPulse {
                0%   { opacity: 0;    transform: translate(-50%, -50%) scale(0.85); }
                15%  { opacity: 0.55; }
                100% { opacity: 0;    transform: translate(-50%, -50%) scale(1.55); }
              }
              @media (prefers-reduced-motion: reduce) {
                .orbit-ring { animation: none !important; opacity: 0; }
              }
            `}</style>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 inline-block max-w-3xl mx-auto"
          >
            <div
              className="text-sm md:text-base text-fg/95 leading-relaxed px-7 py-4 rounded-full min-h-[3em]"
              style={{
                background: "rgba(10, 10, 10, 0.42)",
                backdropFilter: "blur(14px) saturate(140%)",
                WebkitBackdropFilter: "blur(14px) saturate(140%)",
                border: "1px solid rgba(245, 245, 245, 0.08)",
                boxShadow: "0 12px 48px -16px rgba(0, 0, 0, 0.5)",
              }}
            >
              <TypewriterCycle
                lines={[
                  "South Africa's most exciting voice in African dance music.",
                  "DJ. Producer. Recording artist. Built for the world stage.",
                  "Isaka (6am) · 140M+ streams and counting.",
                  "Afro House. 3-step. Amapiano without borders.",
                  "Apple Music · Africa Rising · Class of 2026.",
                  "From Johannesburg to Lagos to Ibiza.",
                  "CIZA'S PALACE · The album is coming.",
                ]}
              />
            </div>
          </motion.div>
          <motion.a
            href="#bio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="inline-block mt-12 text-xs uppercase tracking-[0.3em] text-accent border-b border-accent/40 pb-1"
          >
            Scroll
          </motion.a>
        </div>
      </section>

      <div className="relative py-8 border-y border-white/[0.04]">
        <Marquee
          duration={42}
          items={[
            { label: "140M+ Streams · Isaka (6am)", accent: true },
            { label: "Apple Music · Africa Rising 2026" },
            { label: "Billboard · September African Rookie", accent: true },
            { label: "50M+ Streams · Isaka II w/ Tems, Omah Lay" },
            { label: "Turntable Charts · 2026 Cover", accent: true },
            { label: "Culture Custodian · 2025 Feature" },
            { label: "Ciza's Palace · LP April 2026", accent: true },
            { label: "Afro House · 3-Step · Amapiano" },
          ]}
        />
      </div>

      <section id="bio" className="max-w-4xl mx-auto px-6 py-32">
        <ScrollReveal>
          <GlassCard className="p-10 md:p-14">
            <Eyebrow>01 · Bio</Eyebrow>
            <div className="space-y-6 text-lg md:text-xl leading-relaxed text-fg/95 font-light">
              {cizaContent.bio.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </GlassCard>
        </ScrollReveal>
      </section>

      <section id="release" className="max-w-6xl mx-auto px-6 py-32">
        <ScrollReveal>
          <GlassCard className="p-8 md:p-12">
            <Eyebrow>02 · Latest Release</Eyebrow>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <img src={featured.cover_url} alt={featured.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4">{featured.name}</h2>
                <p className="text-muted text-sm font-mono mb-8">{featured.streams}</p>
                <a
                  href={featured.spotify_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="beam-border beam-border-white inline-block px-10 py-4 bg-primary text-white text-xs uppercase tracking-[0.3em] font-semibold hover:bg-primary/90 transition rounded-full"
                >
                  Play on Spotify
                </a>
              </div>
            </div>
          </GlassCard>
        </ScrollReveal>
      </section>

      <section id="catalog" className="max-w-6xl mx-auto px-6 py-32">
        <ScrollReveal>
          <GlassCard className="p-8 md:p-12 mb-10">
            <Eyebrow>03 · Album Preview</Eyebrow>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-5">
                <img
                  src="/logos/ciza-palace.svg"
                  alt=""
                  aria-hidden
                  className="h-14 md:h-16 w-auto opacity-90 drop-shadow-[0_4px_14px_rgba(245,166,35,0.25)]"
                />
                <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight leading-[0.95]">
                  CIZA'S PALACE
                  <br />
                  <RotatingHeadline
                    phrases={["Preview", "Coming Soon", "On the Way", "April 2026"]}
                    className="text-accent italic"
                  />
                </h2>
              </div>

              {/* Live countdown to album release */}
              <div className="self-start md:self-auto px-5 py-3 rounded-2xl border border-accent/30 bg-accent/[0.04]">
                {/* TODO: Update target to the real album release date+time (SAST).
                    Today's placeholder is 60 days out from now. */}
                <Countdown
                  target="2026-08-15T18:00:00+02:00"
                  label="CIZA'S PALACE drops in"
                  liveLabel="OUT NOW · Listen"
                />
              </div>
            </div>
            <style>{`
              @keyframes stayTunedPing {
                0%   { transform: scale(1);   opacity: 0.85; }
                80%, 100% { transform: scale(2.6); opacity: 0; }
              }
              .stay-tuned-ping { animation: stayTunedPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite; }
              @media (prefers-reduced-motion: reduce) {
                .stay-tuned-ping { animation: none !important; opacity: 0; }
              }
            `}</style>
          </GlassCard>
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cizaContent.top_tracks.map((track, i) => (
            <ScrollReveal key={track.name} delay={i * 0.1}>
              <GlassCard className="p-3 group">
                <a href={track.spotify_url} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="relative aspect-square overflow-hidden rounded-2xl mb-3 bg-card">
                    <img
                      src={`${track.cover_url}?tr=w-640,q-78,f-auto`}
                      alt={track.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />
                    {/* DSP icons — appear on hover (desktop), always visible on touch */}
                    <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-300">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black/70 backdrop-blur-sm border border-white/15 text-white">
                        <SpotifyIcon className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-base mb-1 px-1">{track.name}</h3>
                  <p className="text-xs text-muted font-mono px-1 pb-1">{track.streams}</p>
                </a>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section id="events" className="max-w-4xl mx-auto px-6 py-32">
        <ScrollReveal>
          <GlassCard className="p-10 md:p-14">
            <Eyebrow>04 · Upcoming Events</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-12">Tour · TBA</h2>
            <div className="space-y-px border-t border-white/10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="grid grid-cols-12 gap-4 py-6 border-b border-white/10 items-center">
                  <div className="col-span-3 font-mono text-xs text-muted">[DATA NEEDED]</div>
                  <div className="col-span-5 text-fg/80">[DATA NEEDED] · Venue</div>
                  <div className="col-span-2 font-mono text-xs text-muted">[DATA NEEDED]</div>
                  <div className="col-span-2 text-right">
                    <span className="text-xs uppercase tracking-widest text-muted">Soon</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm text-muted">Tour dates announced soon. Subscribe below for first access.</p>
          </GlassCard>
        </ScrollReveal>
      </section>

      <section id="press" className="max-w-5xl mx-auto px-6 py-32">
        <ScrollReveal>
          <GlassCard className="p-8 md:p-10 mb-10">
            <Eyebrow>05 · Press</Eyebrow>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight font-display leading-[0.95]">
              <span className="block">In the </span>
              <RotatingHeadline
                phrases={["Press", "Conversation", "Spotlight", "Record"]}
                className="text-accent italic"
              />
            </h2>
          </GlassCard>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 gap-8">
          {cizaContent.press_quotes.map((q, i) => {
            // Randomized typewriter timing per card — varied feel
            const speeds = [18, 24, 21, 26, 19, 23];
            const delays = [0, 220, 90, 340, 140, 280];
            return (
              <ScrollReveal key={i} delay={i * 0.1}>
                <GlassCard className="p-8">
                  <a href={q.url} target="_blank" rel="noopener noreferrer" className="block group">
                    <TypewriterQuote
                      text={`"${q.quote}"`}
                      className="font-serif italic text-lg md:text-xl leading-relaxed text-fg/95 mb-5 block min-h-[5em]"
                      msPerChar={speeds[i % speeds.length]}
                      startDelay={delays[i % delays.length]}
                    />
                    <cite className="text-xs uppercase tracking-[0.2em] font-mono text-accent not-italic group-hover:text-white transition">
                      {q.source} →
                    </cite>
                  </a>
                </GlassCard>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      <section id="subscribe" className="max-w-4xl mx-auto px-6 py-32">
        <ScrollReveal>
          <GlassCard className="p-10 md:p-16" intensity="strong">
            <div className="text-center">
              <Eyebrow>06 · The Inner Circle</Eyebrow>
              <h2 className="font-display text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[0.95]">
                Join the
                <br />
                <RotatingHeadline
                  phrases={["Inner Circle", "Movement", "Palace", "Pulse"]}
                  className="text-accent italic"
                />
              </h2>
              <p className="text-fg/85 text-base md:text-lg max-w-xl mx-auto mb-12 leading-relaxed">
                Be first to know when CIZA drops new music, announces tour dates,
                or goes live from CIZA'S PALACE. Built for fans who move with him.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
              {[
                { tag: "Tour", title: "Tour Dates", copy: "Cities, venues, presale codes — before public on-sale." },
                { tag: "Events", title: "CIZA'S PALACE Live", copy: "Live mixes, residencies, club nights, after-hours." },
                { tag: "Music", title: "New Releases", copy: "Singles, features, the LP — direct to your inbox." },
                { tag: "Drops", title: "Merch & Drops", copy: "Limited drops, early-bird access, member-only items." },
              ].map((b) => (
                <div
                  key={b.title}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-white/10 bg-white/[0.025]"
                >
                  <div className="flex-shrink-0 mt-1 w-2 h-2 rounded-full bg-accent shadow-[0_0_12px_2px_rgba(245,166,35,0.55)]" />
                  <div className="text-left">
                    <div className="font-mono uppercase tracking-[0.25em] text-[10px] text-accent mb-1">
                      {b.tag}
                    </div>
                    <div className="font-semibold text-base mb-1">{b.title}</div>
                    <div className="text-sm text-muted leading-relaxed">{b.copy}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <SubscribeForm />
              <p className="mt-6 text-[11px] uppercase tracking-[0.25em] font-mono text-muted/80">
                No spam · Unsubscribe anytime · Real updates only
              </p>
            </div>
          </GlassCard>
        </ScrollReveal>
      </section>

      <section id="follow" className="max-w-4xl mx-auto px-6 py-20">
        <GlassCard className="p-8 md:p-10">
          <Eyebrow>07 · Follow</Eyebrow>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            {[
              { name: "Spotify", url: cizaContent.socials.spotify, Icon: SpotifyIcon, hover: "hover:text-[#1DB954]" },
              { name: "Apple Music", url: cizaContent.socials.apple, Icon: AppleMusicIcon, hover: "hover:text-[#FA5765]" },
              { name: "YouTube", url: cizaContent.socials.youtube, Icon: YouTubeIcon, hover: "hover:text-[#FF0000]" },
              { name: "Instagram", url: cizaContent.socials.instagram, Icon: InstagramIcon, hover: "hover:text-[#E1306C]" },
              { name: "TikTok", url: cizaContent.socials.tiktok, Icon: TikTokIcon, hover: "hover:text-[#69C9D0]" },
            ].map(({ name, url, Icon, hover }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`beam-border beam-border-slow inline-flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.2em] text-fg/85 transition-colors duration-300 bg-white/[0.025] border border-white/10 ${hover}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="leading-none">{name}</span>
              </a>
            ))}
          </div>
        </GlassCard>
      </section>

      <section id="epk-cta" className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <ScrollReveal>
          <a
            href="https://ciza.lvrn.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="beam-border beam-border-white group inline-flex items-center gap-3 px-10 py-5 rounded-full text-xs uppercase tracking-[0.3em] font-bold text-bg bg-accent hover:bg-accent/90 transition-all"
            style={{ boxShadow: "0 18px 60px -20px rgba(245,166,35,0.55)" }}
          >
            <span>View Full EPK</span>
            <span
              aria-hidden
              className="inline-block transition-transform duration-500 group-hover:translate-x-1.5"
            >
              →
            </span>
          </a>
          <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-muted font-mono">
            Booking · Press · Rates · Tech
          </p>
        </ScrollReveal>
      </section>

      <footer className="max-w-6xl mx-auto px-6 py-12 pb-24 md:pb-12 border-t border-white/5 flex flex-col md:flex-row gap-6 justify-between items-center text-xs font-mono text-muted">
        <div className="flex items-center gap-4">
          <img src="/logos/ciza-palace.svg" alt="Ciza's Palace" className="h-10 w-auto opacity-80" />
          <span>CIZA · LVRN · 2026</span>
        </div>
        <div className="flex items-center gap-4">
          <ShareButton
            url="https://ciza-palace.lvrn.dev"
            title="CIZA — Ciza's Palace"
            text="South African DJ, producer & recording artist. Built for the world stage."
          />
          <span className="hidden sm:inline">All rights reserved.</span>
        </div>
      </footer>

      <StickyMobileCTA href="https://ciza.lvrn.dev" label="View Full EPK" />
    </div>
  );
}
