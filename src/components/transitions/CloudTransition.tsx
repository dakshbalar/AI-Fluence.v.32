import React from "react";
import { motion, AnimatePresence } from "motion/react";

interface CloudTransitionProps {
  isActive: boolean;
  onAnimationMidpoint?: () => void;
  onAnimationComplete?: () => void;
}

export const CloudTransition: React.FC<CloudTransitionProps> = ({
  isActive,
  onAnimationMidpoint,
  onAnimationComplete,
}) => {
  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 z-[9990] pointer-events-none overflow-hidden flex items-center justify-center">
          {/* Backdrop dimming */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0.6, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, times: [0, 0.35, 0.65, 1] }}
            className="absolute inset-0 bg-[#04060d]/80 pointer-events-auto"
          />

          {/* Left Cloud Cluster (rushes in from left, meets in middle, parts away) */}
          <motion.div
            initial={{ x: "-110%", scale: 0.9, opacity: 0.9 }}
            animate={{
              x: ["-110%", "0%", "0%", "-120%"],
              scale: [0.9, 1.05, 1.05, 0.9],
              opacity: [0.9, 1, 1, 0.8],
            }}
            transition={{
              duration: 0.9,
              times: [0, 0.38, 0.62, 1],
              ease: ["easeOut", "easeInOut", "easeIn"],
            }}
            className="absolute -left-10 top-0 bottom-0 w-[80vw] max-w-[550px] z-10 flex items-center"
          >
            <svg
              viewBox="0 0 500 800"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-[0_0_25px_rgba(0,229,255,0.4)]"
            >
              {/* Outer Cyan Rim Glow */}
              <path
                d="M -50 0 C 120 40 220 120 230 240 C 290 280 340 360 300 460 C 370 510 390 620 310 700 C 240 760 140 780 -50 800 Z"
                fill="#00e5ff"
                opacity="0.3"
              />
              {/* Darker Cloud Body Layer */}
              <path
                d="M -60 0 C 90 30 190 100 200 220 C 260 260 310 340 270 430 C 330 480 350 580 280 660 C 210 720 110 760 -60 800 Z"
                fill="#0e1f3d"
              />
              {/* Main Puffy CoC Cloud Layer */}
              <path
                d="M -70 0 C 70 20 160 90 170 200 C 220 240 260 310 230 400 C 290 440 310 540 240 620 C 180 680 90 730 -70 800 Z"
                fill="#162a52"
              />
              {/* Fluffy Highlights */}
              <circle cx="140" cy="180" r="90" fill="#25477d" opacity="0.6" />
              <circle cx="190" cy="360" r="110" fill="#2f5799" opacity="0.7" />
              <circle cx="160" cy="560" r="100" fill="#25477d" opacity="0.6" />
              <circle cx="130" cy="340" r="70" fill="#e0f2fe" opacity="0.15" />
            </svg>
          </motion.div>

          {/* Right Cloud Cluster (rushes in from right, meets in middle, parts away) */}
          <motion.div
            initial={{ x: "110%", scale: 0.9, opacity: 0.9 }}
            animate={{
              x: ["110%", "0%", "0%", "120%"],
              scale: [0.9, 1.05, 1.05, 0.9],
              opacity: [0.9, 1, 1, 0.8],
            }}
            transition={{
              duration: 0.9,
              times: [0, 0.38, 0.62, 1],
              ease: ["easeOut", "easeInOut", "easeIn"],
            }}
            onAnimationComplete={() => {
              onAnimationComplete?.();
            }}
            className="absolute -right-10 top-0 bottom-0 w-[80vw] max-w-[550px] z-10 flex items-center"
          >
            <svg
              viewBox="0 0 500 800"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-[0_0_25px_rgba(168,85,247,0.4)]"
            >
              {/* Outer Purple Rim Glow */}
              <path
                d="M 550 0 C 380 40 280 120 270 240 C 210 280 160 360 200 460 C 130 510 110 620 190 700 C 260 760 360 780 550 800 Z"
                fill="#a855f7"
                opacity="0.3"
              />
              {/* Darker Cloud Body Layer */}
              <path
                d="M 560 0 C 410 30 310 100 300 220 C 240 260 190 340 230 430 C 170 480 150 580 220 660 C 290 720 390 760 560 800 Z"
                fill="#131738"
              />
              {/* Main Puffy CoC Cloud Layer */}
              <path
                d="M 570 0 C 430 20 340 90 330 200 C 280 240 240 310 270 400 C 210 440 190 540 260 620 C 320 680 410 730 570 800 Z"
                fill="#201f57"
              />
              {/* Fluffy Highlights */}
              <circle cx="360" cy="180" r="90" fill="#363282" opacity="0.6" />
              <circle cx="310" cy="360" r="110" fill="#473f9e" opacity="0.7" />
              <circle cx="340" cy="560" r="100" fill="#363282" opacity="0.6" />
              <circle cx="370" cy="340" r="70" fill="#fae8ff" opacity="0.15" />
            </svg>
          </motion.div>

          {/* Center Electric Crest during coverage */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.1, 1, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 0.7,
              times: [0, 0.35, 0.65, 1],
              delay: 0.1,
            }}
            className="relative z-20 flex flex-col items-center justify-center text-center select-none"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-1 shadow-[0_0_30px_rgba(0,229,255,0.7)] flex items-center justify-center border border-white/40">
              <span className="text-2xl font-black text-white drop-shadow">⚔️</span>
            </div>
            <span className="mt-2 text-xs font-mono font-black tracking-widest text-cyan-200 uppercase bg-black/60 px-3 py-1 rounded-full border border-cyan-400/40">
              A.I FLUENCE
            </span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
