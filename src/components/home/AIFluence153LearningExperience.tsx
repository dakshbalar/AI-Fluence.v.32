import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Sparkles,
  Star,
  Lock,
  Play,
  CheckCircle2,
  ChevronRight,
  Database,
  Flame,
  Zap,
  Award,
  HelpCircle,
  Search,
  Filter,
  Layers,
  ChevronDown,
} from "lucide-react";
import {
  LEVEL_PLAN_DATA,
  ALL_COURSES,
  getCourseById,
  getBookById,
  getModuleById,
  getLevelById,
  getTotalLevelCount,
} from "../../data/levelPlanData";
import {
  LevelPlanCourse,
  LevelPlanBook,
  LevelPlanModule,
  LevelPlanLevel,
  GeneratedLevelDecks,
} from "../../types/curriculum";
import { getOrGenerateLevelContent } from "../../services/slideGenerationService";
import { TheoryDeckSlideModal } from "./TheoryDeckSlideModal";
import { QuizDeckPlayerModal } from "./QuizDeckPlayerModal";
import { UsedQuestionsRegistryModal } from "./UsedQuestionsRegistryModal";
import { useGamification } from "../../utils/gamificationStore";
import { recordLevelAttemptAndCompletion } from "../../services/learningTrackerService";

const LEVEL_PROGRESS_STORAGE_KEY = "aifluence_153_progress_v1";

interface StoredLevelProgress {
  [levelId: string]: {
    completed: boolean;
    stars: number; // 1, 2, or 3
    highScore: number;
    completedAt: string;
  };
}

export const AIFluence153LearningExperience: React.FC = () => {
  // Course selection: "genai" or "afe"
  const [selectedCourseId, setSelectedCourseId] = useState<string>("genai");
  // Book selection: "PE", "FT", "RAG" (for genai) or "AFE" (for afe)
  const [selectedBookId, setSelectedBookId] = useState<string>("PE");
  // Search query filter
  const [searchFilter, setSearchFilter] = useState<string>("");
  // Selected Level for preview modal
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);

  // Active decks state
  const [activeDecks, setActiveDecks] = useState<GeneratedLevelDecks | null>(null);
  const [isLoadingDecks, setIsLoadingDecks] = useState<boolean>(false);
  const [isTheoryModalOpen, setIsTheoryModalOpen] = useState<boolean>(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState<boolean>(false);
  const [isRegistryModalOpen, setIsRegistryModalOpen] = useState<boolean>(false);

  const { addXp, addDiamonds, completeLevelState } = useGamification();

  // Progress state: Level completion & stars
  const [progress, setProgress] = useState<StoredLevelProgress>(() => {
    try {
      if (typeof localStorage !== "undefined") {
        const saved = localStorage.getItem(LEVEL_PROGRESS_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not load level progress", e);
    }
    // Default: first level of each book unlocked
    return {
      "PE-M1-L1": { completed: false, stars: 0, highScore: 0, completedAt: "" },
      "FT-M1-L1": { completed: false, stars: 0, highScore: 0, completedAt: "" },
      "RAG-M1-L1": { completed: false, stars: 0, highScore: 0, completedAt: "" },
      "AFE-M1-L1": { completed: false, stars: 0, highScore: 0, completedAt: "" },
    };
  });

  const saveProgress = (newProgress: StoredLevelProgress) => {
    setProgress(newProgress);
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(LEVEL_PROGRESS_STORAGE_KEY, JSON.stringify(newProgress));
      }
    } catch (e) {
      console.warn("Could not save level progress", e);
    }
  };

  const currentCourse = useMemo(
    () => getCourseById(selectedCourseId) || ALL_COURSES[0],
    [selectedCourseId]
  );

  const currentBook = useMemo(() => {
    const book = currentCourse.books.find((b) => b.book_id === selectedBookId);
    return book || currentCourse.books[0];
  }, [currentCourse, selectedBookId]);

  // Handle course switch
  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    const course = getCourseById(courseId);
    if (course && course.books.length > 0) {
      setSelectedBookId(course.books[0].book_id);
    }
  };

  // Check if a level is unlocked
  const isLevelUnlocked = (levelId: string, levelIndexInModule: number): boolean => {
    // First level of any module is unlocked, or previous level is completed
    if (levelIndexInModule === 0) return true;
    if (progress[levelId]?.completed) return true;

    // Check previous level in module
    const levelInfo = getLevelById(levelId);
    if (!levelInfo) return false;
    const { module } = levelInfo;
    const prevLevel = module.levels[levelIndexInModule - 1];
    if (prevLevel && progress[prevLevel.level_id]?.completed) {
      return true;
    }
    return false;
  };

  // Launch deck loading
  const handleOpenLevel = async (levelId: string, startWith: "theory" | "quiz" = "theory") => {
    setSelectedLevelId(levelId);
    setIsLoadingDecks(true);
    try {
      const decks = await getOrGenerateLevelContent(levelId);
      if (decks) {
        setActiveDecks(decks);
        if (startWith === "theory") {
          setIsTheoryModalOpen(true);
        } else {
          setIsQuizModalOpen(true);
        }
      }
    } catch (err) {
      console.error("Error opening level decks", err);
    } finally {
      setIsLoadingDecks(false);
    }
  };

  // Handle level completion
  const handleCompleteLevel = (levelId: string, starsEarned: number, score: number) => {
    const prev = progress[levelId] || { completed: false, stars: 0, highScore: 0, completedAt: "" };
    const newStars = Math.max(prev.stars, starsEarned);
    const newProgress: StoredLevelProgress = {
      ...progress,
      [levelId]: {
        completed: true,
        stars: newStars,
        highScore: Math.max(prev.highScore, score),
        completedAt: new Date().toISOString(),
      },
    };

    // Unlock next level in module if exists
    const levelInfo = getLevelById(levelId);
    if (levelInfo) {
      const { module } = levelInfo;
      const currentIdx = module.levels.findIndex((l) => l.level_id === levelId);
      if (currentIdx >= 0 && currentIdx < module.levels.length - 1) {
        const nextLevel = module.levels[currentIdx + 1];
        if (!newProgress[nextLevel.level_id]) {
          newProgress[nextLevel.level_id] = { completed: false, stars: 0, highScore: 0, completedAt: "" };
        }
      }
    }

    saveProgress(newProgress);
    const courseId = selectedCourseId === "genai" ? "generative_ai" : selectedCourseId;
    const levelTitle = levelInfo?.level.title || levelId;

    completeLevelState(levelId, starsEarned, 50 + starsEarned * 15, undefined, {
      courseId,
      courseName: currentCourse.course_name,
      levelTitle,
      trophiesGained: 25,
      diamondsGained: starsEarned === 3 ? 5 : 2,
    });

    const totalQ = 10;
    const correctCount = Math.min(totalQ, Math.max(0, score));
    const scorePct = Math.round((correctCount / totalQ) * 100);

    recordLevelAttemptAndCompletion({
      courseId,
      levelId,
      levelTitle,
      stars: starsEarned,
      completed: true,
      scorePercent: scorePct,
      mistakes: totalQ - correctCount,
      livesUsed: 1,
      flashcardsViewed: 10,
    }).catch((err) => console.warn("Error recording 153 level completion:", err));
  };

  // Total stats for current book
  const bookStats = useMemo(() => {
    let totalLevels = 0;
    let completedLevels = 0;
    let totalStars = 0;

    for (const mod of currentBook.modules) {
      for (const lvl of mod.levels) {
        totalLevels++;
        const p = progress[lvl.level_id];
        if (p?.completed) {
          completedLevels++;
          totalStars += p.stars;
        }
      }
    }

    const pct = totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;
    return { totalLevels, completedLevels, totalStars, maxStars: totalLevels * 3, pct };
  }, [currentBook, progress]);

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Banner / Course Picker */}
      <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Course Tabs */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
              Course:
            </span>
            {ALL_COURSES.map((course) => {
              const isActive = course.course_id === selectedCourseId;
              const totalCourseLevels = course.books.reduce(
                (sum, b) => sum + b.modules.reduce((mSum, m) => mSum + m.levels.length, 0),
                0
              );
              return (
                <button
                  key={course.course_id}
                  onClick={() => handleSelectCourse(course.course_id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      : "bg-white/5 text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{course.course_name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono bg-black/20">
                    {totalCourseLevels}L
                  </span>
                </button>
              );
            })}
          </div>

          {/* Used Questions Registry Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRegistryModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.2)]"
              title="Inspect SHA-256 deduplication registry"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Registry §5.2</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Book Selector Header */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-[#0c182a] border border-white/10 shadow-xl space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
                <span>153-Level Curriculum</span>
                <span>•</span>
                <span>{currentCourse.course_name}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {currentBook.book_name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {currentBook.modules.length} {currentBook.unit_word}s • {bookStats.totalLevels} Total Levels
              </p>
            </div>

            {/* Book Progress Summary */}
            <div className="flex items-center gap-4 bg-white/[0.03] border border-white/10 p-4 rounded-2xl">
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Progress</div>
                <div className="text-xl font-black text-emerald-400">
                  {bookStats.completedLevels} / {bookStats.totalLevels}
                </div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Stars Earned</div>
                <div className="text-xl font-black text-amber-400 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {bookStats.totalStars}
                </div>
              </div>
            </div>
          </div>

          {/* Book Navigation Pills */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
            {currentCourse.books.map((book) => {
              const isSelected = book.book_id === selectedBookId;
              const bookLevelCount = book.modules.reduce((sum, m) => sum + m.levels.length, 0);
              return (
                <button
                  key={book.book_id}
                  onClick={() => setSelectedBookId(book.book_id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2.5 cursor-pointer ${
                    isSelected
                      ? "bg-cyan-500/20 border-2 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                      : "bg-white/[0.04] border border-white/10 text-slate-300 hover:bg-white/[0.08]"
                  }`}
                >
                  <span className="w-6 h-6 rounded-lg bg-cyan-950 font-mono text-cyan-300 font-bold text-xs flex items-center justify-center border border-cyan-700/50">
                    {book.book_id}
                  </span>
                  <span>{book.book_name}</span>
                  <span className="text-[11px] font-mono text-slate-400 font-semibold">
                    ({bookLevelCount}L)
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder={`Search across all ${currentBook.book_name} levels by title or concept...`}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Modules List & Level Map */}
        <div className="space-y-8">
          {currentBook.modules.map((module) => {
            const filteredLevels = searchFilter
              ? module.levels.filter((l) =>
                  l.title.toLowerCase().includes(searchFilter.toLowerCase())
                )
              : module.levels;

            if (searchFilter && filteredLevels.length === 0) return null;

            return (
              <div
                key={module.module_id}
                className="p-5 sm:p-7 rounded-3xl bg-slate-900/60 border border-white/10 shadow-lg space-y-5"
              >
                {/* Module Header */}
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 font-black text-sm flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                      {module.module_number}
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                        {currentBook.unit_word} {module.module_number}
                      </div>
                      <h2 className="text-base sm:text-lg font-black text-white">{module.module_name}</h2>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                    {module.levels.length} Levels
                  </span>
                </div>

                {/* Level Map Grid (Section-Based Numbering: Level 1, Level 2, Level 3...) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                  {filteredLevels.map((level, levelIndex) => {
                    const unlocked = isLevelUnlocked(level.level_id, levelIndex);
                    const levelProg = progress[level.level_id];
                    const isCompleted = levelProg?.completed;
                    const stars = levelProg?.stars || 0;

                    return (
                      <motion.div
                        key={level.level_id}
                        whileHover={unlocked ? { scale: 1.02 } : {}}
                        whileTap={unlocked ? { scale: 0.98 } : {}}
                        className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 ${
                          isCompleted
                            ? "bg-gradient-to-b from-emerald-950/40 to-slate-900 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                            : unlocked
                            ? "bg-gradient-to-b from-cyan-950/40 to-slate-900 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                            : "bg-slate-900/40 border-white/5 opacity-60 pointer-events-none"
                        }`}
                      >
                        {/* Top info: Section-based level display (e.g. Level 1) + Key ID */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-xs font-black uppercase tracking-wider ${
                                isCompleted
                                  ? "text-emerald-400"
                                  : unlocked
                                  ? "text-cyan-300"
                                  : "text-slate-500"
                              }`}
                            >
                              Level {level.star_number}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
                            {level.level_id}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2">
                          {level.title}
                        </h4>

                        {/* Stars / Lock State / Action Buttons */}
                        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                          {isCompleted ? (
                            <div className="flex items-center gap-1">
                              {[1, 2, 3].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3.5 h-3.5 ${
                                    s <= stars ? "text-amber-400 fill-amber-400" : "text-slate-600"
                                  }`}
                                />
                              ))}
                            </div>
                          ) : unlocked ? (
                            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              Ready
                            </span>
                          ) : (
                            <div className="flex items-center gap-1 text-slate-500 text-xs">
                              <Lock className="w-3.5 h-3.5" />
                              <span>Locked</span>
                            </div>
                          )}

                          {unlocked && (
                            <button
                              onClick={() => handleOpenLevel(level.level_id, "theory")}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors flex items-center gap-1 cursor-pointer active:scale-95 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                            >
                              <Play className="w-3 h-3 fill-slate-950" />
                              Start
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 10-Slide Theory Deck Modal */}
      {activeDecks && (
        <TheoryDeckSlideModal
          isOpen={isTheoryModalOpen}
          levelId={activeDecks.level_id}
          levelTitle={activeDecks.title}
          bookName={currentBook.book_name}
          moduleName={getModuleById(activeDecks.level_id.split("-").slice(0, 2).join("-"))?.module_name || ""}
          slides={activeDecks.theory_slides}
          onClose={() => setIsTheoryModalOpen(false)}
          onStartQuiz={() => {
            setIsTheoryModalOpen(false);
            setIsQuizModalOpen(true);
          }}
        />
      )}

      {/* 10-Question Quiz Deck Modal */}
      {activeDecks && (
        <QuizDeckPlayerModal
          isOpen={isQuizModalOpen}
          levelId={activeDecks.level_id}
          levelTitle={activeDecks.title}
          bookName={currentBook.book_name}
          questions={activeDecks.quiz_questions}
          onClose={() => setIsQuizModalOpen(false)}
          onCompleteLevel={handleCompleteLevel}
          onRegenerateFreshQuiz={async () => {
            if (selectedLevelId) {
              const fresh = await getOrGenerateLevelContent(selectedLevelId, true);
              if (fresh) setActiveDecks(fresh);
            }
          }}
        />
      )}

      {/* Used Questions Registry Modal (Section 5.2) */}
      <UsedQuestionsRegistryModal
        isOpen={isRegistryModalOpen}
        onClose={() => setIsRegistryModalOpen(false)}
      />
    </div>
  );
};
