import React, { useState } from "react";
import { Plus, X, Sparkles, Check, ChevronRight, Info, BookOpen } from "lucide-react";
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

  // Themed Tile Icons with exact requested colors
  const renderTileIcon = (course: DropdownCourse) => {
    switch (course.code) {
      case "dsa":
        return (
          <div className="w-14 h-11 rounded-xl bg-gradient-to-br from-[#a855f7] to-[#7e22ce] shadow-md flex items-center justify-center text-white font-mono font-black text-sm border border-purple-400/30">
            DSA
          </div>
        );
      case "html":
        return (
          <div className="w-14 h-11 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#15803d] shadow-md flex items-center justify-center text-white font-mono font-black text-sm border border-emerald-400/30">
            &lt;/&gt;
          </div>
        );
      case "java":
        return (
          <div className="w-14 h-11 rounded-xl bg-gradient-to-br from-[#ef4444] to-[#b91c1c] shadow-md flex items-center justify-center text-white font-mono font-black text-sm border border-rose-400/30">
            ☕
          </div>
        );
      case "cpp":
        return (
          <div className="w-14 h-11 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] shadow-md flex items-center justify-center text-white font-mono font-black text-sm border border-blue-400/30">
            C++
          </div>
        );
      case "prompt_engineering":
        return (
          <div className="w-14 h-11 rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669] shadow-md flex items-center justify-center text-white font-mono font-black text-xs border border-emerald-400/30">
            PRM ⚡
          </div>
        );
      case "generative_ai":
        return (
          <div className="w-14 h-11 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] shadow-md flex items-center justify-center text-white font-mono font-black text-xs border border-blue-400/40">
            GEN ✨
          </div>
        );
      case "ai_for_everyone":
        return (
          <div className="w-14 h-11 rounded-xl bg-gradient-to-br from-[#eab308] to-[#ca8a04] shadow-md flex items-center justify-center text-slate-950 font-mono font-black text-xs border border-yellow-300/50">
            AI 101 💡
          </div>
        );
      default:
        return (
          <div className="w-14 h-11 rounded-xl bg-[#9333ea] shadow-md flex items-center justify-center text-white font-mono font-black text-sm">
            AI
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
                      onClick={() => handleEnrollAndSelect(c.id)}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-white/10 border-cyan-400 shadow-md"
                          : isEnrolled
                          ? "bg-white/5 border-white/15 hover:bg-white/10"
                          : "bg-white/5 border-dashed border-white/20 hover:border-cyan-400/50 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="scale-75 origin-left">{renderTileIcon(c as any)}</div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{c.name}</span>
                            {isEnrolled && (
                              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono px-1.5 py-0.2 rounded-full">
                                Enrolled
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
                          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-black uppercase">
                            + Enroll
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
