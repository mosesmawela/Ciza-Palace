import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { 
  Instagram, 
  Youtube, 
  Twitter, 
  Music, 
  Mail, 
  User, 
  CheckCircle, 
  AlertCircle, 
  MapPin, 
  ChevronRight, 
  Compass, 
  ArrowUpRight,
  Globe,
  Sparkles,
  Bookmark,
  Sun,
  Moon,
  Play,
  ArrowRight,
  Tv,
  Headphones,
  Check,
  Sliders,
  Settings,
  X,
  Heart,
  Radio,
  Zap,
  Disc,
  Info
} from "lucide-react";
import ChapterMenu from "./components/ChapterMenu";

// Static premium assets
const ancientStatue = "/src/assets/images/ciza_roman_gold_1781179874045.png";

// ==========================================
// 1. REUSABLE TRACING BEAM BORDER
// ==========================================
export function BorderBeam({ 
  color = "var(--gold-accent)", 
  duration = 6, 
  opacity = 0.85 
}: { 
  color?: string; 
  duration?: number; 
  opacity?: number; 
}) {
  return (
    <div className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden z-20">
      <svg className="absolute inset-0 w-full h-full" width="100%" height="100%" style={{ overflow: "visible" }}>
        <rect
          rx="12"
          ry="12"
          className="w-full h-full fill-none stroke-2 animate-beam-path"
          style={{
            stroke: color,
            strokeWidth: 1.5,
            strokeDasharray: "90, 280",
            animation: `borderBeam ${duration}s linear infinite`,
            opacity,
          }}
        />
      </svg>
    </div>
  );
}

// ==========================================
// 2. INFINITE SCROLLING CUSTOM MARQUEE
// ==========================================
export function InfiniteScrollMarquee({ 
  items, 
  speed = 22, 
  direction = "left", 
  pauseOnHover = true 
}: { 
  items: string[]; 
  speed?: number; 
  direction?: "left" | "right"; 
  pauseOnHover?: boolean; 
}) {
  return (
    <div className="relative w-full overflow-hidden py-5 border-y border-zinc-900/40 bg-card-bg/25 backdrop-blur-md z-15 flex group">
      {/* Editorial horizontal fades */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-clay-dark to-transparent z-20 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-clay-dark to-transparent z-20 pointer-events-none"></div>

      <div 
        className="flex whitespace-nowrap min-w-full shrink-0 gap-16 py-1 select-none"
        style={{
          animation: `marquee-horizontal ${speed}s linear infinite ${direction === "right" ? "reverse" : ""}`,
        }}
      >
        {items.concat(items).concat(items).map((item, idx) => (
          <span key={idx} className="flex-shrink-0 text-xs md:text-sm font-sans tracking-[0.4em] uppercase font-bold text-gold-light hover:text-white transition-colors duration-300 flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-gold rounded-full inline-block"></span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 3. ENTER VIEW REVEAL ANIMATOR (Scroll-based staggered columns)
// ==========================================
export function ScrollReveal({ 
  children, 
  delay = 0, 
  yOffset = 30 
}: { 
  children: React.ReactNode; 
  delay?: number; 
  yOffset?: number; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// 4. PREMIUM EDITORIAL TYPOGRAPHY REVEALER
// ==========================================
export function RevealText({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={`inline-block overflow-hidden py-1 ${className}`}>
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          className="inline-block mr-3"
          initial={{ y: "105%", opacity: 0, filter: "blur(4px)" }}
          whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}



// ==========================================
// 5. SECURE SIGNUP FOR DISCIPLES (With coordinates capture)
// ==========================================
function AntiqueForm({ sourceId }: { sourceId: string }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [alignedHz, setAlignedHz] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (emailStr: string) => {
    return emailStr.includes("@") && emailStr.split("@")[1]?.includes(".");
  };

  const handleInputFocus = () => {
    // Elegant silent focus response
  };

  const detectCoordinates = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setCoordinates("-26.2041° S, 28.0473° E"); // Standard Johannesburg roots
      setAlignedHz(528);
      return;
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const formatted = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`;
        setCoordinates(formatted);
        
        // Formulate a beautiful corresponding Solfeggio frequency for visualizer alignment
        const computed = Math.round(((Math.abs(lat) * 7.5) + (Math.abs(lng) * 4.2)) % 300) + 380;
        setAlignedHz(computed);
        setDetecting(false);
      },
      (error) => {
        console.warn("Geolocation blocked, setting archetypal South African roots:", error);
        // Fallback to beautiful default Johannesburg coordinates matching CIZA's hometown
        setCoordinates("26.2041° S, 28.0473° E");
        setAlignedHz(432);
        setDetecting(false);
      },
      { timeout: 7000 }
    );
  };

  // When manual field coordinates change, compute a placeholder Hz
  const handleCoordinatesChange = (val: string) => {
    setCoordinates(val);
    if (val.trim()) {
      const len = val.trim().length;
      setAlignedHz(400 + (len * 8) % 300);
    } else {
      setAlignedHz(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setStatus("error");
      setErrorMessage("An email registration is required.");
      return;
    }

    if (!validateEmail(email)) {
      setStatus("error");
      setErrorMessage("Kindly enter a valid electronic mail address.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          name: name.trim(),
          coordinates: coordinates.trim() || undefined
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "An error occurred. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage("Network disruption. Connection failed.");
    }
  };

  if (status === "success") {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-full bg-[#12100e] border border-gold/40 p-10 rounded-xl text-center shadow-3xl relative overflow-hidden"
        id={`${sourceId}-success-panel`}
      >
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-gold-dark via-gold to-gold-light"></div>
        <div className="flex justify-center mb-5 text-gold">
          <motion.div
            initial={{ scale: 0.5, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.1 }}
          >
            <CheckCircle className="w-14 h-14 stroke-[1]" />
          </motion.div>
        </div>
        <h3 className="text-3xl font-serif text-white font-medium mb-3 tracking-wide">Initiate Enlisted.</h3>
        <p className="text-zinc-400 font-serif italic text-sm max-w-sm mx-auto leading-relaxed mb-4">
          Welcome to the new chapter of African electronic composition. Your coordinate correspondence ({coordinates || "General Planetwide Grid"}) has been written upon our golden scrolls.
         </p>
         {alignedHz && (
           <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/5 border border-gold/20 rounded text-[9px] font-mono text-gold uppercase tracking-widest">
             <Radio className="w-3.5 h-3.5 animate-pulse" />
             Aligned Resonance: {alignedHz} Hz
           </div>
         )}
      </motion.div>
    );
  }

  return (
    <div className="w-full relative p-1" id={`${sourceId}-form-container`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 pointer-events-none">
              <User className="w-4 h-4 stroke-[1.5]" />
            </span>
            <input
              type="text"
              placeholder="YOUR NOM DE PLUME (Optional)"
              value={name}
              onFocus={handleInputFocus}
              onChange={(e) => setName(e.target.value)}
              disabled={status === "loading"}
              className="w-full bg-card-bg/60 border border-zinc-900 focus:border-gold text-white pl-10 pr-4 py-3.5 rounded-lg text-xs outline-none transition-all duration-300 placeholder-zinc-600 font-sans tracking-widest uppercase focus:ring-1 focus:ring-gold/20 animate-none"
              id={`${sourceId}-name`}
            />
          </div>

          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 pointer-events-none">
              <Mail className="w-4 h-4 stroke-[1.5]" />
            </span>
            <input
              type="email"
              placeholder="SECURE CORRESPONDENCE EMAIL"
              value={email}
              onFocus={handleInputFocus}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              className="w-full bg-card-bg/60 border border-zinc-900 focus:border-gold text-white pl-10 pr-4 py-3.5 rounded-lg text-xs outline-none transition-all duration-300 placeholder-zinc-600 font-sans tracking-widest uppercase focus:ring-1 focus:ring-gold/20 animate-none"
              id={`${sourceId}-email`}
              required
            />
          </div>

          <div className="relative group flex">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 pointer-events-none z-10">
              <MapPin className="w-4 h-4 stroke-[1.5]" />
            </span>
            <input
              type="text"
              placeholder="DISPATCH COORDINATES (E.G. LAT, LON)"
              value={coordinates}
              onFocus={handleInputFocus}
              onChange={(e) => handleCoordinatesChange(e.target.value)}
              disabled={status === "loading" || detecting}
              className="w-full bg-card-bg/60 border border-zinc-900 focus:border-gold text-white pl-10 pr-12 py-3.5 rounded-lg text-xs outline-none transition-all duration-300 placeholder-zinc-600 font-sans tracking-widest uppercase focus:ring-1 focus:ring-gold/20 animate-none-all"
              id={`${sourceId}-coordinates`}
            />
            <button
              type="button"
              onClick={detectCoordinates}
              disabled={detecting}
              className={`absolute right-1 top-1 bottom-1 px-3.5 rounded-md bg-gold/10 hover:bg-gold hover:text-black border border-gold/20 hover:border-gold text-[#dfba73] transition-all flex items-center justify-center cursor-pointer ${detecting ? "animate-pulse" : ""}`}
              title="Detect my current location coordinates"
            >
              {detecting ? (
                <svg className="animate-spin h-3.5 w-3.5 text-[#dfba73]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <Compass className="w-3.5 h-3.5 animate-none" />
              )}
            </button>
          </div>
        </div>

        {alignedHz && (
          <div className="flex items-center gap-2 p-2 bg-gold/5 border border-gold/10 rounded-lg max-w-fit animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-gold text-xs leading-none" />
            <span className="text-[9px] font-mono text-gold uppercase tracking-widest pr-1">
              SOLFEGGIO FREQUENCY ALIGNED TO LATEST COORDINATES: <b>{alignedHz} HZ</b>
            </span>
          </div>
        )}

        {status === "error" && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center text-amber-500 text-xs gap-1.5 font-sans tracking-wider"
            id={`${sourceId}-error`}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage.toUpperCase()}</span>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full relative group overflow-hidden bg-gradient-to-r from-gold-dark to-gold text-black hover:text-white font-sans font-bold tracking-[0.25em] text-xs uppercase py-4 rounded-lg transition-all duration-500 shadow-xl border border-gold/10 hover:shadow-gold/15 flex items-center justify-center gap-2 cursor-pointer"
          id={`${sourceId}-submit`}
        >
          {/* Animated Liquid Background Hover Transition */}
          <div className="absolute inset-0 bg-clay-dark translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
          
          <div className="relative z-10 flex items-center gap-2">
            {status === "loading" ? (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <>
                AUTHENTICATE SUBSCRIPTION & DISPATCH GEOMETRIES
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </div>
        </button>
      </form>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT ENTRY WITH REDUCED MOTION SUPPORT & UNICORN EFFECTS
// ==========================================
export default function App() {
  // Theme Toggle: "dark" or "light" (Dawn)
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  
  // Custom Cursor variables
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [hoverState, setHoverState] = useState<"none" | "hoverable" | "view" | "play" | "scroll" | "settings">("none");
  const [isMobile, setIsMobile] = useState<boolean>(true);

  // Secure Ticket Reservation States
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [selectedTicketShow, setSelectedTicketShow] = useState<any>(null);
  const [selectedTicketZone, setSelectedTicketZone] = useState<string>("528Hz Solfeggio Core VVIP");
  const [allocatedPassCode, setAllocatedPassCode] = useState<string>("");

  const handleAcquireTicketClick = (showName: string, showVenue: string, showDate: string) => {
    triggerTick();
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'CIZA-RIT-';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setAllocatedPassCode(code);
    setSelectedTicketShow({ name: showName, venue: showVenue, date: showDate });
    setTicketModalOpen(true);
  };

  // Track page scroll coordinates for storytelling parallax
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY, scrollYProgress } = useScroll();
  
  // Parallax calculations for statue, headers and side layers
  const yOrbs = useTransform(scrollY, [0, 800], [0, -90]);
  const statueScale = useTransform(scrollY, [0, 600], [1, 1.12]);
  const statueRotate = useTransform(scrollY, [0, 600], [0, 4]);
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 120]);

  // Cursor tracker setup
  useEffect(() => {
    const handleCheckTouchDevice = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches || "ontouchstart" in window);
    };
    handleCheckTouchDevice();

    const updateMousePos = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePos);
    window.addEventListener("resize", handleCheckTouchDevice);

    return () => {
      window.removeEventListener("mousemove", updateMousePos);
      window.removeEventListener("resize", handleCheckTouchDevice);
    };
  }, []);

  // Theme apply
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("theme-light");
    } else {
      root.classList.remove("theme-light");
    }
  }, [theme]);

  // Silent interaction trigger (sound removed for standard portfolio model)
  const triggerTick = () => {};

  // Constants
  const marqueeKeywords = [
    "Amapiano Roots", "Parian Marble Style", "Liquid Gold Synthetics", "LVRN Editorial Foundry",
    "MCMXCIV Era", "Solfeggio Sound Healing", "Electronic Monoliths", "Parioclay Sculptures", "Sartorial Audio Codes"
  ];

  return (
    <div className="bg-clay-dark text-text-secondary min-h-screen selection:bg-gold selection:text-black scroll-smooth overflow-x-hidden relative bg-grain transition-colors duration-700">
      
      {/* ==========================================
          A. CUSTOM CINEMATIC DESKTOP CURSOR (Magnetic feel)
          ========================================== */}
      {!isMobile && (
        <React.Fragment>
          {/* Main Reticle / Aura */}
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-50 flex items-center justify-center w-8 h-8 rounded-full border border-gold mix-blend-difference"
            animate={{
              x: mousePosition.x - 16,
              y: mousePosition.y - 16,
              scale: hoverState !== "none" ? 1.7 : 1,
              borderColor: hoverState !== "none" ? "var(--gold-accent-light)" : "var(--gold-accent)"
            }}
            transition={{ type: "spring", stiffness: 450, damping: 28, mass: 0.2 }}
          >
            {hoverState === "view" && (
              <span className="text-[6px] font-sans tracking-widest text-[#dfba73] font-black uppercase">SEE</span>
            )}
            {hoverState === "play" && (
              <span className="text-[6px] font-sans tracking-widest text-[#dfba73] font-black uppercase">PLAY</span>
            )}
          </motion.div>

          {/* Internal Core Dot */}
          <motion.div
            className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#dfba73] pointer-events-none z-50"
            style={{ backgroundColor: "var(--gold-accent)" }}
            animate={{
              x: mousePosition.x - 3,
              y: mousePosition.y - 3,
              scale: hoverState !== "none" ? 1.5 : 1
            }}
            transition={{ type: "spring", stiffness: 800, damping: 15 }}
          />
        </React.Fragment>
      )}

      {/* ==========================================
          B. VERTICAL STRUCTURAL EDITORIAL PARIAN GRIDLINES
          ========================================== */}
      <div className="absolute inset-y-0 left-0 right-0 pointer-events-none flex justify-between px-6 md:px-12 xl:px-24 z-0">
        <div className="w-[1px] h-full bg-grid-custom border-l border-grid-custom"></div>
        <div className="w-[1px] h-full bg-grid-custom border-l border-grid-custom hidden md:block"></div>
        <div className="w-[1px] h-full bg-grid-custom border-l border-grid-custom hidden xl:block"></div>
        <div className="w-[1px] h-full bg-grid-custom border-l border-grid-custom border-r"></div>
      </div>

      {/* ==========================================
          C. UNICORN STUDIO-STYLE BACKGROUND GRADIENT ORBS (Parallax motion)
          ========================================== */}
      <motion.div 
        style={{ y: yOrbs }} 
        className="fixed -top-48 -left-48 w-110 h-110 bg-gold-dark/5 rounded-full filter blur-[140px] pointer-events-none z-0"
      ></motion.div>
      <motion.div 
        style={{ y: useTransform(scrollY, [0, 1000], [0, 90]) }}
        className="fixed top-1/2 -right-48 w-110 h-110 bg-amber-900/5 rounded-full filter blur-[150px] pointer-events-none z-0"
      ></motion.div>
      <div className="fixed bottom-10 left-12 w-96 h-96 bg-gold/5 rounded-full filter blur-[130px] pointer-events-none z-0"></div>

      {/* Dynamic Parian Editorial Paper Clay Grain Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-30" 
        style={{
          opacity: 0.02,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* ==========================================
          D. FLOATING UTILITIES BAR (THEME sunrise switch)
          ========================================== */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Sunrise Theme Modeler */}
        <motion.button
          onClick={() => {
            setTheme(theme === "dark" ? "light" : "dark");
            triggerTick();
          }}
          whileHover={{ scale: 1.1, rotate: 18 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-full bg-card-bg/90 border border-gold/30 hover:border-gold shadow-2xl flex items-center justify-center text-[#dfba73] cursor-pointer backdrop-blur-md"
          title="Switch Parian solar theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </motion.button>
      </div>

      {/* ==========================================
          E. HEADER NAV BAR (Magnetic hover states)
          ========================================== */}
      <header className="fixed top-0 left-0 w-full z-40 bg-clay-dark/75 backdrop-blur-lg border-b border-border-custom transition-all duration-700">
        <div className="max-w-7xl mx-auto px-6 h-22 flex items-center justify-between">
          <a 
            href="#" 
            onClick={triggerTick}
            className="font-serif font-black text-2.5xl lg:text-3.5xl tracking-[0.25em] text-text-primary hover:text-gold transition-colors duration-500 relative group"
          >
            CIZA
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gold group-hover:w-full transition-all duration-500"></span>
          </a>
          
          <nav className="hidden md:flex items-center gap-10 text-[10px] font-sans tracking-[0.35em] uppercase font-bold text-[#dfba73]">
            {["about", "chapters", "music", "events", "subscribe"].map((item) => (
              <a 
                key={item}
                href={`#${item}`} 
                onMouseEnter={() => {
                  setHoverState("hoverable");
                  triggerTick();
                }}
                onMouseLeave={() => setHoverState("none")}
                className="relative hover:text-text-primary transition-colors duration-300 py-1 font-extrabold"
              >
                {item === "about" ? "BIO" : item === "chapters" ? "CHAPTERS" : item === "music" ? "SOUNDS" : item === "events" ? "TOUR" : "COMMUNITY"}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gold rounded-full scale-0 hover:scale-100 transition-transform duration-300" />
              </a>
            ))}
          </nav>
          
          <div>
            <motion.a 
              href="#subscribe" 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => triggerTick()}
              className="bg-card-bg/85 text-gold hover:text-clay-dark hover:bg-gold border border-gold-dark/40 hover:border-gold px-6 py-3.5 rounded text-[10px] font-sans uppercase tracking-[0.22em] font-extrabold transition-all duration-500 shadow-xl"
            >
              MEMBERSHIP
            </motion.a>
          </div>
        </div>
      </header>

      {/* ==========================================
          F. HERO PORTAL (With custom circle animations and text reveals)
          ========================================== */}
      <section className="relative min-h-screen flex items-center justify-center pt-22 px-6 md:px-12 xl:px-24">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center relative z-10 py-12">
          
          {/* Column A: Editorial typography reveals */}
          <div className="lg:col-span-7 space-y-10 order-2 lg:order-1 text-left">
            <ScrollReveal delay={0.1} yOffset={20}>
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-gold-dark/10 border border-gold/30 text-gold text-[10px] font-sans uppercase tracking-[0.22em] rounded-md shadow-2xl">
                <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                <span>Amapiano & Parian Aesthetic Hybrid</span>
              </div>
            </ScrollReveal>

            <div className="space-y-4">
              <span className="block text-zinc-500 font-mono text-[11px] tracking-[0.4em] uppercase">01 / ARCHETYPAL VOICE</span>
              <h1 className="font-serif font-light text-5xl md:text-8xl leading-[1.05] tracking-wide text-text-primary">
                <RevealText text="The New" /><br />
                <span className="text-gold italic font-normal">
                  <RevealText text="Solfeggio" />
                </span> Spirit
              </h1>
            </div>

            <ScrollReveal delay={0.3}>
              <p className="text-text-secondary font-serif italic text-base md:text-xl tracking-wide max-w-xl leading-relaxed font-light">
                "We take the rich clay of South African Amapiano logs, and sculpt it into the golden geometry of classical Europe." — Signed with Love Renaissance.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="space-y-6 pt-4">
                <div className="h-[1px] w-full bg-gradient-to-r from-gold/35 to-transparent"></div>
                <p className="text-zinc-500 font-sans text-[10px] tracking-[0.25em] uppercase font-bold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                  ENTER YOUR COORDINATES IN SCROLL FOR IMMINENT WORLD EXCLUSIONS
                </p>
                <div className="relative">
                  {/* Tracing border beam over the hero container inputs */}
                  <AntiqueForm sourceId="hero-portal" />
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Column B: Circular Parian Statue with Celestial Orbit and Expanding Outlines */}
          <div className="lg:col-span-5 flex justify-center order-1 lg:order-2 relative select-none">
            
            {/* Circle system component 1: concentric expanding rings */}
            <motion.div 
              animate={{ scale: [0.95, 1.1, 0.95], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full border border-gold/10 pointer-events-none z-0"
            />

            {/* Circle system component 2: spinning golden celestial orbit with orbiting node */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full border border-gold/15 animate-spin-slow pointer-events-none z-0">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_15px_rgba(223,186,115,0.8)]"></div>
              <div className="absolute bottom-16 right-16 w-1.5 h-1.5 rounded-full bg-gold-dark/40"></div>
            </div>

            {/* Circle system component 3: dashed orbit rotating opposite */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[132%] h-[132%] rounded-full border border-dashed border-[#dfba73]/10 animate-spin-reverse pointer-events-none z-0"></div>

            {/* Circle system component 4: Glowing core backdrop */}
            <div className="absolute inset-0 bg-radial-gradient from-gold-dark/10 via-transparent to-transparent animate-pulse-gentle rounded-full pointer-events-none"></div>

            {/* Main Statue Container with high-end hover zoom and parallax */}
            <motion.div 
              style={{ scale: statueScale, rotate: statueRotate }}
              onMouseEnter={() => {
                setHoverState("view");
                triggerTick();
              }}
              onMouseLeave={() => setHoverState("none")}
              className="relative w-80 h-80 md:w-100 md:h-100 rounded-full overflow-hidden border border-gold/30 shadow-[0_0_120px_rgba(223,186,115,0.1)] bg-card-bg hover:border-gold shadow-3xl transition-all duration-700 p-2.5 z-10 cursor-pointer"
            >
              {/* Tracing subtle inner beam inside statue */}
              <BorderBeam color="var(--gold-accent-light)" duration={8} opacity={0.5} />
              
              <div className="w-full h-full rounded-full overflow-hidden relative">
                <img 
                  src={ancientStatue} 
                  alt="Ancient Roman Gold Marble Bust CIZA" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover scale-102 hover:scale-110 transition-transform duration-1000 ease-out brightness-95 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-clay-dark via-transparent to-transparent opacity-60"></div>
              </div>
            </motion.div>

            {/* Absolute Label Overlay (Editorial Accent) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring", stiffness: 80 }}
              className="absolute -bottom-6 right-4 xl:-right-6 bg-card-bg border border-gold/30 px-6 py-4.5 rounded text-left hidden sm:block shadow-3xl z-20"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping"></span>
                <span className="block text-[8px] font-mono text-[#dfba73] tracking-[0.3em] uppercase">ANTIQUE PARIAN ARCHIVE</span>
              </div>
              <span className="block text-text-primary font-serif text-sm font-semibold tracking-wide">CIZA & LVRN PLATFORM v1.4</span>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ==========================================
          G. CONTINUOUS LOGOS & KEYWORDS MARQUEE (Amapiano & Luxury styling)
          ========================================== */}
      <section className="relative z-20 mt-12">
        <InfiniteScrollMarquee items={marqueeKeywords} speed={25} direction="left" />
      </section>

      {/* ==========================================
          H. THE PARIAN VISION / ABOUT (Scroll-driven storytelling with SVG noodle curves)
          ========================================== */}
      <section id="about" className="py-28 md:py-36 bg-card-bg/40 border-t border-border-custom relative overflow-hidden transition-all duration-700">
        
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-dark/5 filter blur-[100px] pointer-events-none z-0"></div>

        {/* Noodle connection line starts here, flowing downward towards music catalog */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-0.5 h-44 z-10 pointer-events-none hidden lg:block opacity-40">
          <svg className="w-full h-full" overflow="visible">
            <path
              d="M 0 0 C 80 50, -80 120, 0 176"
              fill="none"
              stroke="var(--gold-accent)"
              strokeWidth="2.5"
              className="animate-flow-noodle"
            />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center relative z-10">
          
          {/* Picture side */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <ScrollReveal delay={0.1}>
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-gold/40"></div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-gold/40"></div>
              
              {/* High-end hover card with glowing gold beam border and depth */}
              <motion.div 
                whileHover={{ y: -8, rotateX: 2, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative rounded-xl overflow-hidden bg-zinc-950 aspect-[4/5] group border border-zinc-900 shadow-3xl p-1.5"
              >
                <BorderBeam color="var(--gold-accent)" duration={7} opacity={0.8} />

                <div className="absolute inset-0 bg-gradient-to-tr from-clay-dark via-clay-dark/75 to-gold/15 opacity-80 group-hover:opacity-70 transition-opacity duration-700"></div>
                
                <div className="absolute inset-0 flex flex-col justify-between p-8 z-10">
                  <div className="flex justify-between items-start">
                    <Bookmark className="w-5 h-5 text-gold" />
                    <span className="font-sans text-[8px] text-[#dfba73] tracking-[0.25em] uppercase border border-gold/30 px-3 py-1 rounded bg-[#0c0b0a]/70">
                      LVRN OFFICIAL INTEL
                    </span>
                  </div>
                  <div>
                    <p className="font-serif font-black text-6xl text-neutral-100 tracking-wider">MCMXCIV</p>
                    <p className="font-sans text-[9px] text-[#dfba73] tracking-[0.25em] uppercase mt-2">CLASSIC PARIAN SCULPTURE MATRIX</p>
                  </div>
                </div>

                <img 
                  src="https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&q=80&w=800" 
                  alt="Classical Greek Sculpture Bust Background" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter grayscale contrast-125 opacity-15 group-hover:scale-108 transition-all duration-1000 ease-out"
                />
              </motion.div>
            </ScrollReveal>
          </div>

          {/* Copy side */}
          <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">
            <ScrollReveal delay={0.2}>
              <span className="text-[10px] font-mono text-gold uppercase tracking-[0.35em] block">02 / HISTORIC BLURB</span>
              <h2 className="text-4xl md:text-5.5xl font-serif font-light text-text-primary leading-tight">
                An Architectural Fusion of <br />
                <span className="text-gold italic font-normal">Amapiano Log Drums</span> & Luxury Design
              </h2>
            </ScrollReveal>
            
            <ScrollReveal delay={0.3}>
              <div className="space-y-6 text-text-secondary font-serif leading-relaxed text-sm md:text-base tracking-wide font-light">
                <p>
                  CIZA stands as the primary sculptor of modern electronic high-art. Shaking the foundations of the international music sphere, our aesthetic pairs the raw, syncopated soul of South African townships with the marble-cold precision of ancestral Europe.
                </p>
                <p>
                  In partnership with Atlanta-based creative studio <strong>LVRN (Love Renaissance)</strong>, CIZA is curating an immersive sound platform. This website is a premium secure vault for our global disciples—capturing coordinates to deliver luxury heavyweight physical audio records, golden wax-sealed concert invitations, and private performance telemetry directly.
                </p>
                
                <div className="border-l-2 border-gold pl-6 py-2.5 italic text-text-primary font-serif text-lg bg-[#12100e]/70 rounded-r shadow-inner">
                  "We speak in electronic waves, constructing a sanctuary where ancient stone and modern low frequencies unify."
                </div>
              </div>
            </ScrollReveal>

            {/* Premium Interactive Stat Grid */}
            <ScrollReveal delay={0.4}>
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-zinc-900/40">
                <div>
                  <h4 className="text-2xl md:text-3xl font-serif text-[#dfba73] font-light">64M+</h4>
                  <p className="text-[9px] font-sans tracking-widest uppercase text-zinc-500 mt-1">Solfeggio Frequencies played</p>
                </div>
                <div>
                  <h4 className="text-2xl md:text-3xl font-serif text-[#dfba73] font-light">120K</h4>
                  <p className="text-[9px] font-sans tracking-widest uppercase text-zinc-500 mt-1">Initiates enlisted</p>
                </div>
                <div>
                  <h4 className="text-2xl md:text-3xl font-serif text-[#dfba73] font-light">99.1%</h4>
                  <p className="text-[9px] font-sans tracking-widest uppercase text-zinc-500 mt-1">Parian precision index</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* ==========================================
          I. REVERSE MARQUEE DIRECTION AS TRANSITION BLOCK
          ========================================== */}
      <section className="relative z-20">
        <InfiniteScrollMarquee items={["MCMXCIV", "LOVE RENAISSANCE ALLIANCE", "CIZA SOUND CORP", "THE SPIRIT ARCHIVE"]} speed={18} direction="right" />
      </section>

      {/* ==========================================
          DYNAMIC 3D IMMERSIVE CHAPTER NAVIGATION (& Liquid Glass)
          ========================================== */}
      <ChapterMenu />

      {/* ==========================================
          J. AUDIO EMBEDS WITH TRACING BEAMS (Spotify, Apple & YouTube)
          ========================================== */}
      <section id="music" className="py-28 md:py-36 bg-clay-dark border-t border-border-custom relative transition-all duration-700">
        
        {/* Connection line coming in from Vision above */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-0.5 h-36 z-10 pointer-events-none hidden lg:block opacity-40">
          <svg className="w-full h-full" overflow="visible">
            <path
              d="M 0 0 C -120 40, 120 100, 0 144"
              fill="none"
              stroke="var(--gold-accent)"
              strokeWidth="2"
              className="animate-flow-noodle"
            />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-4">
            <ScrollReveal>
              <div>
                <span className="text-[10px] font-mono text-gold uppercase tracking-[0.35em] block">03 / AUDIO TELEMETRY</span>
                <h2 className="text-4xl md:text-5.5xl font-serif font-light tracking-wide text-text-primary mt-2">The Solfeggio Catalog</h2>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <p className="text-text-secondary font-sans text-xs max-w-sm tracking-wider uppercase leading-relaxed">
                Auditory classic monuments. Stream the official catalog of CIZA across global luxury streaming libraries.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Player block 1: Spotify Custom Traced Card */}
            <ScrollReveal delay={0.1}>
              <motion.div 
                whileHover={{ y: -10, rotateY: 1.5 }}
                className="bg-card-bg border border-zinc-900 rounded-xl p-6 flex flex-col h-full hover:border-[#dfba73]/40 hover:shadow-gold-dark/10 transition-all duration-500 relative group overflow-hidden"
              >
                {/* 1px glowing neon beam on card context */}
                <BorderBeam color="#dfba73" duration={8} opacity={0.7} />

                <div className="flex items-center justify-between mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-sans uppercase tracking-[0.2em] border border-emerald-500/15 rounded font-extrabold">
                    <Music className="w-3.5 h-3.5" />
                    Spotify Portal
                  </span>
                  <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-gold transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
                
                <div className="w-full flex-grow aspect-video bg-zinc-950 rounded-lg overflow-hidden flex items-center justify-center border border-zinc-900/80 relative">
                  <iframe 
                    style={{ borderRadius: "8px" }}
                    src="https://open.spotify.com/embed/playlist/37i9dQZF1DXc8f6F89H6gA?utm_source=generator" 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    allowFullScreen={false} 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    className="w-full h-full border-0 absolute inset-0 filter saturate-90 brightness-95"
                    loading="lazy"
                  ></iframe>
                </div>
                <div className="pt-4 flex items-center justify-between">
                  <p className="text-[10px] text-zinc-500 font-sans tracking-widest uppercase font-bold">
                    INDEX: AMAPIANO VASTNESS [S1]
                  </p>
                  <span className="text-[9px] font-sans uppercase text-[#dfba73] tracking-widest font-extrabold flex items-center gap-1">
                    <Headphones className="w-3 h-3" /> STREAM
                  </span>
                </div>
              </motion.div>
            </ScrollReveal>

            {/* Player block 2: Apple Music Custom Traced Card */}
            <ScrollReveal delay={0.2}>
              <motion.div 
                whileHover={{ y: -10, rotateY: -1.5 }}
                className="bg-card-bg border border-zinc-900 rounded-xl p-6 flex flex-col h-full hover:border-[#dfba73]/40 hover:shadow-gold-dark/10 transition-all duration-500 relative group overflow-hidden"
              >
                <BorderBeam color="#dfba73" duration={9} opacity={0.7} />

                <div className="flex items-center justify-between mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-400 text-[9px] font-sans uppercase tracking-[0.2em] border border-rose-500/15 rounded font-extrabold">
                    <Music className="w-3.5 h-3.5" />
                    Apple Music Portal
                  </span>
                  <a href="https://music.apple.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-gold transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
                
                <div className="w-full flex-grow aspect-video bg-zinc-950 rounded-lg overflow-hidden flex items-center justify-center border border-zinc-900 override-overflow relative">
                  <iframe 
                    allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" 
                    frameBorder="0" 
                    height="100%" 
                    style={{ width: "100%", maxWidth: "100%", overflow: "hidden", borderRadius: "8px" }} 
                    src="https://embed.music.apple.com/za/playlist/amapiano-lifestyle/pl.e697841e21b84742a0887df926c0dc89" 
                    className="w-full h-full border-0 absolute inset-0 filter saturate-90 brightness-95"
                    loading="lazy"
                  ></iframe>
                </div>
                <div className="pt-4 flex items-center justify-between">
                  <p className="text-[10px] text-zinc-500 font-sans tracking-widest uppercase font-bold">
                    INDEX: SYNCOPATED SOUL [S2]
                  </p>
                  <span className="text-[9px] font-sans uppercase text-[#dfba73] tracking-widest font-extrabold flex items-center gap-1">
                    <Headphones className="w-3 h-3" /> STREAM
                  </span>
                </div>
              </motion.div>
            </ScrollReveal>

            {/* Player block 3: YouTube Custom Traced Card */}
            <ScrollReveal delay={0.3}>
              <motion.div 
                whileHover={{ y: -10, rotateY: 1 }}
                className="bg-card-bg border border-zinc-900 rounded-xl p-6 flex flex-col h-full hover:border-[#dfba73]/40 hover:shadow-gold-dark/10 transition-all duration-500 relative group overflow-hidden"
              >
                <BorderBeam color="#dfba73" duration={7} opacity={0.7} />

                <div className="flex items-center justify-between mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/10 text-red-400 text-[9px] font-sans uppercase tracking-[0.2em] border border-red-500/15 rounded font-extrabold">
                    <Tv className="w-3.5 h-3.5" />
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
                    loading="lazy"
                  ></iframe>
                </div>
                <div className="pt-4 flex items-center justify-between">
                  <p className="text-[10px] text-zinc-500 font-sans tracking-widest uppercase font-bold">
                    INDEX: VISUAL KINETICS [S3]
                  </p>
                  <span className="text-[9px] font-sans uppercase text-[#dfba73] tracking-widest font-extrabold flex items-center gap-1">
                    <Play className="w-3 h-3" /> STREAM
                  </span>
                </div>
              </motion.div>
            </ScrollReveal>

          </div>

        </div>
      </section>

      {/* ==========================================
          K. TOUR DATES EXHIBITIONS (Staggered rows with parallax triggers)
          ========================================== */}
      <section id="events" className="py-28 md:py-36 bg-card-bg/40 border-t border-border-custom relative transition-all duration-700">
        
        {/* Glowing floating ambient element */}
        <div className="absolute right-10 top-20 w-72 h-72 bg-gold/5 rounded-full filter blur-[110px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-4">
            <ScrollReveal>
              <div>
                <span className="text-[10px] font-mono text-gold uppercase tracking-[0.35em] block">04 / PILGRIMAGE TOUR</span>
                <h2 className="text-4xl md:text-5.5xl font-serif font-light tracking-wide text-text-primary mt-2">Ritual Live Exhibitions</h2>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-text-secondary font-sans text-xs max-w-sm tracking-wider uppercase leading-relaxed">
                Join the electronic congregation in real physical time. Secure standard and VVIP credentials below.
              </p>
            </ScrollReveal>
          </div>

          <div className="border-t border-zinc-800/60 divide-y divide-zinc-800/60" id="events-exhibit-list">
            
            {/* Exhibition Row 1 */}
            <ScrollReveal delay={0.1}>
              <motion.div 
                whileHover={{ backgroundColor: "var(--color-grid-custom)", paddingLeft: "1.75rem" }}
                transition={{ duration: 0.3 }}
                className="py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-4 transition-all rounded-lg"
              >
                <div className="flex items-center gap-8">
                  <div className="w-18 h-18 bg-clay-dark border border-gold/30 rounded-lg flex flex-col items-center justify-center text-gold shadow-xl">
                    <span className="text-[9px] uppercase tracking-widest font-sans font-black">OCT</span>
                    <span className="text-2xl font-serif font-semibold text-text-primary">14</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif font-black text-2xl text-text-primary tracking-wide">Johannesburg, South Africa</h3>
                    <p className="text-text-secondary font-sans text-xs flex items-center gap-2 uppercase tracking-widest">
                      <MapPin className="w-4 h-4 text-gold" />
                      Constitution Hill Amphitheatre
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <span className="text-zinc-500 font-sans text-[9px] tracking-[0.3em] uppercase hidden lg:block border border-zinc-800/80 px-4 py-2.5 rounded bg-clay-dark/30">
                    RITUAL STATUS: ACT_01
                  </span>
                  <motion.button 
                    onClick={() => handleAcquireTicketClick("Johannesburg, South Africa", "Constitution Hill Amphitheatre", "OCT 14")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => triggerTick()}
                    className="bg-gold text-black hover:bg-white text-[10px] font-sans tracking-[0.3em] font-extrabold px-8 py-4 rounded uppercase transition-all duration-300 shadow-xl border border-gold/15 cursor-pointer"
                  >
                    RESERVE ENTRY
                  </motion.button>
                </div>
              </motion.div>
            </ScrollReveal>

            {/* Exhibition Row 2 */}
            <ScrollReveal delay={0.2}>
              <motion.div 
                whileHover={{ backgroundColor: "var(--color-grid-custom)", paddingLeft: "1.75rem" }}
                transition={{ duration: 0.3 }}
                className="py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-4 transition-all rounded-lg"
              >
                <div className="flex items-center gap-8">
                  <div className="w-18 h-18 bg-clay-dark border border-gold/30 rounded-lg flex flex-col items-center justify-center text-gold shadow-xl">
                    <span className="text-[9px] uppercase tracking-widest font-sans font-black">NOV</span>
                    <span className="text-2xl font-serif font-semibold text-text-primary">02</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif font-black text-2xl text-text-primary tracking-wide">London, United Kingdom</h3>
                    <p className="text-text-secondary font-sans text-xs flex items-center gap-2 uppercase tracking-widest">
                      <MapPin className="w-4 h-4 text-gold" />
                      KOKO Camden
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <span className="text-zinc-500 font-sans text-[9px] tracking-[0.3em] uppercase hidden lg:block border border-zinc-800/80 px-4 py-2.5 rounded bg-clay-dark/30">
                    RITUAL STATUS: ACT_02
                  </span>
                  <motion.button 
                    onClick={() => handleAcquireTicketClick("London, United Kingdom", "KOKO Camden", "NOV 02")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => triggerTick()}
                    className="bg-gold text-black hover:bg-white text-[10px] font-sans tracking-[0.3em] font-extrabold px-8 py-4 rounded uppercase transition-all duration-300 shadow-xl border border-gold/15 cursor-pointer"
                  >
                    RESERVE ENTRY
                  </motion.button>
                </div>
              </motion.div>
            </ScrollReveal>

            {/* Exhibition Row 3 */}
            <ScrollReveal delay={0.3}>
              <motion.div 
                whileHover={{ backgroundColor: "var(--color-grid-custom)", paddingLeft: "1.75rem" }}
                transition={{ duration: 0.3 }}
                className="py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-4 transition-all rounded-lg"
              >
                <div className="flex items-center gap-8">
                  <div className="w-18 h-18 bg-clay-dark border border-gold/30 rounded-lg flex flex-col items-center justify-center text-gold shadow-xl">
                    <span className="text-[9px] uppercase tracking-widest font-sans font-black">DEC</span>
                    <span className="text-2xl font-serif font-semibold text-text-primary">19</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif font-black text-2xl text-text-primary tracking-wide">Lagos, Nigeria</h3>
                    <p className="text-text-secondary font-sans text-xs flex items-center gap-2 uppercase tracking-widest">
                      <MapPin className="w-4 h-4 text-gold" />
                      Eko Convention Centre
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <span className="text-zinc-500 font-sans text-[9px] tracking-[0.3em] uppercase hidden lg:block border border-zinc-800/80 px-4 py-2.5 rounded bg-clay-dark/30">
                    RITUAL STATUS: ACT_03
                  </span>
                  <motion.button 
                    onClick={() => handleAcquireTicketClick("Lagos, Nigeria", "Eko Convention Centre", "DEC 19")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => triggerTick()}
                    className="bg-gold text-black hover:bg-white text-[10px] font-sans tracking-[0.3em] font-extrabold px-8 py-4 rounded uppercase transition-all duration-300 shadow-xl border border-gold/15 cursor-pointer"
                  >
                    RESERVE ENTRY
                  </motion.button>
                </div>
              </motion.div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ==========================================
          L. DISCIPLES MEMBERSHIP PROCESS STEPS (Noodles Connectors)
          ========================================== */}
      <section className="py-24 bg-card-bg/25 border-t border-border-custom relative overflow-hidden transition-all duration-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-mono text-gold uppercase tracking-[0.35em] block">05 / SACRED SYSTEM</span>
            <h2 className="text-4xl font-serif font-light text-text-primary mt-2">The Path of Initiation</h2>
            <p className="text-text-secondary text-xs font-sans tracking-wide uppercase mt-3">How coordinates materialize into real collectible art</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* SVG Noodles Curve 1: Linking Step 1 -> Step 2 */}
            <div className="absolute top-1/4 left-[30%] w-[15%] h-1 bg-transparent pointer-events-none z-0 hidden md:block">
              <svg className="w-full h-full" overflow="visible">
                <path d="M 0 0 Q 60 -20, 120 0" fill="none" stroke="var(--gold-accent)" strokeWidth="1.5" strokeDasharray="5,5" className="animate-flow-noodle" />
              </svg>
            </div>
            {/* SVG Noodles Curve 2: Linking Step 2 -> Step 3 */}
            <div className="absolute top-1/4 left-[64%] w-[15%] h-1 bg-transparent pointer-events-none z-0 hidden md:block">
              <svg className="w-full h-full" overflow="visible">
                <path d="M 0 0 Q 60 20, 120 0" fill="none" stroke="var(--gold-accent)" strokeWidth="1.5" strokeDasharray="5,5" className="animate-flow-noodle" />
              </svg>
            </div>

            {/* Step 1 */}
            <ScrollReveal delay={0.1}>
              <div className="bg-clay-dark border border-zinc-900 rounded-xl p-8 hover:border-gold/30 transition-all duration-500 relative group text-center">
                <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center text-[#dfba73] font-serif text-lg font-bold mx-auto mb-5 bg-[#12100e]">
                  I
                </div>
                <h4 className="font-serif text-lg text-text-primary font-semibold mb-2">Registry & Coordinate Sign</h4>
                <p className="text-zinc-500 font-serif italic text-xs leading-relaxed max-w-xs mx-auto">
                  Provide your correspondence name and address inside our secure bulletin gateway.
                </p>
              </div>
            </ScrollReveal>

            {/* Step 2 */}
            <ScrollReveal delay={0.2}>
              <div className="bg-clay-dark border border-zinc-900 rounded-xl p-8 hover:border-gold/30 transition-all duration-500 relative group text-center">
                <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center text-[#dfba73] font-serif text-lg font-bold mx-auto mb-5 bg-[#12100e]">
                  II
                </div>
                <h4 className="font-serif text-lg text-text-primary font-semibold mb-2">Authentic Chime Initiation</h4>
                <p className="text-zinc-500 font-serif italic text-xs leading-relaxed max-w-xs mx-auto">
                  A pure physical sound registers on your client browser, logging state cryptographically.
                </p>
              </div>
            </ScrollReveal>

            {/* Step 3 */}
            <ScrollReveal delay={0.3}>
              <div className="bg-clay-dark border border-zinc-900 rounded-xl p-8 hover:border-gold/30 transition-all duration-500 relative group text-center">
                <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center text-[#dfba73] font-serif text-lg font-bold mx-auto mb-5 bg-[#12100e]">
                  III
                </div>
                <h4 className="font-serif text-lg text-text-primary font-semibold mb-2">Gold Wax Physical Drops</h4>
                <p className="text-zinc-500 font-serif italic text-xs leading-relaxed max-w-xs mx-auto">
                  Heavyweight gold vinyl pressings and physical luxury garments are dispatched in private secrecy.
                </p>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ==========================================
          M. IMMERSIVE EXCLUSIVE BULLETIN GATEWAY
          ========================================== */}
      <section id="subscribe" className="py-32 md:py-44 bg-clay-dark relative overflow-hidden border-t border-border-custom transition-all duration-700">
        
        {/* Pulsing visual halo shield behind form */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-120 h-120 bg-gold-dark/10 rounded-full filter blur-[150px] pointer-events-none z-0"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-10">
          <div className="space-y-4">
            <ScrollReveal>
              <span className="text-[10px] font-mono text-gold uppercase tracking-[0.4em] block">06 / IMMERSIVE PORTAL</span>
              <h2 className="text-5xl md:text-8.5xl font-serif font-light text-text-primary leading-none">
                Stay in the <br />
                <span className="text-gold italic font-normal">Parian Cycle</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <p className="text-[#dfba73] font-serif italic text-base md:text-xl max-w-xl mx-auto leading-relaxed">
                Enlist your coordinates to secure priority dispatches of physical pressings, exclusive designer pieces, and secret club guestlists.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.3}>
            <div className="flex justify-center max-w-2xl mx-auto p-1 border border-gold/20 rounded-2xl bg-card-bg/60 backdrop-blur-xl relative overflow-hidden shadow-2xl">
              {/* Gold beam tracing around the final footer subscription input box */}
              <BorderBeam color="var(--gold-accent-light)" duration={8} opacity={1} />
              <div className="w-full p-4 md:p-8">
                <AntiqueForm sourceId="footer-portal" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ==========================================
          N. EDITORIAL FOOTER
          ========================================== */}
      <footer className="bg-clay-dark py-24 border-t border-border-custom relative transition-all duration-700">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left relative z-10">
          
          <div className="space-y-3">
            <h4 className="font-serif font-black tracking-[0.3em] text-text-primary text-2xl">CIZA</h4>
            <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
              &copy; {new Date().getFullYear()} CIZA MUSIC CORP. ENCODED WITH COMPOSURE & METALLIC MAJESTY.
            </p>
          </div>

          {/* Luxury Social deck */}
          <div className="flex items-center gap-6" id="editorial-social-deck">
            {[
              { icon: Instagram, url: "https://instagram.com", label: "Instagram" },
              { icon: Youtube, url: "https://youtube.com", label: "YouTube" },
              { icon: Twitter, url: "https://twitter.com", label: "Twitter" },
              { icon: Music, url: "https://spotify.com", label: "Spotify" }
            ].map((soc, idx) => (
              <motion.a 
                key={idx}
                href={soc.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                whileHover={{ scale: 1.15, y: -4, borderColor: "var(--gold-accent)" }}
                onMouseEnter={() => triggerTick()}
                className="w-12 h-12 border border-border-custom text-zinc-500 hover:text-gold rounded-full flex items-center justify-center transition-all bg-card-bg/40 shadow-xl"
                aria-label={`${soc.label} profile`}
              >
                <soc.icon className="w-4 h-4 stroke-[1.5]" />
              </motion.a>
            ))}
          </div>

          <div className="text-zinc-600 font-sans text-[10px] tracking-[0.35em] md:text-right space-y-2 uppercase font-semibold">
            <span className="block text-zinc-500 font-extrabold text-gold-light">AN LVRN ARTIST FOUNDRY</span>
            <span className="block text-[8px] text-zinc-500">LOVE RENAISSANCE ALLIANCE &copy;</span>
          </div>

        </div>
      </footer>

      {/* Interactive Tour Ticket Confirmation Overlay Modal */}
      <AnimatePresence>
        {ticketModalOpen && selectedTicketShow && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="max-w-md w-full bg-[#12100e] border border-gold/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl space-y-6 text-center"
            >
              <BorderBeam color="var(--gold-accent)" duration={7} opacity={0.7} />
              
              {/* Background ambient gold orb */}
              <div className="absolute -top-16 -left-16 w-40 h-40 bg-gold-dark/20 rounded-full filter blur-[70px] pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-gold-dark/25 rounded-full filter blur-[70px] pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => {
                  triggerTick();
                  setTicketModalOpen(false);
                }}
                className="absolute top-4 right-4 text-zinc-500 hover:text-gold transition-colors p-1 cursor-pointer"
                aria-label="Close ticket portal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Wax Seal / Crown Crest simulation */}
              <div className="mx-auto w-12 h-12 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-gold">
                <Sparkles className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-mono tracking-[0.4em] text-gold uppercase block">UNIVERSAL ENTRY PORTAL</span>
                <h3 className="text-2xl font-serif text-text-primary uppercase tracking-wider">Access Approved</h3>
                <p className="text-[10px] text-zinc-500 font-sans tracking-wide uppercase">Your physical attunement has been registered</p>
              </div>

              {/* Secure Pass Ticket Body */}
              <div className="bg-zinc-950/90 border border-zinc-900 rounded-lg p-5 text-left font-sans space-y-4 shadow-inner relative">
                
                {/* Horizontal dotted line divider helper */}
                <div className="absolute left-0 right-0 top-[60%] border-t border-dashed border-zinc-800" />
                {/* Left/Right circle notches for traditional ticket look */}
                <div className="absolute left-0 top-[60%] w-4 h-4 bg-[#12100e] rounded-full border border-zinc-800 -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute right-0 top-[60%] w-4 h-4 bg-[#12100e] rounded-full border border-zinc-800 translate-x-1/2 -translate-y-1/2" />

                <div className="space-y-1 relative z-10">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">NOMINEE DESIGNATE (HOLDER)</span>
                  <span className="text-sm font-serif font-semibold text-text-primary tracking-wide text-gold">
                    AUTHENTICATED DISCIPLE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 relative z-10 pb-6">
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">EXHIBITION VENUE</span>
                    <span className="text-[11px] text-text-primary uppercase font-bold tracking-wide">{selectedTicketShow.venue}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">SHOW TIME DATE</span>
                    <span className="text-[11px] text-text-primary uppercase font-bold tracking-wide">{selectedTicketShow.name} &bull; {selectedTicketShow.date}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-3 relative z-10">
                  <div className="space-y-1">
                    <label className="text-[8px] font-mono text-zinc-500 uppercase tracking-[0.15em] block">
                      FREQUENCY GATE ALIGNMENT SEAT
                    </label>
                    <select
                      value={selectedTicketZone}
                      onChange={(e) => {
                        triggerTick();
                        setSelectedTicketZone(e.target.value);
                      }}
                      className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 focus:border-gold/50 focus:outline-none text-[#dfba73] tracking-widest uppercase cursor-pointer"
                    >
                      <option value="528Hz Solfeggio Core VVIP">528Hz Solfeggio Core (Symphonic VVIP)</option>
                      <option value="432Hz Planetary Circle VIP">432Hz Planetary Circle (Premium VIP)</option>
                      <option value="639Hz Harmonic Gallery Standard">639Hz Harmonic Gallery (General Standard)</option>
                      <option value="741Hz Intuition Balcony Reserve">741Hz Intuition Balcony (Upper Tier Reserve)</option>
                    </select>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-zinc-900/65 w-full">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold">GATE PASSCODE</span>
                      <span className="text-xs font-mono font-black text-white">{allocatedPassCode}</span>
                    </div>
                    
                    {/* Simulated visual bar code printouts! */}
                    <div className="flex flex-col items-end">
                      <div className="text-[14px] leading-none font-mono text-zinc-500 tracking-[0.25em]">
                        ||||| | ||| || |||
                      </div>
                      <span className="text-[6px] font-mono text-zinc-600 block uppercase">ENCODED CREDENTIAL</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action dispatch buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    triggerTick();
                    window.print();
                  }}
                  className="w-full bg-gold hover:bg-white text-black text-[9px] font-sans tracking-[0.2em] font-extrabold py-3.5 rounded-lg uppercase transition-all duration-300 shadow-xl border border-gold/10 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5" /> PRINT ALIGNMENT RECEIPT
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerTick();
                    setTicketModalOpen(false);
                  }}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-[9px] font-sans tracking-[0.2em] font-extrabold py-3.5 rounded-lg uppercase transition-all duration-300 border border-zinc-800 cursor-pointer"
                >
                  DISMISS PORTAL
                </button>
              </div>

              <p className="text-[7px] text-zinc-600 font-mono tracking-widest uppercase">
                THIS SEAT ALLOCATION INFLUENCES YOUR BIOMAGNETIC SOUNDBATH ENCLOSURE POSITION.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
