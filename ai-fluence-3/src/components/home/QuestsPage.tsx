import React, { useState } from "react";
import {
  Clock,
  UserPlus,
  Sparkles,
  Flame,
} from "lucide-react";
import { motion } from "motion/react";
import { CornerStarsAndSmokeBackground } from "../onboarding-animations/shared/CornerStarsAndSmokeBackground";
import { QuestRewardChest, QuestChestTier } from "./QuestRewardChest";
import { PixelChestOpeningModal } from "./PixelChestOpeningModal";
import { auth } from "../../lib/firebase";
import { claimQuestReward } from "../../services/gamificationBackendService";

export interface QuestItem {
  id: string;
  title: string;
  current: number;
  total: number;
  type: "daily" | "friends" | "monthly";
  chestTier: QuestChestTier;
  rewardXP: number;
  rewardDiamonds: number;
  completed?: boolean;
}

interface QuestsPageProps {
  courseId?: string;
  onSelectCourse?: (courseId: string) => void;
  onClaimReward?: (xp: number, diamonds: number, bonus?: string) => void;
  onFindFriend?: () => void;
  onLaunchLesson?: () => void;
  themeColor?: string;
  diamonds?: number;
  onSpendDiamonds?: (amount: number) => boolean;
  onShowToast?: (msg: string) => void;
}

const COURSE_DAILY_QUESTS: Record<string, QuestItem[]> = {
  dsa: [
    {
      id: "dsa-quest-1",
      title: "Complete 1 Algorithm practice drill",
      current: 0,
      total: 1,
      type: "daily",
      chestTier: "bronze",
      rewardXP: 15,
      rewardDiamonds: 5,
    },
    {
      id: "dsa-quest-2",
      title: "Score 80%+ on any DSA lesson drill",
      current: 0,
      total: 1,
      type: "daily",
      chestTier: "silver",
      rewardXP: 25,
      rewardDiamonds: 10,
    },
    {
      id: "dsa-quest-3",
      title: "Spend 5 minutes solving code exercises",
      current: 0,
      total: 5,
      type: "daily",
      chestTier: "gold",
      rewardXP: 40,
      rewardDiamonds: 15,
    },
  ],
  html: [
    {
      id: "html-quest-1",
      title: "Complete 1 Semantic HTML5 component drill",
      current: 0,
      total: 1,
      type: "daily",
      chestTier: "bronze",
      rewardXP: 15,
      rewardDiamonds: 5,
    },
    {
      id: "html-quest-2",
      title: "Score 80%+ on CSS layout challenges",
      current: 0,
      total: 1,
      type: "daily",
      chestTier: "silver",
      rewardXP: 25,
      rewardDiamonds: 10,
    },
    {
      id: "html-quest-3",
      title: "Spend 5 minutes styling web interfaces",
      current: 0,
      total: 5,
      type: "daily",
      chestTier: "gold",
      rewardXP: 40,
      rewardDiamonds: 15,
    },
  ],
  java: [
    {
      id: "java-quest-1",
      title: "Complete 1 OOP Class & Interface drill",
      current: 0,
      total: 1,
      type: "daily",
      chestTier: "bronze",
      rewardXP: 15,
      rewardDiamonds: 5,
    },
    {
      id: "java-quest-2",
      title: "Score 80%+ on Java Collections practice",
      current: 0,
      total: 1,
      type: "daily",
      chestTier: "silver",
      rewardXP: 25,
      rewardDiamonds: 10,
    },
    {
      id: "java-quest-3",
      title: "Spend 5 minutes building JVM methods",
      current: 0,
      total: 5,
      type: "daily",
      chestTier: "gold",
      rewardXP: 40,
      rewardDiamonds: 15,
    },
  ],
  cpp: [
    {
      id: "cpp-quest-1",
      title: "Complete 1 Pointer & Memory Safety drill",
      current: 0,
      total: 1,
      type: "daily",
      chestTier: "bronze",
      rewardXP: 15,
      rewardDiamonds: 5,
    },
    {
      id: "cpp-quest-2",
      title: "Score 80%+ on STL container challenges",
      current: 0,
      total: 1,
      type: "daily",
      chestTier: "silver",
      rewardXP: 25,
      rewardDiamonds: 10,
    },
    {
      id: "cpp-quest-3",
      title: "Spend 5 minutes mastering C++ systems",
      current: 0,
      total: 5,
      type: "daily",
      chestTier: "gold",
      rewardXP: 40,
      rewardDiamonds: 15,
    },
  ],
  generative_ai: [
    {
      id: "genai-quest-1",
      title: "Complete 1 Prompt Engineering drill",
      current: 0,
      total: 1,
      type: "daily",
      chestTier: "bronze",
      rewardXP: 15,
      rewardDiamonds: 5,
    },
    {
      id: "genai-quest-2",
      title: "Score 80%+ on GenAI chapter questions",
      current: 0,
      total: 1,
      type: "daily",
      chestTier: "silver",
      rewardXP: 25,
      rewardDiamonds: 10,
    },
    {
      id: "genai-quest-3",
      title: "Spend 5 minutes mastering RAG & Fine-Tuning",
      current: 0,
      total: 5,
      type: "daily",
      chestTier: "gold",
      rewardXP: 40,
      rewardDiamonds: 15,
    },
  ],
};

export const QuestsPage: React.FC<QuestsPageProps> = ({
  courseId = "dsa",
  onSelectCourse,
  onClaimReward,
  onFindFriend,
  onLaunchLesson,
  themeColor,
  diamonds = 245,
  onSpendDiamonds,
  onShowToast,
}) => {
  const activeCourseKey = (courseId || "dsa").toLowerCase();

  // Resolve effective theme - DSA is always PURPLE, Generative AI matches section heading blue
  const effectiveTheme: "purple" | "green" | "red" | "blue" | "generative_ai" =
    activeCourseKey === "generative_ai" || activeCourseKey === "genai"
      ? "generative_ai"
      : activeCourseKey === "dsa" || themeColor === "purple"
      ? "purple"
      : activeCourseKey === "html" || themeColor === "green"
      ? "green"
      : activeCourseKey === "java" || themeColor === "red"
      ? "red"
      : "blue";

  // Course theme styling metadata
  const themeConfig = {
    generative_ai: {
      courseName: "Generative AI & LLMs",
      shortName: "GenAI",
      bannerGradient: "bg-gradient-to-r from-[#2563eb] via-[#1d4ed8] to-[#1e40af]",
      bannerBorder: "border-b-4 border-[#1e3a8a] border-t border-l border-r border-white/20",
      bannerGlow: "rgba(37,99,235,0.45)",
      badgeBg: "bg-blue-950/60 text-blue-200 border-blue-300/40",
      accentHex: "#2563eb",
      pageBg: "bg-gradient-to-b from-[#06142e] via-[#040b1a] to-black",
    },
    purple: {
      courseName: "Data Structures & Algorithms",
      shortName: "DSA",
      bannerGradient: "bg-gradient-to-br from-purple-700 via-purple-900 to-indigo-950",
      bannerBorder: "border-purple-400/40",
      bannerGlow: "rgba(168,85,247,0.35)",
      badgeBg: "bg-purple-500/20 text-purple-300 border-purple-400/40",
      accentHex: "#a855f7",
      pageBg: "bg-gradient-to-b from-[#17092c] via-[#0d0519] to-black",
    },
    green: {
      courseName: "HTML & Web Semantics",
      shortName: "HTML & CSS",
      bannerGradient: "bg-gradient-to-br from-emerald-600 via-emerald-800 to-teal-950",
      bannerBorder: "border-emerald-400/40",
      bannerGlow: "rgba(16,185,129,0.35)",
      badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
      accentHex: "#10b981",
      pageBg: "bg-gradient-to-b from-[#051c12] via-[#040e09] to-black",
    },
    red: {
      courseName: "Java Object-Oriented Programming",
      shortName: "Java",
      bannerGradient: "bg-gradient-to-br from-rose-600 via-rose-800 to-red-950",
      bannerBorder: "border-rose-400/40",
      bannerGlow: "rgba(244,63,94,0.35)",
      badgeBg: "bg-rose-500/20 text-rose-300 border-rose-400/40",
      accentHex: "#f43f5e",
      pageBg: "bg-gradient-to-b from-[#1f080e] via-[#100407] to-black",
    },
    blue: {
      courseName: "C++ High Performance Systems",
      shortName: "C++",
      bannerGradient: "bg-gradient-to-br from-sky-600 via-sky-800 to-indigo-950",
      bannerBorder: "border-sky-400/40",
      bannerGlow: "rgba(14,165,233,0.35)",
      badgeBg: "bg-sky-500/20 text-sky-300 border-sky-400/40",
      accentHex: "#0ea5e9",
      pageBg: "bg-gradient-to-b from-[#061527] via-[#040a14] to-black",
    },
  }[effectiveTheme];

  const [questPoints, setQuestPoints] = useState(8);
  const [friendsQuestProgress, setFriendsQuestProgress] = useState(0);

  // Daily Quests per course
  const [dailyQuestsState, setDailyQuestsState] = useState<
    Record<string, QuestItem[]>
  >(COURSE_DAILY_QUESTS);
  const currentDailyQuests =
    dailyQuestsState[activeCourseKey] || COURSE_DAILY_QUESTS.dsa;

  const [claimedQuests, setClaimedQuests] = useState<Record<string, boolean>>(
    {}
  );
  const [showFindFriendModal, setShowFindFriendModal] = useState(false);
  const [friendCodeInput, setFriendCodeInput] = useState("");

  // Clash Royale slide unbox state for quests
  const [unboxingQuestChest, setUnboxingQuestChest] = useState<{
    tier: QuestChestTier;
    title: string;
    rewardXP: number;
    rewardDiamonds: number;
  } | null>(null);

  const handleSimulateProgress = (id: string) => {
    setDailyQuestsState((prev) => {
      const list = prev[activeCourseKey] || [];
      return {
        ...prev,
        [activeCourseKey]: list.map((q) => {
          if (q.id === id) {
            const next = Math.min(q.total, q.current + 1);
            if (next === q.total && !claimedQuests[id]) {
              setQuestPoints((p) => Math.min(20, p + 4));
            }
            return { ...q, current: next };
          }
          return q;
        }),
      };
    });
  };

  const handleClaimChest = (quest: QuestItem) => {
    if (claimedQuests[quest.id]) return;
    setClaimedQuests((prev) => ({ ...prev, [quest.id]: true }));
    setUnboxingQuestChest({
      tier: quest.chestTier,
      title: `${quest.chestTier.toUpperCase()} CHEST`,
      rewardXP: quest.rewardXP,
      rewardDiamonds: quest.rewardDiamonds,
    });
  };

  const handleClaimFriendsQuest = () => {
    const friendQuestId = "friends-quest-1";
    if (claimedQuests[friendQuestId] || friendsQuestProgress < 1) return;
    setClaimedQuests((prev) => ({ ...prev, [friendQuestId]: true }));
    setQuestPoints((p) => Math.min(20, p + 6));
    setUnboxingQuestChest({
      tier: "deluxe",
      title: "DELUXE CROWN CHEST",
      rewardXP: 60,
      rewardDiamonds: 25,
    });
  };

  return (
    <div
      className="w-full flex flex-col bg-black min-h-full pb-28 select-none text-left relative overflow-hidden"
    >
      {/* Content wrapper */}
      <div className="relative z-10 w-full space-y-4 pt-3">
        {/* =====================================================================
            1. SEPTEMBER QUEST TOP BANNER (CLEAN FULL-WIDTH, NO AIDEN)
            ===================================================================== */}
        <div className="px-4">
          <div
            className="rounded-3xl bg-[#0b0b0e] border border-white/15 px-5 pt-6 pb-5 relative overflow-hidden text-left shadow-[0_8px_30px_rgba(0,0,0,0.85)] transition-all duration-300"
          >
            {/* Background subtle radial sheen */}
            <div className="absolute top-0 right-1/4 w-60 h-60 bg-white/5 rounded-full blur-3xl pointer-events-none" />

            {/* Title & Countdown Header */}
            <div className="relative z-20 w-full mb-3.5">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span
                  className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border bg-cyan-500/20 text-cyan-300 border-cyan-400/40"
                >
                  Monthly Track
                </span>
                <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                  Monthly Event
                </span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight leading-tight">
                September Quest
              </h1>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-black uppercase tracking-wider mt-1">
                <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>24D LEFT</span>
              </div>
            </div>

            {/* Card Inside Banner: 20 Quest Points */}
            <div className="relative z-20 w-full bg-black/75 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/20">
              <div className="flex items-center justify-between text-xs font-black text-white mb-2.5">
                <span>20 Quest Points</span>
                <span className="text-[11px] text-amber-300 font-mono font-bold">
                  {Math.max(0, 20 - questPoints)} to go
                </span>
              </div>

              {/* Clean Progress Bar */}
              <div className="w-full h-3.5 bg-white/10 rounded-full overflow-hidden p-0.5 relative flex items-center justify-center">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-[#58cc02] rounded-full transition-all duration-500 shadow-sm"
                  style={{
                    width: `${Math.min(100, (questPoints / 20) * 100)}%`,
                  }}
                />
                <span className="relative z-10 text-[10px] font-mono font-black text-white drop-shadow">
                  {questPoints} / 20
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================================
            2. DAILY QUESTS SECTION (DSA QUESTIONS ABOVE FRIEND QUEST)
            ===================================================================== */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-2 text-xs font-black uppercase tracking-wider text-slate-400">
            <span>{themeConfig.shortName} DAILY QUESTS</span>
            <div className="flex items-center gap-1 font-mono text-amber-400">
              <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>RESETS IN 8H</span>
            </div>
          </div>

          {/* List of Daily Quests with No Subtitles */}
          <div className="space-y-2.5">
            {currentDailyQuests.map((quest) => {
              const isFinished = quest.current >= quest.total;
              const isClaimed = claimedQuests[quest.id];

              return (
                <div
                  key={quest.id}
                  className="bg-black/60 backdrop-blur-md rounded-2xl border border-white/15 p-3.5 flex items-center justify-between gap-4 group hover:border-white/30 transition-all shadow-md"
                >
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                      {quest.title}
                    </h4>

                    {/* Clean Progress Bar (Clickable to simulate practice) */}
                    <div
                      onClick={() => handleSimulateProgress(quest.id)}
                      className="w-full h-3.5 bg-white/10 hover:bg-white/15 rounded-full overflow-hidden p-0.5 relative flex items-center justify-center cursor-pointer transition-colors"
                      title="Tap to make progress"
                    >
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-[#58cc02] rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            (quest.current / quest.total) * 100
                          )}%`,
                        }}
                      />
                      <span className="relative z-10 text-[10px] font-mono font-black text-slate-200">
                        {quest.current} / {quest.total}
                      </span>
                    </div>
                  </div>

                  {/* Redesigned Clash Royale Map-Style Chest Reward */}
                  <div className="flex flex-col items-center justify-center">
                    <QuestRewardChest
                      tier={quest.chestTier}
                      size="sm"
                      isReadyToClaim={isFinished && !isClaimed}
                      isClaimed={isClaimed}
                      onClick={() => {
                        if (isFinished && !isClaimed) {
                          handleClaimChest(quest);
                        } else {
                          handleSimulateProgress(quest.id);
                        }
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================================================
            3. FRIENDS QUEST SECTION (CLEAN - NO SUBTITLES)
            ===================================================================== */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-2 text-xs font-black uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              FRIENDS QUEST
            </span>
            <div className="flex items-center gap-1 font-mono text-cyan-400">
              <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>4D LEFT</span>
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-md rounded-3xl border border-white/15 p-4 shadow-lg">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white mb-2">
                  Follow your first friend
                </h3>

                {/* Clean Progress Bar */}
                <div className="w-full h-3.5 bg-white/10 rounded-full overflow-hidden p-0.5 relative flex items-center justify-center">
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-[#58cc02] rounded-full transition-all duration-500"
                    style={{ width: `${friendsQuestProgress * 100}%` }}
                  />
                  <span className="relative z-10 text-[10px] font-mono font-black text-slate-300">
                    {friendsQuestProgress} / 1
                  </span>
                </div>
              </div>

              {/* Clash Royale Deluxe Crown Chest */}
              <div className="flex flex-col items-center">
                <QuestRewardChest
                  tier="deluxe"
                  size="md"
                  isReadyToClaim={
                    friendsQuestProgress >= 1 &&
                    !claimedQuests["friends-quest-1"]
                  }
                  isClaimed={!!claimedQuests["friends-quest-1"]}
                  onClick={() => {
                    if (
                      friendsQuestProgress >= 1 &&
                      !claimedQuests["friends-quest-1"]
                    ) {
                      handleClaimFriendsQuest();
                    } else {
                      setShowFindFriendModal(true);
                    }
                  }}
                />
              </div>
            </div>

            <button
              onClick={() => setShowFindFriendModal(true)}
              className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] shadow-md"
              id="find-friend-btn"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              <span>FIND A FRIEND</span>
            </button>
          </div>
        </div>
      </div>

      {/* Find a Friend Modal */}
      {showFindFriendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-[#131f24] border-2 border-[#37464f] rounded-3xl p-5 shadow-2xl text-left relative"
          >
            <div className="flex items-center gap-2 mb-3">
              <UserPlus className="w-5 h-5 text-[#1cb0f6]" />
              <h3 className="text-base font-black text-white">Find a Friend</h3>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Add fellow learners in {themeConfig.courseName} to team up for
              weekly Friend Quests and unlock Clash Royale Crown Chests
              together!
            </p>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Enter username or friend code..."
                value={friendCodeInput}
                onChange={(e) => setFriendCodeInput(e.target.value)}
                className="flex-1 bg-[#18262d] border border-[#273842] rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#1cb0f6]"
              />
              <button
                onClick={() => {
                  setFriendsQuestProgress(1);
                  setQuestPoints((p) => Math.min(20, p + 5));
                  setShowFindFriendModal(false);
                }}
                className="px-4 py-2 bg-[#1cb0f6] hover:bg-[#0284c7] text-slate-950 font-black text-xs rounded-xl uppercase tracking-wider cursor-pointer"
              >
                Add
              </button>
            </div>

            <button
              onClick={() => setShowFindFriendModal(false)}
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}

      {/* Unified Pixel Chest Unbox for Quests */}
      {unboxingQuestChest && (
        <PixelChestOpeningModal
          isOpen={true}
          tier={unboxingQuestChest.tier}
          rewards={{
            xp: unboxingQuestChest.rewardXP,
            diamonds: unboxingQuestChest.rewardDiamonds,
            trophies: 25,
            sourceTitle: unboxingQuestChest.title,
            tier: unboxingQuestChest.tier,
          }}
          onClose={() => setUnboxingQuestChest(null)}
          onCollect={() => {
            if (onClaimReward) {
              onClaimReward(
                unboxingQuestChest.rewardXP,
                unboxingQuestChest.rewardDiamonds
              );
            }
            if (auth.currentUser) {
              claimQuestReward(
                auth.currentUser.uid,
                unboxingQuestChest.title,
                {
                  xp: unboxingQuestChest.rewardXP,
                  diamonds: unboxingQuestChest.rewardDiamonds,
                }
              ).catch((err) => {
                console.warn("Could not sync quest claim to Firestore:", err);
              });
            }
            setUnboxingQuestChest(null);
          }}
        />
      )}
    </div>
  );
};
