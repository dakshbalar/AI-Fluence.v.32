import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, Sparkles } from "lucide-react";
import { AIfluenceAvatar } from "../avatar/AIfluenceAvatar";
import { AIDEN_CONFIG } from "../../data/characters";
import {
  loadStoredStudentProfile,
  loadStoredCommitment,
  loadStoredDailyActivity,
  recordMissionCompletion,
} from "../../utils/engagementStore";
import { DailyMissionStep } from "../../types/engagement";

interface AidenDailyGoalsSlideProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTask?: (task: DailyMissionStep) => void;
  onOpenSkinsModal?: () => void;
}

const CLEAN_DEFAULT_GOALS: DailyMissionStep[] = [
  {
    id: "learn",
    title: "Complete 1 Algorithm Lesson",
    subtitle: "Section 1 core foundation",
    estimatedMinutes: 5,
    xpReward: 25,
    completed: true,
  },
  {
    id: "practice",
    title: "Solve 1 Two-Pointer Drill",
    subtitle: "Interactive practice",
    estimatedMinutes: 8,
    xpReward: 25,
    completed: false,
  },
  {
    id: "think",
    title: "Complete Quick Intuition Quiz",
    subtitle: "Pattern recognition",
    estimatedMinutes: 4,
    xpReward: 15,
    completed: false,
  },
  {
    id: "challenge",
    title: "Keep Daily Learning Streak",
    subtitle: "Consistency momentum",
    estimatedMinutes: 3,
    xpReward: 20,
    completed: false,
  },
];

export const AidenDailyGoalsSlide: React.FC<AidenDailyGoalsSlideProps> = ({
  isOpen,
  onClose,
}) => {
  const [missions, setMissions] = useState<DailyMissionStep[]>(CLEAN_DEFAULT_GOALS);
  const [justCompletedId, setJustCompletedId] = useState<string | null>(null);

  // Load state on open
  useEffect(() => {
    if (!isOpen) return;

    try {
      const profile = loadStoredStudentProfile();
      const commitment = loadStoredCommitment();
      const activity = loadStoredDailyActivity(profile, commitment);

      if (activity?.missions && activity.missions.length > 0) {
        // Map stored missions to clean titles
        setMissions(
          activity.missions.map((m, idx) => ({
            ...m,
            title:
              CLEAN_DEFAULT_GOALS[idx]?.title ||
              m.title.replace(/^(Learn|Practice|Quick Think|Adversarial Challenge):\s*/i, ""),
          }))
        );
      }
    } catch (e) {
      // fallback to clean defaults
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const completedCount = missions.filter((m) => m.completed).length;
  const totalCount = missions.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const toggleMission = (missionId: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          const nextState = !m.completed;
          if (nextState) {
            setJustCompletedId(missionId);
            setTimeout(() => setJustCompletedId(null), 900);
            try {
              recordMissionCompletion(m.id, m.xpReward);
            } catch (e) {
              // ignore
            }
          }
          return { ...m, completed: nextState };
        }
        return m;
      })
    );
  };

  const aidenGreeting =
    completedCount === totalCount
      ? "All done for today! Awesome job!"
      : completedCount > 0
      ? `${completedCount} of ${totalCount} done! Keep it up!`
      : "Complete your tasks to level up!";

  return (
    <div
      id="aiden-daily-goals-slide"
      className="fixed inset-0 z-[250] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* SIMPLIFIED, CLEAN DIALOG CARD */}
      <div
        className="relative w-full max-w-sm rounded-3xl bg-[#0a1122] border-2 border-slate-700/70 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col gap-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER: TITLE + CLOSE */}
        <div className="flex items-center justify-between pb-1 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <h3 className="font-pixel text-xs text-white uppercase tracking-wider font-bold">
              Today's Tasks
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

        {/* CLEAN PROGRESS BAR */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold">
            <span className="text-slate-400">Progress</span>
            <span className="text-emerald-400 font-pixel text-[9px]">
              {completedCount}/{totalCount} DONE
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

        {/* SUPERBLY SIMPLIFIED TASKS LIST (NO CLUTTER, NO SUBTITLES) */}
        <div className="space-y-2">
          {missions.map((m) => {
            const isDone = m.completed;
            const isJustDone = justCompletedId === m.id;

            return (
              <div
                key={m.id}
                onClick={() => toggleMission(m.id)}
                className={`relative px-3 py-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isDone
                    ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-200"
                    : "bg-slate-900/80 hover:bg-slate-800/80 border-white/10 text-white"
                }`}
              >
                {/* Left: Checkmark box */}
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
                    isDone
                      ? "bg-emerald-500 text-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.7)]"
                      : "border-2 border-slate-600 bg-slate-800 text-transparent"
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 stroke-[3] ${isDone ? "opacity-100" : "opacity-0"}`} />
                </div>

                {/* Center: Clean Title */}
                <span
                  className={`flex-1 text-xs font-bold truncate ${
                    isDone ? "line-through text-slate-400" : "text-slate-100"
                  }`}
                >
                  {m.title}
                </span>

                {/* Right: XP Badge */}
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/30 flex-shrink-0">
                  +{m.xpReward} XP
                </span>

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
                        DONE! +{m.xpReward} XP
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* AIDEN HALF-BODY COMPANION + CLEAN COMIC DIALOGUE */}
        <div className="pt-2 border-t border-white/10 flex items-center gap-3">
          {/* Comic speech bubble */}
          <div className="relative flex-1 bg-white text-slate-950 px-3.5 py-2.5 rounded-2xl text-left shadow-md">
            <p className="text-xs font-bold leading-tight text-slate-900">
              {aidenGreeting}
            </p>
            {/* Tail pointing right to Aiden */}
            <div
              className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 pointer-events-none"
              style={{
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderLeft: "8px solid #FFFFFF",
              }}
            />
          </div>

          {/* Half-body Aiden bust crop */}
          <div className="relative w-16 h-16 shrink-0 overflow-hidden flex items-start justify-center">
            <div className="absolute -top-1 flex items-center justify-center pointer-events-none">
              <AIfluenceAvatar
                config={AIDEN_CONFIG}
                size={110}
                mood={completedCount === totalCount ? "celebrating" : "happy"}
                showBackground={false}
                animate={true}
              />
            </div>
          </div>
        </div>

        {/* SINGLE CLEAN 3D ARCADE BUTTON: CONTINUE */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl font-pixel text-[10px] uppercase tracking-wider text-white border-2 border-sky-300 bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-600 shadow-[0_5px_0_#1e3a8a] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 cursor-pointer transition-all overflow-hidden relative"
        >
          {/* Top gloss reflection */}
          <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-xl bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
          <span>CONTINUE</span>
        </button>
      </div>
    </div>
  );
};
