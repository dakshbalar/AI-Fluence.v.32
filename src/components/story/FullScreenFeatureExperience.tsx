import React from "react";
import { X, Sparkles } from "lucide-react";

interface FullScreenFeatureExperienceProps {
  experience: any;
  onClose: () => void;
  onAction?: (action: any) => void;
}

export const FullScreenFeatureExperience: React.FC<FullScreenFeatureExperienceProps> = ({
  experience,
  onClose,
  onAction,
}) => {
  return (
    <div className="fixed inset-0 z-[340] bg-[#050811]/95 backdrop-blur-xl flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 rounded-3xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-10 h-10" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">{experience?.title || "Feature Unlocked"}</h2>
        <p className="text-sm text-slate-300 mb-8">{experience?.subtitle || "Experience the next evolution of your coding journey."}</p>

        <button
          onClick={() => {
            onAction?.({ type: "explore" });
            onClose();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-base shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:brightness-110 active:scale-95 transition-all"
        >
          Engage Systems
        </button>
      </div>
    </div>
  );
};

export default FullScreenFeatureExperience;
