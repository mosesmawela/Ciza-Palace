import React from "react";
import { motion } from "motion/react";
import cizaPortrait from "./assets/images/ciza_roman_gold_1781179874045.png";
import ScrollFrameBackground from "./components/ScrollFrameBackground";
import MagneticCursor from "./components/MagneticCursor";
import KineticWordmark from "./components/KineticWordmark";
import AudioSwellOnScroll from "./components/AudioSwellOnScroll";
import { KineticQuote } from "./components/CinematicReveal";
import SubscribeForm from "./components/SubscribeForm";

const cizaContent = {
  bio: "Working across Afro House, 3-step, and the broader dance & electronic space — CIZA built a catalogue that moves between club culture and global streaming audiences without losing its African identity.\n\nSon of Mafikizolo's Nhlanhla Mafu and TK Nciza. Born Benoni, 2001. Independent voice, family legacy, global ambition.",
  tagline: "South Africa's most exciting voice in African dance music. DJ, producer, recording artist — built for dancefloors, radio, and the world stage.",
  top_tracks: [
    { name: "Isaka (6am)", spotify_url: "https://open.spotify.com/track/7c5uGV9Rys18JP2570ykTu", cover_url: "https://ik.imagekit.io/iwuf0njwbf/LVRN/isaka-6am.webp", streams: "ft. Jazzworx & Thukuthela · 140M+ streams" },
    { name: "Isaka II (6am)", spotify_url: "https://open.spotify.com/track/4lz4aKs60vUoyZP4pNy3aD", cover_url: "https://ik.imagekit.io/iwuf0njwbf/LVRN/isaka-ii-tems-omah-lay.webp", streams: "w/ Tems, Omah Lay · 50M+ streams" },
    { name: "Yivule", spotify_url: "https://open.spotify.com/track/783s9jQYL85ipURwgyIB6I", cover_url: "https://ik.imagekit.io/iwuf0njwbf/LVRN/yivule.webp", streams: "Ciza's Palace · April 2026" },
    { name: "Mngani Wam", spotify_url: "https://open.spotify.com/track/00ZJMP9jkShSJcmCufqOlj", cover_url: "https://ik.imagekit.io/iwuf0njwbf/LVRN/mngani-wam.webp", streams: "w/ Oscar Mbo, Makhanj, Mpho.Wav, Danya Devs" },
  ],
  press_quotes: [
    { quote: "CIZA — September 2025 African Rookie of the Month. Isaka (6am) blends the rhythmic depth of Amapiano and radiates from Johannesburg to Lagos, Nairobi to Kampala.", source: "Billboard · Sep 2025", url: "https://www.billboard.com/music/music-news/ciza-isaka-6am-september-african-rookie-of-the-month-1236071954/" },
    { quote: "The pan-African and global rise of Isaka (6am) — Black Coffee at Hï Ibiza, Keinemusik at Brunch Electronik. CIZA is the engine of African dance music's next wave.", source: "Turntable Charts · 2026", url: "https://www.turntablecharts.com/news/1736" },
    { quote: "CIZA selected for Apple Music's Africa Rising: Class of 2026 — recognising him as one of Africa's most promising musical talents.", source: "The Yanos Magazine · Jan 2026", url: "https://theyanos.co.za/2026/01/ciza-celebrates-selection-as-apple-musics-africa-rising-class-of-2026/" },
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
  return <div className="eyebrow mb-4">{children}</div>;
}

function BorderBeam() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
      <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" fill="none" stroke="#1E90FF" strokeWidth="1" className="animate-beam-path" />
    </svg>
  );
}

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
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#top" className="font-black tracking-tight text-lg">CIZA</a>
          <div className="hidden md:flex gap-8 text-xs uppercase tracking-widest text-muted">
            <a href="#bio" className="hover:text-white">Bio</a>
            <a href="#release" className="hover:text-white">Release</a>
            <a href="#catalog" className="hover:text-white">Catalog</a>
            <a href="#events" className="hover:text-white">Events</a>
            <a href="#press" className="hover:text-white">Press</a>
            <a href="#subscribe" className="hover:text-white">Subscribe</a>
          </div>
        </div>
      </nav>

      <section id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-transparent to-[#0a0a0a]/80 pointer-events-none" />

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <KineticWordmark
              text="CIZA"
              className="text-[18vw] md:text-[16vw] leading-none"
              style={{
                background: "linear-gradient(180deg, #f5f5f5 0%, #F5A623 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 inline-block max-w-2xl mx-auto"
          >
            <p
              className="text-sm md:text-base text-fg/95 leading-relaxed px-7 py-4 rounded-full"
              style={{
                background: "rgba(10, 10, 10, 0.42)",
                backdropFilter: "blur(14px) saturate(140%)",
                WebkitBackdropFilter: "blur(14px) saturate(140%)",
                border: "1px solid rgba(245, 245, 245, 0.08)",
                boxShadow: "0 12px 48px -16px rgba(0, 0, 0, 0.5)",
              }}
            >
              {cizaContent.tagline}
            </p>
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

      <section id="bio" className="max-w-4xl mx-auto px-6 py-32">
        <ScrollReveal>
          <Eyebrow>01 · Bio</Eyebrow>
          <div className="space-y-6 text-lg md:text-xl leading-relaxed text-fg/90 font-light">
            {cizaContent.bio.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section id="release" className="max-w-6xl mx-auto px-6 py-32">
        <ScrollReveal>
          <Eyebrow>02 · Latest Release</Eyebrow>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square overflow-hidden rounded-sm">
              <img src={featured.cover_url} alt={featured.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4">{featured.name}</h2>
              <p className="text-muted text-sm font-mono mb-8">{featured.streams}</p>
              <a
                href={featured.spotify_url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-block px-10 py-4 bg-primary text-white text-xs uppercase tracking-[0.3em] font-semibold hover:bg-primary/90 transition"
              >
                <BorderBeam />
                Play on Spotify
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section id="catalog" className="max-w-6xl mx-auto px-6 py-32">
        <ScrollReveal>
          <Eyebrow>03 · Catalog</Eyebrow>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-12">Selected Works</h2>
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cizaContent.top_tracks.map((track, i) => (
            <ScrollReveal key={track.name} delay={i * 0.1}>
              <a href={track.spotify_url} target="_blank" rel="noopener noreferrer" className="group block">
                <div className="aspect-square overflow-hidden rounded-sm mb-3 bg-card">
                  <img src={track.cover_url} alt={track.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                </div>
                <h3 className="font-semibold text-base mb-1">{track.name}</h3>
                <p className="text-xs text-muted font-mono">{track.streams}</p>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section id="events" className="max-w-4xl mx-auto px-6 py-32">
        <ScrollReveal>
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
        </ScrollReveal>
      </section>

      <section id="press" className="max-w-5xl mx-auto px-6 py-32">
        <ScrollReveal>
          <Eyebrow>05 · Press</Eyebrow>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-16">In the Press</h2>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 gap-10">
          {cizaContent.press_quotes.map((q, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <a href={q.url} target="_blank" rel="noopener noreferrer" className="block group">
                <KineticQuote
                  text={`"${q.quote}"`}
                  className="text-lg md:text-xl leading-relaxed font-light text-fg/90 mb-4 italic block"
                />
                <cite className="text-xs uppercase tracking-[0.2em] font-mono text-accent not-italic group-hover:text-white transition">
                  {q.source} →
                </cite>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section id="subscribe" className="max-w-2xl mx-auto px-6 py-32 text-center">
        <ScrollReveal>
          <Eyebrow>06 · Subscribe</Eyebrow>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Join the list</h2>
          <p className="text-muted mb-10">First access to releases, tour dates, and drops. No spam.</p>
          <SubscribeForm />
        </ScrollReveal>
      </section>

      <section id="follow" className="max-w-4xl mx-auto px-6 py-20 border-t border-white/5">
        <Eyebrow>07 · Follow</Eyebrow>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <a href={cizaContent.socials.spotify} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition">Spotify</a>
          <a href={cizaContent.socials.apple} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition">Apple Music</a>
          <a href={cizaContent.socials.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition">YouTube</a>
          <a href={cizaContent.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition">Instagram</a>
          <a href={cizaContent.socials.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition">TikTok</a>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center text-xs font-mono text-muted">
        <div>CIZA · LVRN · 2026</div>
        <div>All rights reserved.</div>
      </footer>
    </div>
  );
}
