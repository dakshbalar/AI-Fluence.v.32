import React, { useState } from "react";
import { Plus, X, Sparkles, Check, ChevronRight, Info, BookOpen, Cpu, Code2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { COURSES_CATALOG, enrollInCourse } from "../../data/coursesData";

export interface DropdownCourse {
  id: string;
  code: string;
  name: string;
  category: string;
  score: number;
  nextScore: number;
  progressPercent: number; // 0 to 100
  isNew?: boolean;
  theme?: "purple" | "green" | "red" | "blue" | string;
}

interface CourseSelectorDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  courses: DropdownCourse[];
  enrolledCourseIds: string[];
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
  onEnrollCourse?: (courseId: string) => void;
  onAddNewCourse?: () => void;
  onMoreAboutScore?: (course: DropdownCourse) => void;
}

export const CourseSelectorDropdown: React.FC<CourseSelectorDropdownProps> = ({
  isOpen,
  onClose,
  courses,
  enrolledCourseIds,
  selectedCourseId,
  onSelectCourse,
  onEnrollCourse,
  onAddNewCourse,
  onMoreAboutScore,
}) => {
  const [showScoreInfoModal, setShowScoreInfoModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);

  if (!isOpen) return null;

  const currentCourse =
    courses.find((c) => c.id === selectedCourseId) || courses[0];

  // Enrolled courses shown in top row (Active + enrolled only)
  const enrolledCourses = courses.filter((c) => enrolledCourseIds.includes(c.id));
  // Available other courses not yet enrolled in
  const availableOtherCourses = courses.filter((c) => !enrolledCourseIds.includes(c.id));

  // Themed Tile Icons - redesigned into spectacular double-ringed medieval-modern shield emblems
  const renderTileIcon = (course: DropdownCourse) => {
    switch (course.code) {
      case "generative_ai":
        return (
          <div className="relative w-14 h-13 flex items-center justify-center shrink-0">
            {/* Double ring glow */}
            <div className="absolute w-12 h-12 rounded-full border border-blue-400/30 animate-[spin_20s_linear_infinite]" />
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#1e40af] to-[#172554] border-2 border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.6),inset_0_1px_2px_rgba(255,255,255,0.2)] flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              <Sparkles className="w-5 h-5 text-cyan-300 drop-shadow-[0_0_4px_#22d3ee]" />
              <span className="text-[7px] font-mono font-black text-white/90 uppercase tracking-widest absolute bottom-0.5">GEN AI</span>
            </div>
          </div>
        );
      case "ai_for_everyone":
        return (
          <div className="relative w-14 h-13 flex items-center justify-center shrink-0">
            {/* Double ring glow */}
            <div className="absolute w-12 h-12 rounded-full border border-yellow-400/20 animate-[spin_15s_linear_infinite]" />
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#854d0e] to-[#422006] border-2 border-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.6),inset_0_1px_2px_rgba(255,255,255,0.2)] flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              <Cpu className="w-5 h-5 text-yellow-300 drop-shadow-[0_0_4px_#facc15]" />
              <span className="text-[7px] font-mono font-black text-yellow-100 uppercase tracking-widest absolute bottom-0.5">FOUND</span>
            </div>
          </div>
        );
      case "dsa":
        return (
          <div className="relative w-14 h-13 flex items-center justify-center shrink-0">
            {/* Double ring glow */}
            <div className="absolute w-12 h-12 rounded-full border border-purple-400/20 animate-[spin_18s_linear_infinite]" />
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#6b21a8] to-[#3b0764] border-2 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.6),inset_0_1px_2px_rgba(255,255,255,0.2)] flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              <Code2 className="w-5 h-5 text-purple-300 drop-shadow-[0_0_4px_#c084fc]" />
              <span className="text-[7px] font-mono font-black text-white/90 uppercase tracking-widest absolute bottom-0.5">DSA</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#4b5563] to-[#1f2937] shadow-md flex items-center justify-center text-white font-mono font-black text-xs border border-white/20">
            {course.code.toUpperCase().slice(0, 3)}
          </div>
        );
    }
  };

  const getCourseColorHex = (code: string) => {
    switch (code) {
      case "dsa":
        return "#a855f7";
      case "html":
        return "#22c55e";
      case "java":
        return "#ef4444";
      case "cpp":
        return "#3b82f6";
      case "prompt_engineering":
        return "#10b981";
      case "generative_ai":
        return "#3b82f6";
      case "ai_for_everyone":
        return "#eab308";
      default:
        return "#a855f7";
    }
  };

  const handleEnrollAndSelect = (courseId: string) => {
    if (onEnrollCourse) {
      onEnrollCourse(courseId);
    } else {
      enrollInCourse(courseId);
    }
    onSelectCourse(courseId);
    setShowAddCourseModal(false);
    onClose();
  };

  return (
    <>
      {/* Top Anchored Dropdown Menu */}
      <div className="absolute top-12 left-0 right-0 z-50 flex flex-col items-center">
        
        {/* Dropdown Card */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="w-full bg-[#0d151c] border-b-2 border-white/10 px-4 pt-3 pb-6 shadow-2xl z-50 select-none text-left"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-w-md mx-auto">
            
            {/* 1. TOP ROW: Enrolled Courses & + Course Button */}
            <div className="flex items-start gap-3 sm:gap-4 mb-4 overflow-x-auto pb-1">
              {enrolledCourses.map((course) => {
                const isSelected = course.id === selectedCourseId;
                const accent = getCourseColorHex(course.code);
                return (
                  <button
                    key={course.id}
                    onClick={() => {
                      onSelectCourse(course.id);
                      onClose();
                    }}
                    className="flex flex-col items-center gap-1.5 cursor-pointer group focus:outline-none transition-transform active:scale-95 shrink-0"
                    id={`dropdown-course-${course.id}`}
                  >
                    {/* Squircle Tile with Selected Ring Highlight */}
                    <div
                      className={`p-1 rounded-2xl transition-all ${
                        isSelected
                          ? "border-3 shadow-lg"
                          : "border-3 border-transparent hover:border-white/20"
                      }`}
                      style={{
                        borderColor: isSelected ? accent : "transparent",
                        backgroundColor: isSelected ? `${accent}20` : "transparent",
                        boxShadow: isSelected ? `0 0 16px ${accent}40` : "none",
                      }}
                    >
                      {renderTileIcon(course)}
                    </div>
                    {/* Course Label */}
                    <span
                      className={`text-xs font-bold transition-colors ${
                        isSelected ? "text-white" : "text-slate-300 group-hover:text-white"
                      }`}
                    >
                      {course.name}
                    </span>
                  </button>
                );
              })}

              {/* Add + Course Button */}
              <button
                onClick={() => {
                  if (onAddNewCourse) onAddNewCourse();
                  else setShowAddCourseModal(true);
                }}
                className="flex flex-col items-center gap-1.5 cursor-pointer group focus:outline-none transition-transform active:scale-95 shrink-0"
                id="dropdown-add-course-btn"
              >
                <div className="w-16 h-13 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-cyan-400/50 flex items-center justify-center transition-all group-hover:scale-105">
                  <Plus className="w-6 h-6 text-cyan-400 stroke-[2.5]" />
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-cyan-300 transition-colors">
                  + Course
                </span>
              </button>
            </div>

            {/* 2. SCORE PROGRESS CARD */}
            {currentCourse && (
              <div className="bg-[#131d27] border border-white/10 rounded-2xl p-4 mb-4 shadow-inner relative overflow-hidden">
                <div
                  className="absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
                  style={{ backgroundColor: getCourseColorHex(currentCourse.code) }}
                />

                {/* Level / Score Bar Row: [ 2  ========--------  3 ] */}
                <div className="flex items-center justify-between gap-3 mb-2.5 relative z-10">
                  <span className="text-sm font-black text-white">
                    {currentCourse.score}
                  </span>
                  
                  {/* Progress Bar with Themed Fill */}
                  <div className="flex-1 h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div
                      className="h-full rounded-full transition-all duration-500 shadow-sm"
                      style={{
                        backgroundColor: getCourseColorHex(currentCourse.code),
                        width: `${Math.max(20, currentCourse.progressPercent || 40)}%`,
                      }}
                    />
                  </div>

                  <span className="text-sm font-black text-white">
                    {currentCourse.nextScore || currentCourse.score + 1}
                  </span>
                </div>

                {/* Score Description Text */}
                <div className="text-center text-sm font-bold text-slate-100 mb-2 relative z-10">
                  Your {currentCourse.name} Mastery Score is {currentCourse.score}
                </div>

                {/* Cyan Action Link: MORE ABOUT SCORE */}
                <div className="text-center relative z-10">
                  <button
                    onClick={() => {
                      if (onMoreAboutScore) {
                        onMoreAboutScore(currentCourse);
                      } else {
                        setShowScoreInfoModal(true);
                      }
                    }}
                    className="text-xs font-black tracking-wider text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer uppercase transition-colors"
                  >
                    MORE ABOUT SCORE
                  </button>
                </div>
              </div>
            )}

            {/* 3. AVAILABLE CATALOG COURSES */}
            {availableOtherCourses.length > 0 && (
              <div className="mt-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    Explore More Courses
                  </h3>
                  <button
                    onClick={() => setShowAddCourseModal(true)}
                    className="text-[11px] text-cyan-400 hover:underline font-bold"
                  >
                    View All
                  </button>
                </div>

                <div className="flex items-start gap-3 overflow-x-auto pb-1">
                  {availableOtherCourses.map((course) => (
                    <button
                      key={course.id}
                      onClick={() => handleEnrollAndSelect(course.id)}
                      className="flex flex-col items-center gap-1.5 cursor-pointer group focus:outline-none transition-transform active:scale-95 relative shrink-0"
                      id={`dropdown-available-course-${course.id}`}
                    >
                      <div className="relative">
                        <div className="p-1 rounded-2xl border-2 border-white/10 group-hover:border-cyan-400/40 transition-all">
                          {renderTileIcon(course)}
                        </div>

                        {/* Plus badge */}
                        <div className="absolute -top-1 -right-1 bg-cyan-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md leading-none">
                          +
                        </div>
                      </div>

                      <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                        {course.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </motion.div>

        {/* Dim Backdrop covering the rest of the learning map */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40"
          style={{ top: "48px" }}
          onClick={onClose}
        />
      </div>

      {/* Score Explanation Modal */}
      <AnimatePresence>
        {showScoreInfoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[#0d151c] border-2 border-white/15 rounded-3xl p-5 shadow-2xl text-left relative"
            >
              <button
                onClick={() => setShowScoreInfoModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-black text-white">
                  About Your {currentCourse.name} Score
                </h3>
              </div>

              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Your score reflects your mastery level on standard benchmarks, algorithmic accuracy, and quiz milestones in <strong>{currentCourse.name}</strong>.
              </p>

              <div className="space-y-2 text-xs text-slate-300 bg-white/5 p-3 rounded-2xl border border-white/10 mb-4">
                <div className="flex justify-between font-bold text-white">
                  <span>Current Mastery:</span>
                  <span style={{ color: getCourseColorHex(currentCourse.code) }}>Score {currentCourse.score}</span>
                </div>
                <div className="flex justify-between">
                  <span>Next Milestone:</span>
                  <span className="text-cyan-400">Score {currentCourse.nextScore || currentCourse.score + 1}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed Drills:</span>
                  <span>{currentCourse.progressPercent}% of Unit 1</span>
                </div>
              </div>

              <button
                onClick={() => setShowScoreInfoModal(false)}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 border-b-4 border-cyan-700 text-slate-950 font-black text-xs uppercase tracking-wider cursor-pointer active:translate-y-1 active:border-b-0"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Course Catalog Modal */}
      <AnimatePresence>
        {showAddCourseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[#0d151c] border-2 border-white/15 rounded-3xl p-5 shadow-2xl text-left relative max-h-[80vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowAddCourseModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <Plus className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-black text-white">Course Catalog</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Select a programming course to enroll and start learning.
              </p>

              <div className="space-y-2.5 mb-4">
                {COURSES_CATALOG.map((c) => {
                  const isEnrolled = enrolledCourseIds.includes(c.id);
                  const isCurrent = c.id === selectedCourseId;
                  const accent = getCourseColorHex(c.code);

                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        if (isEnrolled) {
                          handleEnrollAndSelect(c.id);
                        }
                      }}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                        isCurrent
                          ? "bg-white/10 border-cyan-400 shadow-md cursor-pointer"
                          : isEnrolled
                          ? "bg-white/5 border-white/15 hover:bg-white/10 cursor-pointer"
                          : "bg-black/40 border-slate-800/80 opacity-65 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="scale-75 origin-left">{renderTileIcon(c as any)}</div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{c.name}</span>
                            {isEnrolled ? (
                              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono px-1.5 py-0.2 rounded-full">
                                Enrolled
                              </span>
                            ) : (
                              <span className="bg-slate-800 text-slate-400 border border-slate-700/50 text-[9px] font-mono px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                                <Lock className="w-2 h-2" /> Locked
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">{c.category}</span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isCurrent ? (
                          <span className="text-xs font-bold text-cyan-400">Active</span>
                        ) : isEnrolled ? (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 text-[10px] font-black uppercase flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> Track Locked
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
