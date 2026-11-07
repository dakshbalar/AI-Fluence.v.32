import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Volume2,
  VolumeX,
  CheckCircle2,
} from "lucide-react";
import { GeneratedTheorySlide } from "../../types/curriculum";

interface TheoryDeckSlideModalProps {
  isOpen: boolean;
  levelId: string;
  levelTitle: string;
  bookName: string;
  moduleName: string;
  slides: GeneratedTheorySlide[];
  onClose: () => void;
  onStartQuiz: () => void;
}

export const TheoryDeckSlideModal: React.FC<TheoryDeckSlideModalProps> = ({
  isOpen,
  levelId,
  levelTitle,
  bookName,
  moduleName,
  slides,
  onClose,
  onStartQuiz,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  if (!isOpen || !slides || slides.length === 0) return null;

  const currentSlide = slides[currentSlideIndex] || slides[0];
  const progressPercent = Math.round(((currentSlideIndex + 1) / slides.length) * 100);
  const isLastSlide = currentSlideIndex === slides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      onStartQuiz();
    } else {
      setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
    }
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-[#0e172a] via-[#091122] to-[#050b16] border-2 border-cyan-500/30 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Top Bar */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/70 px-2 py-0.5 rounded-md border border-cyan-700/50">
                    {levelId}
                  </span>
                  <span className="text-xs text-slate-400 font-medium truncate max-w-[180px] sm:max-w-xs">
                    {bookName} • {moduleName}
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-black text-white truncate max-w-[220px] sm:max-w-sm mt-0.5">
                  {levelTitle}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? "Unmute audio" : "Mute audio"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar (10 slides) */}
          <div className="w-full bg-slate-900 h-1.5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-300"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Slide Stage Area */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
            {/* Slide Header & Number Badge */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Slide {currentSlide.slide_number} of {slides.length}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {isLastSlide ? "Final Summary" : `Step ${currentSlideIndex + 1}`}
              </span>
            </div>

            {/* Slide Title */}
            <motion.h3
              key={`title-${currentSlideIndex}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug drop-shadow-md"
            >
              {currentSlide.title}
            </motion.h3>

            {/* Slide Sentences / Paragraphs */}
            <motion.div
              key={`content-${currentSlideIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="space-y-3 text-sm sm:text-base text-slate-200 leading-relaxed font-normal"
            >
              {currentSlide.content.map((paragraph, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm"
                >
                  <p>{paragraph}</p>
                </div>
              ))}
            </motion.div>

            {/* Optional Bullets */}
            {currentSlide.bullets && currentSlide.bullets.length > 0 && (
              <motion.div
                key={`bullets-${currentSlideIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-2"
              >
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Key Takeaways
                </div>
                {currentSlide.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Optional Analogy or Scenario */}
            {currentSlide.analogy_or_scenario && (
              <motion.div
                key={`analogy-${currentSlideIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs sm:text-sm leading-relaxed flex items-start gap-3"
              >
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-300 text-xs uppercase tracking-wider mb-0.5">
                    Analogy & Intuition
                  </div>
                  {currentSlide.analogy_or_scenario}
                </div>
              </motion.div>
            )}

            {/* Optional Bridge to Next / Quiz */}
            {currentSlide.bridge_next && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{currentSlide.bridge_next}</span>
              </div>
            )}
          </div>

          {/* Bottom Controls */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-slate-950/80 flex items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              className="px-4 py-2.5 rounded-xl border border-white/15 text-xs sm:text-sm font-bold text-slate-300 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {/* Slide quick dots */}
            <div className="hidden sm:flex items-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentSlideIndex
                      ? "w-6 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                      : idx < currentSlideIndex
                      ? "bg-emerald-400/70"
                      : "bg-slate-700 hover:bg-slate-500"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer active:scale-95 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950"
            >
              {isLastSlide ? (
                <>
                  Start 10-Question Quiz
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next Slide
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
