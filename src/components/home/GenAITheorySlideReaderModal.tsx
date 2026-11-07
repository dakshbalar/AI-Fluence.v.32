import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Award,
  Target,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { GenAILesson } from "../../data/genaiPromptEngineeringData";
import { AIfluenceAvatar } from "../avatar/AIfluenceAvatar";
import { AIDEN_CONFIG, VEX_CONFIG, LUMI_CONFIG } from "../../data/characters";
import { CornerStarsAndSmokeBackground } from "../onboarding-animations/shared/CornerStarsAndSmokeBackground";
import { useGamification } from "../../utils/gamificationStore";

// =========================================================================
// COMIC TYPEWRITER TEXT WRITER
// First the message box / card pops into view, then the text is typed out dynamically!
// =========================================================================
interface TypewriterTextProps {
  text: string;
  delayMs?: number; // Delay in ms before typing starts so container animates in first
  charSpeedMs?: number; // Speed per char in ms
  className?: string;
  onComplete?: () => void;
  triggerKey?: string | number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  delayMs = 240,
  charSpeedMs = 16,
  className = "",
  onComplete,
  triggerKey,
}) => {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isTypingStarted, setIsTypingStarted] = useState(false);

  useEffect(() => {
    setDisplayedLength(0);
    setIsTypingStarted(false);

    const startTimer = setTimeout(() => {
      setIsTypingStarted(true);
    }, delayMs);

    return () => clearTimeout(startTimer);
  }, [text, triggerKey, delayMs]);

  useEffect(() => {
    if (!isTypingStarted) return;
    if (displayedLength >= text.length) {
      if (onComplete) onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedLength((prev) => Math.min(text.length, prev + 1));
    }, charSpeedMs);

    return () => clearTimeout(timer);
  }, [isTypingStarted, displayedLength, text, charSpeedMs, onComplete]);

  return (
    <span className={className}>
      {text.slice(0, displayedLength)}
      {isTypingStarted && displayedLength < text.length && (
        <span className="inline-block w-[2px] h-[1em] bg-current align-middle ml-0.5 animate-pulse" />
      )}
    </span>
  );
};

// =========================================================================
// AVATAR COMIC STAGE PLATFORM (Clean Comic Ground Contact Shadow - No Glow)
// =========================================================================
interface AvatarStagePlatformProps {
  accentColor?: string;
  glowColor?: string;
}

const AvatarStagePlatform: React.FC<AvatarStagePlatformProps> = () => {
  return (
    <div className="relative w-full flex flex-col items-center justify-center -mt-4 pointer-events-none z-0">
      {/* Clean Comic Ground Contact Shadow (No neon glow/halo) */}
      <div className="w-48 sm:w-56 h-4 sm:h-5 rounded-[100%] bg-black/75 border border-white/10 shadow-lg" />
    </div>
  );
};

// =========================================================================
// TYPES & SLIDE DATA DEFINITION (10 THEORY SLIDES + 1 VEX TRANSITION SLIDE)
// =========================================================================
export interface TheorySlideData {
  id: number;
  type: "aiden_speech" | "white_board" | "vex_challenge";
  speaker?: "aiden" | "lumi" | "vex";
  speechText?: string;
  aidenMood?: "wave" | "happy" | "celebrating" | "thinking";
  boardTitle?: string;
  boardPoints?: string[];
  boardComparison?: {
    weakTitle: string;
    weakPrompt: string;
    weakNote: string;
    strongTitle: string;
    strongPrompt: string;
    strongNote: string;
  };
  aidenBoardNote?: string;
  aidenBoardMood?: "happy" | "thinking" | "celebrating";
  buttonText: string;
}

// Generate the 10 alternating slides + 1 Vex transition slide dynamically per lesson
function buildTheorySlides(lesson: GenAILesson): TheorySlideData[] {
  const rawTitle = lesson.title || "Generative AI";
  const cleanTitle = rawTitle
    .replace(/^\d+\.\s*/, "")
    .replace(/^meet\s+/i, "")
    .trim();

  const idea = lesson.centralIdea || "AI creates new content by interpreting natural language instructions.";
  const why = lesson.whyItMatters || "Clear prompts eliminate guessing and give predictable results.";
  const takeaway = lesson.keyTakeaway || "AI is an interpreter, not a mind reader! Never leave key choices unstated.";

  const badPrompt =
    lesson.basicQuestions?.[1]?.options?.[0] ||
    "Write something about this.";
  const goodPrompt =
    lesson.basicQuestions?.[1]?.options?.[1] ||
    `Explain ${cleanTitle.toLowerCase()} in 3 bullet points with a simple example.`;

  return [
    // -------------------------------------------------------------
    // SLIDE 1: Aiden Intro Speech (Subtopic 1: Meet the Idea)
    // -------------------------------------------------------------
    {
      id: 0,
      type: "aiden_speech",
      speaker: "aiden",
      aidenMood: "wave",
      speechText:
        lesson.characterDialogue?.hook ||
        `Hey there! Welcome to ${cleanTitle}! Let's discover how this powerful AI concept works.`,
      buttonText: "CONTINUE LEARNING",
    },

    // -------------------------------------------------------------
    // SLIDE 2: White Teaching Board - Point 1 (Core Concept by Aiden)
    // -------------------------------------------------------------
    {
      id: 1,
      type: "white_board",
      speaker: "aiden",
      boardTitle: `What is ${cleanTitle}?`,
      boardPoints: [
        idea,
        "AI generates answers by predicting words step-by-step from your text.",
        "Your prompt is the only guidance the AI receives to know what you want.",
      ],
      aidenBoardNote: "💡 Think of AI as an eager assistant who follows your words word-for-word!",
      aidenBoardMood: "happy",
      buttonText: "CONTINUE",
    },

    // -------------------------------------------------------------
    // SLIDE 3: Lumi Speech (Subtopic 2: Why It Matters - Pink Glow!)
    // -------------------------------------------------------------
    {
      id: 2,
      type: "aiden_speech",
      speaker: "lumi",
      aidenMood: "thinking",
      speechText:
        `Lumi here! Ever wonder why ${cleanTitle} makes or breaks an AI response? Let's check the board!`,
      buttonText: "CONTINUE",
    },

    // -------------------------------------------------------------
    // SLIDE 4: White Teaching Board - Point 2 (Why Prompts Matter by Lumi)
    // -------------------------------------------------------------
    {
      id: 3,
      type: "white_board",
      speaker: "lumi",
      boardTitle: "Why Clear Prompts Matter",
      boardPoints: [
        why,
        "If you omit key instructions, the AI is forced to make random guesses.",
        "Specific rules eliminate confusion and deliver predictable answers.",
      ],
      aidenBoardNote: "🌸 Lumi's Insight: If you leave details out, the model guesses for you!",
      aidenBoardMood: "thinking",
      buttonText: "CONTINUE",
    },

    // -------------------------------------------------------------
    // SLIDE 5: Aiden Speech (Subtopic 3: Prompt Comparison)
    // -------------------------------------------------------------
    {
      id: 4,
      type: "aiden_speech",
      speaker: "aiden",
      aidenMood: "happy",
      speechText:
        "Aiden's back! Now let's see what happens when someone writes a vague prompt versus a crystal clear prompt!",
      buttonText: "SEE COMPARISON",
    },

    // -------------------------------------------------------------
    // SLIDE 6: White Teaching Board - Point 3 (Weak vs Strong Comparison by Aiden)
    // -------------------------------------------------------------
    {
      id: 5,
      type: "white_board",
      speaker: "aiden",
      boardTitle: "Weak vs. Strong Prompts",
      boardComparison: {
        weakTitle: "Weak Prompt (Avoid)",
        weakPrompt: `"${badPrompt}"`,
        weakNote: "Too vague — AI doesn't know the audience or length.",
        strongTitle: "Clear Prompt (Best Practice)",
        strongPrompt: `"${goodPrompt}"`,
        strongNote: "Specifies role, topic, and exact bullet format.",
      },
      aidenBoardNote: "🔍 Notice how adding the role and format immediately produces top-tier answers!",
      aidenBoardMood: "happy",
      buttonText: "CONTINUE",
    },

    // -------------------------------------------------------------
    // SLIDE 7: Lumi Speech (Subtopic 4: The Golden Rule - Pink Glow!)
    // -------------------------------------------------------------
    {
      id: 6,
      type: "aiden_speech",
      speaker: "lumi",
      aidenMood: "celebrating",
      speechText:
        "Lumi here with the secret formula! Every master prompt engineer follows one Golden Rule. Let's look at the blackboard!",
      buttonText: "VIEW GOLDEN RULE",
    },

    // -------------------------------------------------------------
    // SLIDE 8: White Teaching Board - Point 4 (The Golden Rule by Lumi)
    // -------------------------------------------------------------
    {
      id: 7,
      type: "white_board",
      speaker: "lumi",
      boardTitle: "The Golden Rule of Prompting",
      boardPoints: [
        takeaway,
        "Always anchor your prompt with 3 pillars:",
        "1. Role — Who the AI should act as.",
        "2. Task — Exactly what to create.",
        "3. Format — Bullet points, steps, or plain text.",
      ],
      aidenBoardNote: "⭐ Lumi's Rule: Clear roles + clear format = perfect AI answers every time!",
      aidenBoardMood: "celebrating",
      buttonText: "CONTINUE",
    },

    // -------------------------------------------------------------
    // SLIDE 9: Aiden Speech (Subtopic 5: Checklist Wrap-Up)
    // -------------------------------------------------------------
    {
      id: 8,
      type: "aiden_speech",
      speaker: "aiden",
      aidenMood: "celebrating",
      speechText:
        "You've grasped all the core mechanics! Let's do a quick checklist before we test our skills!",
      buttonText: "VIEW CHECKLIST",
    },

    // -------------------------------------------------------------
    // SLIDE 10: White Teaching Board - Point 5 (Mastery Checklist by Aiden)
    // -------------------------------------------------------------
    {
      id: 9,
      type: "white_board",
      speaker: "aiden",
      boardTitle: "Mastery Checklist",
      boardPoints: [
        "1. Define the Goal — State clearly what you need.",
        "2. Give Context — Specify background and the audience.",
        "3. Enforce Format — Ask for 3 bullets, a table, or steps.",
        "4. Set Constraints — Tell the AI what to avoid.",
      ],
      aidenBoardNote: "🏆 Outstanding job! You have fully mastered the theory for this chapter!",
      aidenBoardMood: "celebrating",
      buttonText: "FINISH THEORY",
    },

    // -------------------------------------------------------------
    // SLIDE 11: VEX Challenge Transition Slide!
    // -------------------------------------------------------------
    {
      id: 10,
      type: "vex_challenge",
      speaker: "vex",
      speechText:
        "Think you've mastered the theory? Let's see if your knowledge survives my 10 questions. Continue to the questions if you dare!",
      buttonText: "CONTINUE TO QUESTIONS",
    },
  ];
}

interface GenAITheorySlideReaderModalProps {
  lesson: GenAILesson;
  onClose: () => void;
  onStartQuestions?: () => void;
  onComplete?: (xp: number) => void;
}

export const GenAITheorySlideReaderModal: React.FC<GenAITheorySlideReaderModalProps> = ({
  lesson,
  onClose,
  onStartQuestions,
  onComplete,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [revealedPointIndex, setRevealedPointIndex] = useState(0);
  const { completeLevelState } = useGamification();

  const slides = buildTheorySlides(lesson);
  const slide = slides[currentSlide] || slides[0];
  const totalSlides = slides.length;
  const isVexSlide = slide.type === "vex_challenge" || slide.speaker === "vex";
  const isLumiSlide = slide.speaker === "lumi";
  const speakerConfig = isVexSlide ? VEX_CONFIG : isLumiSlide ? LUMI_CONFIG : AIDEN_CONFIG;

  const bgClass = isVexSlide
    ? "bg-[#0c0406] text-white"
    : isLumiSlide
    ? "bg-[#0d0514] text-white"
    : "bg-[#030814] text-white";

  const starsTheme = isVexSlide ? "vex" : isLumiSlide ? "lumi" : "blue";

  const progressFill = isVexSlide
    ? "bg-gradient-to-r from-red-500 to-rose-600"
    : isLumiSlide
    ? "bg-gradient-to-r from-pink-500 to-rose-500"
    : "bg-gradient-to-r from-cyan-400 to-blue-500";

  const bulletColor = isLumiSlide
    ? "bg-pink-400"
    : "bg-cyan-400";

  // Reset revealed point index when slide changes
  useEffect(() => {
    setRevealedPointIndex(0);
  }, [currentSlide]);

  const totalPoints = useMemo(() => {
    if (slide.type !== "white_board") return 0;
    if (slide.boardPoints) return slide.boardPoints.length;
    if (slide.boardComparison) return 2;
    return 0;
  }, [slide]);

  const isBoardSlide = slide.type === "white_board";
  const isRevealing = isBoardSlide && revealedPointIndex < totalPoints;

  const handleRevealNextPoint = () => {
    if (revealedPointIndex < totalPoints) {
      setRevealedPointIndex((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    // If on a board slide and still revealing points, reveal the next point first
    if (isRevealing) {
      handleRevealNextPoint();
      return;
    }

    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      // Completed the 11 slides! Record 3 stars and progression
      try {
        const lvlStrId = String(lesson.id);
        const sectionNum = lesson.id >= 900 ? 3 : lesson.id >= 800 ? 2 : lesson.id >= 700 ? 1 : 1;
        const levelNum = lesson.id >= 700 ? (lesson.id % 100) : lesson.id;
        const globalIdx = lesson.id >= 900 ? lesson.id - 900 + 80 : lesson.id >= 800 ? lesson.id - 800 + 40 : lesson.id >= 700 ? lesson.id - 700 : lesson.id;

        completeLevelState(
          lvlStrId,
          [true, true, true],
          40,
          undefined,
          {
            courseId: "generative_ai",
            courseName: "Generative AI",
            sectionNumber: sectionNum,
            sectionTitle: `Section ${sectionNum}`,
            levelNumber: levelNum,
            levelTitle: lesson.title,
            trophiesGained: 25,
            diamondsGained: 5,
          }
        );

        if ((lesson as any).level_id) {
          completeLevelState((lesson as any).level_id, [true, true, true], 0);
        }
        if (lesson.id >= 700) {
          completeLevelState(String(globalIdx), [true, true, true], 0);
          completeLevelState(`generative_ai_s${sectionNum}_l${levelNum}`, [true, true, true], 0);
        }
      } catch (err) {
        console.error("Failed to record slide level completion:", err);
      }

      if (onComplete) onComplete(40);
      if (onStartQuestions) {
        onStartQuestions();
      } else {
        onClose();
      }
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[280] flex flex-col justify-between p-4 sm:p-6 select-none overflow-hidden font-sans transition-colors duration-500 ${bgClass}`}
    >
      {/* Ambient Corner Stars & Smoke Background */}
      <CornerStarsAndSmokeBackground
        theme={starsTheme}
        topStarsClassName="top-6"
        bottomStarsClassName="bottom-8"
      />

      {/* =======================================================================
          TOP BAR: PROGRESS SEGMENTS & CLOSE BUTTON
          ======================================================================= */}
      <header className="w-full max-w-md mx-auto flex items-center justify-between z-20 pb-1">
        {/* Segmented Progress Bar across 11 slides */}
        <div className="flex-1 flex items-center gap-1.5 mr-3">
          {slides.map((s, idx) => (
            <div
              key={idx}
              className={`h-1.5 sm:h-2 rounded-full flex-1 transition-all duration-300 ${
                idx <= currentSlide ? progressFill : "bg-slate-800"
              }`}
            />
          ))}
        </div>

        {/* Close (X) button */}
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer active:scale-95 shrink-0"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* =======================================================================
          SLIDE BODY: 3 DISTINCT FORMATS
          ======================================================================= */}
      <AnimatePresence mode="wait">
        {/* FORMAT 1: AIDEN / LUMI INTRO SPEECH (BIG AVATAR CENTERED ON PEDESTAL) */}
        {slide.type === "aiden_speech" && (
          <motion.main
            key={`slide-${slide.id}`}
            initial={{ opacity: 0, x: 26 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -26 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md mx-auto flex-1 flex flex-col items-center justify-center z-20 py-2"
          >
            {/* White Speech Bubble above Character: box pops in first, text is typed after */}
            <motion.div
              key={`bubble-${slide.id}`}
              initial={{ scale: 0.85, opacity: 0, rotateX: 45, y: 15 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, rotateX: -45, y: -15 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformPerspective: 1000 }}
              className={`bg-white text-slate-900 px-6 sm:px-8 py-5 rounded-[28px] shadow-[0_12px_28px_rgba(0,0,0,0.6)] relative flex flex-col items-center justify-center text-center max-w-[340px] sm:max-w-[380px] mb-6 border-2 ${
                isLumiSlide ? "border-pink-200" : "border-slate-200"
              }`}
            >
              {isLumiSlide && (
                <span className="text-[10px] font-black uppercase tracking-widest text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200 mb-2">
                  LUMI INSIGHT
                </span>
              )}
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-sans leading-snug">
                <TypewriterText
                  text={slide.speechText || ""}
                  delayMs={240}
                  charSpeedMs={15}
                  triggerKey={`speech-${slide.id}`}
                />
              </h2>

              {/* Speech Bubble Tail pointing DOWN to character */}
              <div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0"
                style={{
                  borderLeft: "12px solid transparent",
                  borderRight: "12px solid transparent",
                  borderTop: "14px solid #FFFFFF",
                }}
              />
            </motion.div>

            {/* Character Avatar (Comic Ground Contact, No Neon Glow) */}
            <div className="relative flex flex-col items-center justify-center mt-1">
              <motion.div
                key={`avatar-stage-${slide.speaker || "aiden"}-${slide.id}`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 },
                  y: { repeat: Infinity, duration: 2.8, ease: "easeInOut" },
                }}
                style={{
                  filter: "drop-shadow(0 14px 18px rgba(0,0,0,0.65))",
                }}
              >
                <AIfluenceAvatar
                  config={speakerConfig}
                  size={340}
                  mood={slide.aidenMood || "wave"}
                  showBackground={false}
                />
              </motion.div>

              {/* Clean Comic Floor Shadow (No Glow) */}
              <AvatarStagePlatform />
            </div>
          </motion.main>
        )}

        {/* FORMAT 2: ACTUAL TEACHING BLACKBOARD + BIG HALF-BODY AIDEN ON RIGHT */}
        {slide.type === "white_board" && (
          <motion.main
            key={`slide-${slide.id}`}
            initial={{ opacity: 0, x: 26 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -26 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md mx-auto flex-1 flex flex-col justify-between z-20 pt-1 pb-0 overflow-hidden"
          >
            {/* THE CONTENT CONTAINER: TAKES THE FULL PAGE */}
            <div className="w-full flex-1 flex flex-col justify-between relative z-20">
              {/* Main Container Card */}
              <div className="w-full flex-1 bg-white/[0.06] border-2 border-white/20 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col justify-start relative overflow-hidden">
                {/* Title */}
                <div className="border-b border-white/15 pb-3 mb-4 text-left">
                  <h2 className="text-base sm:text-lg font-black text-white tracking-tight font-sans">
                    {slide.boardTitle}
                  </h2>
                </div>

                {/* Pointers written inside cards */}
                {slide.boardPoints && (
                  <div className="space-y-3 w-full text-left">
                    {slide.boardPoints.map((point, idx) => {
                      const isWritten = idx < revealedPointIndex;
                      if (!isWritten) return null;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 12, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.28, ease: "easeOut" }}
                          className="w-full p-4 rounded-2xl bg-white/[0.06] border border-white/15 backdrop-blur-sm shadow-sm flex items-start gap-3"
                        >
                          <span className={`w-2.5 h-2.5 rounded-full ${bulletColor} mt-2 shrink-0`} />
                          <p className="text-sm sm:text-base font-bold text-white leading-relaxed font-sans">
                            {point}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Weak vs Strong comparison cards */}
                {slide.boardComparison && (
                  <div className="space-y-3 w-full text-left">
                    {revealedPointIndex >= 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                        className="w-full p-4 rounded-2xl bg-red-950/40 border border-red-500/40 backdrop-blur-sm text-left shadow-sm"
                      >
                        <span className="font-black text-red-400 block text-xs uppercase tracking-wider mb-1">
                          ❌ {slide.boardComparison.weakTitle}
                        </span>
                        <p className="font-mono text-xs sm:text-sm text-red-100 italic">
                          "{slide.boardComparison.weakPrompt}"
                        </p>
                        <p className="text-xs text-slate-300 font-medium mt-1">
                          → {slide.boardComparison.weakNote}
                        </p>
                      </motion.div>
                    )}

                    {revealedPointIndex >= 2 && (
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                        className="w-full p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 backdrop-blur-sm text-left shadow-sm"
                      >
                        <span className="font-black text-emerald-400 block text-xs uppercase tracking-wider mb-1">
                          ✅ {slide.boardComparison.strongTitle}
                        </span>
                        <p className="font-mono text-xs sm:text-sm text-emerald-100 font-semibold">
                          "{slide.boardComparison.strongPrompt}"
                        </p>
                        <p className="text-xs text-slate-300 font-medium mt-1">
                          → {slide.boardComparison.strongNote}
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* LOWER: AIDEN ON RIGHT WITH NOTE SPEECH BUBBLE */}
              <div className="w-full flex items-center justify-between gap-3 px-2 pt-3 pb-0 mt-2 z-20">
                {/* Left Side: Speech Bubble for Aiden's Note (Tail points right to Aiden) */}
                <div className="flex-1 max-w-[260px]">
                  {slide.aidenBoardNote && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25 }}
                      className="bg-white text-slate-900 px-3.5 py-2.5 rounded-2xl rounded-tr-sm shadow-md border border-slate-100 relative text-left"
                    >
                      <p className="text-xs font-bold text-slate-900 leading-snug font-sans">
                        <TypewriterText
                          text={slide.aidenBoardNote}
                          delayMs={200}
                          charSpeedMs={14}
                          triggerKey={`note-${slide.id}`}
                        />
                      </p>
                      {/* Speech bubble tail pointing RIGHT towards Aiden */}
                      <div
                        className="absolute top-3 -right-2 w-0 h-0"
                        style={{
                          borderTop: "5px solid transparent",
                          borderBottom: "5px solid transparent",
                          borderLeft: "8px solid #FFFFFF",
                        }}
                      />
                    </motion.div>
                  )}
                </div>

                {/* Right End: Small Aiden Companion */}
                <div className="shrink-0 flex items-center justify-end">
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                    style={{
                      transform: "scaleX(-1)",
                      filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.5))",
                    }}
                  >
                    <AIfluenceAvatar
                      config={speakerConfig}
                      size={76}
                      mood={slide.aidenBoardMood || "happy"}
                      showBackground={false}
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.main>
        )}

        {/* FORMAT 3: VEX CHALLENGE TRANSITION SLIDE */}
        {slide.type === "vex_challenge" && (
          <motion.main
            key={`slide-${slide.id}`}
            initial={{ opacity: 0, x: 26 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -26 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md mx-auto flex-1 flex flex-col items-center justify-center z-20 py-2"
          >
            {/* White Speech Bubble above Vex: box pops in first, text is typed after */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
              className="bg-white text-slate-900 px-6 sm:px-8 py-5 rounded-[28px] shadow-[0_12px_28px_rgba(0,0,0,0.6)] relative flex flex-col items-center justify-center text-center max-w-[340px] sm:max-w-[380px] mb-6 border-2 border-red-300"
            >
              {/* Challenger Badge */}
              <span className="text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-3 py-0.5 rounded-full border border-red-200 mb-2">
                CHALLENGER VEX HAS ENTERED
              </span>

              <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 font-sans leading-snug">
                <TypewriterText
                  text={slide.speechText || ""}
                  delayMs={240}
                  charSpeedMs={15}
                  triggerKey={`vex-speech-${slide.id}`}
                />
              </h2>

              {/* Speech Bubble Tail pointing DOWN to Vex */}
              <div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0"
                style={{
                  borderLeft: "12px solid transparent",
                  borderRight: "12px solid transparent",
                  borderTop: "14px solid #FFFFFF",
                }}
              />
            </motion.div>

            {/* VEX Character Centered (Clean Comic Shadow, No Neon Glow) */}
            <div className="relative flex flex-col items-center justify-center mt-1">
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5,
                  ease: "easeInOut",
                }}
                style={{
                  filter: "drop-shadow(0 14px 18px rgba(0,0,0,0.65))",
                }}
              >
                <AIfluenceAvatar
                  config={VEX_CONFIG}
                  size={340}
                  mood="challenging"
                  showBackground={false}
                />
              </motion.div>

              {/* Clean Comic Floor Shadow (No Glow) */}
              <AvatarStagePlatform />
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* =======================================================================
          INTERACTIVE SPOTLIGHT FOCUS OVERLAY (COMIC SPEECH BUBBLE & TYPEWRITER)
          ======================================================================= */}
      <AnimatePresence>
        {isRevealing && (
          <motion.div
            key={`spotlight-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: "easeInOut" }}
            className="fixed inset-0 z-[300] bg-[#020713]/92 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-pointer select-none overflow-hidden"
            onClick={handleRevealNextPoint}
          >
            {/* FOCUSED PAIR: MESSAGE BUBBLE DIRECTLY ABOVE CHARACTER */}
            <div
              className="relative w-full max-w-sm flex flex-col items-center justify-center"
              style={{ perspective: 1200 }}
            >
              {/* MESSAGE BUBBLE (BOX POPS IN FIRST, TEXT IS TYPED DYNAMICALLY) */}
              <div className="w-full flex justify-center mb-1 relative z-20">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`point-flip-${currentSlide}-${revealedPointIndex}`}
                    initial={
                      revealedPointIndex === 0
                        ? { opacity: 0, scale: 0.85, y: 15 }
                        : { rotateX: -60, opacity: 0, y: -10, scale: 0.94 }
                    }
                    animate={{ rotateX: 0, opacity: 1, y: 0, scale: 1 }}
                    exit={{ rotateX: 60, opacity: 0, y: 10, scale: 0.94 }}
                    transition={
                      revealedPointIndex === 0
                        ? { delay: 0.25, duration: 0.35, ease: [0.16, 1, 0.3, 1] }
                        : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
                    }
                    style={{
                      transformStyle: "preserve-3d",
                      transformOrigin: "center center",
                    }}
                    className={`w-full bg-white text-slate-900 border-2 ${
                      isLumiSlide
                        ? "border-pink-300 shadow-[0_16px_36px_rgba(0,0,0,0.85)]"
                        : "border-slate-300 shadow-[0_16px_36px_rgba(0,0,0,0.85)]"
                    } rounded-[26px] p-5 sm:p-6 relative text-left`}
                  >
                    {/* Standard Board Points with Typewriter */}
                    {slide.boardPoints && (
                      <p className="text-base sm:text-lg font-extrabold text-slate-900 font-sans leading-relaxed tracking-tight">
                        <TypewriterText
                          text={slide.boardPoints[revealedPointIndex] || ""}
                          delayMs={240}
                          charSpeedMs={15}
                          triggerKey={`spotlight-${currentSlide}-${revealedPointIndex}`}
                        />
                      </p>
                    )}

                    {/* Weak vs Strong Comparison with Typewriter */}
                    {slide.boardComparison && (
                      <div>
                        {revealedPointIndex === 0 ? (
                          <div className="space-y-1.5 text-left">
                            <div className="flex items-center gap-1.5">
                              <span className="text-red-500 font-black text-sm">❌</span>
                              <span className="font-black text-red-600 text-xs uppercase tracking-wider">
                                {slide.boardComparison.weakTitle}
                              </span>
                            </div>
                             <p className="font-sans font-medium text-xs sm:text-sm text-slate-800 bg-red-50 border border-red-200 p-3 rounded-2xl leading-snug">
                              "
                              <TypewriterText
                                text={slide.boardComparison.weakPrompt}
                                delayMs={240}
                                charSpeedMs={14}
                                triggerKey={`weak-prompt-${currentSlide}`}
                              />
                              "
                            </p>
                            <p className="text-xs text-slate-600 font-medium pt-0.5">
                              → {slide.boardComparison.weakNote}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1.5 text-left">
                            <div className="flex items-center gap-1.5">
                              <span className="text-emerald-500 font-black text-sm">✅</span>
                              <span className="font-black text-emerald-600 text-xs uppercase tracking-wider">
                                {slide.boardComparison.strongTitle}
                              </span>
                            </div>
                            <p className="font-sans font-medium text-xs sm:text-sm text-slate-800 bg-emerald-50 border border-emerald-200 p-3 rounded-2xl leading-snug">
                              "
                              <TypewriterText
                                text={slide.boardComparison.strongPrompt}
                                delayMs={240}
                                charSpeedMs={14}
                                triggerKey={`strong-prompt-${currentSlide}`}
                              />
                              "
                            </p>
                            <p className="text-xs text-slate-600 font-medium pt-0.5">
                              → {slide.boardComparison.strongNote}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Downward Speech Bubble Tail pointing to character */}
                    <div
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 pointer-events-none"
                      style={{
                        borderLeft: "11px solid transparent",
                        borderRight: "11px solid transparent",
                        borderTop: "13px solid #FFFFFF",
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* CHARACTER: Clean Comic Silhouette without Glow */}
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.85,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col items-center justify-center pointer-events-none mt-2"
              >
                <motion.div
                  key={`avatar-reaction-${revealedPointIndex}`}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  style={{
                    filter: "drop-shadow(0 16px 24px rgba(0,0,0,0.85))",
                  }}
                  className="-mt-3"
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  >
                    <AIfluenceAvatar
                      config={speakerConfig}
                      size={320}
                      mood={revealedPointIndex % 2 === 0 ? "happy" : "pointing"}
                      showBackground={false}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* Subtle Tap Indicator at Bottom */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
            >
              <span
                className={`text-[11px] font-mono ${
                  isLumiSlide
                    ? "text-pink-300/80 bg-pink-950/50 border-pink-500/25"
                    : "text-cyan-300/80 bg-cyan-950/50 border-cyan-500/25"
                } px-3.5 py-1 rounded-full border animate-pulse`}
              >
                Tap anywhere to continue
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =======================================================================
          FOOTER: BACK & CONTINUE BUTTONS
          ======================================================================= */}
      <footer className="w-full max-w-md mx-auto z-20 pt-2 pb-2 flex flex-col items-center gap-2.5">
        <div className="w-full flex items-center gap-3">
          {currentSlide > 0 && (
            <button
              onClick={handlePrev}
              className={`px-4 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider text-white border cursor-pointer active:scale-95 flex items-center gap-1.5 transition-all ${
                isVexSlide
                  ? "bg-[#250a0e] border-red-500/30 hover:bg-[#351015]"
                  : isLumiSlide
                  ? "bg-[#250d20] border-pink-500/30 hover:bg-[#35142e]"
                  : "bg-white/10 hover:bg-white/15 border-white/15"
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isVexSlide ? "fill-red-400 text-red-400" : isLumiSlide ? "fill-pink-400 text-pink-400" : "fill-white text-white"}`} />
              <span>BACK</span>
            </button>
          )}

          <button
            onClick={handleNext}
            className={`flex-1 py-4 rounded-2xl font-sans font-black text-sm sm:text-base uppercase tracking-wider text-white border-b-4 active:border-b-0 active:translate-y-1 cursor-pointer flex items-center justify-center gap-2 transition-all relative overflow-hidden ${
              isVexSlide
                ? "bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 border-red-900 shadow-[0_4px_24px_rgba(239,68,68,0.55)]"
                : isLumiSlide
                ? "bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-400 hover:to-rose-400 border-pink-800 shadow-[0_4px_24px_rgba(255,42,141,0.45)]"
                : isRevealing
                ? "bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border-cyan-800 shadow-[0_4px_24px_rgba(6,182,212,0.45)]"
                : "bg-[#0080ff] hover:bg-[#0070e0] border-[#005bb5] shadow-[0_4px_20px_rgba(0,128,255,0.4)]"
            }`}
          >
            {/* Top Gloss Sheen */}
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none rounded-t-xl" />

            {isVexSlide ? (
              <>
                <Sparkles className="w-4 h-4 fill-white text-white relative z-10" />
                <span className="relative z-10">CONTINUE TO QUESTIONS</span>
                <ArrowRight className="w-4 h-4 stroke-[3] relative z-10" />
              </>
            ) : isRevealing ? (
              <>
                <span className="relative z-10">CONTINUE</span>
                <ArrowRight className="w-4 h-4 stroke-[3] relative z-10" />
              </>
            ) : currentSlide === 0 ? (
              <>
                <span className="relative z-10">CONTINUE LEARNING</span>
                <ArrowRight className="w-4 h-4 stroke-[3] relative z-10" />
              </>
            ) : (
              <>
                <span className="relative z-10">{slide.buttonText}</span>
                <ArrowRight className="w-4 h-4 stroke-[3] relative z-10" />
              </>
            )}
          </button>
        </div>

        {/* Maybe Later link on slide 0 */}
        {currentSlide === 0 && (
          <button
            onClick={onClose}
            className="flex items-center gap-3 text-[11px] font-bold font-sans tracking-widest text-slate-400 hover:text-white uppercase transition-colors py-1 cursor-pointer"
          >
            <span className="text-cyan-400 font-normal">✦</span>
            <span>MAYBE LATER</span>
            <span className="text-cyan-400 font-normal">✦</span>
          </button>
        )}
      </footer>
    </div>
  );
};
