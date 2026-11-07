import React, { useState, useMemo } from "react";
import { Search, X, BookOpen, Code2, Sparkles, ChevronRight, Layers, Bot, Zap, Flame, Play } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  getCurriculumForCourse,
  CurriculumTopicItem,
  CurriculumGradeItem,
} from "../../data/academyCurriculumData";
import { GENAI_SUBJECTS_MAP, GenAISubjectId } from "../../data/genaiCoursesData";
import { CornerStarsAndSmokeBackground } from "../onboarding-animations/shared/CornerStarsAndSmokeBackground";
import { 
  AIDEN_PROFILE, 
  LUMI_PROFILE, 
  VEX_PROFILE,
  AIDEN_CONFIG,
  LUMI_CONFIG,
  VEX_CONFIG
} from "../../data/characters";
import { AIfluenceAvatar } from "../avatar/AIfluenceAvatar";
import { CharacterMood } from "../../types/avatar";

interface AcademyCurriculumPageProps {
  courseId: string;
  courseName?: string;
  activeSectionNumber?: number;
  activeTrack?: "theory" | "questions";
  initialTrack?: "theory" | "questions";
  themeColor?: "purple" | "green" | "red" | "blue" | "cyan" | "emerald" | "amber" | "yellow";
  activeGenAISubject?: GenAISubjectId;
  onSelectGenAISubject?: (subjectId: GenAISubjectId) => void;
  onDone: () => void;
  onSelectSection?: (sectionNumber: number, track?: "theory" | "questions") => void;
  guidebookData?: {
    keyRules: { title: string; desc: string }[];
    syntaxSnippet: string;
    syntaxLanguage: string;
  };
}

export type MascotId = "aiden" | "lumi" | "vex";

export const AcademyCurriculumPage: React.FC<AcademyCurriculumPageProps> = ({
  courseId,
  courseName,
  activeSectionNumber = 1,
  activeTrack: currentActiveTrack = "questions",
  initialTrack,
  themeColor = "purple",
  activeGenAISubject = "prompt_engineering",
  onSelectGenAISubject,
  onDone,
  onSelectSection,
  guidebookData,
}) => {
  const [activeTab, setActiveTab] = useState<"theory" | "questions">(initialTrack || currentActiveTrack || "questions");
  const [selectedGenAISubject, setSelectedGenAISubject] = useState<GenAISubjectId>(activeGenAISubject);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showGuidebookCheatSheet, setShowGuidebookCheatSheet] = useState(false);
  const [showMentorHub, setShowMentorHub] = useState(false);

  // Default mascot based on course
  const defaultMascot: MascotId = useMemo(() => {
    const key = courseId.toLowerCase();
    if (key.includes("html") || key.includes("web") || key.includes("prompt")) return "lumi";
    if (key.includes("cpp") || key.includes("system") || key.includes("java")) return "vex";
    return "aiden";
  }, [courseId]);

  const [activeMascotId, setActiveMascotId] = useState<MascotId>(defaultMascot);
  const [mascotMood, setMascotMood] = useState<CharacterMood>("idle");
  const [activeTipType, setActiveTipType] = useState<"welcome" | "best" | "boss" | "strategy">("welcome");

  // Load curriculum configuration for the current active academy
  const curriculum = useMemo(() => {
    return getCurriculumForCourse(courseId, courseName, themeColor);
  }, [courseId, courseName, themeColor]);

  // AIfluence theme styling tokens (Cyber Glass, tactile 3D bevels, glows, accents)
  const themeStyles = useMemo(() => {
    switch (themeColor) {
      case "green":
        return {
          accentBg: "from-emerald-400 via-green-500 to-teal-600",
          shadowColor: "#064e3b",
          glow: "rgba(34, 197, 94, 0.45)",
          activeBorder: "border-emerald-400/80 border-b-emerald-700 shadow-[0_0_25px_rgba(34,197,94,0.35)]",
          pillBg: "bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-[0_0_12px_rgba(34,197,94,0.3)]",
          tabGlow: "shadow-[0_4px_16px_rgba(34,197,94,0.4)]",
          headerBadge: "text-emerald-400 border-emerald-400/30 bg-emerald-500/10",
        };
      case "red":
        return {
          accentBg: "from-rose-400 via-red-500 to-rose-700",
          shadowColor: "#881337",
          glow: "rgba(239, 68, 68, 0.45)",
          activeBorder: "border-rose-400/80 border-b-rose-700 shadow-[0_0_25px_rgba(239,68,68,0.35)]",
          pillBg: "bg-rose-500/20 text-rose-300 border-rose-400/50 shadow-[0_0_12px_rgba(239,68,68,0.3)]",
          tabGlow: "shadow-[0_4px_16px_rgba(239,68,68,0.4)]",
          headerBadge: "text-rose-400 border-rose-400/30 bg-rose-500/10",
        };
      case "blue":
      case "cyan":
        return {
          accentBg: "from-sky-400 via-cyan-500 to-blue-700",
          shadowColor: "#0e7490",
          glow: "rgba(6, 182, 212, 0.45)",
          activeBorder: "border-cyan-400/80 border-b-cyan-700 shadow-[0_0_25px_rgba(6,182,212,0.35)]",
          pillBg: "bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]",
          tabGlow: "shadow-[0_4px_16px_rgba(6,182,212,0.4)]",
          headerBadge: "text-cyan-400 border-cyan-400/30 bg-cyan-500/10",
        };
      case "emerald":
        return {
          accentBg: "from-emerald-400 via-green-500 to-teal-600",
          shadowColor: "#064e3b",
          glow: "rgba(34, 197, 94, 0.45)",
          activeBorder: "border-emerald-400/80 border-b-emerald-700 shadow-[0_0_25px_rgba(34,197,94,0.35)]",
          pillBg: "bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-[0_0_12px_rgba(34,197,94,0.3)]",
          tabGlow: "shadow-[0_4px_16px_rgba(34,197,94,0.4)]",
          headerBadge: "text-emerald-400 border-emerald-400/30 bg-emerald-500/10",
        };
      case "amber":
        return {
          accentBg: "from-amber-400 via-yellow-500 to-orange-600",
          shadowColor: "#78350f",
          glow: "rgba(245, 158, 11, 0.45)",
          activeBorder: "border-amber-400/80 border-b-amber-700 shadow-[0_0_25px_rgba(245,158,11,0.35)]",
          pillBg: "bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]",
          tabGlow: "shadow-[0_4px_16px_rgba(245,158,11,0.4)]",
          headerBadge: "text-amber-400 border-amber-400/30 bg-amber-500/10",
        };
      case "purple":
      default:
        return {
          accentBg: "from-purple-500 via-fuchsia-500 to-indigo-600",
          shadowColor: "#3b0764",
          glow: "rgba(168, 85, 247, 0.45)",
          activeBorder: "border-purple-400/80 border-b-purple-800 shadow-[0_0_25px_rgba(168,85,247,0.35)]",
          pillBg: "bg-purple-500/20 text-purple-300 border-purple-400/50 shadow-[0_0_12px_rgba(168,85,247,0.3)]",
          tabGlow: "shadow-[0_4px_16px_rgba(168,85,247,0.4)]",
          headerBadge: "text-purple-300 border-purple-400/30 bg-purple-500/10",
        };
    }
  }, [themeColor]);

  // Character Mascot Trio definitions
  const mascotTrio = useMemo(() => {
    return [
      {
        id: "aiden" as MascotId,
        name: "AIDEN",
        roleTitle: "Unit 01 — Learn",
        accent: "#00E5FF",
        profile: AIDEN_PROFILE,
        config: AIDEN_CONFIG,
        icon: <Bot className="w-4 h-4 text-cyan-400" />,
        badgeText: "INTUITION & DISCOVERY",
        badgeStyle: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
        ringColor: "ring-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.4)]",
        tips: {
          welcome: `Curiosity is our ultimate super-power! Dive into the ${curriculum.academyName} tracks below.`,
          best: "Start with foundational units first! Clean fundamentals make advanced algorithms feel intuitive.",
          boss: "Don't let tricky problem sets intimidate you. We'll trace the state step-by-step and conquer them together! 🚀",
          strategy: "Complete 1-2 units daily to maintain your streak fire and build deep muscle memory!"
        }
      },
      {
        id: "lumi" as MascotId,
        name: "LUMI",
        roleTitle: "Unit 02 — Create",
        accent: "#FF2A8D",
        profile: LUMI_PROFILE,
        config: LUMI_CONFIG,
        icon: <Zap className="w-4 h-4 text-pink-400" />,
        badgeText: "ARCHITECTURE & DESIGN",
        badgeStyle: "bg-pink-500/20 text-pink-300 border-pink-400/40",
        ringColor: "ring-pink-500 shadow-[0_0_15px_rgba(255,42,141,0.4)]",
        tips: {
          welcome: `Every software masterpiece is sculpted unit by unit. What elegant systems shall we design today? ✨`,
          best: "Focus on design patterns and architectural symmetry. Clean code is an art form! 💖",
          boss: "The hardest units just need creative refactoring. Look for the elegant pattern hiding in the constraints.",
          strategy: "Build small prototypes immediately after finishing each lesson to lock in your intuition ✨"
        }
      },
      {
        id: "vex" as MascotId,
        name: "VEX",
        roleTitle: "Unit 03 — Challenge",
        accent: "#FF0033",
        profile: VEX_PROFILE,
        config: VEX_CONFIG,
        icon: <Flame className="w-4 h-4 text-red-400" />,
        badgeText: "SYSTEMS & ADVERSARIAL",
        badgeStyle: "bg-red-500/20 text-red-300 border-red-500/40",
        ringColor: "ring-red-500 shadow-[0_0_15px_rgba(255,0,51,0.4)]",
        tips: {
          welcome: `Step into the arena! Let's see if your code can survive the ${curriculum.academyName} curriculum without crashing 🔥`,
          best: "Skip easy fluff. Jump into high-complexity units and prove your algorithms can handle edge cases ⚔️",
          boss: "Beware the final units! Zero tolerance for memory leaks, nested loops, or sloppy assumptions 😈",
          strategy: "Benchmark your solutions against adversarial test cases. Real coders write code that survives under pressure."
        }
      }
    ];
  }, [curriculum.academyName]);

  const activeMascot = useMemo(() => {
    return mascotTrio.find((m) => m.id === activeMascotId) || mascotTrio[0];
  }, [mascotTrio, activeMascotId]);

  const handleSwitchMascot = (id: MascotId) => {
    setActiveMascotId(id);
    setActiveTipType("welcome");
    if (id === "aiden") setMascotMood("wave");
    else if (id === "lumi") setMascotMood("idea");
    else setMascotMood("challenging");
    setTimeout(() => setMascotMood("idle"), 2400);
  };

  // Filter theory sections based on search query
  const filteredTheory = useMemo(() => {
    const list = curriculum.theoryTopics && curriculum.theoryTopics.length > 0
      ? curriculum.theoryTopics
      : curriculum.topics;
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        `${t.unitsCount} units`.includes(q) ||
        t.badgeSymbol.toLowerCase().includes(q)
    );
  }, [curriculum.theoryTopics, curriculum.topics, searchQuery]);

  // Filter questions sections based on search query
  const filteredQuestions = useMemo(() => {
    const list = curriculum.questionsTopics && curriculum.questionsTopics.length > 0
      ? curriculum.questionsTopics
      : curriculum.topics;
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        `${t.unitsCount} units`.includes(q) ||
        t.badgeSymbol.toLowerCase().includes(q)
    );
  }, [curriculum.questionsTopics, curriculum.topics, searchQuery]);

  const handleLaunchTheoryTopic = (topic: CurriculumTopicItem) => {
    if (onSelectSection) {
      onSelectSection(topic.sectionNumber || 1, "theory");
    }
    onDone();
  };

  const handleLaunchQuestionsTopic = (topic: CurriculumTopicItem) => {
    if (onSelectSection) {
      onSelectSection(topic.sectionNumber || 1, "questions");
    }
    onDone();
  };

  return (
    <div className="w-full min-h-screen relative z-10 flex flex-col bg-[#050811] pb-28 select-none text-left">
      {/* 1. ATMOSPHERIC COSMIC CORNER STARS & SMOKE (Main AIfluence Maps Backdrop) */}
      <CornerStarsAndSmokeBackground
        theme={themeColor}
        topStarsClassName="top-16"
        bottomStarsClassName="bottom-28"
      />

      {/* Subtle Ambient Radial Lighting for Glassmorphism Depth */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.06)_0%,transparent_40%)]" />

      {/* =========================================================================
          2. STICKY TOP HEADER BAR (AIfluence Glass 3D Style)
          Left: Tactile 3D Glass Close Button ('X')
          Center: Glowing Course Title & Academy Tag
          Right: Tactile 3D Glass Search Icon
          ========================================================================= */}
      <div className="w-full bg-[#080c16]/90 backdrop-blur-2xl border-b border-white/10 px-4 py-3 sticky top-0 z-30 flex items-center justify-between shadow-2xl">
        {/* Close Button - Glass 3D Tactile */}
        <button
          onClick={onDone}
          id="btn-curriculum-close"
          className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 shadow-[0_3px_0_rgba(0,0,0,0.5)] flex items-center justify-center text-slate-200 hover:text-white backdrop-blur-md active:translate-y-0.5 active:shadow-none transition-all cursor-pointer relative overflow-hidden group"
          title="Close Curriculum"
        >
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none rounded-t-xl" />
          <X className="w-5 h-5 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
        </button>

        {/* Course Title with Cyber Accent */}
        <div className="text-center truncate px-2">
          <span className={`text-[9px] font-mono font-black tracking-widest uppercase px-2 py-0.5 rounded-full border mb-0.5 inline-block ${themeStyles.headerBadge}`}>
            ACADEMY CURRICULUM
          </span>
          <h1 className="text-base sm:text-lg font-black text-white tracking-tight truncate drop-shadow-md">
            {courseName || curriculum.academyName}
          </h1>
        </div>

        {/* Search Button - Glass 3D Tactile */}
        <button
          onClick={() => {
            setIsSearchOpen((prev) => !prev);
            if (isSearchOpen) setSearchQuery("");
          }}
          id="btn-curriculum-search"
          className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-[0_3px_0_rgba(0,0,0,0.5)] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer backdrop-blur-md relative overflow-hidden group ${
            isSearchOpen || searchQuery
              ? "bg-cyan-500/30 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              : "bg-white/10 hover:bg-white/20 border-white/25 text-slate-200 hover:text-white"
          }`}
          title="Search Topics & Grades"
        >
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none rounded-t-xl" />
          <Search className="w-5 h-5 stroke-[2.5] group-hover:scale-110 transition-transform duration-200" />
        </button>
      </div>

      {/* =========================================================================
          SEARCH BAR DRAWER (AIfluence Glass Panel)
          ========================================================================= */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full bg-[#090e1a]/95 backdrop-blur-2xl border-b border-white/15 px-4 py-3 shrink-0 overflow-hidden z-20 shadow-xl"
          >
            <div className="relative flex items-center max-w-md mx-auto">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab === "theory" ? "theory topics" : "practice questions"}...`}
                autoFocus
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#060912] border-2 border-white/20 text-white text-sm font-bold placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 p-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          3. TACTILE 3D GLASS TABS / GENAI SUBJECT SELECTOR
          ========================================================================= */}
      <div className="w-full bg-[#080c16]/85 backdrop-blur-2xl border-b border-white/10 py-3 px-4 sticky top-[65px] z-20 shadow-md">
        {courseId === "generative_ai" ? (
          <div className="max-w-md mx-auto p-1.5 rounded-2xl bg-[#0a0f1d]/90 border border-white/20 backdrop-blur-xl shadow-inner grid grid-cols-3 gap-1.5">
            {(["prompt_engineering", "fine_tuning", "rag"] as GenAISubjectId[]).map((subjKey) => {
              const subj = GENAI_SUBJECTS_MAP[subjKey];
              const isSelected = selectedGenAISubject === subjKey;
              return (
                <button
                  key={subjKey}
                  onClick={() => {
                    setSelectedGenAISubject(subjKey);
                    onSelectGenAISubject?.(subjKey);
                  }}
                  className={`py-2 px-1.5 rounded-xl font-black text-xs tracking-wider transition-all relative overflow-hidden cursor-pointer flex items-center justify-center gap-1 select-none active:translate-y-0.5 ${
                    isSelected
                      ? "bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white border-2 border-white/40 shadow-[0_4px_16px_rgba(59,130,246,0.5),0_3px_0_#1d4ed8]"
                      : "text-slate-400 hover:text-white hover:bg-white/10 border border-transparent"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none rounded-t-xl" />
                  )}
                  <span className="text-sm relative z-10">{subj.badgeSymbol}</span>
                  <span className="relative z-10 font-sans font-black tracking-wider truncate">{subj.shortName}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="max-w-md mx-auto p-1.5 rounded-2xl bg-[#0a0f1d]/90 border border-white/20 backdrop-blur-xl shadow-inner grid grid-cols-2 gap-2">
            {/* Tab 1: THEORY */}
            <button
              onClick={() => setActiveTab("theory")}
              id="tab-theory"
              className={`py-2.5 px-4 rounded-xl font-black text-xs tracking-wider uppercase transition-all relative overflow-hidden cursor-pointer flex items-center justify-center gap-2 select-none active:translate-y-0.5 ${
                activeTab === "theory"
                  ? `bg-gradient-to-r ${themeStyles.accentBg} text-white border-2 border-white/40 shadow-[0_4px_16px_${themeStyles.glow},0_3px_0_${themeStyles.shadowColor}]`
                  : "text-slate-400 hover:text-white hover:bg-white/10 border border-transparent"
              }`}
            >
              {activeTab === "theory" && (
                <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none rounded-t-xl" />
              )}
              <BookOpen className="w-3.5 h-3.5 relative z-10 text-cyan-300" />
              <span className="relative z-10 font-sans font-black tracking-wider">THEORY</span>
            </button>

            {/* Tab 2: QUESTIONS */}
            <button
              onClick={() => setActiveTab("questions")}
              id="tab-questions"
              className={`py-2.5 px-4 rounded-xl font-black text-xs tracking-wider uppercase transition-all relative overflow-hidden cursor-pointer flex items-center justify-center gap-2 select-none active:translate-y-0.5 ${
                activeTab === "questions"
                  ? `bg-gradient-to-r ${themeStyles.accentBg} text-white border-2 border-white/40 shadow-[0_4px_16px_${themeStyles.glow},0_3px_0_${themeStyles.shadowColor}]`
                  : "text-slate-400 hover:text-white hover:bg-white/10 border border-transparent"
              }`}
            >
              {activeTab === "questions" && (
                <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none rounded-t-xl" />
              )}
              <Code2 className="w-3.5 h-3.5 relative z-10 text-purple-300" />
              <span className="relative z-10 font-sans font-black tracking-wider">QUESTIONS</span>
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          4. MAIN CONTENT LIST: AIfluence TACTILE 3D GLASS CARDS
          - Glassmorphism backdrop-blur surface
          - 3D tactile bottom bevel / shadow
          - Shiny top gloss reflection
          - Gem / Node Squircle Badge with gloss shine & crisp glyph
          - Tactile glass launch button on right
          ========================================================================= */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 pt-4 space-y-3.5">
        {/* --- GENAI SUBJECT CHAPTERS VIEW --- */}
        {courseId === "generative_ai" ? (
          <>
            {/* Subject Overview Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-indigo-950/60 border border-sky-400/30 text-left shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-xl shrink-0">
                  {GENAI_SUBJECTS_MAP[selectedGenAISubject].badgeSymbol}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-black text-white truncate">
                    {GENAI_SUBJECTS_MAP[selectedGenAISubject].name}
                  </h3>
                  <p className="text-xs text-sky-200/80 line-clamp-1">
                    {GENAI_SUBJECTS_MAP[selectedGenAISubject].tagline}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-400/40 shrink-0">
                  8 CHAPTERS
                </span>
              </div>
            </div>

            {/* 8 Chapters list */}
            {GENAI_SUBJECTS_MAP[selectedGenAISubject].sections
              .filter((section) => {
                if (!searchQuery.trim()) return true;
                const q = searchQuery.toLowerCase();
                return (
                  section.unitTitle.toLowerCase().includes(q) ||
                  section.unitDescription.toLowerCase().includes(q) ||
                  `chapter ${section.sectionNumber}`.includes(q)
                );
              })
              .map((section) => {
                const isActive =
                  activeSectionNumber === section.sectionNumber &&
                  activeGenAISubject === selectedGenAISubject;
                const lessonLevels = section.levels.filter((l) => l.type !== "chest");
                const previewTitles = lessonLevels.slice(0, 3).map((l) => l.title).join(" • ");

                return (
                  <div
                    key={section.sectionNumber}
                    onClick={() => {
                      onSelectGenAISubject?.(selectedGenAISubject);
                      onSelectSection?.(section.sectionNumber, "theory");
                      onDone();
                    }}
                    className={`w-full p-4 rounded-2xl backdrop-blur-xl transition-all duration-200 cursor-pointer flex items-center gap-4 relative overflow-hidden group border-2 active:translate-y-1 ${
                      isActive
                        ? "bg-gradient-to-br from-[#0e1d36]/95 via-[#0c182d]/90 to-[#071120]/95 border-sky-400/80 border-b-sky-700 shadow-[0_0_25px_rgba(56,189,248,0.35)] border-b-4"
                        : "bg-gradient-to-br from-[#0d1424]/90 via-[#0a0f1b]/85 to-[#060912]/90 hover:from-[#111b30]/90 hover:to-[#090e1a]/90 border-white/15 hover:border-white/30 border-b-4 border-b-[#050810] shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
                    }`}
                  >
                    {/* Top gloss */}
                    <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none rounded-t-2xl" />

                    {/* Chapter Badge */}
                    <div className="relative w-14 h-14 rounded-2xl shrink-0 flex flex-col items-center justify-center border-2 border-sky-300/40 shadow-[0_5px_0_rgba(0,0,0,0.5)] overflow-hidden group-hover:scale-105 active:scale-95 transition-all duration-200 bg-gradient-to-br from-sky-500 to-blue-700">
                      <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/45 via-white/15 to-transparent pointer-events-none rounded-t-xl" />
                      <span className="text-[10px] font-mono font-bold text-sky-200 uppercase tracking-tight">CH</span>
                      <span className="text-lg font-black text-white font-mono leading-none">{section.sectionNumber}</span>
                    </div>

                    {/* Middle: Title & Lessons preview */}
                    <div className="flex-1 min-w-0 text-left relative z-10">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-black text-white leading-tight tracking-tight group-hover:text-sky-200 transition-colors truncate">
                          {section.unitTitle}
                        </h3>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-[0_0_10px_rgba(52,211,153,0.4)] shrink-0 flex items-center gap-1 animate-pulse">
                            <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                            ACTIVE
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-sky-500/15 border border-sky-400/30 text-sky-300 backdrop-blur-md">
                          {lessonLevels.length} LESSONS
                        </span>
                        <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          {previewTitles}
                        </span>
                      </div>
                    </div>

                    {/* Right Action Button */}
                    <div className="shrink-0 relative z-10">
                      <div
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-200 active:translate-y-0.5 relative overflow-hidden group-hover:scale-105 ${
                          isActive
                            ? "bg-gradient-to-b from-sky-400 to-blue-600 border-white/40 text-white shadow-[0_3px_0_#0e7490]"
                            : "bg-white/10 group-hover:bg-white/20 border-white/20 text-slate-300 group-hover:text-white shadow-[0_3px_0_rgba(0,0,0,0.4)] backdrop-blur-md"
                        }`}
                      >
                        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-xl pointer-events-none" />
                        {isActive ? (
                          <Play className="w-4 h-4 fill-white stroke-none ml-0.5 drop-shadow" />
                        ) : (
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </>
        ) : (
          <>
            {/* --- THEORY TAB --- */}
            {activeTab === "theory" && (
          <>
            {filteredTheory.length === 0 ? (
              <div className="py-16 text-center text-slate-500">
                <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40 text-cyan-400" />
                <p className="font-bold text-sm text-slate-300">No theory sections matching "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-3 text-xs font-black text-cyan-400 uppercase tracking-wider hover:underline cursor-pointer"
                >
                  Clear Search Filter
                </button>
              </div>
            ) : (
              filteredTheory.map((topic) => {
                const isActive = currentActiveTrack === "theory" && activeSectionNumber === topic.sectionNumber;
                return (
                  <div
                    key={topic.id}
                    onClick={() => handleLaunchTheoryTopic(topic)}
                    className={`w-full p-4 rounded-2xl backdrop-blur-xl transition-all duration-200 cursor-pointer flex items-center gap-4 relative overflow-hidden group border-2 active:translate-y-1 ${
                      isActive
                        ? `bg-gradient-to-br from-[#0e1d36]/95 via-[#0c182d]/90 to-[#071120]/95 ${themeStyles.activeBorder} border-b-4`
                        : "bg-gradient-to-br from-[#0d1424]/90 via-[#0a0f1b]/85 to-[#060912]/90 hover:from-[#111b30]/90 hover:to-[#090e1a]/90 border-white/15 hover:border-white/30 border-b-4 border-b-[#050810] shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
                    }`}
                  >
                    {/* Shiny top gloss reflection overlay */}
                    <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none rounded-t-2xl" />

                    {/* Left Tactile 3D Glass Badge (learning map node gem) */}
                    <div
                      className="relative w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center border-2 border-white/40 shadow-[0_5px_0_rgba(0,0,0,0.5)] overflow-hidden group-hover:scale-105 active:scale-95 transition-all duration-200"
                      style={{
                        background: (topic.badgeBg && topic.badgeBg.startsWith("#"))
                          ? `linear-gradient(135deg, ${topic.badgeBg}, #0f172a)`
                          : (topic.badgeBg || "linear-gradient(135deg, #0284c7, #0f172a)"),
                        boxShadow: `0 6px 18px ${(topic.badgeBg || "#0284c7")}40, 0 4px 0 rgba(0,0,0,0.5)`
                      }}
                    >
                      {/* Top gloss reflection shine */}
                      <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/45 via-white/15 to-transparent pointer-events-none rounded-t-xl" />
                      {/* Bottom depth bevel */}
                      <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none rounded-b-xl" />
                      
                      {/* Crisp glyph with deep shadow */}
                      <span className="relative z-10 text-white font-black text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] font-mono select-none tracking-tight text-center px-1">
                        {topic.badgeSymbol}
                      </span>
                    </div>

                    {/* Middle: Title & Units Pill */}
                    <div className="flex-1 min-w-0 text-left relative z-10">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base sm:text-lg font-black text-white leading-tight tracking-tight group-hover:text-cyan-200 transition-colors truncate drop-shadow-sm">
                          {topic.title}
                        </h3>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-[0_0_10px_rgba(52,211,153,0.4)] shrink-0 flex items-center gap-1 animate-pulse">
                            <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                            ACTIVE MAP
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 backdrop-blur-md shadow-sm">
                          {topic.unitsCount} THEORY LESSONS
                        </span>
                        {topic.description && (
                          <span className="text-[11px] text-slate-400 truncate max-w-[180px]">
                            • {topic.description}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Tactile 3D Glass Action Button */}
                    <div className="shrink-0 relative z-10">
                      <div
                        className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-200 active:translate-y-0.5 relative overflow-hidden group-hover:scale-105 ${
                          isActive
                            ? `bg-gradient-to-b ${themeStyles.accentBg} border-white/40 text-white shadow-[0_3px_0_${themeStyles.shadowColor}]`
                            : "bg-white/10 group-hover:bg-white/20 border-white/20 text-slate-300 group-hover:text-white shadow-[0_3px_0_rgba(0,0,0,0.4)] backdrop-blur-md"
                        }`}
                      >
                        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-xl pointer-events-none" />
                        {isActive ? (
                          <Play className="w-4 h-4 fill-white stroke-none ml-0.5 drop-shadow" />
                        ) : (
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {/* --- QUESTIONS TAB --- */}
        {activeTab === "questions" && (
          <>
            {filteredQuestions.length === 0 ? (
              <div className="py-16 text-center text-slate-500">
                <Code2 className="w-10 h-10 mx-auto mb-2 opacity-40 text-purple-400" />
                <p className="font-bold text-sm text-slate-300">No question sections matching "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-3 text-xs font-black text-purple-400 uppercase tracking-wider hover:underline cursor-pointer"
                >
                  Clear Search Filter
                </button>
              </div>
            ) : (
              filteredQuestions.map((topic) => {
                const isActive = currentActiveTrack === "questions" && activeSectionNumber === topic.sectionNumber;
                return (
                  <div
                    key={topic.id}
                    onClick={() => handleLaunchQuestionsTopic(topic)}
                    className={`w-full p-4 rounded-2xl backdrop-blur-xl transition-all duration-200 cursor-pointer flex items-center gap-4 relative overflow-hidden group border-2 active:translate-y-1 ${
                      isActive
                        ? `bg-gradient-to-br from-[#0e1d36]/95 via-[#0c182d]/90 to-[#071120]/95 ${themeStyles.activeBorder} border-b-4`
                        : "bg-gradient-to-br from-[#0d1424]/90 via-[#0a0f1b]/85 to-[#060912]/90 hover:from-[#111b30]/90 hover:to-[#090e1a]/90 border-white/15 hover:border-white/30 border-b-4 border-b-[#050810] shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
                    }`}
                  >
                    {/* Shiny top gloss reflection overlay */}
                    <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none rounded-t-2xl" />

                    {/* Left Tactile 3D Glass Badge */}
                    <div
                      className="relative w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center border-2 border-white/40 shadow-[0_5px_0_rgba(0,0,0,0.5)] overflow-hidden group-hover:scale-105 active:scale-95 transition-all duration-200"
                      style={{
                        background: (topic.badgeBg && topic.badgeBg.startsWith("#"))
                          ? `linear-gradient(135deg, ${topic.badgeBg}, #0f172a)`
                          : (topic.badgeBg || "linear-gradient(135deg, #a855f7, #0f172a)"),
                        boxShadow: `0 6px 18px ${(topic.badgeBg || "#a855f7")}40, 0 4px 0 rgba(0,0,0,0.5)`
                      }}
                    >
                      {/* Top gloss reflection shine */}
                      <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/45 via-white/15 to-transparent pointer-events-none rounded-t-xl" />
                      {/* Bottom depth bevel */}
                      <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none rounded-b-xl" />

                      <span className="relative z-10 text-white font-black text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] font-mono select-none tracking-tight text-center px-1">
                        {topic.badgeSymbol}
                      </span>
                    </div>

                    {/* Middle: Title & Units Pill */}
                    <div className="flex-1 min-w-0 text-left relative z-10">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base sm:text-lg font-black text-white leading-tight tracking-tight group-hover:text-purple-200 transition-colors truncate drop-shadow-sm">
                          {topic.title}
                        </h3>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-[0_0_10px_rgba(52,211,153,0.4)] shrink-0 flex items-center gap-1 animate-pulse">
                            <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                            ACTIVE MAP
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-purple-500/20 border border-purple-400/30 text-purple-300 backdrop-blur-md shadow-sm">
                          {topic.unitsCount} CHALLENGES
                        </span>
                        {topic.description && (
                          <span className="text-[11px] text-slate-400 truncate max-w-[180px]">
                            • {topic.description}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Tactile 3D Glass Action Button */}
                    <div className="shrink-0 relative z-10">
                      <div
                        className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-200 active:translate-y-0.5 relative overflow-hidden group-hover:scale-105 ${
                          isActive
                            ? `bg-gradient-to-b ${themeStyles.accentBg} border-white/40 text-white shadow-[0_3px_0_${themeStyles.shadowColor}]`
                            : "bg-white/10 group-hover:bg-white/20 border-white/20 text-slate-300 group-hover:text-white shadow-[0_3px_0_rgba(0,0,0,0.4)] backdrop-blur-md"
                        }`}
                      >
                        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-xl pointer-events-none" />
                        {isActive ? (
                          <Play className="w-4 h-4 fill-white stroke-none ml-0.5 drop-shadow" />
                        ) : (
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}
          </>
        )}

        {/* =========================================================================
            5. COLLAPSIBLE STUDY GUIDE & MENTOR TIPS (Tactile Glass Expanders)
            ========================================================================= */}
        <div className="pt-4 pb-12 space-y-3">
          {/* Mentor Advice Expander - Tactile 3D Glass Button */}
          <button
            onClick={() => setShowMentorHub((prev) => !prev)}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-[#0d1424]/90 to-[#070c18]/90 hover:from-[#111c33]/90 hover:to-[#0a1020]/90 border-2 border-white/15 border-b-4 border-b-[#050810] shadow-lg backdrop-blur-xl flex items-center justify-between transition-all active:translate-y-0.5 cursor-pointer relative overflow-hidden group"
          >
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-2xl" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                <Bot className="w-4 h-4" />
              </div>
              <span className="font-black text-xs text-white uppercase tracking-wider group-hover:text-cyan-200 transition-colors">
                AI Mentor Companions & Tips
              </span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center relative z-10">
              <ChevronRight
                className={`w-4 h-4 transition-transform text-slate-300 ${
                  showMentorHub ? "rotate-90 text-cyan-400" : ""
                }`}
              />
            </div>
          </button>

          <AnimatePresence>
            {showMentorHub && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden p-4 rounded-2xl bg-[#090f1d]/95 border-2 border-white/15 backdrop-blur-2xl space-y-4 shadow-xl"
              >
                {/* Trio Selector - Tactile Glass Tiles */}
                <div className="grid grid-cols-3 gap-2">
                  {mascotTrio.map((m) => {
                    const isSelected = m.id === activeMascotId;
                    return (
                      <button
                        key={m.id}
                        onClick={() => handleSwitchMascot(m.id)}
                        className={`p-2.5 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer relative overflow-hidden active:translate-y-0.5 ${
                          isSelected
                            ? "bg-white/15 border-white/50 shadow-[0_4px_12px_rgba(255,255,255,0.15)] scale-102"
                            : "bg-black/50 border-white/10 opacity-70 hover:opacity-100 hover:border-white/25"
                        }`}
                      >
                        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-black/60 border border-white/20 shadow-inner">
                          {m.icon}
                        </div>
                        <span className="text-[11px] font-mono font-black text-white tracking-wider">{m.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Mentor Advice Box */}
                <div className="p-3.5 rounded-xl bg-black/60 border border-white/15 flex items-start gap-3 backdrop-blur-md">
                  <div className="w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-slate-950 border border-white/20 shadow-inner">
                    <AIfluenceAvatar
                      config={activeMascot.config}
                      size={48}
                      mood={mascotMood}
                      faceZoom={true}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan-400">
                      {activeMascot.name} • {activeMascot.roleTitle}
                    </span>
                    <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                      "{activeMascot.tips[activeTipType]}"
                    </p>
                  </div>
                </div>

                {/* Strategy Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {(["welcome", "best", "boss", "strategy"] as const).map((tipKey) => (
                    <button
                      key={tipKey}
                      onClick={() => setActiveTipType(tipKey)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
                        activeTipType === tipKey
                          ? "bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.5)] font-bold"
                          : "bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10"
                      }`}
                    >
                      {tipKey}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Guidebook Syntax & Architectural Rules - Tactile 3D Glass Button */}
          {guidebookData && (
            <>
              <button
                onClick={() => setShowGuidebookCheatSheet((prev) => !prev)}
                className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-[#0d1424]/90 to-[#070c18]/90 hover:from-[#111c33]/90 hover:to-[#0a1020]/90 border-2 border-white/15 border-b-4 border-b-[#050810] shadow-lg backdrop-blur-xl flex items-center justify-between transition-all active:translate-y-0.5 cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-2xl" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="font-black text-xs text-white uppercase tracking-wider group-hover:text-emerald-200 transition-colors">
                    Syntax Rules & Code Snippet
                  </span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center relative z-10">
                  <ChevronRight
                    className={`w-4 h-4 transition-transform text-slate-300 ${
                      showGuidebookCheatSheet ? "rotate-90 text-emerald-400" : ""
                    }`}
                  />
                </div>
              </button>

              <AnimatePresence>
                {showGuidebookCheatSheet && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden p-4 rounded-2xl bg-[#090f1d]/95 border-2 border-white/15 text-left space-y-3 shadow-2xl backdrop-blur-2xl"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Architectural Rules</span>
                    </div>
                    <div className="space-y-2">
                      {guidebookData.keyRules.map((r, i) => (
                        <div key={i} className="text-xs p-2.5 rounded-xl bg-black/50 border border-white/10">
                          <span className="font-bold text-white block">{r.title}</span>
                          <span className="text-slate-400 text-[11px]">{r.desc}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 pt-2 border-t border-white/10">
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Syntax Snippet ({guidebookData.syntaxLanguage || "TypeScript"})</span>
                    </div>
                    <pre className="p-3 rounded-xl bg-black/80 border border-white/15 text-[11px] font-mono text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
                      {guidebookData.syntaxSnippet}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
