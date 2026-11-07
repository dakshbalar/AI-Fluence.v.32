import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, MessageSquare, Palette, Flame, Zap, Heart, Bot } from "lucide-react";
import { AvatarConfig, CharacterMood } from "../../types/avatar";
import { AIfluenceAvatar } from "./AIfluenceAvatar";
import { AIDEN_PROFILE, LUMI_PROFILE, VEX_PROFILE } from "../../data/characters";

interface DailyTaskCompanionProps {
  avatarConfig?: AvatarConfig;
  userName?: string;
  mood?: CharacterMood;
  customMessage?: string;
  size?: number;
  streakCount?: number;
  onOpenAvatarStudio?: () => void;
  interactive?: boolean;
  compact?: boolean;
  orientation?: "horizontal" | "vertical";
  showSpeechBubble?: boolean;
}

export const DailyTaskCompanion: React.FC<DailyTaskCompanionProps> = ({
  avatarConfig,
  userName = "Techno",
  mood = "idle",
  customMessage,
  size = 110,
  streakCount = 1,
  onOpenAvatarStudio,
  interactive = true,
  compact = false,
  orientation = "horizontal",
  showSpeechBubble = true
}) => {
  const [bubbleText, setBubbleText] = useState<string>("");
  const [clickCount, setClickCount] = useState(0);

  // Detect mascot character
  const isLumi = avatarConfig?.eyeStyle === "lumi_glamour" || avatarConfig?.activeBundle === "lumi_mascot";
  const isVex = avatarConfig?.eyeStyle === "vex_narrowed" || avatarConfig?.eyeStyle === "vex_predator" || avatarConfig?.activeBundle === "vex_mascot";
  const isAiden = !isLumi && !isVex;

  // Dynamic contextual dialogue generation based on mood
  useEffect(() => {
    if (customMessage) {
      setBubbleText(customMessage);
      return;
    }

    if (isLumi) {
      switch (mood) {
        case "thinking":
        case "idea":
          setBubbleText("Deconstructing this algorithm into a work of architectural art ✨");
          break;
        case "happy":
        case "celebrating":
        case "streak":
          setBubbleText(`Flawless execution, ${userName}! That solution is pure poetry 💖`);
          break;
        case "witty":
        case "encouraging":
          setBubbleText("A subtle runtime nuance. Let's refactor those edge cases gracefully 🌸");
          break;
        case "idle":
        default: {
          const lumiLines = [
            `What elegant system are we creating today, ${userName}? ✨`,
            "Clean code is an art form. Let's sculpt something brilliant 💖",
            `Your ${streakCount}-day momentum is looking radiant! 🌟`,
            "Let's turn complex theory into luminous intuition."
          ];
          setBubbleText(lumiLines[clickCount % lumiLines.length]);
          break;
        }
      }
      return;
    }

    if (isVex) {
      switch (mood) {
        case "thinking":
        case "suspicious":
          setBubbleText("Analyze the time complexity... O(N^2) won't survive my benchmark 🔥");
          break;
        case "happy":
        case "celebrating":
        case "boss":
          setBubbleText(`Hmph. Not bad, ${userName}. You actually beat my test suite ⚔️`);
          break;
        case "smirk":
        case "challenging":
          setBubbleText("Think you can solve this in under 60 seconds? Prove it 😈");
          break;
        case "idle":
        default: {
          const vexLines = [
            `Show me what you've got today, ${userName}. Don't hold back 🔥`,
            "Easy problems are for amateurs. Let's find your real ceiling.",
            `A ${streakCount}-day streak? Let's see if you can defend it today ⚔️`,
            "Step into the arena and execute zero-bug code."
          ];
          setBubbleText(vexLines[clickCount % vexLines.length]);
          break;
        }
      }
      return;
    }

    // Default: Aiden (Boyish Blue & Red)
    switch (mood) {
      case "thinking":
        setBubbleText("Hmm... let's trace the data structure step-by-step 🧠");
        break;
      case "happy":
      case "celebrating":
      case "streak":
        setBubbleText(`Awesome work, ${userName}! +XP secured! 🔥`);
        break;
      case "encouraging":
        setBubbleText("Almost there! Check the boundary logic — we got this! 💪");
        break;
      case "excited":
        setBubbleText("Let's crush today's mission! 🚀");
        break;
      case "determined":
        setBubbleText("Zero bugs today. Let's focus! ⚡");
        break;
      case "idle":
      default: {
        const greetings = [
          `Ready for today's challenge, ${userName}? ⚡`,
          `Your ${streakCount}-day streak is looking sharp! 🔥`,
          "Every small problem solved builds master intuition.",
          "I'm your learning companion — let's code! 🚀"
        ];
        setBubbleText(greetings[clickCount % greetings.length]);
        break;
      }
    }
  }, [mood, customMessage, userName, streakCount, clickCount, isLumi, isVex]);

  const handleCompanionClick = () => {
    setClickCount((prev) => prev + 1);
  };

  // Dynamic Theme Styling based on Mascot
  const themeGlow = isLumi
    ? "from-pink-500/30 via-purple-500/20 to-rose-500/30"
    : isVex
    ? "from-red-600/30 via-zinc-800/30 to-red-950/40"
    : "from-blue-600/30 via-cyan-500/20 to-red-500/30";

  const bubbleBorder = isLumi
    ? "border-pink-500/40 from-[#200a2b]/95 to-[#12041a]/95 text-pink-200"
    : isVex
    ? "border-red-500/40 from-[#1f090b]/95 to-[#0e0405]/95 text-red-200"
    : "border-cyan-400/40 from-[#0c1b38]/95 to-[#070e20]/95 text-cyan-200";

  const badgeText = isLumi
    ? { name: "LUMI (CREATE)", color: "text-pink-300", ping: "bg-pink-400" }
    : isVex
    ? { name: "VEX (CHALLENGE)", color: "text-red-400", ping: "bg-red-500" }
    : { name: "AIDEN (LEARN)", color: "text-cyan-300", ping: "bg-cyan-400" };

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div 
          onClick={onOpenAvatarStudio || handleCompanionClick}
          className="relative cursor-pointer group"
          title="Click to customize your companion"
        >
          <AIfluenceAvatar
            config={avatarConfig}
            mood={mood}
            size={size}
            className="rounded-2xl shadow-lg border border-white/10 group-hover:scale-105 transition-transform"
            showBackground={true}
            animate={true}
          />
          {onOpenAvatarStudio && (
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${isLumi ? "bg-pink-500 text-white" : isVex ? "bg-red-500 text-white" : "bg-cyan-500 text-black"} flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity`}>
              <Palette size={10} />
            </div>
          )}
        </div>

        {showSpeechBubble && bubbleText && (
          <motion.div
            key={bubbleText}
            initial={{ opacity: 0, scale: 0.9, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            className={`px-3.5 py-2 rounded-2xl bg-black/60 backdrop-blur-md border ${isLumi ? "border-pink-400/40 text-pink-200" : isVex ? "border-red-500/40 text-red-200" : "border-cyan-400/30 text-cyan-200"} shadow-lg relative text-left`}
          >
            <p className="text-xs font-mono leading-snug">
              {bubbleText}
            </p>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex ${
        orientation === "vertical" ? "flex-col items-center" : "flex-row items-center"
      } gap-4 relative select-none`}
    >
      {/* Avatar with click interaction & customize badge */}
      <div className="relative shrink-0">
        <div
          onClick={handleCompanionClick}
          className="relative cursor-pointer group"
        >
          <div className={`p-1 rounded-[26px] bg-gradient-to-tr ${themeGlow} border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.6)]`}>
            <AIfluenceAvatar
              config={avatarConfig}
              mood={mood}
              size={size}
              className="rounded-[22px] shadow-md transition-transform group-hover:scale-105"
              showBackground={true}
              animate={true}
            />
          </div>

          {/* Quick Customize Button Overlay */}
          {onOpenAvatarStudio && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenAvatarStudio();
              }}
              className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-[#0F172A] hover:bg-slate-900 border border-white/20 text-white text-[10px] font-mono font-bold flex items-center gap-1 shadow-lg shadow-black/80 hover:scale-105 transition cursor-pointer"
            >
              <Palette size={11} className={isLumi ? "text-pink-400" : isVex ? "text-red-400" : "text-cyan-400"} />
              <span>Edit</span>
            </button>
          )}
        </div>
      </div>

      {/* Comic Speech Bubble with animated entry */}
      {showSpeechBubble && (
        <AnimatePresence mode="wait">
          <motion.div
            key={bubbleText}
            initial={{ opacity: 0, scale: 0.92, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            className="flex-1 text-left relative"
          >
            <div className={`relative p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br ${bubbleBorder} shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl`}>
              {/* Little speech tail pointing towards the avatar */}
              {orientation === "horizontal" ? (
                <div className={`absolute top-1/2 -left-2 -translate-y-1/2 w-3 h-3 ${isLumi ? "bg-[#200a2b] border-pink-500/40" : isVex ? "bg-[#1f090b] border-red-500/40" : "bg-[#0c1b38] border-cyan-400/40"} border-l border-b rotate-45`} />
              ) : (
                <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 ${isLumi ? "bg-[#200a2b] border-pink-500/40" : isVex ? "bg-[#1f090b] border-red-500/40" : "bg-[#0c1b38] border-cyan-400/40"} border-t border-l rotate-45`} />
              )}

              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${badgeText.ping} animate-ping`} />
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${badgeText.color}`}>
                    {badgeText.name} • {userName}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-mono text-amber-300">
                  <Flame size={12} className="fill-amber-400 text-amber-400" />
                  <span>{streakCount}D STREAK</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm font-sans font-medium text-slate-100 leading-relaxed">
                {bubbleText}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default DailyTaskCompanion;
