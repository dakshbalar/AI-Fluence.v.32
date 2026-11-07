import React from "react";
import { X, Flame } from "lucide-react";

interface StreakCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StreakCalendarModal: React.FC<StreakCalendarModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b1329] border border-white/15 rounded-3xl p-6 max-w-sm w-full text-center relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300">
          <X className="w-5 h-5" />
        </button>
        <div className="w-16 h-16 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center mx-auto mb-4">
          <Flame className="w-8 h-8 fill-orange-500 text-orange-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Streak Calendar</h3>
        <p className="text-xs text-slate-300 mb-4">Keep your daily algorithmic problem-solving momentum burning!</p>
        <button onClick={onClose} className="w-full py-3 rounded-xl bg-orange-500 text-white font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all">
          Awesome!
        </button>
      </div>
    </div>
  );
};

export default StreakCalendarModal;
