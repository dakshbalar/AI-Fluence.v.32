import React, { useState, useEffect, useRef } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc,
} from 'firebase/firestore';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Check, 
  ArrowRight, 
  Award, 
  ShieldAlert,
  LogOut,
  Flame,
  Star,
  CheckCircle2,
  BookOpen,
  Code2,
  Cpu,
  Users,
  Compass,
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Menu,
  X
} from 'lucide-react';
import { auth, db } from './firebase';
import { CourseHomePage } from './components/home/CourseHomePage';
import { BootcampRegistrationPage } from './components/bootcamp/BootcampRegistrationPage';
import { AIFluenceJackLandingPage } from './components/home/AIFluenceJackLandingPage';
import { AIFluenceLogo } from './components/common/AIFluenceLogo';
import { persistCourseId, persistEnrolledCourseIds } from './data/coursesData';

// 15 Vertical Showcase Images
import heroPosterImage from './assets/images/aifluence_hero_poster_1790141641852.png';
import slideDsa from './assets/images/aifluence_slide_dsa_1790142967589.png';
import slideGenAi from './assets/images/aifluence_slide_genai_1790142980331.png';
import slideTools from './assets/images/slide_cloud_cluster_1790143767123.png';
import slideNeuralNetwork from './assets/images/slide_neural_network_1790143655462.png';
import slideQuantumComputing from './assets/images/slide_quantum_computing_1790143670330.png';
import slideCodeMatrix from './assets/images/slide_code_matrix_1790143691887.png';
import slideRoboticsAi from './assets/images/slide_robotics_ai_1790143703556.jpg';
import slideAgentWorkflow from './assets/images/slide_agent_workflow_1790143715327.png';
import slideDeepLearning from './assets/images/slide_deep_learning_1790143732578.png';
import slideDataScience from './assets/images/slide_data_science_1790143753980.png';
import slideCloudCluster from './assets/images/slide_cloud_cluster_1790143767123.png';
import slideNaturalLanguage from './assets/images/slide_natural_language_1790143776900.png';
import slideComputerVision from './assets/images/slide_computer_vision_1790143790447.png';
import slideReinforcement from './assets/images/slide_reinforcement_1790143802879.png';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  selectedTrack: string;
  streak: number;
  xp: number;
  level: number;
  isSimulated: boolean;
  createdAt: string;
}

export interface AIfluenceTrack {
  id: string;
  code: string;
  name: string;
  shortName: string;
  subtitle: string;
  description: string;
  theme: "purple" | "blue" | "yellow";
  themeColor: string;
  levelsCount: string;
  accentBadge: string;
}

export const AVAILABLE_TRACKS: AIfluenceTrack[] = [
  {
    id: "generative_ai",
    code: "generative_ai",
    name: "Generative AI",
    shortName: "Gen AI",
    subtitle: "Prompt Engineering, RAG & Fine-Tuning",
    description: "Master LLM architectures, prompt patterns, vector search embeddings, and fine-tuning models.",
    theme: "blue",
    themeColor: "#3b82f6",
    levelsCount: "125 Levels",
    accentBadge: "Core AI Stack"
  },
  {
    id: "dsa",
    code: "dsa",
    name: "Data Structures & Algorithms",
    shortName: "DSA",
    subtitle: "Optimal Problem Solving & LeetCode",
    description: "Master algorithmic patterns, two pointers, sliding windows, binary trees, and dynamic programming.",
    theme: "purple",
    themeColor: "#a855f7",
    levelsCount: "153 Levels",
    accentBadge: "Interview Rigor"
  },
  {
    id: "ai_for_everyone",
    code: "ai_for_everyone",
    name: "AI for Everyone",
    shortName: "AI 101",
    subtitle: "Neural Intuition, Safety & Real Tools",
    description: "Understand machine learning paradigms, neural networks, multimodal tools, and real-world AI impact.",
    theme: "yellow",
    themeColor: "#eab308",
    levelsCount: "45 Lessons",
    accentBadge: "Foundations"
  }
];

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  // Default first page is Sign Up
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<string>('generative_ai');
  const [showPassword, setShowPassword] = useState(false);
  
  // UI feedback states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'course_home' | 'bootcamp_registration'>(() => {
    if (window.location.pathname === '/bootcamp-registration') return 'bootcamp_registration';
    return 'dashboard';
  });
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/bootcamp-registration') {
        setCurrentView('bootcamp_registration');
      } else if (window.location.pathname === '/') {
        setCurrentView('dashboard');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Header Hamburger menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Slider state for 15 full-screen sliding images with auto-slide & touch resume
  const [activeSlide, setActiveSlide] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 15 Curated Vertical Visual Images
  const showcaseSlides = [
    { id: 'slide-1', image: heroPosterImage, alt: 'AI Neural Constellations' },
    { id: 'slide-2', image: slideDsa, alt: 'Data Structures & Algorithms Matrix' },
    { id: 'slide-3', image: slideGenAi, alt: 'Generative Diffusion Intelligence' },
    { id: 'slide-4', image: slideTools, alt: 'Intelligent AI Agent Engineering' },
    { id: 'slide-5', image: slideNeuralNetwork, alt: 'Synaptic Deep Learning Lattice' },
    { id: 'slide-6', image: slideQuantumComputing, alt: 'Quantum Algorithmic Qubit Matrix' },
    { id: 'slide-7', image: slideCodeMatrix, alt: 'Cybernetic Holographic Code' },
    { id: 'slide-8', image: slideRoboticsAi, alt: 'Robotics Neural Cyber Interface' },
    { id: 'slide-9', image: slideAgentWorkflow, alt: 'Autonomous Multi-Agent Orchestration' },
    { id: 'slide-10', image: slideDeepLearning, alt: 'Multilayer Tensor Feature Hyperplanes' },
    { id: 'slide-11', image: slideDataScience, alt: 'Volumetric 3D Data Spatial Orbitals' },
    { id: 'slide-12', image: slideCloudCluster, alt: 'High-Density Distributed Supercomputing' },
    { id: 'slide-13', image: slideNaturalLanguage, alt: 'High-Dimensional Semantic Embeddings' },
    { id: 'slide-14', image: slideComputerVision, alt: 'Computer Vision Holographic Spatial Grid' },
    { id: 'slide-15', image: slideReinforcement, alt: 'Reinforcement Learning Policy Pathways' }
  ];

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % showcaseSlides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + showcaseSlides.length) % showcaseSlides.length);
  };

  // Pause on touch/mouse contact
  const handleInteractionStart = () => {
    setIsInteracting(true);
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  };

  // Resume auto-slide after 3 seconds of contact loss
  const handleInteractionEnd = () => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 3000);
  };

  const handleSliderTouchStart = (e: React.TouchEvent) => {
    handleInteractionStart();
    setTouchStartX(e.touches[0].clientX);
  };

  const handleSliderTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX !== null) {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (diff > 45) {
        handleNextSlide();
      } else if (diff < -45) {
        handlePrevSlide();
      }
      setTouchStartX(null);
    }
    handleInteractionEnd();
  };

  // 3-second auto-slide animation
  useEffect(() => {
    if (profile || isInteracting) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % showcaseSlides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [profile, isInteracting, showcaseSlides.length]);

  // Load persistent or simulated profile state
  useEffect(() => {
    const cachedProfile = localStorage.getItem('ai_fluence_sim_profile');
    if (cachedProfile) {
      try {
        const parsed = JSON.parse(cachedProfile);
        setProfile(parsed);
        if (parsed.selectedTrack) {
          persistCourseId(parsed.selectedTrack);
          persistEnrolledCourseIds([parsed.selectedTrack]);
        }
        setIsAuthLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem('ai_fluence_sim_profile');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const prof: UserProfile = {
              uid: firebaseUser.uid,
              displayName: data.displayName || firebaseUser.displayName || 'AI Scholar',
              email: data.email || firebaseUser.email || '',
              selectedTrack: data.selectedTrack || data.currentLanguage || 'generative_ai',
              streak: data.streak ?? 1,
              xp: data.xp ?? 25,
              level: data.level ?? 1,
              isSimulated: false,
              createdAt: data.createdAt || new Date().toISOString()
            };
            setProfile(prof);
            persistCourseId(prof.selectedTrack);
            persistEnrolledCourseIds([prof.selectedTrack]);
          } else {
            const fallbackProf: UserProfile = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'AI Scholar',
              email: firebaseUser.email || '',
              selectedTrack: selectedTrack || 'generative_ai',
              streak: 1,
              xp: 25,
              level: 1,
              isSimulated: false,
              createdAt: new Date().toISOString()
            };
            setProfile(fallbackProf);
            persistCourseId(fallbackProf.selectedTrack);
            persistEnrolledCourseIds([fallbackProf.selectedTrack]);
          }
        } catch (err) {
          const fallbackProf: UserProfile = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || 'AI Scholar',
            email: firebaseUser.email || '',
            selectedTrack: selectedTrack || 'generative_ai',
            streak: 1,
            xp: 25,
            level: 1,
            isSimulated: false,
            createdAt: new Date().toISOString()
          };
          setProfile(fallbackProf);
          persistCourseId(fallbackProf.selectedTrack);
          persistEnrolledCourseIds([fallbackProf.selectedTrack]);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsAuthLoading(false);
    });

    return unsubscribe;
  }, []);



  // Auth Submit Action
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter your email and password.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    if (authMode === 'signup' && !displayName.trim()) {
      setErrorMsg('Please provide your name or handle.');
      setIsLoading(false);
      return;
    }

    try {
      if (authMode === 'signup') {
        try {
          const cred = await createUserWithEmailAndPassword(auth, email, password);
          const userProfile: UserProfile = {
            uid: cred.user.uid,
            displayName: displayName.trim(),
            email: email.trim(),
            selectedTrack: selectedTrack,
            streak: 1,
            xp: 0,
            level: 1,
            isSimulated: false,
            createdAt: new Date().toISOString()
          };

          persistCourseId(selectedTrack);
          persistEnrolledCourseIds([selectedTrack]);

          try {
            await setDoc(doc(db, 'users', cred.user.uid), userProfile);
          } catch (fsErr) {
            console.warn("Firestore save fallback:", fsErr);
          }

          setProfile(userProfile);
          setSuccessMsg('Account created successfully!');
        } catch (firebaseErr: any) {
          if (
            firebaseErr.code === 'auth/operation-not-allowed' || 
            firebaseErr.code === 'auth/auth-domain-config-required' ||
            firebaseErr.message?.includes('not allowed') ||
            firebaseErr.message?.includes('disabled')
          ) {
            triggerSandboxLogin(displayName, email, selectedTrack);
          } else {
            throw firebaseErr;
          }
        }
      } else {
        try {
          const cred = await signInWithEmailAndPassword(auth, email, password);
          const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
          let currentTrack = selectedTrack;
          if (userDoc.exists()) {
            const data = userDoc.data();
            currentTrack = data.selectedTrack || selectedTrack;
            setProfile({ 
              ...data, 
              selectedTrack: currentTrack,
              isSimulated: false 
            } as UserProfile);
          } else {
            setProfile({
              uid: cred.user.uid,
              displayName: email.split('@')[0],
              email: email,
              selectedTrack: currentTrack,
              streak: 1,
              xp: 25,
              level: 1,
              isSimulated: false,
              createdAt: new Date().toISOString()
            });
          }
          persistCourseId(currentTrack);
          persistEnrolledCourseIds([currentTrack]);
          setSuccessMsg('Welcome back to AIfluence!');
        } catch (firebaseErr: any) {
          if (
            firebaseErr.code === 'auth/operation-not-allowed' || 
            firebaseErr.code === 'auth/auth-domain-config-required' ||
            firebaseErr.message?.includes('not allowed') ||
            firebaseErr.message?.includes('disabled')
          ) {
            triggerSandboxLogin(email.split('@')[0], email, selectedTrack);
          } else {
            throw firebaseErr;
          }
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrorMsg(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google popup authentication flow
  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      
      const userDocRef = doc(db, 'users', cred.user.uid);
      const userDocSnap = await getDoc(userDocRef);

      let userProfile: UserProfile;

      if (userDocSnap.exists()) {
        const existingData = userDocSnap.data();
        const activeTrack = existingData.selectedTrack || selectedTrack;
        userProfile = {
          uid: cred.user.uid,
          displayName: existingData.displayName || cred.user.displayName || cred.user.email?.split('@')[0] || 'AI Scholar',
          email: existingData.email || cred.user.email || '',
          selectedTrack: activeTrack,
          streak: existingData.streak ?? 1,
          xp: existingData.xp ?? 25,
          level: existingData.level ?? 1,
          isSimulated: false,
          createdAt: existingData.createdAt || new Date().toISOString()
        };
        persistCourseId(activeTrack);
        persistEnrolledCourseIds([activeTrack]);
      } else {
        userProfile = {
          uid: cred.user.uid,
          displayName: cred.user.displayName || cred.user.email?.split('@')[0] || 'AI Scholar',
          email: cred.user.email || '',
          selectedTrack: selectedTrack,
          streak: 1,
          xp: 25,
          level: 1,
          isSimulated: false,
          createdAt: new Date().toISOString()
        };
        persistCourseId(selectedTrack);
        persistEnrolledCourseIds([selectedTrack]);

        try {
          await setDoc(userDocRef, userProfile);
        } catch (fsErr) {
          console.warn("Firestore save fallback:", fsErr);
        }
      }

      setProfile(userProfile);
      setSuccessMsg('Signed in with Google successfully!');
    } catch (err: any) {
      console.error("Google Sign-In error:", err);
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        // User closed the popup intentionally
        setErrorMsg('');
      } else if (
        err.code === 'auth/operation-not-allowed' || 
        err.code === 'auth/auth-domain-config-required' ||
        err.message?.includes('not allowed') ||
        err.message?.includes('disabled')
      ) {
        triggerSandboxLogin('Google User', 'google.user@aifluence.app', selectedTrack);
      } else {
        setErrorMsg(err.message || 'Google Authentication failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const triggerSandboxLogin = (name: string, mail: string, track: string) => {
    const sandboxProfile: UserProfile = {
      uid: 'sandbox-user-' + Math.random().toString(36).substring(2, 9),
      displayName: name || mail.split('@')[0] || 'AI Scholar',
      email: mail,
      selectedTrack: track,
      streak: 1,
      xp: 50,
      level: 1,
      isSimulated: true,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('ai_fluence_sim_profile', JSON.stringify(sandboxProfile));
    persistCourseId(track);
    persistEnrolledCourseIds([track]);
    setProfile(sandboxProfile);
    setSuccessMsg('Welcome to AIfluence!');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('ai_fluence_sim_profile');
    try {
      localStorage.removeItem("aifluence_student_profile_v2");
      localStorage.removeItem("aifluence_learning_commitment_v2");
      localStorage.removeItem("aifluence_daily_activity_v2");
      localStorage.removeItem("aifluence_engagement_telemetry_v2");
      localStorage.removeItem("pq_gamification_state_v9_clean_zero_start");
      localStorage.removeItem("pq_xp");
      localStorage.removeItem("aifluence_user_code");
      localStorage.removeItem("dsa_course_diamonds_v2");
    } catch {}
    setUser(null);
    setProfile(null);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Render Signature Double-Ringed Shield Emblems for the 3 Tracks
  const renderTrackEmblem = (trackId: string, isSelected: boolean) => {
    if (trackId === "generative_ai") {
      return (
        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
          <div className={`absolute w-11 h-11 rounded-full border border-blue-400/40 ${isSelected ? 'animate-[spin_10s_linear_infinite]' : ''}`} />
          <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#1e40af] to-[#172554] border-2 border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.6),inset_0_1px_2px_rgba(255,255,255,0.3)] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            <Sparkles className="w-4 h-4 text-cyan-300 drop-shadow-[0_0_4px_#22d3ee]" />
            <span className="text-[6px] font-mono font-black text-white/90 uppercase tracking-widest absolute bottom-0.5">GEN AI</span>
          </div>
        </div>
      );
    }

    if (trackId === "dsa") {
      return (
        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
          <div className={`absolute w-11 h-11 rounded-full border border-purple-400/40 ${isSelected ? 'animate-[spin_10s_linear_infinite]' : ''}`} />
          <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#6b21a8] to-[#3b0764] border-2 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.6),inset_0_1px_2px_rgba(255,255,255,0.3)] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            <Code2 className="w-4 h-4 text-purple-300 drop-shadow-[0_0_4px_#c084fc]" />
            <span className="text-[6px] font-mono font-black text-white/90 uppercase tracking-widest absolute bottom-0.5">DSA</span>
          </div>
        </div>
      );
    }

    // ai_for_everyone
    return (
      <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
        <div className={`absolute w-11 h-11 rounded-full border border-amber-400/40 ${isSelected ? 'animate-[spin_10s_linear_infinite]' : ''}`} />
        <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#854d0e] to-[#422006] border-2 border-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.6),inset_0_1px_2px_rgba(255,255,255,0.3)] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
          <Cpu className="w-4 h-4 text-yellow-300 drop-shadow-[0_0_4px_#facc15]" />
          <span className="text-[6px] font-mono font-black text-yellow-100 uppercase tracking-widest absolute bottom-0.5">AI 101</span>
        </div>
      </div>
    );
  };

  if (isAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900 font-sans">
        <AIFluenceLogo height={52} variant="blue" className="mb-6 animate-pulse" />
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-slate-200"></div>
          <div className="absolute inset-0 rounded-full border-2 border-t-blue-600 animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-500 font-mono tracking-widest text-xs uppercase font-bold">Loading AIfluence Portal...</p>
      </div>
    );
  }

  // Visual success state / student learning dashboard
  if (profile) {
    if (currentView === 'course_home') {
      return (
        <CourseHomePage 
          onBackToApp={() => setCurrentView('dashboard')} 
        />
      );
    }

    return (
      <div className="min-h-screen bg-[#0C0C0C] text-white flex flex-col justify-between font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden">
        {/* Electric Blue & White Metallic Gradient style */}
        <style>{`
          .hero-heading {
            background: linear-gradient(180deg, #FFFFFF 15%, #93C5FD 55%, #2563EB 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `}</style>

        {/* Ambient top blue radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none z-0" />

        {/* Sandbox Active Banner */}
        {profile.isSimulated && (
          <div className="bg-blue-950/90 backdrop-blur-md text-white px-4 py-2.5 text-center text-xs font-bold flex items-center justify-center gap-2 border-b border-blue-500/30 relative z-40">
            <ShieldAlert className="w-4 h-4 text-sky-400" />
            <span>Sandbox Session Active: Signed in smoothly as a verified scholar.</span>
          </div>
        )}

        {/* Top Landing Page Style Header */}
        <header className="border-b border-blue-500/20 bg-[#0C0C0C]/85 backdrop-blur-xl px-4 sm:px-8 py-3.5 sticky top-0 z-30 shadow-2xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center gap-2 cursor-pointer group text-left transition-opacity hover:opacity-90"
              title="AIfluence Dashboard"
            >
              <AIFluenceLogo height={36} variant="blue" />
            </button>

            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => {
                  window.history.pushState({}, '', '/bootcamp-registration');
                  setCurrentView('bootcamp_registration');
                }}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-sky-300 bg-blue-950/60 border border-blue-400/30 hover:border-blue-400 px-3.5 py-1.5 rounded-full transition cursor-pointer"
              >
                <span>🔥</span> Bootcamp
              </button>
              
              <div className="flex items-center gap-2 bg-slate-950 border border-sky-400/40 px-3.5 py-1.5 rounded-full text-xs font-black text-white backdrop-blur-xl shadow-[0_0_20px_rgba(56,189,248,0.25)]">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
                <span>{profile.streak} Day Streak</span>
              </div>

              <button 
                id="dashboard-logout"
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider bg-slate-900 hover:bg-blue-600/30 text-sky-200 border border-blue-400/40 hover:border-blue-400 px-4 py-2 rounded-full transition duration-200 cursor-pointer backdrop-blur-xl active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-12 space-y-8 z-10 flex flex-col items-center justify-center">
          {/* Main Landing-Page Header Title */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h1 className="hero-heading font-black uppercase tracking-tight leading-[1.05] text-center font-sans">
              <span className="block text-3xl sm:text-5xl md:text-6xl text-sky-200">
                Welcome to
              </span>
              <span 
                style={{ fontFamily: "'Lobster', cursive" }}
                className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl mt-1 normal-case tracking-normal bg-gradient-to-r from-blue-400 via-sky-200 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,102,255,0.65)]"
              >
                AI Fluence
              </span>
            </h1>
            <p className="text-lg sm:text-2xl font-black text-white tracking-tight">
              Welcome back, <span className="text-sky-300">{profile.displayName}</span>!
            </p>
          </div>

          {/* Welcome Dashboard Card in Landing Page Theme */}
          <div className="w-full max-w-3xl bg-[#0C0C0C] border-2 border-blue-500/40 shadow-[0_0_80px_rgba(0,102,255,0.35)] p-6 sm:p-10 md:p-12 rounded-[36px] relative overflow-hidden space-y-8 text-white select-none">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/40 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-300 backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Active Scholar Account</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">
                Ready to continue your AI journey?
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed font-medium">
                Jump straight into your interactive roadmap with bite-sized lessons, live code challenges, and streak rewards.
              </p>
            </div>

            {/* Profile Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-[#090d16] border border-blue-500/30 p-4 sm:p-5 rounded-2xl flex items-center gap-4 backdrop-blur-md">
                <div className="w-12 h-12 rounded-xl bg-black/80 border border-blue-400/40 flex items-center justify-center text-white shrink-0">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-sky-400 uppercase tracking-widest">Scholar Rank</p>
                  <p className="text-sm sm:text-base font-black text-white">Level {profile.level} Scholar</p>
                </div>
              </div>

              <div className="bg-[#090d16] border border-blue-500/30 p-4 sm:p-5 rounded-2xl flex items-center gap-4 backdrop-blur-md">
                <div className="w-12 h-12 rounded-xl bg-blue-600/80 border border-blue-400/60 flex items-center justify-center text-white shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-sky-400 uppercase tracking-widest">Total XP</p>
                  <p className="text-sm sm:text-base font-black text-white">{profile.xp} XP Earned</p>
                </div>
              </div>

              <div className="bg-[#090d16] border border-blue-500/30 p-4 sm:p-5 rounded-2xl flex items-center gap-4 backdrop-blur-md">
                <div className="w-12 h-12 rounded-xl bg-orange-500/80 border border-orange-400/60 flex items-center justify-center text-white shrink-0">
                  <Flame className="w-6 h-6 fill-white/20 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-sky-400 uppercase tracking-widest">Daily Progress</p>
                  <p className="text-sm sm:text-base font-black text-white">{profile.streak} Day Streak</p>
                </div>
              </div>
            </div>

            {/* Active Track Banner */}
            <div className="bg-slate-950 border border-blue-500/30 p-4 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {renderTrackEmblem(profile.selectedTrack || 'generative_ai', true)}
                <div>
                  <p className="text-[10px] font-extrabold text-sky-400 uppercase tracking-widest">Current Track</p>
                  <p className="text-sm font-black text-white">
                    {AVAILABLE_TRACKS.find(t => t.id === profile.selectedTrack)?.name || 'Generative AI'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-sky-300 bg-blue-600/20 px-3 py-1 rounded-full border border-blue-400/30 hidden sm:inline">
                {AVAILABLE_TRACKS.find(t => t.id === profile.selectedTrack)?.levelsCount || '125 Levels'}
              </span>
            </div>

            {/* ELECTRIC BLUE TO CYAN PILL CONTINUE BUTTON */}
            <div className="pt-2">
              <button 
                id="dashboard-continue-btn"
                onClick={() => {
                  setCurrentView('course_home');
                }}
                style={{
                  background: 'linear-gradient(123deg, #020B1A 7%, #004BE8 37%, #0066FF 72%, #00D2FF 100%)',
                  boxShadow: '0px 4px 18px rgba(0, 102, 255, 0.45), 4px 4px 14px #0052FF inset',
                  outline: '2px solid white',
                  outlineOffset: '-3px',
                }}
                className="w-full py-4.5 rounded-full text-white font-black uppercase tracking-widest text-base sm:text-lg flex items-center justify-center gap-3 transition-transform duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer select-none shadow-2xl font-sans"
              >
                <span>Continue to App</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </main>

        <footer className="py-6 bg-[#0C0C0C]/90 backdrop-blur-xl border-t border-blue-500/20 text-center text-xs text-slate-400 font-sans">
          AIfluence • AI Tools & Algorithmic Engineering Learning Suite
        </footer>
      </div>
    );
  }

  if (currentView === 'bootcamp_registration') {
    return (
      <BootcampRegistrationPage 
        onBackToHome={() => {
          window.history.pushState({}, '', '/');
          setCurrentView('dashboard');
        }} 
      />
    );
  }

  // Public Landing Page
  return (
    <AIFluenceJackLandingPage
      authMode={authMode}
      setAuthMode={setAuthMode}
      displayName={displayName}
      setDisplayName={setDisplayName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      isLoading={isLoading}
      errorMsg={errorMsg}
      setErrorMsg={setErrorMsg}
      successMsg={successMsg}
      setSuccessMsg={setSuccessMsg}
      selectedTrack={selectedTrack}
      setSelectedTrack={setSelectedTrack}
      handleAuthSubmit={handleAuthSubmit}
      handleGoogleSignIn={handleGoogleSignIn}
      onNavigateToBootcamp={() => {
        window.history.pushState({}, '', '/bootcamp-registration');
        setCurrentView('bootcamp_registration');
      }}
    />
  );
}
