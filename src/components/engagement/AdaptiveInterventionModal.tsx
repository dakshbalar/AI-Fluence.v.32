import React from "react";
import { Sparkles, X } from "lucide-react";

interface AdaptiveInterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userName?: string;
}

export const AdaptiveInterventionModal: React.FC<AdaptiveInterventionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
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
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">Adaptive Focus Booster</h3>
        <p className="text-xs text-slate-300 mb-6">
          AIDEN detected a learning opportunity. Reinforce this concept to lock in your mastery!
        </p>

        <button
          onClick={onSuccess}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
        >
          Reinforce Now
        </button>
      </div>
    </div>
  );
};

export default AdaptiveInterventionModal;
