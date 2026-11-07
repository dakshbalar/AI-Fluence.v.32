import React from "react";
import { X, Trophy } from "lucide-react";
import { auth } from "../../lib/firebase";
import { saveCourseEnrollment } from "../../services/progressionService";

interface LearningJourneyModalProps {
  isOpen: boolean;
  onCommit: (commitment: any) => void;
  primaryLanguage?: string;
  initialDuration?: any;
  initialTime?: any;
  userName?: string;
}

export const LearningJourneyModal: React.FC<LearningJourneyModalProps> = ({
  isOpen,
  onCommit,
  primaryLanguage = "dsa",
  userName,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    const commitment = {
      dailyGoalXP: 50,
      dailyTimeCommitment: 15,
      journeyDuration: "3_months",
      streakGoalDays: 30,
      targetCompletionDate: "",
    };

    if (auth.currentUser) {
      saveCourseEnrollment(auth.currentUser.uid, primaryLanguage, commitment).catch((err) => {
        console.warn("Could not save course enrollment:", err);
      });
    }

    onCommit(commitment);
  };

  return (
    <div className="fixed inset-0 z-[320] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b1329] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-left relative">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-4">
          <Trophy className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">
          {userName ? `${userName}'s ` : ""}Learning Journey
        </h3>
        <p className="text-xs text-slate-300 mb-6">Set your daily commitment and track your roadmap progression.</p>

        <button
          onClick={handleConfirm}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          Confirm Commitment &amp; Start
        </button>
      </div>
    </div>
  );
};

export default LearningJourneyModal;
