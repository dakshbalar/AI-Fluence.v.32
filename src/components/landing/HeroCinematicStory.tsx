import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Code2, 
  Cpu, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  Layers,
  Shield,
  Zap,
  Flame,
  Trophy,
  CheckCircle2
} from "lucide-react";
import { AIFluenceLogo } from "../common/AIFluenceLogo";

export interface HeroCinematicStoryProps {
  onOpenAuth: (mode: "login" | "signup", preferredTrack?: string) => void;
  onSelectTrack?: (trackId: string) => void;
  onInstantExplore?: (trackId: string) => void;
}

export interface TrackItem {
  id: "dsa" | "generative_ai" | "ai_for_everyone";
  code: string;
  name: string;
  shortName: string;
  category: string;
  levelsCount: string;
  themeColor: string;
  accentBorder: string;
  accentGlow: string;
  accentBg: string;
  description: string;
  topics: string[];
}

export const MASTER_TRACKS: TrackItem[] = [
  {
    id: "generative_ai",
    code: "generative_ai",
    name: "Generative A.I",
    shortName: "Gen AI",
    category: "LLMs, Prompt Engineering, RAG & Fine-Tuning",
    levelsCount: "125 Levels",
    themeColor: "#38bdf8",
    accentBorder: "border-sky-500/50 hover:border-sky-400",
    accentGlow: "shadow-[0_0_25px_rgba(56,189,248,0.25)]",
    accentBg: "from-sky-950/40 via-blue-950/20 to-slate-900/60",
    description: "Master prompt engineering, vector embeddings, RAG architectures, LLM fine-tuning, and AI agents.",
    topics: ["Prompt Engineering", "RAG & Vectors", "LoRA Fine-Tuning", "Autonomous Agents"]
  },
  {
    id: "dsa",
    code: "dsa",
    name: "Data Structures & Algorithms",
    shortName: "DSA",
    category: "Algorithmic Engineering & LeetCode Mastery",
    levelsCount: "153 Levels",
    themeColor: "#c084fc",
    accentBorder: "border-purple-500/50 hover:border-purple-400",
    accentGlow: "shadow-[0_0_25px_rgba(192,132,252,0.25)]",
    accentBg: "from-purple-950/40 via-fuchsia-950/20 to-slate-900/60",
    description: "Master algorithmic patterns, two pointers, sliding window, trees, graphs, and dynamic programming.",
    topics: ["Two Pointers & Sliding Window", "Binary Trees & Graphs", "Dynamic Programming", "Bit Manipulation"]
  },
  {
    id: "ai_for_everyone",
    code: "ai_for_everyone",
    name: "AI for Everyone",
    shortName: "AI 101",
    category: "AI Foundations & Real-World Impact",
    levelsCount: "45 Lessons",
    themeColor: "#facc15",
    accentBorder: "border-amber-500/50 hover:border-amber-400",
    accentGlow: "shadow-[0_0_25px_rgba(250,204,21,0.25)]",
    accentBg: "from-amber-950/40 via-yellow-950/20 to-slate-900/60",
    description: "Demystify AI & ML paradigms, neural networks, multimodal vision/voice, ethics, and hands-on AI tools.",
    topics: ["Machine Learning Intuition", "Neural Networks", "Multimodal AI", "AI Ethics & Safety"]
  }
];

export const HeroCinematicStory: React.FC<HeroCinematicStoryProps> = ({
  onOpenAuth,
  onSelectTrack,
  onInstantExplore
}) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [selectedTrackId, setSelectedTrackId] = useState<string>("generative_ai");
  const [progress, setProgress] = useState<number>(0);
  const slideDuration = 6500; // ms per slide
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const slides = [
    {
      id: "hook",
      kicker: "THE PROBLEM WITH PASSIVE LEARNING",
      word: null,
      lead: "You explored the AI tools. Read the case studies. Attended the webinars.",
      subText: "But months later, the tools sit unused. The models never scaled. And nobody can explain what real AI engineering fluency actually looks like.",
      punchline: "You're not behind. You're just ready to build for real.",
      ctaText: "See How AIfluence Works",
      ctaAction: () => handleNext()
    },
    {
      id: "learn",
      kicker: "PILLAR 01 // DEEP SYSTEM ARCHITECTURES",
      word: "Learn.",
      lead: "Master the AI tools reshaping software and engineering.",
      subText: "Zero fluff. Understand how modern LLMs, vector search indices, and neural models think and execute. From prompt engineering patterns to full RAG pipelines.",
      punchline: "125 Guided Levels · Interactive Theory · Real Code Sandboxes",
      ctaText: "Explore Learn Tracks",
      ctaAction: () => onOpenAuth("signup", "generative_ai")
    },
    {
      id: "play",
      kicker: "PILLAR 02 // CODE ARENAS & LEADERBOARDS",
      word: "Play.",
      lead: "Gamified practice beats passive video tutorials every single time.",
      subText: "Conquer interactive code arenas, solve daily algorithmic quests, climb weekly division leagues, and earn prestige emblem shields with every level mastered.",
      punchline: "Live Test Runners · Daily Streaks · Boss Battles · Clan Leagues",
      ctaText: "Start Playing Free",
      ctaAction: () => onOpenAuth("signup", "dsa")
    },
    {
      id: "build",
      kicker: "PILLAR 03 // PRODUCTION-GRADE RIGOR",
      word: "Build.",
      lead: "Transform theoretical AI into production-ready intelligence.",
      subText: "Stop paying to experiment. Start building production agents, LoRA fine-tuning adapters, and high-performance DSA algorithms that solve real engineering bottlenecks.",
      punchline: "Production Deployments · Real Vector DBs · Scalable Architectures",
      ctaText: "Start Building Today",
      ctaAction: () => onOpenAuth("signup", "generative_ai")
    },
    {
      id: "tracks",
      kicker: "AVAILABLE PATHWAYS // 3 CORE TRACKS",
      word: null,
      lead: "Choose your pathway to AI fluency.",
      subText: "Every track features interactive slide units, built-in code compilers, AI tutors, and prestige achievement emblems.",
      punchline: null,
      ctaText: "Launch Selected Track",
      ctaAction: () => {
        if (onSelectTrack) onSelectTrack(selectedTrackId);
        onOpenAuth("signup", selectedTrackId);
      }
    }
  ];

  const totalSlides = slides.length;

  // Slide advancement loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
      return;
    }

    startTimeRef.current = Date.now() - (progress / 100) * slideDuration;

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentProgress = Math.min(100, (elapsed / slideDuration) * 100);
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        setActiveSlide((prev) => (prev + 1) % totalSlides);
        setProgress(0);
        startTimeRef.current = Date.now();
      } else {
        timerRef.current = requestAnimationFrame(tick);
      }
    };

    timerRef.current = requestAnimationFrame(tick);

    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [isPlaying, activeSlide, totalSlides]);

  const handleSelectSlide = (idx: number) => {
    setActiveSlide(idx);
    setProgress(0);
    startTimeRef.current = Date.now();
  };

  const handleNext = () => {
    handleSelectSlide((activeSlide + 1) % totalSlides);
  };

  const handlePrev = () => {
    handleSelectSlide((activeSlide - 1 + totalSlides) % totalSlides);
  };

  const currentSlideData = slides[activeSlide];

  // Render authentic medieval-modern shield emblems
  const renderEmblem = (trackId: string, isSmall = false) => {
    const size = isSmall ? "w-10 h-10" : "w-14 h-14";
    const iconSize = isSmall ? "w-5 h-5" : "w-7 h-7";

    if (trackId === "generative_ai") {
      return (
        <div className={`relative ${size} flex items-center justify-center shrink-0`}>
          <div className="absolute inset-0 rounded-full border border-sky-400/30 animate-[spin_20s_linear_infinite]" />
          <div className={`${size} rounded-2xl bg-gradient-to-b from-[#0369a1] via-[#075985] to-[#082f49] border-2 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.5),inset_0_1px_3px_rgba(255,255,255,0.4)] flex flex-col items-center justify-center relative overflow-hidden`}>
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            <Sparkles className={`${iconSize} text-sky-200 drop-shadow-[0_0_6px_#38bdf8]`} />
            <span className="text-[7px] font-mono font-black text-sky-100 uppercase tracking-widest absolute bottom-1">GEN AI</span>
          </div>
        </div>
      );
    }

    if (trackId === "dsa") {
      return (
        <div className={`relative ${size} flex items-center justify-center shrink-0`}>
          <div className="absolute inset-0 rounded-full border border-purple-400/30 animate-[spin_18s_linear_infinite]" />
          <div className={`${size} rounded-2xl bg-gradient-to-b from-[#7e22ce] via-[#6b21a8] to-[#3b0764] border-2 border-purple-400 shadow-[0_0_20px_rgba(192,132,252,0.5),inset_0_1px_3px_rgba(255,255,255,0.4)] flex flex-col items-center justify-center relative overflow-hidden`}>
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            <Code2 className={`${iconSize} text-purple-200 drop-shadow-[0_0_6px_#c084fc]`} />
            <span className="text-[7px] font-mono font-black text-purple-100 uppercase tracking-widest absolute bottom-1">DSA</span>
          </div>
        </div>
      );
    }

    // AI for Everyone
    return (
      <div className={`relative ${size} flex items-center justify-center shrink-0`}>
        <div className="absolute inset-0 rounded-full border border-amber-400/30 animate-[spin_15s_linear_infinite]" />
        <div className={`${size} rounded-2xl bg-gradient-to-b from-[#b45309] via-[#854d0e] to-[#451a03] border-2 border-amber-400 shadow-[0_0_20px_rgba(250,204,21,0.5),inset_0_1px_3px_rgba(255,255,255,0.4)] flex flex-col items-center justify-center relative overflow-hidden`}>
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
          <Cpu className={`${iconSize} text-amber-200 drop-shadow-[0_0_6px_#facc15]`} />
          <span className="text-[7px] font-mono font-black text-amber-100 uppercase tracking-widest absolute bottom-1">AI 101</span>
        </div>
      </div>
    );
  };

  return (
    <section className="relative w-full min-h-[90vh] lg:min-h-[92vh] bg-[#030712] text-white flex flex-col justify-between overflow-hidden select-none border-b border-white/10">
      {/* Ambient Cyber Grid & Glow Backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(43,140,251,0.12),transparent_70%)]" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: "48px 48px"
          }}
        />
      </div>

      {/* Top Bar Header */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AIFluenceLogo height={42} variant="blue" />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => handleSelectSlide(4)}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <span>3 Master Tracks</span>
            <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full font-mono font-bold">DSA • GenAI • 101</span>
          </button>

          <button
            onClick={() => onOpenAuth("login")}
            className="text-xs font-bold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl border border-white/10 hover:border-white/25 bg-white/5 transition-all cursor-pointer"
          >
            Sign In
          </button>

          <button
            onClick={() => onOpenAuth("signup")}
            className="text-xs font-extrabold text-white bg-gradient-to-r from-[#2b8cfb] to-[#1d4ed8] hover:from-[#3b9bff] hover:to-[#2563eb] px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(43,140,251,0.4)] cursor-pointer active:scale-95"
          >
            Get Started Free
          </button>
        </div>
      </header>

      {/* Main Kinetic Slide Stage */}
      <div className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-6 md:px-12 flex flex-col justify-center py-8 md:py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideData.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 md:space-y-8"
          >
            {/* Slide Kicker */}
            <div className="inline-flex items-center gap-2 text-[11px] font-mono font-black tracking-widest text-sky-400 uppercase">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span>{currentSlideData.kicker}</span>
            </div>

            {/* 3 Main Kinetic Words Animation: LEARN • PLAY • BUILD */}
            {currentSlideData.word && (
              <motion.h1 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
              >
                {currentSlideData.word === "Learn." && (
                  <span>Learn<span className="text-[#2b8cfb]">.</span></span>
                )}
                {currentSlideData.word === "Play." && (
                  <span>Play<span className="text-purple-400">.</span></span>
                )}
                {currentSlideData.word === "Build." && (
                  <span>Build<span className="text-emerald-400">.</span></span>
                )}
              </motion.h1>
            )}

            {/* Slide Headline / Story Sentence */}
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-100 tracking-tight leading-tight max-w-3xl"
            >
              {currentSlideData.lead}
            </motion.h2>

            {/* Slide Narrative SubText */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-slate-400 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-2xl"
            >
              {currentSlideData.subText}
            </motion.p>

            {/* Punchline or Track Cards Area */}
            {currentSlideData.id === "tracks" ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
              >
                {MASTER_TRACKS.map((trk) => {
                  const isSelected = selectedTrackId === trk.id;
                  return (
                    <button
                      key={trk.id}
                      onClick={() => setSelectedTrackId(trk.id)}
                      className={`relative p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer overflow-hidden group flex flex-col justify-between ${
                        isSelected 
                          ? `${trk.accentBorder} bg-gradient-to-b ${trk.accentBg} ${trk.accentGlow} scale-[1.02]`
                          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        {renderEmblem(trk.id, true)}
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/15">
                          {trk.levelsCount}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="text-base font-black text-white group-hover:text-sky-300 transition-colors">
                          {trk.name}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {trk.description}
                        </p>
                      </div>

                      <div className="pt-4 flex items-center justify-between text-[11px] font-bold border-t border-white/10 mt-4">
                        <span className="text-slate-400">{trk.topics[0]}</span>
                        <span style={{ color: trk.themeColor }} className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          {isSelected ? "Selected ✓" : "Select Track →"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            ) : (
              currentSlideData.punchline && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.2 }}
                  className="flex items-center gap-2.5 text-xs md:text-sm font-semibold text-sky-300 bg-sky-950/40 border border-sky-800/40 rounded-xl px-4 py-2.5 w-fit"
                >
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{currentSlideData.punchline}</span>
                </motion.div>
              )
            )}

            {/* Action Button Row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.25 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button
                onClick={currentSlideData.ctaAction}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#2b8cfb] to-[#1d4ed8] hover:from-[#3b9bff] hover:to-[#2563eb] text-white font-black text-sm uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(43,140,251,0.5)] transition-all active:scale-95 cursor-pointer"
              >
                <span>{currentSlideData.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {activeSlide < 4 && (
                <button
                  onClick={() => handleSelectSlide(4)}
                  className="px-5 py-3.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Jump to 3 Tracks
                </button>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Kinetic Story Progress & Controls (Inspired by MP4 Video) */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 pb-6 pt-4">
        {/* Continuous Fill Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-[#2b8cfb] via-sky-400 to-emerald-400 transition-all duration-75"
            style={{ width: `${((activeSlide + progress / 100) / totalSlides) * 100}%` }}
          />
        </div>

        {/* Step Navigation & Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Step markers */}
          <div className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto py-1">
            {slides.map((s, idx) => {
              const isActive = activeSlide === idx;
              const isPast = activeSlide > idx;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectSlide(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-[0_0_10px_rgba(56,189,248,0.2)]"
                      : isPast
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-600 hover:text-slate-400"
                  }`}
                >
                  <span className="opacity-60 mr-1.5">0{idx + 1}</span>
                  <span className="capitalize">{s.id}</span>
                </button>
              );
            })}
          </div>

          {/* Player controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
              title={isPlaying ? "Pause auto-slide" : "Play auto-slide"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handlePrev}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
              title="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
              title="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </section>
  );
};
