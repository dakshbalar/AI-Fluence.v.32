import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Bot, Palette, Smile, Zap } from "lucide-react";
import { AIfluenceAvatar, normalizeRobotConfig } from "./AIfluenceAvatar";
import { useEngagementStore } from "../../utils/engagementStore";
import { DEFAULT_AVATAR_CONFIG } from "../../data/avatarData";
import { CharacterMood } from "../../types/avatar";

interface SnapchatAvatarBubbleProps {
  onOpenStudio?: () => void;
  onShowToast: (msg: string) => void;
}

export const SnapchatAvatarBubble: React.FC<SnapchatAvatarBubbleProps> = ({
  onOpenStudio,
  onShowToast,
}) => {
  const { profile } = useEngagementStore();
  const avatarConfig = normalizeRobotConfig(profile.avatarConfig || DEFAULT_AVATAR_CONFIG);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentMood, setCurrentMood] = useState<CharacterMood>("idle");
  const [speechText, setSpeechText] = useState<string>("Hey! Tap me to change my mood or customize!");

  const moods: { mood: CharacterMood; label: string; icon: string; quote: string }[] = [
    { mood: "wave", label: "Wave", icon: "👋", quote: "Hello scholar! Let's conquer today's lessons!" },
    { mood: "happy", label: "Happy", icon: "😊", quote: "We are on fire! Keep that learning streak alive!" },
    { mood: "heroic", label: "Heroic", icon: "⚡", quote: "Nothing can stop our algorithmic momentum!" },
    { mood: "dance", label: "Dance", icon: "🕺", quote: "Victory dance mode activated! Woohoo!" },
    { mood: "thinking", label: "Logic", icon: "🧠", quote: "Analyzing optimal code patterns..." }
  ];

  const handleSelectMood = (m: (typeof moods)[0]) => {
    setCurrentMood(m.mood);
    setSpeechText(m.quote);
    onShowToast(`🤖 Companion set to ${m.label} mode!`);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[280] flex flex-col items-end pointer-events-auto">
      {/* Speech Bubble / Quick Action Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            className="mb-3 w-64 rounded-3xl bg-[#0b0e14]/95 border-2 border-cyan-400/50 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl text-left text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase text-cyan-400 font-mono flex items-center gap-1">
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Companion</span>
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-200 mb-3 font-medium bg-black/40 p-2.5 rounded-xl border border-white/10 leading-snug">
              "{speechText}"
            </p>

            <div className="grid grid-cols-5 gap-1.5 mb-3">
              {moods.map((m) => (
                <button
                  key={m.mood}
                  onClick={() => handleSelectMood(m)}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    currentMood === m.mood
                      ? "bg-cyan-500/30 border-cyan-400 text-white"
                      : "bg-white/5 border-white/10 hover:bg-white/10 text-slate-300"
                  }`}
                  title={m.label}
                >
                  <span className="text-base block">{m.icon}</span>
                </button>
              ))}
            </div>

            {onOpenStudio && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenStudio();
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Open Avatar Studio</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Snapchat-Style Floating Avatar Bubble */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-1 shadow-[0_10px_35px_rgba(0,102,255,0.6)] border-2 border-white/80 cursor-pointer relative group flex items-center justify-center overflow-hidden"
        title="Tap for AI Companion"
      >
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping pointer-events-none" />
        
        <div className="w-full h-full rounded-full bg-black/80 flex items-center justify-center overflow-hidden relative">
          <AIfluenceAvatar
            config={avatarConfig}
            mood={currentMood}
            size={72}
            animate={true}
            showBackground={false}
          />
        </div>
      </motion.button>
    </div>
  );
};
