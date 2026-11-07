import React from "react";
import { X } from "lucide-react";

interface SceneStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SceneStudioModal: React.FC<SceneStudioModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[350] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b1329] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold text-white mb-2">Scene Studio</h3>
        <p className="text-xs text-slate-300 mb-6">Interactive stage generator &amp; dynamic background visualizer.</p>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-cyan-500 text-white font-bold text-sm"
        >
          Close Studio
        </button>
      </div>
    </div>
  );
};

export default SceneStudioModal;
