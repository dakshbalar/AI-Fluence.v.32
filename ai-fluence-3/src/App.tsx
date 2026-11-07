import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles } from "lucide-react";
import HTMLAcademy from "./components/HTMLAcademy";
import CSSAcademy from "./components/CSSAcademy";
import DSAAcademy from "./components/DSAAcademy";
import PythonAcademy from "./components/PythonAcademy";
import SQLAcademy from "./components/SQLAcademy";
import JavaScriptAcademy from "./components/JavaScriptAcademy";
import AIAcademy from "./components/AIAcademy";
import AICodeEvaluationEngine from "./components/AICodeEvaluationEngine";
import { useAuth } from "./context/AuthContext";
import { useGamification } from "./utils/gamificationStore";
import StreakCalendarModal from "./components/StreakCalendarModal";
import NoPlaysModal from "./components/NoPlaysModal";
import { StoryOnboardingModal } from "./components/onboarding/StoryOnboardingModal";
import { LearningJourneyModal } from "./components/onboarding/LearningJourneyModal";
import { DailyDropModal } from "./components/engagement/DailyDropModal";
import { QuickThinkModal } from "./components/engagement/QuickThinkModal";
import { AdaptiveInterventionModal } from "./components/engagement/AdaptiveInterventionModal";
import { DailyGoalModal } from "./components/DailyGoalModal";
import { AvatarStudioModal } from "./components/avatar/AvatarStudioModal";
import { CharacterTrioShowcase } from "./components/avatar/CharacterTrioShowcase";
import { PersonalizedPathMapView } from "./components/path/PersonalizedPathMapView";
import { CharacterStoryOverlay } from "./components/story/CharacterStoryOverlay";
import { FullScreenFeatureExperience } from "./components/story/FullScreenFeatureExperience";
import { useCharacterStoryEvent } from "./utils/storyEventManager";
import { useFeatureExperience, generateContextualWelcomeBack, generateDailyBonusExperience } from "./utils/featureExperienceManager";
import { AvatarConfig } from "./types/avatar";
import { OnboardingAnimationHub } from "./components/onboarding-animations/OnboardingAnimationHub";
import { OnboardingSceneId } from "./components/onboarding-animations/types";
import { SceneStudioModal } from "./components/scene-studio/SceneStudioModal";
import { SceneIntelligenceExperience } from "./components/scene-engine/SceneIntelligenceExperience";
import { CourseHomePage } from "./components/home/CourseHomePage";
import { CloudTransition } from "./components/transitions/CloudTransition";
import { 
  getEngagementState, 
  saveProfile, 
  saveCommitment, 
  claimDailyDrop, 
} from "./utils/engagementStore";
import { StudentProfile, LearningCommitment } from "./types/engagement";

export default function App() {
  const { user, isGuest } = useAuth();
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [activeGameLevelId, setActiveGameLevelId] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isCloudTransitionActive, setIsCloudTransitionActive] = useState(false);

  // Modals state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isJourneyModalOpen, setIsJourneyModalOpen] = useState(false);
  const [isDailyDropOpen, setIsDailyDropOpen] = useState(false);
  const [isQuickThinkOpen, setIsQuickThinkOpen] = useState(false);
  const [isAdaptiveInterventionOpen, setIsAdaptiveInterventionOpen] = useState(false);
  const [isDailyGoalCompleteOpen, setIsDailyGoalCompleteOpen] = useState(false);
  const [isAvatarStudioOpen, setIsAvatarStudioOpen] = useState(false);
  const [isMascotShowcaseOpen, setIsMascotShowcaseOpen] = useState(false);
  const [isPathMapModalOpen, setIsPathMapModalOpen] = useState(false);
  const [isHeaderStreakOpen, setIsHeaderStreakOpen] = useState(false);
  const [isNoPlaysModalOpen, setIsNoPlaysModalOpen] = useState(false);

  // Animation Hub & Scene Studio
  const [isAnimationHubOpen, setIsAnimationHubOpen] = useState(false);
  const [animationHubInitialScene, setAnimationHubInitialScene] = useState<OnboardingSceneId | null>(null);
  const [animationHubInitialFullFlow, setAnimationHubInitialFullFlow] = useState(false);
  const [isSceneStudioOpen, setIsSceneStudioOpen] = useState(false);
  const [isSceneIntelligenceOpen, setIsSceneIntelligenceOpen] = useState(false);

  // Engagement State
  const [engagementState, setEngagementState] = useState(getEngagementState());

  // Character Story Overlay Hook (Aiden, Lumi & Vex)
  const {
    activeStoryEvent,
    closeStoryEvent,
  } = useCharacterStoryEvent();

  // Full-Screen Character Feature Introductions & Welcome Back System Hook
  const {
    activeExperience,
    closeExperience,
    launchExperience
  } = useFeatureExperience();

  // Gamification helpers
  const { addXp, refillPlays, addDiamonds } = useGamification();

  const triggerTemporaryToast = (msg: string) => {
    setAlertMessage(msg);
    setTimeout(() => {
      setAlertMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const triggerCloudTransition = (onMidpoint?: () => void) => {
    setIsCloudTransitionActive(true);
    if (onMidpoint) {
      setTimeout(onMidpoint, 400);
    }
  };

  const handleSaveAvatar = (newConfig: AvatarConfig) => {
    saveProfile({ avatarConfig: newConfig });
    setEngagementState(getEngagementState());
    setIsAvatarStudioOpen(false);
    triggerTemporaryToast("✨ Companion avatar customization saved!");
  };

  const handleEquipMascot = (config: AvatarConfig, characterId: string) => {
    saveProfile({ avatarConfig: config });
    setEngagementState(getEngagementState());
    setIsMascotShowcaseOpen(false);
    triggerTemporaryToast(`✨ Equipped ${characterId.toUpperCase()} as your official companion!`);
  };

  // First-time onboarding & Welcome Back full-screen character trigger on login
  useEffect(() => {
    const currentEng = getEngagementState();
    setEngagementState(currentEng);

    if (user || isGuest) {
      if (!currentEng.profile.onboardingCompleted) {
        setIsOnboardingOpen(true);
      } else {
        const todayStr = new Date().toISOString().split("T")[0];
        const welcomeSeenKey = `aifluence_welcome_seen_${todayStr}`;
        if (!localStorage.getItem(welcomeSeenKey)) {
          const timer = setTimeout(() => {
            launchExperience(generateContextualWelcomeBack({ userName: currentEng.profile.username }));
            localStorage.setItem(welcomeSeenKey, "true");
          }, 400);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [user, isGuest, launchExperience]);

  const handleFeatureExperienceAction = (actionPayload?: string) => {
    if (actionPayload === "claim_and_continue" || actionPayload === "claim_rewards" || actionPayload === "continue_learning") {
      addXp(120, "Daily Sync Bonus");
      addDiamonds(5);
      claimDailyDrop(120, 5);
      setEngagementState(getEngagementState());
      triggerTemporaryToast("💎 +120 XP & +5 Diamonds added to your core reserve!");
    } else if (actionPayload === "open_studio") {
      setIsAvatarStudioOpen(true);
    } else if (actionPayload === "install_widget") {
      triggerTemporaryToast("📱 Live companion widget synced to your device!");
    } else if (actionPayload === "enable_notifications") {
      triggerTemporaryToast("🔔 Streak defender smart alerts enabled!");
    } else if (actionPayload === "set_goal_5") {
      triggerTemporaryToast("🎯 Weekly 5-Day streak pace committed!");
    }
  };

  const handleStoryAction = (actionType: string) => {
    if (actionType === "open_path") {
      setIsPathMapModalOpen(true);
    }
  };

  const handleCompleteOnboarding = (newProfile: Partial<StudentProfile>) => {
    saveProfile(newProfile);
    if (newProfile.dailyTimePreference) {
      saveCommitment({ dailyTimeCommitment: newProfile.dailyTimePreference });
    }
    setEngagementState(getEngagementState());
    setIsOnboardingOpen(false);
    addXp(50, "Onboarding Mastery Bonus");
    triggerTemporaryToast(`🌟 Welcome, ${newProfile.username}! +50 XP Welcome Bonus!`);
    setTimeout(() => {
      launchExperience(generateContextualWelcomeBack({ userName: newProfile.username || "Engineer", forcedReason: "daily_sync" }));
    }, 400);
  };

  const handleCompleteCommitment = (newCommitment: LearningCommitment) => {
    saveCommitment(newCommitment);
    setEngagementState(getEngagementState());
    setIsJourneyModalOpen(false);
    triggerTemporaryToast(`⚡ ${newCommitment.journeyDuration}-Day learning trajectory locked in!`);
  };

  const handleClaimDailyDrop = () => {
    const reward = claimDailyDrop(20, 10);
    addXp(reward.xp, "Daily Drop Reward");
    refillPlays(0);
    setEngagementState(getEngagementState());
    setIsDailyDropOpen(false);
    triggerTemporaryToast(`🎁 Daily Drop Claimed! +${reward.xp} XP & +${reward.credits} Diamonds`);
    
    setTimeout(() => {
      launchExperience(generateDailyBonusExperience({
        userName: engagementState.profile.username || "Techno",
        xpReward: reward.xp || 20,
        diamondsReward: reward.credits || 10,
        playsReward: 3,
        userStreak: engagementState.streakRecord.currentStreak || 3
      }));
    }, 250);
  };

  const handleAdaptiveBoosterSuccess = (earnedXp: number, earnedDiamonds: number) => {
    addXp(earnedXp, "Adaptive Recovery Mastery");
    addDiamonds(earnedDiamonds);
    setEngagementState(getEngagementState());
    setIsAdaptiveInterventionOpen(false);
    triggerTemporaryToast(`🏆 Concept Reinforcement Complete! +${earnedXp} XP & +${earnedDiamonds} 💎`);
  };

  const handleCompleteQuickThink = (earnedLearningXp: number, earnedThinkingXp: number) => {
    addXp(earnedLearningXp, "Quick Think Sprint");
    addDiamonds(2);
    setEngagementState(getEngagementState());
    setIsQuickThinkOpen(false);
    triggerTemporaryToast(`⚡ Sprint Concluded! +${earnedLearningXp} XP & +${earnedThinkingXp} Thinking Points`);
  };

  const handlePlayGame = (gameId: string, _title?: string, levelId?: number) => {
    triggerCloudTransition(() => {
      setActiveGame(gameId);
      setActiveGameLevelId(levelId ?? null);
    });
  };

  const handleCloseActiveGame = () => {
    setActiveGame(null);
    setActiveGameLevelId(null);
  };

  // If playing an interactive game
  if (activeGame === "html-adv") {
    return <HTMLAcademy initialLevelId={activeGameLevelId} onClose={handleCloseActiveGame} />;
  }

  if (activeGame === "css-bld") {
    return <CSSAcademy onClose={handleCloseActiveGame} />;
  }

  if (activeGame === "js-bld") {
    return <JavaScriptAcademy onClose={handleCloseActiveGame} />;
  }

  if (activeGame === "py-qst") {
    return <PythonAcademy onClose={handleCloseActiveGame} />;
  }

  if (activeGame === "sql-bld") {
    return <SQLAcademy onClose={handleCloseActiveGame} />;
  }

  if (activeGame === "dsa-bld") {
    return <DSAAcademy initialLevelId={activeGameLevelId} onClose={handleCloseActiveGame} />;
  }

  if (activeGame === "ai-bld") {
    return <AIAcademy onClose={handleCloseActiveGame} />;
  }

  return (
    <div className="relative min-h-screen text-[#e2e2e2] font-sans bg-[#07090e] selection:bg-[#2D7BFF] selection:text-white" id="main-scaffold">
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))]" />

      {/* Floating alert toast */}
      <AnimatePresence>
        {alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[500] px-6 py-3.5 rounded-full bg-black/95 border shadow-[0_0_30px_rgba(45,123,255,0.25)] flex items-center gap-3 border-[#2D7BFF]/40"
            id="floating-alert-toast"
          >
            <Sparkles className="w-4 h-4 animate-pulse text-[#2D7BFF]" />
            <span className="text-xs font-medium text-white">{alertMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Course & Academy Learning Map Home View */}
      <CourseHomePage
        onLaunchLesson={(lessonId, courseId) => {
          const lvlNum = parseInt(lessonId, 10) || 1;
          if (courseId === "generative_ai" || (lvlNum >= 700 && lvlNum <= 999)) {
            return;
          }
          triggerCloudTransition(() => {
            if (courseId === "dsa") {
              handlePlayGame("dsa-bld", "DSA Academy", lvlNum);
            } else if (courseId === "html") {
              handlePlayGame("html-adv", "HTML Academy", lvlNum);
            } else if (courseId === "java") {
              handlePlayGame("dsa-bld", "Java Programming", lvlNum);
            } else {
              handlePlayGame("py-qst", "Programming Academy", lvlNum);
            }
          });
        }}
      />

      {/* STREAK & CALENDAR MODAL */}
      <StreakCalendarModal
        isOpen={isHeaderStreakOpen}
        onClose={() => setIsHeaderStreakOpen(false)}
        currentStreak={engagementState.streakRecord.currentStreak || 1}
        longestStreak={engagementState.streakRecord.longestStreak || 5}
      />

      {/* NO PLAYS REFILL MODAL */}
      <NoPlaysModal
        isOpen={isNoPlaysModalOpen}
        onClose={() => setIsNoPlaysModalOpen(false)}
        onRefillWithGems={() => {
          refillPlays(20);
          setIsNoPlaysModalOpen(false);
          triggerTemporaryToast("⚡ Plays fully recharged (+5 plays)!");
        }}
        onWatchAd={() => {
          refillPlays(0);
          setIsNoPlaysModalOpen(false);
          triggerTemporaryToast("⚡ +1 Bonus Play granted!");
        }}
        onPracticeToEarn={() => {
          setIsNoPlaysModalOpen(false);
          triggerTemporaryToast("⚔️ Practice Arena loaded!");
        }}
        userGems={engagementState.profile.diamonds || 20}
      />

      {/* Onboarding Dialog */}
      <StoryOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      <LearningJourneyModal
        isOpen={isJourneyModalOpen}
        onCommit={handleCompleteCommitment}
        primaryLanguage={engagementState.profile.primaryLanguage}
        initialDuration={engagementState.commitment.journeyDuration}
        initialTime={engagementState.commitment.dailyTimeCommitment}
        userName={engagementState.profile.username}
      />

      <DailyDropModal
        isOpen={isDailyDropOpen}
        onClose={() => setIsDailyDropOpen(false)}
        onClaim={handleClaimDailyDrop}
        streakCount={engagementState.streakRecord.currentStreak}
        userName={engagementState.profile.username}
      />

      <QuickThinkModal
        isOpen={isQuickThinkOpen}
        onClose={() => setIsQuickThinkOpen(false)}
        onComplete={(thinkingXp, learningXp) => handleCompleteQuickThink(learningXp, thinkingXp)}
        preferredLanguage={engagementState.profile.primaryLanguage}
      />

      <AdaptiveInterventionModal
        isOpen={isAdaptiveInterventionOpen}
        onClose={() => setIsAdaptiveInterventionOpen(false)}
        onSuccess={handleAdaptiveBoosterSuccess}
        userName={engagementState.profile.username}
      />

      <DailyGoalModal
        isOpen={isDailyGoalCompleteOpen}
        onClose={() => setIsDailyGoalCompleteOpen(false)}
        earnedXp={engagementState.dailyActivity.dailyGoalXP}
        earnedThinkingXp={engagementState.dailyActivity.thinkingXP}
        earnedDiamonds={10}
        streakCount={engagementState.streakRecord.currentStreak}
        dailyGoalXp={engagementState.dailyActivity.dailyGoalXP}
      />

      {isAvatarStudioOpen && (
        <AvatarStudioModal
          isOpen={isAvatarStudioOpen}
          onClose={() => setIsAvatarStudioOpen(false)}
          initialConfig={engagementState.profile.avatarConfig}
          onSaveAvatar={handleSaveAvatar}
          userName={engagementState.profile.username}
        />
      )}

      {/* Full-Screen Holographic Path Map Modal */}
      {isPathMapModalOpen && (
        <div className="fixed inset-0 z-[270] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="w-full max-w-5xl my-auto relative">
            <button
              onClick={() => setIsPathMapModalOpen(false)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm cursor-pointer"
            >
              ✕ Close Map
            </button>
            <PersonalizedPathMapView
              pathPlan={engagementState.profile.personalizedPath}
              studentProfile={engagementState.profile}
              onOpenAvatarStudio={() => {
                setIsPathMapModalOpen(false);
                setIsAvatarStudioOpen(true);
              }}
              onSelectNodeAction={(_actionType, target) => {
                setIsPathMapModalOpen(false);
                if (target) {
                  handlePlayGame(target, "Selected Node");
                }
              }}
            />
          </div>
        </div>
      )}

      {isMascotShowcaseOpen && (
        <div className="fixed inset-0 z-[260] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="w-full max-w-6xl my-auto">
            <CharacterTrioShowcase
              currentConfig={engagementState.profile.avatarConfig}
              onSelectCharacter={handleEquipMascot}
              onOpenStudio={(_cfg) => {
                setIsMascotShowcaseOpen(false);
                setIsAvatarStudioOpen(true);
              }}
              onClose={() => setIsMascotShowcaseOpen(false)}
              isModal={true}
            />
          </div>
        </div>
      )}

      {/* Interactive In-App Character Story Event Layer (Aiden, Lumi & Vex) */}
      {activeStoryEvent && (
        <CharacterStoryOverlay
          event={activeStoryEvent}
          onClose={closeStoryEvent}
          onAction={handleStoryAction}
        />
      )}

      {/* Unified Full-Screen Character Feature Introduction & Welcome Back Experience */}
      {activeExperience && (
        <FullScreenFeatureExperience
          experience={activeExperience}
          onClose={closeExperience}
          onAction={handleFeatureExperienceAction}
        />
      )}

      {/* Welcome & Onboarding Animation System Testing Hub */}
      {isAnimationHubOpen && (
        <div className="fixed inset-0 z-[350] overflow-y-auto">
          <OnboardingAnimationHub 
            initialSceneId={animationHubInitialScene}
            initialFullFlow={animationHubInitialFullFlow}
            onClose={() => {
              setIsAnimationHubOpen(false);
              setAnimationHubInitialScene(null);
              setAnimationHubInitialFullFlow(false);
            }} 
          />
        </div>
      )}

      {/* Interactive Scene Template Studio & AI Generator Hub */}
      {isSceneStudioOpen && (
        <SceneStudioModal
          isOpen={isSceneStudioOpen}
          onClose={() => setIsSceneStudioOpen(false)}
        />
      )}

      {/* Autonomous Scene Intelligence Engine Experience */}
      {isSceneIntelligenceOpen && (
        <SceneIntelligenceExperience
          onClose={() => setIsSceneIntelligenceOpen(false)}
        />
      )}

      {/* Global Cloud Transition Wipe */}
      <CloudTransition
        isActive={isCloudTransitionActive}
        onAnimationComplete={() => setIsCloudTransitionActive(false)}
      />
    </div>
  );
}
