import React from "react";
import { Zap, X } from "lucide-react";

interface QuickThinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (thinkingXp: number, learningXp: number) => void;
  preferredLanguage?: string;
}

export const QuickThinkModal: React.FC<QuickThinkModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[320] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b1329] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 fill-amber-400 text-amber-300" />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">Quick Think Pulse</h3>
        <p className="text-xs text-slate-300 mb-6">
          Test your conceptual reasoning with a 60-second micro puzzle.
        </p>

        <button
          onClick={() => onComplete(25, 25)}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
        >
          Solve &amp; Earn +50 XP
        </button>
      </div>
    </div>
  );
};

export default QuickThinkModal;
