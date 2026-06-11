import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  Sparkles, 
  Layers, 
  Shield, 
  Cpu, 
  Activity, 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  Globe, 
  ArrowUpRight 
} from "lucide-react";

// Chapter data structures matching the luxury aesthetic & user images/videos
export interface ChapterItem {
  id: number;
  label: string; // "Chapter 1", etc.
  title: string; // "Solfeggio Genesis"
  tagline: string; // "Organic Attunement"
  subText: string;
  badge: string;
  image: string;
  hzCode: string;
  difficulty: "COMMON" | "MEDIUM" | "BEYOND" | "CLASSIC";
  nodes: { name: string; position: string; active: boolean }[];
  liquidColor: string; // used for liquid glass backlight
}

const CHAPTERS: ChapterItem[] = [
  {
    id: 1,
    label: "Chapter 1",
    title: "Solfeggio Genesis",
    tagline: "Organic Attunement & Resonance",
    subText: "The initial electronic sanctuary pairing raw, syncopated Township low frequencies with organic 528Hz transformational layers.",
    badge: "GENESIS PORTAL",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
    hzCode: "528Hz ACTIVE",
    difficulty: "COMMON",
    nodes: [
      { name: "MAILBOX", position: "top-[25%] left-[15%]", active: true },
      { name: "SOLFEGGIO SET", position: "top-[40%] left-[30%]", active: true },
      { name: "ORGANIC WAVE", position: "bottom-[30%] right-[25%]", active: false }
    ],
    liquidColor: "from-amber-500/25 via-gold/15 to-transparent"
  },
  {
    id: 2,
    label: "Chapter 2",
    title: "Alliance & Backtracking",
    tagline: "Love Renaissance Core",
    subText: "Bespoke creative collaboration curated with Love Renaissance (LVRN), capturing deep sonic telemetry across heritage monuments.",
    badge: "LVRN ALLIANCE",
    image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=800",
    hzCode: "432Hz HARMONICAL",
    difficulty: "MEDIUM",
    nodes: [
      { name: "LVRN CO-DESIGN", position: "top-[20%] left-[45%]", active: true },
      { name: "BACKTRACKING", position: "bottom-[40%] left-[20%]", active: true },
      { name: "SOUND LEVEL", position: "bottom-[20%] right-[30%]", active: true }
    ],
    liquidColor: "from-rose-500/20 via-pink-600/10 to-transparent"
  },
  {
    id: 3,
    label: "Chapter 3",
    title: "The Sculptor Archive",
    tagline: "Ancestral Parian Clay Codes",
    subText: "We carving modern sound structures from ancestral stone blocks. Elegant orbit paths represent physical coordinate density.",
    badge: "PARIAN VAULT",
    image: "https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&q=80&w=800",
    hzCode: "639Hz COHESION",
    difficulty: "CLASSIC",
    nodes: [
      { name: "MCMXCIV CLAY", position: "top-[35%] left-[20%]", active: true },
      { name: "CONCENTRIC PATH", position: "top-[50%] right-[20%]", active: true },
      { name: "RESONANCE BUST", position: "bottom-[15%] left-[40%]", active: false }
    ],
    liquidColor: "from-yellow-600/25 via-amber-800/15 to-transparent"
  },
  {
    id: 4,
    label: "Chapter 4",
    title: "Secure Entry Geometry",
    tagline: "Biomagnetic Coordinates",
    subText: "Premium coordinate tracking system designed to authenticate global disciples and deliver physical records securely.",
    badge: "COORDINATE LOCK",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=800",
    hzCode: "741Hz INTUITION",
    difficulty: "BEYOND",
    nodes: [
      { name: "SECURE CORE", position: "top-[45%] left-[45%]", active: true },
      { name: "FIELD MATRIX", position: "top-[30%] right-[25%]", active: false },
      { name: "BIOMETRIC PORTAL", position: "bottom-[25%] left-[20%]", active: true }
    ],
    liquidColor: "from-emerald-500/20 via-teal-700/10 to-transparent"
  },
  {
    id: 5,
    label: "Chapter 5",
    title: "Field Medicine Waves",
    tagline: "Space Frequencies & Bypass",
    subText: "Dynamic real-time electromagnetic wave synthesis capturing deep atmospheric tracking logs for live immersive audio therapy.",
    badge: "SPACE HARMONICS",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    hzCode: "852Hz CELL REPAIR",
    difficulty: "BEYOND",
    nodes: [
      { name: "TRAJECTORY MAP", position: "top-[20%] left-[25%]", active: true },
      { name: "UAV SONIC", position: "top-[50%] right-[15%]", active: true },
      { name: "CLEAR PATH VECTORS", position: "bottom-[30%] left-[40%]", active: true }
    ],
    liquidColor: "from-blue-600/20 via-indigo-600/10 to-transparent"
  }
];

// Liquid Glass Card that tilts smoothly in 3D and features real-time glowing coordinate gleam tracking
function LiquidGlassCard({ 
  chapter, 
  isActive, 
  onSelect 
}: { 
  chapter: ChapterItem; 
  isActive: boolean; 
  onSelect: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [shineX, setShineX] = useState(50);
  const [shineY, setShineY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);

  // Smooth tilt calculation relative to card boundaries
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Position of cursor within the card limits from 0 to width/height
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Map coordinates to percentage for shine/glass gleam reflection
    const xPct = (mouseX / width) * 100;
    const yPct = (mouseY / height) * 100;
    setShineX(xPct);
    setShineY(yPct);

    // Map coordinates to degrees (-12deg to 12deg tilt limit for perfect 3D depth)
    const degX = ((mouseY - height / 2) / (height / 2)) * -12;
    const degY = ((mouseX - width / 2) / (width / 2)) * 12;

    setRotateX(degX);
    setRotateY(degY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
      }}
      className={`relative w-full aspect-[4/5] rounded-2.5xl cursor-pointer overflow-hidden transition-all duration-500 ease-out flex flex-col justify-between p-6 md:p-8 ${
        isActive 
          ? "border border-gold/45 bg-zinc-950/40 shadow-[0_22px_50px_rgba(0,0,0,0.85)]" 
          : "border border-zinc-900 bg-zinc-950/20 hover:border-gold/25 shadow-xl opacity-60 hover:opacity-100"
      }`}
    >
      {/* Dynamic Animated Liquid Backlight Behind the Glass Card */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-[inherit] pointer-events-none">
        <motion.div
          animate={{
            scale: isHovered ? [1.1, 1.3, 1.1] : [1, 1.15, 1],
            x: isHovered ? [0, 15, -10, 0] : [0, 10, 0],
            y: isHovered ? [0, -10, 15, 0] : [0, -5, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute inset-0 bg-gradient-to-tr ${chapter.liquidColor} filter blur-[60px] opacity-75`}
        />
        
        {/* Subtle grid elements representing the coordinate system of the video */}
        <div 
          className="absolute inset-0 opacity-[0.06] bg-repeat pointer-events-none" 
          style={{
            backgroundImage: `radial-gradient(circle, var(--gold-accent) 1px, transparent 1px)`,
            backgroundSize: "16px 16px"
          }}
        />
      </div>

      {/* Floating moving dynamic liquid glass gloss shine gloss overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300" 
        style={{
          opacity: isHovered ? 0.35 : 0.1,
          background: `radial-gradient(circle 180px at ${shineX}% ${shineY}%, rgba(255, 235, 180, 0.4) 0%, transparent 80%)`,
        }}
      />

      {/* Chapter Top Badges */}
      <div className="flex items-center justify-between relative z-10" style={{ transform: "translateZ(30px)" }}>
        <div className="flex items-center gap-1.5">
          <Sparkles className={`w-3.5 h-3.5 ${isActive ? "text-gold animate-pulse" : "text-zinc-500"}`} />
          <span className="font-serif italic text-xs md:text-sm text-text-primary tracking-wide">{chapter.label}</span>
        </div>
        <span className="font-sans text-[8px] tracking-[0.3em] text-[#dfba73] bg-zinc-950/85 border border-gold/20 px-2.5 py-1 rounded-full uppercase">
          {chapter.badge}
        </span>
      </div>

      {/* Abstract Constellation/Sacred Geometry Overlay Ring inside the card */}
      <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-gold/10 flex items-center justify-center pointer-events-none z-10">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border border-dashed border-[#dfba73]/15"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-5 rounded-full border border-double border-gold/5 flex items-center justify-center"
        >
          <div className="w-2 h-2 rounded-full bg-gold/15" />
        </motion.div>
        
        {/* Decorative Constellation Dots */}
        {chapter.nodes.map((node, i) => (
          <div 
            key={i} 
            className={`absolute w-1 h-1 rounded-full ${node.active ? "bg-gold animate-ping bg-opacity-75" : "bg-zinc-600"} `}
            style={{ 
              top: `${25 + (i * 25)}%`, 
              left: `${20 + (i * 20)}%` 
            }}
          />
        ))}
      </div>

      {/* Chapter Bottom Copy (Editorial glass elements) */}
      <div className="space-y-4 relative z-10 text-left" style={{ transform: "translateZ(45px)" }}>
        <div className="space-y-1">
          <span className="text-[9px] font-mono tracking-widest text-[#dfba73]/70 uppercase block">
            {chapter.hzCode}
          </span>
          <h3 className="text-xl md:text-2xl font-serif text-text-primary tracking-wide leading-tight group-hover:text-gold transition-colors">
            {chapter.title}
          </h3>
          <p className="text-[10px] text-zinc-400 font-sans tracking-wide uppercase">
            {chapter.tagline}
          </p>
        </div>

        {/* Level metrics bar */}
        <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3">
          <span className="text-[8px] font-mono tracking-wider text-zinc-500 uppercase flex items-center gap-1">
            <Layers className="w-3 h-3 text-zinc-600" /> RES_STAGE: {chapter.difficulty}
          </span>
          <span className="font-medium text-[8px] text-gold tracking-widest uppercase flex items-center gap-1 group-hover:underline">
            ENGAGE &rarr;
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Full immersive section containing interactive 3D perspective dashboard
export default function ChapterMenu() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeChapter = CHAPTERS[activeIndex];
  const [isRotating, setIsRotating] = useState(false);

  const handleNext = () => {
    if (isRotating) return;
    setIsRotating(true);
    setActiveIndex((prev) => (prev + 1) % CHAPTERS.length);
    setTimeout(() => setIsRotating(false), 600);
  };

  const handlePrev = () => {
    if (isRotating) return;
    setIsRotating(true);
    setActiveIndex((prev) => (prev - 1 + CHAPTERS.length) % CHAPTERS.length);
    setTimeout(() => setIsRotating(false), 600);
  };

  return (
    <section id="chapters" className="py-24 md:py-36 bg-[#0c0b0a] border-t border-border-custom relative overflow-hidden transition-all duration-700">
      
      {/* Background stars, grids and vector elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[8%] w-140 h-140 bg-[#dfba73]/5 rounded-full filter blur-[150px]" />
        <div className="absolute bottom-[10%] right-[5%] w-120 h-120 bg-rose-950/10 rounded-full filter blur-[160px]" />
        
        {/* Holographic Concentric Grid in extreme BG */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] border border-gold/5 rounded-full flex items-center justify-center">
          <div className="w-[650px] h-[650px] border border-dashed border-gold/5 rounded-full flex items-center justify-center animate-spin-slow">
            <div className="w-[450px] h-[450px] border border-gold/5 rounded-full flex items-center justify-center animate-spin-reverse">
              <div className="w-[280px] h-[280px] border border-dashed border-[#dfba73]/5 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Chapter Header Layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-20 gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold/10 text-gold text-[9px] font-sans tracking-[0.35em] uppercase border border-gold/20 rounded font-black">
              <Compass className="w-3.5 h-3.5 text-gold animate-spin-slow" />
              INTELLIGENT 3D COMPASS STAGE
            </span>
            <h2 className="text-4xl md:text-5.5xl font-serif font-light tracking-wide text-text-primary leading-tight">
              MCMXCIV <span className="text-gold italic font-normal">Chapters</span>
            </h2>
            <p className="text-[10px] text-zinc-500 font-sans tracking-[0.25em] uppercase block">
              02.1 / GEOMETRIC INTERACTIVE PORTAL
            </p>
          </div>
          <div className="max-w-md">
            <p className="text-text-secondary font-serif text-sm md:text-base leading-relaxed tracking-wide font-light">
              Rotate CIZA's digital multidimensional archive dynamically. Tap any chapter panel or use vectors to explore connected frequencies, coordinate systems, and sacred telemetry.
            </p>
          </div>
        </div>

        {/* Interactive 3D Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Glass Constellation Orbit & Telemetry Details */}
          <div className="lg:col-span-4 space-y-8 order-2 lg:order-1">
            
            <div className="backdrop-blur-2xl bg-zinc-950/60 border border-zinc-900 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              {/* Dynamic Inner Glass Glow Line */}
              <div className="absolute left-[15%] top-0 right-[15%] h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
              
              <div className="space-y-1.5 border-b border-zinc-900 pb-5">
                <span className="text-[8px] font-mono tracking-widest text-[#dfba73] uppercase font-bold block">
                  CHAPTER TELEMETRY
                </span>
                <h3 className="text-2xl font-serif text-text-primary font-light">
                  {activeChapter.title}
                </h3>
                <p className="text-xs text-zinc-400 font-sans uppercase tracking-wider italic">
                  &ldquo;{activeChapter.tagline}&rdquo;
                </p>
              </div>

              {/* Dynamic Holographic Vector map with points inside */}
              <div className="relative aspect-video w-full bg-zinc-950 border border-zinc-900/80 rounded-xl overflow-hidden p-4 flex flex-col justify-between">
                
                {/* Simulated Radar sweeping line */}
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-gold/30 to-transparent pointer-events-none"
                />

                <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
                  style={{
                    backgroundImage: `linear-gradient(rgba(184, 146, 75, 0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(184, 146, 75, 0.45) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                  }}
                />

                {/* Simulated Constellation Grid based on real-time node coordinates */}
                <div className="absolute inset-0 z-0">
                  <svg className="w-full h-full" overflow="visible">
                    <motion.path 
                      d="M 50 40 L 180 80 L 100 120 Z"
                      fill="none"
                      stroke="rgba(223, 186, 115, 0.15)"
                      strokeWidth="1"
                      className="animate-flow-noodle"
                    />
                  </svg>
                </div>

                {/* Coordinates labels */}
                <div className="flex justify-between items-start relative z-10">
                  <span className="font-mono text-[7px] text-zinc-500 uppercase">SYS_GRID_0{activeChapter.id}</span>
                  <span className="font-mono text-[7px] text-zinc-500 uppercase">{activeChapter.hzCode}</span>
                </div>

                {/* Floating Interactive Coordinates inside vector panel */}
                <div className="relative flex-grow flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={activeIndex}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="w-full h-full relative"
                    >
                      {activeChapter.nodes.map((node, idx) => (
                        <div 
                          key={idx} 
                          className={`absolute ${node.position} flex items-center gap-1.5`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${node.active ? "bg-gold" : "bg-neutral-700"} relative`}>
                            {node.active && <span className="absolute inset-0 rounded-full bg-gold animate-ping" />}
                          </span>
                          <span className="font-mono text-[7.5px] text-white tracking-widest bg-zinc-950/90 border border-zinc-900/80 px-1.5 py-0.5 rounded uppercase">
                            {node.name}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex justify-between items-end relative z-10 pt-2 border-t border-zinc-900/60">
                  <span className="font-mono text-[7px] text-zinc-600 uppercase">MATRIX ALIGNED IN REAL-TIME</span>
                  <Activity className="w-3 h-3 text-gold animate-pulse" />
                </div>
              </div>

              {/* Chapter Description Body */}
              <p className="text-zinc-400 font-serif text-[13px] leading-relaxed tracking-wider font-light">
                {activeChapter.subText}
              </p>

              {/* Command dispatch keys */}
              <div className="pt-2 flex gap-3">
                <button 
                  onClick={handlePrev}
                  className="flex-grow py-3 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-900 transition-colors cursor-pointer flex items-center justify-center gap-2 text-[10px] font-sans tracking-widest uppercase font-bold"
                >
                  <ChevronLeft className="w-4 h-4" /> REWIND
                </button>
                <button 
                  onClick={handleNext}
                  className="flex-grow py-3 px-4 rounded-xl bg-gold hover:bg-white text-black border border-gold/10 transition-colors cursor-pointer flex items-center justify-center gap-2 text-[10px] font-sans tracking-widest uppercase font-bold"
                >
                  FORWARD <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

          {/* Right Column: Dynamic Liquid Glass 3D Interactive Carousel */}
          <div className="lg:col-span-8 order-1 lg:order-2 space-y-8">
            
            {/* 3D Curved Perspective viewport */}
            <div className="relative flex flex-col items-center">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {/* Render three chapters in the immediate viewer ring: PREVIOUS, ACTIVE, NEXT */}
                {[
                  CHAPTERS[(activeIndex - 1 + CHAPTERS.length) % CHAPTERS.length],
                  CHAPTERS[activeIndex],
                  CHAPTERS[(activeIndex + 1) % CHAPTERS.length]
                ].map((chapter, i) => {
                  const isActive = chapter.id === activeChapter.id;
                  const isPrev = i === 0;
                  const isNext = i === 2;

                  return (
                    <motion.div
                      key={chapter.id}
                      animate={{
                        scale: isActive ? 1.03 : 0.95,
                        y: isActive ? 0 : 8,
                        z: isActive ? 80 : -50,
                      }}
                      transition={{ type: "spring", stiffness: 150, damping: 20 }}
                      className={`relative w-full ${isPrev || isNext ? "hidden md:block" : ""}`}
                    >
                      <LiquidGlassCard
                        chapter={chapter}
                        isActive={isActive}
                        onSelect={() => {
                          if (isPrev) handlePrev();
                          if (isNext) handleNext();
                        }}
                      />
                      
                      {/* Interactive navigational indicators underneath inactive cards */}
                      {!isActive && (
                        <div className="absolute inset-0 bg-transparent flex items-center justify-center z-20 pointer-events-none">
                          <span className="text-[7px] text-zinc-500 font-mono tracking-widest bg-zinc-950/90 border border-zinc-905 px-3 py-1.5 rounded-full uppercase scale-90 opacity-0 group-hover:opacity-100 transition-opacity">
                            {isPrev ? "TAP TO REWIND" : "TAP TO ADVANCE"}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Slider Dots Indicator */}
              <div className="flex items-center gap-2.5 mt-8 z-10">
                {CHAPTERS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                      activeIndex === idx 
                        ? "w-8 bg-gold" 
                        : "w-1.5 bg-zinc-800 hover:bg-zinc-600"
                    }`}
                    aria-label={`Show chapter ${idx + 1}`}
                  />
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
