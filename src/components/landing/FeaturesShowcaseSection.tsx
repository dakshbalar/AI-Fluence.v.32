import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  MapPin,
  Star,
  Gift,
  Target,
  Flame,
  Compass,
  Code2,
  Globe2,
  Terminal,
  CheckCircle,
  Cpu,
  Zap,
  RefreshCw,
  Check,
  BookOpen,
  Layers,
  FileText,
  BarChart3,
  Gem,
  Calendar,
  Shield,
  Share2,
  Users,
  PackageOpen,
  ShieldAlert,
  Sparkle,
  Palette,
  Smile,
  Timer,
  Swords,
  Trophy,
  TrendingUp,
  Crown,
  Award,
  UserCheck,
  Bot,
  MessageSquare,
  School,
  TrendingDown,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Copy,
  CheckCircle2,
  Play,
  Lock,
  ArrowRight
} from "lucide-react";
import { LANDING_FEATURES_LIST, FeatureItem } from "../../data/landingFeaturesData";

interface FeaturesShowcaseSectionProps {
  onSelectAction?: (featureId: string) => void;
}

export const FeaturesShowcaseSection: React.FC<FeaturesShowcaseSectionProps> = ({
  onSelectAction
}) => {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeFeature = LANDING_FEATURES_LIST[activeFeatureIndex] || LANDING_FEATURES_LIST[0];

  // Scroll active tab into view smoothly
  const handleSelectTab = (index: number) => {
    setActiveFeatureIndex(index);
    if (scrollContainerRef.current) {
      const tabs = scrollContainerRef.current.children;
      if (tabs[index]) {
        (tabs[index] as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center"
        });
      }
    }
  };

  const handleNextTab = () => {
    const nextIdx = (activeFeatureIndex + 1) % LANDING_FEATURES_LIST.length;
    handleSelectTab(nextIdx);
  };

  const handlePrevTab = () => {
    const prevIdx = (activeFeatureIndex - 1 + LANDING_FEATURES_LIST.length) % LANDING_FEATURES_LIST.length;
    handleSelectTab(prevIdx);
  };

  // Render dynamic icon helper
  const renderIcon = (name: string, className: string = "w-4 h-4") => {
    switch (name) {
      case "MapPin": return <MapPin className={className} />;
      case "Star": return <Star className={className} />;
      case "Gift": return <Gift className={className} />;
      case "Target": return <Target className={className} />;
      case "Flame": return <Flame className={className} />;
      case "Compass": return <Compass className={className} />;
      case "Sparkles": return <Sparkles className={className} />;
      case "Code2": return <Code2 className={className} />;
      case "Globe2": return <Globe2 className={className} />;
      case "Terminal": return <Terminal className={className} />;
      case "CheckCircle": return <CheckCircle className={className} />;
      case "Cpu": return <Cpu className={className} />;
      case "Zap": return <Zap className={className} />;
      case "RefreshCw": return <RefreshCw className={className} />;
      case "Check": return <Check className={className} />;
      case "BookOpen": return <BookOpen className={className} />;
      case "Layers": return <Layers className={className} />;
      case "FileText": return <FileText className={className} />;
      case "BarChart3": return <BarChart3 className={className} />;
      case "Gem": return <Gem className={className} />;
      case "Calendar": return <Calendar className={className} />;
      case "Shield": return <Shield className={className} />;
      case "Share2": return <Share2 className={className} />;
      case "Users": return <Users className={className} />;
      case "PackageOpen": return <PackageOpen className={className} />;
      case "ShieldAlert": return <ShieldAlert className={className} />;
      case "Sparkle": return <Sparkle className={className} />;
      case "Palette": return <Palette className={className} />;
      case "Smile": return <Smile className={className} />;
      case "Timer": return <Timer className={className} />;
      case "Swords": return <Swords className={className} />;
      case "Trophy": return <Trophy className={className} />;
      case "TrendingUp": return <TrendingUp className={className} />;
      case "Crown": return <Crown className={className} />;
      case "Award": return <Award className={className} />;
      case "UserCheck": return <UserCheck className={className} />;
      case "Bot": return <Bot className={className} />;
      case "MessageSquare": return <MessageSquare className={className} />;
      case "School": return <School className={className} />;
      case "TrendingDown": return <TrendingDown className={className} />;
      case "CheckSquare": return <CheckSquare className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  return (
    <section id="features-preview" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
        
        {/* Section Heading matching user requested tagline */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-3.5 py-1 rounded-full text-xs font-black text-slate-800 tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Comprehensive Learning Experience</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight">
            Turn learning into a game.
          </h2>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            Explore maps, complete challenging levels, earn dynamic ranks, and unlock brand new worlds. Select from all 15 core platform capabilities below to see how each system works.
          </p>
        </div>

        {/* 15 Features Horizontal Tab Navigation Bar with Arrows */}
        <div className="relative group">
          {/* Previous Button */}
          <button
            onClick={handlePrevTab}
            aria-label="Previous feature"
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-300 shadow-md items-center justify-center text-slate-700 hover:text-black hover:bg-slate-50 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Scrollable container for all 15 features */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 px-1 scrollbar-none snap-x"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {LANDING_FEATURES_LIST.map((feat, idx) => {
              const isSelected = idx === activeFeatureIndex;
              return (
                <button
                  key={feat.id}
                  id={`feature-tab-${feat.id}`}
                  onClick={() => handleSelectTab(idx)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 snap-start border ${
                    isSelected
                      ? "bg-black text-white border-black shadow-md scale-105"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-black hover:border-slate-300"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isSelected ? "bg-white text-black" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="whitespace-nowrap">{feat.tabTitle}</span>
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNextTab}
            aria-label="Next feature"
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-300 shadow-md items-center justify-center text-slate-700 hover:text-black hover:bg-slate-50 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dedicated Section View for Selected Feature */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="bg-slate-50/60 rounded-3xl border border-slate-200 p-6 md:p-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Detailed Description & Capabilities */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Badge & Index */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 shadow-2xs">
                    Feature {activeFeatureIndex + 1} of 15
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                    {activeFeature.badge}
                  </span>
                </div>

                {/* Exact requested title format: e.g. "Home — Your Learning Journey" */}
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-black text-black tracking-tight">
                    {activeFeature.fullTitle}
                  </h3>
                  <p className="text-sm font-semibold text-slate-700">
                    {activeFeature.tagline}
                  </p>
                </div>

                {/* Body paragraph */}
                <p className="text-slate-500 text-sm leading-relaxed">
                  {activeFeature.description}
                </p>

                {/* 3 Highlighted Bullets */}
                <div className="space-y-3 pt-2">
                  {activeFeature.bullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-3.5 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                      <div className={`w-8 h-8 rounded-xl ${activeFeature.accentBg} ${activeFeature.accentColor} flex items-center justify-center shrink-0`}>
                        {renderIcon(b.iconName, "w-4 h-4")}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-black">{b.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5 leading-normal">{b.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Metric stats row */}
                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-200">
                  {activeFeature.stats.map((s, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                      <p className="text-xs font-black text-black">{s.value}</p>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* CTA scroll action */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      document.getElementById("auth-box-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white font-bold text-xs hover:bg-slate-800 transition shadow-sm"
                  >
                    <span>Experience {activeFeature.tabTitle}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

              {/* Right Column: Custom Tailored Interactive Visual Preview */}
              <div className="lg:col-span-6 w-full">
                <InteractiveFeaturePreview featureId={activeFeature.id} />
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

// Subcomponent: Tailored Interactive Visual Preview for each of the 15 features
interface PreviewProps {
  featureId: string;
}

const InteractiveFeaturePreview: React.FC<PreviewProps> = ({ featureId }) => {
  // Local state for specific previews
  const [practiceSelected, setPracticeSelected] = useState<string | null>(null);
  const [practiceAnswered, setPracticeAnswered] = useState<boolean>(false);
  const [copiedClan, setCopiedClan] = useState<boolean>(false);
  const [chestOpened, setChestOpened] = useState<boolean>(false);
  const [selectedCourseCard, setSelectedCourseCard] = useState<string>("genai");
  const [activeCodeLang, setActiveCodeLang] = useState<string>("cpp");
  const [selectedMascotSkin, setSelectedMascotSkin] = useState<string>("cyber");
  const [theorySlideNum, setTheorySlideNum] = useState<number>(3);
  const [dailyQuestClaimed, setDailyQuestClaimed] = useState<boolean>(false);

  // 1. HOME — Interactive Path Map
  if (featureId === "home") {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-5">
        <div className="flex items-center justify-between border-b border-slate-150 pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-black text-black">Map View: Unit 1 — Foundations</span>
          </div>
          <span className="text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-0.5 rounded-full">
            Level 3 Active
          </span>
        </div>

        {/* Node Path simulation */}
        <div className="py-4 space-y-4 relative">
          <div className="flex items-center justify-between relative z-10">
            {/* Level 1 Done */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-md">
                <Check className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-700">Lvl 1</span>
              <div className="flex gap-0.5 text-amber-400 text-[10px]">★★★</div>
            </div>

            <div className="flex-1 h-1 bg-emerald-300 mx-2"></div>

            {/* Level 2 Done */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-md">
                <Check className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-700">Lvl 2</span>
              <div className="flex gap-0.5 text-amber-400 text-[10px]">★★★</div>
            </div>

            <div className="flex-1 h-1 bg-blue-300 mx-2"></div>

            {/* Level 3 Current */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg ring-4 ring-blue-100 animate-pulse">
                <Play className="w-5 h-5 fill-white" />
              </div>
              <span className="text-[10px] font-black text-blue-600">Lvl 3</span>
              <span className="text-[9px] font-bold text-blue-500">Current</span>
            </div>

            <div className="flex-1 h-1 bg-slate-200 mx-2"></div>

            {/* Level 4 Locked */}
            <div className="flex flex-col items-center gap-1.5 opacity-60">
              <div className="w-12 h-12 rounded-2xl bg-slate-150 text-slate-400 flex items-center justify-center font-black">
                <Lock className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-500">Lvl 4</span>
              <span className="text-[9px] text-slate-400">Locked</span>
            </div>

            <div className="flex-1 h-1 bg-slate-200 mx-2"></div>

            {/* Chest Milestone */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-white flex items-center justify-center font-black shadow-md">
                <Gift className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-amber-600">Vault</span>
              <span className="text-[9px] text-amber-500">+50 XP</span>
            </div>
          </div>
        </div>

        {/* Selected level summary card */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-black">Level 3: Recursion & Binary Search Steps</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Earn 2+ stars to unlock the next level and Milestone Vault.</p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 shrink-0">
            Start Deck
          </span>
        </div>
      </div>
    );
  }

  // 2. QUEST — Daily Mission Board
  if (featureId === "quest") {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-150 pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-black text-black">Daily Mission Deck</span>
          </div>
          <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full">
            Resets in 8h 14m
          </span>
        </div>

        <div className="space-y-3">
          {/* Quest 1 */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-bold text-black">Complete 3 Theory Slides</span>
              </div>
              <div className="w-36 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-full"></div>
              </div>
            </div>
            <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              ✓ Completed
            </span>
          </div>

          {/* Quest 2 */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-bold text-black">Score 100% on Coding Quiz</span>
              </div>
              <div className="w-36 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-full"></div>
              </div>
            </div>
            <button
              onClick={() => setDailyQuestClaimed(true)}
              disabled={dailyQuestClaimed}
              className={`text-[11px] font-black px-3 py-1 rounded-lg border transition ${
                dailyQuestClaimed
                  ? "bg-slate-100 text-slate-400 border-slate-200"
                  : "bg-amber-400 text-slate-950 border-amber-500 shadow-sm animate-pulse hover:bg-amber-300"
              }`}
            >
              {dailyQuestClaimed ? "Claimed!" : "Claim +20 Gems"}
            </button>
          </div>

          {/* Quest 3 */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-xs font-bold text-black">Earn 50 Total XP Today</span>
              </div>
              <div className="w-36 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-3/4"></div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-500">40 / 50 XP</span>
          </div>
        </div>
      </div>
    );
  }

  // 3. COURSES — Multi-Domain Path Switcher
  if (featureId === "courses") {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-150 pb-3">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-black text-black">Curriculum Tracks</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400">Click to preview</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={() => setSelectedCourseCard("genai")}
            className={`p-3.5 rounded-2xl border text-left transition ${
              selectedCourseCard === "genai"
                ? "border-blue-600 bg-blue-50/70 shadow-sm"
                : "border-slate-200 bg-slate-50 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-lg">🤖</span>
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">125 Levels</span>
            </div>
            <p className="text-xs font-extrabold text-black">Generative AI</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Prompting, RAG & Fine-Tuning</p>
          </button>

          <button
            onClick={() => setSelectedCourseCard("dsa")}
            className={`p-3.5 rounded-2xl border text-left transition ${
              selectedCourseCard === "dsa"
                ? "border-purple-600 bg-purple-50/70 shadow-sm"
                : "border-slate-200 bg-slate-50 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-lg">⚡</span>
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">153 Levels</span>
            </div>
            <p className="text-xs font-extrabold text-black">DSA & Algorithms</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Trees, Graphs & Dynamic Prog</p>
          </button>

          <button
            onClick={() => setSelectedCourseCard("aieveryone")}
            className={`p-3.5 rounded-2xl border text-left transition ${
              selectedCourseCard === "aieveryone"
                ? "border-amber-600 bg-amber-50/70 shadow-sm"
                : "border-slate-200 bg-slate-50 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-lg">🌍</span>
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">45 Lessons</span>
            </div>
            <p className="text-xs font-extrabold text-black">AI for Everyone</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Ethics, Safety & Future Tech</p>
          </button>
        </div>

        <div className="bg-slate-900 text-white p-3.5 rounded-2xl text-xs flex items-center justify-between">
          <span className="text-slate-300 text-[11px]">Seamless zero-delay track switching.</span>
          <span className="font-bold text-emerald-400 text-[10px]">Instant Persistence</span>
        </div>
      </div>
    );
  }

  // 4. DSA & CODING — Interactive IDE
  if (featureId === "dsa_coding") {
    return (
      <div className="bg-slate-950 text-slate-200 rounded-3xl p-6 font-mono text-xs border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveCodeLang("cpp")}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                activeCodeLang === "cpp" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"
              }`}
            >
              C++ 20
            </button>
            <button
              onClick={() => setActiveCodeLang("python")}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                activeCodeLang === "python" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"
              }`}
            >
              Python 3.12
            </button>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">● Compiler Ready</span>
        </div>

        <div className="space-y-1 text-slate-400 text-[11px] leading-relaxed">
          <p className="text-slate-500">// Problem: Find Maximum Subarray Sum (Kadane's Algorithm)</p>
          <p className="text-blue-400">int <span className="text-amber-300">maxSubArray</span>(vector&lt;int&gt;& nums) &#123;</p>
          <p className="text-slate-300 pl-4">int current = nums[0], best = nums[0];</p>
          <p className="text-slate-300 pl-4">for (size_t i = 1; i &lt; nums.size(); ++i) &#123;</p>
          <p className="text-slate-200 pl-8">current = max(nums[i], current + nums[i]);</p>
          <p className="text-slate-200 pl-8">best = max(best, current);</p>
          <p className="text-slate-300 pl-4">&#125;</p>
          <p className="text-emerald-400 pl-4">return best; <span className="text-slate-500">// O(N) Time, O(1) Space</span></p>
          <p className="text-blue-400">&#125;</p>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl flex items-center justify-between text-emerald-400 text-[11px] font-bold">
          <span>✓ 12/12 Test Cases Passed (Runtime: 0ms • Beats 98.2%)</span>
          <span className="bg-emerald-500/20 px-2 py-0.5 rounded text-[9px]">Accepted</span>
        </div>
      </div>
    );
  }

  // 5. PRACTICE — Learn by Doing Drill
  if (featureId === "practice") {
    const options = [
      { id: "a", text: "Stack (LIFO)", correct: false },
      { id: "b", text: "Queue (FIFO)", correct: true },
      { id: "c", text: "Binary Search Tree", correct: false },
      { id: "d", text: "Hash Map", correct: false }
    ];

    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-5">
        <div className="flex items-center justify-between border-b border-slate-150 pb-3">
          <span className="text-[10px] font-black tracking-widest text-cyan-600 uppercase">Interactive Drill</span>
          <span className="text-[10px] font-bold text-slate-400">1 of 5 Questions</span>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Data Structures Core</p>
          <h4 className="text-sm font-extrabold text-black">
            Which data structure operates on a First-In, First-Out (FIFO) access order?
          </h4>
        </div>

        <div className="space-y-2">
          {options.map((opt) => {
            const isSelected = practiceSelected === opt.id;
            const showCorrect = practiceAnswered && opt.correct;
            const showWrong = practiceAnswered && isSelected && !opt.correct;

            return (
              <button
                key={opt.id}
                onClick={() => {
                  setPracticeSelected(opt.id);
                  setPracticeAnswered(true);
                }}
                className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                  showCorrect
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-100"
                    : showWrong
                    ? "bg-rose-50 border-rose-500 text-rose-800"
                    : isSelected
                    ? "bg-cyan-50 border-cyan-500 text-cyan-900"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                }`}
              >
                <span>{opt.text}</span>
                {showCorrect && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
            );
          })}
        </div>

        {practiceAnswered && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center justify-between">
            <span>🎉 Correct answer! Queues process elements in arrival order.</span>
            <span className="font-extrabold text-emerald-700">+15 XP</span>
          </div>
        )}
      </div>
    );
  }

  // 6. THEORY — Visual Slide Deck Reader
  if (featureId === "theory") {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-150 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-black text-black">Concept Deck Reader</span>
          </div>
          <span className="text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full">
            Slide {theorySlideNum} of 10
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-purple-600">Core Mental Model</span>
          <h4 className="text-sm font-black text-black">Self-Attention Mechanism in Transformers</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Instead of reading words strictly left-to-right, self-attention maps relationships across every word in a sequence concurrently using Query, Key, and Value vectors.
          </p>
          
          <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-[10px] text-purple-800">
            Attention(Q, K, V) = softmax(Q·Kᵀ / √dₖ) · V
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setTheorySlideNum(Math.max(1, theorySlideNum - 1))}
            className="text-xs font-bold text-slate-600 hover:text-black bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200"
          >
            ← Previous
          </button>
          <span className="text-[10px] font-bold text-slate-400">10 Focused Slides Per Topic</span>
          <button
            onClick={() => setTheorySlideNum(Math.min(10, theorySlideNum + 1))}
            className="text-xs font-bold text-white bg-black hover:bg-slate-800 px-3 py-1.5 rounded-xl"
          >
            Next Slide →
          </button>
        </div>
      </div>
    );
  }

  // 7. PROGRESS & REWARDS — Gauge & Streaks
  if (featureId === "progress_rewards") {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-150 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-black text-black">Scholar Progress Hub</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            Live Synced
          </span>
        </div>

        {/* Level XP Bar */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-extrabold text-black">Rank: Level 4 Scholar</span>
            <span className="font-bold text-slate-500">680 / 1,000 XP</span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full w-[68%] rounded-full"></div>
          </div>
        </div>

        {/* Streak Flame Tracker */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
              <Flame className="w-6 h-6 fill-orange-500" />
            </div>
            <div>
              <p className="text-xs font-black text-black">7-Day Study Streak!</p>
              <p className="text-[10px] text-slate-500">1.5x Experience Multiplier Active</p>
            </div>
          </div>
          <div className="flex gap-1">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span key={i} className="w-5 h-5 rounded-full bg-orange-500 text-white font-black text-[9px] flex items-center justify-center">
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 8. CLANS — Shield & Team Standing
  if (featureId === "clans") {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-150 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-black text-black">Clan: CyberKnights</span>
          </div>
          <span className="text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full">
            Rank #2 Global
          </span>
        </div>

        {/* Clan Card */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 border-2 border-cyan-400 flex items-center justify-center font-black text-xl shadow-lg">
                ⚔️
              </div>
              <div>
                <h4 className="text-sm font-black">CyberKnights</h4>
                <p className="text-[10px] text-slate-400">Tag: #CK-8941 • 48/50 Members</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-amber-400">18,450 🏆</p>
              <p className="text-[9px] text-slate-400">Clan Trophies</p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <span className="text-[10px] text-slate-400">Share Unique ID with classmates</span>
            <button
              onClick={() => {
                setCopiedClan(true);
                setTimeout(() => setCopiedClan(false), 2000);
              }}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedClan ? "Copied!" : "Copy Clan ID"}</span>
            </button>
          </div>
        </div>

        {/* Top Clan Members */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-800">1. Devansh V. (Leader)</span>
            <span className="text-blue-600 font-bold">1,420 🏆</span>
          </div>
          <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-800">2. Anya S. (Elder)</span>
            <span className="text-blue-600 font-bold">1,280 🏆</span>
          </div>
        </div>
      </div>
    );
  }

  // 9. REWARDS — Pixel Chest Simulator
  if (featureId === "rewards") {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-4 text-center">
        <div className="flex items-center justify-between border-b border-slate-150 pb-3 text-left">
          <div className="flex items-center gap-2">
            <PackageOpen className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-black text-black">Vault Mystery Chest</span>
          </div>
          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            Legendary Tier
          </span>
        </div>

        <div className="py-6 bg-slate-900 rounded-2xl text-white space-y-4 relative overflow-hidden">
          <div className="text-4xl animate-bounce">
            {chestOpened ? "✨ 💎 ✨" : "🎁"}
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-black text-amber-400">
              {chestOpened ? "Loot Dropped!" : "Golden Milestone Chest Ready"}
            </h4>
            <p className="text-[11px] text-slate-400">
              {chestOpened ? "+120 XP, +35 Diamonds, and 1 Streak Freeze!" : "Tap below to simulate unlocking."}
            </p>
          </div>

          <button
            onClick={() => setChestOpened(!chestOpened)}
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition"
          >
            {chestOpened ? "Reset Chest" : "Open Mystery Chest"}
          </button>
        </div>
      </div>
    );
  }

  // 10. AVATARS — Custom Mascot Style
  if (featureId === "avatars") {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-150 pb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-pink-600" />
            <span className="text-xs font-black text-black">Mascot Studio: Aiden</span>
          </div>
          <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
            Customization
          </span>
        </div>

        <div className="bg-slate-950 text-white rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-b from-cyan-500/20 to-pink-500/20 border-2 border-cyan-400 flex items-center justify-center text-4xl shadow-xl">
            🤖
          </div>
          <p className="text-xs font-black text-cyan-300">Aiden • Cyber Knight Edition</p>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase text-slate-400">Select Armor Skin Palette</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "cyber", label: "Neon Cyan", color: "bg-cyan-400" },
              { id: "gold", label: "Gold Titan", color: "bg-amber-400" },
              { id: "pink", label: "Lumi Pulse", color: "bg-pink-400" }
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedMascotSkin(s.id)}
                className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition ${
                  selectedMascotSkin === s.id
                    ? "border-black bg-slate-100 text-black"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                <span className={`w-3 h-3 rounded-full ${s.color}`}></span>
                <span className="text-[10px]">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 11. CHALLENGES — Timed Tournaments
  if (featureId === "challenges") {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-150 pb-3">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-violet-600" />
            <span className="text-xs font-black text-black">Weekend Algorithmic Sprint</span>
          </div>
          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 animate-pulse">
            Live Event
          </span>
        </div>

        <div className="bg-gradient-to-r from-violet-900 to-indigo-950 text-white p-5 rounded-2xl space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-violet-300 uppercase tracking-wider">Tournament Clock</p>
              <h4 className="text-xl font-black text-white">Ends in 14h 22m 08s</h4>
            </div>
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-xs flex justify-between">
            <span>Prize Pool: 1,000 Diamonds + Champion Badge</span>
            <span className="font-bold text-amber-300">Top 5%</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between text-xs">
          <div>
            <p className="font-bold text-black">Your Standing: Rank #14 of 1,240</p>
            <p className="text-[10px] text-slate-500">2 Problems Solved • 8m 12s Runtime</p>
          </div>
          <span className="font-bold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-xl border border-violet-200">
            Resume Match
          </span>
        </div>
      </div>
    );
  }

  // 12. LEAGUE — Tiered Division Ladders
  if (featureId === "league") {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-150 pb-3">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-black text-black">Division: Gold League</span>
          </div>
          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            Ends Sunday
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-emerald-800">
            <span className="font-bold">▲ Promotion Zone (Top 5 Advance to Crystal)</span>
            <span className="font-black text-[10px]">Tier 3/8</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold">
              <span className="text-amber-500">#1. Devansh V.</span>
              <span className="text-slate-900">640 🏆</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 font-bold text-blue-900 ring-1 ring-blue-300">
              <span>#2. You (Promoting!)</span>
              <span>590 🏆</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold">
              <span className="text-slate-700">#3. Anya Sharma</span>
              <span className="text-slate-900">545 🏆</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 13. PROFILE — Digital Student Passport
  if (featureId === "profile") {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-150 pb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-black text-black">Verified Learner Passport</span>
          </div>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            ID: #AF-9921
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center text-2xl font-black shadow-md">
            🤖
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-black text-black">A.I. Scholar Recruit</h4>
            <p className="text-[11px] text-slate-500">Focus: Generative AI & Data Structures</p>
            <p className="text-[10px] font-bold text-blue-600">Goal: 30 Mins Daily Commitment</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <p className="font-black text-black">153</p>
            <p className="text-[9px] text-slate-400 font-bold">Levels</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <p className="font-black text-black">7 Days</p>
            <p className="text-[9px] text-slate-400 font-bold">Streak</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <p className="font-black text-black">1,450</p>
            <p className="text-[9px] text-slate-400 font-bold">Trophies</p>
          </div>
        </div>
      </div>
    );
  }

  // 14. AI SUPPORT — Realtime Chat Coach
  if (featureId === "ai_support") {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-150 pb-3">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-cyan-600" />
            <span className="text-xs font-black text-black">Gemini AI Tutor Chat</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Online 24/7
          </span>
        </div>

        <div className="space-y-3 text-xs leading-relaxed">
          {/* User query */}
          <div className="flex justify-end">
            <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] shadow-xs">
              Why does my binary search loop infinitely on `while(low &lt;= high)`?
            </div>
          </div>

          {/* AI Coach response */}
          <div className="flex justify-start">
            <div className="bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-2xl rounded-tl-none max-w-[85%] space-y-1.5">
              <p>Great question! In your code, you wrote:</p>
              <div className="bg-slate-150 p-1.5 rounded text-[11px] font-mono">
                low = mid; <span className="text-rose-600">// Causes infinite loop</span>
              </div>
              <p>Change it to <code className="bg-blue-150 text-blue-900 px-1 rounded font-bold">low = mid + 1;</code> to ensure the search range shrinks every step!</p>
            </div>
          </div>
        </div>

        <div className="pt-1">
          <span className="text-[10px] text-slate-400 font-semibold">Instant Socratic hints without spoiling full solutions.</span>
        </div>
      </div>
    );
  }

  // 15. FOR INSTITUTIONS — Classroom Analytics
  if (featureId === "institutions") {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-150 pb-3">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-black text-black">Instructor Portal: CS 101 Cohort</span>
          </div>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            42 Students
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <p className="text-base font-black text-black">94.2%</p>
            <p className="text-[10px] text-slate-400 font-bold">Average Completion</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <p className="text-base font-black text-emerald-600">91% Pass</p>
            <p className="text-[10px] text-slate-400 font-bold">Quiz Certification</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-amber-800 font-extrabold">
            <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
            <span>Struggle Alert Detected</span>
          </div>
          <p className="text-[11px] text-amber-700">
            5 students encountered &gt;2 retries on <strong>Dynamic Programming: Knapsack</strong>. Assigned 1-click review deck.
          </p>
        </div>

        <button className="w-full py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition">
          Export Gradebook CSV
        </button>
      </div>
    );
  }

  return null;
};
