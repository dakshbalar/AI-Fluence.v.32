import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  Heart,
  Flame,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Sparkles,
  Zap,
  Check,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Tv,
  Play,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GenAILesson } from "../../data/genaiPromptEngineeringData";
import { AIfluenceAvatar } from "../avatar/AIfluenceAvatar";
import { CharacterMood } from "../../types/avatar";
import { AIDEN_CONFIG, VEX_CONFIG, LUMI_CONFIG } from "../../data/characters";
import { CornerStarsAndSmokeBackground } from "../onboarding-animations/shared/CornerStarsAndSmokeBackground";
import { useGamification, calculateStars } from "../../utils/gamificationStore";

interface DuolingoTheoryLessonModalProps {
  lesson: GenAILesson;
  onClose: () => void;
  onComplete: (xpEarned: number, diamondsEarned: number, trophiesEarned: number) => void;
  onNextLevel?: () => void;
  onPrevLevel?: () => void;
}

export type ExtendedQuestionType =
  | "multiple_choice"
  | "true_false"
  | "fill_blank"
  | "weak_vs_strong"
  | "arrange_order";

export interface ExtendedQuestion {
  id: string;
  type: ExtendedQuestionType;
  headline: string;
  question: string;
  mascotTip?: string;
  options?: string[];
  correctIndex?: number;
  explanation: string;
  // For true_false
  correctBool?: boolean;
  // For fill_blank
  sentenceParts?: [string, string];
  blankAnswer?: string;
  wordBank?: string[];
  // For weak_vs_strong
  weakPrompt?: string;
  strongPrompt?: string;
  strongIndex?: number;
  // For arrange_order
  tokens?: string[];
  correctOrder?: string[];
}

/**
 * Shuffles options while tracking and updating the correctIndex so answers are
 * evenly distributed across A, B, C, D instead of always being option A.
 */
function shuffleOptionsWithCorrect(options: string[], correctText: string): {
  shuffled: string[];
  correctIndex: number;
} {
  const items = [...options];
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  const correctIndex = items.indexOf(correctText);
  return { shuffled: items, correctIndex: correctIndex >= 0 ? correctIndex : 0 };
}

// Generate 10 short, versatile, kid-friendly questions per level with randomized answer positions
function generateCompleteQuestionDeck(lesson: GenAILesson): ExtendedQuestion[] {
  const deck: ExtendedQuestion[] = [];
  const title = (lesson.title || "Generative AI").replace(/^\d+\.\s*/, "");
  const takeaway = lesson.keyTakeaway || "Clear prompts eliminate guessing.";

  // Question 1: Direct Concept Question (Multiple Choice)
  const q1Correct = "Direct the AI to create accurate, high-quality output";
  const q1Raw = [
    q1Correct,
    "Fix broken physical computer hardware",
    "Acts purely as an offline math calculator",
    "Stores system files permanently",
  ];
  const q1Shuffled = shuffleOptionsWithCorrect(q1Raw, q1Correct);
  deck.push({
    id: `q-${lesson.id}-1`,
    type: "multiple_choice",
    headline: "Select the correct answer",
    question: `What is the main goal of ${title}?`,
    options: q1Shuffled.shuffled,
    correctIndex: q1Shuffled.correctIndex,
    explanation: `${takeaway}`,
    mascotTip: "Clear instructions guide AI outputs!",
  });

  // Question 2: True / False (Mind Reader Misconception)
  deck.push({
    id: `q-${lesson.id}-2`,
    type: "true_false",
    headline: "True or False?",
    question: `Is an AI model a mind reader that knows what you want without instructions?`,
    correctBool: false,
    options: ["TRUE", "FALSE"],
    correctIndex: 1,
    explanation: "False! AI is an interpreter, not a mind reader. It needs clear instructions.",
    mascotTip: "Never leave key choices unsaid!",
  });

  // Question 3: Which Prompt is Stronger? (Multiple Choice)
  const q3Correct = "A prompt defining role, specific task, and bullet-point format";
  const q3Raw = [
    q3Correct,
    "A vague prompt with only one word",
    "An empty prompt with no instructions",
    "A prompt composed only of emojis",
  ];
  const q3Shuffled = shuffleOptionsWithCorrect(q3Raw, q3Correct);
  deck.push({
    id: `q-${lesson.id}-3`,
    type: "multiple_choice",
    headline: "Select the best approach",
    question: `Which prompt gives the most reliable response?`,
    options: q3Shuffled.shuffled,
    correctIndex: q3Shuffled.correctIndex,
    explanation: "Specific prompts define what to create, the audience, and the format.",
    mascotTip: "Clear constraints bound the model's output!",
  });

  // Question 4: Fill in the Blank (Word Bank)
  const bank4 = ["Guessing", "Electricity", "File sizes", "Audio volume"];
  const b4Shuffled = shuffleOptionsWithCorrect(bank4, "Guessing");
  deck.push({
    id: `q-${lesson.id}-4`,
    type: "fill_blank",
    headline: "Complete the statement",
    question: `Tap the correct word to complete the rule:`,
    sentenceParts: [
      "Giving clear instructions stops the AI model from",
      "what you wanted.",
    ],
    blankAnswer: "Guessing",
    wordBank: b4Shuffled.shuffled,
    correctIndex: b4Shuffled.correctIndex,
    explanation: "Clear instructions reduce ambiguity and eliminate wild guessing.",
    mascotTip: "Guide the AI with exact details!",
  });

  // Question 5: Arrange Sequence (Execution Pipeline Order)
  deck.push({
    id: `q-${lesson.id}-5`,
    type: "arrange_order",
    headline: "Arrange the execution steps",
    question: "Tap the blocks in proper sequence from first to last:",
    tokens: [
      "1. Role / Persona",
      "2. Background Context",
      "3. Task Objective",
      "4. Output Format",
    ],
    correctOrder: [
      "1. Role / Persona",
      "2. Background Context",
      "3. Task Objective",
      "4. Output Format",
    ],
    options: [
      "1. Role / Persona",
      "2. Background Context",
      "3. Task Objective",
      "4. Output Format",
    ],
    correctIndex: 0,
    explanation:
      "Standard prompt structure frames the Role first, provides Context, defines Task, and specifies Output Format.",
    mascotTip: "A structured hierarchy ensures high token attention on output rules!",
  });

  // Question 6: Scenario Analysis (Multiple Choice)
  const q6Correct = "Specify strict length constraints and bullet-point format";
  const q6Raw = [
    q6Correct,
    "Type the entire prompt in all capital letters",
    "Refresh the browser tab over and over",
    "Ask the AI to guess what you were thinking",
  ];
  const q6Shuffled = shuffleOptionsWithCorrect(q6Raw, q6Correct);
  deck.push({
    id: `q-${lesson.id}-6`,
    type: "multiple_choice",
    headline: "Scenario Analysis",
    question: `If an AI gives an answer that is too long and off-topic, what is the best fix?`,
    options: q6Shuffled.shuffled,
    correctIndex: q6Shuffled.correctIndex,
    explanation:
      "Adding explicit length constraints and structural formats immediately reins in verbose AI answers.",
    mascotTip: "Constraints always improve output quality!",
  });

  // Question 7: True / False (Constraints Rule)
  deck.push({
    id: `q-${lesson.id}-7`,
    type: "true_false",
    headline: "True or False: Constraints",
    question: `Statement: Giving the AI a specific format (like bullet points or JSON) reduces hallucinated errors.`,
    correctBool: true,
    options: ["TRUE", "FALSE"],
    correctIndex: 0,
    explanation:
      "True! Explicit formatting narrows the probability space and enforces output validity.",
    mascotTip: "Structured formatting prevents model drift!",
  });

  // Question 8: Fill in the Blank (Constraints Bank)
  const bank8 = ["Constraints", "Colors", "Passwords", "Mistakes"];
  const b8Shuffled = shuffleOptionsWithCorrect(bank8, "Constraints");
  deck.push({
    id: `q-${lesson.id}-8`,
    type: "fill_blank",
    headline: "Complete the statement",
    question: `Select the missing term:`,
    sentenceParts: [
      "Adding clear",
      "to your prompt prevents the model from assuming facts.",
    ],
    blankAnswer: "Constraints",
    wordBank: b8Shuffled.shuffled,
    correctIndex: b8Shuffled.correctIndex,
    explanation:
      "Negative constraints and positive rules keep AI generations within intended boundaries.",
    mascotTip: "Constraints are the guardrails of prompt engineering!",
  });

  // Question 9: Multiple Choice (Output Format)
  const q9Correct = "It makes the answer structured, predictable, and easy to use";
  const q9Raw = [
    q9Correct,
    "It makes the computer run out of battery faster",
    "It turns off the internet connection",
    "It causes the AI to forget the prompt completely",
  ];
  const q9Shuffled = shuffleOptionsWithCorrect(q9Raw, q9Correct);
  deck.push({
    id: `q-${lesson.id}-9`,
    type: "multiple_choice",
    headline: "Select the correct benefit",
    question: `Why should you always specify the desired output format?`,
    options: q9Shuffled.shuffled,
    correctIndex: q9Shuffled.correctIndex,
    explanation:
      "Specifying format (e.g. 3 bullet points, summary table, or JSON) ensures you get exactly what you need.",
    mascotTip: "Never leave output format up to chance!",
  });

  // Question 10: Capstone Golden Rule (Multiple Choice)
  const q10Correct = "Be specific about role, task, context, and output format";
  const q10Raw = [
    q10Correct,
    "Keep instructions secret and hidden from the model",
    "Use only random symbols and punctuation marks",
    "Never tell the AI what format you expect",
  ];
  const q10Shuffled = shuffleOptionsWithCorrect(q10Raw, q10Correct);
  deck.push({
    id: `q-${lesson.id}-10`,
    type: "multiple_choice",
    headline: "The Golden Rule",
    question: `What is the Golden Rule of Prompt Engineering?`,
    options: q10Shuffled.shuffled,
    correctIndex: q10Shuffled.correctIndex,
    explanation:
      "AI is an interpreter, not a mind reader! Clearly specify your goal, context, and format for the best results.",
    mascotTip: "You've mastered this chapter's key rule!",
  });

  return deck;
}

export const DuolingoTheoryLessonModal: React.FC<DuolingoTheoryLessonModalProps> = ({
  lesson,
  onClose,
  onComplete,
  onNextLevel,
  onPrevLevel,
}) => {
  // Question deck guaranteed to have 8 to 10 questions per level with randomized answer indices
  const questions: ExtendedQuestion[] = useMemo(() => {
    return generateCompleteQuestionDeck(lesson);
  }, [lesson]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [arrangedTokens, setArrangedTokens] = useState<string[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [hearts, setHearts] = useState<number>(5);
  const [comboStreak, setComboStreak] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // 5 Combo Celebration Slide state
  const [showComboSlide, setShowComboSlide] = useState<boolean>(false);
  const [pendingComboSlide, setPendingComboSlide] = useState<boolean>(false);
  const [hasShownFiveCombo, setHasShownFiveCombo] = useState<boolean>(false);

  // Ad simulation for doubling rewards
  const [isWatchingAd, setIsWatchingAd] = useState<boolean>(false);
  const [adCountdown, setAdCountdown] = useState<number>(3);
  const [isRewardsDoubled, setIsRewardsDoubled] = useState<boolean>(false);
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const { completeLevelState } = useGamification();

  // Final Rewards
  const baseReward = useMemo(() => ({
    xp: 50 + comboStreak * 5,
    diamonds: 25,
    trophies: 20,
  }), [comboStreak]);

  const finalReward = useMemo(() => ({
    xp: isRewardsDoubled ? baseReward.xp * 2 : baseReward.xp,
    diamonds: isRewardsDoubled ? baseReward.diamonds * 2 : baseReward.diamonds,
    trophies: isRewardsDoubled ? baseReward.trophies * 2 : baseReward.trophies,
  }), [isRewardsDoubled, baseReward]);

  const currentQ = questions[currentIndex] || questions[0];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  // Determine character mascot: Divided intelligently between Aiden, Vex, and Lumi
  const mascotInfo = useMemo(() => {
    if (currentQ.type === "arrange_order" || currentQ.type === "fill_blank" || currentIndex === 2 || currentIndex === 7) {
      return {
        name: "LUMI",
        role: "LOGIC ARCHITECT",
        config: LUMI_CONFIG,
        badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
        speechBorder: "border-emerald-400/40",
        speechGlow: "shadow-emerald-500/10",
        accentGlow: "#10b981",
      };
    }
    if (currentQ.type === "weak_vs_strong" || currentIndex === 3 || currentIndex === 6 || currentIndex === 8) {
      return {
        name: "VEX",
        role: "CHALLENGER & OPTIMIZER",
        config: VEX_CONFIG,
        badgeColor: "bg-rose-500/20 text-rose-300 border-rose-400/40",
        speechBorder: "border-rose-400/40",
        speechGlow: "shadow-rose-500/10",
        accentGlow: "#f43f5e",
      };
    }
    return {
      name: "AIDEN",
      role: "LEARN COMPANION",
      config: AIDEN_CONFIG,
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
      speechBorder: "border-cyan-400/40",
      speechGlow: "shadow-cyan-500/10",
      accentGlow: "#00e5ff",
    };
  }, [currentQ, currentIndex]);

  // Mascot dynamic facial mood reaction
  const avatarMood: CharacterMood = useMemo(() => {
    if (!isAnswerChecked) return "idle";
    return isCorrect ? "celebrating" : "confused";
  }, [isAnswerChecked, isCorrect]);

  // Handle Option Selection
  const handleSelectOption = (idx: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(idx);
  };

  // Handle Token Arrangement Tap
  const handleToggleArrangeToken = (token: string) => {
    if (isAnswerChecked) return;
    if (arrangedTokens.includes(token)) {
      setArrangedTokens((prev) => prev.filter((t) => t !== token));
    } else {
      setArrangedTokens((prev) => [...prev, token]);
    }
  };

  // Verify Answer Evaluation
  const handleCheckAnswer = () => {
    if (isAnswerChecked) return;

    let correct = false;

    if (currentQ.type === "arrange_order") {
      const correctOrder = currentQ.correctOrder || currentQ.tokens || [];
      correct =
        arrangedTokens.length === correctOrder.length &&
        arrangedTokens.every((t, i) => t === correctOrder[i]);
    } else if (currentQ.type === "fill_blank") {
      const selectedWord = currentQ.wordBank?.[selectedOption ?? -1];
      correct = selectedWord === currentQ.blankAnswer;
    } else {
      correct = selectedOption === currentQ.correctIndex;
    }

    setIsCorrect(correct);
    setIsAnswerChecked(true);
    setShowExplanation(true);

    if (correct) {
      const nextStreak = comboStreak + 1;
      setComboStreak(nextStreak);
      if (nextStreak === 5 && !hasShownFiveCombo) {
        setPendingComboSlide(true);
      }
    } else {
      // Wrong answer resets streak immediately
      setComboStreak(0);
      setPendingComboSlide(false);
      setHearts((prev) => Math.max(0, prev - 1));
      setMistakesCount((prev) => prev + 1);
    }
  };

  // Next Question or Finish (intercepting for 5 Combo Slide)
  const handleContinue = () => {
    if (pendingComboSlide) {
      setShowComboSlide(true);
      setPendingComboSlide(false);
      setHasShownFiveCombo(true);
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setArrangedTokens([]);
      setIsAnswerChecked(false);
      setIsCorrect(false);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
      const earnedStars = calculateStars(mistakesCount);
      const primaryId = String(lesson.id);
      const sectionNum = lesson.id >= 900 ? 3 : lesson.id >= 800 ? 2 : lesson.id >= 700 ? 1 : 1;
      const levelNum = lesson.id >= 700 ? (lesson.id % 100) : lesson.id;

      completeLevelState(
        primaryId,
        earnedStars,
        finalReward.xp,
        undefined,
        {
          courseId: "generative_ai",
          courseName: "Generative AI",
          sectionNumber: sectionNum,
          sectionTitle: `Section ${sectionNum}`,
          levelNumber: levelNum,
          levelTitle: lesson.title,
          trophiesGained: finalReward.trophies || 25,
          diamondsGained: finalReward.diamonds || 10,
        }
      );

      if (lesson.id >= 700) {
        const globalIdx = lesson.id >= 900 ? lesson.id - 900 + 80 : lesson.id >= 800 ? lesson.id - 800 + 40 : lesson.id - 700;
        completeLevelState(String(globalIdx), earnedStars, 0);
        completeLevelState(`generative_ai_s${sectionNum}_l${levelNum}`, earnedStars, 0);
        if ((lesson as any).level_id) {
          completeLevelState((lesson as any).level_id, earnedStars, 0);
        }
      }
    }
  };

  // Dismiss 5 Combo Slide and Proceed
  const handleDismissComboSlide = () => {
    setShowComboSlide(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setArrangedTokens([]);
      setIsAnswerChecked(false);
      setIsCorrect(false);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
      const earnedStars = calculateStars(mistakesCount);
      const primaryId = String(lesson.id);
      const sectionNum = lesson.id >= 900 ? 3 : lesson.id >= 800 ? 2 : lesson.id >= 700 ? 1 : 1;
      const levelNum = lesson.id >= 700 ? (lesson.id % 100) : lesson.id;

      completeLevelState(
        primaryId,
        earnedStars,
        finalReward.xp,
        undefined,
        {
          courseId: "generative_ai",
          courseName: "Generative AI",
          sectionNumber: sectionNum,
          sectionTitle: `Section ${sectionNum}`,
          levelNumber: levelNum,
          levelTitle: lesson.title,
          trophiesGained: finalReward.trophies || 25,
          diamondsGained: finalReward.diamonds || 10,
        }
      );

      if (lesson.id >= 700) {
        const globalIdx = lesson.id >= 900 ? lesson.id - 900 + 80 : lesson.id >= 800 ? lesson.id - 800 + 40 : lesson.id - 700;
        completeLevelState(String(globalIdx), earnedStars, 0);
      }
    }
  };

  // Ad watch countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWatchingAd) {
      if (adCountdown > 0) {
        timer = setTimeout(() => setAdCountdown((prev) => prev - 1), 1000);
      } else {
        setIsWatchingAd(false);
        setIsRewardsDoubled(true);
      }
    }
    return () => clearTimeout(timer);
  }, [isWatchingAd, adCountdown]);

  const handleStartWatchAd = () => {
    if (isRewardsDoubled || isWatchingAd) return;
    setIsWatchingAd(true);
    setAdCountdown(3);
  };

  // =========================================================================
  // SIMULATED AD WATCHING MODAL
  // =========================================================================
  if (isWatchingAd) {
    return (
      <div className="fixed inset-0 z-[360] bg-black/95 flex flex-col items-center justify-center p-6 text-white text-center select-none">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center mb-5 animate-pulse">
          <Tv className="w-10 h-10 text-amber-400" />
        </div>
        <div className="text-xs font-sans font-bold uppercase tracking-widest text-amber-400 mb-2">
          PARTNER SPONSORED REWARD
        </div>
        <h2 className="text-2xl font-black text-white mb-2">
          Doubling Academy Rewards...
        </h2>
        <p className="text-sm text-slate-400 max-w-xs mb-6">
          Watching sponsored partner simulation to receive 2x XP, Diamonds & Trophies.
        </p>
        <div className="w-16 h-16 rounded-full border-4 border-amber-400/30 border-t-amber-400 flex items-center justify-center text-2xl font-black font-sans text-amber-300 animate-spin mb-4">
          <span className="animate-none">{adCountdown}</span>
        </div>
        <div className="text-xs text-slate-500 font-sans font-medium">
          Reward automatically applies when timer reaches 0
        </div>
      </div>
    );
  }

  // =========================================================================
  // FINAL VICTORY CELEBRATION SLIDE (With Prev Level, Next Level & Watch Ad)
  // =========================================================================
  if (isFinished) {
    return (
      <div className="fixed inset-0 z-[300] bg-[#07090e]/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-6 text-white select-none overflow-hidden">
        <CornerStarsAndSmokeBackground
          theme="blue"
          topStarsClassName="top-6"
          bottomStarsClassName="bottom-8"
        />

        {/* Top Header */}
        <header className="w-full max-w-md flex items-center justify-between z-20 pt-2">
          <span className="text-xs font-sans font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            LEVEL COMPLETED!
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Center Content */}
        <main className="w-full max-w-md flex-1 flex flex-col items-center justify-center text-center z-20 py-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="relative mb-3"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-500/30 via-yellow-400/20 to-amber-600/30 border-2 border-yellow-400/60 flex items-center justify-center shadow-[0_0_50px_rgba(250,204,21,0.5)]">
              <Trophy className="w-12 h-12 sm:w-14 sm:h-14 text-yellow-300 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
            </div>
            <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-2 -right-2 animate-spin" />
          </motion.div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
            Lesson Complete!
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xs mb-3">
            You mastered {lesson.title}. Trophies and rewards ready to claim!
          </p>

          {/* 3 Golden Stars Rating Display based on mistakes */}
          <div className="flex items-center justify-center gap-3 my-2">
            {calculateStars(mistakesCount).map((isEarned, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15 + idx * 0.1, type: "spring", stiffness: 300 }}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 shadow-lg transition-all ${
                  isEarned
                    ? "bg-gradient-to-tr from-amber-500/30 to-yellow-400/20 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)] text-yellow-300"
                    : "bg-white/5 border-white/15 text-slate-600"
                }`}
              >
                <Star className={`w-6 h-6 ${isEarned ? "fill-yellow-400 text-yellow-300" : "fill-none text-slate-600"}`} />
              </motion.div>
            ))}
          </div>

          <div className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider mb-4 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30">
            {mistakesCount === 0
              ? "★ ★ ★ PERFECT RUN (0 MISTAKES — 3 STARS)"
              : mistakesCount === 1
              ? "★ ★ ☆ GREAT RUN (1 MISTAKE — 2 STARS)"
              : "★ ☆ ☆ PASSED (2+ MISTAKES — 1 STAR)"}
          </div>

          {/* Reward Badges Grid */}
          <div className="w-full grid grid-cols-3 gap-2.5 mb-5">
            <div className="p-3 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-amber-400/30 shadow-lg text-center">
              <div className="text-[10px] font-sans uppercase text-amber-400 font-bold mb-0.5">XP</div>
              <div className="text-lg font-sans font-black text-white">+{finalReward.xp}</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-cyan-400/30 shadow-lg text-center">
              <div className="text-[10px] font-sans uppercase text-cyan-400 font-bold mb-0.5">DIAMONDS</div>
              <div className="text-lg font-sans font-black text-white">+{finalReward.diamonds} 💎</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-yellow-400/30 shadow-lg text-center">
              <div className="text-[10px] font-sans uppercase text-yellow-400 font-bold mb-0.5">TROPHIES</div>
              <div className="text-lg font-sans font-black text-white">+{finalReward.trophies} 🏆</div>
            </div>
          </div>

          {/* Watch Ad to Double Button */}
          {!isRewardsDoubled ? (
            <button
              onClick={handleStartWatchAd}
              className="w-full py-3.5 px-4 rounded-2xl font-sans font-black text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 shadow-[0_4px_16px_rgba(245,158,11,0.4)] border border-yellow-200 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mb-2"
            >
              <Tv className="w-4 h-4 text-slate-950" />
              <span>WATCH AD TO DOUBLE REWARDS (2X)</span>
            </button>
          ) : (
            <div className="w-full py-2.5 px-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-sans font-bold flex items-center justify-center gap-2 mb-2">
              <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
              <span>REWARDS DOUBLED! 2X BOOSTER APPLIED</span>
            </div>
          )}
        </main>

        {/* Final Navigation Footer: Prev Level, Next Level & Continue */}
        <footer className="w-full max-w-md mx-auto z-20 space-y-2 pb-2">
          <div className="flex items-center gap-2">
            {onPrevLevel && (
              <button
                onClick={() => {
                  onPrevLevel();
                }}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>PREV LEVEL</span>
              </button>
            )}

            {onNextLevel && (
              <button
                onClick={() => {
                  onComplete(finalReward.xp, finalReward.diamonds, finalReward.trophies);
                  onNextLevel();
                }}
                className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-md shadow-cyan-600/30"
              >
                <span>NEXT LEVEL</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => {
              onComplete(finalReward.xp, finalReward.diamonds, finalReward.trophies);
              onClose();
            }}
            className="w-full py-4 rounded-2xl font-sans font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 border-b-4 border-blue-800 shadow-[0_4px_16px_rgba(14,165,233,0.35)] active:border-b-0 active:translate-y-1 hover:from-cyan-400 hover:to-blue-500 cursor-pointer flex items-center justify-center gap-2 transition-all"
          >
            <span>CONTINUE TO MAP</span>
            <ChevronRight className="w-5 h-5 stroke-[3]" />
          </button>
        </footer>
      </div>
    );
  }

  // =========================================================================
  // 5 COMBO CELEBRATION SLIDE (AIDEN SAYS: 5 COMBO!)
  // =========================================================================
  if (showComboSlide) {
    return (
      <div className="fixed inset-0 z-[290] bg-[#0c161d] flex flex-col justify-between p-5 sm:p-7 text-white select-none overflow-hidden">
        {/* Dynamic stars & ambience */}
        <CornerStarsAndSmokeBackground
          theme="amber"
          topStarsClassName="top-4"
          bottomStarsClassName="bottom-6"
        />

        {/* Top Flame Badge */}
        <header className="w-full max-w-md mx-auto flex items-center justify-center pt-3 z-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 via-orange-500/30 to-amber-500/20 border-2 border-amber-400/60 px-5 py-2 rounded-full shadow-[0_0_25px_rgba(245,158,11,0.3)]"
          >
            <Flame className="w-6 h-6 fill-amber-400 text-amber-400 animate-bounce" />
            <span className="font-sans font-black text-lg text-amber-300 tracking-wider">
              5 IN A ROW!
            </span>
            <Flame className="w-6 h-6 fill-amber-400 text-amber-400 animate-bounce" />
          </motion.div>
        </header>

        {/* Center Stage: Aiden on Cyber Floor Pedestal with Speech Bubble */}
        <main className="w-full max-w-md mx-auto flex-1 flex flex-col items-center justify-center relative py-4 z-10">
          {/* Aiden's Comic Speech Bubble */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
            className="relative mb-6 z-20"
          >
            <div className="bg-[#16252e] border-2 border-amber-400 text-white px-6 py-4 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center text-center max-w-[320px] relative">
              <span className="text-2xl font-black text-amber-300 tracking-tight flex items-center gap-1.5 font-sans">
                5 COMBO! 🔥
              </span>
              <p className="text-sm font-bold text-slate-100 mt-1.5 leading-snug font-sans">
                5 correct questions in a row! You're on an absolute roll!
              </p>

              {/* Speech Bubble Tail pointing DOWN to Aiden */}
              <div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0"
                style={{
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderTop: "12px solid #f59e0b",
                }}
              />
              <div
                className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-0 h-0"
                style={{
                  borderLeft: "9px solid transparent",
                  borderRight: "9px solid transparent",
                  borderTop: "10px solid #16252e",
                }}
              />
            </div>
          </motion.div>

          {/* Aiden Full Body on Holographic Floor Platform */}
          <div className="relative w-[200px] h-[240px] flex items-end justify-center pb-4">
            {/* Holographic Cyber Stage Pedestal on Floor (Avatar edit page style) */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-0">
              <div
                className="w-40 sm:w-48 h-10 sm:h-12 rounded-[100%] border-2 border-dashed opacity-60 animate-[spin_25s_linear_infinite]"
                style={{ borderColor: "#00E5FF" }}
              />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 sm:w-36 h-6 sm:h-8 rounded-[100%] blur-md opacity-70"
                style={{
                  backgroundColor: "#00E5FF",
                  boxShadow: "0 0 35px #00E5FF",
                }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 sm:w-42 h-8 sm:h-10 rounded-[100%] border border-white/30 bg-white/10 backdrop-blur-sm" />
            </div>

            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.2,
                ease: "easeInOut",
              }}
              className="relative z-10"
            >
              <AIfluenceAvatar
                config={AIDEN_CONFIG}
                size={220}
                mood="celebrating"
                animate={true}
                showBackground={false}
              />
            </motion.div>
          </div>

          {/* Streak bonus badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-4 text-xs font-sans font-bold text-amber-300 bg-amber-500/20 border border-amber-400/40 px-4 py-1.5 rounded-full flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>5 COMBO BONUS XP MULTIPLIER UNLOCKED</span>
          </motion.div>
        </main>

        {/* Continue Button */}
        <footer className="w-full max-w-md mx-auto pb-3 z-10">
          <button
            onClick={handleDismissComboSlide}
            className="w-full py-4 rounded-2xl font-sans font-black text-sm sm:text-base uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 border-b-4 border-amber-700 shadow-[0_4px_20px_rgba(245,158,11,0.4)] active:border-b-0 active:translate-y-1 hover:brightness-105 cursor-pointer flex items-center justify-center gap-2 transition-all"
          >
            <span>CONTINUE</span>
            <ChevronRight className="w-5 h-5 stroke-[3]" />
          </button>
        </footer>
      </div>
    );
  }

  // =========================================================================
  // MAIN QUIZ SCREEN: CLEAN DUOLINGO EXPERIENCE
  // =========================================================================
  // Dynamic glow theme & ambient background lighting based on user's answer check
  const currentGlowTheme = !isAnswerChecked ? "blue" : isCorrect ? "green" : "red";
  const ambientBgClass = !isAnswerChecked
    ? "bg-[#060e18]"
    : isCorrect
    ? "bg-[#02130a]"
    : "bg-[#170307]";

  return (
    <div
      className={`fixed inset-0 z-[280] ${ambientBgClass} flex flex-col justify-between p-4 sm:p-6 text-white select-none overflow-hidden transition-colors duration-500`}
    >
      <CornerStarsAndSmokeBackground
        theme={currentGlowTheme}
        topStarsClassName="top-4"
        bottomStarsClassName="bottom-6"
      />

      {/* Dynamic Ambient Radial Glow (shifts to green for right answer, red for wrong) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
          !isAnswerChecked
            ? "bg-[radial-gradient(circle_at_50%_35%,rgba(0,180,255,0.18)_0%,rgba(0,0,0,0)_70%)]"
            : isCorrect
            ? "bg-[radial-gradient(circle_at_50%_35%,rgba(16,185,129,0.35)_0%,rgba(0,0,0,0)_70%)]"
            : "bg-[radial-gradient(circle_at_50%_35%,rgba(244,63,94,0.35)_0%,rgba(0,0,0,0)_70%)]"
        }`}
      />

      {/* =======================================================================
          TOP BAR: DISMISS, SMOOTH PROGRESS & STATS
          ======================================================================= */}
      <header className="w-full max-w-md mx-auto flex items-center justify-between gap-3 z-20 pb-2">
        {/* Dismiss / Close */}
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Duolingo Rounded Progress Bar */}
        <div className="flex-1 h-3.5 rounded-full bg-[#1b2b35] p-0.5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-sm"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Stats: Hearts & Streak */}
        <div className="flex items-center gap-2">
          {comboStreak > 1 && (
            <div className="flex items-center gap-1 text-xs font-sans font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
              <span>{comboStreak}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs font-sans font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>{hearts}</span>
          </div>
        </div>
      </header>

      {/* Clean Headline */}
      <h2 className="w-full max-w-md mx-auto text-lg sm:text-xl font-bold text-white px-1 pt-1 pb-1 font-sans text-left z-20">
        {currentQ.type === "arrange_order"
          ? "Arrange in sequence"
          : currentQ.type === "fill_blank"
          ? "Complete the statement"
          : "Select the correct answer"}
      </h2>

      {/* =======================================================================
          QUESTION AREA: LONG WHITE CAPSULE WITH BOLD DARK TEXT (IMAGE 3 SPEC)
          ======================================================================= */}
      <section className="w-full max-w-md mx-auto my-auto py-2 z-20">
        <div className="w-full bg-white text-slate-900 px-6 sm:px-8 py-5 rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.5)] border-2 border-slate-100 flex flex-col items-center justify-center text-center">
          <p className="text-base sm:text-lg font-bold font-sans text-slate-900 leading-snug">
            {currentQ.question}
          </p>

          {/* Inline Fill-In-The-Blank statement inside the capsule */}
          {currentQ.type === "fill_blank" && currentQ.sentenceParts && (
            <div className="text-xs sm:text-sm font-bold font-sans text-slate-800 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-300 mt-3">
              <span>{currentQ.sentenceParts[0]} </span>
              <span className="text-blue-700 underline font-black">
                {selectedOption !== null && currentQ.wordBank?.[selectedOption]
                  ? currentQ.wordBank[selectedOption]
                  : "[ ______ ]"}
              </span>
              <span> {currentQ.sentenceParts[1]}</span>
            </div>
          )}
        </div>
      </section>

      {/* =======================================================================
          STAGE 2: OPTIONS BELOW (TRANSPARENT WITH GLOW, BLUE GRADIENT WHEN SELECTED)
          ======================================================================= */}
      <section className="w-full max-w-md mx-auto my-auto z-20 flex flex-col justify-center">
        {/* Arrange Order Mode */}
        {currentQ.type === "arrange_order" && currentQ.tokens && (
          <div className="w-full flex flex-col gap-2.5">
            {currentQ.tokens.map((token, idx) => {
              const isSelected = arrangedTokens.includes(token);
              const orderNum = arrangedTokens.indexOf(token) + 1;
              return (
                <button
                  key={idx}
                  onClick={() => handleToggleArrangeToken(token)}
                  disabled={isAnswerChecked}
                  className={`w-full py-3.5 sm:py-4 px-5 rounded-2xl border-2 text-center font-sans font-bold text-sm sm:text-base transition-all cursor-pointer relative overflow-hidden backdrop-blur-md ${
                    isSelected
                      ? "bg-gradient-to-r from-[#0080ff] via-[#1a73e8] to-[#4338ca] text-white border-[#38bdf8] shadow-[0_0_24px_rgba(0,144,255,0.65),inset_0_1px_2px_rgba(255,255,255,0.6)]"
                      : "bg-white/[0.06] hover:bg-white/[0.12] text-white border-white/20 hover:border-white/35 shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)] active:translate-y-0.5"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent pointer-events-none rounded-t-xl" />
                  )}
                  <span className="relative z-10">{token}</span>
                  {isSelected && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white text-blue-700 font-sans font-bold text-xs flex items-center justify-center shadow-md z-10">
                      {orderNum}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Standard Options: Transparent cards with subtle glow, glowing blue/indigo gradient when selected */}
        {currentQ.type !== "arrange_order" && (
          <div className="w-full flex flex-col gap-2.5">
            {(currentQ.options || currentQ.wordBank || []).map((opt, idx) => {
              const isSelected = selectedOption === idx;

              let cardStyle =
                "bg-white/[0.06] hover:bg-white/[0.12] text-white border-2 border-white/20 hover:border-white/35 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.12)] active:translate-y-0.5";
              let showGloss = false;

              if (isAnswerChecked) {
                const isThisCorrect =
                  currentQ.type === "fill_blank"
                    ? opt === currentQ.blankAnswer
                    : idx === currentQ.correctIndex;

                if (isThisCorrect) {
                  cardStyle =
                    "bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white border-2 border-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.65),inset_0_1px_2px_rgba(255,255,255,0.6)]";
                  showGloss = true;
                } else if (isSelected) {
                  cardStyle =
                    "bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white border-2 border-rose-300 shadow-[0_0_24px_rgba(244,63,94,0.65),inset_0_1px_2px_rgba(255,255,255,0.6)]";
                  showGloss = true;
                }
              } else if (isSelected) {
                cardStyle =
                  "bg-gradient-to-r from-[#0080ff] via-[#1a73e8] to-[#4338ca] text-white border-2 border-[#38bdf8] shadow-[0_0_24px_rgba(0,144,255,0.65),inset_0_1px_2px_rgba(255,255,255,0.6)]";
                showGloss = true;
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerChecked}
                  className={`w-full py-3.5 sm:py-4 px-5 rounded-2xl text-center font-sans font-bold text-sm sm:text-base tracking-wide transition-all cursor-pointer relative overflow-hidden ${cardStyle}`}
                >
                  {showGloss && (
                    <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent pointer-events-none rounded-t-xl" />
                  )}
                  <span className="relative z-10">{opt}</span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* =======================================================================
          FOOTER: FEEDBACK CONTAINER WITH BUILT-IN CONTINUE BUTTON (CANNOT BE BLOCKED!)
          ======================================================================= */}
      <footer className="w-full max-w-md mx-auto pt-2 z-30 pb-2">
        {!isAnswerChecked ? (
          <button
            onClick={handleCheckAnswer}
            disabled={
              currentQ.type === "arrange_order"
                ? arrangedTokens.length === 0
                : selectedOption === null
            }
            className={`w-full py-4 rounded-2xl font-sans font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              (currentQ.type === "arrange_order"
                ? arrangedTokens.length > 0
                : selectedOption !== null)
                ? "bg-[#58cc02] hover:bg-[#46a302] border-b-4 border-[#3c8c00] shadow-[0_4px_16px_rgba(88,204,2,0.35)] active:border-b-0 active:translate-y-1 text-slate-950 font-bold cursor-pointer"
                : "bg-[#1b2b35] text-slate-500 border-b-4 border-[#121c22] cursor-not-allowed"
            }`}
          >
            <span>CHECK</span>
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-3xl border-2 flex flex-col gap-3 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl ${
              isCorrect
                ? "bg-[#0b291d]/95 border-emerald-500/80 text-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                : "bg-[#2d1217]/95 border-rose-500/80 text-rose-100 shadow-[0_0_30px_rgba(244,63,94,0.3)]"
            }`}
          >
            {/* Feedback Message */}
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isCorrect
                    ? "bg-emerald-500/30 text-emerald-300 border border-emerald-400/50"
                    : "bg-rose-500/30 text-rose-300 border border-rose-400/50"
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`font-bold font-sans text-base tracking-normal ${
                    isCorrect ? "text-emerald-300" : "text-rose-300"
                  }`}
                >
                  {isCorrect ? "Excellent! Correct" : "Incorrect Answer"}
                </div>
                {currentQ.explanation && (
                  <p className="text-xs font-sans text-slate-200 mt-0.5 leading-snug line-clamp-2 font-normal">
                    {currentQ.explanation}
                  </p>
                )}
              </div>
            </div>

            {/* CONTINUE BUTTON INSIDE FEEDBACK CONTAINER (ALWAYS VISIBLE & NEVER BLOCKED!) */}
            <button
              onClick={handleContinue}
              className={`w-full py-3.5 rounded-2xl font-sans font-bold text-sm uppercase tracking-wider text-slate-950 border-b-4 active:border-b-0 active:translate-y-1 cursor-pointer flex items-center justify-center gap-2 transition-all ${
                isCorrect
                  ? "bg-[#58cc02] hover:bg-[#46a302] border-[#3c8c00] shadow-[0_4px_16px_rgba(88,204,2,0.35)]"
                  : "bg-[#ff4b4b] hover:bg-[#e03d3d] border-[#b82e2e] text-white shadow-[0_4px_16px_rgba(255,75,75,0.35)]"
              }`}
            >
              <span>{currentIndex < questions.length - 1 ? "CONTINUE" : "VIEW RESULTS"}</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </motion.div>
        )}
      </footer>
    </div>
  );
};
