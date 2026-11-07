import React from "react";
import { OnboardingSceneId } from "./types";
import { X } from "lucide-react";

interface OnboardingAnimationHubProps {
  initialSceneId?: OnboardingSceneId | null;
  initialFullFlow?: boolean;
  onClose: () => void;
}

export const OnboardingAnimationHub: React.FC<OnboardingAnimationHubProps> = ({
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-[350] bg-[#050811] flex items-center justify-center p-6 text-white text-center">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="max-w-md w-full">
        <h2 className="text-2xl font-bold mb-2">Onboarding Animation Hub</h2>
        <p className="text-sm text-slate-400 mb-6">Interactive sequence tester and cinematic preview engine.</p>
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

export default OnboardingAnimationHub;
