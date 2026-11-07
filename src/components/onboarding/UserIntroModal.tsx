import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ChevronRight,
  Code2,
  Cpu,
  Check
} from "lucide-react";
import { AIfluenceAvatar } from "../avatar/AIfluenceAvatar";
import { AIDEN_CONFIG, LUMI_CONFIG } from "../../data/characters";
import { CornerStarsAndSmokeBackground } from "../onboarding-animations/shared/CornerStarsAndSmokeBackground";
import { useEngagementStore } from "../../utils/engagementStore";
import { persistCourseId, persistEnrolledCourseIds } from "../../data/coursesData";

interface UserIntroModalProps {
  onComplete: () => void;
}

interface SlideData {
  id: number;
  type: "theory" | "question";
  mascot: "aiden" | "lumi";
  headline: string;
  question: string;
  text: string;
}

export const UserIntroModal: React.FC<UserIntroModalProps> = ({ onComplete }) => {
  const { profile, updateProfile } = useEngagementStore();
  const [slideIndex, setSlideIndex] = useState<number>(0);

  // Form states
  const [name, setName] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [q4Option, setQ4Option] = useState<string>("");
  const [q5Option, setQ5Option] = useState<string>("");

  // Validation
  const [nameError, setNameError] = useState<string>("");

  // Dynamic slides array based on selected course!
  const slides: SlideData[] = [
    {
      id: 1,
      type: "theory",
      mascot: "aiden",
      headline: "WELCOME HERO! 👋",
      question: "",
      text: "Welcome to AI Fluence! I am Aiden, your learning companion. We are about to embark on an incredible journey of technology, math, and code!"
    },
    {
      id: 2,
      type: "question",
      mascot: "aiden", // Forced blue/Aiden theme for slide 2 name selection
      headline: "IDENTIFY YOURSELF ⚡",
      question: "Before we step into the classroom, tell me: What is your name, recruit?",
      text: ""
    },
    {
      id: 3,
      type: "question",
      mascot: "lumi", // Lumi pink theme for track selection
      headline: "CHOOSE YOUR TRACK 🗺️",
      question: "Select your first primary course track. This will be unlocked to start your learning path!",
      text: ""
    },
    // Dynamic Questions based on Course
    ...(selectedCourse === "generative_ai" ? [
      {
        id: 4,
        type: "question" as const,
        mascot: "aiden" as const,
        headline: "GENERATIVE AI INTEREST",
        question: "What is your main interest in Generative AI?",
        text: ""
      },
      {
        id: 5,
        type: "question" as const,
        mascot: "aiden" as const,
        headline: "AI EXPERIENCE",
        question: "How much experience do you have with AI models?",
        text: ""
      }
    ] : selectedCourse === "ai_for_everyone" ? [
      {
        id: 4,
        type: "question" as const,
        mascot: "aiden" as const,
        headline: "AI FOR EVERYONE FOCUS",
        question: "What aspect of AI are you most excited about?",
        text: ""
      },
      {
        id: 5,
        type: "question" as const,
        mascot: "aiden" as const,
        headline: "LEARNING GOAL",
        question: "What is your goal for this course?",
        text: ""
      }
    ] : [
      // DSA
      {
        id: 4,
        type: "question" as const,
        mascot: "aiden" as const,
        headline: "DSA PREFERENCE",
        question: "Which programming language do you prefer for DSA?",
        text: ""
      },
      {
        id: 5,
        type: "question" as const,
        mascot: "aiden" as const,
        headline: "ALGORITHMIC EXPERIENCE",
        question: "What is your current LeetCode/algorithm level?",
        text: ""
      }
    ]),
    {
      id: 6,
      type: "theory",
      mascot: "lumi", // Pink-themed last slide
      headline: "ALL SET! 🏆",
      question: "",
      text: `Pristine, ${name || "Hero"}! Your track is locked and your profile is initialized. Let's head over to the Avatar Room so you can edit your avatar and clear your profile checklist!`
    }
  ];

  const currentSlide = slides[slideIndex];
  const isAiden = currentSlide.mascot === "aiden";

  const progressPercent = ((slideIndex + 1) / slides.length) * 100;

  // Resolve slide-specific active theme for page backgrounds
  const getSlideTheme = () => {
    if (slideIndex <= 1) return "aiden"; // Slide 0 & 1: Aiden (Blue)
    if (slideIndex === 2) return "lumi"; // Slide 2 (Course Selection): Lumi (Pink)
    if (slideIndex === slides.length - 1) return "lumi"; // Last slide (All Set): Lumi (Pink)
    
    // Dynamic Questions theme based on selected course
    if (selectedCourse === "generative_ai") return "aiden";
    if (selectedCourse === "ai_for_everyone") return "yellow";
    if (selectedCourse === "dsa") return "purple";
    return "lumi";
  };

  const activeTheme = getSlideTheme();

  // Dynamic colors and ambient glow based on resolved activeTheme
  const themeColor = 
    activeTheme === "aiden" ? "#22d3ee" :
    activeTheme === "lumi" ? "#ec4899" :
    activeTheme === "yellow" ? "#eab308" :
    activeTheme === "purple" ? "#a855f7" : "#ec4899";

  const themeBorderColor = 
    activeTheme === "aiden" ? "#0891b2" :
    activeTheme === "lumi" ? "#be185d" :
    activeTheme === "yellow" ? "#b45309" :
    activeTheme === "purple" ? "#7e22ce" : "#be185d";

  const ambientGradient = 
    activeTheme === "aiden" ? "radial-gradient(circle_at_50%_35%, rgba(0, 180, 255, 0.22) 0%, rgba(0, 0, 0, 0) 70%)" :
    activeTheme === "yellow" ? "radial-gradient(circle_at_50%_35%, rgba(234, 179, 8, 0.22) 0%, rgba(0, 0, 0, 0) 70%)" :
    activeTheme === "purple" ? "radial-gradient(circle_at_50%_35%, rgba(168, 85, 247, 0.22) 0%, rgba(0, 0, 0, 0) 70%)" :
    "radial-gradient(circle_at_50%_35%, rgba(255, 42, 141, 0.22) 0%, rgba(0, 0, 0, 0) 70%)";

  const handleNext = () => {
    if (currentSlide.id === 2) {
      if (!name.trim()) {
        setNameError("Please enter your name to proceed!");
        return;
      }
      setNameError("");
      updateProfile({ username: name.trim() });
    }

    if (currentSlide.id === 3 && !selectedCourse) {
      return; // Ensure track is chosen
    }

    if (currentSlide.id === 4 && !q4Option) {
      return; // Ensure option selected
    }

    if (currentSlide.id === 5 && !q5Option) {
      return; // Ensure option selected
    }

    // On final step, perform state locking and persist
    if (slideIndex === slides.length - 2) {
      persistEnrolledCourseIds([selectedCourse]);
      persistCourseId(selectedCourse);

      updateProfile({
        primaryLanguage: selectedCourse === "dsa" ? "C++" : "Python",
        codingExperience: (selectedCourse === "dsa" ? q5Option : q4Option) as any,
        onboardingCompleted: true
      });
    }

    if (slideIndex < slides.length - 1) {
      setSlideIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const renderCourseEmblem = (courseId: string) => {
    if (courseId === "generative_ai") {
      return (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#1e40af] to-[#1e1b4b] border-2 border-[#60a5fa] shadow-[0_0_12px_rgba(59,130,246,0.5)] flex items-center justify-center relative overflow-hidden shrink-0">
          <Sparkles className="w-5 h-5 text-cyan-300" />
        </div>
      );
    }

    if (courseId === "ai_for_everyone") {
      return (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#854d0e] to-[#422006] border-2 border-[#facc15] shadow-[0_0_12px_rgba(234,179,8,0.5)] flex items-center justify-center relative overflow-hidden shrink-0">
          <Cpu className="w-5 h-5 text-yellow-300" />
        </div>
      );
    }

    return (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#6b21a8] to-[#3b0764] border-2 border-[#c084fc] shadow-[0_0_12px_rgba(168,85,247,0.5)] flex items-center justify-center relative overflow-hidden shrink-0">
        <Code2 className="w-5 h-5 text-purple-300" />
      </div>
    );
  };

  // Get options array for dynamic slides 4 and 5
  const getDynamicQuestionOptions = () => {
    if (currentSlide.id === 4) {
      if (selectedCourse === "generative_ai") {
        return [
          { id: "prompt", title: "Prompt Engineering", desc: "Creative instructions for LLMs" },
          { id: "rag", title: "RAG & Vector Search", desc: "Connect LLMs to private data" },
          { id: "finetune", title: "Fine-Tuning LLMs", desc: "Train custom models on domain tasks" }
        ];
      } else if (selectedCourse === "ai_for_everyone") {
        return [
          { id: "ethics", title: "Ethical & Safe AI", desc: "Bias, transparency, and safety" },
          { id: "basics", title: "Neural Networks", desc: "How brain-inspired models learn" },
          { id: "impact", title: "AI's Impact on Society", desc: "Automation and future trends" }
        ];
      } else {
        return [
          { id: "ts", title: "TypeScript / JS", desc: "Modern web standard" },
          { id: "py", title: "Python", desc: "Clean & easy syntax" },
          { id: "cpp", title: "Java / C++", desc: "High-performance systems" }
        ];
      }
    } else {
      // id === 5
      if (selectedCourse === "generative_ai") {
        return [
          { id: "none", title: "Absolute Beginner", desc: "New to AI coding" },
          { id: "some", title: "Some - API User", desc: "Used OpenAI/Gemini APIs" },
          { id: "pro", title: "Advanced Dev", desc: "Deploy pipelines & agents" }
        ];
      } else if (selectedCourse === "ai_for_everyone") {
        return [
          { id: "understand", title: "Understand Concepts", desc: "Demystify deep tech terms" },
          { id: "apply", title: "Apply to Daily Job", desc: "Use copilots & AI for productivity" },
          { id: "curious", title: "Just Curious", desc: "Satisfy tech curiosity" }
        ];
      } else {
        return [
          { id: "beginner", title: "Beginner", desc: "Never solved coding puzzles" },
          { id: "mid", title: "Intermediate", desc: "Solved Easy/Medium tasks" },
          { id: "hard", title: "Hardcore Competitive", desc: "Dynamic programming wizard" }
        ];
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[280] bg-[#050b12] flex flex-col justify-between p-4 sm:p-6 text-white select-none overflow-hidden transition-colors duration-500">
      {/* Background stars and custom color glow */}
      <CornerStarsAndSmokeBackground
        theme={activeTheme}
        topStarsClassName="top-4"
        bottomStarsClassName="bottom-6"
      />

      {/* Ambient glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{ backgroundImage: ambientGradient }}
      />

      {/* HEADER: Progress bar */}
      <header className="w-full max-w-md mx-auto flex items-center justify-between gap-3 z-20 pb-4">
        <div className="text-[10px] font-mono font-black tracking-widest text-slate-400 bg-slate-900/75 border border-slate-800 px-3 py-1 rounded-full uppercase">
          SLIDE {slideIndex + 1} OF {slides.length}
        </div>

        <div className="flex-1 h-3 rounded-full bg-[#111a24] p-0.5 overflow-hidden border border-white/5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 shadow-sm"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </header>

      {/* CONTENT SWITCHER: Theory vs Question designs */}
      <main className="w-full max-w-md mx-auto flex-1 flex flex-col items-center justify-center relative py-2 z-20">
        <AnimatePresence mode="wait">
          {currentSlide.type === "theory" ? (
            // ==========================================
            // THEORY SLIDE STYLE (IMAGE 2 STYLE)
            // ==========================================
            <motion.div
              key={`theory-${slideIndex}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full flex flex-col items-center justify-center flex-1"
            >
              {/* Large, high-contrast speech bubble pointing down */}
              <div className="relative mb-8 z-20 w-full max-w-[340px]">
                <div className="bg-white text-slate-950 font-sans px-6 py-6 rounded-[28px] shadow-[0_12px_36px_rgba(0,0,0,0.65)] text-center border-b-4 border-slate-200">
                  <p className="text-sm font-extrabold text-slate-900 leading-snug">
                    {currentSlide.text}
                  </p>
                </div>
                {/* Speech tail centered and pointing down to mascot */}
                <div
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0"
                  style={{
                    borderLeft: "10px solid transparent",
                    borderRight: "10px solid transparent",
                    borderTop: "12px solid #ffffff",
                  }}
                />
              </div>

              {/* Much larger mascot character (340px) with NO glow around the avatar */}
              <div className="relative w-[340px] h-[350px] flex items-end justify-center pb-2">
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
                    config={isAiden ? AIDEN_CONFIG : LUMI_CONFIG}
                    size={340}
                    mood={slideIndex === slides.length - 1 ? "celebrating" : "idle"}
                    animate={true}
                    showBackground={false}
                  />
                </motion.div>
              </div>
            </motion.div>
          ) : (
            // ==========================================
            // QUESTION SLIDE STYLE (IMAGE 3 STYLE)
            // ==========================================
            <motion.div
              key={`question-${slideIndex}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full flex flex-col justify-between items-center flex-1 py-1"
            >
              {/* Headline */}
              <div className="w-full text-left pb-4">
                <span className="text-xs font-mono font-black tracking-widest text-slate-300 uppercase">
                  {currentSlide.headline}
                </span>
              </div>

              {/* Big rounded white card for question */}
              <div className="w-full bg-white text-slate-900 px-6 py-6 rounded-[28px] shadow-2xl border-b-4 border-slate-200 text-center mb-6 flex items-center justify-center min-h-[100px]">
                <h2 className="text-base sm:text-lg font-black text-slate-950 leading-snug">
                  {currentSlide.question}
                </h2>
              </div>

              {/* Inputs/Options arranged cleanly beneath, filling the screen */}
              <div className="w-full flex-1 flex flex-col justify-center gap-3">
                {/* Slide 2: Name Input Field */}
                {currentSlide.id === 2 && (
                  <div className="w-full flex flex-col gap-2">
                    <input
                      type="text"
                      maxLength={15}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (e.target.value.trim()) setNameError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleNext();
                      }}
                      placeholder="Enter your name..."
                      className="w-full bg-[#111c27] border-2 border-slate-700 hover:border-slate-500 text-white text-base font-bold px-4 py-3.5 rounded-2xl focus:outline-none focus:border-cyan-400 text-center uppercase tracking-widest transition-colors shadow-inner"
                      autoFocus
                    />
                    {nameError && (
                      <p className="text-xs text-rose-500 font-bold text-center animate-pulse">
                        ⚠️ {nameError}
                      </p>
                    )}
                  </div>
                )}

                {/* Slide 3: Course Selection (Emblem only, text below it) */}
                {currentSlide.id === 3 && (
                  <div className="grid grid-cols-3 gap-2.5 w-full">
                    {[
                      { id: "generative_ai", title: "Generative A.I", desc: "Prompting, LLMs, RAG" },
                      { id: "ai_for_everyone", title: "AI for Everyone", desc: "Models, safety, networks" },
                      { id: "dsa", title: "DSA & Algos", desc: "LeetCode, recursion, sorting" },
                    ].map((c) => {
                      const isSelected = selectedCourse === c.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => {
                            setSelectedCourse(c.id);
                            // Reset dynamic choices when switching courses
                            setQ4Option("");
                            setQ5Option("");
                          }}
                          className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 text-center font-sans transition-all cursor-pointer min-h-[145px] relative ${
                            isSelected
                              ? "bg-slate-800 border-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.35)]"
                              : "bg-[#111c27] hover:bg-slate-800/50 text-white border-slate-700"
                          }`}
                        >
                          {/* Centered logo (emblem) only on top */}
                          <div className="mb-2.5 scale-110">
                            {renderCourseEmblem(c.id)}
                          </div>
                          
                          {/* Text strictly below the logo */}
                          <div className="w-full flex flex-col items-center">
                            <div className="text-[10px] sm:text-xs font-black uppercase tracking-tight leading-tight mb-1 text-white">
                              {c.title}
                            </div>
                            <div className="text-[8.5px] text-slate-400 leading-normal max-w-[85px] mx-auto">
                              {c.desc}
                            </div>
                          </div>

                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center shadow">
                              <Check className="w-2.5 h-2.5 stroke-[4]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Slides 4 and 5: Course-Specific Dynamic Level Questions styled with Level Options */}
                {(currentSlide.id === 4 || currentSlide.id === 5) && (
                  <div className="flex flex-col gap-2.5 w-full">
                    {getDynamicQuestionOptions().map((opt) => {
                      const isSelected = currentSlide.id === 4 ? q4Option === opt.id : q5Option === opt.id;

                      // Base level options style (transparent glassy cards with subtle glow)
                      let cardStyle = "bg-white/[0.06] hover:bg-white/[0.12] text-white border-2 border-white/20 hover:border-white/35 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.12)] active:translate-y-0.5";

                      if (isSelected) {
                        if (selectedCourse === "generative_ai") {
                          cardStyle = "bg-gradient-to-r from-[#0080ff] via-[#1a73e8] to-[#4338ca] text-white border-2 border-[#38bdf8] shadow-[0_0_24px_rgba(0,144,255,0.65),inset_0_1px_2px_rgba(255,255,255,0.6)]";
                        } else if (selectedCourse === "ai_for_everyone") {
                          cardStyle = "bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 text-slate-950 border-2 border-yellow-300 shadow-[0_0_24px_rgba(234,179,8,0.65),inset_0_1px_2px_rgba(255,255,255,0.6)]";
                        } else {
                          // dsa
                          cardStyle = "bg-gradient-to-r from-[#8b5cf6] via-[#6d28d9] to-[#4c1d95] text-white border-2 border-[#c084fc] shadow-[0_0_24px_rgba(139,92,246,0.65),inset_0_1px_2px_rgba(255,255,255,0.6)]";
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            if (currentSlide.id === 4) setQ4Option(opt.id);
                            else setQ5Option(opt.id);
                          }}
                          className={`w-full py-3 px-5 rounded-2xl text-left font-sans transition-all cursor-pointer relative overflow-hidden flex items-center justify-between ${cardStyle}`}
                        >
                          {isSelected && (
                            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent pointer-events-none rounded-t-xl" />
                          )}
                          <div className="relative z-10">
                            <div className="text-xs sm:text-sm font-extrabold uppercase">
                              {opt.title}
                            </div>
                            <div className={`text-[10px] ${isSelected && selectedCourse === "ai_for_everyone" ? "text-slate-950/75" : "text-slate-400"}`}>
                              {opt.desc}
                            </div>
                          </div>
                          {isSelected && (
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow relative z-10 ${
                              selectedCourse === "ai_for_everyone" ? "bg-slate-950 text-yellow-300" : "bg-white text-indigo-700"
                            }`}>
                              <Check className="w-3.5 h-3.5 stroke-[4]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER: Action button */}
      <footer className="w-full max-w-md mx-auto pt-4 pb-2 z-10">
        <button
          onClick={handleNext}
          disabled={
            (currentSlide.id === 2 && !name.trim()) ||
            (currentSlide.id === 3 && !selectedCourse) ||
            (currentSlide.id === 4 && !q4Option) ||
            (currentSlide.id === 5 && !q5Option)
          }
          className="w-full py-4 rounded-2xl font-sans font-black text-sm uppercase tracking-wider text-white border-b-4 shadow-lg active:border-b-0 active:translate-y-1 hover:brightness-105 cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundImage: `linear-gradient(to right, ${themeColor}, ${activeTheme === "aiden" ? "#0ea5e9" : activeTheme === "yellow" ? "#f59e0b" : activeTheme === "purple" ? "#c084fc" : "#f43f5e"})`,
            borderColor: themeBorderColor
          }}
        >
          <span>{slideIndex === slides.length - 1 ? "LET'S GO!" : "CONTINUE"}</span>
          <ChevronRight className="w-5 h-5 stroke-[3]" />
        </button>
      </footer>
    </div>
  );
};
