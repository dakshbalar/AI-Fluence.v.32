import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, MotionValue, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Check, 
  ShieldAlert, 
  ArrowUpRight, 
  X,
  Menu,
  ChevronRight,
  Flame,
  Award,
  BookOpen,
  Cpu,
  Layers,
  Code2,
  Calendar,
  CheckCircle2,
  Download,
  Printer,
  ChevronDown,
  Building,
  GraduationCap,
  Phone,
  Search
} from 'lucide-react';
import { AIFluenceLogo } from '../common/AIFluenceLogo';

// Visual assets for AI Fluence
import heroPosterImage from '../../assets/images/aifluence_hero_poster_1790141641852.png';
import slideDsa from '../../assets/images/aifluence_slide_dsa_1790142967589.png';
import slideGenAi from '../../assets/images/aifluence_slide_genai_1790142980331.png';
import slideTools from '../../assets/images/slide_cloud_cluster_1790143767123.png';
import slideNeuralNetwork from '../../assets/images/slide_neural_network_1790143655462.png';
import slideQuantumComputing from '../../assets/images/slide_quantum_computing_1790143670330.png';
import slideCodeMatrix from '../../assets/images/slide_code_matrix_1790143691887.png';
import slideRoboticsAi from '../../assets/images/slide_robotics_ai_1790143703556.jpg';
import slideAgentWorkflow from '../../assets/images/slide_agent_workflow_1790143715327.png';
import slideDeepLearning from '../../assets/images/slide_deep_learning_1790143732578.png';
import slideDataScience from '../../assets/images/slide_data_science_1790143753980.png';
import slideCloudCluster from '../../assets/images/slide_cloud_cluster_1790143767123.png';
import slideNaturalLanguage from '../../assets/images/slide_natural_language_1790143776900.png';
import slideComputerVision from '../../assets/images/slide_computer_vision_1790143790447.png';
import slideReinforcement from '../../assets/images/slide_reinforcement_1790143802879.png';

interface AIFluenceJackLandingPageProps {
  authMode: 'signup' | 'login';
  setAuthMode: (mode: 'signup' | 'login') => void;
  displayName: string;
  setDisplayName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  isLoading: boolean;
  errorMsg: string;
  setErrorMsg: (val: string) => void;
  successMsg: string;
  setSuccessMsg: (val: string) => void;
  selectedTrack: string;
  setSelectedTrack: (track: string) => void;
  handleAuthSubmit: (e: React.FormEvent) => Promise<void>;
  handleGoogleSignIn: () => Promise<void>;
  onNavigateToBootcamp: () => void;
}

/* ==========================================================================
   2-LINE REVIEW-STYLE ARTICLES (HOW AI IS CHANGING THE WORLD)
   ========================================================================== */
interface ReviewQuote {
  quote: string;
  source: string;
}

const REVIEW_QUOTES_ROW_1: ReviewQuote[] = [
  {
    quote: "“Generative AI isn't replacing young coders — it's turning students into 10x software architects.”",
    source: "MIT Technology Review",
  },
  {
    quote: "“Interactive algorithmic sandboxes boost student conceptual mastery speed by over 300%.”",
    source: "Global EdTech Insights",
  },
  {
    quote: "“Reasoning models now beat top humans in competitive math Olympiads and logic synthesis.”",
    source: "Stanford AI Index",
  },
  {
    quote: "“Prompt engineering and agent coordination have become the single most vital literacy for 2026.”",
    source: "Forbes Technology",
  },
  {
    quote: "“Autonomous coding agents resolve production tasks in minutes, transforming developer expectations.”",
    source: "DevOps Engineering Review",
  },
  {
    quote: "“Kids mastering AI today will build the autonomous systems of the next decade.”",
    source: "Wired Future of Learning",
  },
];

const REVIEW_QUOTES_ROW_2: ReviewQuote[] = [
  {
    quote: "“Core algorithmic mastery remains the superpower that separates casual users from real AI creators.”",
    source: "ACM Computer Science",
  },
  {
    quote: "“Personalized neural tutors tailor every challenge directly to each student's unique learning curve.”",
    source: "Harvard Education Gazette",
  },
  {
    quote: "“Generative intelligence is unlocking a generational $15.7 trillion shift across the global economy.”",
    source: "Bloomberg Intelligence",
  },
  {
    quote: "“The next generation won't just write scripts; they will orchestrate autonomous agent swarms.”",
    source: "VentureBeat AI",
  },
  {
    quote: "“Visualizing data structures turns intimidating coding challenges into intuitive, daily play.”",
    source: "IEEE Spectrum",
  },
  {
    quote: "“Deep learning problem-solving is the single most valuable foundational skill of the 21st century.”",
    source: "Nature Machine Intelligence",
  },
];

/* ==========================================================================
   CONFIGURABLE INSTITUTES LIST FOR POP-DOWN FORM
   ========================================================================== */
const CONFIG_INSTITUTES = [
  'Neetu Dance Academy',
];

/* ==========================================================================
   REUSABLE BLUE & CYAN ACCENTED COMPONENTS
   ========================================================================== */

/**
 * SignUpPillButton: Electric Blue to Cyan gradient pill button
 */
export const SignUpPillButton: React.FC<{ onClick?: () => void; label?: string; className?: string }> = ({ 
  onClick, 
  label = 'Sign Up', 
  className = '' 
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'linear-gradient(123deg, #020B1A 7%, #004BE8 37%, #0066FF 72%, #00D2FF 100%)',
        boxShadow: '0px 4px 14px rgba(0, 102, 255, 0.4), 4px 4px 14px #0052FF inset',
        outline: '2px solid white',
        outlineOffset: '-3px',
      }}
      className={`rounded-full text-white font-extrabold uppercase tracking-widest px-8 py-3.5 sm:px-10 sm:py-4 md:px-12 md:py-4 text-xs sm:text-sm md:text-base cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200 shadow-2xl select-none font-sans ${className}`}
    >
      {label}
    </button>
  );
};

/**
 * Ghost/outline pill button in crisp electric blue
 */
export const GhostPillButton: React.FC<{ onClick?: () => void; label?: string; className?: string }> = ({ 
  onClick, 
  label = 'Sign Up to Start', 
  className = '' 
}) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border-2 border-blue-400 text-blue-300 font-extrabold uppercase tracking-widest px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm hover:bg-blue-600/20 hover:text-white transition-colors duration-200 cursor-pointer select-none font-sans ${className}`}
    >
      <span>{label}</span>
      <ArrowUpRight className="w-4 h-4 text-sky-400" />
    </button>
  );
};

/**
 * FadeIn wrapper with Framer Motion
 */
export const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
}> = ({ children, delay = 0, duration = 0.7, x = 0, y = 30, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * CharacterSpan: Single character animated by scroll progress
 */
const CharacterSpan: React.FC<{
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}> = ({ char, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <span className="relative inline-block">
      <span className="opacity-0">{char}</span>
      <motion.span style={{ opacity }} className="absolute left-0 top-0">
        {char}
      </motion.span>
    </span>
  );
};

/**
 * AnimatedText: Character-by-character scroll-reveal animation
 */
export const AnimatedText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLParagraphElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const characters = text.split('');
  const total = characters.length;

  return (
    <p ref={containerRef} className={className}>
      {characters.map((char, index) => {
        const start = index / total;
        const end = Math.min(1, start + 0.1);
        return (
          <CharacterSpan
            key={index}
            char={char === ' ' ? '\u00A0' : char}
            progress={scrollYProgress}
            range={[start, end]}
          />
        );
      })}
    </p>
  );
};

/* ==========================================================================
   WHAT IS AI FLUENCE (PURPOSE & SERVICES DATA)
   ========================================================================== */
const AI_FLUENCE_PURPOSE = [
  {
    num: '01',
    name: 'Interactive AI Engineering',
    desc: 'Creation of real-world AI applications, prompt engineering, LLM fine-tuning, and retrieval-augmented generation (RAG) pipelines tailored for modern engineering standards.',
  },
  {
    num: '02',
    name: 'Gamified Algorithmic Mastery',
    desc: 'Bite-sized interactive theory decks, live coding puzzles, streak multipliers, and tier-based league tournaments designed to turn learning into daily habits.',
  },
  {
    num: '03',
    name: 'Multi-Track Curriculum',
    desc: 'Deep-dive structured pathways across Generative AI, Data Structures & Algorithms, and AI for Everyone — from core algorithmic complexity to autonomous agent systems.',
  },
  {
    num: '04',
    name: 'Hands-On Sandboxes & Labs',
    desc: 'Interactive in-browser code challenge environments, live execution feedback, neural model sandboxes, and cloud cluster testing without any local setup friction.',
  },
  {
    num: '05',
    name: 'Verified Milestone Certifications',
    desc: 'Earn verified skill credentials, climb global algorithmic leaderboards, build public proof-of-work repositories, and showcase your readiness to top engineering recruiters.',
  },
];

/* ==========================================================================
   FEATURES IN AI FLUENCE (1 PROMINENT IMAGE PER SCREEN)
   ========================================================================== */
const AI_FLUENCE_FEATURES = [
  {
    num: '01',
    title: 'Data Structures & Algorithmic Matrix',
    category: 'Core Engineering',
    tagline: 'Master algorithmic problem solving, matrix paths, dynamic programming, and data structures through interactive visualization grids.',
    image: slideDsa,
    badgeText: 'Algorithmic Track',
  },
  {
    num: '02',
    title: 'Generative AI & LLM Architecture',
    category: 'Applied Intelligence',
    tagline: 'Hands-on prompt patterns, vector search embeddings, transformer attention mechanics, and domain fine-tuning.',
    image: slideGenAi,
    badgeText: 'Generative AI Track',
  },
  {
    num: '03',
    title: 'Autonomous Multi-Agent Orchestration',
    category: 'Next-Gen AI Systems',
    tagline: 'Build, debug, and coordinate multi-agent workflows, tool execution loops, and real-time inference pipelines.',
    image: slideAgentWorkflow,
    badgeText: 'Agent Engineering',
  },
  {
    num: '04',
    title: 'Gamified Roadmaps & Challenges',
    category: 'Daily Engagement',
    tagline: 'Stay locked in with daily streak shields, XP multiplier challenges, and global tier league tournaments.',
    image: heroPosterImage,
    badgeText: 'Gamified Hub',
  },
  {
    num: '05',
    title: 'Distributed Cloud Cluster & Sandboxes',
    category: 'Cloud Infrastructure',
    tagline: 'Run live interactive code sandboxes, simulated distributed clusters, and automated test harnesses with zero local install.',
    image: slideCloudCluster,
    badgeText: 'Cloud Sandboxes',
  },
];

/* ==========================================================================
   FEATURE CARD COMPONENT (1 IMAGE PER SCREEN)
   ========================================================================== */
interface FeatureCardProps {
  feature: typeof AI_FLUENCE_FEATURES[0];
  index: number;
  totalCards: number;
  onActionClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index, totalCards, onActionClick }) => {
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: cardContainerRef,
    offset: ['start end', 'start start'],
  });

  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div
      ref={cardContainerRef}
      className="sticky h-[88vh] flex items-start justify-center"
      style={{
        top: `calc(5.5rem + ${index * 26}px)`,
      }}
    >
      <motion.div
        style={{ scale }}
        className="w-full max-w-6xl rounded-[36px] sm:rounded-[48px] md:rounded-[56px] border-2 border-blue-500/30 bg-[#0C0C0C] p-5 sm:p-7 md:p-8 flex flex-col justify-between shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden"
      >
        {/* Top row: Number, category label, project name, Action button */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-blue-400/20">
          <div className="flex items-baseline gap-4 sm:gap-6">
            <span className="font-black text-4xl sm:text-6xl md:text-7xl text-blue-500 tracking-tighter font-sans">
              {feature.num}
            </span>
            <div>
              <span className="text-[11px] sm:text-xs uppercase tracking-widest text-sky-400 font-bold block font-sans">
                {feature.category}
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-white tracking-tight font-sans">
                {feature.title}
              </h3>
            </div>
          </div>
          <GhostPillButton onClick={onActionClick} label="Sign Up to Start" />
        </div>

        {/* Bottom row: Exactly 1 High-Impact Showcase Image in 1 Screen */}
        <div className="pt-5 flex-1 flex flex-col justify-between min-h-0">
          <div className="w-full flex-1 min-h-[300px] sm:min-h-[400px] md:min-h-[460px] rounded-[24px] sm:rounded-[36px] md:rounded-[44px] overflow-hidden border border-blue-500/25 bg-neutral-950 relative group">
            <img
              src={feature.image}
              alt={feature.title}
              loading="lazy"
              className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
            />
            {/* Dark glass highlight overlay at bottom of the image */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-5 sm:p-8 flex items-end justify-between gap-4">
              <div className="max-w-2xl bg-slate-950/80 backdrop-blur-xl border border-blue-400/30 p-4 sm:p-5 rounded-2xl shadow-xl">
                <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-sky-400 block mb-1">
                  ● {feature.badgeText}
                </span>
                <p className="text-xs sm:text-sm md:text-base font-semibold text-slate-200 leading-snug">
                  {feature.tagline}
                </p>
              </div>

              <div className="hidden sm:block">
                <SignUpPillButton onClick={onActionClick} label="Join Track" className="py-2.5 px-6 text-xs" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ==========================================================================
   TYPEWRITER TITLE COMPONENT ("Welcome to" then "AI Fluence")
   ========================================================================== */
const TypewriterTitle: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const line1Full = "Welcome to";
  const line2Full = "AI Fluence";
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [phase, setPhase] = useState<'line1' | 'line2' | 'done'>('line1');

  useEffect(() => {
    let i = 0;
    const t1 = setInterval(() => {
      if (i <= line1Full.length) {
        setLine1(line1Full.slice(0, i));
        i++;
      } else {
        clearInterval(t1);
        setPhase('line2');
      }
    }, 55);

    return () => clearInterval(t1);
  }, []);

  useEffect(() => {
    if (phase !== 'line2') return;
    let j = 0;
    const t2 = setInterval(() => {
      if (j <= line2Full.length) {
        setLine2(line2Full.slice(0, j));
        j++;
      } else {
        clearInterval(t2);
        setPhase('done');
        if (onComplete) onComplete();
      }
    }, 65);

    return () => clearInterval(t2);
  }, [phase, onComplete]);

  return (
    <h1 className="hero-heading font-black uppercase tracking-tight leading-[1.04] text-center font-sans">
      <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-sky-200">
        {line1}
        {phase === 'line1' && (
          <span className="inline-block w-2 sm:w-3.5 h-7 sm:h-12 bg-sky-400 ml-1.5 animate-pulse align-middle" />
        )}
      </span>
      <span 
        style={{ fontFamily: "'Lobster', cursive" }}
        className="block text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] mt-3 normal-case tracking-normal bg-gradient-to-r from-blue-400 via-sky-200 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,102,255,0.65)]"
      >
        {line2}
        {phase === 'line2' && (
          <span className="inline-block w-2.5 sm:w-4 h-9 sm:h-16 bg-blue-500 ml-2 animate-pulse align-middle" />
        )}
      </span>
    </h1>
  );
};

/* ==========================================================================
   MAIN AI FLUENCE JACK-STYLE LANDING PAGE
   ========================================================================== */
export const AIFluenceJackLandingPage: React.FC<AIFluenceJackLandingPageProps> = ({
  authMode,
  setAuthMode,
  displayName,
  setDisplayName,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  isLoading,
  errorMsg,
  setErrorMsg,
  successMsg,
  setSuccessMsg,
  selectedTrack,
  setSelectedTrack,
  handleAuthSubmit,
  handleGoogleSignIn,
  onNavigateToBootcamp,
}) => {
  const marqueeSectionRef = useRef<HTMLDivElement | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Bootcamp registration state
  const [bootcampSubmitting, setBootcampSubmitting] = useState(false);
  const [bootcampSuccessId, setBootcampSuccessId] = useState<string | null>(null);
  const [bootcampError, setBootcampError] = useState<string | null>(null);

  // Bootcamp Form State
  const [parentName, setParentName] = useState('');
  const [parentContact, setParentContact] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentContact, setStudentContact] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [standard, setStandard] = useState('Standard 8');
  const [institute, setInstitute] = useState('Neetu Dance Academy');
  const [instituteSearch, setInstituteSearch] = useState('');
  const [otherInstitute, setOtherInstitute] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [consentConfirmed, setConsentConfirmed] = useState(false);

  // Marquee scroll listener calculation: (window.scrollY - sectionTop + window.innerHeight) * 0.3
  useEffect(() => {
    const handleScroll = () => {
      if (!marqueeSectionRef.current) return;
      const rect = marqueeSectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setScrollOffset(offset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openSignUpModal = () => {
    setAuthMode('signup');
    setErrorMsg('');
    setSuccessMsg('');
    setIsAuthModalOpen(true);
  };

  const openSignInModal = () => {
    setAuthMode('login');
    setErrorMsg('');
    setSuccessMsg('');
    setIsAuthModalOpen(true);
  };

  const handleBootcampSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBootcampError(null);

    if (!parentName.trim() || !parentContact.trim() || !studentName.trim() || !schoolName.trim() || !consentConfirmed) {
      setBootcampError('Please complete all required fields and confirm parental consent.');
      return;
    }

    const selectedInstitute = institute.trim() || 'Neetu Dance Academy';

    setBootcampSubmitting(true);
    try {
      const response = await fetch('/api/bootcamp/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName: parentName.trim(),
          parentContact: parentContact.trim(),
          parentEmail: parentEmail.trim(),
          studentName: studentName.trim(),
          studentContact: studentContact.trim(),
          schoolName: schoolName.trim(),
          standard,
          institute: selectedInstitute,
          source: 'landing_hero_banner_popdown',
          registrationStatus: 'confirmed',
          paymentStatus: 'free_pass',
        }),
      });

      const data = await response.json();
      if (data.success && data.registrationId) {
        setBootcampSuccessId(data.registrationId);
      } else {
        setBootcampError(data.error || 'Registration failed. Please verify your details.');
      }
    } catch (err: any) {
      setBootcampError(err.message || 'Network error while submitting registration.');
    } finally {
      setBootcampSubmitting(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#0C0C0C',
        fontFamily: "'Inter', sans-serif",
        overflowX: 'clip',
      }}
      className="min-h-screen text-[#D7E2EA] font-sans selection:bg-blue-500 selection:text-white"
    >
      {/* Electric Blue & White Metallic Gradient for Headings */}
      <style>{`
        .hero-heading {
          background: linear-gradient(180deg, #FFFFFF 15%, #93C5FD 55%, #2563EB 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* ====================================================================
          TOP FIXED NAVIGATION HEADER (NO CAPSULE)
          ==================================================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0C0C0C]/85 backdrop-blur-xl border-b border-blue-500/20 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 font-bold">
            <a
              href="#about"
              className="text-[#D7E2EA] font-bold uppercase tracking-wider text-xs lg:text-sm hover:text-sky-400 transition-colors"
            >
              About
            </a>
            <a
              href="#what-is-aifluence"
              className="text-[#D7E2EA] font-bold uppercase tracking-wider text-xs lg:text-sm hover:text-sky-400 transition-colors"
            >
              What is AI Fluence
            </a>
            <a
              href="#features"
              className="text-[#D7E2EA] font-bold uppercase tracking-wider text-xs lg:text-sm hover:text-sky-400 transition-colors"
            >
              Features
            </a>
            <button
              onClick={() => {
                document.getElementById('bootcamp-screen')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sky-400 font-extrabold uppercase tracking-wider text-xs lg:text-sm hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 hover:border-blue-400"
            >
              <span>🎓</span> Student Registration
            </button>
          </div>

          {/* Right: Sign In / Menu Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={openSignInModal}
              className="text-xs sm:text-sm font-extrabold uppercase tracking-wider px-4 py-2 rounded-full border border-blue-400/40 text-sky-200 hover:text-white hover:border-blue-400 hover:bg-blue-600/20 transition cursor-pointer"
            >
              Sign In
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-blue-950/60 border border-blue-500/30 text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-5 rounded-2xl bg-[#0f172a] border border-blue-500/30 shadow-2xl flex flex-col gap-3 font-sans">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-bold uppercase tracking-wider text-white"
            >
              About
            </a>
            <a
              href="#what-is-aifluence"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-bold uppercase tracking-wider text-white"
            >
              What is AI Fluence
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-bold uppercase tracking-wider text-white"
            >
              Features
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('bootcamp-screen')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-left text-sm font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2"
            >
              <span>🎓</span> Student Registration
            </button>
            <div className="pt-2 border-t border-white/10 flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openSignUpModal();
                }}
                className="flex-1 py-2.5 bg-blue-600 rounded-xl text-xs font-black text-white uppercase"
              >
                Sign Up
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openSignInModal();
                }}
                className="flex-1 py-2.5 bg-white/10 rounded-xl text-xs font-black text-white uppercase"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ====================================================================
          1. HERO SECTION WITH PURE BLACK BACKGROUND & TYPEWRITER TITLE
          ==================================================================== */}
      <section
        id="hero"
        className="relative w-full bg-[#0C0C0C] select-none pt-28 pb-20 px-4 sm:px-6 md:px-8 overflow-hidden"
      >
        {/* Subtle top ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/15 via-transparent to-transparent pointer-events-none z-0" />

        {/* HERO TITLE (TYPEWRITER EFFECT ON PURE BLACK BACKGROUND) */}
        <div className="relative z-10 w-full max-w-5xl mx-auto text-center pt-8 pb-10">
          <TypewriterTitle />

          <FadeIn delay={0.25} y={20}>
            <p className="mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
              The premier interactive platform engineered to master Generative AI, Data Structures & Algorithms, and Autonomous Systems.
            </p>
          </FadeIn>

          <FadeIn delay={0.4} y={20}>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <SignUpPillButton onClick={openSignUpModal} label="Get Started Free" />
              <button
                onClick={() => {
                  document.getElementById('bootcamp-screen')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-950/40 hover:bg-blue-900/40 text-sky-200 px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer backdrop-blur-md"
              >
                <span>Student Registration</span>
                <ChevronDown className="w-4 h-4 text-sky-400" />
              </button>
            </div>
          </FadeIn>
        </div>

        {/* STUDENT REGISTRATION SECTION HEADER */}
        <div className="relative z-10 max-w-6xl mx-auto mt-16 mb-8 text-center">
          <FadeIn delay={0.1} y={20}>
            <h2
              style={{ fontSize: 'clamp(2.5rem, 9vw, 120px)' }}
              className="hero-heading font-black uppercase leading-none tracking-tight text-center font-sans"
            >
              Student Registration
            </h2>
          </FadeIn>
        </div>

        {/* INTERACTIVE COMMAND SCREEN WINDOW MOCKUP FOR 7-DAY BOOTCAMP */}
        <div id="bootcamp-screen" className="relative z-10 max-w-5xl mx-auto mt-8">
          <div className="rounded-3xl border-2 border-blue-500/40 bg-[#090d16]/95 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,102,255,0.25)] overflow-hidden">
            {/* Screen Mockup Top Bar */}
            <div className="px-5 py-3.5 bg-slate-950/90 border-b border-blue-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-3 text-xs font-mono font-bold text-slate-300 hidden sm:inline">
                  AI Fluence Screen • Student Registration (Stds 7–10)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  Admissions Active
                </span>
              </div>
            </div>

            {/* Inner Scrollable Screen Area - Student Registration Form */}
            <div className="max-h-[640px] overflow-y-auto p-6 sm:p-8 md:p-10 select-text">
                {/* Registration Form / Confirmed Receipt Area */}
                <div id="bootcamp-form-anchor" className="rounded-2xl bg-black/60 border border-blue-400/30 p-6 sm:p-8">
                  {bootcampSuccessId ? (
                    /* Confirmed Registration Receipt */
                    <div className="text-center py-6 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h4 className="text-2xl font-black text-white">Registration Confirmed!</h4>
                      <p className="text-sm text-slate-300 max-w-md mx-auto">
                        Welcome to AI Fluence. Your student registration pass ID is:
                      </p>
                      <div className="inline-block px-6 py-3 rounded-2xl bg-blue-950/90 border border-blue-400/60 text-xl font-mono font-bold text-sky-300 shadow-xl">
                        {bootcampSuccessId}
                      </div>
                      <p className="text-xs text-slate-400">
                        Student: <span className="font-bold text-white">{studentName}</span> • Standard: <span className="font-bold text-white">{standard}</span> • School: <span className="font-bold text-white">{schoolName}</span> • Institute: <span className="font-bold text-sky-300">{institute || 'Neetu Dance Academy'}</span>
                      </p>
                      <div className="pt-4 flex justify-center gap-3">
                        <button
                          onClick={() => window.print()}
                          className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition"
                        >
                          <Printer className="w-4 h-4" />
                          <span>Print Receipt</span>
                        </button>
                        <button
                          onClick={() => {
                            setBootcampSuccessId(null);
                          }}
                          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer transition"
                        >
                          Register Another Student
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Built-In Registration Form */
                    <form onSubmit={handleBootcampSubmit} className="space-y-4">
                      <div className="pb-3 border-b border-blue-400/20 flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-black text-white">Student Registration</h4>
                          <p className="text-xs text-slate-400">Complete student details for instant access.</p>
                        </div>
                        <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                          100% Free Pass
                        </span>
                      </div>

                      {bootcampError && (
                        <div className="bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs p-3.5 rounded-xl flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                          <span>{bootcampError}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                            Parent/Guardian Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Parent / Guardian Name"
                            value={parentName}
                            onChange={(e) => setParentName(e.target.value)}
                            className="w-full bg-black/60 border border-blue-400/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                            Parent Contact Number *
                          </label>
                          <div className="flex">
                            <span className="bg-black/80 border border-r-0 border-blue-400/30 rounded-l-xl px-3 py-2.5 text-xs text-slate-400 font-mono">+91</span>
                            <input
                              type="tel"
                              required
                              placeholder="9876543210"
                              value={parentContact}
                              onChange={(e) => setParentContact(e.target.value)}
                              className="w-full bg-black/60 border border-blue-400/30 rounded-r-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                            Student Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Student Name"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            className="w-full bg-black/60 border border-blue-400/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                            Student Phone (Optional)
                          </label>
                          <input
                            type="tel"
                            placeholder="Optional student phone"
                            value={studentContact}
                            onChange={(e) => setStudentContact(e.target.value)}
                            className="w-full bg-black/60 border border-blue-400/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                            School Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Enter School Name"
                            value={schoolName}
                            onChange={(e) => setSchoolName(e.target.value)}
                            className="w-full bg-black/60 border border-blue-400/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                            Current Standard/Class *
                          </label>
                          <select
                            value={standard}
                            onChange={(e) => setStandard(e.target.value)}
                            className="w-full bg-black/80 border border-blue-400/30 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-400 cursor-pointer"
                          >
                            <option value="Standard 7">Standard 7</option>
                            <option value="Standard 8">Standard 8</option>
                            <option value="Standard 9">Standard 9</option>
                            <option value="Standard 10">Standard 10</option>
                          </select>
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                              Institute / Academy *
                            </label>
                            <span className="text-[10px] font-mono text-sky-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                              Selected: <strong className="text-white">{institute || 'Neetu Dance Academy'}</strong>
                            </span>
                          </div>

                          {/* Searchable Institute Input */}
                          <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
                            <input
                              type="text"
                              placeholder="Search institute (e.g. Neetu Dance Academy)..."
                              value={instituteSearch}
                              onChange={(e) => {
                                setInstituteSearch(e.target.value);
                                setInstitute(e.target.value);
                              }}
                              className="w-full bg-black/70 border border-blue-400/40 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 font-medium"
                            />
                            {instituteSearch && (
                              <button
                                type="button"
                                onClick={() => {
                                  setInstituteSearch('');
                                  setInstitute('Neetu Dance Academy');
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Live Institute Badges */}
                          <div className="pt-1 flex flex-wrap gap-2 items-center">
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Institute:</span>
                            {CONFIG_INSTITUTES
                              .filter((inst) => inst.toLowerCase().includes((instituteSearch || '').toLowerCase()))
                              .map((inst) => {
                                const isSelected = institute === inst;
                                return (
                                  <button
                                    key={inst}
                                    type="button"
                                    onClick={() => {
                                      setInstitute(inst);
                                      setInstituteSearch(inst);
                                    }}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                                      isSelected
                                        ? 'bg-blue-600/30 border-blue-400 text-sky-200 shadow-[0_0_12px_rgba(0,102,255,0.3)]'
                                        : 'bg-black/60 border-blue-400/20 text-slate-300 hover:border-blue-400/50 hover:bg-blue-950/40'
                                    }`}
                                  >
                                    <Building className="w-3.5 h-3.5 text-sky-400" />
                                    <span>{inst}</span>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-sky-300 ml-1" />}
                                  </button>
                                );
                              })}
                          </div>
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                            Parent Email Address (Optional for receipt delivery)
                          </label>
                          <input
                            type="email"
                            placeholder="parent@domain.com"
                            value={parentEmail}
                            onChange={(e) => setParentEmail(e.target.value)}
                            className="w-full bg-black/60 border border-blue-400/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          id="bootcamp-screen-consent"
                          checked={consentConfirmed}
                          onChange={(e) => setConsentConfirmed(e.target.checked)}
                          className="mt-0.5 rounded border-white/20 bg-black/40 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <label htmlFor="bootcamp-screen-consent" className="text-xs text-slate-300 cursor-pointer leading-snug">
                          I confirm that the information provided above is accurate and that I am the parent/guardian registering this student.
                        </label>
                      </div>

                      {/* Submit Button styled identically to the "Get Started For Free" pill button */}
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={bootcampSubmitting}
                          style={{
                            background: 'linear-gradient(123deg, #020B1A 7%, #004BE8 37%, #0066FF 72%, #00D2FF 100%)',
                            boxShadow: '0px 4px 14px rgba(0, 102, 255, 0.4), 4px 4px 14px #0052FF inset',
                            outline: '2px solid white',
                            outlineOffset: '-3px',
                          }}
                          className="w-full rounded-full text-white font-extrabold uppercase tracking-widest py-4 px-8 text-xs sm:text-sm md:text-base cursor-pointer hover:scale-[1.01] active:scale-[0.98] transition-transform duration-200 shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 select-none font-sans"
                        >
                          <span>{bootcampSubmitting ? 'Registering Student...' : 'Confirm Bootcamp Registration'}</span>
                          <ArrowRight className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </form>
                  )}
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. NEWS / ARTICLES TICKER (CLEAN & BOLD HERO-HEADING FORMAT)
          ==================================================================== */}
      <section
        ref={marqueeSectionRef}
        id="news-articles"
        className="w-full bg-[#0C0C0C] pt-24 pb-20 overflow-hidden border-t border-b border-blue-500/20"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12 text-center">
          <h2
            style={{ fontSize: 'clamp(2.5rem, 9vw, 120px)' }}
            className="hero-heading font-black uppercase leading-none tracking-tight text-center font-sans"
          >
            How Artificial Intelligence is Changing the World
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {/* Row 1: Moves RIGHT on scroll (2-line film-review style) */}
          <div
            style={{
              transform: `translateX(${scrollOffset - 200}px)`,
              willChange: 'transform',
            }}
            className="flex gap-4"
          >
            {[...REVIEW_QUOTES_ROW_1, ...REVIEW_QUOTES_ROW_1, ...REVIEW_QUOTES_ROW_1].map((item, i) => (
              <div
                key={`quote-r1-${i}`}
                className="w-[340px] sm:w-[420px] shrink-0 rounded-2xl bg-[#0C0C0C] border-2 border-blue-500/25 p-5 backdrop-blur-md shadow-lg flex flex-col justify-between hover:border-blue-400/60 transition-colors"
              >
                <p className="text-xs sm:text-sm font-medium text-slate-100 leading-snug italic font-sans">
                  {item.quote}
                </p>
                <div className="pt-3 mt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-sky-400 font-bold">— {item.source}</span>
                  <span className="text-amber-400">★★★★★</span>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: Moves LEFT on scroll (2-line film-review style) */}
          <div
            style={{
              transform: `translateX(-${scrollOffset - 200}px)`,
              willChange: 'transform',
            }}
            className="flex gap-4"
          >
            {[...REVIEW_QUOTES_ROW_2, ...REVIEW_QUOTES_ROW_2, ...REVIEW_QUOTES_ROW_2].map((item, i) => (
              <div
                key={`quote-r2-${i}`}
                className="w-[340px] sm:w-[420px] shrink-0 rounded-2xl bg-[#0C0C0C] border-2 border-blue-500/25 p-5 backdrop-blur-md shadow-lg flex flex-col justify-between hover:border-blue-400/60 transition-colors"
              >
                <p className="text-xs sm:text-sm font-medium text-slate-100 leading-snug italic font-sans">
                  {item.quote}
                </p>
                <div className="pt-3 mt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-sky-400 font-bold">— {item.source}</span>
                  <span className="text-cyan-400 font-bold">Verified Research</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. ABOUT SECTION
          ==================================================================== */}
      <section
        id="about"
        className="relative min-h-screen w-full flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 bg-[#0C0C0C] overflow-hidden"
      >
        {/* 4 Corner 3D Decorative Badges */}
        <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] pointer-events-none z-0">
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
            alt="3D Moon Emblem"
            className="w-[120px] sm:w-[160px] md:w-[200px] h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          />
        </FadeIn>

        <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] pointer-events-none z-0">
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
            alt="3D Abstract Object"
            className="w-[100px] sm:w-[140px] md:w-[170px] h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          />
        </FadeIn>

        <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] pointer-events-none z-0">
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
            alt="3D Lego Badge"
            className="w-[120px] sm:w-[160px] md:w-[200px] h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          />
        </FadeIn>

        <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] pointer-events-none z-0">
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
            alt="3D Group Object"
            className="w-[130px] sm:w-[170px] md:w-[210px] h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          />
        </FadeIn>

        {/* Center Content */}
        <div className="relative z-10 flex flex-col items-center text-center gap-10 sm:gap-14 md:gap-16 max-w-4xl">
          <FadeIn delay={0} y={40}>
            <h2
              style={{ fontSize: 'clamp(2.5rem, 10vw, 140px)' }}
              className="hero-heading font-black uppercase leading-none tracking-tight text-center font-sans"
            >
              About AI Fluence
            </h2>
          </FadeIn>

          <AnimatedText
            text="AI Fluence is the premier interactive learning platform engineered to master Generative AI, Data Structures & Algorithms, and AI for Everyone. Designed for modern builders, students, and engineers to learn, play, and build the future of intelligence. Let's build something incredible together!"
            className="text-[#D7E2EA] font-semibold text-center leading-relaxed max-w-[620px] px-4 text-base sm:text-lg md:text-xl font-sans"
          />

          <div className="pt-6 sm:pt-10">
            <FadeIn delay={0.3} y={20}>
              <SignUpPillButton onClick={openSignUpModal} label="Sign Up" />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. SERVICES SECTION: "What is AI Fluence"
          ==================================================================== */}
      <section
        id="what-is-aifluence"
        className="relative w-full bg-[#FFFFFF] text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 z-0 font-sans"
      >
        <div className="max-w-5xl mx-auto">
          <FadeIn delay={0} y={30}>
            <h2
              style={{ fontSize: 'clamp(2.5rem, 9vw, 130px)' }}
              className="font-black uppercase text-center text-[#0C0C0C] leading-none mb-16 sm:mb-20 md:mb-28 tracking-tight font-sans"
            >
              What is AI Fluence
            </h2>
          </FadeIn>

          <div className="divide-y divide-[#0C0C0C]/15 border-t border-b border-[#0C0C0C]/15">
            {AI_FLUENCE_PURPOSE.map((item, i) => (
              <FadeIn key={item.num} delay={i * 0.1} y={25}>
                <div className="py-8 sm:py-10 md:py-12 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-12 group hover:pl-3 transition-all duration-300">
                  <div
                    style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
                    className="font-black text-blue-600 leading-none tracking-tighter shrink-0 select-none font-sans"
                  >
                    {item.num}
                  </div>

                  <div className="flex-1 flex flex-col gap-2">
                    <h3
                      style={{ fontSize: 'clamp(1.1rem, 2.2vw, 2.1rem)' }}
                      className="font-extrabold uppercase text-[#0C0C0C] tracking-wide font-sans"
                    >
                      {item.name}
                    </h3>
                    <p
                      style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
                      className="font-medium leading-relaxed max-w-2xl text-[#0C0C0C] opacity-75 font-sans"
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. PROJECTS SECTION: "Features in AI Fluence"
          (1 image per screen matching its specific feature)
          ==================================================================== */}
      <section
        id="features"
        className="relative w-full bg-[#0C0C0C] text-[#D7E2EA] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 pt-20 sm:pt-24 md:pt-28 pb-32 z-10 px-4 sm:px-6 md:px-10 font-sans"
      >
        <div className="max-w-6xl mx-auto">
          <FadeIn delay={0} y={30}>
            <div className="text-center mb-16 sm:mb-20 md:mb-24">
              <h2
                style={{ fontSize: 'clamp(2.5rem, 9vw, 130px)' }}
                className="hero-heading font-black uppercase leading-none tracking-tight font-sans"
              >
                Features in AI Fluence
              </h2>
            </div>
          </FadeIn>

          <div className="relative flex flex-col gap-12 sm:gap-16 pb-12">
            {AI_FLUENCE_FEATURES.map((feature, index) => (
              <FeatureCard
                key={feature.num}
                feature={feature}
                index={index}
                totalCards={AI_FLUENCE_FEATURES.length}
                onActionClick={openSignUpModal}
              />
            ))}
          </div>
        </div>

        {/* Footer info & CTA */}
        <div className="mt-24 text-center max-w-xl mx-auto space-y-6">
          <p className="text-xs uppercase tracking-widest text-sky-400 font-bold">
            Ready to master Data Structures & Generative AI?
          </p>
          <SignUpPillButton onClick={openSignUpModal} label="Sign Up" />
          <div className="pt-12 text-[11px] text-[#D7E2EA]/35 uppercase tracking-widest font-mono">
            AI Fluence • Algorithmic Engineering & AI Training Suite
          </div>
        </div>
      </section>

      {/* ====================================================================
          AUTHENTICATION MODAL WITH LANDING PAGE THEME
          ==================================================================== */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200 font-sans select-none">
          <div className="relative w-full max-w-xl bg-[#0C0C0C] border-2 border-blue-500/40 shadow-[0_0_80px_rgba(0,102,255,0.4)] rounded-[32px] p-6 sm:p-8 space-y-6 text-white overflow-hidden max-h-[92vh] overflow-y-auto">
            {/* Top ambient blue glow inside modal */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-40 bg-gradient-to-b from-blue-600/20 to-transparent pointer-events-none" />

            {/* Close button */}
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white hover:bg-blue-600 transition cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Brand Header */}
            <div className="text-center pt-2 space-y-1 relative z-10">
              <div className="flex items-center justify-center gap-2 mb-1">
                <AIFluenceLogo height={32} variant="blue" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {authMode === 'signup' ? (
                  <span>
                    Sign Up for <span style={{ fontFamily: "'Lobster', cursive" }} className="bg-gradient-to-r from-blue-400 via-sky-200 to-cyan-400 bg-clip-text text-transparent font-normal">AI Fluence</span>
                  </span>
                ) : (
                  <span>
                    Sign In to <span style={{ fontFamily: "'Lobster', cursive" }} className="bg-gradient-to-r from-blue-400 via-sky-200 to-cyan-400 bg-clip-text text-transparent font-normal">AI Fluence</span>
                  </span>
                )}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed font-medium">
                {authMode === 'signup'
                  ? 'Create your scholar account to unlock verified learning tracks and daily challenges.'
                  : 'Welcome back! Access your dashboard, maintain your daily streak, and continue learning.'}
              </p>
            </div>

            {/* Header Mode Switcher Tabs */}
            <div className="flex items-center justify-center bg-slate-950 border border-blue-500/30 p-1 rounded-2xl max-w-xs mx-auto relative z-10">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition duration-200 cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition duration-200 cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Feedback messages */}
            {errorMsg && (
              <div className="bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs p-3.5 rounded-2xl flex items-start gap-2.5 relative z-10">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span className="font-semibold">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-blue-500/20 border border-blue-500/40 text-blue-200 text-xs p-3.5 rounded-2xl flex items-start gap-2.5 relative z-10">
                <Check className="w-4 h-4 shrink-0 text-blue-400 mt-0.5" />
                <span className="font-semibold">{successMsg}</span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4 relative z-10">
              {authMode === 'signup' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-sky-300 uppercase tracking-wider">
                      Display Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                      <input
                        type="text"
                        placeholder="e.g. Alex Rivera"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full bg-black/60 border border-blue-500/30 focus:border-blue-400 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-medium"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-sky-300 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/60 border border-blue-500/30 focus:border-blue-400 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-sky-300 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/60 border border-blue-500/30 focus:border-blue-400 rounded-2xl pl-11 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* ELECTRIC BLUE TO CYAN PILL SUBMIT BUTTON */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    background: 'linear-gradient(123deg, #020B1A 7%, #004BE8 37%, #0066FF 72%, #00D2FF 100%)',
                    boxShadow: '0px 4px 14px rgba(0, 102, 255, 0.4), 4px 4px 14px #0052FF inset',
                    outline: '2px solid white',
                    outlineOffset: '-3px',
                  }}
                  className="w-full py-4 rounded-full text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 select-none shadow-2xl"
                >
                  <span>
                    {isLoading
                      ? 'Authenticating...'
                      : authMode === 'signup'
                      ? 'Create Account'
                      : 'Sign In'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="flex items-center my-2 relative z-10">
              <div className="flex-1 border-t border-blue-500/20" />
              <span className="px-3 text-slate-400 text-[10px] uppercase tracking-widest font-extrabold">Or</span>
              <div className="flex-1 border-t border-blue-500/20" />
            </div>

            {/* Google Authentication */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-3.5 bg-slate-950/80 hover:bg-blue-600/20 border border-blue-400/40 text-white font-extrabold rounded-2xl flex items-center justify-center gap-3 text-sm transition cursor-pointer relative z-10 shadow-md"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.66-.66-1.18-1.42-1.35-2.09z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.31l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
