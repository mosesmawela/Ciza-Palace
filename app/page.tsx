import React from "react";
import { 
  Instagram, 
  Youtube, 
  Twitter, 
  Music, 
  MapPin, 
  Volume2, 
  ArrowUpRight,
  Sparkles,
  Bookmark
} from "lucide-react";
import SignupForm from "../components/SignupForm";

// The Roman Greek liquid-gold statue asset path
const ancientStatue = "/src/assets/images/ciza_roman_gold_1781179874045.png";

export default function Home() {
  return (
    <div className="bg-[#0c0b0a] text-zinc-300 min-h-screen selection:bg-gold selection:text-black scroll-smooth overflow-x-hidden relative bg-grain">
      
      {/* SOLID ELEGANT VERTICAL GRID LINES */}
      <div className="absolute inset-y-0 left-0 right-0 pointer-events-none flex justify-between px-6 md:px-12 xl:px-24 z-0">
        <div className="w-[1px] h-full bg-zinc-900/10 border-l border-zinc-900/15"></div>
        <div className="w-[1px] h-full bg-zinc-900/10 border-l border-zinc-900/15 hidden md:block"></div>
        <div className="w-[1px] h-full bg-zinc-900/10 border-l border-zinc-900/15 hidden xl:block"></div>
        <div className="w-[1px] h-full bg-zinc-900/10 border-l border-zinc-900/15"></div>
      </div>

      {/* GLOW HALO SHIELDS */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-gold-dark/5 rounded-full filter blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed top-1/2 -right-42 w-96 h-96 bg-amber-900/5 rounded-full filter blur-[140px] pointer-events-none z-0"></div>

      {/* HEADER NAV */}
      <header className="fixed top-0 left-0 w-full z-45 bg-[#0c0b0a]/75 backdrop-blur-lg border-b border-zinc-900/40">
        <div className="max-w-7xl mx-auto px-6 h-22 flex items-center justify-between">
          <a href="#" className="font-serif font-semibold text-2xl lg:text-3xl tracking-[0.25em] text-white hover:text-gold transition-all duration-300 relative group">
            CIZA
            <span className="absolute -bottom-1 left-0 w-0 h-[10px] bg-gold group-hover:w-full transition-all duration-500"></span>
          </a>
          
          <nav className="hidden md:flex items-center gap-10 text-[10px] font-sans tracking-[0.3em] uppercase font-bold text-zinc-400">
            <a href="#about" className="hover:text-white hover:tracking-[0.35em] transition-all duration-300">BIO</a>
            <a href="#music" className="hover:text-white hover:tracking-[0.35em] transition-all duration-300">SOUNDS</a>
            <a href="#events" className="hover:text-white hover:tracking-[0.35em] transition-all duration-300">TOUR</a>
            <a href="#subscribe" className="hover:text-white hover:tracking-[0.35em] transition-all duration-300">BULLETIN</a>
          </nav>
          
          <div>
            <a 
              href="#subscribe" 
              className="bg-[#12100e] text-gold hover:text-black hover:bg-gold border border-gold-dark/40 hover:border-gold px-6 py-3 rounded-md text-[10px] font-sans uppercase tracking-[0.2em] font-extrabold transition-all duration-500"
            >
              MEMBERSHIP
            </a>
          </div>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section className="relative min-h-screen flex items-center justify-center pt-22 px-6 md:px-12 xl:px-24">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center relative z-10 py-12">
          
          {/* Typography side */}
          <div className="lg:col-span-7 space-y-10 order-2 lg:order-1 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-dark/15 border border-gold/25 text-gold text-[10px] font-mono uppercase tracking-[0.2em] rounded-md animate-float">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Amapiano & Parian Aesthetic Hybrid</span>
            </div>

            <div className="space-y-4">
              <span className="block text-zinc-500 font-mono text-[11px] tracking-[0.4em] uppercase">01 / ARCHETYPAL VOICE</span>
              <h1 className="font-serif font-light text-5xl md:text-8xl leading-[1.05] tracking-wide text-white">
                The New <br />
                <span className="text-gold italic font-normal">Solfeggio</span> Spirit
              </h1>
            </div>

            <p className="text-zinc-400 font-serif italic text-base md:text-xl tracking-wide max-w-xl leading-relaxed">
              "We take the rich clay of South African Amapiano logs, and sculpt it into the golden geometry of classical Europe." — Signed with Love Renaissance.
            </p>

            <div className="space-y-6 pt-4">
              <div className="h-[1px] w-full bg-gradient-to-r from-zinc-800/70 to-transparent"></div>
              <p className="text-zinc-500 font-mono text-[9px] tracking-[0.25em] uppercase">
                ENTER YOUR NOM IN SCROLL FOR IMMINENT TOUR UPDATES
              </p>
              <SignupForm sourceId="next-hero-portal" />
            </div>
          </div>

          {/* Picture side */}
          <div className="lg:col-span-5 flex justify-center order-1 lg:order-2 relative select-none">
            
            {/* Spinning Celestial Orbits */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] rounded-full border border-gold/15 animate-spin-slow pointer-events-none z-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gold/50 shadow-md"></div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] rounded-full border border-dashed border-zinc-800/40 animate-spin-reverse pointer-events-none z-0"></div>

            <div className="relative w-76 h-76 md:w-96 md:h-96 rounded-full overflow-hidden border-2 border-gold/20 shadow-[0_0_100px_rgba(223,186,115,0.08)] bg-[#12100e] hover:border-gold/50 transition-all duration-750 p-2 z-10">
              <div className="w-full h-full rounded-full overflow-hidden relative">
                <img 
                  src={ancientStatue} 
                  alt="Ancient Roman Gold Marble Bust CIZA" 
                  className="w-full h-full object-cover scale-102"
                />
              </div>
            </div>

            <div className="absolute -bottom-6 right-4 xl:-right-6 bg-[#161412] border border-gold/30 px-5 py-3 rounded text-left hidden sm:block shadow-2xl z-20">
              <span className="block text-[8px] font-mono text-[#dfba73] tracking-[0.3em] uppercase">ANTIQUE PARIAN</span>
              <span className="block text-white font-serif text-xs font-semibold tracking-wide">CIZA & LVRN COLLATIVE</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: BIOGRAPHY / ABOUT */}
      <section id="about" className="py-28 md:py-36 bg-[#12100e] border-t border-zinc-900/60 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center relative z-10">
          
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-gold/30"></div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-gold/30"></div>
            
            <div className="relative rounded-lg overflow-hidden bg-zinc-950 aspect-[4/5] group border border-zinc-900 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0c0b0a] via-[#12100e]/80 to-gold/10 opacity-80"></div>
              
              <div className="absolute inset-0 flex flex-col justify-between p-8 z-10">
                <div className="flex justify-between items-start">
                  <Bookmark className="w-5 h-5 text-gold" />
                  <span className="font-mono text-[9px] text-[#dfba73] tracking-widest uppercase border border-gold/20 px-2 py-1 rounded">LVRN INTEL</span>
                </div>
                <div>
                  <p className="font-serif font-black text-5xl text-neutral-200 tracking-wider">MCMXCIV</p>
                  <p className="font-sans text-[9px] text-[#dfba73] tracking-[0.2em] uppercase mt-2">CLASSIC PARIAN SCULPTURE</p>
                </div>
              </div>

              <img 
                src="https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&q=80&w=800" 
                alt="Classical Greek Sculpture Bust Background" 
                className="w-full h-full object-cover filter grayscale opacity-20"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">
            <span className="text-[10px] font-mono text-gold uppercase tracking-[0.35em] block">02 / HISTORIC BLURB</span>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-white leading-tight">
              An Architectural Fusion of <br />
              <span className="text-gold italic font-normal">Amapiano Log Drums</span> & Luxury Design
            </h2>
            
            <div className="space-y-6 text-zinc-400 font-serif leading-relaxed text-sm md:text-base tracking-wide font-light">
              <p>
                CIZA stands as the primary sculptor of modern electronic high-art. Shaking the foundations of the international music sphere, our aesthetic pairs the raw, syncopated soul of South African townships with the marble-cold precision of ancestral Europe.
              </p>
              <p>
                In partnership with creative studio <strong>LVRN (Love Renaissance)</strong>, CIZA is curating an immersive platform. This website is a vault for our disciples—capturing your secure signatures to deliver exclusive physical audio tracks, fine gold-wax invitations, and private performance telemetry directly.
              </p>
              
              <div className="border-l-2 border-gold pl-6 py-1 italic text-zinc-300 font-serif text-lg bg-[#0c0b0a]/50 rounded-r">
                "We speak in electronic waves, constructing a sanctuary where ancient stone and modern low frequencies unify."
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: LATEST MUSIC */}
      <section id="music" className="py-28 md:py-36 bg-[#0c0b0a] border-t border-zinc-900/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-4">
            <div>
              <span className="text-[10px] font-mono text-gold uppercase tracking-[0.35em] block">03 / AUDIO TELEMETRY</span>
              <h2 className="text-4xl font-serif font-light tracking-wide text-white mt-2">The Solfeggio Catalog</h2>
            </div>
            <p className="text-zinc-500 font-sans text-xs max-w-sm tracking-wider uppercase">
              Auditory monuments. Stream the official catalog of CIZA across global streaming libraries.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Spotify */}
            <div className="bg-[#12100e] border border-zinc-900 rounded-xl p-6 flex flex-col h-full hover:border-gold/30 hover:shadow-2xl transition-all duration-300 relative group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/5 text-green-400 text-[9px] font-mono uppercase tracking-[0.2em] border border-green-500/10 rounded">
                  Spotify Portal
                </span>
                <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-gold transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
              
              <div className="w-full flex-grow aspect-video bg-zinc-950 rounded-lg overflow-hidden flex items-center justify-center border border-zinc-900 relative">
                <iframe 
                  style={{ borderRadius: "8px" }}
                  src="https://open.spotify.com/embed/playlist/37i9dQZF1DXc8f6F89H6gA?utm_source=generator" 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  allowFullScreen={false} 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                  className="w-full h-full border-0 absolute inset-0 filter saturate-90 brightness-95"
                ></iframe>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono mt-4 text-center tracking-widest uppercase">
                SCULPTURE INDEX: [AMAPIANO VASTNESS]
              </p>
            </div>

            {/* Apple Music */}
            <div className="bg-[#12100e] border border-zinc-900 rounded-xl p-6 flex flex-col h-full hover:border-gold/30 hover:shadow-2xl transition-all duration-300 relative group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/5 text-rose-400 text-[9px] font-mono uppercase tracking-[0.2em] border border-rose-500/10 rounded">
                  Apple Music Portal
                </span>
                <a href="https://music.apple.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-gold transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
              
              <div className="w-full flex-grow aspect-video bg-zinc-950 rounded-lg overflow-hidden flex items-center justify-center border border-zinc-900 relative">
                <iframe 
                  allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" 
                  frameBorder="0" 
                  height="100%" 
                  style={{ width: "100%", maxWidth: "100%", overflow: "hidden", borderRadius: "8px" }} 
                  src="https://embed.music.apple.com/za/playlist/amapiano-lifestyle/pl.e697841e21b84742a0887df926c0dc89" 
                  className="w-full h-full border-0 absolute inset-0 filter saturate-90 brightness-95"
                ></iframe>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono mt-4 text-center tracking-widest uppercase">
                SCULPTURE INDEX: [SYNCOPATED SOUL]
              </p>
            </div>

            {/* YouTube */}
            <div className="bg-[#12100e] border border-zinc-900 rounded-xl p-6 flex flex-col h-full hover:border-gold/30 hover:shadow-2xl transition-all duration-300 relative group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/5 text-red-400 text-[9px] font-mono uppercase tracking-[0.2em] border border-red-500/10 rounded">
                  Youtube Studio
                </span>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-gold transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
              
              <div className="w-full flex-grow aspect-video bg-zinc-950 rounded-lg overflow-hidden flex items-center justify-center border border-zinc-900 relative">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/gS_pG-6Z92c" 
                  title="YouTube Playback" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                  className="w-full h-full border-0 absolute inset-0 filter saturate-90 brightness-95"
                ></iframe>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono mt-4 text-center tracking-widest uppercase">
                SCULPTURE INDEX: [VISUAL KINETICS]
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: EVENTS / TOUR */}
      <section id="events" className="py-28 md:py-36 bg-[#12100e] border-t border-zinc-900/60 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-4">
            <div>
              <span className="text-[10px] font-mono text-gold uppercase tracking-[0.35em] block">04 / PILGRIMAGE TOUR</span>
              <h2 className="text-4xl font-serif font-light tracking-wide text-white mt-2">Ritual Live Exhibitions</h2>
            </div>
            <p className="text-zinc-500 font-sans text-xs max-w-sm tracking-wider uppercase">
              Join the electronic congregation in real physical time. Secure standard and VVIP permits below.
            </p>
          </div>

          <div className="border-t border-zinc-800/80 divide-y divide-zinc-800/80" id="events-exhibit-list">
            
            {/* Tour Row 1 */}
            <div className="py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-[#0c0b0a]/40 px-6 transition-all duration-300 rounded-lg">
              <div className="flex items-center gap-8 col-a">
                <div className="w-16 h-16 bg-[#161412] border border-gold/20 rounded-lg flex flex-col items-center justify-center text-gold font-mono-only">
                  <span className="text-[9px] uppercase tracking-widest font-sans">OCT</span>
                  <span className="text-xl font-serif font-bold text-white">14</span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-xl md:text-2xl text-white tracking-wide">Johannesburg, South Africa</h3>
                  <p className="text-zinc-500 font-sans text-xs flex items-center gap-1.5 uppercase tracking-widest">
                    <MapPin className="w-3.5 h-3.5 text-gold-dark" />
                    Constitution Hill Amphitheatre
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <span className="text-zinc-400 font-mono text-[9px] tracking-[0.25em] uppercase hidden lg:block border border-zinc-800 px-3 py-1.5 rounded">RITUAL 01</span>
                <a 
                  href="https://computicket.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gold text-black hover:bg-white text-[10px] font-sans tracking-[0.25em] font-extrabold px-6 py-3.5 rounded-lg uppercase transition-all duration-300 shadow-lg border border-gold/10"
                >
                  ACQUIRE TICKET
                </a>
              </div>
            </div>

            {/* Tour Row 2 */}
            <div className="py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-[#0c0b0a]/40 px-6 transition-all duration-300 rounded-lg">
              <div className="flex items-center gap-8 col-a">
                <div className="w-16 h-16 bg-[#161412] border border-gold/20 rounded-lg flex flex-col items-center justify-center text-gold font-mono-only">
                  <span className="text-[9px] uppercase tracking-widest font-sans">NOV</span>
                  <span className="text-xl font-serif font-bold text-white">02</span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-xl md:text-2xl text-white tracking-wide">London, United Kingdom</h3>
                  <p className="text-zinc-500 font-sans text-xs flex items-center gap-1.5 uppercase tracking-widest">
                    <MapPin className="w-3.5 h-3.5 text-gold-dark" />
                    KOKO Camden
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <span className="text-zinc-400 font-mono text-[9px] tracking-[0.25em] uppercase hidden lg:block border border-zinc-800 px-3 py-1.5 rounded">RITUAL 02</span>
                <a 
                  href="https://ticketmaster.co.uk" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gold text-black hover:bg-white text-[10px] font-sans tracking-[0.25em] font-extrabold px-6 py-3.5 rounded-lg uppercase transition-all duration-300 shadow-lg border border-gold/10"
                >
                  ACQUIRE TICKET
                </a>
              </div>
            </div>

            {/* Tour Row 3 */}
            <div className="py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-[#0c0b0a]/40 px-6 transition-all duration-300 rounded-lg">
              <div className="flex items-center gap-8 col-a">
                <div className="w-16 h-16 bg-[#161412] border border-gold/20 rounded-lg flex flex-col items-center justify-center text-gold font-mono-only">
                  <span className="text-[9px] uppercase tracking-widest font-sans">DEC</span>
                  <span className="text-xl font-serif font-bold text-white">19</span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-xl md:text-2xl text-white tracking-wide">Lagos, Nigeria</h3>
                  <p className="text-zinc-500 font-sans text-xs flex items-center gap-1.5 uppercase tracking-widest">
                    <MapPin className="w-3.5 h-3.5 text-gold-dark" />
                    Eko Convention Centre
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <span className="text-zinc-400 font-mono text-[9px] tracking-[0.25em] uppercase hidden lg:block border border-zinc-800 px-3 py-1.5 rounded">RITUAL 03</span>
                <a 
                  href="https://tix.africa" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gold text-black hover:bg-white text-[10px] font-sans tracking-[0.25em] font-extrabold px-6 py-3.5 rounded-lg uppercase transition-all duration-300 shadow-lg border border-gold/10"
                >
                  ACQUIRE TICKET
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: STAY UPDATED */}
      <section id="subscribe" className="py-32 md:py-40 bg-[#0c0b0a] relative overflow-hidden border-t border-zinc-900/60">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-110 h-110 bg-gold-dark/15 rounded-full filter blur-[150px] pointer-events-none z-0"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-10">
          <div className="space-y-5">
            <span className="text-[10px] font-mono text-gold uppercase tracking-[0.4em] block">05 / COMMUNITY SECURE</span>
            <h2 className="text-5xl md:text-7xl font-serif font-light text-white leading-none">
              Stay in the <br />
              <span className="text-gold italic font-normal">Parian Cycle</span>
            </h2>
            <p className="text-zinc-400 font-serif italic text-base md:text-xl max-w-xl mx-auto leading-relaxed">
              Enlist your coordinates to secure first dispatches of vinyl pressings, exclusive design wear, and intimate club guestlists.
            </p>
          </div>

          <div className="flex justify-center max-w-2xl mx-auto p-2">
            <SignupForm sourceId="next-footer-portal" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0c0b0a] py-20 border-t border-zinc-900 relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left relative z-10">
          
          <div className="space-y-3">
            <h4 className="font-serif font-semibold tracking-[0.3em] text-white text-xl">CIZA</h4>
            <p className="text-xs text-zinc-600 font-mono tracking-widest uppercase">
              &copy; {new Date().getFullYear()} CIZA MUSIC. ENCODED WITH COMPOSURE.
            </p>
          </div>

          <div className="flex items-center gap-6" id="editorial-social-deck">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-11 h-11 border border-zinc-900 hover:border-gold text-zinc-500 hover:text-gold rounded-full flex items-center justify-center transition-all bg-[#12100e]/50"
              aria-label="Instagram Profile"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-11 h-11 border border-zinc-900 hover:border-gold text-zinc-500 hover:text-gold rounded-full flex items-center justify-center transition-all bg-[#12100e]/50"
              aria-label="YouTube Channel"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-11 h-11 border border-zinc-900 hover:border-gold text-zinc-500 hover:text-gold rounded-full flex items-center justify-center transition-all bg-[#12100e]/50"
              aria-label="X Profile"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a 
              href="https://spotify.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-11 h-11 border border-zinc-900 hover:border-gold text-zinc-500 hover:text-gold rounded-full flex items-center justify-center transition-all bg-[#12100e]/50"
              aria-label="Spotify Profile"
            >
              <Music className="w-4 h-4" />
            </a>
          </div>

          <div className="text-zinc-600 font-sans text-[10px] tracking-[0.35em] md:text-right space-y-2 uppercase">
            <span className="block text-zinc-500 font-extrabold">AN LVRN ARTIST FOUNDRY</span>
            <span className="block text-[8px] text-zinc-700">LOVE RENAISSANCE ALLIANCE</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
