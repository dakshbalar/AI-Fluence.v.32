import React from "react";
import { ArrowLeft } from "lucide-react";

interface AcademyProps {
  onClose?: () => void;
  initialLevelId?: number | null;
}

export default function CSSAcademy({ onClose }: AcademyProps) {
  return (
    <div className="fixed inset-0 z-[370] bg-[#050811] flex flex-col items-center justify-center p-6 text-white">
      <button onClick={onClose} className="absolute top-6 left-6 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 flex items-center gap-2 text-sm font-bold">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>
      <h2 className="text-3xl font-black mb-2">CSS Academy</h2>
      <p className="text-slate-400">Flexbox, grid layouts, animations and 3D transforms.</p>
    </div>
  );
}
