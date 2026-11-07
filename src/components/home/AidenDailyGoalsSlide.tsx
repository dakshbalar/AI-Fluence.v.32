import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, Sparkles, Play, ArrowRight, Clock } from "lucide-react";
import { AIfluenceAvatar } from "../avatar/AIfluenceAvatar";
import { AIDEN_CONFIG } from "../../data/characters";
import { auth } from "../../firebase";
import { activeTimeTracker } from "../../services/activeTimeTracker";
import {
  fetchOrCreateStudentDailyQuests,
  FirebaseQuestItem,
  saveStudentDailyQuests,
} from "../../services/dailyQuestService";
import { loadStoredStudentProfile } from "../../utils/engagementStore";

interface AidenDailyGoalsSlideProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTask?: (taskCategoryOrId: string) => void;
  onOpenSkinsModal?: () => void;
  onLaunchLesson?: () => void;
  onLaunchQuiz?: () => void;
  onLaunchFlashcards?: () => void;
  onShareStreak?: () => void;
  courseId?: string;
}

const DEFAULT_DAILY_QUESTS: FirebaseQuestItem[] = [
  {
    id: "d1",
    t: "Complete 2 Learning Lessons",
    d: "Finish any 2 guided interactive levels of your choice. Est. 15m",
    p: 0,
    g: 2,
    r: 15,
    isMandatory: true,
    category: "lessons",
  },
  {
    id: "d2",
    t: "30 Minutes App Activity",
    d: "Spend at least 30 minutes learning and practicing today. Est. 30m",
    p: 0,
    g: 30,
    r: 25,
    isMandatory: true,
    category: "time",
  },
  {
    id: "d3",
    t: "Score 90%+ in Daily Assessment",
    d: "Demonstrate high accuracy in your daily practice drill. Est. 10m",
    p: 0,
    g: 1,
    r: 20,
    isMandatory: true,
    category: "assessment",
  },
  {
    id: "d4",
    t: "Review 10 Practice Flashcards",
    d: "Keep your concept memory sharp with a quick review round. Est. 5m",
    p: 0,
    g: 10,
    r: 10,
    isMandatory: false,
    category: "review",
  },
  {
    id: "d5",
    t: "Share Streak to Class Feed",
    d: "Share your learning streak progress with your classmates. Est. 1m",
    p: 0,
    g: 1,
    r: 10,
    isMandatory: false,
    category: "social",
  },
];

export const AidenDailyGoalsSlide: React.FC<AidenDailyGoalsSlideProps> = ({
  isOpen,
  onClose,
  onLaunchLesson,
  onLaunchQuiz,
  onLaunchFlashcards,
  onShareStreak,
  courseId,
}) => {
  const [quests, setQuests] = useState<FirebaseQuestItem[]>(DEFAULT_DAILY_QUESTS);
  const [justCompletedId, setJustCompletedId] = useState<string | null>(null);

  // Load backend quests on open
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const userId = auth.currentUser?.uid || loadStoredStudentProfile()?.userId || "guest_user";
    const activeMins = activeTimeTracker.getActiveMinutes();

    fetchOrCreateStudentDailyQuests(userId, courseId)
      .then((doc) => {
        if (!isMounted) return;
        const loadedQuests = (doc.quests && doc.quests.length > 0) ? doc.quests : DEFAULT_DAILY_QUESTS;
        
        // Sync active minutes into time quest
        const synced = loadedQuests.map((q) => {
          if (q.category === "time" || q.id.includes("2")) {
            const currentP = Math.max(q.p || 0, Math.min(q.g, activeMins));
            return { ...q, p: currentP };
          }
          return q;
        });

        setQuests(synced);
      })
      .catch(() => {
        if (!isMounted) return;
        setQuests(DEFAULT_DAILY_QUESTS);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, courseId]);

  if (!isOpen) return null;

  const completedCount = quests.filter((q) => q.p >= q.g).length;
  const totalCount = quests.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAction = (quest: FirebaseQuestItem) => {
    const isDone = quest.p >= quest.g;
    const cat = quest.category || "";

    if (isDone) return;

    onClose();

    if (cat === "lessons" || quest.id.includes("1")) {
      onLaunchLesson?.();
    } else if (cat === "assessment" || quest.id.includes("3")) {
      onLaunchQuiz?.();
    } else if (cat === "review" || quest.id.includes("4")) {
      onLaunchFlashcards?.();
    } else if (cat === "social" || quest.id.includes("5")) {
      onShareStreak?.();
    } else if (cat === "time" || quest.id.includes("2")) {
      onLaunchLesson?.();
    } else {
      onLaunchLesson?.();
    }
  };

  const toggleQuest = (questId: string) => {
    const userId = auth.currentUser?.uid || loadStoredStudentProfile()?.userId || "guest_user";
    setQuests((prev) => {
      const updated = prev.map((q) => {
        if (q.id === questId) {
          const isDone = q.p >= q.g;
          const nextP = isDone ? 0 : q.g;
          if (!isDone) {
            setJustCompletedId(questId);
            setTimeout(() => setJustCompletedId(null), 900);
          }
          return { ...q, p: nextP };
        }
        return q;
      });
      saveStudentDailyQuests(userId, updated).catch(() => {});
      return updated;
    });
  };

  const aidenGreeting =
    completedCount === totalCount
      ? "All daily tasks completed! Exceptional momentum!"
      : completedCount > 0
      ? `${completedCount} of ${totalCount} finished! Keep pushing forward!`
      : "Here are your daily learning tasks! Complete them for XP & Streaks!";

  return (
    <div
      id="aiden-daily-goals-slide"
      className="fixed inset-0 z-[250] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* DIALOG CARD */}
      <div
        className="relative w-full max-w-sm rounded-3xl bg-[#0a1122] border-2 border-slate-700/70 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col gap-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER: TITLE + CLOSE */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <h3 className="font-pixel text-xs text-white uppercase tracking-wider font-bold">
              Today's Daily Tasks
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PROGRESS BAR */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold">
            <span className="text-slate-400">Daily Quest Progress</span>
            <span className="text-emerald-400 font-pixel text-[9px]">
              {completedCount}/{totalCount} DONE ({progressPct}%)
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800/90 overflow-hidden border border-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"
            />
          </div>
        </div>

        {/* TASKS LIST */}
        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
          {quests.map((q) => {
            const isDone = q.p >= q.g;
            const isJustDone = justCompletedId === q.id;

            return (
              <div
                key={q.id}
                className={`relative px-3 py-2.5 rounded-2xl border transition-all flex items-center justify-between gap-2.5 ${
                  isDone
                    ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                    : "bg-slate-900/80 hover:bg-slate-800/80 border-white/10 text-white"
                }`}
              >
                {/* Left: Checkmark box toggle */}
                <button
                  type="button"
                  onClick={() => toggleQuest(q.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
                    isDone
                      ? "bg-emerald-500 text-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.7)]"
                      : "border-2 border-slate-600 bg-slate-800 text-transparent hover:border-slate-400"
                  }`}
                  title={isDone ? "Mark incomplete" : "Mark completed"}
                >
                  <Check className={`w-3.5 h-3.5 stroke-[3] ${isDone ? "opacity-100" : "opacity-0"}`} />
                </button>

                {/* Center: Title + Subtitle Progress */}
                <div className="flex-1 min-w-0 text-left">
                  <div
                    className={`text-xs font-bold truncate ${
                      isDone ? "line-through text-slate-400" : "text-slate-100"
                    }`}
                  >
                    {q.t}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-0.5">
                    <span>
                      {q.p}/{q.g} {q.category === "time" ? "mins" : ""}
                    </span>
                    {q.isMandatory && (
                      <span className="text-amber-400/90 font-sans text-[9px] uppercase tracking-wider font-bold">
                        • Required
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: XP Badge & Start Action Button */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30">
                    +{q.r} XP
                  </span>

                  {!isDone && (
                    <button
                      type="button"
                      onClick={() => handleAction(q)}
                      className="px-2.5 py-1 rounded-xl font-pixel text-[8px] uppercase tracking-wider bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold shadow-sm transition active:scale-95 flex items-center gap-1 cursor-pointer"
                    >
                      <span>START</span>
                      <Play className="w-2.5 h-2.5 fill-current" />
                    </button>
                  )}
                </div>

                {/* Mini sparkle on completion */}
                <AnimatePresence>
                  {isJustDone && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-emerald-500/20 border-2 border-emerald-400 rounded-2xl flex items-center justify-center pointer-events-none"
                    >
                      <span className="font-pixel text-[8px] text-emerald-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-300" />
                        TASK COMPLETED! +{q.r} XP
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* AIDEN COMPANION DIALOGUE */}
        <div className="pt-2 border-t border-white/10 flex items-center gap-3">
          <div className="relative flex-1 bg-white text-slate-950 px-3.5 py-2 rounded-2xl text-left shadow-md">
            <p className="text-xs font-bold leading-tight text-slate-900">
              {aidenGreeting}
            </p>
            <div
              className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 pointer-events-none"
              style={{
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderLeft: "8px solid #FFFFFF",
              }}
            />
          </div>

          <div className="relative w-14 h-14 shrink-0 overflow-hidden flex items-start justify-center">
            <div className="absolute -top-1 flex items-center justify-center pointer-events-none">
              <AIfluenceAvatar
                config={AIDEN_CONFIG}
                size={100}
                mood={completedCount === totalCount ? "celebrating" : "happy"}
                showBackground={false}
                animate={true}
              />
            </div>
          </div>
        </div>

        {/* CLOSE / CONTINUE BUTTON */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl font-pixel text-[10px] uppercase tracking-wider text-white border-2 border-sky-300 bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-600 shadow-[0_4px_0_#1e3a8a] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 cursor-pointer transition-all relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-xl bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
          <span>CLOSE DRAWER</span>
        </button>
      </div>
    </div>
  );
};
