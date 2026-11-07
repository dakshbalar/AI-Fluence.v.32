import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Sparkles,
  Dices,
  Check,
  Lock,
  Flame,
  Zap,
  Smile,
  Shield,
  Palette,
  Eye,
  Crown,
  Layers,
  Cpu,
  Bot,
  Radio,
  Sliders,
  Tv,
  Compass,
  Headphones,
  Rocket,
  RotateCcw,
  Maximize2,
  ZoomIn,
  ChevronDown,
  ChevronUp,
  Heart,
  Shirt,
  Unlock
} from "lucide-react";
import {
  AvatarConfig,
  CharacterMood,
  RobotHeadShape,
  RobotScreenShape,
  RobotEyeStyle,
  RobotMouthStyle,
  RobotAntennaStyle,
  RobotEarModule,
  RobotBodyArchetype,
  RobotChestCore,
  RobotArmStyle,
  RobotHandStyle,
  RobotLegStyle,
  RobotAccessory,
  RobotSkinOutfit
} from "../../types/avatar";
import {
  DEFAULT_AVATAR_CONFIG,
  AVATAR_PRESETS,
  FULL_BUNDLES,
  FullBundleDefinition,
  ROBOT_SKINS,
  PRIMARY_SHELL_COLORS,
  ACCENT_COLORS,
  SCREEN_GLOW_COLORS,
  BACKGROUND_COLORS,
  UNLOCK_CATALOG
} from "../../data/avatarData";
import { AIFLUENCE_CHARACTER_TRIO } from "../../data/characters";
import { AIfluenceAvatar, normalizeRobotConfig } from "./AIfluenceAvatar";
import { AvatarThumbnail } from "./AvatarThumbnail";
import { useGamification } from "../../utils/gamificationStore";

export interface AvatarStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialConfig?: AvatarConfig;
  onSaveAvatar: (newConfig: AvatarConfig) => void;
  userName?: string;
}

export type CategoryTab =
  | "mascots"
  | "bundles"
  | "presets"
  | "pose"
  | "head"
  | "screen"
  | "face"
  | "shell"
  | "accent"
  | "glow"
  | "antenna"
  | "ear_modules"
  | "body"
  | "chest"
  | "limbs"
  | "legs"
  | "accessories"
  | "background";

export type CameraMode = "full" | "face" | "torso";

export interface PoseDefinition {
  id: CharacterMood;
  name: string;
  badge: string;
  badgeColor: string;
  icon: string;
  description: string;
  motionType: "still" | "float" | "bounce" | "fast" | "groove";
}

export const POSE_DEFINITIONS: PoseDefinition[] = [
  {
    id: "still",
    name: "Stationary Still",
    badge: "NO MOTION",
    badgeColor: "bg-slate-700 text-slate-200 border-slate-500",
    icon: "🧘",
    description: "Completely still, rock-steady posture with zero floating motion",
    motionType: "still"
  },
  {
    id: "idle",
    name: "Idle Hover",
    badge: "DEFAULT FLOAT",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30",
    icon: "✨",
    description: "Smooth continuous cyber floating bob in anti-gravity suspension",
    motionType: "float"
  },
  {
    id: "happy",
    name: "Smiling Happy",
    badge: "RADIANT",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/30",
    icon: "😊",
    description: "Joyful rhythmic bounce with illuminated happy eye crescents",
    motionType: "bounce"
  },
  {
    id: "heroic",
    name: "Heroic Stance",
    badge: "EMPOWERED",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/30",
    icon: "⚡",
    description: "Confident upward stance with elevated chest power core",
    motionType: "float"
  },
  {
    id: "focused",
    name: "Focused Precision",
    badge: "ANALYTICAL",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
    icon: "🎯",
    description: "Sharp micro-pulse analysis, scanning code and telemetry",
    motionType: "still"
  },
  {
    id: "angry",
    name: "Angry Surge",
    badge: "BATTLE SPARK",
    badgeColor: "bg-red-500/20 text-red-300 border-red-400/30",
    icon: "😡",
    description: "High-intensity battle spark twitch with slanted laser brow scowl",
    motionType: "fast"
  },
  {
    id: "thinking",
    name: "Deep Logic",
    badge: "PROCESSING",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-400/30",
    icon: "🧠",
    description: "Inquisitive head tilt and algorithmic thinking cycle",
    motionType: "float"
  },
  {
    id: "curious",
    name: "Curious Scan",
    badge: "OBSERVANT",
    badgeColor: "bg-teal-500/20 text-teal-300 border-teal-400/30",
    icon: "🔍",
    description: "Observant tilted angle scanning new concepts and patterns",
    motionType: "float"
  },
  {
    id: "wave",
    name: "Friendly Wave",
    badge: "GREETING",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-400/30",
    icon: "👋",
    description: "Warm welcoming robotic greeting wave with dynamic hand gesture",
    motionType: "bounce"
  },
  {
    id: "point",
    name: "Target Point",
    badge: "FOCUS",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30",
    icon: "👉",
    description: "Extended pointing index gesture targeting critical metrics",
    motionType: "still"
  },
  {
    id: "run",
    name: "Speed Sprint",
    badge: "VELOCITY",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/30",
    icon: "🏃",
    description: "Dynamic asymmetric running stride with forward body lean and pumping limbs",
    motionType: "fast"
  },
  {
    id: "jump",
    name: "Anti-Grav Leap",
    badge: "AIRBORNE",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-400/30",
    icon: "🚀",
    description: "High elevation leap with outstretched limbs and floating airtime",
    motionType: "bounce"
  },
  {
    id: "sit",
    name: "Grounded Rest",
    badge: "RELAXED",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
    icon: "🪑",
    description: "Grounded resting posture with bent knees and resting palms",
    motionType: "still"
  },
  {
    id: "lean",
    name: "Casual Lean",
    badge: "CHILL",
    badgeColor: "bg-teal-500/20 text-teal-300 border-teal-400/30",
    icon: "😎",
    description: "Relaxed asymmetric lean with tilted chassis and confident stance",
    motionType: "float"
  },
  {
    id: "crouch",
    name: "Tactical Crouch",
    badge: "STEALTH",
    badgeColor: "bg-zinc-500/20 text-zinc-300 border-zinc-400/30",
    icon: "🥷",
    description: "Low-profile defensive crouch with deep articulated knee flexion",
    motionType: "still"
  },
  {
    id: "facepalm",
    name: "Debug Error",
    badge: "SYNTAX ERROR",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-400/30",
    icon: "🤦",
    description: "Head-slumping facepalm posture upon encountering unexpected bugs",
    motionType: "still"
  },
  {
    id: "meditate",
    name: "Levitating Zen",
    badge: "TRANSCENDENT",
    badgeColor: "bg-violet-500/20 text-violet-300 border-violet-400/30",
    icon: "🧘‍♂️",
    description: "Serene levitating meditation with open palms and elevated suspension",
    motionType: "float"
  },
  {
    id: "celebrating",
    name: "Victory Cheer",
    badge: "TRIUMPH",
    badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
    icon: "🎉",
    description: "High-energy dynamic celebration hop and victory fanfare",
    motionType: "bounce"
  },
  {
    id: "streak",
    name: "Streak Combustion",
    badge: "STREAK FLAME",
    badgeColor: "bg-orange-500/20 text-orange-300 border-orange-400/30",
    icon: "🔥",
    description: "Energetic streak flame resonance for daily study consistency",
    motionType: "bounce"
  },
  {
    id: "levelUp",
    name: "Level Up Surge",
    badge: "POWER UP",
    badgeColor: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/30",
    icon: "⭐",
    description: "Triumphant ascension pulse celebrating new milestone levels",
    motionType: "fast"
  },
  {
    id: "proud",
    name: "Proud Monarch",
    badge: "REGAL",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/30",
    icon: "👑",
    description: "Dignified, poised stance honoring achievements",
    motionType: "float"
  },
  {
    id: "dance",
    name: "Cyber Dance",
    badge: "GROOVE",
    badgeColor: "bg-pink-500/20 text-pink-300 border-pink-400/30",
    icon: "🕺",
    description: "Rhythmic cyber shuffle and dynamic multi-axis bounce",
    motionType: "groove"
  },
  {
    id: "surprised",
    name: "Surprised Pop",
    badge: "REACTIVE",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-400/30",
    icon: "💫",
    description: "Wide-eyed reactive hop upon discovering unexpected insights",
    motionType: "bounce"
  },
  {
    id: "sleep",
    name: "Power Save Drift",
    badge: "STANDBY",
    badgeColor: "bg-slate-600 text-slate-300 border-slate-500",
    icon: "💤",
    description: "Low-power standby drift with calm soothing rhythm",
    motionType: "still"
  },
  {
    id: "determined",
    name: "Determined Shield",
    badge: "RESOLUTE",
    badgeColor: "bg-violet-500/20 text-violet-300 border-violet-400/30",
    icon: "🛡️",
    description: "Steadfast defense posture focused on hard problems",
    motionType: "still"
  }
];

export const AvatarStudioModal: React.FC<AvatarStudioModalProps> = ({
  isOpen,
  onClose,
  initialConfig,
  onSaveAvatar,
  userName = "Techno"
}) => {
  const [config, setConfig] = useState<AvatarConfig>(
    normalizeRobotConfig(initialConfig || DEFAULT_AVATAR_CONFIG)
  );
  const [activeTab, setActiveTab] = useState<CategoryTab>("bundles");
  const [activeMood, setActiveMood] = useState<CharacterMood>(
    initialConfig?.customPose || "idle"
  );
  const [cameraMode, setCameraMode] = useState<CameraMode>("full");
  const [savedNotice, setSavedNotice] = useState(false);
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  const [faceSubTab, setFaceSubTab] = useState<"eyes" | "mouth">("eyes");
  const [limbSubTab, setLimbSubTab] = useState<"arms" | "hands">("arms");
  const [clickSparks, setClickSparks] = useState<{ id: number; x: number; y: number }[]>([]);

  const { state: gamificationState } = useGamification();

  useEffect(() => {
    if (isOpen) {
      const fresh = normalizeRobotConfig(initialConfig || DEFAULT_AVATAR_CONFIG);
      setConfig(fresh);
      setActiveMood(fresh.customPose || "idle");
    }
  }, [isOpen, initialConfig]);

  if (!isOpen) return null;

  const isBundleActive = Boolean(config.activeBundle && config.activeBundle !== "none" && config.skinOutfit !== "none");
  const activeBundleDef = isBundleActive ? FULL_BUNDLES.find((b) => b.id === config.activeBundle) : null;
  // Allow full creative freedom to customize limbs, legs, accessories, etc. even with bundles equipped
  const isTabLocked = (_tabId: CategoryTab): boolean => false;

  const handleUnequipBundle = () => {
    setConfig((prev) => ({
      ...prev,
      activeBundle: undefined,
      skinOutfit: "none"
    }));
  };

  const updateConfig = <K extends keyof AvatarConfig>(key: K, value: AvatarConfig[K]) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
      activeBundle: key === "skinOutfit" && value !== "none" ? (value as string) : prev.activeBundle
    }));
  };

  const handleApplyPreset = (presetConfig: AvatarConfig) => {
    setConfig({
      ...presetConfig,
      skinOutfit: "none",
      activeBundle: undefined
    });
    if (presetConfig.customPose) {
      setActiveMood(presetConfig.customPose);
    }
  };

  const handleApplyBundle = (bundle: FullBundleDefinition) => {
    if (config.activeBundle === bundle.id) {
      handleUnequipBundle();
    } else {
      setConfig({
        ...bundle.config,
        skinOutfit: bundle.id as RobotSkinOutfit,
        activeBundle: bundle.id
      });
      if (bundle.config.customPose) {
        setActiveMood(bundle.config.customPose);
      }
    }
  };

  const handleRandomize = () => {
    const heads: RobotHeadShape[] = [
      "capsule",
      "compact_dome",
      "panoramic_visor",
      "tall_capsule",
      "soft_square",
      "orbital",
      "tech_angular",
      "floating_core"
    ];
    const screens: RobotScreenShape[] = [
      "classic_capsule",
      "panoramic_wide",
      "soft_square",
      "compact_window",
      "angular_visor",
      "slit_matrix"
    ];
    const eyes: RobotEyeStyle[] = [
      "large_digital",
      "soft_digital",
      "anime_digital",
      "pixel",
      "dot",
      "led_visor",
      "visor_bar",
      "dual_pupil",
      "focus_crosshair"
    ];
    const mouths: RobotMouthStyle[] = [
      "digital_smile",
      "open_smile",
      "small_smile",
      "waveform",
      "pixel_smile",
      "dot_mouth",
      "tiny_line"
    ];
    const antennas: RobotAntennaStyle[] = [
      "single_led",
      "double_antenna",
      "orb_beacon",
      "orbital_ring",
      "satellite_dish",
      "lightning_fin",
      "star_reactor"
    ];
    const ears: RobotEarModule[] = [
      "speaker_grill",
      "led_halo_rings",
      "mechanical_discs",
      "comm_pods",
      "cooling_fins",
      "headphones"
    ];
    const bodies: RobotBodyArchetype[] = ["compact", "explorer", "tech", "floating_pod", "mini", "heavy"];
    const cores: RobotChestCore[] = [
      "aifluence_logo",
      "photon_reactor",
      "pulse_heart",
      "xp_crystal",
      "energy_gauge",
      "tech_badge"
    ];
    const arms: RobotArmStyle[] = [
      "smooth_satin",
      "mechanical_segmented",
      "flexible_bellows",
      "armored_tech",
      "mini_paws"
    ];
    const hands: RobotHandStyle[] = [
      "mitten",
      "three_finger",
      "four_finger",
      "claw_grabber",
      "open_palm"
    ];
    const legs: RobotLegStyle[] = [
      "short_sturdy",
      "hover_thruster",
      "mechanical_struts",
      "explorer_treads",
      "compact_pegs"
    ];
    const accessories: RobotAccessory[] = [
      "none",
      "crown",
      "cap",
      "visor",
      "jetpack",
      "backpack",
      "scarf",
      "floating_companion"
    ];
    const poses: CharacterMood[] = [
      "idle",
      "still",
      "happy",
      "heroic",
      "focused",
      "angry",
      "thinking",
      "curious",
      "wave",
      "point",
      "run",
      "jump",
      "sit",
      "lean",
      "crouch",
      "celebrating",
      "streak",
      "levelUp",
      "proud",
      "dance",
      "surprised",
      "sleep",
      "determined",
      "facepalm",
      "meditate"
    ];

    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

    const shell = pick(PRIMARY_SHELL_COLORS).hex;
    const accent = pick(ACCENT_COLORS).hex;
    const glow = pick(SCREEN_GLOW_COLORS).hex;
    const bg = pick(BACKGROUND_COLORS).hex;
    const selectedPose = pick(poses);

    setActiveMood(selectedPose);
    setConfig({
      headShape: pick(heads),
      screenShape: pick(screens),
      eyeStyle: pick(eyes),
      mouthStyle: pick(mouths),
      screenGlowColor: glow,
      primaryColor: shell,
      accentColor: accent,
      antennaStyle: pick(antennas),
      earModule: pick(ears),
      bodyArchetype: pick(bodies),
      chestCore: pick(cores),
      armStyle: pick(arms),
      handStyle: pick(hands),
      legStyle: pick(legs),
      feetStyle: "rounded_boots",
      accessory: pick(accessories),
      accessoryColor: accent,
      backgroundColor: bg,
      skinOutfit: "none",
      activeBundle: undefined,
      customPose: selectedPose
    });
  };

  const handleReset = () => {
    const fresh = normalizeRobotConfig(initialConfig || DEFAULT_AVATAR_CONFIG);
    setConfig(fresh);
    setActiveMood(fresh.customPose || "idle");
  };

  const handleSave = () => {
    onSaveAvatar(config);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 450);
  };

  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const sparkId = Date.now();
    setClickSparks((prev) => [...prev, { id: sparkId, x, y }]);
    setTimeout(() => {
      setClickSparks((prev) => prev.filter((s) => s.id !== sparkId));
    }, 900);
  };

  const isUnlocked = (itemId: string): boolean => {
    const item = UNLOCK_CATALOG[itemId];
    if (!item) return true;
    if (item.type === "streak") {
      return (gamificationState.currentStreak || 1) >= item.value;
    }
    if (item.type === "xp") {
      return (gamificationState.xp || 0) >= item.value;
    }
    return true;
  };

  const CATEGORY_TABS: { id: CategoryTab; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: "bundles", label: "Full Bundles", icon: Shirt },
    { id: "presets", label: "Archetypes", icon: Bot },
    { id: "pose", label: "Pose & Mood", icon: Smile },
    { id: "head", label: "Head Shell", icon: Compass },
    { id: "screen", label: "Visor Screen", icon: Tv },
    { id: "face", label: "Eyes & Face", icon: Eye },
    { id: "shell", label: "Shell Color", icon: Palette },
    { id: "accent", label: "Accent Trim", icon: Sliders },
    { id: "glow", label: "Screen Glow", icon: Zap },
    { id: "antenna", label: "Antenna", icon: Radio },
    { id: "ear_modules", label: "Ear Modules", icon: Headphones },
    { id: "body", label: "Body Chassis", icon: Shield },
    { id: "chest", label: "Chest Core", icon: Cpu },
    { id: "limbs", label: "Arms & Hands", icon: Layers },
    { id: "legs", label: "Legs & Thrusters", icon: Rocket },
    { id: "accessories", label: "Accessories", icon: Crown },
    { id: "background", label: "Backdrop Aura", icon: Sparkles }
  ];

  const MOOD_OPTIONS: { id: CharacterMood; label: string; icon: string }[] = [
    { id: "still", label: "Stationary Still", icon: "🧘" },
    { id: "idle", label: "Idle Float", icon: "✨" },
    { id: "happy", label: "Happy", icon: "😊" },
    { id: "heroic", label: "Heroic", icon: "⚡" },
    { id: "focused", label: "Focused", icon: "🎯" },
    { id: "angry", label: "Angry Surge", icon: "😡" },
    { id: "wave", label: "Friendly Wave", icon: "👋" },
    { id: "dance", label: "Victory Dance", icon: "🕺" },
    { id: "streak", label: "Streak Flame", icon: "🔥" },
    { id: "thinking", label: "Deep Logic", icon: "🧠" },
    { id: "excited", label: "Hyper Boost", icon: "⚡" },
    { id: "levelUp", label: "Level Up", icon: "⭐" },
    { id: "celebrating", label: "Celebrate", icon: "🎉" },
    { id: "encouraging", label: "Focus Shield", icon: "🛡️" },
    { id: "sleep", label: "Power Save", icon: "💤" }
  ];

  return (
    <div className="fixed inset-0 z-[250] bg-[#000000] text-white flex flex-col overflow-hidden select-none animate-fade-in font-sans">
      {/* 1. DYNAMIC SHOWROOM ATMOSPHERE & BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Subtle Ambient Aura */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] h-[700px] sm:h-[950px] rounded-full blur-[140px] opacity-20 transition-all duration-700 pointer-events-none"
          style={{ backgroundColor: config.backgroundColor || "#2563EB" }}
        />
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full blur-[90px] opacity-15 transition-all duration-500 pointer-events-none"
          style={{ backgroundColor: config.screenGlowColor || "#00E5FF" }}
        />
        {/* Obsidian Glass Grid Floor */}
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
      </div>

      {/* 2. TOP STORE-STYLE GLASS NAVIGATION BAR */}
      <header className="relative z-30 w-full px-3 sm:px-6 py-2.5 sm:py-3 shrink-0">
        <div className="w-full rounded-2xl bg-[#0b0b0e] border border-white/10 p-2.5 sm:p-3 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.85)]">
          {/* Left: Back Button & Title */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] active:bg-white/[0.18] border border-white/15 flex items-center justify-center text-white cursor-pointer transition-all active:scale-95 shadow-inner"
              title="Return to Hub"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-white shadow-inner shrink-0">
                <Bot size={18} className="text-zinc-200" />
              </div>
              <h1 className="text-sm sm:text-base font-black text-white tracking-tight">
                Avatar Studio
              </h1>
            </div>
          </div>

          {/* Right: Camera Switcher, Quick Actions & Glass Save CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Camera View Switcher (Store Section Style) */}
            <div className="flex items-center bg-black/60 border border-white/10 rounded-xl p-0.5">
              <button
                onClick={() => setCameraMode("full")}
                className={`px-2 py-1 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                  cameraMode === "full"
                    ? "bg-white/[0.16] text-white border border-white/30 shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
                title="Full Body View"
              >
                <Maximize2 size={12} />
                <span className="hidden xl:inline text-[10px]">Full</span>
              </button>
              <button
                onClick={() => setCameraMode("face")}
                className={`px-2 py-1 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
                  cameraMode === "face"
                    ? "bg-white/[0.16] text-white border border-white/30 shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
                title="Zoom Face Visor"
              >
                <ZoomIn size={12} />
                <span className="hidden xl:inline text-[10px]">Face</span>
              </button>
            </div>

            {/* Randomizer */}
            <button
              onClick={handleRandomize}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-inner"
              title="Randomize Companion"
            >
              <Dices size={14} className="text-cyan-300" />
              <span className="hidden md:inline">Random</span>
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="p-1.5 sm:p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-zinc-400 hover:text-white transition cursor-pointer active:scale-95 shadow-inner"
              title="Reset to Original"
            >
              <RotateCcw size={14} />
            </button>

            {/* Signature Store Glass Button with Sweep Shine */}
            <button
              onClick={handleSave}
              className="py-1.5 px-3.5 sm:px-5 rounded-xl bg-white/[0.12] hover:bg-white/[0.18] active:bg-white/[0.25] backdrop-blur-md border border-white/30 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_16px_rgba(0,0,0,0.7)] relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 pointer-events-none" />
              {savedNotice ? (
                <>
                  <Check size={14} className="stroke-[3] text-emerald-400" />
                  <span className="text-emerald-300">Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-cyan-300" />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 3. MAIN FULL-SCREEN WORKSPACE CONTAINER */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ========================================================================= */}
        {/* FULL-SCREEN ROBOT CHARACTER SHOWCASE STAGE (Entire Robot Visibly Centered) */}
        {/* ========================================================================= */}
        <div
          onClick={handleStageClick}
          className={`relative flex-1 flex flex-col items-center justify-center overflow-hidden transition-all duration-500 cursor-pointer ${
            isDrawerCollapsed ? "h-full" : "h-[46vh] sm:h-[52vh] lg:h-full"
          }`}
        >
          {/* Interactive Floating Click Sparks / Hearts */}
          {clickSparks.map((spark) => (
            <motion.div
              key={spark.id}
              initial={{ opacity: 1, scale: 0.5, y: 0 }}
              animate={{ opacity: 0, scale: 1.8, y: -60 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute pointer-events-none z-30 flex items-center gap-1"
              style={{ left: spark.x, top: spark.y }}
            >
              <Heart size={20} className="text-rose-400 fill-rose-400 drop-shadow-[0_0_8px_#fb7185]" />
              <Sparkles size={16} className="text-cyan-300 fill-cyan-300" />
            </motion.div>
          ))}

          {/* CENTER MASCOT STAGE WITH PEDESTAL */}
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            {/* 3D Cyber Stage Pedestal on Floor */}
            <div className="absolute bottom-[8%] sm:bottom-[12%] lg:bottom-[14%] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
              {/* Outer Cyber Rotation Ring */}
              <div
                className="w-64 sm:w-80 md:w-96 h-16 sm:h-20 rounded-[100%] border-2 border-dashed opacity-40 animate-[spin_30s_linear_infinite]"
                style={{ borderColor: config.accentColor || "#00E5FF" }}
              />
              {/* 3D Ground Contact Ambient Shadow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 md:w-80 h-10 sm:h-14 rounded-[100%] bg-black/40 blur-md" />
              {/* 3D Glass Platform Disc with Bevel Rim */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 sm:w-72 md:w-88 h-12 sm:h-16 rounded-[100%] border border-white/25 bg-gradient-to-b from-white/10 to-transparent shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-sm"
              />
              {/* Central Glowing Reactor Core Indicator */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 sm:w-36 md:w-44 h-6 sm:h-8 rounded-[100%] opacity-50 blur-sm"
                style={{
                  backgroundColor: config.screenGlowColor || "#00E5FF",
                  boxShadow: `0 0 25px ${config.screenGlowColor || "#00E5FF"}`
                }}
              />
            </div>

            {/* FULL-BODY ROBOT AVATAR (Interactive Live Preview with Poses & Kinematics) */}
            <motion.div
              animate={{
                scale: cameraMode === "face" ? 1.45 : cameraMode === "torso" ? 1.25 : 1,
                y: cameraMode === "face" ? 75 : cameraMode === "torso" ? 25 : 0
              }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              className="relative z-10 w-full max-w-[320px] sm:max-w-[400px] md:max-w-[460px] lg:max-w-[500px] aspect-square flex items-center justify-center"
            >
              <AIfluenceAvatar
                config={config}
                mood={activeMood}
                size={480}
                animate={true}
                showBackground={false}
                className="w-full h-full object-contain"
              />
            </motion.div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SNAPCHAT-STYLE OPTIONS DRAWER / CUSTOMIZATION TRAY                        */}
        {/* ========================================================================= */}
        <div
          className={`relative z-20 flex flex-col bg-[#0b0b0e] border-t lg:border-t-0 lg:border-l border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.95)] transition-all duration-300 ${
            isDrawerCollapsed
              ? "h-14 lg:w-16"
              : "flex-1 lg:flex-none lg:w-[480px] xl:w-[540px] max-h-[54vh] sm:max-h-[48vh] lg:max-h-full overflow-hidden"
          }`}
        >
          {/* DRAWER COLLAPSE TOGGLE BAR (Store Glass Style) */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#0c0c10] shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-cyan-300" />
              <span className="text-xs font-black uppercase tracking-wider text-zinc-300">
                Customization Workshop
              </span>
            </div>

            <button
              onClick={() => setIsDrawerCollapsed((prev) => !prev)}
              className="px-2 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-zinc-400 hover:text-white transition cursor-pointer text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-inner"
            >
              {isDrawerCollapsed ? (
                <>
                  <ChevronUp size={13} />
                  <span className="hidden sm:inline text-[10px]">Open</span>
                </>
              ) : (
                <>
                  <ChevronDown size={13} />
                  <span className="hidden sm:inline text-[10px]">Minimize</span>
                </>
              )}
            </button>
          </div>

          {!isDrawerCollapsed && (
            <>
              {/* HORIZONTAL CATEGORY SCROLLBAR (Store Glass Style) */}
              <div className="flex items-center gap-1.5 p-2.5 border-b border-white/10 bg-[#0b0b0e] overflow-x-auto scrollbar-none shrink-0">
                {CATEGORY_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const locked = isTabLocked(tab.id);
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer shrink-0 active:scale-95 ${
                        isActive
                          ? "bg-white/[0.14] border border-white/30 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.6)]"
                          : locked
                          ? "bg-black/40 text-zinc-600 hover:text-zinc-400 border border-white/5"
                          : "bg-[#0c0c10] text-zinc-400 hover:text-white hover:bg-white/[0.05] border border-white/10"
                      }`}
                    >
                      <Icon size={13} className={isActive ? "text-cyan-300" : locked ? "text-zinc-600" : "text-zinc-400"} />
                      <span>{tab.label}</span>
                      {locked && (
                        <Lock size={10} className="text-amber-400 shrink-0 ml-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* OPTIONS GRID CONTAINER */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto scrollbar-thin space-y-4">
                {/* LOCKED BY BUNDLE OVERLAY VIEW */}
                {isTabLocked(activeTab) ? (
                  <div className="p-6 rounded-2xl bg-[#090F24] border border-cyan-500/30 flex flex-col items-center text-center space-y-4 shadow-xl">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-inner">
                      <Lock size={32} />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                        <span>{activeBundleDef?.emoji || "🪖"}</span>
                        <span>Locked by {activeBundleDef?.name || "Active Full Bundle"}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        {CATEGORY_TABS.find((t) => t.id === activeTab)?.label} is Locked
                      </h3>
                      <p className="text-xs text-slate-300 max-w-md mx-auto mt-1 font-mono leading-relaxed">
                        Full Bundles are complete, exclusive 1-piece character costumes. Individual workshop parts, limbs, face style, and suit materials are locked to preserve the character's unique identity.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 font-mono max-w-md w-full text-left space-y-2.5">
                      <div className="text-cyan-300 font-bold flex items-center gap-1.5">
                        <Sparkles size={14} className="text-cyan-400" />
                        <span>Allowed Customizations with this Bundle:</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <button
                          onClick={() => setActiveTab("head")}
                          className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-left transition cursor-pointer flex items-center gap-2"
                        >
                          <span className="text-sm">🪖</span>
                          <div>
                            <div className="font-bold text-cyan-300">Head Shell</div>
                            <div className="text-[10px] text-slate-400">Helmet shape</div>
                          </div>
                        </button>
                        <button
                          onClick={() => setActiveTab("screen")}
                          className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-left transition cursor-pointer flex items-center gap-2"
                        >
                          <span className="text-sm">📺</span>
                          <div>
                            <div className="font-bold text-cyan-300">Visor Screen</div>
                            <div className="text-[10px] text-slate-400">Glass cavity</div>
                          </div>
                        </button>
                        <button
                          onClick={() => setActiveTab("glow")}
                          className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-left transition cursor-pointer flex items-center gap-2"
                        >
                          <span className="text-sm">⚡</span>
                          <div>
                            <div className="font-bold text-cyan-300">Screen Glow</div>
                            <div className="text-[10px] text-slate-400">Phosphor tint</div>
                          </div>
                        </button>
                        <button
                          onClick={() => setActiveTab("background")}
                          className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-left transition cursor-pointer flex items-center gap-2"
                        >
                          <span className="text-sm">✨</span>
                          <div>
                            <div className="font-bold text-cyan-300">Backdrop Aura</div>
                            <div className="text-[10px] text-slate-400">Stage lighting</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2.5 justify-center pt-2">
                      <button
                        onClick={handleUnequipBundle}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500/20 to-amber-500/20 hover:from-red-500/30 hover:to-amber-500/30 border border-red-500/40 text-xs font-mono font-bold text-red-300 hover:text-white transition cursor-pointer shadow-md flex items-center gap-2"
                      >
                        <Unlock size={14} /> Unequip Bundle & Unlock Workshop
                      </button>
                    </div>
                  </div>
                ) : (
                  <>


                {/* 1. FULL BUNDLES (COMPLETE 1-PIECE CHARACTER COSTUMES) */}
                {activeTab === "bundles" && (
                  <div className="space-y-4">
                    {isBundleActive && activeBundleDef && (
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-blue-950/60 to-[#0A1026] border border-cyan-400/40 flex items-center justify-between shadow-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl p-2 rounded-xl bg-black/60 border border-cyan-400/30 shadow-inner">
                            {activeBundleDef.emoji}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white font-mono">{activeBundleDef.name}</span>
                              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-mono font-bold uppercase">Equipped</span>
                            </div>
                            <p className="text-xs text-slate-300 font-mono mt-0.5">Workshop parts locked • Head Shell, Visor, Glow & Aura unlocked</p>
                          </div>
                        </div>
                        <button
                          onClick={handleUnequipBundle}
                          className="px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-xs font-mono font-bold text-red-300 hover:text-white transition cursor-pointer flex items-center gap-1.5 shrink-0"
                        >
                          <Unlock size={13} /> Unequip
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>Full Bundles</span>
                          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold uppercase">
                            1-Piece Costumes
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400 font-mono">
                          Complete character costumes that transform the entire robot identity
                        </p>
                      </div>
                      <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-500/30 shrink-0">
                        {FULL_BUNDLES.length} Bundles
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3.5">
                      {FULL_BUNDLES.map((bundle) => {
                        const isEquipped = config.activeBundle === bundle.id || config.skinOutfit === bundle.id;
                        return (
                          <button
                            key={bundle.id}
                            onClick={() => handleApplyBundle(bundle)}
                            className={`p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 cursor-pointer transition text-left group shadow-sm active:scale-98 border relative overflow-hidden ${
                              isEquipped
                                ? "bg-gradient-to-r from-cyan-950/80 via-blue-950/80 to-[#0A1026] border-cyan-400 ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-500/20"
                                : "bg-white/[0.03] hover:bg-white/[0.08] border-white/10 hover:border-cyan-400/50"
                            }`}
                          >
                            <div className="relative shrink-0 self-center sm:self-auto">
                              <AvatarThumbnail
                                baseConfig={bundle.config}
                                overrideConfig={{}}
                                size={76}
                                className="rounded-2xl shrink-0 group-hover:scale-105 transition-transform border border-white/15 shadow-md"
                              />
                              <div className="absolute -bottom-1 -right-1 text-lg bg-black/80 rounded-full p-0.5 border border-white/20">
                                {bundle.emoji}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0 w-full">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <h4 className={`text-base font-bold truncate ${isEquipped ? "text-cyan-300" : "text-white group-hover:text-cyan-300"}`}>
                                    {bundle.name}
                                  </h4>
                                </div>
                                <span
                                  className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider shrink-0"
                                  style={{
                                    backgroundColor: `${bundle.accentGlow}20`,
                                    color: bundle.accentGlow,
                                    border: `1px solid ${bundle.accentGlow}40`
                                  }}
                                >
                                  {bundle.rarity}
                                </span>
                              </div>

                              <p className="text-xs text-slate-300 font-mono mt-0.5">
                                {bundle.tagline}
                              </p>

                              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                                {bundle.description}
                              </p>

                              {/* Features Pills */}
                              <div className="flex flex-wrap gap-1.5 mt-2.5">
                                {bundle.features.map((feat, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300"
                                  >
                                    {feat}
                                  </span>
                                ))}
                              </div>

                              <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                                <span className="text-[10px] font-mono text-slate-400">
                                  1-Piece Complete Costume
                                </span>
                                {isEquipped ? (
                                  <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-400/40">
                                    <Check size={14} className="stroke-[3]" /> EQUIPPED
                                  </span>
                                ) : (
                                  <span className="text-xs font-mono font-bold text-slate-300 group-hover:text-cyan-300 flex items-center gap-1">
                                    Equip Bundle →
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. PRESETS / ARCHETYPES */}
                {activeTab === "presets" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white">Robot Body Archetypes</h3>
                        <p className="text-xs text-slate-400 font-mono">
                          Unique mechanical base designs with distinct chassis structures
                        </p>
                      </div>
                      <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-500/30">
                        {AVATAR_PRESETS.length} Archetypes
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {AVATAR_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => handleApplyPreset(preset.config)}
                          className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-400/50 flex items-center gap-3.5 cursor-pointer transition text-left group shadow-sm active:scale-98"
                        >
                          <AvatarThumbnail
                            baseConfig={preset.config}
                            overrideConfig={{}}
                            size={64}
                            className="rounded-2xl shrink-0 group-hover:scale-105 transition-transform border border-white/15"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                              {preset.name}
                            </h4>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold">
                              {preset.tag}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. POSE & MOTION ARCHETYPES */}
                {activeTab === "pose" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white">Robot Pose & Motion Styles</h3>
                        <p className="text-xs text-slate-400 font-mono">
                          Select the motion archetype, posture, and facial expression dynamics
                        </p>
                      </div>
                      <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-500/30">
                        {POSE_DEFINITIONS.length} Poses
                      </span>
                    </div>

                    {/* Quick Still vs Dynamic Filter Info Banner */}
                    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-950/40 via-cyan-950/40 to-slate-900/60 border border-cyan-500/20 flex items-center gap-3">
                      <span className="text-xl">✨</span>
                      <p className="text-xs text-slate-300 font-mono">
                        Choose between stationary still postures or expressive cyber-motion loops (floating, smiling, battle surge, precision focus).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {POSE_DEFINITIONS.map((pose) => {
                        const isSelected = activeMood === pose.id || config.customPose === pose.id;
                        return (
                          <button
                            key={pose.id}
                            onClick={() => {
                              setActiveMood(pose.id);
                              updateConfig("customPose", pose.id);
                            }}
                            onMouseEnter={() => {
                              setActiveMood(pose.id);
                            }}
                            onMouseLeave={() => {
                              setActiveMood(config.customPose || "idle");
                            }}
                            className={`p-3.5 rounded-2xl border text-left cursor-pointer transition flex items-start gap-3.5 relative group active:scale-98 ${
                              isSelected
                                ? "bg-cyan-950/70 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]"
                                : "bg-white/[0.03] hover:bg-white/[0.08] border-white/10 hover:border-cyan-400/40"
                            }`}
                          >
                            <div className="relative shrink-0">
                              <AvatarThumbnail
                                baseConfig={config}
                                overrideConfig={{ customPose: pose.id }}
                                size={68}
                                className={`rounded-2xl border ${
                                  isSelected ? "border-cyan-400/60 bg-black/40" : "border-white/15 bg-black/30"
                                }`}
                              />
                              <div className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-slate-900 border border-white/20 flex items-center justify-center text-xs shadow">
                                {pose.icon}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1.5">
                                <h4
                                  className={`text-sm font-bold truncate transition-colors ${
                                    isSelected ? "text-cyan-300" : "text-white group-hover:text-cyan-200"
                                  }`}
                                >
                                  {pose.name}
                                </h4>
                                {isSelected && (
                                  <span className="w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center shrink-0 shadow-sm">
                                    <Check size={13} className="stroke-[3]" />
                                  </span>
                                )}
                              </div>

                              <div className="mt-1">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-md border text-[9px] font-mono font-bold uppercase tracking-wider ${pose.badgeColor}`}
                                >
                                  {pose.badge}
                                </span>
                              </div>

                              <p className="text-[11px] text-slate-400 font-mono mt-1.5 line-clamp-2 leading-relaxed">
                                {pose.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. HEAD GEOMETRY */}
                {activeTab === "head" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-white">Head Geometry & Shell</h3>
                      <p className="text-xs text-slate-400 font-mono">
                        Molded capsule and mechanical head archetypes with directional light crests.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {(
                        [
                          { id: "capsule", name: "Classic Capsule" },
                          { id: "compact_dome", name: "Compact Dome" },
                          { id: "panoramic_visor", name: "Panoramic Visor" },
                          { id: "tall_capsule", name: "Tall Capsule" },
                          { id: "soft_square", name: "Chiseled Square" },
                          { id: "orbital", name: "Orbital Halo Dome" },
                          { id: "tech_angular", name: "Tech Angular" },
                          { id: "floating_core", name: "Floating Core" }
                        ] as { id: RobotHeadShape; name: string }[]
                      ).map((h) => {
                        const selected = config.headShape === h.id;
                        return (
                          <button
                            key={h.id}
                            onClick={() => updateConfig("headShape", h.id)}
                            className={`p-3 rounded-2xl flex flex-col items-center gap-2 border transition cursor-pointer active:scale-95 ${
                              selected
                                ? "bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400"
                                : "bg-white/[0.03] hover:bg-white/[0.08] border-white/10"
                            }`}
                          >
                            <AvatarThumbnail
                              baseConfig={config}
                              overrideConfig={{ headShape: h.id }}
                              size={64}
                            />
                            <span className={`text-xs font-mono font-medium ${selected ? "text-cyan-300 font-bold" : "text-slate-300"}`}>
                              {h.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. VISOR SCREEN */}
                {activeTab === "screen" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-white">Display Visor Shape</h3>
                      <p className="text-xs text-slate-400 font-mono">
                        Recessed cavity display with glossy obsidian glass refraction.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {(
                        [
                          { id: "classic_capsule", name: "Classic Capsule" },
                          { id: "panoramic_wide", name: "Panoramic Wide" },
                          { id: "soft_square", name: "Soft Square" },
                          { id: "compact_window", name: "Compact Window" },
                          { id: "angular_visor", name: "Angular Visor" },
                          { id: "slit_matrix", name: "Slit Matrix" }
                        ] as { id: RobotScreenShape; name: string }[]
                      ).map((s) => {
                        const selected = config.screenShape === s.id;
                        return (
                          <button
                            key={s.id}
                            onClick={() => updateConfig("screenShape", s.id)}
                            className={`p-3 rounded-2xl flex flex-col items-center gap-2 border transition cursor-pointer active:scale-95 ${
                              selected
                                ? "bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400"
                                : "bg-white/[0.03] hover:bg-white/[0.08] border-white/10"
                            }`}
                          >
                            <AvatarThumbnail
                              baseConfig={config}
                              overrideConfig={{ screenShape: s.id }}
                              size={64}
                            />
                            <span className={`text-xs font-mono font-medium ${selected ? "text-cyan-300 font-bold" : "text-slate-300"}`}>
                              {s.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. EYES & FACE (With Sub-Tabs) */}
                {activeTab === "face" && (
                  <div className="space-y-4">
                    {/* Sub-Tabs: Eyes vs Mouth */}
                    <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10">
                      <button
                        onClick={() => setFaceSubTab("eyes")}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                          faceSubTab === "eyes"
                            ? "bg-cyan-500 text-black shadow-sm"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        👁️ Digital Eyes
                      </button>
                      <button
                        onClick={() => setFaceSubTab("mouth")}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                          faceSubTab === "mouth"
                            ? "bg-cyan-500 text-black shadow-sm"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        👄 Mouth Waveform
                      </button>
                    </div>

                    {faceSubTab === "eyes" ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {(
                          [
                            { id: "large_digital", name: "Large Digital" },
                            { id: "soft_digital", name: "Soft Digital" },
                            { id: "anime_digital", name: "Anime Sparkle" },
                            { id: "pixel", name: "Pixel Matrix" },
                            { id: "dot", name: "Minimal Dots" },
                            { id: "led_visor", name: "LED Visor" },
                            { id: "visor_bar", name: "Visor Bar" },
                            { id: "dual_pupil", name: "Dual Pupil" },
                            { id: "focus_crosshair", name: "Focus Crosshair" }
                          ] as { id: RobotEyeStyle; name: string }[]
                        ).map((e) => {
                          const selected = config.eyeStyle === e.id;
                          return (
                            <button
                              key={e.id}
                              onClick={() => updateConfig("eyeStyle", e.id)}
                              className={`p-3 rounded-2xl flex flex-col items-center gap-2 border transition cursor-pointer active:scale-95 ${
                                selected
                                  ? "bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400"
                                  : "bg-white/[0.03] hover:bg-white/[0.08] border-white/10"
                              }`}
                            >
                              <AvatarThumbnail
                                baseConfig={config}
                                overrideConfig={{ eyeStyle: e.id }}
                                size={60}
                              />
                              <span className={`text-xs font-mono font-medium ${selected ? "text-cyan-300 font-bold" : "text-slate-300"}`}>
                                {e.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {(
                          [
                            { id: "digital_smile", name: "Digital Smile" },
                            { id: "open_smile", name: "Open Smile" },
                            { id: "small_smile", name: "Small Smile" },
                            { id: "waveform", name: "Audio Waveform" },
                            { id: "pixel_smile", name: "Pixel Smile" },
                            { id: "dot_mouth", name: "Dot Mouth" },
                            { id: "tiny_line", name: "Minimal Line" },
                            { id: "none", name: "No Mouth (Minimal)" }
                          ] as { id: RobotMouthStyle; name: string }[]
                        ).map((m) => {
                          const selected = config.mouthStyle === m.id;
                          return (
                            <button
                              key={m.id}
                              onClick={() => updateConfig("mouthStyle", m.id)}
                              className={`p-3 rounded-xl text-center border transition cursor-pointer active:scale-95 ${
                                selected
                                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold"
                                  : "bg-white/[0.02] hover:bg-white/[0.06] border-white/10 text-slate-300"
                              }`}
                            >
                              <span className="text-xs font-mono">{m.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 5. SHELL MATERIAL COLOR */}
                {activeTab === "shell" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-white">Molded Shell Color</h3>
                      <p className="text-xs text-slate-400 font-mono">
                        Directional satin plastic finish with ambient form lighting.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {PRIMARY_SHELL_COLORS.map((c) => {
                        const selected = config.primaryColor === c.hex;
                        return (
                          <button
                            key={c.id}
                            onClick={() => updateConfig("primaryColor", c.hex)}
                            className={`p-3 rounded-2xl flex items-center gap-3 border transition cursor-pointer text-left active:scale-95 ${
                              selected
                                ? "bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400"
                                : "bg-white/[0.03] hover:bg-white/[0.08] border-white/10"
                            }`}
                          >
                            <div
                              className="w-10 h-10 rounded-xl border border-white/20 shadow-md shrink-0"
                              style={{ backgroundColor: c.hex }}
                            />
                            <div className="min-w-0">
                              <span className={`text-xs font-mono font-bold truncate block ${selected ? "text-cyan-300" : "text-white"}`}>
                                {c.name}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {c.hex}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 6. ACCENT TRIM COLOR */}
                {activeTab === "accent" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-white">Joint & Trim Accent Color</h3>
                      <p className="text-xs text-slate-400 font-mono">
                        Trim color for mechanical ball sockets, ear pods, and antennas.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {ACCENT_COLORS.map((c) => {
                        const selected = config.accentColor === c.hex;
                        return (
                          <button
                            key={c.id}
                            onClick={() => {
                              updateConfig("accentColor", c.hex);
                              updateConfig("accessoryColor", c.hex);
                            }}
                            className={`p-3 rounded-2xl flex items-center gap-3 border transition cursor-pointer text-left active:scale-95 ${
                              selected
                                ? "bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400"
                                : "bg-white/[0.03] hover:bg-white/[0.08] border-white/10"
                            }`}
                          >
                            <div
                              className="w-10 h-10 rounded-xl border border-white/20 shadow-md shrink-0"
                              style={{ backgroundColor: c.hex }}
                            />
                            <div className="min-w-0">
                              <span className={`text-xs font-mono font-bold truncate block ${selected ? "text-cyan-300" : "text-white"}`}>
                                {c.name}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {c.hex}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 7. SCREEN GLOW COLOR */}
                {activeTab === "glow" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-white">Screen LED Glow Color</h3>
                      <p className="text-xs text-slate-400 font-mono">
                        Phosphor luminescence for digital eyes, reactor cores, and thrusters.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {SCREEN_GLOW_COLORS.map((c) => {
                        const selected = config.screenGlowColor === c.hex;
                        return (
                          <button
                            key={c.id}
                            onClick={() => updateConfig("screenGlowColor", c.hex)}
                            className={`p-3 rounded-2xl flex items-center gap-3 border transition cursor-pointer text-left active:scale-95 ${
                              selected
                                ? "bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400"
                                : "bg-white/[0.03] hover:bg-white/[0.08] border-white/10"
                            }`}
                          >
                            <div
                              className="w-10 h-10 rounded-xl border border-white/20 shadow-inner shrink-0 relative flex items-center justify-center bg-[#070B18]"
                            >
                              <div
                                className="w-5 h-5 rounded-full blur-[2px]"
                                style={{ backgroundColor: c.hex }}
                              />
                            </div>
                            <div className="min-w-0">
                              <span className={`text-xs font-mono font-bold truncate block ${selected ? "text-cyan-300" : "text-white"}`}>
                                {c.name}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                Glow {c.hex}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 8. ANTENNA */}
                {activeTab === "antenna" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-white">Antenna Modules</h3>
                      <p className="text-xs text-slate-400 font-mono">
                        Head-socketed communication receptors and orbital beacons.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {(
                        [
                          { id: "single_led", name: "Single LED Mast" },
                          { id: "double_antenna", name: "Dual Sensors" },
                          { id: "orb_beacon", name: "Orb Beacon" },
                          { id: "orbital_ring", name: "Orbital Halo" },
                          { id: "satellite_dish", name: "Radar Dish" },
                          { id: "lightning_fin", name: "Cyber Fin" },
                          { id: "star_reactor", name: "Star Reactor" },
                          { id: "none", name: "Smooth Dome" }
                        ] as { id: RobotAntennaStyle; name: string }[]
                      ).map((ant) => {
                        const selected = config.antennaStyle === ant.id;
                        return (
                          <button
                            key={ant.id}
                            onClick={() => updateConfig("antennaStyle", ant.id)}
                            className={`p-3 rounded-2xl flex flex-col items-center gap-2 border transition cursor-pointer active:scale-95 ${
                              selected
                                ? "bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400"
                                : "bg-white/[0.03] hover:bg-white/[0.08] border-white/10"
                            }`}
                          >
                            <AvatarThumbnail
                              baseConfig={config}
                              overrideConfig={{ antennaStyle: ant.id }}
                              size={60}
                            />
                            <span className={`text-xs font-mono font-medium ${selected ? "text-cyan-300 font-bold" : "text-slate-300"}`}>
                              {ant.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 9. EAR MODULES */}
                {activeTab === "ear_modules" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-white">Side Sockets & Ear Modules</h3>
                      <p className="text-xs text-slate-400 font-mono">
                        Acoustic speaker grills, glowing LED halo rings, and cooling fins.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {(
                        [
                          { id: "speaker_grill", name: "Acoustic Grill" },
                          { id: "led_halo_rings", name: "LED Halo Rings" },
                          { id: "mechanical_discs", name: "Metal Discs" },
                          { id: "comm_pods", name: "Comm Pods" },
                          { id: "cooling_fins", name: "Cooling Fins" },
                          { id: "headphones", name: "Studio Headset" },
                          { id: "none", name: "Smooth Sides" }
                        ] as { id: RobotEarModule; name: string }[]
                      ).map((em) => {
                        const selected = config.earModule === em.id;
                        return (
                          <button
                            key={em.id}
                            onClick={() => updateConfig("earModule", em.id)}
                            className={`p-3 rounded-2xl flex flex-col items-center gap-2 border transition cursor-pointer active:scale-95 ${
                              selected
                                ? "bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400"
                                : "bg-white/[0.03] hover:bg-white/[0.08] border-white/10"
                            }`}
                          >
                            <AvatarThumbnail
                              baseConfig={config}
                              overrideConfig={{ earModule: em.id }}
                              size={60}
                            />
                            <span className={`text-xs font-mono font-medium ${selected ? "text-cyan-300 font-bold" : "text-slate-300"}`}>
                              {em.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 10. BODY CHASSIS */}
                {activeTab === "body" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-white">Body Chassis Archetype</h3>
                      <p className="text-xs text-slate-400 font-mono">
                        Mini Militia proportions with bold silhouettes and form shading.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {(
                        [
                          { id: "compact", name: "Classic Mascot" },
                          { id: "explorer", name: "Explorer Armor" },
                          { id: "tech", name: "Tech Frame" },
                          { id: "floating_pod", name: "Floating Pod" },
                          { id: "mini", name: "Mini Agile" },
                          { id: "heavy", name: "Titan Armored" }
                        ] as { id: RobotBodyArchetype; name: string }[]
                      ).map((b) => {
                        const selected = config.bodyArchetype === b.id;
                        return (
                          <button
                            key={b.id}
                            onClick={() => updateConfig("bodyArchetype", b.id)}
                            className={`p-3 rounded-2xl flex flex-col items-center gap-2 border transition cursor-pointer active:scale-95 ${
                              selected
                                ? "bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400"
                                : "bg-white/[0.03] hover:bg-white/[0.08] border-white/10"
                            }`}
                          >
                            <AvatarThumbnail
                              baseConfig={config}
                              overrideConfig={{ bodyArchetype: b.id }}
                              size={64}
                            />
                            <span className={`text-xs font-mono font-medium ${selected ? "text-cyan-300 font-bold" : "text-slate-300"}`}>
                              {b.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 11. CHEST CORE */}
                {activeTab === "chest" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-white">Chest Core & Reactors</h3>
                      <p className="text-xs text-slate-400 font-mono">
                        Glowing learning reactor cores and power gauges.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {(
                        [
                          { id: "aifluence_logo", name: "AIfluence AI Core" },
                          { id: "photon_reactor", name: "Photon Core" },
                          { id: "pulse_heart", name: "Heart Matrix" },
                          { id: "xp_crystal", name: "XP Crystal" },
                          { id: "energy_gauge", name: "Energy Gauge" },
                          { id: "tech_badge", name: "Tech Emblem" },
                          { id: "none", name: "Smooth Panel" }
                        ] as { id: RobotChestCore; name: string }[]
                      ).map((c) => {
                        const selected = config.chestCore === c.id;
                        const unlocked = isUnlocked(c.id);
                        return (
                          <button
                            key={c.id}
                            disabled={!unlocked}
                            onClick={() => updateConfig("chestCore", c.id)}
                            className={`p-3 rounded-2xl flex flex-col items-center gap-2 border transition cursor-pointer relative active:scale-95 ${
                              selected
                                ? "bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400"
                                : unlocked
                                ? "bg-white/[0.03] hover:bg-white/[0.08] border-white/10"
                                : "bg-black/40 border-white/5 opacity-50 cursor-not-allowed"
                            }`}
                          >
                            {!unlocked && (
                              <div className="absolute top-2 right-2 p-1 rounded-full bg-black/80 text-amber-400">
                                <Lock size={12} />
                              </div>
                            )}
                            <AvatarThumbnail
                              baseConfig={config}
                              overrideConfig={{ chestCore: c.id }}
                              size={60}
                            />
                            <span className={`text-xs font-mono font-medium ${selected ? "text-cyan-300 font-bold" : "text-slate-300"}`}>
                              {c.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 12. LIMBS (ARMS & HANDS) */}
                {activeTab === "limbs" && (
                  <div className="space-y-4">
                    <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10">
                      <button
                        onClick={() => setLimbSubTab("arms")}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                          limbSubTab === "arms"
                            ? "bg-cyan-500 text-black shadow-sm"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        🦾 Arm Structure
                      </button>
                      <button
                        onClick={() => setLimbSubTab("hands")}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                          limbSubTab === "hands"
                            ? "bg-cyan-500 text-black shadow-sm"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        ✋ Hand & Grippers
                      </button>
                    </div>

                    {limbSubTab === "arms" ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {(
                          [
                            { id: "smooth_satin", name: "Smooth Satin" },
                            { id: "mechanical_segmented", name: "Segmented Arm" },
                            { id: "flexible_bellows", name: "Flexible Bellows" },
                            { id: "armored_tech", name: "Armored Pauldrons" },
                            { id: "mini_paws", name: "Mini Paws" }
                          ] as { id: RobotArmStyle; name: string }[]
                        ).map((arm) => {
                          const selected = config.armStyle === arm.id;
                          return (
                            <button
                              key={arm.id}
                              onClick={() => updateConfig("armStyle", arm.id)}
                              className={`p-3 rounded-2xl flex flex-col items-center gap-2 border transition cursor-pointer active:scale-95 ${
                                selected
                                  ? "bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400"
                                  : "bg-white/[0.03] hover:bg-white/[0.08] border-white/10"
                              }`}
                            >
                              <AvatarThumbnail
                                baseConfig={config}
                                overrideConfig={{ armStyle: arm.id }}
                                size={60}
                              />
                              <span className={`text-xs font-mono font-medium ${selected ? "text-cyan-300 font-bold" : "text-slate-300"}`}>
                                {arm.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {(
                          [
                            { id: "mitten", name: "Rounded Mitten" },
                            { id: "three_finger", name: "3-Finger Hand" },
                            { id: "four_finger", name: "4-Finger Hand" },
                            { id: "claw_grabber", name: "Claw Gripper" },
                            { id: "open_palm", name: "Tactile Palm" }
                          ] as { id: RobotHandStyle; name: string }[]
                        ).map((hand) => {
                          const selected = config.handStyle === hand.id;
                          return (
                            <button
                              key={hand.id}
                              onClick={() => updateConfig("handStyle", hand.id)}
                              className={`p-3 rounded-2xl flex flex-col items-center gap-2 border transition cursor-pointer active:scale-95 ${
                                selected
                                  ? "bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400"
                                  : "bg-white/[0.03] hover:bg-white/[0.08] border-white/10"
                              }`}
                            >
                              <AvatarThumbnail
                                baseConfig={config}
                                overrideConfig={{ handStyle: hand.id }}
                                size={60}
                              />
                              <span className={`text-xs font-mono font-medium ${selected ? "text-cyan-300 font-bold" : "text-slate-300"}`}>
                                {hand.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 13. LEGS & PROPULSION */}
                {activeTab === "legs" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-white">Legs & Propulsion Systems</h3>
                      <p className="text-xs text-slate-400 font-mono">
                        Chunky boots, anti-grav hover thrusters, and explorer treads.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {(
                        [
                          { id: "short_sturdy", name: "Short Sturdy Legs" },
                          { id: "hover_thruster", name: "Hover Thruster" },
                          { id: "mechanical_struts", name: "Mechanical Struts" },
                          { id: "explorer_treads", name: "Explorer Treads" },
                          { id: "compact_pegs", name: "Compact Pegs" }
                        ] as { id: RobotLegStyle; name: string }[]
                      ).map((l) => {
                        const selected = config.legStyle === l.id;
                        const unlocked = true;
                        return (
                          <button
                            key={l.id}
                            disabled={!unlocked}
                            onClick={() => updateConfig("legStyle", l.id)}
                            className={`p-3 rounded-2xl flex flex-col items-center gap-2 border transition cursor-pointer relative active:scale-95 ${
                              selected
                                ? "bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400"
                                : unlocked
                                ? "bg-white/[0.03] hover:bg-white/[0.08] border-white/10"
                                : "bg-black/40 border-white/5 opacity-50 cursor-not-allowed"
                            }`}
                          >
                            {!unlocked && (
                              <div className="absolute top-2 right-2 p-1 rounded-full bg-black/80 text-amber-400">
                                <Lock size={12} />
                              </div>
                            )}
                            <AvatarThumbnail
                              baseConfig={config}
                              overrideConfig={{ legStyle: l.id }}
                              size={64}
                            />
                            <span className={`text-xs font-mono font-medium ${selected ? "text-cyan-300 font-bold" : "text-slate-300"}`}>
                              {l.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 14. ACCESSORIES */}
                {activeTab === "accessories" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-white">Unlockable Cosmetics & Gear</h3>
                      <p className="text-xs text-slate-400 font-mono">
                        Trophy accessories unlocked through learning streaks and XP milestones.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {(
                        [
                          { id: "none", name: "No Accessory" },
                          { id: "crown", name: "Grandmaster Crown" },
                          { id: "cap", name: "Sport Cap" },
                          { id: "visor", name: "Cyber Visor" },
                          { id: "jetpack", name: "Cosmic Jetpack" },
                          { id: "backpack", name: "Scholar Backpack" },
                          { id: "scarf", name: "Hero Scarf" },
                          { id: "floating_companion", name: "Mini Drone Orb" }
                        ] as { id: RobotAccessory; name: string }[]
                      ).map((acc) => {
                        const selected = config.accessory === acc.id;
                        const unlocked = isUnlocked(acc.id);
                        return (
                          <button
                            key={acc.id}
                            disabled={!unlocked}
                            onClick={() => updateConfig("accessory", acc.id)}
                            className={`p-3 rounded-2xl flex flex-col items-center gap-2 border transition cursor-pointer relative active:scale-95 ${
                              selected
                                ? "bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400"
                                : unlocked
                                ? "bg-white/[0.03] hover:bg-white/[0.08] border-white/10"
                                : "bg-black/40 border-white/5 opacity-50 cursor-not-allowed"
                            }`}
                          >
                            {!unlocked && (
                              <div className="absolute top-2 right-2 p-1 rounded-full bg-black/80 text-amber-400">
                                <Lock size={12} />
                              </div>
                            )}
                            <AvatarThumbnail
                              baseConfig={config}
                              overrideConfig={{ accessory: acc.id }}
                              size={64}
                            />
                            <span className={`text-xs font-mono font-medium ${selected ? "text-cyan-300 font-bold" : "text-slate-300"}`}>
                              {acc.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 15. BACKDROP AURA */}
                {activeTab === "background" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-white">Backdrop Canvas Aura</h3>
                      <p className="text-xs text-slate-400 font-mono">
                        Atmospheric lighting aura rendered behind your companion across the platform.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {BACKGROUND_COLORS.map((bg) => {
                        const selected = config.backgroundColor === bg.hex;
                        return (
                          <button
                            key={bg.id}
                            onClick={() => updateConfig("backgroundColor", bg.hex)}
                            className={`p-3 rounded-2xl flex items-center gap-3 border transition cursor-pointer text-left active:scale-95 ${
                              selected
                                ? "bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400"
                                : "bg-white/[0.03] hover:bg-white/[0.08] border-white/10"
                            }`}
                          >
                            <div
                              className="w-10 h-10 rounded-xl border border-white/20 shadow-md shrink-0"
                              style={{ backgroundColor: bg.hex }}
                            />
                            <div className="min-w-0">
                              <span className={`text-xs font-mono font-bold truncate block ${selected ? "text-cyan-300" : "text-white"}`}>
                                {bg.name}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {bg.hex}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                </>
              )}
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const AvatarStudioPage = AvatarStudioModal;
export default AvatarStudioModal;
