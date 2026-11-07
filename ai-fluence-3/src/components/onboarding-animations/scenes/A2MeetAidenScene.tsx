import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, Bot } from "lucide-react";
import { AIfluenceAvatar } from "../../avatar/AIfluenceAvatar";
import { AIDEN_CONFIG } from "../../../data/characters";
import { CornerStarsAndSmokeBackground } from "../shared/CornerStarsAndSmokeBackground";
import { AvatarStagePlatform } from "../shared/AvatarStagePlatform";
import { SpeechBubble } from "../shared/SpeechBubble";
import { SceneComponentProps } from "../types";

export const A2MeetAidenScene: React.FC<SceneComponentProps> = ({
  onContinue,
  onPrev,
  onDismiss
}) => {
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasEntered(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="scene-a2-meet-aiden"
      onClick={onContinue}
      className="fixed inset-0 z-[300] bg-black flex flex-col justify-between items-center select-none overflow-hidden cursor-pointer"
      style={{ backgroundColor: "#000000" }}
    >
      {/* 1. Master Background */}
      <CornerStarsAndSmokeBackground theme="aiden" />

      {/* 2. Top Header Bar */}
      <div className="relative z-50 w-full max-w-md mx-auto px-6 pt-5 pb-2 flex flex-col gap-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-[#0080FF] text-[10px] font-mono font-black uppercase tracking-widest">
            <Bot className="w-3 h-3 text-[#0080FF]" />
            <span>UNIT 01 • VANGUARD</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
            STEP A2
          </span>
        </div>
      </div>

      {/* 3. Main Stage */}
      <div className="relative z-30 flex-1 w-full max-w-md mx-auto px-5 flex flex-col items-center justify-center overflow-hidden min-h-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={hasEntered ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full flex flex-col items-center justify-center my-auto"
        >
          {/* Speech Bubble */}
          <SpeechBubble
            headline="I'm Aiden."
            subtext="I'll guide your core AI journey—breaking down complex neural architectures, prompt logic, and algorithms into clean, intuitive steps."
            delay={0.18}
            theme="aiden"
          />

          {/* Full-Body Aiden (Scale 330) */}
          <div className="relative flex flex-col items-center">
            <motion.div
              animate={{
                y: [0, -7, 0],
                rotate: [0, 0.8, 0, -0.8, 0]
              }}
              transition={{
                y: { repeat: Infinity, duration: 3.6, ease: "easeInOut" },
                rotate: { repeat: Infinity, duration: 4.8, ease: "easeInOut" }
              }}
            >
              <AIfluenceAvatar
                config={AIDEN_CONFIG}
                size={330}
                mood="happy"
                showBackground={false}
              />
            </motion.div>

            {/* Platform Pedestal */}
            <AvatarStagePlatform
              accentColor="#3B82F6"
              glowColor="#1D4ED8"
              accentGlow="#2563EB"
              characterType="aiden"
            />
          </div>
        </motion.div>
      </div>

      {/* 4. Bottom Controls */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="relative z-50 w-full max-w-md mx-auto px-6 pb-6 pt-1 flex flex-col items-center min-h-[86px] justify-end flex-shrink-0"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.35 }}
          className="w-full flex flex-col items-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onContinue}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#0080FF] hover:bg-[#0070E0] active:bg-[#0060C0] text-white font-mono text-sm sm:text-base font-black uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-[0_0_25px_rgba(0,128,255,0.45)] flex items-center justify-center gap-2"
          >
            <span>NEXT</span>
            <ArrowRight size={16} />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
