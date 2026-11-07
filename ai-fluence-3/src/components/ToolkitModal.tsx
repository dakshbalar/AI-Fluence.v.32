import React from "react";
import { Toolkit } from "../data";
import { X, BookOpen } from "lucide-react";

interface ToolkitModalProps {
  toolkit: Toolkit;
  onClose: () => void;
}

export default function ToolkitModal({ toolkit, onClose }: ToolkitModalProps) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0b1329] border border-white/15 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-4">
          <BookOpen className="w-6 h-6" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">{toolkit.title}</h3>
        <p className="text-sm text-slate-300 mb-6">{toolkit.description}</p>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
        >
          Open Toolkit Resource
        </button>
      </div>
    </div>
  );
}
