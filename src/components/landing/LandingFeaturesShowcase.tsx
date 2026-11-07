import React, { useState, useEffect, useRef } from "react";
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ArrowRight,
  Maximize2
} from "lucide-react";

export interface FeatureItem {
  id: string;
  number: number;
  title: string;
  tagline: string;
  category: string;
  icon: string;
  svgFile: string;
}

export const LANDING_FEATURES: FeatureItem[] = [
  {
    id: "home",
    number: 1,
    title: "Home — Your Learning Journey",
    tagline: "Your Central Mission Control",
    category: "Gameplay",
    icon: "🗺️",
    svgFile: "/features/home.svg",
  },
  {
    id: "quest",
    number: 2,
    title: "Quest — Turn Learning Into a Game",
    tagline: "Daily & Weekly Challenges",
    category: "Gameplay",
    icon: "⚔️",
    svgFile: "/features/quest.svg",
  },
  {
    id: "courses",
    number: 3,
    title: "Courses — Multiple Learning Paths",
    tagline: "Diverse Engineering Tracks",
    category: "Curriculum",
    icon: "📚",
    svgFile: "/features/courses.svg",
  },
  {
    id: "dsa",
    number: 4,
    title: "DSA & Coding — Problem-Solving Skills",
    tagline: "Algorithmic Precision",
    category: "Coding",
    icon: "⚡",
    svgFile: "/features/dsa.svg",
  },
  {
    id: "practice",
    number: 5,
    title: "Practice — Learn by Doing",
    tagline: "Real Browser Execution",
    category: "Coding",
    icon: "💻",
    svgFile: "/features/practice.svg",
  },
  {
    id: "theory",
    number: 6,
    title: "Theory — Understand With Theory",
    tagline: "Deep Conceptual Understanding",
    category: "Curriculum",
    icon: "🧠",
    svgFile: "/features/theory.svg",
  },
  {
    id: "progress",
    number: 7,
    title: "Progress & Rewards — Track Growth",
    tagline: "Actionable Skill Metrics",
    category: "Growth",
    icon: "📈",
    svgFile: "/features/progress.svg",
  },
  {
    id: "clans",
    number: 8,
    title: "Clans — Join. Compete. Grow.",
    tagline: "Multiplayer Squads & Wars",
    category: "Social",
    icon: "🛡️",
    svgFile: "/features/clans.svg",
  },
  {
    id: "rewards",
    number: 9,
    title: "Rewards — Stay Consistent. Earn More.",
    tagline: "Loot Chests & Power-Ups",
    category: "Growth",
    icon: "💎",
    svgFile: "/features/rewards.svg",
  },
  {
    id: "avatars",
    number: 10,
    title: "Avatars — Express Your Style",
    tagline: "Cybernetic Personas & Skins",
    category: "Gameplay",
    icon: "👤",
    svgFile: "/features/avatars.svg",
  },
  {
    id: "challenges",
    number: 11,
    title: "Challenges — Take on New Challenges",
    tagline: "1v1 Speed Code Duels",
    category: "Competition",
    icon: "🎯",
    svgFile: "/features/challenges.svg",
  },
  {
    id: "league",
    number: 12,
    title: "League — Compete. Climb Higher.",
    tagline: "Ranked Global Ladder",
    category: "Competition",
    icon: "🏆",
    svgFile: "/features/league.svg",
  },
  {
    id: "profile",
    number: 13,
    title: "Profile — Your Journey. Your Story.",
    tagline: "Developer Passport & Badges",
    category: "Growth",
    icon: "🎖️",
    svgFile: "/features/profile.svg",
  },
  {
    id: "ai_support",
    number: 14,
    title: "AI Support — Get Help Instantly",
    tagline: "Autonomous Lumi Copilot",
    category: "Intelligence",
    icon: "🤖",
    svgFile: "/features/ai_support.svg",
  },
  {
    id: "institutions",
    number: 15,
    title: "For Institutions — A Modern Solution",
    tagline: "Campus Analytics & Cohorts",
    category: "Institution",
    icon: "🏛️",
    svgFile: "/features/institutions.svg",
  }
];

interface LandingFeaturesShowcaseProps {
  onOpenAuth?: () => void;
}

export const LandingFeaturesShowcase: React.FC<LandingFeaturesShowcaseProps> = ({ onOpenAuth }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToFeature = (index: number) => {
    const target = document.getElementById(`feature-section-${index}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      setActiveIdx(index);
    }
  };

  const handleNext = () => {
    const next = (activeIdx + 1) % LANDING_FEATURES.length;
    scrollToFeature(next);
  };

  const handlePrev = () => {
    const prev = (activeIdx - 1 + LANDING_FEATURES.length) % LANDING_FEATURES.length;
    scrollToFeature(prev);
  };

  // Intersection observer to track active section while scrolling
  useEffect(() => {
    const handleScroll = () => {
      LANDING_FEATURES.forEach((_, idx) => {
        const el = document.getElementById(`feature-section-${idx}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
            setActiveIdx(idx);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div id="features-showcase" ref={containerRef} className="relative w-full bg-[#070913]">
      
      {/* All 15 Full-Screen 9:16 Sections */}
      {LANDING_FEATURES.map((feat, index) => (
        <section
          key={feat.id}
          id={`feature-section-${index}`}
          className="h-screen w-full relative flex items-center justify-center overflow-hidden bg-[#070913] snap-start"
        >
          {/* Ambient Background for the entire screen */}
          <img
            src={feat.svgFile}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-35 scale-110 pointer-events-none select-none"
          />

          {/* 9:16 Aspect Ratio Image as the Centerpiece */}
          <div className="relative z-10 h-full w-full max-h-screen flex items-center justify-center p-2 sm:p-4">
            <img
              src={feat.svgFile}
              alt={feat.title}
              className="h-full max-h-screen aspect-[9/16] object-contain shadow-2xl rounded-2xl select-none"
            />
          </div>
        </section>
      ))}

      {/* Floating HUD Controller / Quick Navigator */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-[#0c1322]/90 backdrop-blur-md border border-slate-700/80 p-2 rounded-2xl shadow-2xl max-w-[94vw] overflow-x-auto scrollbar-none">
        
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          title="Previous Feature (9:16)"
          className="p-2 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition shrink-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* 15 Feature Pills */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none px-1">
          {LANDING_FEATURES.map((feat, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={feat.id}
                onClick={() => scrollToFeature(idx)}
                title={`Option ${feat.number}: ${feat.title}`}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <span>{feat.icon}</span>
                <span className="hidden sm:inline font-mono">{feat.number.toString().padStart(2, "0")}</span>
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          title="Next Feature (9:16)"
          className="p-2 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition shrink-0"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Jump to Hero */}
        <button
          onClick={() => {
            document.getElementById("hero-section")?.scrollIntoView({ behavior: "smooth" });
          }}
          title="Back to Hero Top"
          className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition shrink-0 border-l border-slate-700/60 pl-2"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        {/* Quick Auth Trigger in HUD */}
        {onOpenAuth && (
          <button
            onClick={onOpenAuth}
            className="hidden md:flex items-center gap-1.5 bg-white hover:bg-slate-100 text-black font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-sm shrink-0 transition ml-1"
          >
            <span>Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
