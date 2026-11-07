import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Search,
  ChevronRight,
  Play,
  Sparkles,
  Target,
  Settings as SettingsIcon,
  Search as SearchIcon,
} from "lucide-react";
import { CourseSection } from "../../data/coursesData";

interface SectionSelectorDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseName: string;
  themeColor: string;
  sections: CourseSection[];
  activeSectionNumber: number;
  onSelectSection: (sectionNumber: number) => void;
  completedLevelsMap?: Record<string, boolean>;
  levelStarsMap?: Record<string, [boolean, boolean, boolean] | number>;
}

export const SectionSelectorDrawerModal: React.FC<SectionSelectorDrawerModalProps> = ({
  isOpen,
  onClose,
  courseId,
  courseName,
  sections,
  activeSectionNumber,
  onSelectSection,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("prompting");

  // Determine course tab categories
  const isGenAI = courseId === "generative_ai";
  const isAIForEveryone = courseId === "ai_for_everyone";

  const tabs = useMemo(() => {
    if (isGenAI) {
      return [
        { id: "prompting", label: "Prompting", icon: Target, emoji: "🎯" },
        { id: "fine-tuning", label: "Fine-Tuning", icon: SettingsIcon, emoji: "⚙️" },
        { id: "rag", label: "RAG", icon: SearchIcon, emoji: "🔍" },
      ];
    }
    return [
      { id: "all", label: "All Chapters", icon: Target, emoji: "🎯" },
    ];
  }, [isGenAI]);

  // Active module header metadata
  const currentSubjectMeta = useMemo(() => {
    if (isGenAI) {
      if (activeTab === "fine-tuning") {
        return {
          title: "Fine-Tuning LLMs",
          subtitle: "Domain Adaptation, LoRA, RLHF & Hyperparameters",
          chaptersCount: 8,
          emoji: "⚙️",
        };
      }
      if (activeTab === "rag") {
        return {
          title: "Retrieval-Augmented Gen (RAG)",
          subtitle: "Embeddings, Vector Search, Knowledge Grounding",
          chaptersCount: 8,
          emoji: "🔍",
        };
      }
      return {
        title: "Prompt Engineering",
        subtitle: "Foundations, Control, Techniques & Output Shaping",
        chaptersCount: 8,
        emoji: "🎯",
      };
    }
    return {
      title: courseName,
      subtitle: "Full Academy Curriculum & Learning Path",
      chaptersCount: sections.length,
      emoji: "🎯",
    };
  }, [isGenAI, activeTab, courseName, sections.length]);

  const displayedSections = useMemo(() => {
    return sections.filter((sec) => {
      // Tab filter for GenAI
      if (isGenAI) {
        if (activeTab === "prompting" && (sec.sectionNumber < 1 || sec.sectionNumber > 8)) return false;
        if (activeTab === "fine-tuning" && (sec.sectionNumber < 9 || sec.sectionNumber > 16)) return false;
        if (activeTab === "rag" && (sec.sectionNumber < 17 || sec.sectionNumber > 24)) return false;
      }

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        sec.sectionTitle.toLowerCase().includes(q) ||
        sec.unitTitle.toLowerCase().includes(q) ||
        sec.unitDescription.toLowerCase().includes(q) ||
        `ch ${sec.sectionNumber}`.includes(q) ||
        `chapter ${sec.sectionNumber}`.includes(q) ||
        sec.levels.some((l) => l.title.toLowerCase().includes(q))
      );
    });
  }, [sections, activeTab, searchQuery, isGenAI]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[400] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          className={`w-full max-w-md sm:max-w-lg h-[92vh] sm:h-[88vh] ${isAIForEveryone ? "bg-[#0c0a03] border-t-2 sm:border-2 border-amber-500/60" : "bg-[#070b14] border-t-2 sm:border-2 border-blue-900/60"} rounded-t-[32px] sm:rounded-[32px] shadow-[0_25px_70px_rgba(0,0,0,0.95)] text-white flex flex-col overflow-hidden`}
        >
          {/* Top Header Bar with Close (X), ACADEMY CURRICULUM, Title, and Search (Q) */}
          <div className={`pt-4 pb-3 px-4 border-b ${isAIForEveryone ? "border-amber-900/40 bg-[#120f04]" : "border-blue-900/40 bg-[#070c18]"} flex items-center justify-between shrink-0`}>
            {/* Close Button on Left */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Center Header */}
            <div className="flex flex-col items-center">
              <span className={`px-3 py-0.5 rounded-full ${isAIForEveryone ? "bg-amber-950/80 border border-amber-400/40 text-amber-300" : "bg-cyan-950/80 border border-cyan-400/40 text-cyan-300"} text-[10px] font-black tracking-widest uppercase mb-0.5 shadow-sm`}>
                ACADEMY CURRICULUM
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                {isGenAI ? "Generative A.I" : courseName}
              </h2>
            </div>

            {/* Search Icon Button on Right */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Expandable Search Input */}
          {isSearchOpen && (
            <div className={`p-3 ${isAIForEveryone ? "bg-[#141004] border-amber-900/40" : "bg-[#0a1020] border-blue-900/40"} border-b shrink-0`}>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chapter, lesson or topic..."
                  className={`w-full pl-10 pr-9 py-2 ${isAIForEveryone ? "bg-amber-950/40 border border-amber-500/30 focus:border-amber-400" : "bg-slate-900/90 border border-blue-500/30 focus:border-blue-400"} rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Category Tabs Pill Bar (Prompting | Fine-Tuning | RAG) */}
          {tabs.length > 1 && (
            <div className="p-3 shrink-0">
              <div className={`rounded-2xl ${isAIForEveryone ? "bg-[#120f05] border border-amber-900/50" : "bg-[#0a101f] border border-blue-900/50"} p-1.5 flex gap-1.5 overflow-x-auto scrollbar-none shadow-inner`}>
                {tabs.map((t) => {
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isActive
                          ? isAIForEveryone
                            ? "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black shadow-[0_0_18px_rgba(245,158,11,0.45)] border border-amber-300/60 font-black"
                            : "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white shadow-[0_0_18px_rgba(37,99,235,0.45)] border border-blue-400/50 font-black"
                          : "text-slate-400 hover:text-white hover:bg-white/5 font-black"
                      }`}
                    >
                      <span className="text-sm">{t.emoji}</span>
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Top Subject Overview Card */}
          <div className="px-3 pb-2 shrink-0">
            <div className={`rounded-2xl ${isAIForEveryone ? "bg-[#120f04] border border-amber-900/50" : "bg-[#0c1427] border border-blue-900/50"} p-3.5 flex items-center justify-between gap-3 shadow-lg shadow-black/40`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${isAIForEveryone ? "bg-amber-500/20 border border-amber-400/30 text-amber-400" : "bg-blue-500/20 border border-blue-400/30 text-blue-400"} flex items-center justify-center text-lg shadow-inner`}>
                  {currentSubjectMeta.emoji}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white leading-tight">
                    {currentSubjectMeta.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {currentSubjectMeta.subtitle}
                  </p>
                </div>
              </div>

              <span className={`shrink-0 ${isAIForEveryone ? "bg-amber-950/90 border border-amber-400/40 text-amber-300" : "bg-blue-950/90 border border-blue-400/40 text-blue-300"} text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider shadow-sm`}>
                {currentSubjectMeta.chaptersCount} CHAPTERS
              </span>
            </div>
          </div>

          {/* Chapter Cards Scrollable List */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
            {displayedSections.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <p className="text-sm font-bold">No chapters found</p>
                <p className="text-xs text-slate-500 mt-1">Try another search keyword</p>
              </div>
            ) : (
              displayedSections.map((sec, idx) => {
                const isActive = sec.sectionNumber === activeSectionNumber;
                const chapterNumber = isGenAI
                  ? ((sec.sectionNumber - 1) % 8) + 1
                  : idx + 1;
                const totalLessons = sec.levels?.length || 10;

                // Build lesson summary preview (e.g. "1. Meet Generative AI • 2. The Anato...")
                const lessonPreview = sec.levels && sec.levels.length > 0
                  ? sec.levels.slice(0, 2).map((l, i) => `${i + 1}. ${l.title}`).join(" • ") + (sec.levels.length > 2 ? "..." : "")
                  : `Chapter ${chapterNumber} Core Lessons`;

                // Chapter title
                const chapterTitle = sec.unitTitle || sec.sectionTitle || `Chapter ${chapterNumber}`;

                return (
                  <motion.div
                    key={sec.sectionNumber}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      onSelectSection(sec.sectionNumber);
                      onClose();
                    }}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex items-center justify-between gap-3 shadow-lg shadow-black/40 ${
                      isActive
                        ? isAIForEveryone
                          ? "bg-[#181305] border-amber-400/70 shadow-[0_0_22px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/40"
                          : "bg-[#0d162b] border-blue-400/70 shadow-[0_0_22px_rgba(59,130,246,0.3)] ring-1 ring-blue-400/40"
                        : isAIForEveryone
                          ? "bg-[#100e03] hover:bg-[#161304] border-amber-900/40 hover:border-amber-700/60"
                          : "bg-[#0c1324] hover:bg-[#0f1830] border-blue-900/40 hover:border-blue-700/60"
                    }`}
                  >
                    {/* Left Chapter Square Badge (CH 1, CH 2...) */}
                    <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl ${isAIForEveryone ? "bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600 text-black shadow-amber-500/25" : "bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] text-white shadow-blue-500/25"} shadow-md flex flex-col items-center justify-center shrink-0 border border-white/20`}>
                      <span className="text-[10px] font-black uppercase tracking-wider opacity-90 leading-none">
                        CH
                      </span>
                      <span className="text-lg sm:text-xl font-black leading-tight mt-0.5">
                        {chapterNumber}
                      </span>
                    </div>

                    {/* Middle Chapter Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h4 className="text-sm sm:text-base font-black text-white truncate max-w-[170px] sm:max-w-[220px]">
                          {chapterTitle}
                        </h4>
                        {isActive && (
                          <span className="bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <Sparkles className="w-2.5 h-2.5" />
                            ACTIVE
                          </span>
                        )}
                      </div>

                      <div className="mb-1">
                        <span className={`${isAIForEveryone ? "bg-amber-950/85 border border-amber-500/30 text-amber-300" : "bg-blue-950/80 border border-blue-500/30 text-blue-300"} text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block`}>
                          {totalLessons} LESSONS
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 truncate">
                        {lessonPreview}
                      </p>
                    </div>

                    {/* Right Action Button (Play Circle for Active, Chevron Circle for Inactive) */}
                    <div className="shrink-0">
                      {isActive ? (
                        <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full ${isAIForEveryone ? "bg-gradient-to-tr from-yellow-500 to-amber-400 text-black shadow-[0_0_16px_rgba(245,158,11,0.4)]" : "bg-gradient-to-tr from-[#0284c7] to-[#38bdf8] text-white shadow-[0_0_16px_rgba(56,189,248,0.4)]"} flex items-center justify-center hover:scale-105 active:scale-95 transition-all`}>
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      ) : (
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
