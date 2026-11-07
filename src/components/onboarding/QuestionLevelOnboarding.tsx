import React, { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

interface QuestionLevelOnboardingProps {
  isOpen: boolean;
  onComplete: (answers: { goal?: string; experience?: string }) => void;
  onSkip: () => void;
}

export const QuestionLevelOnboarding: React.FC<QuestionLevelOnboardingProps> = ({
  isOpen,
  onComplete,
  onSkip,
}) => {
  const [goal, setGoal] = useState("ai_dev");
  const [experience, setExperience] = useState("basics");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[320] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0a1226] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-left">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            CALIBRATION
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
          Calibrate Your Path <Sparkles className="w-4 h-4 text-cyan-400" />
        </h3>
        <p className="text-xs text-slate-400 mb-6">Let's personalize your algorithmic & generative milestones.</p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Primary Ambition</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "ai_dev", label: "AI Developer" },
                { id: "dsa_interviews", label: "DSA Interviews" },
                { id: "building_projects", label: "Ship Projects" },
                { id: "explore_ai", label: "Explore AI" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setGoal(item.id)}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    goal === item.id
                      ? "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_12px_rgba(0,229,255,0.3)]"
                      : "bg-slate-900 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Current Coding Experience</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "beginner", label: "Beginner" },
                { id: "basics", label: "Know Basics" },
                { id: "intermediate", label: "Intermediate" },
                { id: "advanced", label: "Advanced" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setExperience(item.id)}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    experience === item.id
                      ? "bg-pink-500/20 border-pink-400 text-white shadow-[0_0_12px_rgba(255,42,141,0.3)]"
                      : "bg-slate-900 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onComplete({ goal, experience })}
            className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-[0_4px_16px_rgba(0,229,255,0.35)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Launch Quest Map <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onSkip}
            className="py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white text-xs font-mono transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionLevelOnboarding;
