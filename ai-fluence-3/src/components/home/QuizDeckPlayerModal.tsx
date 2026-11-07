import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Sparkles,
  CheckCircle2,
  XCircle,
  Award,
  Star,
  Zap,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Flame,
  HelpCircle,
} from "lucide-react";
import { GeneratedQuizQuestion } from "../../types/curriculum";

interface QuizDeckPlayerModalProps {
  isOpen: boolean;
  levelId: string;
  levelTitle: string;
  bookName: string;
  questions: GeneratedQuizQuestion[];
  onClose: () => void;
  onCompleteLevel: (levelId: string, stars: number, score: number) => void;
  onRegenerateFreshQuiz?: () => void;
}

export const QuizDeckPlayerModal: React.FC<QuizDeckPlayerModalProps> = ({
  isOpen,
  levelId,
  levelTitle,
  bookName,
  questions,
  onClose,
  onCompleteLevel,
  onRegenerateFreshQuiz,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  if (!isOpen || !questions || questions.length === 0) return null;

  const currentQ = questions[currentQuestionIndex] || questions[0];
  const progressPercent = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
  const isCorrect = selectedOptionIndex === currentQ.correct_index;

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionIndex(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIndex === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    if (selectedOptionIndex === currentQ.correct_index) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > maxStreak) setMaxStreak(nextStreak);
    } else {
      setMistakesCount((prev) => prev + 1);
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex >= questions.length - 1) {
      setIsFinished(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswerSubmitted(false);
    }
  };

  // Final star calculations
  let finalStars = 1;
  if (mistakesCount === 0) finalStars = 3;
  else if (mistakesCount <= 2) finalStars = 2;

  const xpEarned = 50 + finalStars * 15;
  const diamondsEarned = finalStars === 3 ? 5 : 2;

  const handleClaimAndFinish = () => {
    onCompleteLevel(levelId, finalStars, 10 - mistakesCount);
    onClose();
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);
    setMistakesCount(0);
    setStreak(0);
    setIsFinished(false);
    if (onRegenerateFreshQuiz) {
      onRegenerateFreshQuiz();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-[#0f172a] via-[#091122] to-[#040812] border-2 border-emerald-500/30 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Top Bar */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-700/50">
                    {levelId}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">10-Question Quiz</span>
                </div>
                <h2 className="text-sm sm:text-base font-black text-white truncate max-w-[200px] sm:max-w-sm mt-0.5">
                  {levelTitle}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {streak > 1 && (
                <div className="flex items-center gap-1 text-xs font-black text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/40 animate-pulse">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  {streak}x Streak
                </div>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          {!isFinished && (
            <div className="w-full bg-slate-900 h-1.5 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-300"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
            {!isFinished ? (
              <>
                {/* Question Type Angle Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-emerald-400" />
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-800/40">
                      {currentQ.angle_label || currentQ.angle}
                    </span>
                  </div>
                </div>

                {/* Optional Scenario Box */}
                {currentQ.scenario && (
                  <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-xs sm:text-sm text-slate-300 font-medium">
                    <span className="text-cyan-400 font-bold block mb-1">Scenario:</span>
                    {currentQ.scenario}
                  </div>
                )}

                {/* Question Prompt */}
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug drop-shadow-sm">
                  {currentQ.prompt}
                </h3>

                {/* Options List */}
                <div className="space-y-3 pt-1">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOptionIndex === idx;
                    const isTheCorrectOne = idx === currentQ.correct_index;

                    let btnClass = "bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-white/20 text-slate-200";

                    if (isAnswerSubmitted) {
                      if (isTheCorrectOne) {
                        btnClass = "bg-emerald-950/60 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
                      } else if (isSelected && !isTheCorrectOne) {
                        btnClass = "bg-rose-950/60 border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.3)]";
                      } else {
                        btnClass = "opacity-40 border-white/5 text-slate-400";
                      }
                    } else if (isSelected) {
                      btnClass = "bg-cyan-950/70 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 cursor-pointer active:scale-[0.99] ${btnClass}`}
                      >
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border ${
                            isSelected || (isAnswerSubmitted && isTheCorrectOne)
                              ? "bg-white/20 border-white/40 text-white"
                              : "bg-white/5 border-white/10 text-slate-400"
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="text-sm sm:text-base font-medium flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback & Explanation Card */}
                {isAnswerSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl border ${
                      isCorrect
                        ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                        : "bg-rose-950/40 border-rose-500/40 text-rose-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-black text-sm mb-1">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <span>Correct! Excellent intuition.</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-rose-400" />
                          <span>Review & Learn</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 font-normal leading-relaxed">
                      {currentQ.explanation}
                    </p>
                  </motion.div>
                )}
              </>
            ) : (
              /* Finish Screen */
              <div className="text-center py-6 space-y-6">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-yellow-200 flex items-center justify-center text-slate-950 shadow-[0_0_35px_rgba(245,158,11,0.5)] animate-bounce">
                  <Award className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white">Level Complete!</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    You tested all 10 distinct question angles for {levelTitle}.
                  </p>
                </div>

                {/* Stars */}
                <div className="flex items-center justify-center gap-3">
                  {[1, 2, 3].map((starIdx) => (
                    <motion.div
                      key={starIdx}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: starIdx * 0.15 }}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 ${
                        starIdx <= finalStars
                          ? "bg-gradient-to-b from-amber-400 to-amber-600 border-yellow-200 shadow-[0_0_20px_rgba(245,158,11,0.6)] text-white"
                          : "bg-slate-800/40 border-slate-700 text-slate-600"
                      }`}
                    >
                      <Star className={`w-6 h-6 ${starIdx <= finalStars ? "fill-white" : ""}`} />
                    </motion.div>
                  ))}
                </div>

                {/* Reward Stats */}
                <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                  <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30">
                    <span className="text-[11px] font-bold text-cyan-400 block uppercase">XP Earned</span>
                    <span className="text-xl font-black text-white">+{xpEarned} XP</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30">
                    <span className="text-[11px] font-bold text-amber-400 block uppercase">Diamonds</span>
                    <span className="text-xl font-black text-white">+{diamondsEarned} 💎</span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>All questions hashed & registered in deduplication registry</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Controls */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-slate-950/80 flex items-center justify-between gap-3">
            {!isFinished ? (
              <>
                <div className="text-xs text-slate-400 font-medium">
                  {mistakesCount === 0 ? "Perfect Score so far!" : `${mistakesCount} mistake(s)`}
                </div>

                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOptionIndex === null}
                    className="px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer disabled:opacity-30 disabled:pointer-events-none active:scale-95 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer active:scale-95 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 flex items-center gap-1.5"
                  >
                    {currentQuestionIndex >= questions.length - 1 ? "View Results" : "Continue"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={handleResetQuiz}
                  className="px-4 py-2.5 rounded-xl border border-white/15 text-xs sm:text-sm font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Generates fresh deduplicated questions for replay"
                >
                  <RotateCcw className="w-4 h-4" />
                  Replay (Fresh Quiz)
                </button>

                <button
                  onClick={handleClaimAndFinish}
                  className="px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(245,158,11,0.5)] cursor-pointer active:scale-95 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 flex items-center gap-2"
                >
                  Claim & Unlock Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
