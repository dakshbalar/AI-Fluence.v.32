import React from "react";
import { Sparkles, Gift } from "lucide-react";

interface DailyDropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: () => void;
  streakCount?: number;
  userName?: string;
}

export const DailyDropModal: React.FC<DailyDropModalProps> = ({
  isOpen,
  onClose,
  onClaim,
  streakCount = 1,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[320] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b1329] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center relative">
        <div className="w-16 h-16 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center mx-auto mb-4">
          <Gift className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-1 flex items-center justify-center gap-2">
          Daily Drop Supply <Sparkles className="w-4 h-4 text-pink-400" />
        </h3>
        <p className="text-xs text-slate-300 mb-6">
          Day {streakCount} reward ready! Claim your daily bonus XP and gems.
        </p>

        <button
          onClick={onClaim}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all mb-2"
        >
          Claim Supplies
        </button>
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DailyDropModal;
