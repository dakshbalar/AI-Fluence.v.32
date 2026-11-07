import React, { useState, useMemo, useEffect } from "react";
import {
  Code2,
  BookOpen,
  Lock,
  Play,
  X,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { CourseSection, CourseLevel, CourseTheme } from "../../data/coursesData";
import { UnitBanner } from "./UnitBanner";
import { AidenDailyGoalsSlide } from "./AidenDailyGoalsSlide";
import {
  loadStoredDailyActivity,
  loadStoredStudentProfile,
  loadStoredCommitment,
} from "../../utils/engagementStore";
import { auth } from "../../firebase";
import { activeTimeTracker } from "../../services/activeTimeTracker";
import { fetchOrCreateStudentDailyQuests } from "../../services/dailyQuestService";

interface FullLearningMapProps {
  courseId: string;
  courseTitle: string;
  themeColor?: CourseTheme | "emerald" | "cyan" | "amber";
  sections?: CourseSection[];
  activeSectionNumber?: number;
  onSelectSection?: (sectionNumber: number) => void;
  onLaunchLesson: (levelId: number, courseId: string, track?: "theory" | "questions") => void;
  onOpenChestReward?: () => void;
  onClaimXp?: (amount: number) => void;
  onClaimDiamonds?: (amount: number) => void;
  onActivateUnlimitedLives?: (hours: number) => void;
  unitBanner?: React.ReactNode;
  onClaimAirdrop?: (diamonds: number, xp: number, name: string) => void;
  onShowToast?: (msg: string) => void;
  onSelectCourse?: (courseId: string) => void;
  activeTrack?: "theory" | "questions";
  onSelectTrack?: (track: "theory" | "questions") => void;
}

export const FullLearningMap: React.FC<FullLearningMapProps> = ({
  courseId,
  courseTitle,
  themeColor = "yellow",
  sections = [],
  activeSectionNumber = 1,
  onSelectSection,
  onLaunchLesson,
  onOpenChestReward,
  onSelectCourse,
  onShowToast,
  activeTrack,
  onSelectTrack,
}) => {
  // Top Active Tab: "q" (Questions Roadmap) vs "t" (Theory Reading Roadmap)
  const [activeTab, setActiveTab] = useState<"q" | "t">(
    activeTrack === "theory" ? "t" : "q"
  );

  React.useEffect(() => {
    if (activeTrack) {
      setActiveTab(activeTrack === "theory" ? "t" : "q");
    }
  }, [activeTrack]);

  // Selected Level Popover
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | null>(null);

  // Shaking level box state on locked tap
  const [shakingLevelId, setShakingLevelId] = useState<string | number | null>(null);

  // Daily Tasks Drawer modal state
  const [isDailyGoalsOpen, setIsDailyGoalsOpen] = useState<boolean>(false);

  // Chest claimed state tracking
  const [isChestClaimed, setIsChestClaimed] = useState<boolean>(false);

  // Normalize active track key for data-track CSS variables ("everyone", "genai", "dsa")
  // Generative AI -> "genai" (Blue)
  // DSA -> "dsa" (Purple)
  // AI for Everyone -> "everyone" (Yellow)
  const trackKey = useMemo(() => {
    const key = (courseId || "").toLowerCase();
    if (key === "generative_ai" || key.includes("genai") || key.includes("generative")) return "genai";
    if (key === "ai_for_everyone" || key.includes("everyone")) return "everyone";
    return "dsa";
  }, [courseId]);

  // Current active section derived from activeSectionNumber
  const currentSection: CourseSection = useMemo(() => {
    if (!sections || sections.length === 0) {
      return {
        sectionNumber: 1,
        sectionTitle: "Section 1",
        unitNumber: 1,
        unitTitle: "Core Foundations",
        unitDescription: "Fundamental concepts and interactive coding levels.",
        theme: themeColor as CourseTheme,
        levels: [],
      };
    }
    return (
      sections.find((s) => s.sectionNumber === activeSectionNumber) ||
      sections[0]
    );
  }, [sections, activeSectionNumber, themeColor]);

  const levelsList = useMemo(() => {
    return currentSection.levels || [];
  }, [currentSection.levels]);

  const completedLevelsCount = useMemo(() => {
    return levelsList.filter((l) => l.status === "completed").length;
  }, [levelsList]);

  const totalLevelsCount = useMemo(() => {
    return levelsList.length || 5;
  }, [levelsList]);

  const isSectionCleared = completedLevelsCount >= totalLevelsCount;

  // Daily tasks completion status (synced with dailyQuestService)
  const [dailyTasksData, setDailyTasksData] = useState<{ done: number; total: number }>({ done: 0, total: 5 });

  useEffect(() => {
    let isMounted = true;
    const userId = auth.currentUser?.uid || loadStoredStudentProfile()?.userId || "guest_user";
    const activeMins = activeTimeTracker.getActiveMinutes();

    fetchOrCreateStudentDailyQuests(userId, courseId)
      .then((doc) => {
        if (!isMounted) return;
        const quests = doc.quests || [];
        const synced = quests.map((q) => {
          if (q.category === "time" || q.id.includes("2")) {
            return { ...q, p: Math.max(q.p || 0, Math.min(q.g, activeMins)) };
          }
          return q;
        });
        const done = synced.filter((q) => q.p >= q.g).length;
        setDailyTasksData({ done, total: synced.length || 5 });
      })
      .catch(() => {
        if (!isMounted) return;
        setDailyTasksData({ done: 0, total: 5 });
      });

    return () => {
      isMounted = false;
    };
  }, [courseId, isDailyGoalsOpen]);

  const dailyTasksState = dailyTasksData;

  // Layout parameters from HTML specification
  const XS = [50, 27, 68, 30, 66, 50];
  const GAP = 190;
  const TOP = 58;
  const layoutHeight = TOP + (levelsList.length || 5) * GAP + 190;

  // Build connecting SVG curve path across nodes
  const pathSVG = useMemo(() => {
    const W = 340; // Relative viewport width
    const pts = XS.map((x, i) => [W * (x / 100), TOP + i * GAP + 48]);
    let d = "";
    const nodeCount = Math.min(levelsList.length, 5);
    for (let i = 0; i < nodeCount; i++) {
      const p = pts[i];
      const q = pts[i + 1] || pts[i];
      d += `M${p[0]},${p[1]} C${p[0]},${p[1] + 95} ${q[0]},${q[1] - 95} ${q[0]},${q[1]} `;
    }
    return d;
  }, [levelsList.length]);

  const handleLevelClick = (lvl: CourseLevel) => {
    if (lvl.status === "locked") {
      setShakingLevelId(lvl.id);
      setTimeout(() => setShakingLevelId(null), 400);
      onShowToast?.("Clear the previous level first!");
      return;
    }
    setSelectedLevel(lvl);
  };

  // Next or current playable level in this section
  const playableLevel = useMemo(() => {
    return (
      levelsList.find((l) => l.status === "current") ||
      levelsList.find((l) => l.status !== "completed") ||
      levelsList[0]
    );
  }, [levelsList]);

  const playableLevelIndex = useMemo(() => {
    if (!playableLevel) return 0;
    const idx = levelsList.findIndex((l) => l.id === playableLevel.id);
    return idx >= 0 ? idx : 0;
  }, [levelsList, playableLevel]);

  // Track if current playable level is outside the viewport
  const [isPlayableVisible, setIsPlayableVisible] = useState(true);
  const [playableDirection, setPlayableDirection] = useState<"down" | "up">("down");
  const [highlightNodeId, setHighlightNodeId] = useState<string | number | null>(null);

  useEffect(() => {
    if (!playableLevel) return;

    const checkPlayableVisibility = () => {
      const el = document.getElementById(`level-node-${playableLevel.id}`);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;

      // Visible if within viewport (accounting for banner ~120px and bottom nav ~75px)
      const isVisible = rect.top >= 90 && rect.bottom <= vh - 75;
      setIsPlayableVisible(isVisible);

      if (rect.top > vh - 75) {
        setPlayableDirection("down");
      } else if (rect.bottom < 90) {
        setPlayableDirection("up");
      }
    };

    const timer = setTimeout(checkPlayableVisibility, 200);
    window.addEventListener("scroll", checkPlayableVisibility, { passive: true });
    window.addEventListener("resize", checkPlayableVisibility);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", checkPlayableVisibility);
      window.removeEventListener("resize", checkPlayableVisibility);
    };
  }, [playableLevel, activeSectionNumber, activeTab]);

  const handleJumpToPlayable = () => {
    if (!playableLevel) return;
    const el = document.getElementById(`level-node-${playableLevel.id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightNodeId(playableLevel.id);
      setTimeout(() => setHighlightNodeId(null), 2500);
    }
  };

  // 5-second idle detection when "Play Level N" button is active (off-screen)
  const [isIdleSpotlightActive, setIsIdleSpotlightActive] = useState<boolean>(false);
  const idleTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If playable level is visible, no need to spotlight
    if (isPlayableVisible || !playableLevel) {
      setIsIdleSpotlightActive(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      return;
    }

    const resetIdleTimer = () => {
      setIsIdleSpotlightActive(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        setIsIdleSpotlightActive(true);
      }, 5000); // 5 seconds of inactivity
    };

    resetIdleTimer();

    const activityEvents = [
      "touchstart",
      "touchend",
      "touchmove",
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "wheel",
    ];

    activityEvents.forEach((evt) => {
      window.addEventListener(evt, resetIdleTimer, { passive: true });
    });

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, resetIdleTimer);
      });
    };
  }, [isPlayableVisible, playableLevel]);

  const handleClaimChest = () => {
    if (!isSectionCleared) {
      onShowToast?.("Clear all 5 levels to open the reward chest!");
      return;
    }
    if (isChestClaimed) {
      onShowToast?.("Chest already claimed for this section!");
      return;
    }
    setIsChestClaimed(true);
    onOpenChestReward?.();
    onShowToast?.("🎉 Chest Opened! +50 XP & Bonus Loot!");
  };

  // Summary list of all sections for dropdown summary
  const allSectionsSummary = useMemo(() => {
    return sections.map((s) => ({
      sectionNumber: s.sectionNumber,
      sectionTitle: s.sectionTitle,
      unitNumber: s.unitNumber,
      unitTitle: s.unitTitle,
      levelCount: s.levels?.length || 5,
      completedCount: (s.levels || []).filter((l) => l.status === "completed").length,
    }));
  }, [sections]);

  return (
    <div
      className="w-full min-h-screen bg-[#0C0C0C] text-[#D7E2EA] font-kanit select-none relative overflow-x-hidden"
      data-track={trackKey}
    >
      {/* Centered Wrap Container (.wrap) max 520px */}
      <div className="wrap max-w-[520px] mx-auto px-4 pt-4 pb-36 relative">
        {/* =========================================================================
            1. TOP TABS: QUESTIONS vs THEORY (.tabs)
            ========================================================================= */}
        <div className="tabs">
          <button
            onClick={() => {
              setActiveTab("q");
              onSelectTrack?.("questions");
            }}
            className={`tab ${activeTab === "q" ? "on" : ""}`}
          >
            <Code2
              className={`w-5 h-5 stroke-[2.4] transition-all duration-300 ${
                activeTab === "q" ? "scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.85)] animate-pulse" : ""
              }`}
            />
            <span>QUESTIONS</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("t");
              onSelectTrack?.("theory");
            }}
            className={`tab ${activeTab === "t" ? "on" : ""}`}
          >
            <BookOpen
              className={`w-5 h-5 stroke-[2.2] transition-all duration-300 ${
                activeTab === "t" ? "scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.85)] animate-pulse" : ""
              }`}
            />
            <span>THEORY</span>
          </button>
        </div>

        {/* =========================================================================
            2. TRACK SWITCHER PILLS (.trk)
            ========================================================================= */}
        <div className="trk">
          <button
            onClick={() => onSelectCourse?.("generative_ai")}
            className={`tk ${trackKey === "genai" ? "on" : ""}`}
          >
            {trackKey === "genai" && (
              <span className="inline-block w-2 h-2 rounded-full bg-white mr-1.5 shadow-[0_0_8px_#fff] animate-pulse" />
            )}
            GENERATIVE AI
          </button>

          <button
            onClick={() => onSelectCourse?.("ai_for_everyone")}
            className={`tk ${trackKey === "everyone" ? "on" : ""}`}
          >
            {trackKey === "everyone" && (
              <span className="inline-block w-2 h-2 rounded-full bg-white mr-1.5 shadow-[0_0_8px_#fff] animate-pulse" />
            )}
            AI FOR EVERYONE
          </button>

          <button
            onClick={() => onSelectCourse?.("dsa")}
            className={`tk ${trackKey === "dsa" ? "on" : ""}`}
          >
            {trackKey === "dsa" && (
              <span className="inline-block w-2 h-2 rounded-full bg-white mr-1.5 shadow-[0_0_8px_#fff] animate-pulse" />
            )}
            DSA
          </button>
        </div>

        {/* =========================================================================
            3. SECTION HEADER BANNER (.sec)
            ========================================================================= */}
        <UnitBanner
          sectionNumber={currentSection.sectionNumber}
          totalSections={sections.length || 4}
          unitNumber={currentSection.unitNumber}
          unitTitle={currentSection.unitTitle || currentSection.sectionTitle}
          courseName={
            trackKey === "everyone"
              ? "AI for Everyone"
              : trackKey === "genai"
              ? "Generative AI"
              : "DSA"
          }
          themeColor={themeColor as any}
          allSections={allSectionsSummary}
          onSelectSection={(num) => onSelectSection?.(num)}
          onPrevSection={() => {
            if (activeSectionNumber > 1) {
              onSelectSection?.(activeSectionNumber - 1);
            }
          }}
          onNextSection={() => {
            if (activeSectionNumber < sections.length) {
              onSelectSection?.(activeSectionNumber + 1);
            }
          }}
          onOpenGuidebook={() => {
            setActiveTab("t");
            onSelectTrack?.("theory");
          }}
        />

        {/* =========================================================================
            4. INTERACTIVE WINDING MAP VIEW (.map / #qv)
            ========================================================================= */}
        <div
          id="qv"
          className="map relative mt-2 w-full select-none"
          style={{ height: `${layoutHeight}px` }}
        >
          {/* Ambient Background Floating Decoration (.spark, .moon, .cube) */}
          <div className="spark absolute top-1.5 left-0.5 text-[var(--b1)] animate-[tw_3s_ease-in-out_infinite] drop-shadow-[0_0_8px_rgba(var(--rgb),.8)]">
            <Sparkles className="w-7.5 h-7.5" />
          </div>
          <div className="spark absolute top-1.5 right-0.5 text-[var(--b1)] animate-[tw_3s_ease-in-out_infinite_1.2s] drop-shadow-[0_0_8px_rgba(var(--rgb),.8)]">
            <Sparkles className="w-7.5 h-7.5" />
          </div>
          <div className="moon absolute -left-3.5 top-[420px] w-14 h-14 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#BBCCD7_40%,#4a5160)] shadow-[inset_-8px_-6px_14px_rgba(0,0,0,.5)] opacity-40 animate-[fl_6s_ease-in-out_infinite]" />
          <div className="cube absolute -right-2 top-[780px] w-12.5 h-12.5 rounded-[22%] bg-gradient-to-br from-[var(--b1)] via-[var(--b2)] to-[var(--b0)] shadow-[inset_4px_4px_10px_rgba(255,255,255,.3)] rotate-18 opacity-40 animate-[fl_7s_ease-in-out_infinite]" />

          {/* SVG Glowing Path */}
          <svg
            className="path absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            viewBox={`0 0 340 ${layoutHeight}`}
          >
            <g className="seg-on">
              <path
                d={pathSVG}
                fill="none"
                strokeLinecap="round"
                strokeWidth="32"
                style={{ stroke: "rgba(var(--rgb),.35)" }}
              />
              <path
                d={pathSVG}
                fill="none"
                strokeWidth="7"
                strokeDasharray="14 16"
                className="path-flow"
                style={{ stroke: "var(--b1)" }}
              />
            </g>
          </svg>

          {/* Interactive Level Nodes */}
          {levelsList.map((lvl, i) => {
            const status = lvl.status; // "completed" | "current" | "locked"
            const isDone = status === "completed";
            const isCur = status === "current";
            const isLock = status === "locked";
            const xPct = XS[i % XS.length];
            const topPx = TOP + i * GAP;
            const isShaking = shakingLevelId === lvl.id;
            const starCount = lvl.stars !== undefined ? lvl.stars : (isDone ? 3 : 0);
            const isThreeStars = starCount === 3;

            return (
              <div
                key={lvl.id}
                id={`level-node-${lvl.id}`}
                className={`node absolute w-[160px] -ml-[80px] flex flex-col items-center z-10 transition-transform ${
                  isLock ? "lock-n opacity-80" : ""
                }`}
                style={{ left: `${xPct}%`, top: `${topPx}px` }}
              >
                {/* Ambient Radial Glow Halo behind Level Box */}
                <div
                  className={`absolute -top-4 w-40 h-40 rounded-full pointer-events-none transition-all duration-700 ${
                    isThreeStars
                      ? "bg-[radial-gradient(circle,rgba(255,215,0,0.5)_0%,transparent_70%)] animate-pulse"
                      : isCur
                      ? "bg-[radial-gradient(circle,rgba(var(--rgb),0.6)_0%,transparent_70%)] animate-pulse"
                      : isDone
                      ? "bg-[radial-gradient(circle,rgba(var(--rgb),0.35)_0%,transparent_70%)]"
                      : "bg-[radial-gradient(circle,rgba(var(--rgb),0.15)_0%,transparent_70%)]"
                  } ${highlightNodeId === lvl.id ? "scale-125 !bg-[radial-gradient(circle,rgba(255,255,255,0.85)_0%,transparent_70%)]" : ""}`}
                />

                {/* Floating START / READ Badge on Active Node */}
                {isCur && (
                  <div className="start">
                    <Play className="w-3 h-3 fill-current" />
                    <span>{activeTab === "t" ? "READ" : "START"}</span>
                  </div>
                )}

                {/* 96x96px 3D Level Box (.box) with Golden 3-Star Mastered Styling */}
                <div className="relative">
                  <button
                    onClick={() => handleLevelClick(lvl)}
                    className={`box ${isCur ? "cur" : isDone ? "done" : "lock"} ${
                      isThreeStars ? "three-stars" : ""
                    } ${isShaking ? "shake" : ""} ${
                      highlightNodeId === lvl.id ? "ring-4 ring-white animate-bounce" : ""
                    }`}
                    aria-label={`Level ${i + 1}: ${lvl.title}`}
                  >
                    <span className="code">&lt;/&gt;</span>

                    {isLock ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="11" width="16" height="10" rx="3"/>
                        <path d="M8 11V8a4 4 0 018 0v3"/>
                      </svg>
                    ) : (
                      <span className="num">{i + 1}</span>
                    )}
                  </button>

                  {/* 3-Star Trophy Sparkle Badge */}
                  {isThreeStars && (
                    <div
                      className="absolute -top-2.5 -right-2.5 bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-500 text-black p-1.5 rounded-full shadow-[0_0_15px_rgba(255,215,0,1)] border-2 border-white flex items-center justify-center animate-pulse z-10 pointer-events-none"
                      title="3 Stars Mastered!"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                    </div>
                  )}
                </div>

                {/* 3-Star Rating Pill Bar (.stars) */}
                <div className={`stars ${isThreeStars ? "three-stars" : ""}`}>
                  {[0, 1, 2].map((sIdx) => {
                    const isStarActive = sIdx < starCount;
                    return (
                      <svg key={sIdx} viewBox="0 0 24 24">
                        <polygon
                          points="12,2 15,9 22,9.5 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9.5 9,9"
                          fill={isStarActive ? "#FFD84D" : "none"}
                          stroke={isStarActive ? "#FFD84D" : "#4a5568"}
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                      </svg>
                    );
                  })}
                </div>

                {/* Level Title Badge (.nm) */}
                <div className="nm">{lvl.title}</div>
              </div>
            );
          })}

          {/* Section Reward Chest at Bottom of Roadmap */}
          <div
            className="node"
            style={{
              left: `${XS[5]}%`,
              top: `${TOP + (levelsList.length || 5) * GAP}px`,
            }}
          >
            <div
              onClick={handleClaimChest}
              className={`chest ${isChestClaimed ? "open" : ""}`}
              id="chest"
              title="Section Completion Chest"
            >
              <svg width="120" viewBox="0 0 120 100">
                <ellipse cx="60" cy="92" rx="48" ry="7" fill="rgba(0,0,0,.55)" />
                <rect x="14" y="44" width="92" height="44" rx="8" fill="#1a1f2b" stroke="#4a5160" strokeWidth="2" />
                <g className={`lid ${isChestClaimed ? "open" : ""}`}>
                  <path d="M14 46Q14 14 60 14Q106 14 106 46Z" fill="#232938" stroke="#646973" strokeWidth="2" />
                </g>
                <rect x="32" y="44" width="10" height="44" fill="#BBCCD7" opacity=".75" />
                <rect x="78" y="44" width="10" height="44" fill="#BBCCD7" opacity=".75" />
                <rect
                  x="52"
                  y="40"
                  width="16"
                  height="22"
                  rx="4"
                  fill={isSectionCleared ? "var(--b2)" : "#646973"}
                  stroke="#0C0C0C"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="nm">
              {isChestClaimed ? "Claimed" : isSectionCleared ? "Tap to open" : "Reward"}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4b. 5-SECOND INACTIVITY EXPOSURE REDUCTION / SCREEN DIMMING SPOTLIGHT (Z-50)
          ========================================================================= */}
      <div
        onClick={() => setIsIdleSpotlightActive(false)}
        className={`fixed inset-0 z-50 bg-black/85 backdrop-blur-[2px] transition-opacity duration-1000 ease-in-out cursor-pointer ${
          isIdleSpotlightActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
        title="Tap anywhere to restore brightness"
      />

      {/* =========================================================================
          5. FLOATING OFF-SCREEN PLAYABLE LEVEL JUMP POPUP (Z-60 ABOVE DIMMING)
          ========================================================================= */}
      {!isPlayableVisible && playableLevel && (
        <div
          className={`fixed bottom-[calc(84px+env(safe-area-inset-bottom,0px))] left-4 sm:left-6 z-60 max-w-[calc(100vw-190px)] sm:max-w-none transition-all duration-700 ${
            isIdleSpotlightActive ? "scale-105 sm:scale-110" : ""
          }`}
        >
          <div className="relative">
            {/* Spotlight Callout Hint attached directly above the button */}
            {isIdleSpotlightActive && (
              <div className="absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none animate-bounce z-20">
                <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-black font-extrabold text-[11px] uppercase tracking-wider shadow-[0_4px_20px_rgba(0,0,0,0.6)] border border-white">
                  <span>MISSION READY</span>
                  <span>👇</span>
                </div>
              </div>
            )}

            {/* Spotlight Radar Aura when idle spotlight is active */}
            {isIdleSpotlightActive && (
              <div className="absolute -inset-4 rounded-full bg-[radial-gradient(circle,rgba(var(--rgb),0.85)_0%,transparent_70%)] animate-ping pointer-events-none" />
            )}

            <button
              onClick={() => {
                setIsIdleSpotlightActive(false);
                handleJumpToPlayable();
              }}
              className={`group flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-full font-kanit font-extrabold text-xs sm:text-sm uppercase tracking-wider text-[var(--on)] bg-gradient-to-r from-[var(--b1)] via-[var(--b2)] to-[var(--b3)] border-2 border-white shadow-[0_8px_30px_rgba(var(--rgb),0.8),0_4px_14px_rgba(0,0,0,0.85)] active:scale-95 transition-all cursor-pointer animate-in fade-in slide-in-from-bottom-3 duration-200 ${
                isIdleSpotlightActive
                  ? "ring-4 ring-white shadow-[0_0_40px_rgba(var(--rgb),1),0_0_80px_rgba(var(--rgb),0.85)] animate-pulse"
                  : ""
              }`}
              title={`Jump to Level ${playableLevelIndex + 1}`}
            >
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-85"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <span className="truncate font-black">
                {activeTab === "t" ? "READ" : "PLAY"} LEVEL {playableLevelIndex + 1}
              </span>
              {playableDirection === "down" ? (
                <ChevronDown className="w-4 h-4 shrink-0 animate-bounce" />
              ) : (
                <ChevronUp className="w-4 h-4 shrink-0 animate-bounce" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. FLOATING TASKS FAB (.fab) - LEFT-TO-RIGHT PROGRESS FILL CONTAINER
          ========================================================================= */}
      {(() => {
        const dailyFillPct = Math.min(
          100,
          Math.round(((dailyTasksState.done || 0) / Math.max(dailyTasksState.total || 3, 1)) * 100)
        );

        return (
          <button
            onClick={() => setIsDailyGoalsOpen(true)}
            className={`fab relative overflow-hidden transition-all duration-700 ${
              isIdleSpotlightActive ? "opacity-25 pointer-events-none filter brightness-50" : "opacity-100"
            }`}
            id="fab"
            title="Open Daily Tasks"
          >
            {/* Progress Fill Layer (Left to Right filling) */}
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--b0)] via-[var(--b3)] to-[var(--b2)] transition-all duration-700 ease-out pointer-events-none"
              style={{ width: `${dailyFillPct}%` }}
            />

            {/* Glowing Leading Divider Line */}
            {dailyFillPct > 0 && dailyFillPct < 100 && (
              <div
                className="absolute inset-y-0 w-1 bg-white shadow-[0_0_10px_#fff,0_0_18px_var(--b1)] pointer-events-none transition-all duration-700 ease-out"
                style={{ left: `calc(${dailyFillPct}% - 2px)` }}
              />
            )}

            {/* 100% Complete Celebration Shimmer */}
            {dailyFillPct === 100 && (
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-yellow-200/40 to-amber-400/20 animate-pulse pointer-events-none" />
            )}

            {/* Foreground Content */}
            <div className="relative z-10 flex items-center gap-2.5">
              <div className="relative shrink-0">
                <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7 drop-shadow-md">
                  <circle cx="15" cy="17" r="12" fill="#fff" stroke="#E6392B" strokeWidth="2" />
                  <circle cx="15" cy="17" r="8" fill="#E6392B" />
                  <circle cx="15" cy="17" r="4" fill="#fff" />
                  <circle cx="15" cy="17" r="1.6" fill="#E6392B" />
                  <path d="M15 17L27 5" stroke="#4FA3FF" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
                {dailyFillPct === 100 && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <small className="text-[0.62rem] font-bold tracking-[0.14em] uppercase text-white/75">TASKS</small>
                  {dailyFillPct > 0 && (
                    <span className="text-[9px] font-mono font-bold text-white/90 bg-black/40 px-1 py-0.2 rounded">
                      {dailyFillPct}%
                    </span>
                  )}
                </div>
                <b id="tk" className="block text-sm font-black tracking-wide text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {dailyFillPct === 100 ? "3/3 DONE! 🎉" : `${dailyTasksState.done}/${dailyTasksState.total} DONE`}
                </b>
              </div>
            </div>
          </button>
        );
      })()}

      {/* =========================================================================
          7. LEVEL LAUNCH PREVIEW POPOVER MODAL
          ========================================================================= */}
      {selectedLevel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#0C0C0C] border-2 border-[var(--bd)] rounded-[32px] p-6 shadow-2xl text-white relative flex flex-col text-left">
            <button
              onClick={() => setSelectedLevel(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-[rgba(var(--rgb),.2)] text-[var(--b1)] px-3 py-1 rounded-full border border-[var(--bd)]">
                {activeTab === "t" ? "THEORY CONCEPT" : "INTERACTIVE DRILL"}
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-2 leading-tight">
              {selectedLevel.title}
            </h3>

            <p className="text-xs text-slate-300 mb-5 leading-relaxed font-mono">
              {selectedLevel.subtitle ||
                "Master this concept through guided theory decks and interactive drill questions."}
            </p>

            <button
              onClick={() => {
                const targetLvl = selectedLevel;
                setSelectedLevel(null);
                onLaunchLesson(
                  typeof targetLvl.id === "number"
                    ? targetLvl.id
                    : parseInt(String(targetLvl.id), 10) || 1,
                  courseId,
                  activeTab === "t" ? "theory" : "questions"
                );
              }}
              className="w-full py-3.5 rounded-[20px] font-extrabold text-sm uppercase tracking-wider text-[var(--on)] bg-gradient-to-r from-[var(--b1)] via-[var(--b2)] to-[var(--b3)] shadow-xl cursor-pointer transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{activeTab === "t" ? "READ THEORY" : "LAUNCH LESSON"}</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          8. DAILY TASKS DRAWER MODAL
          ========================================================================= */}
      <AidenDailyGoalsSlide
        isOpen={isDailyGoalsOpen}
        onClose={() => setIsDailyGoalsOpen(false)}
        courseId={courseId}
        onLaunchLesson={() => {
          setIsDailyGoalsOpen(false);
          if (levelsList.length > 0) {
            onLaunchLesson(
              typeof levelsList[0].id === "number"
                ? levelsList[0].id
                : parseInt(String(levelsList[0].id), 10) || 1,
              courseId,
              activeTab === "t" ? "theory" : "questions"
            );
          }
        }}
        onLaunchQuiz={() => {
          setIsDailyGoalsOpen(false);
          if (levelsList.length > 0) {
            onLaunchLesson(
              typeof levelsList[0].id === "number"
                ? levelsList[0].id
                : parseInt(String(levelsList[0].id), 10) || 1,
              courseId,
              "questions"
            );
          }
        }}
        onLaunchFlashcards={() => {
          setIsDailyGoalsOpen(false);
          onShowToast?.("⚡ Launching Practice Flashcards!");
        }}
        onShareStreak={() => {
          setIsDailyGoalsOpen(false);
          onShowToast?.("🔥 Streak shared to class feed!");
        }}
      />
    </div>
  );
};
