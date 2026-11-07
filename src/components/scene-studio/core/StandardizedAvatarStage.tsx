import React from "react";
import { motion } from "motion/react";
import { CharacterId } from "../../../types/character";
import { CharacterMood } from "../../../types/avatar";
import { AvatarPosition, AvatarSize } from "../types";
import { AIfluenceAvatar } from "../../avatar/AIfluenceAvatar";
import { AvatarStagePlatform } from "../../onboarding-animations/shared/AvatarStagePlatform";
import { AIDEN_CONFIG, LUMI_CONFIG, VEX_CONFIG } from "../../../data/characters";

interface StandardizedAvatarStageProps {
  character?: CharacterId;
  position?: AvatarPosition;
  size?: AvatarSize;
  mood?: CharacterMood;
  showPedestal?: boolean;
  accentColor?: string;
  onClick?: () => void;
}

export const StandardizedAvatarStage: React.FC<StandardizedAvatarStageProps> = ({
  character = "aiden",
  position = "POSITION_A",
  size = "large",
  mood = "happy",
  showPedestal = true,
  accentColor,
  onClick
}) => {
  const isVex = character === "vex";
  const isLumi = character === "lumi";
  const config = isVex ? VEX_CONFIG : isLumi ? LUMI_CONFIG : AIDEN_CONFIG;

  const defaultAccent = isVex ? "#EF4444" : isLumi ? "#FF2A8D" : "#00E5FF";
  const resolvedAccent = accentColor || defaultAccent;

  // Resolve pixel dimensions based on standardized sizing
  const getAvatarPixelSize = () => {
    switch (size) {
      case "small":
        return 120;
      case "medium":
        return 220;
      case "hero":
        return 360;
      case "large":
      default:
        return 310;
    }
  };

  const pixelSize = getAvatarPixelSize();

  // POSITION B: Bust/Shoulder Close-Up on the Right (Messenger/Quiz style)
  if (position === "POSITION_B") {
    return (
      <div 
        onClick={onClick}
        className="relative shrink-0 flex items-center justify-center cursor-pointer select-none"
      >
        {/* Soft Background Accent Glow */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-50 pointer-events-none"
          style={{ backgroundColor: resolvedAccent }}
        />

        {/* Seamless Shoulder/Bust Frame (Zero border, zero circle crop) */}
        <motion.div
          animate={{
            y: [0, -4, 0],
            rotate: [0, 1.2, 0, -1.2, 0]
          }}
          transition={{
            y: { repeat: Infinity, duration: 3.2, ease: "easeInOut" },
            rotate: { repeat: Infinity, duration: 4.6, ease: "easeInOut" }
          }}
          className="relative w-28 sm:w-32 h-28 sm:h-32 overflow-hidden flex items-start justify-center"
        >
          <div className="absolute -top-1 sm:-top-2 flex items-center justify-center">
            <AIfluenceAvatar
              config={config}
              size={180}
              mood={mood}
              showBackground={false}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  // POSITION D: Small Compact Supporting Companion (Top Header / Corner badge)
  if (position === "POSITION_D") {
    return (
      <motion.div 
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md cursor-pointer"
      >
        <div 
          className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: `${resolvedAccent}22` }}
        >
          <AIfluenceAvatar
            config={config}
            size={48}
            mood={mood}
            showBackground={false}
          />
        </div>
        <div className="text-left pr-2">
          <span className="text-[10px] font-mono font-black uppercase text-white/90 block leading-tight">
            {character.toUpperCase()}
          </span>
          <span className="text-[9px] font-mono text-slate-400 block leading-tight">
            COMPANION
          </span>
        </div>
      </motion.div>
    );
  }

  // POSITION C: Centered Heroic Avatar for Milestones & Celebrations
  if (position === "POSITION_C") {
    return (
      <div 
        onClick={onClick}
        className="relative flex flex-col items-center justify-center my-auto py-2 z-10 select-none"
      >
        {/* Radiant Ambient Core Behind Avatar */}
        <div
          className="absolute w-56 h-56 rounded-full blur-3xl opacity-40 pointer-events-none"
          style={{ backgroundColor: resolvedAccent }}
        />

        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative flex flex-col items-center"
        >
          <motion.div
            animate={{
              y: [0, -8, 0],
              rotate: [0, 1.5, 0, -1.5, 0]
            }}
            transition={{
              y: { repeat: Infinity, duration: 2.8, ease: "easeInOut" },
              rotate: { repeat: Infinity, duration: 4.2, ease: "easeInOut" }
            }}
            className="relative z-10"
          >
            <AIfluenceAvatar
              config={config}
              size={pixelSize}
              mood={mood}
              showBackground={false}
            />
          </motion.div>

          {showPedestal && (
            <AvatarStagePlatform
              characterType={character}
              accentColor={resolvedAccent}
              glowColor={resolvedAccent}
            />
          )}
        </motion.div>
      </div>
    );
  }

  // POSITION A: Standard Master Stage (Lower Screen with Top Speech Direction)
  return (
    <div 
      onClick={onClick}
      className="relative flex flex-col items-center justify-center z-10 select-none -mt-4"
    >
      {/* Background Aura */}
      <div
        className="absolute w-52 h-52 rounded-full blur-3xl opacity-35 pointer-events-none"
        style={{ backgroundColor: resolvedAccent }}
      />

      <motion.div
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
        className="relative flex flex-col items-center"
      >
        <motion.div
          animate={{
            y: [0, -6, 0],
            rotate: [0, 1, 0, -1, 0]
          }}
          transition={{
            y: { repeat: Infinity, duration: 3.2, ease: "easeInOut" },
            rotate: { repeat: Infinity, duration: 4.8, ease: "easeInOut" }
          }}
          className="relative z-10"
        >
          <AIfluenceAvatar
            config={config}
            size={pixelSize}
            mood={mood}
            showBackground={false}
          />
        </motion.div>

        {showPedestal && (
          <AvatarStagePlatform
            characterType={character}
            accentColor={resolvedAccent}
            glowColor={resolvedAccent}
          />
        )}
      </motion.div>
    </div>
  );
};
