import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Smartphone, Maximize2, ArrowLeft, Star } from "lucide-react";
import { CourseStatusBar } from "./CourseStatusBar";
import { UnitBanner } from "./UnitBanner";
import { CourseSelectorDropdown, DropdownCourse } from "./CourseSelectorDropdown";
import { FullLearningMap } from "./FullLearningMap";
import { BottomNavBar, BottomNavTab } from "./BottomNavBar";
import { AcademyCurriculumPage } from "./AcademyCurriculumPage";
import { QuestsPage } from "./QuestsPage";
import { LeaderboardPage } from "./LeaderboardPage";
import { StorePage } from "./StorePage";
import { AvatarProfilePage } from "./AvatarProfilePage";
import { MoreSettingsPage } from "./MoreSettingsPage";
import {
  COURSES_CATALOG,
  DEFAULT_COURSE_ID,
  getStoredCourseId,
  persistCourseId,
  getStoredEnrolledCourseIds,
  enrollInCourse,
  CourseDefinition,
} from "../../data/coursesData";
import { ClanShieldColor } from "./ClanShield";
import { getStoredCurrentClan } from "../../data/clansData";
import { getLeagueForTrophies } from "../../data/leaguesData";
import { COURSE_LEADERBOARDS } from "../../data/courseGamificationData";
import {
  GENAI_THEORY_COURSE_SECTIONS,
  GENAI_QUESTIONS_COURSE_SECTIONS,
} from "../../data/allCoursesTracksData";
import {
  AI_FOR_EVERYONE_THEORY_SECTIONS,
  AI_FOR_EVERYONE_QUESTIONS_SECTIONS,
} from "../../data/aiForEveryoneData";
import {
  getGenAILessonById,
  GENAI_SUBJECTS_MAP,
  getGenAISectionsForSubject,
  GenAISubjectId,
} from "../../data/genaiCoursesData";
import { DuolingoTheoryLessonModal } from "./DuolingoTheoryLessonModal";
import { GenAITheorySlideReaderModal } from "./GenAITheorySlideReaderModal";
import { PixelChestOpeningModal, ChestRewardsData } from "./PixelChestOpeningModal";
import { GenAILesson, PROMPT_ENGINEERING_LESSONS } from "../../data/genaiPromptEngineeringData";
import { FINE_TUNING_LESSONS } from "../../data/genaiFineTuningData";
import { RAG_LESSONS } from "../../data/genaiRagData";
import { CloudTransition } from "../transitions/CloudTransition";
import { useGamification } from "../../utils/gamificationStore";
import { AIFluence153LearningExperience } from "./AIFluence153LearningExperience";
import { TheoryDeckSlideModal } from "./TheoryDeckSlideModal";
import { QuizDeckPlayerModal } from "./QuizDeckPlayerModal";
import { SectionSelectorDrawerModal } from "./SectionSelectorDrawerModal";
import { getOrGenerateLevelContent } from "../../services/slideGenerationService";
import { getLevelById, ALL_COURSES } from "../../data/levelPlanData";
import { GeneratedLevelDecks } from "../../types/curriculum";

// Map Catalog to Dropdown Course format
const dropdownCoursesList: DropdownCourse[] = COURSES_CATALOG.map((course) => ({
  id: course.id,
  code: course.code,
  name: course.name,
  category: course.category,
  score: course.score,
  nextScore: course.nextScore,
  progressPercent: course.progressPercent,
  theme: course.theme,
}));

interface CourseHomePageProps {
  onBackToApp?: () => void;
  onLaunchLesson?: (lessonId: string, courseId: string) => void;
}

export const CourseHomePage: React.FC<CourseHomePageProps> = ({
  onBackToApp,
  onLaunchLesson,
}) => {
  // Navigation active tab
  const [activeNavTab, setActiveNavTab] = useState<BottomNavTab>("home");
  const [previousNavTab, setPreviousNavTab] = useState<BottomNavTab>("home");

  // Selected Course - durably read from persistent storage, defaulting to "dsa"
  const [selectedCourseId, setSelectedCourseId] = useState<string>(() => {
    return getStoredCourseId();
  });

  // Enrolled Courses - durably stored in localStorage (default is only ["dsa"])
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(() => {
    return getStoredEnrolledCourseIds();
  });

  // Dropdown states
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState<boolean>(false);
  const [isGuidebookOpen, setIsGuidebookOpen] = useState<boolean>(false);
  const [isCloudTransitioning, setIsCloudTransitioning] = useState<boolean>(false);

  const {
    state: gamificationState,
    addTrophies: addStoreTrophies,
    addXp: addStoreXp,
    addDiamonds: addStoreDiamonds,
    completeLevelState,
  } = useGamification();

  // Section Selector Drawer state
  const [isSectionDrawerOpen, setIsSectionDrawerOpen] = useState<boolean>(false);

  // 153-Level Unified Experience state (Theory Deck -> Quiz Deck)
  const [active153LevelInfo, setActive153LevelInfo] = useState<{
    levelId: string;
    globalIndex: number;
    title: string;
    bookName: string;
    moduleName: string;
  } | null>(null);
  const [active153Decks, setActive153Decks] = useState<GeneratedLevelDecks | null>(null);
  const [is153TheoryModalOpen, setIs153TheoryModalOpen] = useState<boolean>(false);
  const [is153QuizModalOpen, setIs153QuizModalOpen] = useState<boolean>(false);
  const [is153Loading, setIs153Loading] = useState<boolean>(false);

  // Gamification user values (Streak 0, Diamonds 0, Energy 0)
  const [streakCount, setStreakCount] = useState<number>(() => gamificationState?.currentStreak ?? 0);
  const [diamonds, setDiamonds] = useState<number>(() => {
    try {
      const stored = localStorage.getItem("dsa_course_diamonds_v2");
      if (stored) return parseInt(stored, 10);
    } catch (e) {}
    return gamificationState?.diamonds ?? 0;
  });
  const [plays, setPlays] = useState<number>(() => gamificationState?.plays ?? 0);

  // Active toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mobile Device Frame view toggle
  const [isFramedView, setIsFramedView] = useState<boolean>(true);

  // Curriculum view mode (153-Level Master Game vs Section Track)
  const [curriculumViewMode, setCurriculumViewMode] = useState<"153_master" | "sections">("153_master");

  // Active section number state (defaults to section 1)
  const [activeSectionNumber, setActiveSectionNumber] = useState<number>(1);

  // Active track state for courses with distinct Theory and Questions maps (e.g. DSA)
  const [activeTrack, setActiveTrack] = useState<"theory" | "questions">("questions");

  // Active Generative AI subject (Prompt Engineering | Fine-Tuning LLM | RAG)
  const [activeGenAISubject, setActiveGenAISubject] = useState<GenAISubjectId>(() => {
    try {
      const saved = localStorage.getItem("aifluence_genai_subject");
      if (saved === "prompt_engineering" || saved === "fine_tuning" || saved === "rag") {
        return saved;
      }
    } catch (e) {}
    return "prompt_engineering";
  });

  const handleSelectGenAISubject = (subjId: GenAISubjectId) => {
    setActiveGenAISubject(subjId);
    try {
      localStorage.setItem("aifluence_genai_subject", subjId);
    } catch (e) {}
    setActiveSectionNumber(1);
  };

  // Current active course object
  const currentCourse: CourseDefinition = useMemo(() => {
    return (
      COURSES_CATALOG.find((c) => c.id === selectedCourseId) ||
      COURSES_CATALOG.find((c) => c.id === DEFAULT_COURSE_ID) ||
      COURSES_CATALOG[0]
    );
  }, [selectedCourseId]);

  // Check if current course supports both Theory and Questions maps
  const hasBothTracks = useMemo(() => {
    return Boolean(
      (currentCourse.theorySections && currentCourse.theorySections.length > 0) ||
      (selectedCourseId === "generative_ai")
    );
  }, [currentCourse, selectedCourseId]);

  // Dynamic sections based on activeTrack and activeGenAISubject
  const rawCourseSections = useMemo(() => {
    if (selectedCourseId === "generative_ai") {
      return GENAI_THEORY_COURSE_SECTIONS;
    }
    if (selectedCourseId === "ai_for_everyone") {
      return AI_FOR_EVERYONE_THEORY_SECTIONS;
    }
    if (activeTrack === "theory" && currentCourse.theorySections && currentCourse.theorySections.length > 0) {
      return currentCourse.theorySections;
    }
    if (activeTrack === "questions" && currentCourse.questionsSections && currentCourse.questionsSections.length > 0) {
      return currentCourse.questionsSections;
    }
    return currentCourse.sections || [];
  }, [currentCourse, activeTrack, selectedCourseId]);

  // Enrich course sections with dynamic progression, star ratings, and locked/unlocked state
  // Unlocking Rule:
  // 1. First level of ALL sections is unlocked by default.
  // 2. Subsequent levels within that specific section unlock ONLY IF the previous level in the same section has >= 2 stars!
  const currentCourseSections = useMemo(() => {
    const completedMap = gamificationState?.completedLevels || {};
    const starsMap = gamificationState?.levelStars || {};

    return rawCourseSections.map((section, sectionIdx) => {
      // Strictly isolate progression tracking to this section
      let prevLevelStars = 2; // Hypothetical predecessor has 2+ stars for level 1
      let prevLevelCompleted = true;

      const enrichedLevels = (section.levels || []).map((lvl, levelIdx) => {
        if (lvl.type === "chest") {
          return lvl;
        }

        // Build list of scoped candidate keys for this specific level
        const levelNumInSec = lvl.levelNumber || levelIdx + 1;
        const keysToCheck: string[] = [
          `${selectedCourseId}_s${section.sectionNumber}_l${levelNumInSec}`,
          `${selectedCourseId}_s${section.sectionNumber}_l${lvl.id}`
        ];

        if (lvl.level_id) {
          keysToCheck.push(lvl.level_id);
          keysToCheck.push(`${selectedCourseId}_${lvl.level_id}`);
        }
        if (lvl.theoryId) keysToCheck.push(lvl.theoryId);

        // Global index is unique across the whole course (e.g. 1-125 for GenAI)
        if (lvl.globalIndex !== undefined && lvl.globalIndex !== null) {
          keysToCheck.push(`global_${lvl.globalIndex}`);
          keysToCheck.push(String(lvl.globalIndex));
          keysToCheck.push(`${selectedCourseId}_lvl${lvl.globalIndex}`);
        }

        const numId = typeof lvl.id === "number" ? lvl.id : parseInt(String(lvl.id), 10);
        if (!isNaN(numId)) {
          // Explicit numeric IDs like 701-705 (Section 1), 801-805 (Section 2), 901-905 (Section 3) etc.
          if (numId >= 700) {
            keysToCheck.push(String(numId));
            keysToCheck.push(`${selectedCourseId}_lvl${numId}`);
          } else if (section.sectionNumber === 1) {
            // Only for Section 1, bare level numbers "1", "2", "3", "4" match Section 1 levels
            keysToCheck.push(String(numId));
            keysToCheck.push(String(700 + numId));
          }
        }

        // Check completion status across candidate keys
        let isCompleted = keysToCheck.some((k) => Boolean(completedMap[k]));
        let earnedStars = 0;

        for (const k of keysToCheck) {
          const rawStars = starsMap[k];
          if (rawStars !== undefined) {
            let starCount = 0;
            if (typeof rawStars === "number") {
              starCount = Math.max(0, Math.min(3, rawStars));
            } else if (Array.isArray(rawStars)) {
              starCount = rawStars.filter(Boolean).length;
            }
            if (starCount > earnedStars) {
              earnedStars = starCount;
            }
          }
        }

        if (isCompleted && earnedStars === 0) {
          earnedStars = lvl.stars || 2;
        }

        // Progression Rule: First level of EVERY section is ALWAYS unlocked!
        // Subsequent levels require the previous level in that section to be completed with at least 2 stars!
        const isFirstLevel = levelIdx === 0;
        const isUnlocked = isFirstLevel || (prevLevelCompleted && prevLevelStars >= 2);

        let status: "completed" | "current" | "locked" = "locked";
        if (isCompleted) {
          status = "completed";
        } else if (isUnlocked) {
          status = "current";
        } else {
          status = "locked";
        }

        // Update tracking state for next level in the current section
        prevLevelCompleted = isCompleted;
        prevLevelStars = isCompleted ? earnedStars : 0;

        return {
          ...lvl,
          status,
          stars: isCompleted ? earnedStars : 0,
        };
      });

      return {
        ...section,
        levels: enrichedLevels,
      };
    });
  }, [rawCourseSections, selectedCourseId, gamificationState?.completedLevels, gamificationState?.levelStars]);

  // Current active section derived from activeSectionNumber and currentCourseSections
  const activeSection = useMemo(() => {
    if (!currentCourseSections || currentCourseSections.length === 0) {
      return {
        sectionNumber: 1,
        sectionTitle: currentCourse.name,
        unitNumber: currentCourse.unitNumber,
        unitTitle: currentCourse.unitTitle,
        unitDescription: currentCourse.unitDescription,
        theme: currentCourse.theme,
        levels: [],
      };
    }
    return (
      currentCourseSections.find((s) => s.sectionNumber === activeSectionNumber) ||
      currentCourseSections[0]
    );
  }, [currentCourseSections, activeSectionNumber, currentCourse]);

  // Summary of all sections for the current active track
  const allSectionsSummary = useMemo(() => {
    return currentCourseSections.map((s) => ({
      sectionNumber: s.sectionNumber,
      sectionTitle: s.sectionTitle,
      unitNumber: s.unitNumber,
      unitTitle: s.unitTitle,
      levelCount: s.levels?.length || 5,
    }));
  }, [currentCourseSections]);

  // Leaderboard sub-tab tracking ("leaderboard" vs "clan")
  const [leaderboardSubTab, setLeaderboardSubTab] = useState<"leaderboard" | "clan">("leaderboard");

  // Clan banner color for dynamic glow logic, initialized from stored clan (defaults to "blue")
  const [clanBannerColor, setClanBannerColor] = useState<ClanShieldColor>(() => {
    try {
      const stored = getStoredCurrentClan();
      return stored?.shieldColor || "blue";
    } catch (e) {
      return "blue";
    }
  });

  // Active Duolingo-style GenAI slide lesson modal (Questions Drill)
  const [activeDuolingoLesson, setActiveDuolingoLesson] = useState<GenAILesson | null>(null);

  // Active Theory Guide & Slide Reader modal (Theory Track)
  const [activeTheorySlideLesson, setActiveTheorySlideLesson] = useState<GenAILesson | null>(null);

  // User trophies synced consistently across the entire app from the gamification store
  const currentUserTrophies = useMemo(() => {
    return gamificationState?.trophies ?? 0;
  }, [gamificationState?.trophies]);

  const handleAddTrophies = (amount: number) => {
    addStoreTrophies?.(amount);
  };

  // Ensure fresh start cleanup for any legacy bonus trophy keys
  useEffect(() => {
    try {
      if (localStorage.getItem("pq_clean_zero_v3") !== "done") {
        localStorage.removeItem("aifluence_bonus_trophies");
        localStorage.removeItem("dsa_course_diamonds_v2");
        localStorage.setItem("pq_clean_zero_v3", "done");
        setDiamonds(0);
        setPlays(0);
        setStreakCount(0);
      }
    } catch (e) {}
  }, []);

  // Pixel chest popup modal state
  const [isChestModalOpen, setIsChestModalOpen] = useState<boolean>(false);
  const [chestModalRewards, setChestModalRewards] = useState<ChestRewardsData>({
    xp: 50,
    diamonds: 20,
    trophies: 25,
    bonusTitle: "Level Chest Loot",
    sourceTitle: "Learning Map",
  });

  // Dynamic page color theme matching the currently displayed tab & course
  // With User Requested Dynamic Glow:
  // "the glow should be accordingly to the league and the clan banner colour like currently in in bronze league I want it to have a bronze glow with black bg and I have a light blue banner this a light blue glow and I want this logic also for the top and bottom navigation bar as it"
  const activePageTheme: string = useMemo(() => {
    if (activeNavTab === "store") return "white";
    if (activeNavTab === "quests" || activeNavTab === "avatar") return "black";

    if (activeNavTab === "leaderboard") {
      if (leaderboardSubTab === "clan") {
        // Clan banner color glow logic: adapts directly to selected color
        if (clanBannerColor === "blue" || clanBannerColor === "cyan") return "light-blue";
        if (clanBannerColor === "gold") return "gold";
        if (clanBannerColor === "copper" || clanBannerColor === "orange") return "orange";
        if (clanBannerColor === "black") return "black";
        if (clanBannerColor === "red") return "red";
        if (clanBannerColor === "green") return "green";
        if (clanBannerColor === "purple") return "purple";
        return clanBannerColor || "light-blue";
      } else {
        // Leaderboard sub-tab: glow accordingly to current league!
        // In bronze league -> "bronze" glow with black bg!
        const userLeague = getLeagueForTrophies(currentUserTrophies);
        if (userLeague.id === "bronze") return "bronze";
        if (userLeague.id === "silver") return "silver";
        if (userLeague.id === "gold") return "gold";
        if (userLeague.id === "crystal") return "purple";
        if (userLeague.id === "master") return "red";
        if (userLeague.id === "champion") return "gold";
        if (userLeague.id === "titan") return "silver";
        if (userLeague.id === "legend") return "gold";
        return "bronze";
      }
    }

    const key = selectedCourseId.toLowerCase();
    if (key === "dsa") return "purple";
    if (key === "html") return "green";
    if (key === "java") return "red";
    if (key === "cpp") return "blue";
    return (currentCourse.theme as string) || "purple";
  }, [
    activeNavTab,
    leaderboardSubTab,
    clanBannerColor,
    currentUserTrophies,
    selectedCourseId,
    currentCourse.theme,
  ]);

  const handleSelectCourse = (courseId: string) => {
    if (courseId === selectedCourseId) return;
    setIsCloudTransitioning(true);
    setTimeout(() => {
      setSelectedCourseId(courseId);
      setActiveSectionNumber(1);
      persistCourseId(courseId); // Persist durably into storage immediately
    }, 380);
    const found = COURSES_CATALOG.find((c) => c.id === courseId);
    if (found) {
      showToast(`🎯 Switched course to ${found.name} (${found.category})`);
    }
  };

  const handleEnrollCourse = (courseId: string) => {
    const updated = enrollInCourse(courseId);
    setEnrolledCourseIds(updated);
    const found = COURSES_CATALOG.find((c) => c.id === courseId);
    if (found) {
      showToast(`✨ Enrolled in ${found.name}! Added to your active courses.`);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSpendDiamonds = (amount: number) => {
    if (diamonds < amount) {
      showToast(`💎 Not enough diamonds! Need ${amount} 💎`);
      return false;
    }
    setDiamonds((prev) => {
      const next = prev - amount;
      try {
        localStorage.setItem("dsa_course_diamonds", String(next));
      } catch (e) {}
      return next;
    });
    return true;
  };

  const handleAddDiamonds = (amount: number) => {
    setDiamonds((prev) => {
      const next = prev + amount;
      try {
        localStorage.setItem("dsa_course_diamonds", String(next));
      } catch (e) {}
      return next;
    });
    showToast(`💎 Gained +${amount} Diamonds!`);
  };

  const handleLaunchLesson = async (levelId: number, courseId: string) => {
    // Check if it's a chest level in GenAI
    if ((levelId >= 7100 && levelId <= 9200) || (levelId >= 1200 && levelId <= 1500)) {
      handleOpenChest();
      return;
    }

    const numLevelId = typeof levelId === "number" ? levelId : parseInt(String(levelId), 10);
    const strLevelId = String(levelId);

    // 1. Check for GenAI character storyline lesson (Aiden, Lumi & Vex sliding reader + Vex quiz challenge)
    let genaiLesson = getGenAILessonById(numLevelId);
    if (!genaiLesson && (selectedCourseId === "generative_ai" || courseId === "generative_ai" || (numLevelId >= 1 && numLevelId <= 80))) {
      const idx = numLevelId >= 700 ? (numLevelId % 100) - 1 : numLevelId - 1;
      if (numLevelId >= 900) {
        genaiLesson = RAG_LESSONS[idx] || RAG_LESSONS[0];
      } else if (numLevelId >= 800) {
        genaiLesson = FINE_TUNING_LESSONS[idx] || FINE_TUNING_LESSONS[0];
      } else {
        genaiLesson = PROMPT_ENGINEERING_LESSONS[idx] || PROMPT_ENGINEERING_LESSONS[0];
      }
    }

    if (genaiLesson) {
      if (activeTrack === "theory") {
        setActiveTheorySlideLesson(genaiLesson);
      } else {
        setActiveDuolingoLesson(genaiLesson);
      }
      return;
    }

    // 2. Check if it matches a 153-level curriculum lesson in LEVEL_PLAN_DATA
    let foundCurriculumLevel = getLevelById(strLevelId);
    if (!foundCurriculumLevel) {
      for (const c of ALL_COURSES) {
        for (const book of c.books) {
          for (const mod of book.modules) {
            const lvl = mod.levels.find(
              (l) => l.global_index === numLevelId || l.level_id === strLevelId
            );
            if (lvl) {
              foundCurriculumLevel = { level: lvl, module: mod, book, course: c };
              break;
            }
          }
          if (foundCurriculumLevel) break;
        }
        if (foundCurriculumLevel) break;
      }
    }

    if (foundCurriculumLevel) {
      const { level, module, book } = foundCurriculumLevel;
      setIs153Loading(true);
      showToast(`⚡ Loading Level ${level.global_index}: ${level.title}...`);

      try {
        const decks = await getOrGenerateLevelContent(level.level_id);
        setActive153LevelInfo({
          levelId: level.level_id,
          globalIndex: level.global_index,
          title: level.title,
          bookName: book.book_name,
          moduleName: module.module_name,
        });
        setActive153Decks(decks);
        setIs153TheoryModalOpen(true);
      } catch (err) {
        console.error("Error loading level decks:", err);
        showToast("⚠️ Could not load level content. Retrying with fallback...");
      } finally {
        setIs153Loading(false);
      }
      return;
    }

    showToast(`🚀 Launching Level ${levelId} in ${currentCourse.name}...`);
    if (onLaunchLesson) {
      onLaunchLesson(levelId.toString(), courseId);
    }
  };

  const handleComplete153Level = (levelId: string, stars: number, score: number) => {
    const xpEarned = 50 + stars * 15;
    const diamondsEarned = stars === 3 ? 5 : 2;
    const trophiesEarned = stars >= 2 ? 25 : 10;

    const sectionNum = active153LevelInfo?.moduleName
      ? parseInt(active153LevelInfo.moduleName.replace(/\D/g, ""), 10) || activeSectionNumber
      : activeSectionNumber;
    const levelNum = active153LevelInfo?.globalIndex || (typeof levelId === "string" && !isNaN(parseInt(levelId, 10)) ? parseInt(levelId, 10) : 1);
    const levelTitle = active153LevelInfo?.title || `Level ${levelId}`;

    completeLevelState(levelId, stars, xpEarned, undefined, {
      courseId: selectedCourseId,
      courseName: currentCourse.name,
      sectionNumber: sectionNum,
      sectionTitle: active153LevelInfo?.moduleName || `Section ${sectionNum}`,
      levelNumber: levelNum,
      levelTitle: levelTitle,
      trophiesGained: trophiesEarned,
      diamondsGained: diamondsEarned,
    });

    if (active153LevelInfo) {
      completeLevelState(String(active153LevelInfo.globalIndex), stars, 0);
      completeLevelState(`${selectedCourseId}_s${sectionNum}_l${levelNum}`, stars, 0);
    }

    handleAddDiamonds(diamondsEarned);
    handleAddTrophies(trophiesEarned);

    setIs153QuizModalOpen(false);
    setActive153Decks(null);
    setActive153LevelInfo(null);

    showToast(`🎉 Level Cleared! +${xpEarned} XP, +${diamondsEarned} 💎, +${trophiesEarned} 🏆 (${stars}★)`);
  };

  const handleNextLesson = () => {
    if (!activeDuolingoLesson) return;
    const nextLesson = getGenAILessonById(activeDuolingoLesson.id + 1);
    if (nextLesson) {
      setActiveDuolingoLesson(nextLesson);
    } else {
      const currentIdx = PROMPT_ENGINEERING_LESSONS.findIndex(l => l.id === activeDuolingoLesson.id);
      if (currentIdx >= 0 && currentIdx + 1 < PROMPT_ENGINEERING_LESSONS.length) {
        setActiveDuolingoLesson(PROMPT_ENGINEERING_LESSONS[currentIdx + 1]);
      } else {
        setActiveDuolingoLesson(null);
      }
    }
  };

  const handlePrevLesson = () => {
    if (!activeDuolingoLesson) return;
    const prevLesson = getGenAILessonById(activeDuolingoLesson.id - 1);
    if (prevLesson) {
      setActiveDuolingoLesson(prevLesson);
    } else {
      const currentIdx = PROMPT_ENGINEERING_LESSONS.findIndex(l => l.id === activeDuolingoLesson.id);
      if (currentIdx > 0) {
        setActiveDuolingoLesson(PROMPT_ENGINEERING_LESSONS[currentIdx - 1]);
      }
    }
  };

  const handleOpenChest = (customRewards?: Partial<ChestRewardsData>) => {
    setChestModalRewards({
      xp: customRewards?.xp ?? 50,
      diamonds: customRewards?.diamonds ?? 20,
      trophies: customRewards?.trophies ?? 25,
      bonusTitle: customRewards?.bonusTitle ?? "Map Treasure Stash",
      sourceTitle: customRewards?.sourceTitle ?? currentCourse.name,
    });
    setIsChestModalOpen(true);
  };

  const handleCollectChestRewards = (rewards: ChestRewardsData) => {
    handleAddDiamonds(rewards.diamonds);
    handleAddTrophies(rewards.trophies);
    setIsChestModalOpen(false);
    showToast(
      `🎉 Chest Loot Claimed! +${rewards.xp} XP, +${rewards.diamonds} 💎, +${rewards.trophies} 🏆`
    );
  };

  const handleClaimQuestReward = (xp: number, diamondReward: number, bonus?: string) => {
    setDiamonds((prev) => {
      const next = prev + diamondReward;
      try {
        localStorage.setItem("dsa_course_diamonds", String(next));
      } catch (e) {}
      return next;
    });
    showToast(
      `🎉 Quest Reward Claimed! +${xp} XP & +${diamondReward} 💎 Diamonds!${
        bonus ? ` (${bonus})` : ""
      }`
    );
  };

  // Cosmic ambient glow gradients corresponding to requested course theme colors
  const ambientThemeGlow = useMemo(() => {
    switch (currentCourse.theme) {
      case "purple":
        return {
          glow: "from-purple-900/40 via-indigo-950/20 to-transparent",
          starColor: "#c084fc",
          halo: "rgba(168, 85, 247, 0.25)",
        };
      case "green":
        return {
          glow: "from-emerald-950/40 via-teal-950/20 to-transparent",
          starColor: "#4ade80",
          halo: "rgba(34, 197, 94, 0.25)",
        };
      case "red":
        return {
          glow: "from-rose-950/40 via-red-950/20 to-transparent",
          starColor: "#f87171",
          halo: "rgba(239, 68, 68, 0.25)",
        };
      case "blue":
        return {
          glow: "from-blue-950/40 via-cyan-950/20 to-transparent",
          starColor: "#60a5fa",
          halo: "rgba(59, 130, 246, 0.25)",
        };
      default:
        return {
          glow: "from-purple-900/40 via-indigo-950/20 to-transparent",
          starColor: "#c084fc",
          halo: "rgba(168, 85, 247, 0.25)",
        };
    }
  }, [currentCourse.theme]);

  return (
    <div className="min-h-screen bg-[#06080d] text-[#e2e2e2] flex flex-col items-center justify-start relative overflow-x-hidden font-sans select-none">
      
      {/* Dynamic Cosmic Stars & Smoke Ambient Glow Background from slides (disabled on avatar profile, store, and clan/leaderboard to prevent glow) */}
      {activeNavTab !== "avatar" && activeNavTab !== "store" && activeNavTab !== "leaderboard" && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Soft radial smoke bursts */}
          <div
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px] transition-all duration-700"
            style={{ backgroundColor: ambientThemeGlow.halo }}
          />
          <div
            className="absolute -bottom-40 right-10 w-[600px] h-[400px] rounded-full blur-[140px] transition-all duration-700 opacity-60"
            style={{ backgroundColor: ambientThemeGlow.halo }}
          />

          {/* 4-Corner Sparkle Stars matching slide aesthetics */}
          <div className="absolute top-12 left-10 opacity-70 animate-pulse">
            <svg width="18" height="18" viewBox="0 0 24 24" fill={ambientThemeGlow.starColor}>
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          </div>
          <div className="absolute top-28 right-16 opacity-50 animate-pulse delay-300">
            <svg width="14" height="14" viewBox="0 0 24 24" fill={ambientThemeGlow.starColor}>
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          </div>
          <div className="absolute bottom-32 left-8 opacity-60 animate-pulse delay-700">
            <svg width="16" height="16" viewBox="0 0 24 24" fill={ambientThemeGlow.starColor}>
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          </div>
          <div className="absolute bottom-20 right-12 opacity-80 animate-pulse delay-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill={ambientThemeGlow.starColor}>
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          </div>
        </div>
      )}

      {/* Subtle Floating Game Announcement (Clash of Clans / Clash Royale style text alert) */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95, transition: { duration: 0.7, ease: "easeOut" } }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed top-12 sm:top-16 left-1/2 -translate-x-1/2 z-[300] pointer-events-none select-none flex flex-col items-center"
          >
            <div className="px-6 py-2.5 rounded-2xl bg-gradient-to-b from-[#18233c]/95 via-[#0e1628]/95 to-[#080d1a]/95 border-2 border-yellow-400/50 shadow-[0_10px_35px_rgba(0,0,0,0.85),0_0_20px_rgba(250,204,21,0.25)] flex items-center gap-2.5">
              <span className="font-sans text-xs sm:text-sm font-black text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-center">
                {toastMessage}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Slide-styled App Container with slide bg & border glow */}
      <div
        className={`w-full transition-all duration-300 flex flex-col items-center justify-start min-h-screen sm:min-h-[90vh] z-10 ${
          isFramedView
            ? `max-w-md w-full my-0 sm:my-3 bg-[#000000] border-0 sm:border-2 rounded-none sm:rounded-[36px] overflow-hidden relative ${
                activePageTheme === "purple"
                  ? "border-purple-500/25"
                  : activePageTheme === "green"
                  ? "border-emerald-500/25"
                  : activePageTheme === "red"
                  ? "border-rose-500/25"
                  : activePageTheme === "blue"
                  ? "border-sky-500/25"
                  : activePageTheme === "cyan"
                  ? "border-cyan-500/25"
                  : activePageTheme === "bronze"
                  ? "border-[#cd7f32]/40"
                  : activePageTheme === "light-blue"
                  ? "border-sky-400/40"
                  : activePageTheme === "gold"
                  ? "border-amber-400/40"
                  : activePageTheme === "silver"
                  ? "border-slate-300/35"
                  : activePageTheme === "black"
                  ? "border-slate-500/35"
                  : activePageTheme === "orange" || activePageTheme === "copper"
                  ? "border-orange-500/40"
                  : "border-white/20"
              }`
            : `max-w-xl w-full bg-[#000000] rounded-none sm:rounded-3xl overflow-hidden relative my-0 sm:my-4 border-0 sm:border-2 ${
                activePageTheme === "purple"
                  ? "border-purple-500/25"
                  : activePageTheme === "green"
                  ? "border-emerald-500/25"
                  : activePageTheme === "red"
                  ? "border-rose-500/25"
                  : activePageTheme === "blue"
                  ? "border-sky-500/25"
                  : activePageTheme === "cyan"
                  ? "border-cyan-500/25"
                  : activePageTheme === "bronze"
                  ? "border-[#cd7f32]/40"
                  : activePageTheme === "light-blue"
                  ? "border-sky-400/40"
                  : activePageTheme === "gold"
                  ? "border-amber-400/40"
                  : activePageTheme === "silver"
                  ? "border-slate-300/35"
                  : activePageTheme === "black"
                  ? "border-slate-500/35"
                  : activePageTheme === "orange" || activePageTheme === "copper"
                  ? "border-orange-500/40"
                  : "border-white/20"
              }`
        }`}
        style={{
          boxShadow:
            activeNavTab === "store"
              ? "0 25px 60px rgba(0,0,0,0.9)"
              : `0 25px 60px rgba(0,0,0,0.9), inset 0 0 35px ${
              activePageTheme === "purple"
                ? "rgba(168, 85, 247, 0.20)"
                : activePageTheme === "green"
                ? "rgba(34, 197, 94, 0.20)"
                : activePageTheme === "red"
                ? "rgba(239, 68, 68, 0.20)"
                : activePageTheme === "blue"
                ? "rgba(59, 130, 246, 0.20)"
                : activePageTheme === "cyan"
                ? "rgba(6, 182, 212, 0.20)"
                : activePageTheme === "bronze"
                ? "rgba(205, 127, 50, 0.25)"
                : activePageTheme === "light-blue"
                ? "rgba(56, 189, 248, 0.25)"
                : activePageTheme === "gold"
                ? "rgba(245, 158, 11, 0.25)"
                : activePageTheme === "silver"
                ? "rgba(203, 213, 225, 0.22)"
                : activePageTheme === "black"
                ? "rgba(148, 163, 184, 0.22)"
                : activePageTheme === "orange" || activePageTheme === "copper"
                ? "rgba(234, 88, 12, 0.32)"
                : "rgba(255, 255, 255, 0.15)"
            }`,
        }}
      >
        {/* 1. TOP STATUS BAR (Course Dropdown + 🔥 1 + 💎 245 + ⚡ 25) */}
        {activeNavTab !== "curriculum" && (
          <CourseStatusBar
            currentCourseName={currentCourse.name}
            currentCourseCode={currentCourse.code}
            currentCourseShortName={currentCourse.shortName}
            currentLevel={currentCourse.score}
            streakDays={streakCount}
            trophiesCount={currentUserTrophies}
            diamondsCount={diamonds}
            playsCount={plays}
            themeColor={activePageTheme}
            isStoreActive={activeNavTab === "store" || activeNavTab === "avatar"}
            isCourseDropdownOpen={isCourseDropdownOpen}
            onToggleCourseDropdown={() => setIsCourseDropdownOpen((prev) => !prev)}
            onOpenStreak={() => showToast(`🔥 Daily Streak: ${streakCount} Day. Keep it going!`)}
            onOpenTrophies={() => {
              setActiveNavTab("leaderboard");
              setLeaderboardSubTab("leaderboard");
              showToast(`🏆 Trophies: ${currentUserTrophies}. Check your league rank!`);
            }}
            onOpenPlays={() => showToast(`⚡ Energy: ${plays} plays available.`)}
            onOpenDiamonds={() => showToast(`💎 Diamonds: ${diamonds} available for rewards.`)}
          />
        )}

        {/* 2. DROPDOWN COMPONENT (Top-anchored, lists enrolled courses, + Course catalog modal) */}
        <AnimatePresence>
          {isCourseDropdownOpen && (
            <CourseSelectorDropdown
              isOpen={isCourseDropdownOpen}
              onClose={() => setIsCourseDropdownOpen(false)}
              courses={dropdownCoursesList}
              enrolledCourseIds={enrolledCourseIds}
              selectedCourseId={selectedCourseId}
              onSelectCourse={handleSelectCourse}
              onEnrollCourse={handleEnrollCourse}
              onAddNewCourse={() => {
                showToast("📚 Explore all programming courses in the catalog!");
              }}
              onMoreAboutScore={(course) => {
                showToast(`📊 ${course.name} Mastery: ${course.progressPercent}% of Unit 1 completed`);
              }}
            />
          )}
        </AnimatePresence>

        {/* 3. ACTIVE TAB PAGE CONTENT */}
        {activeNavTab === "home" && (
          <FullLearningMap
            courseId={selectedCourseId}
            courseTitle={
              hasBothTracks
                ? `${currentCourse.name} • ${activeTrack === "theory" ? "Theory Map" : "Questions Map"}`
                : currentCourse.name
            }
            themeColor={currentCourse.theme}
            sections={currentCourseSections}
            activeSectionNumber={activeSectionNumber}
            onSelectSection={(num) => setActiveSectionNumber(num)}
            onLaunchLesson={handleLaunchLesson}
            onOpenChestReward={handleOpenChest}
            onClaimXp={(amount) => {
              showToast(`⚡ Gained +${amount} XP! Level progression boosted!`);
            }}
            onClaimDiamonds={(amount) => {
              setDiamonds((prev) => {
                const next = prev + amount;
                try {
                  localStorage.setItem("dsa_course_diamonds", String(next));
                } catch (e) {}
                return next;
              });
              showToast(`💎 Claimed +${amount} Diamonds!`);
            }}
            onActivateUnlimitedLives={(hours) => {
              showToast(`🛡️ Activated Unlimited Lives for ${hours} Hour${hours > 1 ? "s" : ""}!`);
            }}
            unitBanner={
              <UnitBanner
                sectionNumber={activeSection.sectionNumber}
                totalSections={currentCourseSections.length || 3}
                unitNumber={activeSection.unitNumber}
                unitTitle={activeSection.unitTitle}
                courseName={currentCourse.name}
                themeColor={currentCourse.theme}
                allSections={allSectionsSummary}
                activeTrack={activeTrack}
                hasBothTracks={hasBothTracks}
                activeSubjectName={
                  selectedCourseId === "generative_ai"
                    ? activeSectionNumber <= 8
                      ? "Prompt Engineering 101"
                      : activeSectionNumber <= 16
                      ? "Fine-Tuning LLM 101"
                      : "RAG Systems 101"
                    : selectedCourseId === "ai_for_everyone"
                    ? "AI for Everyone"
                    : undefined
                }
                onSelectTrack={(track) => {
                  setActiveTrack(track);
                  setActiveSectionNumber(1);
                  showToast(track === "theory" ? `📘 Switched to ${currentCourse.name} Theory Map` : `⚡ Switched to ${currentCourse.name} Academy Map`);
                }}
                onSelectSection={(num) => setActiveSectionNumber(num)}
                onNextSection={() =>
                  setActiveSectionNumber((prev) =>
                    Math.min(currentCourseSections.length || 3, prev + 1)
                  )
                }
                onPrevSection={() =>
                  setActiveSectionNumber((prev) => Math.max(1, prev - 1))
                }
                onOpenGuidebook={() => {
                  setIsSectionDrawerOpen(true);
                }}
                onOpenSections={() => {
                  setIsSectionDrawerOpen(true);
                }}
              />
            }
          />
        )}

        {activeNavTab === "curriculum" && (
          <div className="w-full flex flex-col items-center">
            {/* View Switcher Header */}
            <div className="w-full max-w-4xl px-4 pt-3 pb-1 flex items-center justify-between border-b border-white/10 bg-slate-950/80">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurriculumViewMode("153_master")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    curriculumViewMode === "153_master"
                      ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  ⚡ 153-Level AI Game
                </button>
                <button
                  onClick={() => setCurriculumViewMode("sections")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    curriculumViewMode === "sections"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  📖 Sections & Track
                </button>
              </div>

              <button
                onClick={() => setActiveNavTab(previousNavTab || "home")}
                className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 cursor-pointer"
              >
                Back to Map
              </button>
            </div>

            {curriculumViewMode === "153_master" ? (
              <AIFluence153LearningExperience />
            ) : (
              <AcademyCurriculumPage
                courseId={selectedCourseId}
                courseName={currentCourse.name}
                activeSectionNumber={activeSectionNumber}
                activeTrack={activeTrack}
                initialTrack={activeTrack}
                themeColor={currentCourse.theme}
                activeGenAISubject={activeGenAISubject}
                onSelectGenAISubject={handleSelectGenAISubject}
                onDone={() => setActiveNavTab(previousNavTab || "home")}
                onSelectSection={(num, track) => {
                  if (track) {
                    setActiveTrack(track);
                  }
                  setActiveSectionNumber(num);
                  setActiveNavTab("home");
                  const target = currentCourseSections.find((s) => s.sectionNumber === num);
                  if (target) {
                    showToast(`🎯 Switched to ${target.sectionTitle}: ${target.unitTitle}`);
                  }
                }}
                guidebookData={currentCourse.guidebook}
              />
            )}
          </div>
        )}

        {activeNavTab === "quests" && (
          <QuestsPage
            courseId={selectedCourseId}
            onSelectCourse={handleSelectCourse}
            onClaimReward={handleClaimQuestReward}
            onFindFriend={() => showToast("👥 Friend invitation sent!")}
            themeColor={currentCourse.theme}
            diamonds={diamonds}
            onSpendDiamonds={handleSpendDiamonds}
            onShowToast={showToast}
          />
        )}

        {activeNavTab === "leaderboard" && (
          <LeaderboardPage
            courseId={selectedCourseId}
            onSelectCourse={handleSelectCourse}
            onContinue={() => {
              setActiveNavTab("home");
              showToast("🏆 Leaderboard reviewed! Good luck this week!");
            }}
            themeColor={activePageTheme}
            activeSubTab={leaderboardSubTab}
            onSubTabChange={(tab) => setLeaderboardSubTab(tab)}
            onClanBannerColorChange={(color) => setClanBannerColor(color)}
          />
        )}

        {activeNavTab === "store" && (
          <StorePage
            diamonds={diamonds}
            onSpendDiamonds={handleSpendDiamonds}
            onAddDiamonds={handleAddDiamonds}
            onAddXP={(amount) => {
              showToast(`⚡ Added +${amount} XP to your course rank!`);
            }}
            onActivateUnlimitedLives={(hours) => {
              showToast(`🛡️ Activated Unlimited Lives for ${hours} Hour${hours > 1 ? "s" : ""}!`);
            }}
            onShowToast={showToast}
            themeColor={currentCourse.theme}
          />
        )}

        {activeNavTab === "avatar" && (
          <AvatarProfilePage
            courseId={selectedCourseId}
            onSelectCourse={handleSelectCourse}
            themeColor={activePageTheme}
            onOpenSettings={() => {
              setPreviousNavTab("avatar");
              setActiveNavTab("more");
            }}
          />
        )}

        {activeNavTab === "more" && (
          <MoreSettingsPage
            themeColor={activePageTheme}
            onDone={() => setActiveNavTab(previousNavTab || "home")}
            onResetProgress={onBackToApp}
          />
        )}

        {/* 4. FIXED BOTTOM NAVIGATION BAR */}
        <BottomNavBar
          activeTab={activeNavTab}
          themeColor={activePageTheme}
          isNoGlowActive={activeNavTab === "store" || activeNavTab === "avatar"}
          onSelectTab={(tab) => {
            if (activeNavTab !== "more" && activeNavTab !== "curriculum") {
              setPreviousNavTab(activeNavTab);
            }
            setActiveNavTab(tab);
          }}
        />

        {/* 5. THEORY SLIDE READER MODAL (FOR THEORY TRACK) */}
        {activeTheorySlideLesson && (
          <GenAITheorySlideReaderModal
            lesson={activeTheorySlideLesson}
            onClose={() => setActiveTheorySlideLesson(null)}
            onStartQuestions={() => {
              const targetLesson = activeTheorySlideLesson;
              setActiveTheorySlideLesson(null);
              setActiveDuolingoLesson(targetLesson);
            }}
            onComplete={(xpEarned) => {
              showToast(`📖 Theory Concept Mastered! +${xpEarned} XP`);
            }}
          />
        )}

        {/* 6. DUOLINGO STYLE SLIDE & QUESTION LEARNING MODAL (FOR QUESTIONS TRACK) */}
        {activeDuolingoLesson && (
          <DuolingoTheoryLessonModal
            lesson={activeDuolingoLesson}
            onClose={() => setActiveDuolingoLesson(null)}
            onNextLevel={handleNextLesson}
            onPrevLevel={handlePrevLesson}
            onComplete={(xpEarned, diamondsEarned, trophiesEarned) => {
              handleAddDiamonds(diamondsEarned);
              handleAddTrophies(trophiesEarned || 25);
              showToast(
                `🎉 Lesson Mastered! +${xpEarned} XP, +${diamondsEarned} 💎 & +${trophiesEarned || 25} 🏆`
              );
            }}
          />
        )}

        {/* 6. RETRO PIXEL CHEST OPENING REWARD POPUP MODAL */}
        <PixelChestOpeningModal
          isOpen={isChestModalOpen}
          rewards={chestModalRewards}
          onClose={() => setIsChestModalOpen(false)}
          onCollect={handleCollectChestRewards}
        />

        {/* 7. SECTION SELECTOR DRAWER MODAL */}
        <SectionSelectorDrawerModal
          isOpen={isSectionDrawerOpen}
          onClose={() => setIsSectionDrawerOpen(false)}
          courseId={selectedCourseId}
          courseName={currentCourse.name}
          themeColor={currentCourse.theme}
          sections={currentCourseSections}
          activeSectionNumber={activeSectionNumber}
          onSelectSection={(num) => {
            setActiveSectionNumber(num);
            showToast(`🗺️ Jumped to Section ${num}: ${currentCourseSections[num - 1]?.unitTitle || "Overview"}`);
          }}
          completedLevelsMap={gamificationState?.completedLevels}
          levelStarsMap={gamificationState?.levelStars}
        />

        {/* 8. 153-LEVEL THEORY DECK MODAL (10 SLIDES) */}
        {active153LevelInfo && active153Decks && (
          <TheoryDeckSlideModal
            isOpen={is153TheoryModalOpen}
            levelId={active153LevelInfo.levelId}
            levelTitle={active153LevelInfo.title}
            bookName={active153LevelInfo.bookName}
            moduleName={active153LevelInfo.moduleName}
            slides={active153Decks.theory_slides || (active153Decks as any).theory_deck?.slides || []}
            onClose={() => {
              setIs153TheoryModalOpen(false);
              setActive153Decks(null);
              setActive153LevelInfo(null);
            }}
            onStartQuiz={() => {
              setIs153TheoryModalOpen(false);
              setIs153QuizModalOpen(true);
            }}
          />
        )}

        {/* 9. 153-LEVEL QUIZ DECK MODAL (10 DEDICATED QUESTIONS) */}
        {active153LevelInfo && active153Decks && (
          <QuizDeckPlayerModal
            isOpen={is153QuizModalOpen}
            levelId={active153LevelInfo.levelId}
            levelTitle={active153LevelInfo.title}
            bookName={active153LevelInfo.bookName}
            questions={active153Decks.quiz_questions || (active153Decks as any).question_deck?.questions || []}
            onClose={() => {
              setIs153QuizModalOpen(false);
              setActive153Decks(null);
              setActive153LevelInfo(null);
            }}
            onCompleteLevel={(lvlId, stars, score) => {
              handleComplete153Level(lvlId, stars, score);
            }}
          />
        )}

        {/* 10. SUPERCELL CLOUD SWOOP TRANSITION */}
        <CloudTransition
          isActive={isCloudTransitioning}
          onAnimationComplete={() => setIsCloudTransitioning(false)}
        />

      </div>
    </div>
  );
};
