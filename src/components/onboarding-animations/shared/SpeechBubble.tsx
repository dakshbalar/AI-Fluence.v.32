import React from "react";
import { motion, AnimatePresence } from "motion/react";

interface SpeechBubbleProps {
  headline: string;
  subtext?: string;
  delay?: number;
  badge?: React.ReactNode;
  theme?: "aiden" | "lumi" | "vex";
  className?: string;
  maxWidth?: string;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  headline,
  subtext,
  delay = 0.2,
  badge,
  theme = "aiden",
  className = "",
  maxWidth = "max-w-[340px]"
}) => {
  const isVex = theme === "vex";
  const isLumi = theme === "lumi";

  const borderColor = isVex
    ? "border-2 border-red-500/20"
    : isLumi
    ? "border-2 border-pink-500/20"
    : "border-2 border-blue-500/10";

  return (
    <div className={`relative mb-5 z-20 flex flex-col items-center ${className}`}>
      {badge && <div className="mb-2">{badge}</div>}

      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 12 }}
        animate={{ scale: [0.5, 1.08, 1], opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.42, ease: [0.34, 1.56, 0.64, 1] }}
        className={`bg-white text-slate-900 px-6 sm:px-7 py-4 rounded-[26px] shadow-2xl relative flex flex-col items-center justify-center text-center ${maxWidth} ${borderColor}`}
      >
        <motion.span
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.1, duration: 0.25 }}
          className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-sans leading-tight"
        >
          {headline}
        </motion.span>

        {subtext && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2, duration: 0.3 }}
            className="text-xs sm:text-sm font-semibold text-slate-600 mt-1.5 font-sans leading-snug"
          >
            {subtext}
          </motion.p>
        )}

        {/* Speech Bubble Tail */}
        <div
          className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 pointer-events-none"
          style={{
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: "12px solid #FFFFFF"
          }}
        />
      </motion.div>
    </div>
  );
};
