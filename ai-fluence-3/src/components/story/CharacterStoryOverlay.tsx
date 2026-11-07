import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  X, 
  ChevronRight, 
  Zap, 
  Flame, 
  Target, 
  Calendar, 
  Award,
  ArrowRight
} from "lucide-react";
import { AIfluenceAvatar } from "../avatar/AIfluenceAvatar";
import { AIDEN_CONFIG, LUMI_CONFIG, VEX_CONFIG } from "../../data/characters";
import { 
  StoryEventDefinition, 
  StoryDialogueStep, 
  StorySpeaker,
  StoryObjectiveTarget 
} from "../../types/storyEvent";
import { CharacterMood } from "../../types/avatar";
import { useGamification } from "../../utils/gamificationStore";

interface CharacterStoryOverlayProps {
  event: StoryEventDefinition;
  onClose: (result?: { choiceId?: string; claimedXp?: number }) => void;
  onAction?: (actionType: string, payload?: any) => void;
}

interface SpeakerTheme {
  name: string;
  role: string;
  accentColor: string;
  glowColor: string;
  badgeBg: string;
  badgeBorder: string;
  config: typeof LUMI_CONFIG;
  textColor: string;
}

export const CharacterStoryOverlay: React.FC<CharacterStoryOverlayProps> = ({
  event,
  onClose,
  onAction
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isTransitioningStep, setIsTransitioningStep] = useState(false);
  const [isExitingAll, setIsExitingAll] = useState(false);
  const [closingMessage, setClosingMessage] = useState<{ 
    speaker: StorySpeaker; 
    text: string; 
    headline?: string; 
    subtext?: string; 
    mood?: CharacterMood 
  } | null>(null);
  const [xpClaimed, setXpClaimed] = useState(false);
  
  // Smooth running typewriter text
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const { addXp } = useGamification();
  const activeStep: StoryDialogueStep = event.steps[currentStepIndex] || event.steps[0];

  // Determine active speaker & mood
  const currentSpeaker: StorySpeaker = closingMessage ? closingMessage.speaker : activeStep.speaker;
  const currentMood: CharacterMood = closingMessage?.mood || activeStep.mood || "idle";

  // Speaker theme definitions matching the sci-fi HUD
  const getSpeakerTheme = (speaker: StorySpeaker): SpeakerTheme => {
    switch (speaker) {
      case "aiden":
        return {
          name: "AIDEN",
          role: "Core Vanguard",
          accentColor: "#00E5FF",
          glowColor: "rgba(0, 229, 255, 0.45)",
          badgeBg: "rgba(0, 229, 255, 0.15)",
          badgeBorder: "#00E5FF",
          config: AIDEN_CONFIG,
          textColor: "text-cyan-400"
        };
      case "vex":
        return {
          name: "VEX",
          role: "Rogue Sentinel",
          accentColor: "#FF0033",
          glowColor: "rgba(255, 0, 51, 0.45)",
          badgeBg: "rgba(255, 0, 51, 0.15)",
          badgeBorder: "#FF0033",
          config: VEX_CONFIG,
          textColor: "text-red-400"
        };
      case "lumi":
      default:
        return {
          name: "LUMI",
          role: "Neural Guide",
          accentColor: "#FF2A8D",
          glowColor: "rgba(255, 42, 141, 0.45)",
          badgeBg: "rgba(255, 42, 141, 0.15)",
          badgeBorder: "#FF2A8D",
          config: LUMI_CONFIG,
          textColor: "text-pink-400"
        };
    }
  };

  const theme = getSpeakerTheme(currentSpeaker);

  // Headlines and subtext derivation
  const headlineText = closingMessage?.headline || activeStep.headline || (
    activeStep.text.length <= 25 ? activeStep.text : (
      currentSpeaker === "aiden" ? "XP Claim Ready!" :
      currentSpeaker === "lumi" ? "Neural Link Active!" : "System Check Ready!"
    )
  );

  const subtextLine = closingMessage?.subtext || activeStep.subtext || (
    currentSpeaker === "aiden" ? "Aiden online — Core Vanguard reporting in." :
    currentSpeaker === "lumi" ? "Lumi online — Neural Guide synchronized." :
    "Vex online — Rogue Sentinel on watch."
  );

  const bodyDialogue = closingMessage ? closingMessage.text : activeStep.text;

  // Handle XP rewards
  useEffect(() => {
    if (activeStep?.specialEffect === "xp_burst" && !xpClaimed) {
      setXpClaimed(true);
      const amount = activeStep.xpAmount || 120;
      addXp(amount, "Daily Story Drop");
    }
  }, [activeStep, xpClaimed, addXp]);

  // Smooth running typewriter text
  useEffect(() => {
    if (isTransitioningStep || isExitingAll) return;

    setDisplayedText("");
    setIsTypingComplete(false);

    const fullText = bodyDialogue;
    let charIndex = 0;
    
    const interval = setInterval(() => {
      charIndex += 1;
      if (charIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, charIndex));
      } else {
        setIsTypingComplete(true);
        clearInterval(interval);
      }
    }, 12);

    return () => clearInterval(interval);
  }, [currentStepIndex, isTransitioningStep, isExitingAll, closingMessage, bodyDialogue]);

  // Advance to next dialogue step smoothly
  const handleAdvance = () => {
    if (isTransitioningStep || isExitingAll) return;

    if (closingMessage) {
      triggerExit();
      return;
    }

    // If typing isn't complete, instant-complete it immediately
    if (!isTypingComplete) {
      setDisplayedText(bodyDialogue);
      setIsTypingComplete(true);
      return;
    }

    // If step has interactive choices, wait for button click
    if (activeStep.interactiveChoices && activeStep.interactiveChoices.length > 0) {
      return;
    }

    // Advance step with smooth transition
    if (currentStepIndex < event.steps.length - 1) {
      setIsTransitioningStep(true);
      setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
        setIsTransitioningStep(false);
      }, 150);
    } else {
      triggerExit();
    }
  };

  const handleChoiceSelect = (choice: any) => {
    if (choice.responseLine) {
      setIsTransitioningStep(true);
      setTimeout(() => {
        setClosingMessage(choice.responseLine);
        setIsTransitioningStep(false);
      }, 150);
      setTimeout(() => {
        triggerExit(choice.id);
      }, 2000);
    } else {
      triggerExit(choice.id);
    }

    if (choice.actionType && onAction) {
      onAction(choice.actionType, choice);
    }
  };

  const triggerExit = (choiceId?: string) => {
    setIsExitingAll(true);
    setTimeout(() => {
      onClose({ choiceId, claimedXp: xpClaimed ? (activeStep.xpAmount || 120) : 0 });
    }, 200);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerExit("dismissed");
        return;
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleAdvance();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTypingComplete, currentStepIndex, activeStep, closingMessage, isTransitioningStep, isExitingAll]);

  // Highlight speaker names and roles inside subtext
  const renderFormattedSubtext = (text: string) => {
    const parts = text.split(/(Aiden|Lumi|Vex|Core Vanguard|Neural Guide|Rogue Sentinel)/g);
    return parts.map((part, i) => {
      if (["Aiden", "Lumi", "Vex", "Core Vanguard", "Neural Guide", "Rogue Sentinel"].includes(part)) {
        return (
          <span 
            key={i} 
            className="font-bold drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]"
            style={{ color: theme.accentColor }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Helper to resolve companion configs and moods for trio presentation
  const visibleCharacters = activeStep.visibleCharacters || [currentSpeaker as "aiden" | "lumi" | "vex"];
  const companionMoods = activeStep.companionMoods || {};

  return (
    <div
      id="trio-story-sync-experience"
      className={`fixed inset-0 z-[300] flex flex-col justify-between select-none overflow-y-auto overflow-x-hidden transition-opacity duration-200 ${
        isExitingAll ? "opacity-0 scale-98" : "opacity-100 scale-100"
      }`}
      style={{
        backgroundColor: "rgba(2, 6, 18, 0.94)",
        backdropFilter: "blur(14px)"
      }}
      onClick={handleAdvance}
    >
      {/* ------------------------------------------------------------- */}
      {/* CYBER AMBIENT BACKGROUND WITH GLOWING ACCENTS                */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[750px] h-[360px] rounded-full blur-[100px] opacity-25 transition-colors duration-500"
          style={{ backgroundColor: theme.accentColor }}
        />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${theme.accentColor} 1px, transparent 0)`,
            backgroundSize: "32px 32px"
          }}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. TOP MINIMAL NAVIGATION BAR                                 */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-50 w-full max-w-4xl mx-auto px-4 sm:px-8 pt-4 pb-2 flex items-center justify-between pointer-events-auto">
        {/* Title Tag Pill */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 border border-white/15 backdrop-blur-md text-xs font-mono shadow-lg"
        >
          <span 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: theme.accentColor }}
          />
          <span 
            className="font-bold tracking-wider uppercase text-[11px]"
            style={{ color: theme.accentColor }}
          >
            {event.title}
          </span>
          <span className="text-white/30">·</span>
          <span className="text-slate-300 text-[10px] font-medium font-mono">
            {currentStepIndex + 1}/{event.steps.length}
          </span>
        </motion.div>

        {/* Skip Button */}
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            triggerExit("dismissed");
          }}
          className="px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-white/15 border border-white/15 text-slate-300 hover:text-white transition-all text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-lg backdrop-blur-md"
          title="Skip story (ESC)"
        >
          <span>SKIP</span>
          <X size={14} />
        </motion.button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. MIDDLE CONTENT AREA: SCI-FI HUD SPEECH BOX & STORY VISUALS */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-30 w-full max-w-lg md:max-w-xl mx-auto px-4 flex flex-col items-center justify-center my-auto py-2">
        <AnimatePresence mode="wait">
          {!isTransitioningStep && !isExitingAll && (
            <motion.div
              key={`story-hud-${currentStepIndex}`}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full relative cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleAdvance();
              }}
            >
              {/* SVG CYBER SPEECH BUBBLE FRAME */}
              <div className="relative w-full overflow-visible">
                <svg 
                  viewBox="0 0 500 310" 
                  preserveAspectRatio="none" 
                  className="w-full h-[225px] sm:h-[245px] md:h-[265px] overflow-visible"
                  style={{
                    filter: `drop-shadow(0 0 20px ${theme.glowColor})`
                  }}
                >
                  <defs>
                    <linearGradient id={`trio-hud-glass-${currentStepIndex}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#060d20" stopOpacity="0.97" />
                      <stop offset="50%" stopColor="#081028" stopOpacity="0.97" />
                      <stop offset="100%" stopColor="#0d1838" stopOpacity="0.98" />
                    </linearGradient>

                    <pattern id={`trio-crosshair-matrix-${currentStepIndex}`} width="32" height="32" patternUnits="userSpaceOnUse">
                      <path d="M 16 12 L 16 20 M 12 16 L 20 16" stroke={theme.accentColor} strokeWidth="1" opacity="0.12" />
                    </pattern>
                  </defs>

                  {/* Chamfered polygon frame with stepped notch and downward tail */}
                  <path
                    d="M 24 0 
                       L 360 0 
                       L 375 8 
                       L 435 8 
                       L 450 0 
                       L 476 0 
                       L 500 24 
                       L 500 246 
                       L 476 270 
                       L 280 270 
                       L 245 306 
                       L 225 270 
                       L 24 270 
                       L 0 246 
                       L 0 24 Z"
                    fill={`url(#trio-hud-glass-${currentStepIndex})`}
                    stroke={theme.accentColor}
                    strokeWidth="2.5"
                  />

                  {/* Matrix Crosshair Grid */}
                  <path
                    d="M 24 0 
                       L 360 0 
                       L 375 8 
                       L 435 8 
                       L 450 0 
                       L 476 0 
                       L 500 24 
                       L 500 246 
                       L 476 270 
                       L 280 270 
                       L 245 306 
                       L 225 270 
                       L 24 270 
                       L 0 246 
                       L 0 24 Z"
                    fill={`url(#trio-crosshair-matrix-${currentStepIndex})`}
                    stroke="none"
                  />
                </svg>

                {/* TOP-LEFT IDENTITY BADGE (`/ AIDEN`) */}
                <div 
                  className="absolute top-3 left-4 sm:left-5 z-20 flex items-center gap-1 px-2.5 py-0.5 font-mono font-black text-[11px] sm:text-xs tracking-widest uppercase border rounded-sm"
                  style={{
                    backgroundColor: theme.badgeBg,
                    borderColor: theme.accentColor,
                    color: theme.accentColor,
                    clipPath: "polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)",
                    boxShadow: `0 0 10px ${theme.glowColor}`
                  }}
                >
                  <span className="opacity-75">/</span>
                  <span>{theme.name}</span>
                </div>

                {/* TOP-RIGHT GLOWING STATUS DOTS */}
                <div className="absolute top-3.5 right-6 sm:right-7 z-20 flex items-center gap-1.5 pointer-events-none">
                  <span 
                    className="w-1.5 h-1.5 rounded-full animate-ping opacity-90"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                  <span 
                    className="w-1.5 h-1.5 rounded-full opacity-80"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                </div>

                {/* BOTTOM-LEFT SLANTED HATCHES */}
                <div className="absolute bottom-11 sm:bottom-12 left-5 sm:left-6 z-20 flex items-center gap-1 opacity-80 pointer-events-none">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-3 transform -skew-x-[25deg]"
                      style={{ backgroundColor: theme.accentColor }}
                    />
                  ))}
                </div>

                {/* BOTTOM-RIGHT EQUALIZER BARS */}
                <div className="absolute bottom-11 sm:bottom-12 right-6 sm:right-7 z-20 flex items-end gap-1 pointer-events-none">
                  {[6, 12, 18, 9, 20, 14, 7].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [h * 0.4, h * 1.1, h * 0.5] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.7 + i * 0.12,
                        ease: "easeInOut"
                      }}
                      className="w-1 rounded-t-sm"
                      style={{ backgroundColor: theme.accentColor, minHeight: 4 }}
                    />
                  ))}
                </div>

                {/* DIALOGUE TEXT CONTENT */}
                <div className="absolute inset-0 pt-9 sm:pt-10 pb-12 px-5 sm:px-7 flex flex-col justify-start z-10 space-y-2">
                  {/* Headline */}
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight font-sans">
                      {headlineText}
                    </h2>
                    <Sparkles 
                      size={16} 
                      className="animate-pulse ml-1 shrink-0"
                      style={{ color: theme.accentColor }} 
                    />
                  </div>

                  {/* Subtext */}
                  <div className="text-xs sm:text-sm font-medium tracking-wide flex items-center gap-1.5 text-slate-200">
                    <span 
                      className="w-1.5 h-1.5 rounded-full shrink-0" 
                      style={{ backgroundColor: theme.accentColor }} 
                    />
                    <span>{renderFormattedSubtext(subtextLine)}</span>
                  </div>

                  {/* Running Typewriter Body */}
                  <div className="text-xs sm:text-sm md:text-[15px] text-slate-100 leading-relaxed font-normal min-h-[46px] pt-1">
                    <span>{displayedText}</span>
                    {!isTypingComplete && (
                      <span 
                        className="inline-block w-1.5 h-4 ml-1 animate-pulse align-middle"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* --------------------------------------------------------- */}
              {/* DYNAMIC STORY VISUAL ENHANCEMENTS (XP BURST, OBJECTIVES)  */}
              {/* --------------------------------------------------------- */}
              {/* 1. SPECIAL EFFECT: XP BURST */}
              {activeStep.specialEffect === "xp_burst" && (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2.5 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 backdrop-blur-md flex items-center justify-between shadow-lg"
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                    <Zap size={16} className="text-cyan-400 animate-bounce" />
                    <span>Neural Sync Dividend:</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs border border-cyan-500/40 shadow-[0_0_10px_rgba(0,229,255,0.4)]">
                    +{activeStep.xpAmount || 120} XP Transferred 🔥
                  </span>
                </motion.div>
              )}

              {/* 2. SPECIAL EFFECT: STREAK FIRE */}
              {activeStep.specialEffect === "streak_fire" && (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2.5 p-3 rounded-xl bg-orange-950/40 border border-orange-500/30 backdrop-blur-md flex items-center justify-between shadow-lg"
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-orange-300">
                    <Flame size={16} className="text-orange-400 animate-pulse" />
                    <span>Streak Multiplier Status:</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 font-mono font-bold text-xs border border-orange-500/40">
                    {activeStep.streakCount || 7} Days Consecutive (1.5x Boost)
                  </span>
                </motion.div>
              )}

              {/* 3. TARGET OBJECTIVES: HOLOGRAPHIC MISSION CARDS */}
              {activeStep.targetObjectives && activeStep.targetObjectives.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full"
                >
                  {activeStep.targetObjectives.map((obj: StoryObjectiveTarget, idx: number) => (
                    <div 
                      key={idx}
                      className="p-2.5 rounded-xl bg-pink-950/30 border border-pink-500/30 backdrop-blur-md flex items-center gap-2 shadow-md"
                    >
                      <span className="text-base">{obj.icon}</span>
                      <div className="text-left overflow-hidden">
                        <div className="text-xs font-bold text-white truncate font-sans">{obj.title}</div>
                        {obj.subtitle && <div className="text-[10px] text-pink-300 truncate font-mono">{obj.subtitle}</div>}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* 4. INTERACTIVE CHOICES */}
              {activeStep.interactiveChoices && activeStep.interactiveChoices.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full"
                >
                  {activeStep.interactiveChoices.map((choice) => (
                    <button
                      key={choice.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChoiceSelect(choice);
                      }}
                      className={`py-2.5 px-4 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-between border cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
                        choice.variant === "cyan" || choice.variant === "primary"
                          ? "bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                          : "bg-black/60 text-slate-200 border-white/20 hover:border-white/40"
                      }`}
                    >
                      <span>{choice.label}</span>
                      <ChevronRight size={14} />
                    </button>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. TRIO CHARACTER MASCOT STAGE                                */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-20 w-full flex flex-col items-center justify-end overflow-hidden pb-0 pointer-events-none">
        <AnimatePresence mode="wait">
          {!isTransitioningStep && !isExitingAll && (
            <motion.div
              key={`trio-stage-${currentSpeaker}-${currentStepIndex}`}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative flex items-end justify-center pointer-events-none w-full max-w-4xl"
            >
              {/* Radial Backdrop Glow */}
              <div 
                className="absolute bottom-12 left-1/2 -translate-x-1/2 w-80 sm:w-[500px] md:w-[600px] h-64 sm:h-80 rounded-full blur-3xl pointer-events-none opacity-40 transition-colors duration-500"
                style={{ backgroundColor: theme.accentColor }}
              />

              {/* TRIO STAGING: Single, Double or Full Trio */}
              {visibleCharacters.length === 1 ? (
                /* SINGLE CHARACTER HERO DISPLAY */
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 0.8, 0, -0.8, 0]
                  }}
                  transition={{
                    y: { repeat: Infinity, duration: 4.2, ease: "easeInOut" },
                    rotate: { repeat: Infinity, duration: 5.6, ease: "easeInOut" }
                  }}
                  className="relative flex flex-col items-center filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
                >
                  <AIfluenceAvatar
                    config={theme.config}
                    size={
                      typeof window !== "undefined" && window.innerWidth < 640 
                        ? 330 
                        : typeof window !== "undefined" && window.innerWidth < 1024 
                        ? 420 
                        : 480
                    }
                    mood={currentMood}
                    showBackground={false}
                  />
                </motion.div>
              ) : (
                /* MULTI-CHARACTER TRIO STAGE */
                <div className="relative flex items-end justify-center gap-2 sm:gap-6 pb-0">
                  {/* Left Flank Companion */}
                  {visibleCharacters[1] && (
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 0.82, x: 0 }}
                      className="relative -mr-8 sm:-mr-12 scale-90 sm:scale-95 filter brightness-90 contrast-95 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                    >
                      <AIfluenceAvatar
                        config={visibleCharacters[1] === "aiden" ? AIDEN_CONFIG : visibleCharacters[1] === "vex" ? VEX_CONFIG : LUMI_CONFIG}
                        size={
                          typeof window !== "undefined" && window.innerWidth < 640 ? 240 : 320
                        }
                        mood={companionMoods[visibleCharacters[1]] || "idle"}
                        showBackground={false}
                      />
                    </motion.div>
                  )}

                  {/* Center Foreground Active Speaker */}
                  <motion.div
                    animate={{
                      y: [0, -8, 0],
                      rotate: [0, 0.6, 0, -0.6, 0]
                    }}
                    transition={{
                      y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                      rotate: { repeat: Infinity, duration: 5.4, ease: "easeInOut" }
                    }}
                    className="relative z-10 flex flex-col items-center filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]"
                  >
                    <AIfluenceAvatar
                      config={theme.config}
                      size={
                        typeof window !== "undefined" && window.innerWidth < 640 ? 320 : 420
                      }
                      mood={currentMood}
                      showBackground={false}
                    />
                  </motion.div>

                  {/* Right Flank Companion */}
                  {visibleCharacters[2] && (
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 0.82, x: 0 }}
                      className="relative -ml-8 sm:-ml-12 scale-90 sm:scale-95 filter brightness-90 contrast-95 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                    >
                      <AIfluenceAvatar
                        config={visibleCharacters[2] === "aiden" ? AIDEN_CONFIG : visibleCharacters[2] === "vex" ? VEX_CONFIG : LUMI_CONFIG}
                        size={
                          typeof window !== "undefined" && window.innerWidth < 640 ? 240 : 320
                        }
                        mood={companionMoods[visibleCharacters[2]] || "idle"}
                        showBackground={false}
                      />
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. ACTIONS FOOTER                                             */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-40 w-full max-w-md mx-auto px-4 pb-6 pt-2 flex flex-col items-center gap-2 pointer-events-auto">
        {!activeStep.interactiveChoices || activeStep.interactiveChoices.length === 0 ? (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleAdvance}
            className="w-full py-3.5 sm:py-4 px-6 rounded-2xl font-mono text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            style={{
              backgroundColor: theme.accentColor,
              color: "#000000",
              boxShadow: `0 0 25px ${theme.glowColor}`
            }}
          >
            <span>{currentStepIndex < event.steps.length - 1 ? "NEXT STEP" : "CONTINUE LEARNING"}</span>
            <ArrowRight size={16} />
          </motion.button>
        ) : null}

        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          TAP ANYWHERE · SPACEBAR TO ADVANCE · ESC TO SKIP
        </div>
      </div>
    </div>
  );
};
