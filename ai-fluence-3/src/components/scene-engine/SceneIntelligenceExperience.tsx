import React from "react";
import { X } from "lucide-react";

interface SceneIntelligenceExperienceProps {
  onClose: () => void;
}

export const SceneIntelligenceExperience: React.FC<SceneIntelligenceExperienceProps> = ({
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-[350] bg-[#050811] flex items-center justify-center p-6 text-white text-center">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="max-w-md w-full">
        <h2 className="text-2xl font-bold mb-2">Scene Intelligence Experience</h2>
        <p className="text-sm text-slate-400 mb-6">Autonomous narrative generator &amp; dynamic level adaptation.</p>
        <button
          onClick={onClose}
          className="py-3 px-6 rounded-xl bg-cyan-500 font-bold text-sm"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SceneIntelligenceExperience;
