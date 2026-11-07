import React, { useState } from "react";
import {
  ChevronRight,
  X,
  Check,
  Volume2,
  Bell,
  Shield,
  Smartphone,
  Sparkles,
  HelpCircle,
  LogOut,
  Star,
  User,
  BookOpen,
  School,
  Share2,
  ExternalLink,
  MessageSquare,
  Lock,
  Flame,
  Zap,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEngagementStore } from "../../utils/engagementStore";
import { COURSES_CATALOG, getStoredCourseId, persistCourseId, getStoredEnrolledCourseIds } from "../../data/coursesData";
import { CornerStarsAndSmokeBackground } from "../onboarding-animations/shared/CornerStarsAndSmokeBackground";
import { getNameChangeStatus, markInitialNameAsSet, consumeNameChangeCard, addNameChangeCard } from "../../utils/nameChangeService";

interface MoreSettingsPageProps {
  onResetProgress?: () => void;
  onDone?: () => void;
  themeColor?: string;
}

type ActiveModal =
  | null
  | "preferences"
  | "profile"
  | "notifications"
  | "courses"
  | "schools"
  | "social"
  | "privacy"
  | "subscription"
  | "help"
  | "feedback"
  | "signout"
  | "terms"
  | "privacy_policy"
  | "acknowledgements";

export const MoreSettingsPage: React.FC<MoreSettingsPageProps> = ({
  onResetProgress,
  onDone,
  themeColor = "purple",
}) => {
  const { profile, updateProfile } = useEngagementStore();

  // Active sub-modal state
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // Quick toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Preference states (persisted in localStorage)
  const [soundEffects, setSoundEffects] = useState<boolean>(() => {
    return localStorage.getItem("aifluence_pref_sound") !== "false";
  });
  const [speakingExercises, setSpeakingExercises] = useState<boolean>(() => {
    return localStorage.getItem("aifluence_pref_speaking") !== "false";
  });
  const [listeningExercises, setListeningExercises] = useState<boolean>(() => {
    return localStorage.getItem("aifluence_pref_listening") !== "false";
  });
  const [hapticFeedback, setHapticFeedback] = useState<boolean>(() => {
    return localStorage.getItem("aifluence_pref_haptic") !== "false";
  });
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(() => {
    return localStorage.getItem("aifluence_pref_animations") !== "false";
  });

  // Notification states
  const [dailyReminders, setDailyReminders] = useState<boolean>(() => {
    return localStorage.getItem("aifluence_pref_daily_reminder") !== "false";
  });
  const [streakFreezeReminder, setStreakFreezeReminder] = useState<boolean>(() => {
    return localStorage.getItem("aifluence_pref_freeze_reminder") !== "false";
  });
  const [reminderTime, setReminderTime] = useState<string>(() => {
    return localStorage.getItem("aifluence_pref_reminder_time") || "19:00";
  });

  // Privacy states
  const [publicProfile, setPublicProfile] = useState<boolean>(true);
  const [searchableByEmail, setSearchableByEmail] = useState<boolean>(true);
  const [shareMilestones, setShareMilestones] = useState<boolean>(true);

  // Profile editing inputs
  const [displayNameInput, setDisplayNameInput] = useState<string>(profile?.username || "Techno");
  const [bioInput, setBioInput] = useState<string>(
    profile?.threeMonthVision || "Building AI-powered applications & mastering coding."
  );

  // School classroom code input
  const [classroomCode, setClassroomCode] = useState<string>("");
  const [isClassroomJoined, setIsClassroomJoined] = useState<boolean>(false);

  // Feedback input
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState<string>("");

  // Course management
  const currentCourseId = getStoredCourseId();
  const enrolledCourseIds = getStoredEnrolledCourseIds();

  const handleToggleSound = (val: boolean) => {
    setSoundEffects(val);
    localStorage.setItem("aifluence_pref_sound", String(val));
    showToast(val ? "🔊 Sound effects turned ON" : "🔇 Sound effects turned OFF");
  };

  const handleToggleSpeaking = (val: boolean) => {
    setSpeakingExercises(val);
    localStorage.setItem("aifluence_pref_speaking", String(val));
  };

  const handleToggleListening = (val: boolean) => {
    setListeningExercises(val);
    localStorage.setItem("aifluence_pref_listening", String(val));
  };

  const handleToggleHaptic = (val: boolean) => {
    setHapticFeedback(val);
    localStorage.setItem("aifluence_pref_haptic", String(val));
  };

  const handleToggleAnimations = (val: boolean) => {
    setAnimationsEnabled(val);
    localStorage.setItem("aifluence_pref_animations", String(val));
  };

  const handleSaveProfile = () => {
    const newName = displayNameInput.trim();
    if (newName) {
      if (newName !== profile.username) {
        const nameStatus = getNameChangeStatus();
        if (nameStatus.canChangeFree) {
          markInitialNameAsSet();
          updateProfile({
            username: newName,
            threeMonthVision: bioInput.trim(),
          });
          showToast("✅ Profile name set successfully (Initial free change)!");
          setActiveModal(null);
        } else if (nameStatus.cardsOwned > 0) {
          consumeNameChangeCard();
          updateProfile({
            username: newName,
            threeMonthVision: bioInput.trim(),
          });
          showToast("📜 Username updated using 1 Name Change Card!");
          setActiveModal(null);
        } else {
          showToast("🔒 Name change locked! Buy a Name Change Card for 50 💎 in the Store.");
          return;
        }
      } else {
        updateProfile({
          threeMonthVision: bioInput.trim(),
        });
        showToast("✅ Profile updated successfully");
        setActiveModal(null);
      }
    }
  };

  const handleJoinClassroom = () => {
    if (classroomCode.trim().length >= 4) {
      setIsClassroomJoined(true);
      showToast(`🎉 Joined classroom ${classroomCode.toUpperCase()}!`);
      setActiveModal(null);
    } else {
      showToast("⚠️ Please enter a valid classroom code");
    }
  };

  const handleSubmitFeedback = () => {
    if (feedbackText.trim()) {
      showToast("🙌 Thank you for your feedback!");
      setFeedbackText("");
      setActiveModal(null);
    } else {
      showToast("⚠️ Please enter a brief message");
    }
  };

  const handleSignOutConfirm = () => {
    setActiveModal(null);
    showToast("👋 Signed out successfully");
    if (onResetProgress) {
      setTimeout(() => onResetProgress(), 600);
    }
  };

  return (
    <div className="w-full flex flex-col bg-black min-h-screen pb-28 select-none text-left relative overflow-hidden">
      {/* Corner stars and ambient smoke background matching theme */}
      <CornerStarsAndSmokeBackground theme={themeColor} bottomStarsClassName="bottom-24" />

      {/* Toast message */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#141414]/95 border border-cyan-500/40 text-cyan-400 text-xs font-bold shadow-[0_8px_30px_rgba(6,182,212,0.25)] flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          1. TOP BAR (Clean cosmic header, energetic green DONE)
          ========================================================================= */}
      <div className="w-full bg-black/95 backdrop-blur-md border-b-2 border-white/10 px-4 py-3.5 sticky top-0 z-30 flex items-center justify-between">
        <div className="w-14" /> {/* Spacer to balance the centered title */}
        <h1 className="text-base font-bold text-white tracking-wide">Settings</h1>
        <button
          id="btn-settings-done"
          onClick={onDone}
          className="text-sm font-black text-cyan-400 hover:text-cyan-300 active:scale-95 transition-all uppercase tracking-wider cursor-pointer px-2 py-1"
        >
          DONE
        </button>
      </div>

      {/* =========================================================================
          2. MAIN CONTENT SECTIONS (Deep obsidian grouped inset lists)
          ========================================================================= */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 pt-4 space-y-6">
        {/* --- SECTION 1: ACCOUNT --- */}
        <div>
          <h2 className="text-base sm:text-lg font-black text-white mb-2.5 px-1 tracking-tight">Account</h2>
          <div className="rounded-2xl bg-[#141414] border-2 border-[#262626] overflow-hidden divide-y divide-[#262626] shadow-md">
            <button
              id="settings-item-preferences"
              onClick={() => setActiveModal("preferences")}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors cursor-pointer group"
            >
              <span className="text-[16px] font-bold text-white tracking-tight">Preferences</span>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-200 transition-colors stroke-[2.5]" />
            </button>

            <button
              id="settings-item-profile"
              onClick={() => setActiveModal("profile")}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors cursor-pointer group"
            >
              <span className="text-[16px] font-bold text-white tracking-tight">Profile</span>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-200 transition-colors stroke-[2.5]" />
            </button>

            <button
              id="settings-item-notifications"
              onClick={() => setActiveModal("notifications")}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors cursor-pointer group"
            >
              <span className="text-[16px] font-bold text-white tracking-tight">Notifications</span>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-200 transition-colors stroke-[2.5]" />
            </button>

            <button
              id="settings-item-courses"
              onClick={() => setActiveModal("courses")}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors cursor-pointer group"
            >
              <span className="text-[16px] font-bold text-white tracking-tight">Courses</span>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-200 transition-colors stroke-[2.5]" />
            </button>

            <button
              id="settings-item-schools"
              onClick={() => setActiveModal("schools")}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors cursor-pointer group"
            >
              <span className="text-[16px] font-bold text-white tracking-tight">AIfluence for Schools</span>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-200 transition-colors stroke-[2.5]" />
            </button>

            <button
              id="settings-item-social"
              onClick={() => setActiveModal("social")}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors cursor-pointer group"
            >
              <span className="text-[16px] font-bold text-white tracking-tight">Social Accounts</span>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-200 transition-colors stroke-[2.5]" />
            </button>

            <button
              id="settings-item-privacy"
              onClick={() => setActiveModal("privacy")}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors cursor-pointer group"
            >
              <span className="text-[16px] font-bold text-white tracking-tight">Privacy Settings</span>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-200 transition-colors stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* --- SECTION 2: SUBSCRIPTION --- */}
        <div>
          <h2 className="text-base sm:text-lg font-black text-white mb-2.5 px-1 tracking-tight">Subscription</h2>
          <div className="rounded-2xl bg-[#141414] border-2 border-[#262626] overflow-hidden shadow-md">
            <button
              id="settings-item-subscription"
              onClick={() => setActiveModal("subscription")}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors cursor-pointer group"
            >
              <span className="text-[16px] font-bold text-white tracking-tight">Choose a plan</span>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-200 transition-colors stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* --- SECTION 3: SUPPORT --- */}
        <div>
          <h2 className="text-base sm:text-lg font-black text-white mb-2.5 px-1 tracking-tight">Support</h2>
          <div className="rounded-2xl bg-[#141414] border-2 border-[#262626] overflow-hidden divide-y divide-[#262626] shadow-md">
            <button
              id="settings-item-help"
              onClick={() => setActiveModal("help")}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors cursor-pointer group"
            >
              <span className="text-[16px] font-bold text-white tracking-tight">Help Center</span>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-200 transition-colors stroke-[2.5]" />
            </button>

            <button
              id="settings-item-feedback"
              onClick={() => setActiveModal("feedback")}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors cursor-pointer group"
            >
              <span className="text-[16px] font-bold text-white tracking-tight">Feedback</span>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-200 transition-colors stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* --- SIGN OUT BUTTON --- */}
        <div className="pt-2">
          <button
            id="btn-sign-out"
            onClick={() => setActiveModal("signout")}
            className="w-full py-3.5 rounded-2xl border-2 border-red-500/30 hover:border-red-500/60 bg-[#141414] hover:bg-red-500/10 active:scale-[0.98] text-red-400 hover:text-red-300 font-black text-[15px] tracking-wider uppercase flex items-center justify-center transition-all cursor-pointer shadow-sm border-b-4 border-b-red-600/40 active:border-b-2"
          >
            SIGN OUT
          </button>
        </div>

        {/* --- FOOTER LEGAL LINKS --- */}
        <div className="pt-2 pb-12 flex flex-col items-start gap-3.5 px-1">
          <button
            onClick={() => setActiveModal("terms")}
            className="text-[13px] font-black text-slate-400 hover:text-white tracking-wider uppercase transition-colors cursor-pointer"
          >
            TERMS
          </button>
          <button
            onClick={() => setActiveModal("privacy_policy")}
            className="text-[13px] font-black text-slate-400 hover:text-white tracking-wider uppercase transition-colors cursor-pointer"
          >
            PRIVACY POLICY
          </button>
          <button
            onClick={() => setActiveModal("acknowledgements")}
            className="text-[13px] font-black text-slate-400 hover:text-white tracking-wider uppercase transition-colors cursor-pointer"
          >
            ACKNOWLEDGEMENTS
          </button>
        </div>
      </div>

      {/* =========================================================================
          3. INTERACTIVE SUB-MODALS (Preferences, Profile, Plan, Feedback, etc.)
          ========================================================================= */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="w-full max-w-md rounded-3xl bg-[#141414] border-2 border-[#262626] p-5 shadow-2xl relative text-left max-h-[85vh] overflow-y-auto"
            >
              {/* Close button */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* ----------------- PREFERENCES MODAL ----------------- */}
              {activeModal === "preferences" && (
                <div>
                  <h3 className="text-lg font-black text-white mb-4">Preferences</h3>
                  <div className="space-y-4">
                    {/* Sound Effects */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                      <div>
                        <span className="text-sm font-bold text-white block">Sound Effects</span>
                        <span className="text-xs text-slate-400">Audio chimes for correct & wrong answers</span>
                      </div>
                      <button
                        onClick={() => handleToggleSound(!soundEffects)}
                        className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                          soundEffects ? "bg-cyan-600" : "bg-white/20"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-1 ${
                            soundEffects ? "left-6" : "left-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Speaking Exercises */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                      <div>
                        <span className="text-sm font-bold text-white block">Speaking Exercises</span>
                        <span className="text-xs text-slate-400">Interactive voice pronunciation prompts</span>
                      </div>
                      <button
                        onClick={() => handleToggleSpeaking(!speakingExercises)}
                        className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                          speakingExercises ? "bg-cyan-600" : "bg-white/20"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-1 ${
                            speakingExercises ? "left-6" : "left-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Listening Exercises */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                      <div>
                        <span className="text-sm font-bold text-white block">Listening Exercises</span>
                        <span className="text-xs text-slate-400">Audio playback comprehension questions</span>
                      </div>
                      <button
                        onClick={() => handleToggleListening(!listeningExercises)}
                        className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                          listeningExercises ? "bg-cyan-600" : "bg-white/20"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-1 ${
                            listeningExercises ? "left-6" : "left-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Haptic Feedback */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                      <div>
                        <span className="text-sm font-bold text-white block">Haptic Feedback</span>
                        <span className="text-xs text-slate-400">Vibration response on mobile taps</span>
                      </div>
                      <button
                        onClick={() => handleToggleHaptic(!hapticFeedback)}
                        className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                          hapticFeedback ? "bg-cyan-600" : "bg-white/20"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-1 ${
                            hapticFeedback ? "left-6" : "left-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Animations */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                      <div>
                        <span className="text-sm font-bold text-white block">Visual Effects</span>
                        <span className="text-xs text-slate-400">Cosmic stars, smoke & confetti celebrations</span>
                      </div>
                      <button
                        onClick={() => handleToggleAnimations(!animationsEnabled)}
                        className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                          animationsEnabled ? "bg-cyan-600" : "bg-white/20"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-1 ${
                            animationsEnabled ? "left-6" : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full mt-5 py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 border-b-4 border-cyan-800 active:border-b-0 active:translate-y-1 text-white font-black text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    SAVE PREFERENCES
                  </button>
                </div>
              )}

              {/* ----------------- PROFILE MODAL ----------------- */}
              {activeModal === "profile" && (
                <div>
                  <h3 className="text-lg font-black text-white mb-4">Edit Profile</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1 uppercase tracking-wider">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={displayNameInput}
                        onChange={(e) => setDisplayNameInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white font-bold text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1 uppercase tracking-wider">
                        Username
                      </label>
                      <div className="px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 font-mono text-sm">
                        @{displayNameInput.toLowerCase().replace(/\s+/g, "_") || "learner"}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1 uppercase tracking-wider">
                        Bio & Learning Goal
                      </label>
                      <textarea
                        rows={3}
                        value={bioInput}
                        onChange={(e) => setBioInput(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none"
                        placeholder="What are your AI learning goals?"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs text-slate-400">
                      <span>Joined</span>
                      <span className="font-bold text-slate-200">September 2026</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    className="w-full mt-5 py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 border-b-4 border-cyan-800 active:border-b-0 active:translate-y-1 text-white font-black text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    SAVE PROFILE
                  </button>
                </div>
              )}

              {/* ----------------- NOTIFICATIONS MODAL ----------------- */}
              {activeModal === "notifications" && (
                <div>
                  <h3 className="text-lg font-black text-white mb-4">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                      <div>
                        <span className="text-sm font-bold text-white block">Daily Streak Reminder</span>
                        <span className="text-xs text-slate-400">Alerts to maintain streak before midnight</span>
                      </div>
                      <button
                        onClick={() => {
                          const n = !dailyReminders;
                          setDailyReminders(n);
                          localStorage.setItem("aifluence_pref_daily_reminder", String(n));
                        }}
                        className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                          dailyReminders ? "bg-cyan-600" : "bg-white/20"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-1 ${
                            dailyReminders ? "left-6" : "left-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                      <div>
                        <span className="text-sm font-bold text-white block">Streak Freeze Protection</span>
                        <span className="text-xs text-slate-400">Alerts if streak freeze is consumed</span>
                      </div>
                      <button
                        onClick={() => {
                          const n = !streakFreezeReminder;
                          setStreakFreezeReminder(n);
                          localStorage.setItem("aifluence_pref_freeze_reminder", String(n));
                        }}
                        className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                          streakFreezeReminder ? "bg-cyan-600" : "bg-white/20"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-1 ${
                            streakFreezeReminder ? "left-6" : "left-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                      <span className="text-sm font-bold text-white">Reminder Time</span>
                      <input
                        type="time"
                        value={reminderTime}
                        onChange={(e) => {
                          setReminderTime(e.target.value);
                          localStorage.setItem("aifluence_pref_reminder_time", e.target.value);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white/10 text-white font-mono text-sm border border-white/20 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      showToast("✅ Notification preferences updated");
                      setActiveModal(null);
                    }}
                    className="w-full mt-5 py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 border-b-4 border-cyan-800 active:border-b-0 active:translate-y-1 text-white font-black text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    DONE
                  </button>
                </div>
              )}

              {/* ----------------- COURSES MODAL ----------------- */}
              {activeModal === "courses" && (
                <div>
                  <h3 className="text-lg font-black text-white mb-4">Your Courses</h3>
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {COURSES_CATALOG.map((course) => {
                      const isEnrolled = enrolledCourseIds.includes(course.id);
                      const isCurrent = currentCourseId === course.id;

                      return (
                        <div
                          key={course.id}
                          className={`p-3 rounded-2xl border flex items-center justify-between ${
                            isCurrent
                              ? "bg-cyan-600/15 border-cyan-500/50"
                              : "bg-white/[0.03] border-white/10"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">{course.name}</span>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded-md bg-cyan-600 text-black text-[10px] font-black uppercase">
                                  Active
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-400">
                              {course.category} • {course.sections?.reduce((acc, s) => acc + (s.levels?.length || 0), 0) || 5} lessons
                            </span>
                          </div>

                          {!isCurrent && (
                            <button
                              onClick={() => {
                                persistCourseId(course.id);
                                showToast(`Switched to ${course.name}`);
                                setActiveModal(null);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                              Switch
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full mt-5 py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 border-b-4 border-cyan-800 active:border-b-0 active:translate-y-1 text-white font-black text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    DONE
                  </button>
                </div>
              )}

              {/* ----------------- SCHOOLS MODAL ----------------- */}
              {activeModal === "schools" && (
                <div>
                  <h3 className="text-lg font-black text-white mb-2">AIfluence for Schools</h3>
                  <p className="text-xs text-slate-300 mb-4">
                     Connect your account to your classroom to sync assignments, homework leaderboards, and teacher feedback.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1 uppercase tracking-wider">
                        Enter 6-Character Classroom Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={classroomCode}
                        onChange={(e) => setClassroomCode(e.target.value.toUpperCase())}
                        placeholder="e.g. AI7X99"
                        className="w-full px-3.5 py-3 rounded-xl bg-white/[0.06] border border-white/15 text-white font-mono text-center font-bold text-lg tracking-widest focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                      />
                    </div>

                    {isClassroomJoined && (
                      <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>Connected to AI Studio High School (Section A)</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleJoinClassroom}
                    className="w-full mt-5 py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 border-b-4 border-cyan-800 active:border-b-0 active:translate-y-1 text-white font-black text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    JOIN CLASSROOM
                  </button>
                </div>
              )}

              {/* ----------------- SOCIAL ACCOUNTS MODAL ----------------- */}
              {activeModal === "social" && (
                <div>
                  <h3 className="text-lg font-black text-white mb-4">Social Accounts</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                      <div>
                        <span className="text-sm font-bold text-white block">Google</span>
                        <span className="text-xs text-slate-400">Connected</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-bold">
                        Linked
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                      <div>
                        <span className="text-sm font-bold text-white block">GitHub</span>
                        <span className="text-xs text-slate-400">Sync repositories & code exercises</span>
                      </div>
                      <button
                        onClick={() => showToast("GitHub linked successfully")}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Connect
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                      <div>
                        <span className="text-sm font-bold text-white block">Discord</span>
                        <span className="text-xs text-slate-400">Community role & study groups</span>
                      </div>
                      <button
                        onClick={() => showToast("Discord linked successfully")}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Connect
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full mt-5 py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 border-b-4 border-cyan-800 active:border-b-0 active:translate-y-1 text-white font-black text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    DONE
                  </button>
                </div>
              )}

              {/* ----------------- PRIVACY SETTINGS MODAL ----------------- */}
              {activeModal === "privacy" && (
                <div>
                  <h3 className="text-lg font-black text-white mb-4">Privacy Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                      <div>
                        <span className="text-sm font-bold text-white block">Public Profile</span>
                        <span className="text-xs text-slate-400">Allow other learners to see your streak & avatar</span>
                      </div>
                      <button
                        onClick={() => setPublicProfile(!publicProfile)}
                        className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                          publicProfile ? "bg-cyan-600" : "bg-white/20"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-1 ${
                            publicProfile ? "left-6" : "left-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                      <div>
                        <span className="text-sm font-bold text-white block">Searchable by Email</span>
                        <span className="text-xs text-slate-400">Friends can search and add you as a study partner</span>
                      </div>
                      <button
                        onClick={() => setSearchableByEmail(!searchableByEmail)}
                        className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                          searchableByEmail ? "bg-cyan-600" : "bg-white/20"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-1 ${
                            searchableByEmail ? "left-6" : "left-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                      <div>
                        <span className="text-sm font-bold text-white block">Share Milestones to Feed</span>
                        <span className="text-xs text-slate-400">Celebrate major streak & unit achievements</span>
                      </div>
                      <button
                        onClick={() => setShareMilestones(!shareMilestones)}
                        className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                          shareMilestones ? "bg-cyan-600" : "bg-white/20"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-1 ${
                            shareMilestones ? "left-6" : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      showToast("✅ Privacy settings saved");
                      setActiveModal(null);
                    }}
                    className="w-full mt-5 py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 border-b-4 border-cyan-800 active:border-b-0 active:translate-y-1 text-white font-black text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    SAVE SETTINGS
                  </button>
                </div>
              )}

              {/* ----------------- SUBSCRIPTION MODAL ----------------- */}
              {activeModal === "subscription" && (
                <div>
                  <div className="text-center mb-5">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-xs uppercase tracking-wider inline-block mb-2">
                      Super AIfluence
                    </span>
                    <h3 className="text-xl font-black text-white">Upgrade Your Learning</h3>
                    <p className="text-xs text-slate-400 mt-1">Accelerate your coding fluency with premium perks</p>
                  </div>

                  <div className="space-y-3 mb-5">
                    <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-start gap-3">
                      <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-sm font-bold text-white block">Unlimited Energy</span>
                        <span className="text-xs text-slate-400">Never get interrupted when making mistakes in lessons</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-sm font-bold text-white block">AI Tutor Explanations</span>
                        <span className="text-xs text-slate-400">Instant step-by-step code guidance & syntax tips</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-start gap-3">
                      <Flame className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-sm font-bold text-white block">Monthly Streak Repair</span>
                        <span className="text-xs text-slate-400">Automatically restore a lost streak once every month</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      showToast("🎉 2-Week Free Trial activated!");
                      setActiveModal(null);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-400 hover:opacity-95 text-white font-black text-sm uppercase tracking-wider transition-all cursor-pointer shadow-lg"
                  >
                    START 2 WEEKS FREE
                  </button>
                  <p className="text-[11px] text-center text-slate-400 mt-2">Then $6.99/mo. Cancel anytime.</p>
                </div>
              )}

              {/* ----------------- HELP CENTER MODAL ----------------- */}
              {activeModal === "help" && (
                <div>
                  <h3 className="text-lg font-black text-white mb-3">Help Center & FAQ</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                      <span className="text-xs font-bold text-sky-400 block mb-1">How do streaks work?</span>
                      <p className="text-xs text-slate-300">
                        Complete at least one lesson or code puzzle every day before midnight to keep your streak alive.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                      <span className="text-xs font-bold text-sky-400 block mb-1">How do I customize my robot avatar?</span>
                      <p className="text-xs text-slate-300">
                        Visit your Profile tab (Lumi) and click "Customize Robot". You can adjust chassis, head, visor, antenna, paint, and aura glow!
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                      <span className="text-xs font-bold text-sky-400 block mb-1">What are Gems and Energy for?</span>
                      <p className="text-xs text-slate-300">
                        Energy lets you attempt lesson questions. Gems allow you to purchase streak freezes and robot cosmetics in the shop.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full mt-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border-2 border-white/15 text-white font-black text-sm uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    CLOSE
                  </button>
                </div>
              )}

              {/* ----------------- FEEDBACK MODAL ----------------- */}
              {activeModal === "feedback" && (
                <div>
                  <h3 className="text-lg font-black text-white mb-2">Send Feedback</h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Help us improve your AI learning journey. Tell us what you love or what we should fix!
                  </p>

                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold text-slate-300 block mb-2">Rate your experience:</span>
                      <div className="flex items-center justify-center gap-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setFeedbackRating(star)}
                            className="p-2 transition-transform hover:scale-125 cursor-pointer"
                          >
                            <Star
                              className={`w-7 h-7 ${
                                star <= feedbackRating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-600"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1 uppercase tracking-wider">
                        Your Feedback
                      </label>
                      <textarea
                        rows={3}
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Tell us what you think..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitFeedback}
                    className="w-full mt-5 py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 border-b-4 border-cyan-800 active:border-b-0 active:translate-y-1 text-white font-black text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    SUBMIT FEEDBACK
                  </button>
                </div>
              )}

              {/* ----------------- SIGN OUT CONFIRMATION MODAL ----------------- */}
              {activeModal === "signout" && (
                <div>
                  <h3 className="text-lg font-black text-white mb-2">Sign out of AIfluence?</h3>
                  <p className="text-xs text-slate-300 mb-5">
                    Your avatar customizer data, unlocked badges, and streak status are safely stored on your device profile.
                  </p>

                  <div className="space-y-2.5">
                    <button
                      onClick={handleSignOutConfirm}
                      className="w-full py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 border-b-4 border-rose-700 active:border-b-0 active:translate-y-1 text-white font-black text-sm uppercase tracking-wider transition-all cursor-pointer shadow-md"
                    >
                      SIGN OUT
                    </button>
                    <button
                      onClick={() => setActiveModal(null)}
                      className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border-2 border-white/15 text-white font-black text-sm uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              )}

              {/* ----------------- LEGAL INFO MODALS ----------------- */}
              {(activeModal === "terms" || activeModal === "privacy_policy" || activeModal === "acknowledgements") && (
                <div>
                  <h3 className="text-lg font-black text-white mb-3">
                    {activeModal === "terms"
                      ? "Terms of Service"
                      : activeModal === "privacy_policy"
                      ? "Privacy Policy"
                      : "Acknowledgements"}
                  </h3>
                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-slate-300 space-y-2 max-h-60 overflow-y-auto pr-1 leading-relaxed">
                    {activeModal === "terms" && (
                      <>
                        <p>
                          Welcome to AIfluence! By using our platform, you agree to engage in constructive, honorable coding learning.
                        </p>
                        <p>
                          All lessons, robot customizer assets, and gamified streak achievements are provided for educational and personal skill development.
                        </p>
                      </>
                    )}
                    {activeModal === "privacy_policy" && (
                      <>
                        <p>
                          Your privacy is of utmost importance. AIfluence preserves learning progress, streak milestones, and avatar designs locally on your browser.
                        </p>
                        <p>
                          We never sell personal information or share student telemetry with third-party advertisers.
                        </p>
                      </>
                    )}
                    {activeModal === "acknowledgements" && (
                      <>
                        <p>
                          AIfluence is inspired by world-class language and algorithmic education interfaces like Duolingo.
                        </p>
                        <p>
                          Special thanks to the open-source community, Tailwind CSS, Lucide icons, and modern web standards.
                        </p>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full mt-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border-2 border-white/15 text-white font-black text-sm uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    CLOSE
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
