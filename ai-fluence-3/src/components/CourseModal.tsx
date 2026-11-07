import React from "react";
import { Course } from "../data";
import { X, Play, Star, BookOpen } from "lucide-react";

interface CourseModalProps {
  course: Course;
  onClose: () => void;
  onToggleFavorite?: (id: number) => void;
  isUnlocked?: boolean;
  onUnlock?: (id: number) => void;
  themeKey?: string;
}

export default function CourseModal({
  course,
  onClose,
  onToggleFavorite,
}: CourseModalProps) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0b1329] border border-white/15 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
          {course.category}
        </span>

        <h3 className="text-2xl font-bold text-white mt-3 mb-2">{course.title}</h3>
        <p className="text-sm text-slate-300 mb-6 leading-relaxed">{course.description}</p>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-white" /> Start Course
          </button>
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(course.id)}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-amber-400 border border-white/10"
            >
              <Star className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
