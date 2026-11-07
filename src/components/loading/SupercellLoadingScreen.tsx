import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Terminal } from "lucide-react";

interface SupercellLoadingScreenProps {
  onLoaded: () => void;
  minDurationMs?: number;
}

export const SupercellLoadingScreen: React.FC<SupercellLoadingScreenProps> = ({
  onLoaded,
  minDurationMs = 1500,
}) => {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onLoaded, 250);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20) + 15;
      });
    }, minDurationMs / 6);

    return () => clearInterval(timer);
  }, [onLoaded, minDurationMs]);

  return (
    <div
      id="supercell-loading-screen"
      className="fixed inset-0 z-[999] bg-[#050811] flex flex-col items-center justify-center p-6 select-none overflow-hidden"
    >
      {/* Ambient Cosmic Radial Backdrop */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(0,229,255,0.18)_0%,rgba(255,42,141,0.08)_50%,transparent_80%)]" />

      {/* Cyber Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">
        {/* Animated Brand Emblem */}
        <motion.div
          animate={{ scale: [0.97, 1.03, 0.97], rotate: [0, 1, -1, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#00E5FF] via-[#3B82F6] to-[#FF2A8D] p-1 shadow-[0_0_50px_rgba(0,229,255,0.45)] mb-6"
        >
          <div className="w-full h-full bg-[#080d1a] rounded-[22px] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#00E5FF]/20 to-transparent" />
            <Terminal className="w-12 h-12 text-[#00E5FF] drop-shadow-[0_0_12px_#00E5FF]" />
          </div>
        </motion.div>

        {/* Brand Name */}
        <h1 className="text-3xl font-black tracking-wider text-white mb-1 uppercase font-mono flex items-center gap-2">
          AI FLUENCE <Sparkles className="w-5 h-5 text-[#FF2A8D]" />
        </h1>
        <p className="text-xs text-cyan-300/80 font-mono tracking-widest uppercase mb-8">
          Gamified Algorithmic & Generative Academy
        </p>

        {/* Tactile 3D Progress Bar */}
        <div className="w-full bg-slate-900/90 rounded-full h-4 border-2 border-white/20 p-0.5 shadow-2xl relative overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] via-[#38BDF8] to-[#FF2A8D] shadow-[0_0_20px_#00E5FF]"
            style={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>

        <div className="w-full flex justify-between items-center text-[11px] font-mono text-slate-400 mt-2 px-1">
          <span>INITIALIZING REALMS...</span>
          <span className="text-cyan-400 font-bold">{Math.min(progress, 100)}%</span>
        </div>
      </div>
    </div>
  );
};
