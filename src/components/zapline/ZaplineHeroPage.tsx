import React, { useEffect, useRef, useState } from 'react';
import { 
  Zap, 
  Settings, 
  Search, 
  LayoutDashboard, 
  Crosshair, 
  LogOut, 
  Wallet, 
  Share2, 
  Sliders, 
  Sparkles, 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  Activity,
  ChevronRight,
  Menu,
  X,
  ArrowLeft
} from 'lucide-react';

interface ZaplineHeroPageProps {
  onBackToHome?: () => void;
}

export const ZaplineHeroPage: React.FC<ZaplineHeroPageProps> = ({ onBackToHome }) => {
  const [scale, setScale] = useState(1);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'snipes' | 'wallets'>('dashboard');

  const starCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fallbackCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Responsive scaling based on 1672 x 941 design frame
  useEffect(() => {
    const handleResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (vw >= 900) {
        const s = Math.min(vw / 1672, vh / 941);
        setScale(s);
      } else {
        setScale(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Procedural white stars canvas (Sky layer - static, no animated code per rule: "nothing in the sky is animated in code. Only the video moves it.")
  useEffect(() => {
    const canvas = starCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1672;
    const height = 941;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    // Procedural starry background
    const starCount = 280;
    // Seeded random pseudo-generator for consistent aesthetic distribution
    let seed = 42;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let i = 0; i < starCount; i++) {
      const x = rnd() * width;
      const y = rnd() * height;
      const radius = rnd() < 0.85 ? rnd() * 0.9 + 0.3 : rnd() * 1.6 + 0.8;
      const alpha = rnd() * 0.75 + 0.25;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
      ctx.fill();

      // Subtle warm/violet tint on a few stars
      if (i % 7 === 0) {
        ctx.beginPath();
        ctx.arc(x, y, radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160, 32, 255, ${(alpha * 0.25).toFixed(2)})`;
        ctx.fill();
      }
    }
  }, []);

  // Polar gradient fallback for the planet rim (phones / pre-video load)
  useEffect(() => {
    const canvas = fallbackCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1672;
    const height = 717;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    // Arc planet rim centered at x = 836, y = -140
    const centerX = width / 2;
    const centerY = -180;
    const rimRadius = 540;

    // Outer soft violet atmospheric haze
    const hazeGrad = ctx.createRadialGradient(centerX, centerY, rimRadius - 80, centerX, centerY, rimRadius + 240);
    hazeGrad.addColorStop(0, 'rgba(147, 18, 255, 0.45)');
    hazeGrad.addColorStop(0.3, 'rgba(160, 32, 255, 0.25)');
    hazeGrad.addColorStop(0.7, 'rgba(122, 28, 248, 0.08)');
    hazeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = hazeGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, rimRadius + 240, 0, Math.PI * 2);
    ctx.fill();

    // Sharp glowing planetary edge
    ctx.beginPath();
    ctx.arc(centerX, centerY, rimRadius, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#c084fc';
    ctx.shadowColor = '#9312ff';
    ctx.shadowBlur = 25;
    ctx.stroke();

    // Inner magenta plasma rim
    ctx.beginPath();
    ctx.arc(centerX, centerY, rimRadius - 2, 0.12 * Math.PI, 0.88 * Math.PI);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#f43f5e';
    ctx.shadowColor = '#e11d48';
    ctx.shadowBlur = 15;
    ctx.stroke();
  }, []);

  // Video loop handling with seamless crossfade / play trigger
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setVideoLoaded(true);
      video.play().catch(() => {
        // Autoplay policy fallback
      });
    };

    video.addEventListener('canplay', handleCanPlay);
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  const handleBack = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      window.history.pushState({}, '', '/');
      window.location.reload();
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black text-[#f7f7f8] font-sans overflow-x-hidden selection:bg-[#9312ff] selection:text-white">
      {/* Dynamic style block for entrance animations, typography, and glow effects */}
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes wipeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes riseDashboard {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseGlowLine {
          0%, 100% {
            opacity: 0.85;
            box-shadow: 0 0 15px #9312ff, 0 0 30px rgba(160, 32, 255, 0.5);
          }
          50% {
            opacity: 1;
            box-shadow: 0 0 25px #c084fc, 0 0 45px rgba(147, 18, 255, 0.8);
          }
        }

        .anim-nav {
          animation: fadeInDown 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .anim-headline {
          animation: wipeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
          opacity: 0;
        }

        .anim-lede {
          animation: wipeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
          opacity: 0;
        }

        .anim-buttons {
          animation: wipeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.45s forwards;
          opacity: 0;
        }

        .anim-dashboard {
          animation: riseDashboard 1s cubic-bezier(0.16, 1, 0.3, 1) 0.55s forwards;
          opacity: 0;
        }

        .anim-sidebar-item {
          animation: wipeUp 0.5s ease-out forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-nav, .anim-headline, .anim-lede, .anim-buttons, .anim-dashboard {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }

        .zapline-glow-btn {
          background: linear-gradient(135deg, #a020ff 0%, #7a1cf8 100%);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .zapline-glow-btn:hover {
          box-shadow: 0 0 28px rgba(147, 18, 255, 0.75), 0 0 60px rgba(160, 32, 255, 0.35);
          filter: brightness(1.15);
          transform: translateY(-1px);
        }

        .zapline-dark-pill {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: all 0.2s ease;
        }

        .zapline-dark-pill:hover {
          background: rgba(255, 255, 255, 0.14);
          border-color: rgba(160, 32, 255, 0.5);
          box-shadow: 0 0 20px rgba(147, 18, 255, 0.3);
        }

        .violet-lightline {
          animation: pulseGlowLine 3s infinite ease-in-out;
        }
      `}</style>

      {/* Global Starfield Background across entire viewport */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <canvas 
          ref={starCanvasRef} 
          className="w-full h-full object-cover opacity-90"
        />
      </div>

      {/* DESKTOP STAGE (>= 900px): Centered 1672 x 941 scale frame */}
      <div className="hidden lg:block relative w-full h-screen overflow-hidden z-10">
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1672px] h-[941px] origin-center"
          style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
        >
          {/* Planet Rim: Desktop Video with mix-blend-mode: screen + Canvas Fallback */}
          <div className="absolute top-0 left-0 w-[1672px] h-[717px] pointer-events-none overflow-hidden z-10">
            {/* Fallback Canvas */}
            <canvas 
              ref={fallbackCanvasRef}
              className={`absolute top-0 left-0 w-[1672px] h-[717px] transition-opacity duration-800 ${
                videoLoaded ? 'opacity-0' : 'opacity-100'
              }`}
            />

            {/* Glowing Violet Rim Video */}
            <video
              ref={videoRef}
              src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/e859f229-8ebd-43fb-a5a0-58006ba75327.mp4"
              className={`absolute top-0 left-0 w-[1672px] h-[717px] object-cover transition-opacity duration-800 mix-blend-screen ${
                videoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              autoPlay
              muted
              loop
              playsInline
            />
          </div>

          {/* 1. NAV (Design: Violet lightning logo + Centered menu + Get Started) */}
          <nav className="absolute top-[32px] left-[110px] right-[110px] h-[56px] flex items-center justify-between z-30 anim-nav">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handleBack}
                title="Return to AI Fluence"
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[#8b8988] hover:text-white transition flex items-center gap-1.5 text-xs font-semibold px-3 mr-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>AI Fluence</span>
              </button>

              <div className="flex items-center gap-2.5 cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#9312ff] to-[#a020ff] flex items-center justify-center shadow-[0_0_18px_rgba(147,18,255,0.7)]">
                  <Zap className="w-5 h-5 text-white fill-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white font-sans">
                  Zapline
                </span>
              </div>
            </div>

            {/* Centered Navigation Menu */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0a0a0f]/80 border border-white/[0.08] backdrop-blur-xl shadow-2xl">
              <span className="px-3.5 py-1 rounded-full text-xs font-medium text-white bg-white/10 cursor-pointer">
                Home
              </span>
              <a href="#features" className="px-3 py-1 text-xs font-medium text-[#8b8988] hover:text-white transition">
                Features
              </a>
              <span className="text-white/20 text-xs">·</span>
              <a href="#advantage" className="px-3 py-1 text-xs font-medium text-[#8b8988] hover:text-white transition">
                Zapline Advantage
              </a>
              <span className="text-white/20 text-xs">·</span>
              <a href="#referral" className="px-3 py-1 text-xs font-medium text-[#8b8988] hover:text-white transition">
                Referral
              </a>
              <span className="text-white/20 text-xs">·</span>
              <a href="#faq" className="px-3 py-1 text-xs font-medium text-[#8b8988] hover:text-white transition">
                FAQ
              </a>
            </div>

            {/* Right: Get Started */}
            <div className="flex items-center gap-3">
              <button className="zapline-glow-btn px-6 py-2 rounded-full text-xs font-bold text-white uppercase tracking-wider cursor-pointer">
                Get Started
              </button>
            </div>
          </nav>

          {/* 2. HERO CONTENT: Headline + Lede + CTAs */}
          <div className="absolute top-[138px] left-0 right-0 flex flex-col items-center text-center px-4 z-20">
            {/* Headline: ~84px bold grotesk */}
            <h1 className="anim-headline text-[80px] font-black tracking-[-0.035em] leading-[1.04] text-center max-w-[1200px] text-[#f7f7f8]">
              <span className="bg-gradient-to-r from-[#e9d5ff] via-[#c084fc] to-[#9312ff] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(160,32,255,0.4)]">
                Zapline
              </span>{' '}
              Trade Smarter,
              <br />
              Faster, Safer.
            </h1>

            {/* Lede: Two-line concise copy */}
            <p className="anim-lede mt-5 text-[17px] font-normal text-[#8b8988] max-w-[760px] leading-[1.65]">
              The first fully integrated on-chain trading experience. No dashboards, no delays — Zapline empowers you to trade directly from your favorite DeFi apps and terminals.
            </p>

            {/* CTA Buttons */}
            <div className="anim-buttons mt-8 flex items-center gap-4">
              <button className="zapline-glow-btn px-8 py-3.5 rounded-full text-sm font-bold text-white shadow-xl flex items-center gap-2 cursor-pointer">
                <span>Get Started</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="zapline-dark-pill px-7 py-3.5 rounded-full text-sm font-medium text-[#f7f7f8] cursor-pointer">
                Learn More
              </button>
            </div>
          </div>

          {/* 3. DASHBOARD GLOW STRIP: Blend overlay above dashboard */}
          <div className="absolute top-[610px] left-1/2 -translate-x-1/2 w-[1260px] h-[90px] pointer-events-none z-15 mix-blend-screen opacity-90">
            <img 
              src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/e0e14572-12e1-4c08-b471-a21521844945.png" 
              alt="Dashboard Violet Horizon Glow"
              className="w-full h-full object-contain"
            />
          </div>

          {/* 4. DASHBOARD PANEL: 1204px wide, y = 651, rounded 14px, dark glass with violet lightline */}
          <div 
            className="anim-dashboard absolute top-[651px] left-1/2 -translate-x-1/2 w-[1204px] h-[340px] rounded-[14px] bg-[#07070b]/92 border border-[#9312ff]/40 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden z-25 flex flex-col"
          >
            {/* Top glowing violet lightline (1px line) */}
            <div className="violet-lightline w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#a020ff] to-transparent shrink-0" />

            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar */}
              <div className="w-[220px] bg-[#030306]/90 border-r border-white/[0.06] p-4 flex flex-col justify-between shrink-0">
                <div className="space-y-4">
                  {/* Sidebar Brand Header with gear */}
                  <div className="flex items-center justify-between px-2 pt-1">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#a020ff]" />
                      <span className="text-sm font-bold text-white tracking-tight">Zapline</span>
                    </div>
                    <button className="text-[#8b8988] hover:text-white transition">
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Primary Navigation */}
                  <div className="space-y-1">
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#8b8988] hover:text-white hover:bg-white/[0.04] transition">
                      <Search className="w-3.5 h-3.5" />
                      <span>Search</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab('dashboard')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                        activeTab === 'dashboard' 
                          ? 'bg-[#9312ff]/20 text-white border border-[#9312ff]/40 shadow-[0_0_15px_rgba(147,18,255,0.25)]' 
                          : 'text-[#8b8988] hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-[#c084fc]" />
                      <span>Dashboard</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab('snipes')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                        activeTab === 'snipes'
                          ? 'bg-[#9312ff]/20 text-white border border-[#9312ff]/40'
                          : 'text-[#8b8988] hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <Crosshair className="w-3.5 h-3.5" />
                      <span>Snipes</span>
                    </button>

                    <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#8b8988] hover:text-red-400 hover:bg-white/[0.04] transition">
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Disconnect</span>
                    </button>
                  </div>

                  {/* Secondary items */}
                  <div className="pt-2 border-t border-white/[0.06] space-y-1">
                    <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#8b8988] hover:text-white hover:bg-white/[0.04] transition">
                      <Wallet className="w-3.5 h-3.5" />
                      <span>Wallets</span>
                    </button>
                    <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#8b8988] hover:text-white hover:bg-white/[0.04] transition">
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Referral</span>
                    </button>
                    <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#8b8988] hover:text-white hover:bg-white/[0.04] transition">
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Settings</span>
                    </button>
                  </div>
                </div>

                {/* Zapline Pro Promo Card */}
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#9312ff]/15 via-[#a020ff]/10 to-transparent border border-[#9312ff]/30">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-white mb-1">
                    <Sparkles className="w-3 h-3 text-[#c084fc]" />
                    <span>Zapline Pro</span>
                  </div>
                  <p className="text-[10px] text-[#8b8988] leading-tight mb-2">
                    Priority mempool routes & 0ms latency snipes.
                  </p>
                  <button className="w-full py-1 rounded-md text-[10px] font-bold text-white bg-gradient-to-r from-[#a020ff] to-[#7a1cf8] hover:brightness-110 transition shadow-sm">
                    Upgrade
                  </button>
                </div>
              </div>

              {/* Main Dashboard Canvas Body */}
              <div className="flex-1 flex flex-col overflow-hidden bg-[#07070c]/60">
                {/* Top bar: Small icons and Alex T. 0x3f4…9c7e */}
                <div className="h-[46px] border-b border-white/[0.06] px-5 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-white">Live Execution Feed</span>
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono font-medium text-[#45b558]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#45b558] animate-ping" />
                      Fast RPC Active
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <button className="text-[#8b8988] hover:text-white transition">
                      <Bell className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#9312ff] to-[#c084fc] flex items-center justify-center text-[10px] font-bold text-white">
                        A
                      </div>
                      <span className="text-xs font-medium text-white">Alex T.</span>
                      <span className="text-[11px] font-mono text-[#8b8988]">0x3f4…9c7e</span>
                    </div>
                  </div>
                </div>

                {/* Dashboard Grid: Stats + Chart + Calendar */}
                <div className="flex-1 p-5 grid grid-cols-12 gap-4 overflow-hidden">
                  {/* Left Column: Stats Cards (4 cols) */}
                  <div className="col-span-4 flex flex-col gap-3">
                    {/* Stat 1: Revenue Generated */}
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md">
                      <span className="text-[11px] font-medium text-[#8b8988] block">
                        Revenue generated (since inception)
                      </span>
                      <div className="flex items-baseline gap-2.5 mt-1.5">
                        <span className="text-2xl font-bold font-mono tracking-tight text-white">
                          $214,402
                        </span>
                        <span className="inline-flex items-center text-xs font-mono font-bold text-[#45b558]">
                          <TrendingUp className="w-3 h-3 mr-0.5" />
                          +12.5%
                        </span>
                      </div>
                    </div>

                    {/* Stat 2: Active Wallets/Users */}
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md">
                      <span className="text-[11px] font-medium text-[#8b8988] block">
                        Active wallets/users
                      </span>
                      <div className="flex items-baseline gap-2.5 mt-1.5">
                        <span className="text-2xl font-bold font-mono tracking-tight text-white">
                          6,412
                        </span>
                        <span className="inline-flex items-center text-xs font-mono font-bold text-[#f03b2a]">
                          <TrendingDown className="w-3 h-3 mr-0.5" />
                          −3.1%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Center Column: Violet Area Chart (5 cols) */}
                  <div className="col-span-5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">Daily dynamics of sales</span>
                      <span className="text-[10px] font-mono text-[#8b8988]">Past 30 Days</span>
                    </div>

                    {/* Violet Area Chart SVG */}
                    <div className="h-[140px] w-full pt-2">
                      <svg viewBox="0 0 320 120" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="chartVioletGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#9312ff" stopOpacity="0.45" />
                            <stop offset="85%" stopColor="#9312ff" stopOpacity="0.02" />
                            <stop offset="100%" stopColor="#9312ff" stopOpacity="0" />
                          </linearGradient>
                          <filter id="violetGlowLine" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#a020ff" floodOpacity="0.8" />
                          </filter>
                        </defs>
                        {/* Subtle Grid Lines */}
                        <line x1="0" y1="30" x2="320" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                        <line x1="0" y1="70" x2="320" y2="70" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                        <line x1="0" y1="110" x2="320" y2="110" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

                        {/* Area Path */}
                        <path 
                          d="M 0 100 Q 40 85, 75 92 T 150 45 T 225 60 T 280 20 T 320 30 L 320 120 L 0 120 Z" 
                          fill="url(#chartVioletGrad)" 
                        />
                        {/* Glow Stroke Line */}
                        <path 
                          d="M 0 100 Q 40 85, 75 92 T 150 45 T 225 60 T 280 20 T 320 30" 
                          fill="none" 
                          stroke="#c084fc" 
                          strokeWidth="2.5" 
                          filter="url(#violetGlowLine)"
                        />
                        {/* Peak node */}
                        <circle cx="280" cy="20" r="4" fill="#ffffff" stroke="#9312ff" strokeWidth="2" />
                      </svg>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[#8b8988]">
                      <span>Jan 01</span>
                      <span>Jan 15</span>
                      <span>Jan 31</span>
                    </div>
                  </div>

                  {/* Right Column: Calendar & Execution Metrics (3 cols) */}
                  <div className="col-span-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md flex flex-col justify-between text-xs">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">January 2024</span>
                        <span className="text-[10px] text-[#8b8988]">Monthly</span>
                      </div>
                      <span className="text-[10px] text-[#8b8988] block mt-0.5">Start date–Now (monthly)</span>
                    </div>

                    <div className="space-y-2 mt-2 pt-2 border-t border-white/[0.06]">
                      <div className="flex items-center justify-between">
                        <span className="text-[#8b8988] text-[11px]">Total snipes</span>
                        <div className="flex items-center gap-1 font-mono">
                          <span className="text-white font-semibold">1,284</span>
                          <span className="text-[10px] text-[#45b558] font-bold">+8.4%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#8b8988] text-[11px]">Avg. execution</span>
                        <span className="text-white font-mono font-semibold">0.42s</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#8b8988] text-[11px]">Win rate</span>
                        <div className="flex items-center gap-1 font-mono">
                          <span className="text-white font-semibold">68.2%</span>
                          <span className="text-[10px] text-[#45b558] font-bold">+2.1%</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px]">
                      <span className="text-[#8b8988]">Connected apps:</span>
                      <span className="text-[#c084fc] font-medium">Charting · Terminals</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE & TABLET LAYOUT (< 900px or portrait): Stacked, fluid scrolling layout */}
      <div className="lg:hidden min-h-screen flex flex-col relative z-10 px-4 pt-4 pb-12">
        {/* Mobile Planet Rim Canvas */}
        <div className="w-full h-[220px] relative overflow-hidden rounded-2xl mb-4 border border-[#9312ff]/20">
          <canvas 
            ref={fallbackCanvasRef}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#9312ff] to-[#a020ff] flex items-center justify-center shadow-lg">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold text-white text-base tracking-tight">Zapline</span>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="absolute top-3 right-3 p-2 rounded-lg bg-white/10 text-white"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="mb-6 p-4 rounded-2xl bg-[#0a0a0f] border border-[#9312ff]/30 space-y-3">
            <button 
              onClick={handleBack}
              className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-[#8b8988] hover:text-white flex items-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to AI Fluence</span>
            </button>
            <div className="text-xs font-medium text-white px-3 py-1 bg-white/10 rounded-lg">Home</div>
            <div className="text-xs font-medium text-[#8b8988] px-3 py-1">Features</div>
            <div className="text-xs font-medium text-[#8b8988] px-3 py-1">Zapline Advantage</div>
            <div className="text-xs font-medium text-[#8b8988] px-3 py-1">Referral</div>
            <div className="text-xs font-medium text-[#8b8988] px-3 py-1">FAQ</div>
          </div>
        )}

        {/* Mobile Hero Content: wraps nicely to 3 lines */}
        <div className="text-center space-y-4 my-4">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            <span className="bg-gradient-to-r from-[#e9d5ff] via-[#c084fc] to-[#9312ff] bg-clip-text text-transparent">
              Zapline
            </span>
            <br />
            Trade Smarter,
            <br />
            Faster, Safer.
          </h1>

          <p className="text-sm text-[#8b8988] leading-relaxed max-w-md mx-auto">
            The first fully integrated on-chain trading experience. No dashboards, no delays — Zapline empowers you to trade directly from your favorite DeFi apps.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button className="zapline-glow-btn w-full sm:w-auto px-7 py-3 rounded-full text-sm font-bold text-white shadow-lg">
              Get Started
            </button>
            <button className="zapline-dark-pill w-full sm:w-auto px-7 py-3 rounded-full text-sm font-medium text-white">
              Learn More
            </button>
          </div>
        </div>

        {/* Mobile Dashboard: Scrolling column with sidebar chips */}
        <div className="mt-8 rounded-2xl bg-[#07070b] border border-[#9312ff]/40 shadow-2xl overflow-hidden">
          <div className="violet-lightline w-full h-[2px] bg-gradient-to-r from-transparent via-[#a020ff] to-transparent" />
          
          {/* Mobile Sidebar Chips */}
          <div className="p-3 border-b border-white/[0.08] flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#9312ff]/30 text-white border border-[#9312ff]/50 shrink-0">
              Dashboard
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-medium text-[#8b8988] bg-white/[0.04] shrink-0">
              Snipes
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-medium text-[#8b8988] bg-white/[0.04] shrink-0">
              Wallets
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-medium text-[#8b8988] bg-white/[0.04] shrink-0">
              Referral
            </span>
          </div>

          {/* User info bar */}
          <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-[#8b8988]">Connected:</span>
            <span className="font-mono text-white">Alex T. (0x3f4…9c7e)</span>
          </div>

          {/* Mobile Stats */}
          <div className="p-4 space-y-3">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[11px] text-[#8b8988]">Revenue generated</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-bold font-mono text-white">$214,402</span>
                <span className="text-xs font-mono font-bold text-[#45b558]">+12.5%</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[11px] text-[#8b8988]">Active wallets/users</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-bold font-mono text-white">6,412</span>
                <span className="text-xs font-mono font-bold text-[#f03b2a]">−3.1%</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-xs font-semibold text-white block mb-1">Execution Performance</span>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mt-2">
                <div className="p-2 rounded bg-white/[0.02]">
                  <span className="text-[#8b8988] block text-[10px]">Avg Speed</span>
                  <span className="text-white font-bold">0.42s</span>
                </div>
                <div className="p-2 rounded bg-white/[0.02]">
                  <span className="text-[#8b8988] block text-[10px]">Win Rate</span>
                  <span className="text-[#45b558] font-bold">68.2% (+2.1%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer return link */}
        <div className="mt-8 text-center">
          <button 
            onClick={handleBack}
            className="text-xs text-[#8b8988] hover:text-white underline underline-offset-4"
          >
            ← Return to AI Fluence Platform
          </button>
        </div>
      </div>
    </div>
  );
};
