import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, Swords } from "lucide-react";
import { AIfluenceAvatar } from "../../avatar/AIfluenceAvatar";
import { VEX_CONFIG } from "../../../data/characters";
import { CornerStarsAndSmokeBackground } from "../shared/CornerStarsAndSmokeBackground";
import { AvatarStagePlatform } from "../shared/AvatarStagePlatform";
import { SpeechBubble } from "../shared/SpeechBubble";
import { SceneComponentProps } from "../types";

export const A4MeetVexScene: React.FC<SceneComponentProps> = ({
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
      id="scene-a4-meet-vex"
      onClick={onContinue}
      className="fixed inset-0 z-[300] bg-black flex flex-col justify-between items-center select-none overflow-hidden cursor-pointer"
      style={{ backgroundColor: "#000000" }}
    >
      {/* 1. Master Background (Vex Crimson Aura) */}
      <CornerStarsAndSmokeBackground theme="vex" />

      {/* 2. Top Header Bar */}
      <div className="relative z-50 w-full max-w-md mx-auto px-6 pt-5 pb-2 flex flex-col gap-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/50 text-red-400 text-[10px] font-mono font-black uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            <Swords className="w-3 h-3 text-red-400 animate-pulse" />
            <span>UNIT 03 • APEX NEMESIS</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-red-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
            STEP A4
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
            headline="I'm Vex."
            subtext="I'll test your logic with relentless edge cases, adversarial tests, and boss trials. Prove your code can survive me."
            delay={0.18}
            theme="vex"
          />

          {/* Full-Body Vex (Scale 300) */}
          <div className="relative flex flex-col items-center mt-1">
            <motion.div
              animate={{
                y: [0, -6, 0],
                rotate: [0, 0.6, 0, -0.6, 0]
              }}
              transition={{
                y: { repeat: Infinity, duration: 3.4, ease: "easeInOut" },
                rotate: { repeat: Infinity, duration: 4.2, ease: "easeInOut" }
              }}
            >
              <AIfluenceAvatar
                config={VEX_CONFIG}
                size={300}
                mood="smirk"
                showBackground={false}
              />
            </motion.div>

            {/* Platform Pedestal (Crimson Vex) */}
            <AvatarStagePlatform
              accentColor="#EF4444"
              glowColor="#FF0033"
              accentGlow="#EF4444"
              characterType="vex"
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
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:from-red-700 active:to-rose-700 text-white font-mono text-sm sm:text-base font-black uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-[0_0_25px_rgba(239,68,68,0.5)] flex items-center justify-center gap-2"
          >
            <span>NEXT</span>
            <ArrowRight size={16} />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
