import React from "react";
import { motion } from "motion/react";
import { AIfluenceAvatar } from "../../avatar/AIfluenceAvatar";
import { AIDEN_CONFIG } from "../../../data/characters";
import { AvatarConfig, CharacterMood } from "../../../types/avatar";

interface ComicDialogueHeaderProps {
  headline: string;
  subtext?: string;
  mood?: CharacterMood;
  avatarConfig?: AvatarConfig;
  accentColor?: string;
  theme?: "aiden" | "lumi" | "vex";
  speechKey?: string | number;
}

export const ComicDialogueHeader: React.FC<ComicDialogueHeaderProps> = ({
  headline,
  subtext,
  mood = "wave",
  avatarConfig = AIDEN_CONFIG,
  accentColor = "#00E5FF",
  theme = "aiden",
  speechKey
}) => {
  return (
    <div className="w-full flex items-center justify-between gap-2.5 sm:gap-3.5 mb-3 sm:mb-4 z-30 px-1">
      {/* Speech Bubble (Left Side) with Tail pointing RIGHT to the Bot */}
      <motion.div
        key={speechKey || headline}
        initial={{ scale: 0.94, opacity: 0, x: -6 }}
        animate={{ scale: 1, opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative flex-1 bg-white text-slate-900 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl sm:rounded-3xl shadow-[0_8px_25px_rgba(0,0,0,0.4)] text-left min-w-0"
      >
        <span className="text-sm sm:text-base font-black text-slate-900 font-sans tracking-tight leading-tight block">
          {headline}
        </span>
        {subtext && (
          <p className="text-[11px] sm:text-xs font-semibold text-slate-600 mt-1 font-sans leading-snug">
            {subtext}
          </p>
        )}

        {/* Comic Speech Bubble Tail pointing RIGHT towards the Bot's mouth */}
        <div
          className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-0 h-0 pointer-events-none"
          style={{
            borderTop: "8px solid transparent",
            borderBottom: "8px solid transparent",
            borderLeft: "10px solid #FFFFFF"
          }}
        />
      </motion.div>

      {/* Zoomed-in Bot (Right Side - Head & Shoulder Level, NO CIRCLE FRAME) */}
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Soft Background Accent Glow */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-50 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />

        {/* Seamless Shoulder/Bust Framing - completely transparent, no circle/borders */}
        <motion.div
          animate={{
            y: [0, -4, 0],
            rotate: [0, 1.2, 0, -1.2, 0]
          }}
          transition={{
            y: { repeat: Infinity, duration: 3.2, ease: "easeInOut" },
            rotate: { repeat: Infinity, duration: 4.6, ease: "easeInOut" }
          }}
          className="relative w-28 sm:w-32 h-28 sm:h-32 overflow-hidden flex items-start justify-center pointer-events-none"
        >
          {/* Avatar zoomed in to head & shoulder level (bust level) */}
          <div className="absolute -top-1 sm:-top-2 flex items-center justify-center">
            <AIfluenceAvatar
              config={avatarConfig}
              size={180}
              mood={mood}
              showBackground={false}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
