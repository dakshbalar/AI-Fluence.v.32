import React, { useMemo } from "react";
import { motion } from "motion/react";
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
  Point2D,
  calculateRobotRig,
  getShellShades,
  getAccentShades,
  getScreenShades,
  getMetalShades,
  getRubberShades
} from "./robotRig";

export interface AIfluenceAvatarProps {
  config?: AvatarConfig;
  mood?: CharacterMood;
  size?: number;
  className?: string;
  showBackground?: boolean;
  animate?: boolean;
  faceZoom?: boolean;
  enable3DTilt?: boolean;
}

// Normalizes legacy or partial configs to complete Robot Avatar format
export function normalizeRobotConfig(raw?: Partial<AvatarConfig>): AvatarConfig {
  const cfg = raw || {};

  // Head shape
  let headShape: RobotHeadShape = (cfg.headShape as any) || "capsule";
  if ((headShape as any) === "soft_dome") headShape = "compact_dome";
  if ((headShape as any) === "wide_capsule") headShape = "panoramic_visor";
  if ((headShape as any) === "rounded_square") headShape = "soft_square";

  // Screen shape
  let screenShape: RobotScreenShape = (cfg.screenShape as any) || "classic_capsule";
  if ((screenShape as any) === "wide_capsule") screenShape = "classic_capsule";
  if ((screenShape as any) === "panoramic") screenShape = "panoramic_wide";
  if ((screenShape as any) === "rounded_rectangle") screenShape = "classic_capsule";
  if ((screenShape as any) === "compact") screenShape = "compact_window";

  // Body archetype
  let bodyArchetype: RobotBodyArchetype = (cfg.bodyArchetype as any) || "compact";
  if ((bodyArchetype as any) === "friendly") bodyArchetype = "compact";

  // Arm style
  let armStyle: RobotArmStyle = (cfg.armStyle as any) || "smooth_satin";
  if ((armStyle as any) === "rounded") armStyle = "smooth_satin";
  if ((armStyle as any) === "mechanical") armStyle = "mechanical_segmented";
  if ((armStyle as any) === "tech_segmented") armStyle = "armored_tech";
  if ((armStyle as any) === "soft_robotic") armStyle = "flexible_bellows";

  // Hand style
  let handStyle: RobotHandStyle = (cfg.handStyle as any) || "mitten";
  if ((handStyle as any) === "claw") handStyle = "claw_grabber";
  if ((handStyle as any) === "digital_pad") handStyle = "open_palm";

  // Leg style
  let legStyle: RobotLegStyle = (cfg.legStyle as any) || "short_sturdy";
  if ((legStyle as any) === "rounded_legs") legStyle = "short_sturdy";

  // Antenna style
  let antennaStyle: RobotAntennaStyle = (cfg.antennaStyle as any) || "single_led";
  if ((antennaStyle as any) === "single_ball") antennaStyle = "single_led";
  if ((antennaStyle as any) === "tall_led") antennaStyle = "single_led";
  if ((antennaStyle as any) === "star_tip") antennaStyle = "star_reactor";
  if ((antennaStyle as any) === "ring_antenna") antennaStyle = "orbital_ring";
  if ((antennaStyle as any) === "small_stub") antennaStyle = "orb_beacon";

  // Ear module
  let earModule: RobotEarModule = (cfg.earModule as any) || "speaker_grill";
  if ((earModule as any) === "round_ears") earModule = "speaker_grill";
  if ((earModule as any) === "speaker_pods") earModule = "speaker_grill";
  if ((earModule as any) === "led_rings") earModule = "led_halo_rings";
  if ((earModule as any) === "side_fins") earModule = "cooling_fins";

  // Chest core
  let chestCore: RobotChestCore = (cfg.chestCore as any) || "aifluence_logo";
  if ((chestCore as any) === "glowing_core") chestCore = "photon_reactor";
  if ((chestCore as any) === "star_reactor") chestCore = "photon_reactor";
  if ((chestCore as any) === "energy_bar") chestCore = "energy_gauge";

  // Colors
  const primaryColor = cfg.primaryColor || (cfg.skinTone ? "#F8FAFC" : "#F8FAFC");
  const accentColor = cfg.accentColor || (cfg.glassesColor ? "#00E5FF" : "#00E5FF");
  const screenGlowColor = cfg.screenGlowColor || "#00E5FF";
  const backgroundColor = cfg.backgroundColor || "#2563EB";

  return {
    headShape,
    screenShape,
    eyeStyle: cfg.eyeStyle || "large_digital",
    mouthStyle: cfg.mouthStyle || "digital_smile",
    screenGlowColor,
    primaryColor,
    accentColor,
    antennaStyle,
    earModule,
    bodyArchetype,
    chestCore,
    armStyle,
    handStyle,
    legStyle,
    feetStyle: cfg.feetStyle || "rounded_boots",
    accessory: (cfg.accessory as RobotAccessory) || "none",
    accessoryColor: cfg.accessoryColor || accentColor,
    backgroundColor,
    skinOutfit: (cfg.skinOutfit as RobotSkinOutfit) || "none",
    activeBundle: (cfg as any).activeBundle || (cfg.skinOutfit && cfg.skinOutfit !== "none" ? (cfg.skinOutfit as string) : undefined),
    customPose: cfg.customPose || "idle"
  };
}

export const AIfluenceAvatar: React.FC<AIfluenceAvatarProps> = ({
  config,
  mood,
  size = 200,
  className = "",
  showBackground = true,
  animate = true,
  faceZoom = false,
  enable3DTilt = true,
}) => {
  const norm = useMemo(() => normalizeRobotConfig(config), [config]);
  // Explicit mood prop overrides config.customPose (essential for neutral editor preview & thumbnail rendering)
  const activeMood = mood !== undefined ? mood : norm.customPose || "idle";

  // Interactive 3D Parallax & Gyroscopic Depth
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enable3DTilt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: -y * 22,
      y: x * 22,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    if (enable3DTilt) setIsHovered(true);
  };

  // Compute mathematical rig anchors and paths with kinematic pose solver
  const rig = useMemo(
    () =>
      calculateRobotRig(
        norm.headShape,
        norm.screenShape,
        norm.bodyArchetype,
        norm.armStyle,
        norm.handStyle,
        norm.legStyle,
        activeMood
      ),
    [
      norm.headShape,
      norm.screenShape,
      norm.bodyArchetype,
      norm.armStyle,
      norm.handStyle,
      norm.legStyle,
      activeMood
    ]
  );

  // Compute 2.5D directional material shading palettes
  const shell = useMemo(() => getShellShades(norm.primaryColor), [norm.primaryColor]);
  const accent = useMemo(() => getAccentShades(norm.accentColor), [norm.accentColor]);
  const screen = useMemo(() => getScreenShades(norm.screenGlowColor), [norm.screenGlowColor]);
  const metal = useMemo(() => getMetalShades("#94A3B8"), []);
  const rubber = useMemo(() => getRubberShades(), []);

  // Unique ID prefix for gradients/filters
  const uid = useMemo(() => Math.random().toString(36).substring(2, 9), []);

  // Mood Animation Variants
  const robotVariants = {
    idle: {
      y: [0, -5, 0],
      rotate: [0, 0.4, -0.4, 0],
      transition: { duration: 3.4, repeat: Infinity, ease: "easeInOut" }
    },
    thinking: {
      y: [0, -3, 0],
      rotate: [0, -3.5, -3.5, 0],
      transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
    },
    curious: {
      rotate: [-6, -7, -6],
      y: [0, -4, 0],
      transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
    },
    happy: {
      y: [0, -10, 0],
      scale: [1, 1.02, 1],
      transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
    },
    excited: {
      y: [0, -14, 0],
      scale: [1, 1.04, 1],
      rotate: [0, 2, -2, 0],
      transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
    },
    celebrating: {
      y: [0, -16, 0],
      rotate: [-3, 3, -3],
      scale: [1, 1.05, 1],
      transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" }
    },
    streak: {
      y: [0, -12, 0],
      scale: [1, 1.03, 1],
      transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
    },
    levelUp: {
      y: [0, -18, 0],
      scale: [1, 1.07, 1],
      rotate: [-4, 4, -4],
      transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
    },
    encouraging: {
      y: [0, -6, 0],
      rotate: [0, 1.5, 0],
      transition: { duration: 2.0, repeat: Infinity, ease: "easeInOut" }
    },
    determined: {
      y: [0, -4, 0],
      scale: [1, 1.01, 1],
      transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
    },
    confused: {
      rotate: [4, 6, 4],
      y: [0, -3, 0],
      transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
    },
    sad: {
      y: [0, 3, 0],
      scale: [1, 0.98, 1],
      rotate: [0, -1, 0],
      transition: { duration: 3.0, repeat: Infinity, ease: "easeInOut" }
    },
    surprised: {
      y: [0, -12, 0],
      scale: [1, 1.04, 1],
      transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
    },
    sleep: {
      y: [0, 2, 0],
      rotate: [0, 1, 0],
      transition: { duration: 4.0, repeat: Infinity, ease: "easeInOut" }
    },
    wave: {
      y: [0, -6, 0],
      rotate: [0, 2, 0],
      transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
    },
    dance: {
      y: [0, -10, 0, -8, 0],
      rotate: [-4, 4, -3, 3, -4],
      scale: [1, 1.03, 0.99, 1.03, 1],
      transition: { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
    },
    proud: {
      y: [0, -7, 0],
      scale: [1, 1.02, 1],
      transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
    },
    still: {
      y: [0, 0],
      rotate: [0, 0],
      scale: [1, 1],
      transition: { duration: 0.1 }
    },
    angry: {
      y: [0, -3, 0, -2, 0],
      rotate: [-1.5, 1.5, -1, 1, 0],
      scale: [1, 1.02, 0.99, 1.02, 1],
      transition: { duration: 0.75, repeat: Infinity, ease: "easeInOut" }
    },
    heroic: {
      y: [0, -6, 0],
      scale: [1, 1.03, 1],
      rotate: [0, 0.8, -0.8, 0],
      transition: { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
    },
    focused: {
      y: [0, -3, 0],
      scale: [1, 1.01, 1],
      transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
    }
  };

  // ----------------------------------------------------
  // SUB-RENDERERS (Component Layers)
  // ----------------------------------------------------

  // 1. ANTENNA SYSTEM
  const renderAntenna = () => {
    const top = rig.antennaSocket;
    const ant = norm.antennaStyle;
    if (ant === "none") return null;

    return (
      <g id="robot-antenna">
        {/* Antenna Base Contact Shadow onto Head Shell */}
        <ellipse
          cx={top.x + 3}
          cy={top.y + 4}
          rx={10}
          ry={3.5}
          fill="#000000"
          opacity={0.35}
        />

        {/* Base Mechanical Socket Collar (Rubber Bushing & Metal Ring) */}
        <ellipse
          cx={top.x}
          cy={top.y + 2}
          rx={8.5}
          ry={3.5}
          fill={rubber.deepShadow}
        />
        <ellipse
          cx={top.x}
          cy={top.y}
          rx={7.5}
          ry={3}
          fill={accent.base}
          stroke={accent.outline}
          strokeWidth={1}
        />

        {ant === "double_antenna" ? (
          <g>
            {/* Left Antenna Mast */}
            <path
              d={`M ${top.x - 4} ${top.y} L ${top.x - 22} ${top.y - 36}`}
              stroke={metal.base}
              strokeWidth={3.5}
              strokeLinecap="round"
            />
            <path
              d={`M ${top.x - 4} ${top.y} L ${top.x - 22} ${top.y - 36}`}
              stroke={metal.highlight}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            {/* Left Glowing Tip */}
            <circle
              cx={top.x - 23}
              cy={top.y - 38}
              r={7}
              fill={`url(#accent-grad-${uid})`}
              filter={`url(#screen-glow-${uid})`}
            />
            <circle cx={top.x - 24.5} cy={top.y - 40} r={2} fill="#FFFFFF" />

            {/* Right Antenna Mast */}
            <path
              d={`M ${top.x + 4} ${top.y} L ${top.x + 22} ${top.y - 36}`}
              stroke={metal.base}
              strokeWidth={3.5}
              strokeLinecap="round"
            />
            <path
              d={`M ${top.x + 4} ${top.y} L ${top.x + 22} ${top.y - 36}`}
              stroke={metal.highlight}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            {/* Right Glowing Tip */}
            <circle
              cx={top.x + 23}
              cy={top.y - 38}
              r={7}
              fill={`url(#accent-grad-${uid})`}
              filter={`url(#screen-glow-${uid})`}
            />
            <circle cx={top.x + 21.5} cy={top.y - 40} r={2} fill="#FFFFFF" />
          </g>
        ) : ant === "orb_beacon" ? (
          <g>
            {/* Short Sturdy Mast */}
            <path
              d={`M ${top.x} ${top.y} L ${top.x} ${top.y - 20}`}
              stroke={metal.base}
              strokeWidth={5}
              strokeLinecap="round"
            />
            {/* Large Floating Glowing Orb */}
            <circle
              cx={top.x}
              cy={top.y - 32}
              r={12}
              fill={`url(#accent-grad-${uid})`}
              filter={`url(#screen-glow-${uid})`}
            />
            <circle cx={top.x} cy={top.y - 32} r={8} fill={accent.light} />
            <circle cx={top.x - 3.5} cy={top.y - 35.5} r={3.5} fill="#FFFFFF" />
          </g>
        ) : ant === "orbital_ring" ? (
          <g>
            {/* Center Emitter Mast */}
            <path
              d={`M ${top.x} ${top.y} L ${top.x} ${top.y - 22}`}
              stroke={metal.base}
              strokeWidth={4}
              strokeLinecap="round"
            />
            {/* Floating Halo Ring */}
            <ellipse
              cx={top.x}
              cy={top.y - 32}
              rx={22}
              ry={8}
              fill="none"
              stroke={accent.base}
              strokeWidth={4.5}
              filter={`url(#screen-glow-${uid})`}
            />
            <ellipse
              cx={top.x}
              cy={top.y - 32}
              rx={22}
              ry={8}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={1.5}
            />
          </g>
        ) : ant === "satellite_dish" ? (
          <g>
            {/* Articulated Mast */}
            <path
              d={`M ${top.x} ${top.y} L ${top.x - 6} ${top.y - 18}`}
              stroke={metal.base}
              strokeWidth={4.5}
              strokeLinecap="round"
            />
            {/* Concave Dish */}
            <path
              d={`M ${top.x - 22} ${top.y - 32} Q ${top.x - 8} ${top.y - 14} ${top.x + 12} ${top.y - 30}`}
              fill={metal.light}
              stroke={metal.outline}
              strokeWidth={2}
            />
            {/* Center Feed Horn */}
            <line
              x1={top.x - 6}
              y1={top.y - 22}
              x2={top.x - 14}
              y2={top.y - 38}
              stroke={accent.base}
              strokeWidth={2.5}
            />
            <circle cx={top.x - 14} cy={top.y - 38} r={3.5} fill={accent.keyLight} />
          </g>
        ) : ant === "lightning_fin" ? (
          <g>
            {/* Angular Crest Fin */}
            <path
              d={`M ${top.x - 4} ${top.y} L ${top.x + 8} ${top.y - 26} L ${top.x - 2} ${top.y - 26} L ${top.x + 12} ${top.y - 44} L ${top.x - 8} ${top.y - 22} L ${top.x + 1} ${top.y - 22} Z`}
              fill={`url(#accent-grad-${uid})`}
              stroke={accent.outline}
              strokeWidth={1.5}
              filter={`url(#screen-glow-${uid})`}
            />
            <path
              d={`M ${top.x} ${top.y - 6} L ${top.x + 7} ${top.y - 25} L ${top.x + 9} ${top.y - 38}`}
              stroke="#FFFFFF"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </g>
        ) : ant === "star_reactor" ? (
          <g>
            <path
              d={`M ${top.x} ${top.y} L ${top.x} ${top.y - 22}`}
              stroke={metal.base}
              strokeWidth={4}
              strokeLinecap="round"
            />
            {/* Four-point Star */}
            <path
              d={`M ${top.x} ${top.y - 42} Q ${top.x} ${top.y - 32} ${top.x + 10} ${top.y - 32} Q ${top.x} ${top.y - 32} ${top.x} ${top.y - 22} Q ${top.x} ${top.y - 32} ${top.x - 10} ${top.y - 32} Q ${top.x} ${top.y - 32} ${top.x} ${top.y - 42} Z`}
              fill={`url(#accent-grad-${uid})`}
              filter={`url(#screen-glow-${uid})`}
            />
            <circle cx={top.x} cy={top.y - 32} r={3} fill="#FFFFFF" />
          </g>
        ) : (
          // single_led
          <g>
            {/* Metallic Mast with Specular Edge */}
            <path
              d={`M ${top.x} ${top.y} L ${top.x} ${top.y - 28}`}
              stroke={metal.base}
              strokeWidth={4}
              strokeLinecap="round"
            />
            <path
              d={`M ${top.x - 1} ${top.y} L ${top.x - 1} ${top.y - 28}`}
              stroke={metal.highlight}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            {/* Luminous Glowing Sphere Tip */}
            <circle
              cx={top.x}
              cy={top.y - 34}
              r={8}
              fill={`url(#accent-grad-${uid})`}
              filter={`url(#screen-glow-${uid})`}
            />
            <circle cx={top.x - 2} cy={top.y - 36} r={2.5} fill="#FFFFFF" />
          </g>
        )}
      </g>
    );
  };

  // 2. SIDE EAR MODULES & HEADPHONES
  const renderEarModules = () => {
    const left = rig.leftEarSocket;
    const right = rig.rightEarSocket;
    const em = norm.earModule;
    if (em === "none") return null;

    if (em === "headphones") {
      return (
        <g id="robot-headphones">
          {/* Headband Arch */}
          <path
            d={`M ${left.x + 6} ${left.y} C ${left.x} ${left.y - 95}, ${right.x} ${right.y - 95}, ${right.x - 6} ${right.y}`}
            fill="none"
            stroke={rubber.deepShadow}
            strokeWidth={11}
            strokeLinecap="round"
          />
          <path
            d={`M ${left.x + 6} ${left.y} C ${left.x} ${left.y - 95}, ${right.x} ${right.y - 95}, ${right.x - 6} ${right.y}`}
            fill="none"
            stroke={accent.base}
            strokeWidth={6}
            strokeLinecap="round"
          />
          <path
            d={`M ${left.x + 12} ${left.y - 20} C ${left.x + 6} ${left.y - 88}, ${right.x - 6} ${right.y - 88}, ${right.x - 12} ${right.y - 20}`}
            fill="none"
            stroke={accent.highlight}
            strokeWidth={1.5}
            strokeLinecap="round"
          />

          {/* Left Cushion & Ear Cup */}
          <rect
            x={left.x - 10}
            y={left.y - 22}
            width={16}
            height={44}
            rx={8}
            fill={rubber.deepShadow}
          />
          <rect
            x={left.x - 14}
            y={left.y - 18}
            width={12}
            height={36}
            rx={6}
            fill={`url(#accent-grad-${uid})`}
            stroke={accent.outline}
            strokeWidth={1.5}
          />

          {/* Right Cushion & Ear Cup */}
          <rect
            x={right.x - 6}
            y={right.y - 22}
            width={16}
            height={44}
            rx={8}
            fill={rubber.deepShadow}
          />
          <rect
            x={right.x + 2}
            y={right.y - 18}
            width={12}
            height={36}
            rx={6}
            fill={`url(#accent-grad-${uid})`}
            stroke={accent.outline}
            strokeWidth={1.5}
          />
        </g>
      );
    }

    if (em === "led_halo_rings") {
      return (
        <g id="robot-ear-modules">
          {/* Left Glowing Halo Ring */}
          <ellipse cx={left.x - 2} cy={left.y} rx={8} ry={18} fill={rubber.deepShadow} />
          <ellipse
            cx={left.x - 5}
            cy={left.y}
            rx={6}
            ry={16}
            fill="none"
            stroke={accent.base}
            strokeWidth={4}
            filter={`url(#screen-glow-${uid})`}
          />
          <ellipse cx={left.x - 5} cy={left.y} rx={6} ry={16} fill="none" stroke="#FFFFFF" strokeWidth={1} />

          {/* Right Glowing Halo Ring */}
          <ellipse cx={right.x + 2} cy={right.y} rx={8} ry={18} fill={rubber.deepShadow} />
          <ellipse
            cx={right.x + 5}
            cy={right.y}
            rx={6}
            ry={16}
            fill="none"
            stroke={accent.base}
            strokeWidth={4}
            filter={`url(#screen-glow-${uid})`}
          />
          <ellipse cx={right.x + 5} cy={right.y} rx={6} ry={16} fill="none" stroke="#FFFFFF" strokeWidth={1} />
        </g>
      );
    }

    if (em === "comm_pods") {
      return (
        <g id="robot-ear-modules">
          {/* Left Comm Pod with Mini Antenna */}
          <path
            d={`M ${left.x - 4} ${left.y - 10} L ${left.x - 12} ${left.y - 32}`}
            stroke={metal.base}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <circle cx={left.x - 12} cy={left.y - 34} r={3} fill={accent.base} filter={`url(#screen-glow-${uid})`} />
          <rect
            x={left.x - 12}
            y={left.y - 18}
            width={12}
            height={36}
            rx={6}
            fill={`url(#accent-grad-${uid})`}
            stroke={accent.outline}
            strokeWidth={1.5}
          />

          {/* Right Comm Pod */}
          <rect
            x={right.x}
            y={right.y - 18}
            width={12}
            height={36}
            rx={6}
            fill={`url(#accent-grad-${uid})`}
            stroke={accent.outline}
            strokeWidth={1.5}
          />
        </g>
      );
    }

    if (em === "cooling_fins") {
      return (
        <g id="robot-ear-modules">
          {/* Left Multi-slat Radiator Fins */}
          {[-12, -4, 4, 12].map((dy, i) => (
            <path
              key={`fin-l-${i}`}
              d={`M ${left.x + 2} ${left.y + dy} L ${left.x - 14} ${left.y + dy - 2} L ${left.x - 14} ${left.y + dy + 4} L ${left.x + 2} ${left.y + dy + 5} Z`}
              fill={metal.base}
              stroke={metal.outline}
              strokeWidth={1}
            />
          ))}

          {/* Right Multi-slat Radiator Fins */}
          {[-12, -4, 4, 12].map((dy, i) => (
            <path
              key={`fin-r-${i}`}
              d={`M ${right.x - 2} ${right.y + dy} L ${right.x + 14} ${right.y + dy - 2} L ${right.x + 14} ${right.y + dy + 4} L ${right.x - 2} ${right.y + dy + 5} Z`}
              fill={metal.base}
              stroke={metal.outline}
              strokeWidth={1}
            />
          ))}
        </g>
      );
    }

    if (em === "mechanical_discs") {
      return (
        <g id="robot-ear-modules">
          {/* Left Layered Discs */}
          <ellipse cx={left.x - 2} cy={left.y} rx={9} ry={18} fill={rubber.deepShadow} />
          <ellipse cx={left.x - 4} cy={left.y} rx={7} ry={15} fill={metal.light} stroke={metal.outline} strokeWidth={1} />
          <ellipse cx={left.x - 5} cy={left.y} rx={4} ry={10} fill={accent.base} />
          <circle cx={left.x - 5} cy={left.y} r={2} fill={metal.specular} />

          {/* Right Layered Discs */}
          <ellipse cx={right.x + 2} cy={right.y} rx={9} ry={18} fill={rubber.deepShadow} />
          <ellipse cx={right.x + 4} cy={right.y} rx={7} ry={15} fill={metal.light} stroke={metal.outline} strokeWidth={1} />
          <ellipse cx={right.x + 5} cy={right.y} rx={4} ry={10} fill={accent.base} />
          <circle cx={right.x + 5} cy={right.y} r={2} fill={metal.specular} />
        </g>
      );
    }

    // Default: speaker_grill
    return (
      <g id="robot-ear-modules">
        {/* Left Speaker Pod */}
        <ellipse cx={left.x - 2} cy={left.y} rx={9} ry={19} fill={rubber.deepShadow} />
        <ellipse
          cx={left.x - 4}
          cy={left.y}
          rx={8}
          ry={17}
          fill={`url(#accent-grad-${uid})`}
          stroke={accent.outline}
          strokeWidth={1.5}
        />
        {/* Acoustic Grill Holes */}
        {[-8, -4, 0, 4, 8].map((dy, i) => (
          <circle key={`hole-l-${i}`} cx={left.x - 4} cy={left.y + dy} r={1.5} fill={rubber.deepShadow} />
        ))}

        {/* Right Speaker Pod */}
        <ellipse cx={right.x + 2} cy={right.y} rx={9} ry={19} fill={rubber.deepShadow} />
        <ellipse
          cx={right.x + 4}
          cy={right.y}
          rx={8}
          ry={17}
          fill={`url(#accent-grad-${uid})`}
          stroke={accent.outline}
          strokeWidth={1.5}
        />
        {[-8, -4, 0, 4, 8].map((dy, i) => (
          <circle key={`hole-r-${i}`} cx={right.x + 4} cy={right.y + dy} r={1.5} fill={rubber.deepShadow} />
        ))}
      </g>
    );
  };

  // 3. SCREEN EYES & EXPRESSIONS (Phosphor Glow Emission)
  const renderScreenEyes = () => {
    const l = rig.leftEyeAnchor;
    const r = rig.rightEyeAnchor;
    const style = norm.eyeStyle;
    const glow = norm.screenGlowColor;

    // React to mood
    const isSquint = activeMood === "thinking" || activeMood === "curious";
    const isHappyCurve = activeMood === "happy" || activeMood === "celebrating" || activeMood === "streak" || activeMood === "cheer";
    const isWide = activeMood === "excited" || activeMood === "surprised" || activeMood === "levelUp";
    const isAngry = activeMood === "angry";
    const isBoss = activeMood === "boss";
    const isSmirkMood = activeMood === "smirk";
    const isSuspicious = activeMood === "suspicious";
    const isIdea = activeMood === "idea";
    const isWitty = activeMood === "witty";

    // 1. Boss Overclock Eyes
    if (isBoss) {
      return (
        <g id="screen-eyes" filter={`url(#screen-glow-${uid})`}>
          {/* Outer Pulsating Targeting Reticles */}
          <circle cx={l.x} cy={l.y} r={13} fill="none" stroke={glow} strokeWidth={2.5} strokeDasharray="4 2" />
          <circle cx={r.x} cy={r.y} r={13} fill="none" stroke={glow} strokeWidth={2.5} strokeDasharray="4 2" />
          {/* Inner Crimson Cores */}
          <circle cx={l.x} cy={l.y} r={6} fill={glow} />
          <circle cx={r.x} cy={r.y} r={6} fill={glow} />
          <circle cx={l.x} cy={l.y} r={2.5} fill="#FFFFFF" />
          <circle cx={r.x} cy={r.y} r={2.5} fill="#FFFFFF" />
          {/* Laser Crosshairs */}
          <line x1={l.x - 16} y1={l.y} x2={l.x + 16} y2={l.y} stroke={glow} strokeWidth={1.5} />
          <line x1={r.x - 16} y1={r.y} x2={r.x + 16} y2={r.y} stroke={glow} strokeWidth={1.5} />
        </g>
      );
    }

    // 2. Sarcastic Smirk Mood (Asymmetrical narrowed eyes)
    if (isSmirkMood) {
      return (
        <g id="screen-eyes" filter={`url(#screen-glow-${uid})`}>
          {/* Left eye: arched knowing glance */}
          <path d={`M ${l.x - 12} ${l.y + 2} Q ${l.x} ${l.y - 8} ${l.x + 12} ${l.y + 2}`} stroke={glow} strokeWidth={4} strokeLinecap="round" fill="none" />
          <circle cx={l.x} cy={l.y + 1} r={3} fill={glow} />
          {/* Right eye: narrowed predatory slit */}
          <polygon points={`${r.x - 14},${r.y - 2} ${r.x + 14},${r.y - 6} ${r.x + 12},${r.y + 4} ${r.x - 12},${r.y + 6}`} fill={glow} />
          <circle cx={r.x} cy={r.y} r={2.5} fill="#FFFFFF" />
        </g>
      );
    }

    // 3. Suspicious / Analytical Scan
    if (isSuspicious) {
      return (
        <g id="screen-eyes" filter={`url(#screen-glow-${uid})`}>
          <rect x={l.x - 13} y={l.y - 2} width={26} height={5} rx={2.5} fill={glow} />
          <rect x={r.x - 13} y={r.y - 2} width={26} height={5} rx={2.5} fill={glow} />
          <circle cx={l.x + 4} cy={l.y + 0.5} r={2} fill="#FFFFFF" />
          <circle cx={r.x - 4} cy={r.y + 0.5} r={2} fill="#FFFFFF" />
        </g>
      );
    }

    // 4. Eureka Idea Spark Eyes
    if (isIdea) {
      return (
        <g id="screen-eyes" filter={`url(#screen-glow-${uid})`}>
          {/* Wide luminous eyes */}
          <ellipse cx={l.x} cy={l.y} rx={11} ry={13} fill={glow} />
          <ellipse cx={r.x} cy={r.y} rx={11} ry={13} fill={glow} />
          {/* Radiant star sparks in eyes */}
          <polygon points={`${l.x},${l.y - 6} ${l.x + 2},${l.y} ${l.x + 6},${l.y} ${l.x + 3},${l.y + 3} ${l.x + 4},${l.y + 7} ${l.x},${l.y + 4} ${l.x - 4},${l.y + 7} ${l.x - 3},${l.y + 3} ${l.x - 6},${l.y} ${l.x - 2},${l.y}`} fill="#FFFFFF" />
          <polygon points={`${r.x},${r.y - 6} ${r.x + 2},${r.y} ${r.x + 6},${r.y} ${r.x + 3},${r.y + 3} ${r.x + 4},${r.y + 7} ${r.x},${r.y + 4} ${r.x - 4},${r.y + 7} ${r.x - 3},${r.y + 3} ${r.x - 6},${r.y} ${r.x - 2},${r.y}`} fill="#FFFFFF" />
        </g>
      );
    }

    // 5. Witty Playful Wink
    if (isWitty) {
      return (
        <g id="screen-eyes" filter={`url(#screen-glow-${uid})`}>
          {/* Left: Wide sharp eye */}
          <ellipse cx={l.x} cy={l.y} rx={11} ry={13} fill={glow} />
          <circle cx={l.x - 3} cy={l.y - 3} r={3.5} fill="#FFFFFF" />
          {/* Right: Playful curved wink arc */}
          <path d={`M ${r.x - 12} ${r.y + 2} Q ${r.x} ${r.y - 8} ${r.x + 12} ${r.y + 2}`} stroke={glow} strokeWidth={4.5} strokeLinecap="round" fill="none" />
        </g>
      );
    }

    if (isAngry) {
      return (
        <g id="screen-eyes" filter={`url(#screen-glow-${uid})`}>
          {/* Slanted Angry Cyber Brows / Eyes */}
          <polygon points={`${l.x - 14},${l.y - 8} ${l.x + 12},${l.y + 2} ${l.x + 8},${l.y + 10} ${l.x - 14},${l.y + 6}`} fill={glow} />
          <polygon points={`${r.x + 14},${r.y - 8} ${r.x - 12},${r.y + 2} ${r.x - 8},${r.y + 10} ${r.x + 14},${r.y + 6}`} fill={glow} />
          <circle cx={l.x - 2} cy={l.y + 2} r={2.5} fill="#FFFFFF" />
          <circle cx={r.x + 2} cy={r.y + 2} r={2.5} fill="#FFFFFF" />
        </g>
      );
    }

    if (isHappyCurve) {
      // Inverted happy crescent arcs
      return (
        <g id="screen-eyes" filter={`url(#screen-glow-${uid})`}>
          <path
            d={`M ${l.x - 12} ${l.y + 4} Q ${l.x} ${l.y - 12} ${l.x + 12} ${l.y + 4}`}
            stroke={glow}
            strokeWidth={5}
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M ${r.x - 12} ${r.y + 4} Q ${r.x} ${r.y - 12} ${r.x + 12} ${r.y + 4}`}
            stroke={glow}
            strokeWidth={5}
            strokeLinecap="round"
            fill="none"
          />
        </g>
      );
    }

    // 6. Lumi Glamour Eyes (Sleek feminine cyber eye with delicate eyelashes, star glints & glowing blush)
    if (style === "lumi_glamour") {
      return (
        <g id="screen-eyes" filter={`url(#screen-glow-${uid})`}>
          {/* Left Glamour Optic Base */}
          <path
            d={`M ${l.x - 15} ${l.y + 2} Q ${l.x - 4} ${l.y - 13} ${l.x + 13} ${l.y - 4} Q ${l.x + 6} ${l.y + 11} ${l.x - 15} ${l.y + 2} Z`}
            fill={glow}
          />
          {/* Left Delicate Cyber Eyelashes */}
          <path d={`M ${l.x - 14} ${l.y - 2} Q ${l.x - 18} ${l.y - 8} ${l.x - 22} ${l.y - 10}`} stroke={glow} strokeWidth={2.2} strokeLinecap="round" fill="none" />
          <path d={`M ${l.x - 9} ${l.y - 9} Q ${l.x - 11} ${l.y - 16} ${l.x - 14} ${l.y - 18}`} stroke={glow} strokeWidth={2} strokeLinecap="round" fill="none" />
          <path d={`M ${l.x - 2} ${l.y - 12} Q ${l.x - 1} ${l.y - 18} ${l.x - 2} ${l.y - 20}`} stroke={glow} strokeWidth={1.8} strokeLinecap="round" fill="none" />
          {/* Left Sparkle Pupils & Star Highlights */}
          <polygon points={`${l.x - 2},${l.y - 8} ${l.x},${l.y - 3} ${l.x + 5},${l.y - 1} ${l.x},${l.y + 1} ${l.x - 2},${l.y + 6} ${l.x - 4},${l.y + 1} ${l.x - 9},${l.y - 1} ${l.x - 4},${l.y - 3}`} fill="#FFFFFF" />
          <circle cx={l.x + 6} cy={l.y + 3} r={2} fill="#FFFFFF" />
          <circle cx={l.x - 6} cy={l.y + 4} r={1.5} fill="#FFFFFF" />

          {/* Right Glamour Optic Base */}
          <path
            d={`M ${r.x + 15} ${r.y + 2} Q ${r.x + 4} ${r.y - 13} ${r.x - 13} ${r.y - 4} Q ${r.x - 6} ${r.y + 11} ${r.x + 15} ${r.y + 2} Z`}
            fill={glow}
          />
          {/* Right Delicate Cyber Eyelashes */}
          <path d={`M ${r.x + 14} ${r.y - 2} Q ${r.x + 18} ${r.y - 8} ${r.x + 22} ${r.y - 10}`} stroke={glow} strokeWidth={2.2} strokeLinecap="round" fill="none" />
          <path d={`M ${r.x + 9} ${r.y - 9} Q ${r.x + 11} ${r.y - 16} ${r.x + 14} ${r.y - 18}`} stroke={glow} strokeWidth={2} strokeLinecap="round" fill="none" />
          <path d={`M ${r.x + 2} ${r.y - 12} Q ${r.x + 1} ${r.y - 18} ${r.x + 2} ${r.y - 20}`} stroke={glow} strokeWidth={1.8} strokeLinecap="round" fill="none" />
          {/* Right Sparkle Pupils & Star Highlights */}
          <polygon points={`${r.x + 2},${r.y - 8} ${r.x},${r.y - 3} ${r.x - 5},${r.y - 1} ${r.x},${r.y + 1} ${r.x + 2},${r.y + 6} ${r.x + 4},${r.y + 1} ${r.x + 9},${r.y - 1} ${r.x + 4},${r.y - 3}`} fill="#FFFFFF" />
          <circle cx={r.x - 6} cy={r.y + 3} r={2} fill="#FFFFFF" />
          <circle cx={r.x + 6} cy={r.y + 4} r={1.5} fill="#FFFFFF" />

          {/* Luminous Girlish Cyber-Blush Pads on Cheeks */}
          <ellipse cx={l.x - 4} cy={l.y + 16} rx={9} ry={4} fill="#FF69B4" opacity={0.65} />
          <line x1={l.x - 8} y1={l.y + 16} x2={l.x} y2={l.y + 16} stroke="#FFFFFF" strokeWidth={1.2} strokeLinecap="round" opacity={0.8} />
          
          <ellipse cx={r.x + 4} cy={r.y + 16} rx={9} ry={4} fill="#FF69B4" opacity={0.65} />
          <line x1={r.x} y1={r.y + 16} x2={r.x + 8} y2={r.y + 16} stroke="#FFFFFF" strokeWidth={1.2} strokeLinecap="round" opacity={0.8} />
        </g>
      );
    }

    // 7. Vex Narrowed Optics (Sharp menacing predatory crimson slits with targeting lock)
    if (style === "vex_narrowed") {
      return (
        <g id="screen-eyes" filter={`url(#screen-glow-${uid})`}>
          {/* Angled Sinister Brow Shadow Plate */}
          <polygon
            points={`${l.x - 17},${l.y - 8} ${l.x + 14},${l.y} ${l.x + 10},${l.y + 7} ${l.x - 17},${l.y + 1}`}
            fill={glow}
          />
          {/* Predatory Laser Slit Pupil */}
          <line x1={l.x - 12} y1={l.y - 2} x2={l.x + 6} y2={l.y + 3} stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
          <circle cx={l.x - 2} cy={l.y} r={2.5} fill="#FFFFFF" />

          {/* Right Angled Sinister Brow Shadow Plate */}
          <polygon
            points={`${r.x + 17},${r.y - 8} ${r.x - 14},${r.y} ${r.x - 10},${r.y + 7} ${r.x + 17},${r.y + 1}`}
            fill={glow}
          />
          {/* Predatory Laser Slit Pupil */}
          <line x1={r.x + 12} y1={r.y - 2} x2={r.x - 6} y2={r.y + 3} stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
          <circle cx={r.x + 2} cy={r.y} r={2.5} fill="#FFFFFF" />

          {/* Menacing Angular Brow Crease / Evil Glare Marks */}
          <line x1={l.x + 10} y1={l.y - 4} x2={r.x - 10} y2={r.y - 4} stroke={glow} strokeWidth={1.5} opacity={0.6} />
        </g>
      );
    }

    // 8. Vex Predator Targeting Reticles
    if (style === "vex_predator") {
      return (
        <g id="screen-eyes" filter={`url(#screen-glow-${uid})`}>
          <circle cx={l.x} cy={l.y} r={11} fill="none" stroke={glow} strokeWidth={2.5} />
          <circle cx={l.x} cy={l.y} r={4.5} fill={glow} />
          <line x1={l.x - 14} y1={l.y} x2={l.x - 8} y2={l.y} stroke="#FFFFFF" strokeWidth={2} />
          <line x1={l.x + 8} y1={l.y} x2={l.x + 14} y2={l.y} stroke="#FFFFFF" strokeWidth={2} />

          <circle cx={r.x} cy={r.y} r={11} fill="none" stroke={glow} strokeWidth={2.5} />
          <circle cx={r.x} cy={r.y} r={4.5} fill={glow} />
          <line x1={r.x - 14} y1={r.y} x2={r.x - 8} y2={r.y} stroke="#FFFFFF" strokeWidth={2} />
          <line x1={r.x + 8} y1={r.y} x2={r.x + 14} y2={r.y} stroke="#FFFFFF" strokeWidth={2} />
        </g>
      );
    }

    if (style === "pixel") {
      return (
        <g id="screen-eyes" filter={`url(#screen-glow-${uid})`}>
          {/* 8-bit Matrix Pixels */}
          {[-6, 0, 6].map((dx) =>
            [-6, 0, 6].map((dy) => (
              <rect
                key={`px-l-${dx}-${dy}`}
                x={l.x + dx - 2}
                y={l.y + dy - 2}
                width={4}
                height={4}
                rx={1}
                fill={glow}
              />
            ))
          )}
          {[-6, 0, 6].map((dx) =>
            [-6, 0, 6].map((dy) => (
              <rect
                key={`px-r-${dx}-${dy}`}
                x={r.x + dx - 2}
                y={r.y + dy - 2}
                width={4}
                height={4}
                rx={1}
                fill={glow}
              />
            ))
          )}
        </g>
      );
    }

    if (style === "anime_digital") {
      return (
        <g id="screen-eyes" filter={`url(#screen-glow-${uid})`}>
          {/* Left Anime Eye with Star & Specular Highlight */}
          <ellipse cx={l.x} cy={l.y} rx={11} ry={14} fill={glow} />
          <circle cx={l.x - 4} cy={l.y - 5} r={4.5} fill="#FFFFFF" />
          <circle cx={l.x + 4} cy={l.y + 5} r={2.5} fill="#FFFFFF" />

          {/* Right Anime Eye */}
          <ellipse cx={r.x} cy={r.y} rx={11} ry={14} fill={glow} />
          <circle cx={r.x - 4} cy={r.y - 5} r={4.5} fill="#FFFFFF" />
          <circle cx={r.x + 4} cy={r.y + 5} r={2.5} fill="#FFFFFF" />
        </g>
      );
    }

    if (style === "visor_bar") {
      return (
        <g id="screen-eyes" filter={`url(#screen-glow-${uid})`}>
          {/* Continuous Cyber Visor Sweep */}
          <rect
            x={l.x - 18}
            y={l.y - 4}
            width={r.x - l.x + 36}
            height={8}
            rx={4}
            fill={glow}
          />
          <rect
            x={l.x + 6}
            y={l.y - 2}
            width={r.x - l.x - 12}
            height={4}
            rx={2}
            fill="#FFFFFF"
          />
        </g>
      );
    }

    if (style === "led_visor") {
      return (
        <g id="screen-eyes" filter={`url(#screen-glow-${uid})`}>
          <rect x={l.x - 14} y={l.y - 3} width={28} height={6} rx={3} fill={glow} />
          <rect x={r.x - 14} y={r.y - 3} width={28} height={6} rx={3} fill={glow} />
          <rect x={l.x - 8} y={l.y - 1.5} width={16} height={3} rx={1.5} fill="#FFFFFF" />
          <rect x={r.x - 8} y={r.y - 1.5} width={16} height={3} rx={1.5} fill="#FFFFFF" />
        </g>
      );
    }

    if (style === "dot") {
      return (
        <g id="screen-eyes" filter={`url(#screen-glow-${uid})`}>
          <circle cx={l.x} cy={l.y} r={isWide ? 7 : 5.5} fill={glow} />
          <circle cx={l.x - 1.5} cy={l.y - 1.5} r={2} fill="#FFFFFF" />
          <circle cx={r.x} cy={r.y} r={isWide ? 7 : 5.5} fill={glow} />
          <circle cx={r.x - 1.5} cy={r.y - 1.5} r={2} fill="#FFFFFF" />
        </g>
      );
    }

    if (style === "dual_pupil") {
      return (
        <g id="screen-eyes" filter={`url(#screen-glow-${uid})`}>
          <circle cx={l.x} cy={l.y} r={11} fill="none" stroke={glow} strokeWidth={3} />
          <circle cx={l.x} cy={l.y} r={5} fill={glow} />
          <circle cx={r.x} cy={r.y} r={11} fill="none" stroke={glow} strokeWidth={3} />
          <circle cx={r.x} cy={r.y} r={5} fill={glow} />
        </g>
      );
    }

    if (style === "focus_crosshair") {
      return (
        <g id="screen-eyes" filter={`url(#screen-glow-${uid})`}>
          <circle cx={l.x} cy={l.y} r={10} fill="none" stroke={glow} strokeWidth={2} />
          <circle cx={l.x} cy={l.y} r={2.5} fill={glow} />
          <line x1={l.x - 13} y1={l.y} x2={l.x + 13} y2={l.y} stroke={glow} strokeWidth={1.5} />
          <line x1={l.x} y1={l.y - 13} x2={l.x} y2={l.y + 13} stroke={glow} strokeWidth={1.5} />

          <circle cx={r.x} cy={r.y} r={10} fill="none" stroke={glow} strokeWidth={2} />
          <circle cx={r.x} cy={r.y} r={2.5} fill={glow} />
          <line x1={r.x - 13} y1={r.y} x2={r.x + 13} y2={r.y} stroke={glow} strokeWidth={1.5} />
          <line x1={r.x} y1={r.y - 13} x2={r.x} y2={r.y + 13} stroke={glow} strokeWidth={1.5} />
        </g>
      );
    }

    if (style === "soft_digital") {
      return (
        <g id="screen-eyes" filter={`url(#screen-glow-${uid})`}>
          {/* Gentle Kawaii Rounded Eyes */}
          <ellipse cx={l.x} cy={l.y} rx={isSquint ? 10 : 12} ry={isSquint ? 6 : 10} fill={glow} />
          <circle cx={l.x - 3} cy={l.y - 3} r={3} fill="#FFFFFF" />
          <circle cx={l.x + 3} cy={l.y + 2} r={1.8} fill="#FFFFFF" />

          <ellipse cx={r.x} cy={r.y} rx={isSquint ? 10 : 12} ry={isSquint ? 6 : 10} fill={glow} />
          <circle cx={r.x - 3} cy={r.y - 3} r={3} fill="#FFFFFF" />
          <circle cx={r.x + 3} cy={r.y + 2} r={1.8} fill="#FFFFFF" />
        </g>
      );
    }

    // Default: large_digital
    const radiusX = isSquint ? 12 : 11;
    const radiusY = isSquint ? 6 : isWide ? 15 : 13;

    return (
      <g id="screen-eyes" filter={`url(#screen-glow-${uid})`}>
        {/* Left Large Digital Eye */}
        <ellipse cx={l.x} cy={l.y} rx={radiusX} ry={radiusY} fill={glow} />
        <ellipse cx={l.x - 3} cy={l.y - 3} rx={3.5} ry={4} fill="#FFFFFF" />

        {/* Right Large Digital Eye */}
        <ellipse cx={r.x} cy={r.y} rx={radiusX} ry={radiusY} fill={glow} />
        <ellipse cx={r.x - 3} cy={r.y - 3} rx={3.5} ry={4} fill="#FFFFFF" />
      </g>
    );
  };

  // 4. SCREEN MOUTH (Phosphor Waveform / Smile / Smirk)
  const renderScreenMouth = () => {
    const m = rig.mouthAnchor;
    const style = norm.mouthStyle;
    const glow = norm.screenGlowColor;
    if (style === "none") return null;

    if (activeMood === "angry" || style === "grimace_scowl") {
      return (
        <g id="screen-mouth" filter={`url(#screen-glow-${uid})`}>
          <path
            d={`M ${m.x - 12} ${m.y + 4} Q ${m.x} ${m.y - 4} ${m.x + 12} ${m.y + 4}`}
            stroke={glow}
            strokeWidth={3.5}
            strokeLinecap="round"
            fill="none"
          />
        </g>
      );
    }

    if (style === "smirk" || activeMood === "smirk") {
      return (
        <g id="screen-mouth" filter={`url(#screen-glow-${uid})`}>
          {/* Asymmetrical Sarcastic Smirk Curve */}
          <path
            d={`M ${m.x - 12} ${m.y + 2} Q ${m.x} ${m.y + 4} ${m.x + 12} ${m.y - 5}`}
            fill="none"
            stroke={glow}
            strokeWidth={3.5}
            strokeLinecap="round"
          />
          <circle cx={m.x + 12} cy={m.y - 5} r={2} fill={glow} />
        </g>
      );
    }

    if (style === "evil_smile") {
      return (
        <g id="screen-mouth" filter={`url(#screen-glow-${uid})`}>
          {/* Jagged Sinister Grin Outline */}
          <path
            d={`M ${m.x - 16} ${m.y - 3} Q ${m.x} ${m.y + 14} ${m.x + 16} ${m.y - 3} Q ${m.x} ${m.y + 3} ${m.x - 16} ${m.y - 3} Z`}
            fill={glow}
          />
          {/* Upper Razor Cyber-Fangs */}
          <polygon points={`${m.x - 10},${m.y - 2} ${m.x - 6},${m.y + 4} ${m.x - 2},${m.y - 2}`} fill="#0A0A0E" />
          <polygon points={`${m.x + 2},${m.y - 2} ${m.x + 6},${m.y + 4} ${m.x + 10},${m.y - 2}`} fill="#0A0A0E" />
          {/* Lower Razor Cyber-Fangs */}
          <polygon points={`${m.x - 6},${m.y + 10} ${m.x - 2},${m.y + 3} ${m.x + 2},${m.y + 10}`} fill="#0A0A0E" />
          {/* Subtle Sinister Corner Fangs / Smirk Sparks */}
          <circle cx={m.x - 16} cy={m.y - 3} r={1.5} fill="#FFFFFF" />
          <circle cx={m.x + 16} cy={m.y - 3} r={1.5} fill="#FFFFFF" />
        </g>
      );
    }

    if (style === "witty_curve" || activeMood === "witty") {
      return (
        <g id="screen-mouth" filter={`url(#screen-glow-${uid})`}>
          <path
            d={`M ${m.x - 10} ${m.y + 3} Q ${m.x - 2} ${m.y + 6} ${m.x + 11} ${m.y - 2}`}
            fill="none"
            stroke={glow}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </g>
      );
    }

    if (style === "confident_smile" || activeMood === "confident") {
      return (
        <g id="screen-mouth" filter={`url(#screen-glow-${uid})`}>
          <path
            d={`M ${m.x - 10} ${m.y} Q ${m.x} ${m.y + 5} ${m.x + 10} ${m.y}`}
            fill="none"
            stroke={glow}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <circle cx={m.x + 8} cy={m.y - 1} r={1.5} fill="#FFFFFF" />
        </g>
      );
    }

    if (style === "surprised_o" || activeMood === "surprised") {
      return (
        <g id="screen-mouth" filter={`url(#screen-glow-${uid})`}>
          <ellipse cx={m.x} cy={m.y + 2} rx={6} ry={7} fill={glow} />
          <ellipse cx={m.x} cy={m.y + 2} rx={3.5} ry={4.5} fill="#0A0F1E" />
        </g>
      );
    }

    if (style === "open_smile" || activeMood === "happy" || activeMood === "celebrating" || activeMood === "cheer") {
      return (
        <g id="screen-mouth" filter={`url(#screen-glow-${uid})`}>
          <path
            d={`M ${m.x - 12} ${m.y - 3} Q ${m.x} ${m.y + 12} ${m.x + 12} ${m.y - 3} Z`}
            fill={glow}
          />
        </g>
      );
    }

    if (style === "waveform") {
      return (
        <g id="screen-mouth" filter={`url(#screen-glow-${uid})`}>
          <path
            d={`M ${m.x - 16} ${m.y} L ${m.x - 10} ${m.y - 4} L ${m.x - 4} ${m.y + 4} L ${m.x + 4} ${m.y - 4} L ${m.x + 10} ${m.y + 4} L ${m.x + 16} ${m.y}`}
            fill="none"
            stroke={glow}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </g>
      );
    }

    if (style === "pixel_smile") {
      return (
        <g id="screen-mouth" filter={`url(#screen-glow-${uid})`}>
          <rect x={m.x - 12} y={m.y - 2} width={4} height={4} fill={glow} />
          <rect x={m.x - 8} y={m.y + 2} width={4} height={4} fill={glow} />
          <rect x={m.x - 4} y={m.y + 4} width={8} height={4} fill={glow} />
          <rect x={m.x + 4} y={m.y + 2} width={4} height={4} fill={glow} />
          <rect x={m.x + 8} y={m.y - 2} width={4} height={4} fill={glow} />
        </g>
      );
    }

    if (style === "dot_mouth") {
      return (
        <g id="screen-mouth" filter={`url(#screen-glow-${uid})`}>
          <circle cx={m.x} cy={m.y + 2} r={3.5} fill={glow} />
        </g>
      );
    }

    if (style === "tiny_line") {
      return (
        <g id="screen-mouth" filter={`url(#screen-glow-${uid})`}>
          <line
            x1={m.x - 8}
            y1={m.y + 2}
            x2={m.x + 8}
            y2={m.y + 2}
            stroke={glow}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </g>
      );
    }

    // Default: digital_smile / small_smile
    return (
      <g id="screen-mouth" filter={`url(#screen-glow-${uid})`}>
        <path
          d={`M ${m.x - 11} ${m.y} Q ${m.x} ${m.y + 8} ${m.x + 11} ${m.y}`}
          fill="none"
          stroke={glow}
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      </g>
    );
  };

  // 5. CHEST CORE / DISPLAY
  const renderChestCore = () => {
    const c = rig.chestSocket;
    const core = norm.chestCore;
    if (core === "none") return null;

    return (
      <g id="robot-chest-core">
        {/* Recessed Chest Socket Cavity */}
        <ellipse cx={c.x} cy={c.y + 2} rx={19} ry={19} fill={rubber.deepShadow} opacity={0.65} />
        <circle cx={c.x} cy={c.y} r={17} fill={rubber.base} stroke={metal.outline} strokeWidth={1.5} />

        {core === "photon_reactor" ? (
          <g>
            <circle cx={c.x} cy={c.y} r={12} fill={`url(#accent-grad-${uid})`} filter={`url(#screen-glow-${uid})`} />
            <circle cx={c.x} cy={c.y} r={7} fill={accent.keyLight} />
            <circle cx={c.x - 2} cy={c.y - 2} r={2.5} fill="#FFFFFF" />
          </g>
        ) : core === "pulse_heart" ? (
          <g>
            <path
              d={`M ${c.x} ${c.y + 8} L ${c.x - 8} ${c.y} A 4.5 4.5 0 0 1 ${c.x} ${c.y - 5} A 4.5 4.5 0 0 1 ${c.x + 8} ${c.y} Z`}
              fill={norm.screenGlowColor}
              filter={`url(#screen-glow-${uid})`}
            />
          </g>
        ) : core === "xp_crystal" ? (
          <g>
            <polygon
              points={`${c.x},${c.y - 10} ${c.x + 8},${c.y} ${c.x},${c.y + 10} ${c.x - 8},${c.y}`}
              fill={norm.screenGlowColor}
              filter={`url(#screen-glow-${uid})`}
            />
            <polygon
              points={`${c.x},${c.y - 10} ${c.x + 4},${c.y} ${c.x},${c.y + 10}`}
              fill="#FFFFFF"
              opacity={0.6}
            />
          </g>
        ) : core === "energy_gauge" ? (
          <g>
            {[-8, -3, 2, 7].map((dx, i) => (
              <rect
                key={`gauge-${i}`}
                x={c.x + dx - 2}
                y={c.y - 6}
                width={3.5}
                height={12}
                rx={1.5}
                fill={norm.screenGlowColor}
                filter={`url(#screen-glow-${uid})`}
              />
            ))}
          </g>
        ) : core === "tech_badge" ? (
          <g>
            <polygon
              points={`${c.x},${c.y - 9} ${c.x + 9},${c.y - 3} ${c.x + 6},${c.y + 8} ${c.x - 6},${c.y + 8} ${c.x - 9},${c.y - 3}`}
              fill={metal.light}
              stroke={accent.base}
              strokeWidth={1.5}
            />
            <circle cx={c.x} cy={c.y} r={2.5} fill={accent.base} />
          </g>
        ) : (
          // aifluence_logo
          <g>
            {/* Signature AIfluence Diamond Core */}
            <rect
              x={c.x - 8}
              y={c.y - 8}
              width={16}
              height={16}
              rx={4}
              transform={`rotate(45 ${c.x} ${c.y})`}
              fill={`url(#accent-grad-${uid})`}
              filter={`url(#screen-glow-${uid})`}
            />
            <rect
              x={c.x - 4}
              y={c.y - 4}
              width={8}
              height={8}
              rx={2}
              transform={`rotate(45 ${c.x} ${c.y})`}
              fill="#FFFFFF"
            />
          </g>
        )}
      </g>
    );
  };

  // 5a. EXCLUSIVE FULL BUNDLE BACK LAYER FX & PROPS
  const renderBundleBackFX = () => {
    const skin = norm.skinOutfit || norm.activeBundle;
    if (!skin || skin === "none") return null;

    // 0a. AIDEN MASCOT (Boyish Blue & Red Vanguard)
    if (skin === "aiden_mascot") {
      return (
        <g id="bundle-back-aiden">
          {/* Dual Sporty Cyber Winglets / Thruster Fins */}
          <path d="M 145 230 L 105 210 L 115 255 L 148 265 Z" fill="#1E3A8A" stroke="#EF4444" strokeWidth={2} />
          <line x1={115} y1={220} x2={138} y2={238} stroke="#00E5FF" strokeWidth={2} filter={`url(#screen-glow-${uid})`} />
          
          <path d="M 255 230 L 295 210 L 285 255 L 252 265 Z" fill="#1E3A8A" stroke="#EF4444" strokeWidth={2} />
          <line x1={285} y1={220} x2={262} y2={238} stroke="#00E5FF" strokeWidth={2} filter={`url(#screen-glow-${uid})`} />

          {/* Electric Cyan & Red High-Output Energy Pulses */}
          <circle cx={105} cy={210} r={3} fill="#00E5FF" filter={`url(#screen-glow-${uid})`} />
          <circle cx={295} cy={210} r={3} fill="#00E5FF" filter={`url(#screen-glow-${uid})`} />
        </g>
      );
    }

    // 0b. LUMI MASCOT (Girlish Rose & Violet Creative Muse)
    if (skin === "lumi_mascot") {
      return (
        <g id="bundle-back-lumi">
          {/* Luminous Orbital Starlight Cyber Ring */}
          <circle cx={200} cy={200} r={105} fill="none" stroke="#FF2A8D" strokeWidth={1} strokeDasharray="5 7" opacity={0.35} filter={`url(#screen-glow-${uid})`} />
          <circle cx={200} cy={200} r={92} fill="none" stroke="#F472B6" strokeWidth={0.8} opacity={0.25} />
          
          {/* Floating Starlight Crystal Sparks */}
          {[
            { x: 105, y: 140, s: 7, c: "#FF2A8D" },
            { x: 295, y: 135, s: 8, c: "#F472B6" },
            { x: 90, y: 230, s: 6, c: "#E879F9" },
            { x: 310, y: 240, s: 7, c: "#FF2A8D" },
            { x: 120, y: 290, s: 5, c: "#FDF2F8" },
            { x: 280, y: 300, s: 6, c: "#F472B6" }
          ].map((sp, i) => (
            <polygon
              key={`lumi-spark-${i}`}
              points={`${sp.x},${sp.y - sp.s} ${sp.x + sp.s * 0.4},${sp.y - sp.s * 0.4} ${sp.x + sp.s},${sp.y} ${sp.x + sp.s * 0.4},${sp.y + sp.s * 0.4} ${sp.x},${sp.y + sp.s} ${sp.x - sp.s * 0.4},${sp.y + sp.s * 0.4} ${sp.x - sp.s},${sp.y} ${sp.x - sp.s * 0.4},${sp.y - sp.s * 0.4}`}
              fill={sp.c}
              filter={`url(#screen-glow-${uid})`}
            />
          ))}
        </g>
      );
    }

    // 0c. VEX MASCOT (Apex Demonic Obsidian Overlord & Shadow Spikes)
    if (skin === "vex_mascot") {
      return (
        <g id="bundle-back-vex">
          {/* Spiked Demonic Shadow Energy Wings / Plasma Blades */}
          {/* Left Plasma Spiked Blade Wings */}
          <path
            d="M 130 220 L 52 172 L 78 214 L 38 226 L 74 252 L 46 278 L 105 284 L 130 270 Z"
            fill="#08080A"
            stroke="#EF4444"
            strokeWidth={2}
          />
          <path
            d="M 125 224 L 60 182 L 80 216 L 48 230 L 78 252 L 56 274 L 105 280 Z"
            fill="#FF0033"
            opacity={0.4}
            filter={`url(#screen-glow-${uid})`}
          />

          {/* Right Plasma Spiked Blade Wings */}
          <path
            d="M 270 220 L 348 172 L 322 214 L 362 226 L 326 252 L 354 278 L 295 284 L 270 270 Z"
            fill="#08080A"
            stroke="#EF4444"
            strokeWidth={2}
          />
          <path
            d="M 275 224 L 340 182 L 320 216 L 352 230 L 322 252 L 344 274 L 295 280 Z"
            fill="#FF0033"
            opacity={0.4}
            filter={`url(#screen-glow-${uid})`}
          />

          {/* Ominous Floating Spiked Demonic Sigil Halo behind Head */}
          <g opacity={0.8}>
            <circle cx={200} cy={165} r={82} fill="none" stroke="#EF4444" strokeWidth={1.5} strokeDasharray="8 6" filter={`url(#screen-glow-${uid})`} />
            <circle cx={200} cy={165} r={88} fill="none" stroke="#990000" strokeWidth={1} strokeDasharray="3 3" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const gx = 200 + Math.cos(rad) * 82;
              const gy = 165 + Math.sin(rad) * 82;
              return (
                <polygon
                  key={`vex-sigil-${i}`}
                  points={`${gx},${gy - 4} ${gx + 3.5},${gy} ${gx},${gy + 4} ${gx - 3.5},${gy}`}
                  fill="#FF0033"
                  filter={`url(#screen-glow-${uid})`}
                />
              );
            })}
          </g>

          {/* Heavy Matte Carbon Heat Sink Exhaust Gills & Crimson Lightning Arcs */}
          <rect x={124} y={212} width={18} height={56} rx={4} fill="#08080A" stroke="#27272A" strokeWidth={2} />
          <line x1={133} y1={218} x2={133} y2={264} stroke="#FF0033" strokeWidth={3} filter={`url(#screen-glow-${uid})`} />
          <polygon points="126,212 133,190 140,212" fill="#EF4444" opacity={0.85} filter={`url(#screen-glow-${uid})`} />

          <rect x={258} y={212} width={18} height={56} rx={4} fill="#08080A" stroke="#27272A" strokeWidth={2} />
          <line x1={267} y1={218} x2={267} y2={264} stroke="#FF0033" strokeWidth={3} filter={`url(#screen-glow-${uid})`} />
          <polygon points="260,212 267,190 274,212" fill="#EF4444" opacity={0.85} filter={`url(#screen-glow-${uid})`} />
        </g>
      );
    }

    // 1. MILITARY COMMANDER: Back Comms Antenna & Smoke Canisters
    if (skin === "military") {
      return (
        <g id="bundle-back-military">
          {/* Tactical High Antenna */}
          <line x1={238} y1={220} x2={246} y2={100} stroke="#1C1917" strokeWidth={3.5} strokeLinecap="round" />
          <line x1={246} y1={100} x2={250} y2={70} stroke="#78716C" strokeWidth={2} strokeLinecap="round" />
          <circle cx={250} cy={68} r={3.5} fill="#EF4444" filter={`url(#screen-glow-${uid})`} />
          {/* Smoke Grenade Canisters on Back Harness */}
          <rect x={132} y={232} width={14} height={38} rx={4} fill="#3F4F38" stroke="#1C1917" strokeWidth={2} />
          <rect x={134} y={238} width={10} height={4} fill="#FACC15" />
          <rect x={254} y={232} width={14} height={38} rx={4} fill="#3F4F38" stroke="#1C1917" strokeWidth={2} />
          <rect x={256} y={238} width={10} height={4} fill="#EF4444" />
        </g>
      );
    }

    // 2. SNOW COMMANDER: Arctic Frost Thermal Cloak & Swirling Snow FX
    if (skin === "snow_military") {
      return (
        <g id="bundle-back-snow-military">
          {/* Arctic Flowing Thermal Cloak */}
          <path
            d="M 140 220 Q 200 210 260 220 L 275 340 Q 200 355 125 340 Z"
            fill="#0F172A"
            stroke="#38BDF8"
            strokeWidth={2}
          />
          {/* White Fur Lining at Hem */}
          <path
            d="M 125 336 Q 200 355 275 336 L 278 348 Q 200 366 122 348 Z"
            fill="#F8FAFC"
            stroke="#CBD5E1"
            strokeWidth={1}
          />
          {/* Swirling Frost Ice Crystals / Snowflakes */}
          {[
            { x: 105, y: 190, s: 6 },
            { x: 295, y: 175, s: 7 },
            { x: 110, y: 270, s: 5 },
            { x: 290, y: 285, s: 6 },
            { x: 120, y: 130, s: 4 },
            { x: 280, y: 120, s: 5 }
          ].map((c, i) => (
            <polygon
              key={`frost-${i}`}
              points={`${c.x},${c.y - c.s} ${c.x + c.s},${c.y} ${c.x},${c.y + c.s} ${c.x - c.s},${c.y}`}
              fill="#E0F2FE"
              stroke="#38BDF8"
              strokeWidth={1}
              opacity={0.85}
              filter={`url(#screen-glow-${uid})`}
            />
          ))}
        </g>
      );
    }

    // 3. CYBER KING: Regal Velvet Mantle & Floating Royal Halo Crest
    if (skin === "cyber_king" || skin === "royal_monarch") {
      return (
        <g id="bundle-back-cyber-king">
          {/* Imperial Velvet Mantle Cape */}
          <path
            d="M 136 215 Q 200 205 264 215 L 282 348 Q 200 364 118 348 Z"
            fill="#311042"
            stroke="#F59E0B"
            strokeWidth={2.5}
          />
          {/* Gold Brocade Embroidered Border */}
          <path
            d="M 130 338 Q 200 356 270 338 L 274 348 Q 200 365 126 348 Z"
            fill="#F59E0B"
            stroke="#B45309"
            strokeWidth={1}
          />
          {/* Floating Holographic Imperial Halo Crest above head */}
          <circle cx={200} cy={100} r={46} fill="none" stroke="#F59E0B" strokeWidth={2} strokeDasharray="6 4" opacity={0.65} filter={`url(#screen-glow-${uid})`} />
          <circle cx={200} cy={100} r={52} fill="none" stroke="#FBBF24" strokeWidth={1} strokeDasharray="3 3" opacity={0.45} />
        </g>
      );
    }

    // 4. TERMINATOR: Titanium Spinal Column & Sparking Electrical Zap Discharges
    if (skin === "terminator") {
      return (
        <g id="bundle-back-terminator">
          {/* Heavy Spinal Column Segment Backplate */}
          <rect x={186} y={210} width={28} height={100} rx={6} fill="#1E293B" stroke="#0F172A" strokeWidth={2} />
          {[222, 242, 262, 282, 302].map((y, i) => (
            <rect key={`vert-${i}`} x={182} y={y} width={36} height={10} rx={3} fill="#475569" stroke="#94A3B8" strokeWidth={1} />
          ))}
          {/* Sparking Blue/White Electrical Arc Zaps */}
          <path d="M 148 230 L 132 216 L 142 210 L 126 195" fill="none" stroke="#38BDF8" strokeWidth={2.5} filter={`url(#screen-glow-${uid})`} />
          <path d="M 252 235 L 268 222 L 258 214 L 274 200" fill="none" stroke="#38BDF8" strokeWidth={2.5} filter={`url(#screen-glow-${uid})`} />
          <circle cx={126} cy={195} r={3} fill="#FFFFFF" filter={`url(#screen-glow-${uid})`} />
          <circle cx={274} cy={200} r={3} fill="#FFFFFF" filter={`url(#screen-glow-${uid})`} />
        </g>
      );
    }

    // 5. FOOTBALL CHAMPION: Orbiting Kinetic Energy Soccer Ball & Trail
    if (skin === "football") {
      return (
        <g id="bundle-back-football">
          {/* Orbit Kinetic Energy Trail Ellipse */}
          <ellipse cx={200} cy={230} rx={125} ry={48} fill="none" stroke="#84CC16" strokeWidth={2} strokeDasharray="8 6" opacity={0.6} filter={`url(#screen-glow-${uid})`} />
          {/* Orbiting Futuristic Soccer Energy Ball */}
          <g transform="translate(305, 205)">
            <circle cx={0} cy={0} r={16} fill="#F8FAFC" stroke="#0284C7" strokeWidth={2} />
            <polygon points="0,-8 7,-3 4,6 -4,6 -7,-3" fill="#0F172A" />
            <circle cx={0} cy={0} r={20} fill="none" stroke="#84CC16" strokeWidth={2} opacity={0.7} filter={`url(#screen-glow-${uid})`} />
            <path d="M -18 10 L -28 16 M -12 18 L -20 28" stroke="#84CC16" strokeWidth={2} strokeLinecap="round" />
          </g>
        </g>
      );
    }

    // 6. CYBER NINJA: Dual Criss-Crossed Back Plasma Katanas
    if (skin === "cyber_ninja") {
      return (
        <g id="bundle-back-cyber-ninja">
          {/* Katana 1 (Diagonal Left-Down) */}
          <line x1={120} y1={120} x2={270} y2={320} stroke="#10B981" strokeWidth={4.5} strokeLinecap="round" filter={`url(#screen-glow-${uid})`} />
          <line x1={120} y1={120} x2={270} y2={320} stroke="#FFFFFF" strokeWidth={1.5} strokeLinecap="round" />
          {/* Tsuka / Handle */}
          <line x1={105} y1={100} x2={125} y2={127} stroke="#18181B" strokeWidth={8} strokeLinecap="square" />
          <line x1={105} y1={100} x2={125} y2={127} stroke="#10B981" strokeWidth={3} strokeDasharray="3 3" />
          {/* Tsuba Guard */}
          <rect x={118} y={118} width={14} height={4} rx={1} fill="#FACC15" transform="rotate(35 125 120)" />

          {/* Katana 2 (Diagonal Right-Down) */}
          <line x1={280} y1={120} x2={130} y2={320} stroke="#10B981" strokeWidth={4.5} strokeLinecap="round" filter={`url(#screen-glow-${uid})`} />
          <line x1={280} y1={120} x2={130} y2={320} stroke="#FFFFFF" strokeWidth={1.5} strokeLinecap="round" />
          {/* Tsuka / Handle */}
          <line x1={295} y1={100} x2={275} y2={127} stroke="#18181B" strokeWidth={8} strokeLinecap="square" />
          <line x1={295} y1={100} x2={275} y2={127} stroke="#10B981" strokeWidth={3} strokeDasharray="3 3" />
          {/* Tsuba Guard */}
          <rect x={268} y={118} width={14} height={4} rx={1} fill="#FACC15" transform="rotate(-35 275 120)" />
        </g>
      );
    }

    // 7. SPACE COMMANDER: Life-Support Thruster Backpack with Ion Plumes
    if (skin === "space_explorer" || skin === "astronaut_suit") {
      return (
        <g id="bundle-back-space-commander">
          {/* Pressurized Main Backpack Frame */}
          <rect x={132} y={210} width={136} height={96} rx={22} fill="#E2E8F0" stroke="#94A3B8" strokeWidth={2.5} />
          {/* Oxygen Reserve Dual Cylinders */}
          <rect x={142} y={218} width={26} height={78} rx={12} fill="#EA580C" stroke="#C2410C" strokeWidth={2} />
          <rect x={232} y={218} width={26} height={78} rx={12} fill="#EA580C" stroke="#C2410C" strokeWidth={2} />
          {/* Left Ion Thruster Nozzle */}
          <polygon points="122,285 142,285 146,310 118,310" fill="#334155" stroke="#1E293B" strokeWidth={1.5} />
          <polygon points="120,310 144,310 132,345" fill="#00E5FF" opacity={0.85} filter={`url(#screen-glow-${uid})`} />
          <polygon points="124,310 140,310 132,335" fill="#FFFFFF" />
          {/* Right Ion Thruster Nozzle */}
          <polygon points="258,285 278,285 282,310 254,310" fill="#334155" stroke="#1E293B" strokeWidth={1.5} />
          <polygon points="256,310 280,310 268,345" fill="#00E5FF" opacity={0.85} filter={`url(#screen-glow-${uid})`} />
          <polygon points="260,310 276,310 268,335" fill="#FFFFFF" />
        </g>
      );
    }

    // 8. MECHA PIRATE: Flowing Buccaneer Coat Tails & Holographic Banner
    if (skin === "pirate") {
      return (
        <g id="bundle-back-pirate">
          {/* Draped Buccaneer Coat Tails */}
          <path
            d="M 142 230 Q 200 220 258 230 L 278 348 Q 200 362 122 348 Z"
            fill="#271C19"
            stroke="#D97706"
            strokeWidth={2}
          />
          {/* Golden Coat Trim */}
          <path
            d="M 124 344 Q 200 360 276 344 L 278 350 Q 200 366 122 350 Z"
            fill="#F59E0B"
          />
          {/* Holographic Jolly Roger Crossbones Banner */}
          <g opacity={0.65}>
            <circle cx={295} cy={165} r={18} fill="none" stroke="#F59E0B" strokeWidth={1.5} filter={`url(#screen-glow-${uid})`} />
            <circle cx={295} cy={162} r={5} fill="#F59E0B" />
            <line x1={283} y1={172} x2={307} y2={172} stroke="#F59E0B" strokeWidth={2} strokeLinecap="round" />
          </g>
        </g>
      );
    }

    // 9. ARCANE MACHINE: Orbiting Glowing Holographic Runic Circle & Energy Staff
    if (skin === "arcane_machine" || skin === "tech_mage") {
      return (
        <g id="bundle-back-arcane-machine">
          {/* Techno-Arcane Levitating Energy Staff */}
          <line x1={290} y1={75} x2={280} y2={340} stroke="#4C1D95" strokeWidth={6} strokeLinecap="round" />
          <line x1={290} y1={75} x2={280} y2={340} stroke="#A855F7" strokeWidth={2} strokeLinecap="round" />
          {/* Staff Headpiece & Floating Gyro Power Orb */}
          <circle cx={290} cy={72} r={16} fill="none" stroke="#FBBF24" strokeWidth={2.5} filter={`url(#screen-glow-${uid})`} />
          <circle cx={290} cy={72} r={8} fill="#C084FC" filter={`url(#screen-glow-${uid})`} />
          <circle cx={290} cy={72} r={4} fill="#FFFFFF" />
          {/* Orbiting Floating Holographic Arcane Rune Ring */}
          <circle cx={200} cy={180} r={115} fill="none" stroke="#A855F7" strokeWidth={2} strokeDasharray="14 10" opacity={0.7} filter={`url(#screen-glow-${uid})`} />
          <circle cx={200} cy={180} r={125} fill="none" stroke="#C084FC" strokeWidth={1} strokeDasharray="6 6" opacity={0.5} />
          {/* Arcane Glyphs on Ring */}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const gx = 200 + Math.cos(rad) * 115;
            const gy = 180 + Math.sin(rad) * 115;
            return (
              <polygon
                key={`rune-${i}`}
                points={`${gx},${gy - 4} ${gx + 4},${gy} ${gx},${gy + 4} ${gx - 4},${gy}`}
                fill="#FBBF24"
                filter={`url(#screen-glow-${uid})`}
              />
            );
          })}
        </g>
      );
    }

    // 10. F1 MACHINE: Carbon Aero-Wing & Twin Nitro Flame Exhausts
    if (skin === "racing" || skin === "formula_racer") {
      return (
        <g id="bundle-back-racing">
          {/* High-Downforce Carbon Rear Wing Aero Spoiler */}
          <path d="M 108 195 L 292 195 L 286 210 L 114 210 Z" fill="#0F172A" stroke="#3B82F6" strokeWidth={2} />
          {/* Wing Endplates */}
          <polygon points="106,182 116,182 114,222 104,222" fill="#1D4ED8" stroke="#60A5FA" strokeWidth={1.5} />
          <polygon points="284,182 294,182 296,222 286,222" fill="#1D4ED8" stroke="#60A5FA" strokeWidth={1.5} />
          {/* Spoiler Mount Struts */}
          <line x1={148} y1={210} x2={156} y2={250} stroke="#334155" strokeWidth={4} />
          <line x1={252} y1={210} x2={244} y2={250} stroke="#334155" strokeWidth={4} />
          {/* Twin Exhaust Nozzles with Nitro Flames */}
          <rect x={136} y={285} width={16} height={20} rx={3} fill="#1E293B" stroke="#64748B" strokeWidth={1.5} />
          <polygon points="138,305 150,305 144,338" fill="#3B82F6" opacity={0.9} filter={`url(#screen-glow-${uid})`} />
          <polygon points="140,305 148,305 144,325" fill="#FACC15" />

          <rect x={248} y={285} width={16} height={20} rx={3} fill="#1E293B" stroke="#64748B" strokeWidth={1.5} />
          <polygon points="250,305 262,305 256,338" fill="#3B82F6" opacity={0.9} filter={`url(#screen-glow-${uid})`} />
          <polygon points="252,305 260,305 256,325" fill="#FACC15" />
        </g>
      );
    }

    // 11. INFERNO OVERLORD: Magma Exhaust Chimneys & Floating Embers
    if (skin === "inferno_warrior") {
      return (
        <g id="bundle-back-inferno">
          {/* Dual Volcanic Exhaust Chimneys */}
          <polygon points="126,220 144,220 140,165 122,165" fill="#18181B" stroke="#FF3D00" strokeWidth={2} />
          <ellipse cx={131} cy={165} rx={9} ry={3} fill="#FF3D00" filter={`url(#screen-glow-${uid})`} />
          <polygon points="124,165 138,165 131,130" fill="#FF3D00" opacity={0.7} filter={`url(#screen-glow-${uid})`} />

          <polygon points="256,220 274,220 278,165 260,165" fill="#18181B" stroke="#FF3D00" strokeWidth={2} />
          <ellipse cx={269} cy={165} rx={9} ry={3} fill="#FF3D00" filter={`url(#screen-glow-${uid})`} />
          <polygon points="262,165 276,165 269,130" fill="#FF3D00" opacity={0.7} filter={`url(#screen-glow-${uid})`} />
          {/* Floating Glowing Lava Sparks / Embers */}
          {[
            { x: 110, y: 140, r: 3 },
            { x: 285, y: 135, r: 3.5 },
            { x: 98, y: 220, r: 2.5 },
            { x: 300, y: 215, r: 3 },
            { x: 135, y: 105, r: 4 },
            { x: 265, y: 100, r: 4 }
          ].map((sp, i) => (
            <circle key={`ember-${i}`} cx={sp.x} cy={sp.y} r={sp.r} fill="#FDE047" filter={`url(#screen-glow-${uid})`} />
          ))}
        </g>
      );
    }

    // 12. COVERT AGENT: Trenchcoat silhouette
    if (skin === "agent") {
      return (
        <g id="bundle-back-agent">
          <path
            d="M 140 220 Q 200 210 260 220 L 274 340 Q 200 354 126 340 Z"
            fill="#09090B"
            stroke="#27272A"
            strokeWidth={2}
          />
        </g>
      );
    }

    return null;
  };

  // 5b. 1-PIECE FULL BODY SKINS & FULL BUNDLES
  const renderSkinOutfit = () => {
    const skin = norm.skinOutfit || norm.activeBundle;
    if (!skin || skin === "none") return null;

    const tc = rig.torsoCenter;
    const ls = rig.leftShoulderSocket;
    const rs = rig.rightShoulderSocket;

    // 1. MILITARY BUNDLE (Tactical Spec-Ops Armor)
    if (skin === "military") {
      return (
        <g id="bundle-military">
          {/* Tactical Camo Kevlar Vest */}
          <path
            d="M 148 220 L 252 220 L 244 310 L 156 310 Z"
            fill="#273424"
            stroke="#1B2418"
            strokeWidth={2}
          />
          {/* Camouflage Mottled Patterns */}
          <ellipse cx={170} cy={240} rx={14} ry={8} fill="#3B4D36" />
          <ellipse cx={226} cy={248} rx={16} ry={9} fill="#4D3E2B" />
          <ellipse cx={185} cy={280} rx={18} ry={10} fill="#3B4D36" />
          <ellipse cx={220} cy={285} rx={12} ry={7} fill="#1B2418" />

          {/* Molle Webbing Straps */}
          <line x1={154} y1={255} x2={246} y2={255} stroke="#1B2418" strokeWidth={2.5} strokeDasharray="6 4" />
          <line x1={156} y1={275} x2={244} y2={275} stroke="#1B2418" strokeWidth={2.5} strokeDasharray="6 4" />

          {/* Tactical Utility Ammo Pouches */}
          <rect x={162} y={282} width={20} height={24} rx={3} fill="#3B4D36" stroke="#1B2418" strokeWidth={1.5} />
          <rect x={190} y={282} width={20} height={24} rx={3} fill="#3B4D36" stroke="#1B2418" strokeWidth={1.5} />
          <rect x={218} y={282} width={20} height={24} rx={3} fill="#3B4D36" stroke="#1B2418" strokeWidth={1.5} />

          {/* Spec-Ops Chest Insignia & Radio */}
          <rect x={160} y={230} width={26} height={14} rx={2} fill="#1B2418" stroke="#4D3E2B" strokeWidth={1} />
          <circle cx={173} cy={237} r={3} fill="#EF4444" />
          <path d="M 235 220 L 235 210" stroke="#1B2418" strokeWidth={2} strokeLinecap="round" />
        </g>
      );
    }

    // 2. SNOW MILITARY BUNDLE (Arctic Camo Combat Rig)
    if (skin === "snow_military") {
      return (
        <g id="bundle-snow-military">
          {/* Arctic Insulated Vest */}
          <path
            d="M 148 220 L 252 220 L 244 310 L 156 310 Z"
            fill="#E2E8F0"
            stroke="#94A3B8"
            strokeWidth={2}
          />
          {/* Digital Snow Camo Rectangles */}
          <rect x={160} y={232} width={14} height={10} fill="#94A3B8" opacity={0.6} />
          <rect x={218} y={238} width={18} height={12} fill="#64748B" opacity={0.5} />
          <rect x={174} y={265} width={20} height={14} fill="#CBD5E1" />
          <rect x={210} y={278} width={16} height={12} fill="#94A3B8" opacity={0.7} />

          {/* Sub-Zero Fur / Thermal Collar */}
          <path d="M 146 220 Q 200 236 254 220 L 250 230 Q 200 244 150 230 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth={1.5} />

          {/* Glacial Cyan Webbing Clips */}
          <line x1={154} y1={258} x2={246} y2={258} stroke="#475569" strokeWidth={2} />
          <rect x={170} y={253} width={10} height={10} rx={2} fill="#00E5FF" stroke="#0284C7" strokeWidth={1} filter={`url(#screen-glow-${uid})`} />
          <rect x={220} y={253} width={10} height={10} rx={2} fill="#00E5FF" stroke="#0284C7" strokeWidth={1} filter={`url(#screen-glow-${uid})`} />

          {/* Arctic Survival Battery Pack on Hip */}
          <rect x={175} y={286} width={50} height={18} rx={4} fill="#334155" stroke="#64748B" strokeWidth={1.5} />
          <circle cx={190} cy={295} r={3} fill="#38BDF8" filter={`url(#screen-glow-${uid})`} />
          <circle cx={210} cy={295} r={3} fill="#10B981" />
        </g>
      );
    }

    // 3. TERMINATOR BUNDLE (Endoskeleton Combat Body)
    if (skin === "terminator") {
      return (
        <g id="bundle-terminator">
          {/* Dark Titanium Under-chassis */}
          <path
            d="M 150 222 L 250 222 L 242 310 L 158 310 Z"
            fill="#0F172A"
            stroke="#334155"
            strokeWidth={2}
          />
          {/* Exposed Metallic Ribs */}
          {[235, 252, 269, 286].map((y, i) => (
            <g key={`rib-${i}`}>
              <path d={`M 154 ${y} Q 200 ${y - 6} 246 ${y}`} fill="none" stroke="#94A3B8" strokeWidth={4} strokeLinecap="round" />
              <path d={`M 154 ${y} Q 200 ${y - 6} 246 ${y}`} fill="none" stroke="#F1F5F9" strokeWidth={1.5} strokeLinecap="round" />
            </g>
          ))}

          {/* Center Spine Piston Rod */}
          <line x1={tc.x} y1={224} x2={tc.x} y2={308} stroke="#CBD5E1" strokeWidth={6} />
          <line x1={tc.x} y1={224} x2={tc.x} y2={308} stroke="#DC2626" strokeWidth={2} strokeDasharray="3 3" />

          {/* Hydraulic Cylinder Tubes on Sides */}
          <rect x={156} y={242} width={6} height={48} rx={2} fill="#64748B" stroke="#334155" strokeWidth={1} />
          <rect x={238} y={242} width={6} height={48} rx={2} fill="#64748B" stroke="#334155" strokeWidth={1} />

          {/* Glowing Red Conduit Core */}
          <circle cx={tc.x} cy={266} r={8} fill="#DC2626" stroke="#FFFFFF" strokeWidth={1.5} filter={`url(#screen-glow-${uid})`} />
        </g>
      );
    }

    // 4. FOOTBALL BUNDLE (Athletic Match Kit)
    if (skin === "football") {
      return (
        <g id="bundle-football">
          {/* Striker Match Jersey */}
          <path
            d="M 148 220 L 252 220 L 244 310 L 156 310 Z"
            fill="#0284C7"
            stroke="#0369A1"
            strokeWidth={2}
          />
          {/* White Vertical Team Stripes */}
          <rect x={166} y={220} width={12} height={90} fill="#F8FAFC" />
          <rect x={194} y={220} width={12} height={90} fill="#F8FAFC" />
          <rect x={222} y={220} width={12} height={90} fill="#F8FAFC" />

          {/* V-Neck Collar */}
          <polygon points="184,220 216,220 200,238" fill="#FACC15" stroke="#CA8A04" strokeWidth={1} />

          {/* Iconic #10 Striker Squad Number */}
          <text x={tc.x} y={276} fontSize="20" fontWeight="900" fill="#0F172A" textAnchor="middle" fontFamily="sans-serif">
            10
          </text>

          {/* Team Crest & Gold Star */}
          <circle cx={166} cy={242} r={7} fill="#FACC15" stroke="#CA8A04" strokeWidth={1} />
          <polygon points="166,238 168,243 173,243 169,246 171,251 166,248 161,251 163,246 159,243 164,243" fill="#EF4444" />
        </g>
      );
    }

    // 5. SPACE EXPLORER BUNDLE (Astronaut EVA Suit)
    if (skin === "space_explorer" || skin === "astronaut_suit") {
      return (
        <g id="bundle-space-explorer">
          {/* Pressurized Chest Cover */}
          <path
            d="M 154 220 C 150 250 152 285 160 306 C 185 312 215 312 240 306 C 248 285 250 250 246 220 Z"
            fill="#F1F5F9"
            stroke="#94A3B8"
            strokeWidth={2}
          />
          {/* Thermal Jumpsuit Seams */}
          <path d="M 200 220 L 200 310" stroke="#CBD5E1" strokeWidth={2} strokeDasharray="2 2" />
          <path d="M 160 256 L 240 256" stroke="#CBD5E1" strokeWidth={1.5} />
          {/* NASA/Aerospace Mission Badge */}
          <ellipse cx={174} cy={242} rx={9} ry={9} fill="#0284C7" stroke="#38BDF8" strokeWidth={1} />
          <path d="M 168 244 L 174 236 L 180 244 Z" fill="#F8FAFC" />
          {/* Life-support control box */}
          <rect x={186} y={262} width={34} height={26} rx={4} fill="#0F172A" stroke="#38BDF8" strokeWidth={1.5} />
          <rect x={190} y={266} width={12} height={8} rx={2} fill="#00E5FF" filter={`url(#screen-glow-${uid})`} />
          <circle cx={212} cy={270} r={2} fill="#10B981" />
          <circle cx={212} cy={278} r={2} fill="#EF4444" />
          {/* Utility oxygen connector hose */}
          <path d="M 203 288 C 203 298 226 298 226 312" fill="none" stroke="#64748B" strokeWidth={3} strokeLinecap="round" />
        </g>
      );
    }

    // 6. INFERNO WARRIOR BUNDLE (Molten Obsidian Carapace)
    if (skin === "inferno_warrior") {
      return (
        <g id="bundle-inferno-warrior">
          {/* Obsidian Carapace Plates */}
          <path
            d="M 148 220 L 252 220 L 244 310 L 156 310 Z"
            fill="#18181B"
            stroke="#FF3D00"
            strokeWidth={2.5}
          />
          {/* Glowing Molten Lava Fissures */}
          <path
            d="M 160 230 L 175 250 L 170 275 L 185 305"
            stroke="#FF3D00"
            strokeWidth={3}
            fill="none"
            filter={`url(#screen-glow-${uid})`}
          />
          <path
            d="M 240 230 L 225 255 L 230 280 L 215 305"
            stroke="#FF3D00"
            strokeWidth={3}
            fill="none"
            filter={`url(#screen-glow-${uid})`}
          />
          <path
            d="M 175 250 L 225 255"
            stroke="#F59E0B"
            strokeWidth={2}
            fill="none"
            filter={`url(#screen-glow-${uid})`}
          />

          {/* Central Molten Magma Core */}
          <polygon
            points={`${tc.x},252 ${tc.x + 16},268 ${tc.x},284 ${tc.x - 16},268`}
            fill="#FF3D00"
            stroke="#FDE047"
            strokeWidth={2}
            filter={`url(#screen-glow-${uid})`}
          />
          <circle cx={tc.x} cy={268} r={5} fill="#FFFFFF" />

          {/* Heavy Shoulder Thermal Vents */}
          <rect x={152} y={224} width={12} height={6} rx={1} fill="#F59E0B" />
          <rect x={236} y={224} width={12} height={6} rx={1} fill="#F59E0B" />
        </g>
      );
    }

    // 7. RACING BUNDLE (Aero Grand Prix Suit)
    if (skin === "racing" || skin === "formula_racer") {
      return (
        <g id="bundle-racing">
          {/* Aerodynamic Speed Jumpsuit */}
          <path
            d="M 150 220 L 250 220 L 244 310 C 220 318 180 318 156 310 Z"
            fill="#1D4ED8"
            stroke="#60A5FA"
            strokeWidth={2}
          />
          {/* Checkered Racing Stripe on side */}
          <g>
            {[0, 1, 2, 3].map((row) => (
              <React.Fragment key={`check-${row}`}>
                <rect x={154} y={230 + row * 16} width={8} height={8} fill={row % 2 === 0 ? "#FFFFFF" : "#0F172A"} />
                <rect x={162} y={230 + row * 16} width={8} height={8} fill={row % 2 === 1 ? "#FFFFFF" : "#0F172A"} />
                <rect x={230} y={230 + row * 16} width={8} height={8} fill={row % 2 === 0 ? "#FFFFFF" : "#0F172A"} />
                <rect x={238} y={230 + row * 16} width={8} height={8} fill={row % 2 === 1 ? "#FFFFFF" : "#0F172A"} />
              </React.Fragment>
            ))}
          </g>
          {/* Central Racing Stripe & Sponsor Badge */}
          <rect x={192} y={220} width={16} height={90} fill="#EF4444" />
          <rect x={186} y={260} width={28} height={14} rx={3} fill="#FACC15" stroke="#CA8A04" strokeWidth={1} />
          <text x={200} y={270} fontSize="8" fontWeight="bold" fill="#000000" textAnchor="middle" fontFamily="monospace">TURBO</text>
        </g>
      );
    }

    // 8. PIRATE BUNDLE (Cyber Buccaneer Coat)
    if (skin === "pirate") {
      return (
        <g id="bundle-pirate">
          {/* Buccaneer Longcoat */}
          <path
            d="M 146 220 L 254 220 L 246 312 L 154 312 Z"
            fill="#3E2723"
            stroke="#271C19"
            strokeWidth={2}
          />
          {/* Gold Epaulets on Shoulders */}
          <path d="M 144 220 L 168 220 L 164 232 L 142 230 Z" fill="#F59E0B" stroke="#B45309" strokeWidth={1.5} />
          <path d="M 256 220 L 232 220 L 236 232 L 258 230 Z" fill="#F59E0B" stroke="#B45309" strokeWidth={1.5} />

          {/* Crimson Velvet Inner Vest & Golden Skull Buttons */}
          <polygon points="174,220 226,220 216,310 184,310" fill="#991B1B" />
          {[236, 256, 276, 296].map((y, i) => (
            <circle key={`btn-${i}`} cx={tc.x} cy={y} r={3} fill="#FDE68A" stroke="#B45309" strokeWidth={1} />
          ))}

          {/* Golden Pirate Sash & Buccaneer Belt */}
          <path d="M 152 288 L 248 296 L 244 310 L 154 304 Z" fill="#D97706" stroke="#78350F" strokeWidth={1.5} />
          <rect x={190} y={290} width={20} height={16} rx={3} fill="#F59E0B" stroke="#78350F" strokeWidth={1.5} />

          {/* Gold Skull Crossbones Badge on Lapel */}
          <circle cx={166} cy={246} r={5} fill="#FDE68A" stroke="#78350F" strokeWidth={1} />
        </g>
      );
    }

    // 9. MECHANIC BUNDLE (Workshop Overalls & Tool Harness)
    if (skin === "mechanic") {
      return (
        <g id="bundle-mechanic">
          {/* Heavy Utility Navy Overalls */}
          <path
            d="M 150 220 L 250 220 L 244 310 L 156 310 Z"
            fill="#1E3A8A"
            stroke="#172554"
            strokeWidth={2}
          />
          {/* Safety Orange Suspenders */}
          <rect x={162} y={220} width={12} height={90} fill="#EA580C" stroke="#9A3412" strokeWidth={1} />
          <rect x={226} y={220} width={12} height={90} fill="#EA580C" stroke="#9A3412" strokeWidth={1} />

          {/* Utility Chest Pocket with Tools */}
          <rect x={182} y={248} width={36} height={28} rx={3} fill="#172554" stroke="#EA580C" strokeWidth={1.5} />
          {/* Wrench Peeking Out */}
          <line x1={190} y1={240} x2={196} y2={256} stroke="#CBD5E1" strokeWidth={3} strokeLinecap="round" />
          <circle cx={189} cy={238} r={3.5} fill="none" stroke="#CBD5E1" strokeWidth={2} />
          {/* Screwdriver Handle */}
          <rect x={204} y={236} width={4} height={16} rx={1} fill="#EF4444" />

          {/* Grease / Oil Stain Decal */}
          <ellipse cx={228} cy={285} rx={8} ry={5} fill="#0F172A" opacity={0.6} />
        </g>
      );
    }

    // 10. AGENT BUNDLE (Tactical Stealth Ballistic Tuxedo)
    if (skin === "agent") {
      return (
        <g id="bundle-agent">
          {/* Ballistic Jet Black Tuxedo Jacket */}
          <path
            d="M 148 220 L 252 220 L 244 310 L 156 310 Z"
            fill="#09090B"
            stroke="#27272A"
            strokeWidth={2}
          />
          {/* White Crisp Dress Shirt Insert */}
          <polygon points="180,220 220,220 208,280 192,280" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth={1} />

          {/* Covert Crimson Tie */}
          <polygon points="198,226 202,226 204,272 200,278 196,272" fill="#DC2626" stroke="#991B1B" strokeWidth={1} />

          {/* Lapels */}
          <polygon points="152,220 180,220 194,270 170,270" fill="#18181B" stroke="#27272A" strokeWidth={1} />
          <polygon points="248,220 220,220 206,270 230,270" fill="#18181B" stroke="#27272A" strokeWidth={1} />

          {/* Secret Agency Gold Lapel Pin & Comms Wire */}
          <circle cx={172} cy={238} r={3} fill="#FACC15" stroke="#CA8A04" strokeWidth={1} />
          <path d="M 230 220 Q 240 215 242 208" stroke="#38BDF8" strokeWidth={1.5} fill="none" />
        </g>
      );
    }

    // 11. ARCTIC EXPLORER BUNDLE (Polar Parka & Ice Gear)
    if (skin === "arctic_explorer") {
      return (
        <g id="bundle-arctic-explorer">
          {/* Heavy Fur-Lined Polar Parka */}
          <path
            d="M 146 220 C 142 255 146 290 156 312 C 185 320 215 320 244 312 C 254 290 258 255 254 220 Z"
            fill="#0369A1"
            stroke="#075985"
            strokeWidth={2}
          />
          {/* Heavy Fur Hood Trim */}
          <path d="M 144 220 Q 200 238 256 220 L 250 232 Q 200 248 150 232 Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth={2} />

          {/* Glacier Ice Harness & Carabiners */}
          <line x1={160} y1={238} x2={240} y2={298} stroke="#F59E0B" strokeWidth={3} />
          <line x1={240} y1={238} x2={160} y2={298} stroke="#F59E0B" strokeWidth={3} />
          <circle cx={tc.x} cy={268} r={6} fill="#CBD5E1" stroke="#475569" strokeWidth={2} />

          {/* Sub-Zero Thermal Battery HUD */}
          <rect x={178} y={288} width={44} height={16} rx={3} fill="#0C4A6E" stroke="#00E5FF" strokeWidth={1.5} />
          <rect x={182} y={292} width={18} height={8} rx={1} fill="#00E5FF" filter={`url(#screen-glow-${uid})`} />
          <text x={212} y={299} fontSize="7" fontWeight="bold" fill="#00E5FF" fontFamily="monospace">-40°</text>
        </g>
      );
    }

    // 12. CYBER SAMURAI BUNDLE
    if (skin === "cyber_samurai") {
      return (
        <g id="bundle-cyber-samurai">
          {/* Lacquered Armor Plates (Do) */}
          <path
            d="M 148 226 L 252 226 L 244 250 L 156 250 Z"
            fill="#1E293B"
            stroke="#DC2626"
            strokeWidth={2}
          />
          <path
            d="M 152 253 L 248 253 L 240 274 L 160 274 Z"
            fill="#0F172A"
            stroke="#DC2626"
            strokeWidth={2}
          />
          <path
            d="M 158 277 L 242 277 L 234 298 L 166 298 Z"
            fill="#1E293B"
            stroke="#DC2626"
            strokeWidth={2}
          />
          {/* Gold Lacing Cord Details */}
          {[-25, 0, 25].map((dx, i) => (
            <line key={`lace-${i}`} x1={tc.x + dx} y1={226} x2={tc.x + dx} y2={298} stroke="#FBBF24" strokeWidth={1.5} strokeDasharray="3 3" />
          ))}
          {/* Shoulder Sode Armor Guards */}
          <path d={`M ${ls.x - 12} ${ls.y - 12} L ${ls.x + 8} ${ls.y - 8} L ${ls.x + 2} ${ls.y + 22} L ${ls.x - 18} ${ls.y + 16} Z`} fill="#0F172A" stroke="#DC2626" strokeWidth={2} />
          <path d={`M ${rs.x - 8} ${rs.y - 8} L ${rs.x + 12} ${rs.y - 12} L ${rs.x + 18} ${rs.y + 16} L ${rs.x - 2} ${rs.y + 22} Z`} fill="#0F172A" stroke="#DC2626" strokeWidth={2} />
          {/* Scarlet Obi Sash */}
          <rect x={156} y={298} width={88} height={14} rx={3} fill="#DC2626" stroke="#991B1B" strokeWidth={1.5} />
          <circle cx={tc.x} cy={305} r={5} fill="#FBBF24" stroke="#D97706" strokeWidth={1} />
        </g>
      );
    }

    if (skin === "cyber_ninja") {
      return (
        <g id="skin-cyber-ninja">
          {/* Matte Stealth Bodysuit */}
          <path
            d="M 152 222 C 150 255 152 285 160 308 C 185 314 215 314 240 308 C 248 285 250 255 248 222 Z"
            fill="#09090B"
            stroke="#27272A"
            strokeWidth={2}
          />
          {/* Glowing Power Harness Straps */}
          <path d="M 158 226 L 238 296" stroke="#10B981" strokeWidth={3.5} filter={`url(#screen-glow-${uid})`} />
          <path d="M 242 226 L 162 296" stroke="#10B981" strokeWidth={3.5} filter={`url(#screen-glow-${uid})`} />
          {/* Center Tactical Locking Buckle */}
          <rect x={tc.x - 7} y={254} width={14} height={14} rx={3} fill="#18181B" stroke="#10B981" strokeWidth={1.5} />
          <circle cx={tc.x} cy={261} r={3} fill="#10B981" />
          {/* Kunai holsters on waist */}
          <rect x={164} y={298} width={20} height={7} rx={2} fill="#27272A" stroke="#10B981" strokeWidth={1} />
          <polygon points="174,305 178,318 170,318" fill="#71717A" />
        </g>
      );
    }

    if (skin === "streetwear_tracksuit") {
      return (
        <g id="skin-streetwear-tracksuit">
          {/* Two-Tone Windbreaker Jacket */}
          <path
            d="M 150 220 L 250 220 L 244 308 C 220 316 180 316 156 308 Z"
            fill="#312E81"
            stroke="#4338CA"
            strokeWidth={2}
          />
          {/* Cyber Pink / Neon Side Racing Panels */}
          <path d="M 150 220 L 168 220 L 174 308 L 156 308 Z" fill="#F43F5E" />
          <path d="M 250 220 L 232 220 L 226 308 L 244 308 Z" fill="#F43F5E" />
          {/* Center Gold Zipper & Cyber Chain */}
          <line x1={tc.x} y1={220} x2={tc.x} y2={310} stroke="#FBBF24" strokeWidth={2.5} strokeDasharray="3 2" />
          {/* Cyber Medallion / Pendant */}
          <polygon points={`${tc.x},242 ${tc.x + 6},250 ${tc.x},258 ${tc.x - 6},250`} fill="#FBBF24" stroke="#D97706" strokeWidth={1} />
          {/* Ribbed Bottom Hem */}
          <rect x={156} y={306} width={88} height={8} rx={2} fill="#1E1B4B" stroke="#4338CA" strokeWidth={1} />
        </g>
      );
    }

    if (skin === "tech_mage") {
      return (
        <g id="skin-tech-mage">
          {/* Arcane Cyber Mantle & Tunic */}
          <path
            d="M 146 220 C 142 260 148 290 156 318 C 185 324 215 324 244 318 C 252 290 258 260 254 220 Z"
            fill="#2E1065"
            stroke="#A855F7"
            strokeWidth={2}
          />
          {/* Gold Filigree Mantle Edging */}
          <path d="M 148 222 Q 200 246 252 222" stroke="#FBBF24" strokeWidth={3} fill="none" />
          {/* Glowing Quantum Circuit Runes */}
          <path d="M 170 248 L 178 260 L 178 285 L 170 295" stroke="#C084FC" strokeWidth={2} fill="none" filter={`url(#screen-glow-${uid})`} />
          <path d="M 230 248 L 222 260 L 222 285 L 230 295" stroke="#C084FC" strokeWidth={2} fill="none" filter={`url(#screen-glow-${uid})`} />
          {/* Arcane Amethyst Talisman */}
          <polygon points={`${tc.x},265 ${tc.x + 8},276 ${tc.x},287 ${tc.x - 8},276`} fill="#C084FC" stroke="#FFFFFF" strokeWidth={1.5} filter={`url(#screen-glow-${uid})`} />
        </g>
      );
    }

    if (skin === "heavy_hazard_exosuit") {
      return (
        <g id="skin-heavy-hazard">
          {/* Industrial Reinforced Plate */}
          <path
            d="M 148 220 L 252 220 L 244 310 L 156 310 Z"
            fill="#18181B"
            stroke="#F59E0B"
            strokeWidth={2.5}
          />
          {/* Diagonal Hazard Warning Stripes */}
          <g>
            <polygon points="160,224 172,224 154,248 148,248" fill="#F59E0B" />
            <polygon points="182,224 194,224 168,260 156,260" fill="#F59E0B" />
            <polygon points="204,224 216,224 186,268 174,268" fill="#F59E0B" />
            <polygon points="226,224 238,224 204,276 192,276" fill="#F59E0B" />
            <polygon points="244,228 248,236 222,284 210,284" fill="#F59E0B" />
          </g>
          {/* Heavy Reinforced Rivets & Hydraulic Shoulder Pistons */}
          <circle cx={156} cy={228} r={3} fill="#71717A" stroke="#27272A" strokeWidth={1} />
          <circle cx={244} cy={228} r={3} fill="#71717A" stroke="#27272A" strokeWidth={1} />
          <circle cx={162} cy={302} r={3} fill="#71717A" stroke="#27272A" strokeWidth={1} />
          <circle cx={238} cy={302} r={3} fill="#71717A" stroke="#27272A" strokeWidth={1} />
        </g>
      );
    }

    if (skin === "deep_sea_diver") {
      return (
        <g id="skin-deep-sea-diver">
          {/* Canvas Diving Body Suit */}
          <path
            d="M 150 220 C 146 255 150 290 158 312 C 185 318 215 318 242 312 C 250 290 254 255 250 220 Z"
            fill="#0E7490"
            stroke="#155E75"
            strokeWidth={2}
          />
          {/* Heavy Brass Collar Ring */}
          <ellipse cx={tc.x} cy={222} rx={46} ry={12} fill="#D97706" stroke="#92400E" strokeWidth={2.5} />
          {[-32, -16, 0, 16, 32].map((dx, i) => (
            <circle key={`brass-bolt-${i}`} cx={tc.x + dx} cy={222} r={2.5} fill="#FDE68A" stroke="#78350F" strokeWidth={1} />
          ))}
          {/* Analog Depth Pressure Gauge */}
          <circle cx={tc.x} cy={268} r={14} fill="#FEF3C7" stroke="#B45309" strokeWidth={2.5} />
          <circle cx={tc.x} cy={268} r={11} fill="none" stroke="#78350F" strokeWidth={1} strokeDasharray="1.5 1.5" />
          <line x1={tc.x} y1={268} x2={tc.x + 6} y2={264} stroke="#DC2626" strokeWidth={2} strokeLinecap="round" />
          <circle cx={tc.x} cy={268} r={2} fill="#78350F" />
        </g>
      );
    }

    if (skin === "royal_monarch") {
      return (
        <g id="skin-royal-monarch">
          {/* Imperial Velvet Mantle */}
          <path
            d="M 146 220 C 142 260 146 295 156 318 C 185 324 215 324 244 318 C 254 295 258 260 254 220 Z"
            fill="#4C1D95"
            stroke="#6D28D9"
            strokeWidth={2}
          />
          {/* White Ermine Fur Trim with Black Tufts */}
          <path d="M 146 222 Q 200 240 254 222 L 250 236 Q 200 252 150 236 Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth={1.5} />
          {[-35, -15, 5, 25].map((dx, i) => (
            <path key={`ermine-${i}`} d={`M ${tc.x + dx} 230 L ${tc.x + dx + 3} 238 L ${tc.x + dx - 3} 238 Z`} fill="#0F172A" />
          ))}
          {/* Gold Brocade Regal Diagonal Sash */}
          <path d="M 152 222 L 244 310 L 230 316 L 146 230 Z" fill="#F59E0B" stroke="#B45309" strokeWidth={1.5} />
          {/* Imperial Gold Medallion with Ruby */}
          <circle cx={175} cy={252} r={9} fill="#FDE68A" stroke="#B45309" strokeWidth={2} />
          <circle cx={175} cy={252} r={4.5} fill="#EF4444" />
        </g>
      );
    }

    if (skin === "prism_hologram") {
      return (
        <g id="skin-prism-hologram">
          {/* Iridescent Holographic Diamond Energy Mesh */}
          <path
            d="M 148 220 C 144 260 148 290 156 314 C 185 320 215 320 244 314 C 252 290 256 260 252 220 Z"
            fill="none"
            stroke="#38BDF8"
            strokeWidth={2}
            opacity={0.8}
            filter={`url(#screen-glow-${uid})`}
          />
          <g opacity={0.65}>
            {[-30, -15, 0, 15, 30].map((dx, i) => (
              <line key={`prism-v-${i}`} x1={tc.x + dx} y1={220} x2={tc.x + dx * 0.8} y2={314} stroke={i % 2 === 0 ? "#EC4899" : "#38BDF8"} strokeWidth={1.5} />
            ))}
            {[235, 255, 275, 295].map((y, i) => (
              <line key={`prism-h-${i}`} x1={155} y1={y} x2={245} y2={y} stroke={i % 2 === 0 ? "#FACC15" : "#38BDF8"} strokeWidth={1.5} />
            ))}
          </g>
        </g>
      );
    }

    if (skin === "agent") {
      return (
        <g id="skin-agent">
          {/* Tailored Ballistic Tuxedo / Trench Suit */}
          <path
            d="M 148 220 L 252 220 L 244 310 L 156 310 Z"
            fill="#09090B"
            stroke="#27272A"
            strokeWidth={2}
          />
          {/* Crisp White Shirt V-Neck Collar */}
          <polygon points="182,220 218,220 200,265" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth={1} />
          {/* Crimson Silk Agent Tie */}
          <polygon points="196,228 204,228 206,260 200,272 194,260" fill="#DC2626" stroke="#991B1B" strokeWidth={1} />
          {/* Gold Secret Agent Lapel Pin */}
          <circle cx={168} cy={236} r={3} fill="#FACC15" stroke="#CA8A04" strokeWidth={1} />
          {/* Coiled Acoustic Comms Wire */}
          <path d="M 172 236 Q 165 228 168 220" fill="none" stroke="#71717A" strokeWidth={1.5} />
        </g>
      );
    }

    return null;
  };

  // 6. LIMBS: ARMS & HANDS (Articulated 2-Bone Skeletal Kinematics)
  const renderArmsAndHands = () => {
    const ls = rig.leftShoulderSocket;
    const rs = rig.rightShoulderSocket;
    const le = rig.leftElbowJoint;
    const re = rig.rightElbowJoint;
    const lh = rig.leftHandAnchor;
    const rh = rig.rightHandAnchor;
    const arm = norm.armStyle;
    const hand = norm.handStyle;

    // Helper for rendering custom hand gestures or base hand shapes
    const renderHandGraphic = (anchor: { x: number; y: number }, isLeft: boolean, gesture: string, angle: number) => {
      const transform = `rotate(${angle} ${anchor.x} ${anchor.y})`;

      // Dynamic Action Gesture Overrides
      if (gesture === "wave") {
        return (
          <g id={isLeft ? "left-hand" : "right-hand"} transform={transform}>
            <ellipse cx={anchor.x} cy={anchor.y} rx={9} ry={10} fill={accent.base} stroke={accent.outline} strokeWidth={1.5} />
            {/* Splayed Waving Cyber Fingers */}
            <line x1={anchor.x - 6} y1={anchor.y - 4} x2={anchor.x - 10} y2={anchor.y - 14} stroke={accent.base} strokeWidth={3} strokeLinecap="round" />
            <line x1={anchor.x - 2} y1={anchor.y - 6} x2={anchor.x - 3} y2={anchor.y - 17} stroke={accent.base} strokeWidth={3} strokeLinecap="round" />
            <line x1={anchor.x + 2} y1={anchor.y - 6} x2={anchor.x + 4} y2={anchor.y - 17} stroke={accent.base} strokeWidth={3} strokeLinecap="round" />
            <line x1={anchor.x + 6} y1={anchor.y - 4} x2={anchor.x + 10} y2={anchor.y - 14} stroke={accent.base} strokeWidth={3} strokeLinecap="round" />
            <circle cx={anchor.x} cy={anchor.y} r={3} fill="#FFFFFF" opacity={0.7} />
          </g>
        );
      }

      if (gesture === "point") {
        const dir = isLeft ? -1 : 1;
        return (
          <g id={isLeft ? "left-hand" : "right-hand"} transform={transform}>
            <circle cx={anchor.x} cy={anchor.y} r={8} fill={accent.base} stroke={accent.outline} strokeWidth={1.5} />
            {/* Extended Index Pointer */}
            <line x1={anchor.x} y1={anchor.y} x2={anchor.x + dir * 18} y2={anchor.y - 6} stroke={accent.base} strokeWidth={4.5} strokeLinecap="round" />
            {/* Laser pointer beam emission */}
            <circle cx={anchor.x + dir * 18} cy={anchor.y - 6} r={3} fill={norm.screenGlowColor} filter={`url(#screen-glow-${uid})`} />
            <circle cx={anchor.x + dir * 18} cy={anchor.y - 6} r={1.5} fill="#FFFFFF" />
          </g>
        );
      }

      if (gesture === "fist" || gesture === "clench") {
        return (
          <g id={isLeft ? "left-hand" : "right-hand"} transform={transform}>
            <circle cx={anchor.x} cy={anchor.y} r={9} fill={accent.base} stroke={accent.outline} strokeWidth={1.5} />
            <rect x={anchor.x - 6} y={anchor.y - 6} width={12} height={12} rx={4} fill={accent.light} />
            {[-3, 0, 3].map((dx, i) => (
              <line key={`knuckle-${i}`} x1={anchor.x + dx} y1={anchor.y - 4} x2={anchor.x + dx} y2={anchor.y + 4} stroke={accent.outline} strokeWidth={1.2} />
            ))}
          </g>
        );
      }

      // Base Hand Styles
      if (hand === "three_finger") {
        const sign = isLeft ? -1 : 1;
        return (
          <g id={isLeft ? "left-hand" : "right-hand"} transform={transform}>
            <circle cx={anchor.x} cy={anchor.y} r={7} fill={metal.base} />
            <line x1={anchor.x - 4} y1={anchor.y} x2={anchor.x - 6 - sign * 2} y2={anchor.y + 8} stroke={metal.light} strokeWidth={3.5} strokeLinecap="round" />
            <line x1={anchor.x} y1={anchor.y + 2} x2={anchor.x} y2={anchor.y + 11} stroke={metal.light} strokeWidth={3.5} strokeLinecap="round" />
            <line x1={anchor.x + 4} y1={anchor.y} x2={anchor.x + 6 + sign * 2} y2={anchor.y + 8} stroke={metal.light} strokeWidth={3.5} strokeLinecap="round" />
          </g>
        );
      }

      if (hand === "four_finger") {
        return (
          <g id={isLeft ? "left-hand" : "right-hand"} transform={transform}>
            <circle cx={anchor.x} cy={anchor.y} r={7.5} fill={metal.base} />
            <line x1={anchor.x - 6} y1={anchor.y - 1} x2={anchor.x - 11} y2={anchor.y + 6} stroke={metal.light} strokeWidth={2.8} strokeLinecap="round" />
            <line x1={anchor.x - 2} y1={anchor.y + 1} x2={anchor.x - 4} y2={anchor.y + 11} stroke={metal.light} strokeWidth={2.8} strokeLinecap="round" />
            <line x1={anchor.x + 2} y1={anchor.y + 1} x2={anchor.x + 4} y2={anchor.y + 11} stroke={metal.light} strokeWidth={2.8} strokeLinecap="round" />
            <line x1={anchor.x + 6} y1={anchor.y - 1} x2={anchor.x + 11} y2={anchor.y + 6} stroke={metal.light} strokeWidth={2.8} strokeLinecap="round" />
          </g>
        );
      }

      if (hand === "claw_grabber") {
        return (
          <g id={isLeft ? "left-hand" : "right-hand"} transform={transform}>
            <circle cx={anchor.x} cy={anchor.y} r={6} fill={metal.base} />
            <path d={`M ${anchor.x - 5} ${anchor.y - 2} C ${anchor.x - 13} ${anchor.y + 2}, ${anchor.x - 7} ${anchor.y + 12}, ${anchor.x - 2} ${anchor.y + 8}`} fill="none" stroke={accent.base} strokeWidth={3.5} strokeLinecap="round" />
            <path d={`M ${anchor.x + 3} ${anchor.y - 2} C ${anchor.x + 11} ${anchor.y + 2}, ${anchor.x + 5} ${anchor.y + 12}, ${anchor.x} ${anchor.y + 8}`} fill="none" stroke={accent.base} strokeWidth={3.5} strokeLinecap="round" />
          </g>
        );
      }

      if (hand === "open_palm") {
        return (
          <g id={isLeft ? "left-hand" : "right-hand"} transform={transform}>
            <ellipse cx={anchor.x} cy={anchor.y + 2} rx={11} ry={13} fill={accent.base} stroke={accent.outline} strokeWidth={1.5} />
            <circle cx={anchor.x} cy={anchor.y + 2} r={4.5} fill={norm.screenGlowColor} filter={`url(#screen-glow-${uid})`} />
            <circle cx={anchor.x} cy={anchor.y + 2} r={2} fill="#FFFFFF" />
          </g>
        );
      }

      // Default: mitten
      const thumbOffset = isLeft ? 5 : -5;
      return (
        <g id={isLeft ? "left-hand" : "right-hand"} transform={transform}>
          <ellipse cx={anchor.x} cy={anchor.y + 2} rx={9} ry={11} fill={accent.base} stroke={accent.outline} strokeWidth={1.5} />
          <ellipse cx={anchor.x + thumbOffset} cy={anchor.y - 1} rx={4} ry={5} fill={accent.base} stroke={accent.outline} strokeWidth={1.2} />
          <ellipse cx={anchor.x - 2} cy={anchor.y} rx={3} ry={4} fill="#FFFFFF" opacity={0.6} />
        </g>
      );
    };

    return (
      <g id="robot-arms">
        {/* LEFT ARM & SHOULDER */}
        <g id="left-arm">
          <circle cx={ls.x} cy={ls.y} r={12} fill={`url(#accent-grad-${uid})`} stroke={accent.outline} strokeWidth={1.5} />

          {/* Articulated Left Limb Segment */}
          {arm === "mechanical_segmented" ? (
            <g>
              <line x1={ls.x} y1={ls.y} x2={le.x} y2={le.y} stroke={shell.base} strokeWidth={11} strokeLinecap="round" />
              <circle cx={le.x} cy={le.y} r={6} fill={metal.base} stroke={metal.outline} strokeWidth={1} />
              <line x1={le.x} y1={le.y} x2={lh.x} y2={lh.y} stroke={shell.base} strokeWidth={10} strokeLinecap="round" />
            </g>
          ) : arm === "flexible_bellows" ? (
            <g>
              <path d={rig.leftArmPath} fill="none" stroke={metal.base} strokeWidth={11} strokeLinecap="round" />
              <path d={rig.leftArmPath} fill="none" stroke={metal.light} strokeWidth={9} strokeDasharray="3 3" strokeLinecap="round" />
              <circle cx={le.x} cy={le.y} r={5} fill={metal.base} />
            </g>
          ) : arm === "armored_tech" ? (
            <g>
              <line x1={ls.x} y1={ls.y} x2={le.x} y2={le.y} stroke={shell.base} strokeWidth={11} strokeLinecap="round" />
              <circle cx={le.x} cy={le.y} r={7} fill={accent.base} stroke={accent.outline} strokeWidth={1.5} />
              <line x1={le.x} y1={le.y} x2={lh.x} y2={lh.y} stroke={shell.base} strokeWidth={10} strokeLinecap="round" />
            </g>
          ) : (
            // smooth_satin / mini_paws
            <g>
              <path d={rig.leftArmPath} fill="none" stroke={shell.base} strokeWidth={12} strokeLinecap="round" />
              <circle cx={le.x} cy={le.y} r={5} fill={accent.base} />
            </g>
          )}

          {/* Render Left Hand with Gesture Solver */}
          {renderHandGraphic(lh, true, rig.leftHandGesture, rig.leftHandAngle)}
        </g>

        {/* RIGHT ARM & SHOULDER */}
        <g id="right-arm">
          <circle cx={rs.x} cy={rs.y} r={12} fill={`url(#accent-grad-${uid})`} stroke={accent.outline} strokeWidth={1.5} />

          {/* Articulated Right Limb Segment */}
          {arm === "mechanical_segmented" ? (
            <g>
              <line x1={rs.x} y1={rs.y} x2={re.x} y2={re.y} stroke={shell.base} strokeWidth={11} strokeLinecap="round" />
              <circle cx={re.x} cy={re.y} r={6} fill={metal.base} stroke={metal.outline} strokeWidth={1} />
              <line x1={re.x} y1={re.y} x2={rh.x} y2={rh.y} stroke={shell.base} strokeWidth={10} strokeLinecap="round" />
            </g>
          ) : arm === "flexible_bellows" ? (
            <g>
              <path d={rig.rightArmPath} fill="none" stroke={metal.base} strokeWidth={11} strokeLinecap="round" />
              <path d={rig.rightArmPath} fill="none" stroke={metal.light} strokeWidth={9} strokeDasharray="3 3" strokeLinecap="round" />
              <circle cx={re.x} cy={re.y} r={5} fill={metal.base} />
            </g>
          ) : arm === "armored_tech" ? (
            <g>
              <line x1={rs.x} y1={rs.y} x2={re.x} y2={re.y} stroke={shell.base} strokeWidth={11} strokeLinecap="round" />
              <circle cx={re.x} cy={re.y} r={7} fill={accent.base} stroke={accent.outline} strokeWidth={1.5} />
              <line x1={re.x} y1={re.y} x2={rh.x} y2={rh.y} stroke={shell.base} strokeWidth={10} strokeLinecap="round" />
            </g>
          ) : (
            <g>
              <path d={rig.rightArmPath} fill="none" stroke={shell.base} strokeWidth={12} strokeLinecap="round" />
              <circle cx={re.x} cy={re.y} r={5} fill={accent.base} />
            </g>
          )}

          {/* Render Right Hand with Gesture Solver */}
          {renderHandGraphic(rh, false, rig.rightHandGesture, rig.rightHandAngle)}
        </g>
      </g>
    );
  };

  // 7. LEGS & PROPULSION (Clean 2D Vector Mascot with Vibrant Gradients)
  const renderLegsAndFeet = () => {
    const lh = rig.leftHipSocket;
    const rh = rig.rightHipSocket;
    const lk = rig.leftKneeJoint;
    const rk = rig.rightKneeJoint;
    const lf = rig.leftFootAnchor;
    const rf = rig.rightFootAnchor;
    const leg = norm.legStyle;
    const glow = norm.screenGlowColor;

    // A. HOVER THRUSTER (Clean 2D Vector Rocket Nozzle with Radiant Flame)
    if (leg === "hover_thruster") {
      const topY = 286;
      const nozzleBottomY = 328;

      return (
        <g id="robot-hover-thruster">
          {/* Top Chassis Manifold Collar */}
          <ellipse cx={200} cy={topY} rx={28} ry={6} fill={metal.base} stroke={metal.outline} strokeWidth={1.5} />
          
          {/* Main 2D Conical Rocket Nozzle with Metallic Gradient */}
          <path
            d={`M 174 ${topY} L 226 ${topY} L 216 ${nozzleBottomY} L 184 ${nozzleBottomY} Z`}
            fill={`url(#thruster-metal-grad-${uid})`}
            stroke={metal.outline}
            strokeWidth={1.8}
          />

          {/* Accent Color Band with Gradient */}
          <path
            d={`M 178 304 L 222 304 L 219 314 L 181 314 Z`}
            fill={`url(#accent-grad-${uid})`}
            stroke={accent.outline}
            strokeWidth={1}
          />

          {/* Exhaust Rim Lip */}
          <ellipse cx={200} cy={nozzleBottomY} rx={17} ry={5} fill={metal.dark} stroke={metal.outline} strokeWidth={1.5} />

          {/* Inner Glowing Ion Nozzle */}
          <ellipse cx={200} cy={nozzleBottomY} rx={13} ry={3.5} fill={glow} />
          <ellipse cx={200} cy={nozzleBottomY} rx={6} ry={1.8} fill="#FFFFFF" />

          {/* Clean 2D Stylized Plasma Flame Plume */}
          <polygon
            points={`186,${nozzleBottomY + 1} 214,${nozzleBottomY + 1} 200,${nozzleBottomY + 34}`}
            fill={glow}
            opacity={0.85}
          />
          <polygon
            points={`192,${nozzleBottomY + 1} 208,${nozzleBottomY + 1} 200,${nozzleBottomY + 22}`}
            fill="#FFFFFF"
            opacity={0.9}
          />

          {/* Subtle 2D Hover Energy Pulse Ring */}
          <ellipse
            cx={200}
            cy={nozzleBottomY + 18}
            rx={10}
            ry={3}
            fill="none"
            stroke={glow}
            strokeWidth={1.2}
            strokeDasharray="3 2"
            opacity={0.75}
          />
        </g>
      );
    }

    // B. MECHANICAL STRUTS (Clean 2D Segmented Robotic Limbs)
    if (leg === "mechanical_struts") {
      const renderStrut = (hip: Point2D, knee: Point2D, foot: Point2D, angle: number, isLeft: boolean) => (
        <g key={isLeft ? "strut-l" : "strut-r"}>
          {/* Upper Thigh Strut Line */}
          <line x1={hip.x} y1={hip.y} x2={knee.x} y2={knee.y} stroke={metal.base} strokeWidth={8} strokeLinecap="round" />

          {/* 2D Round Knee Joint Servo */}
          <circle cx={knee.x} cy={knee.y} r={7} fill={metal.dark} stroke={metal.outline} strokeWidth={1.5} />
          <circle cx={knee.x} cy={knee.y} r={4.5} fill={`url(#accent-grad-${uid})`} />

          {/* Lower Shin Hydraulic Ram */}
          <line x1={knee.x} y1={knee.y} x2={foot.x} y2={foot.y} stroke={metal.highlight} strokeWidth={5} strokeLinecap="round" />

          {/* 2D Clean Robot Foot */}
          <g transform={`rotate(${angle} ${foot.x} ${foot.y})`}>
            {/* Main Foot Block with Gradient */}
            <rect
              x={foot.x - 16}
              y={foot.y - 4}
              width={32}
              height={12}
              rx={5}
              fill={`url(#thruster-metal-grad-${uid})`}
              stroke={metal.outline}
              strokeWidth={1.5}
            />

            {/* Glowing Sensor Dot */}
            <circle cx={foot.x + (isLeft ? -8 : 8)} cy={foot.y + 1} r={2.5} fill={glow} />
          </g>
        </g>
      );

      return (
        <g id="robot-legs">
          {renderStrut(lh, lk, lf, rig.leftFootAngle, true)}
          {renderStrut(rh, rk, rf, rig.rightFootAngle, false)}
        </g>
      );
    }

    // C. EXPLORER TREADS (Clean 2D Caterpillar Track Units)
    if (leg === "explorer_treads") {
      const renderTread = (hip: Point2D, foot: Point2D, angle: number, isLeft: boolean) => (
        <g key={isLeft ? "tread-l" : "tread-r"}>
          {/* 2D Swingarm connecting Hip to Tread */}
          <path d={isLeft ? rig.leftLegPath : rig.rightLegPath} fill="none" stroke={shell.base} strokeWidth={10} strokeLinecap="round" />

          {/* 2D Tank Tread Module */}
          <g transform={`rotate(${angle} ${foot.x} ${foot.y})`}>
            {/* Tread Track Outer Body with Track Gradient */}
            <rect
              x={foot.x - 22}
              y={foot.y - 4}
              width={44}
              height={16}
              rx={8}
              fill={`url(#tread-track-grad-${uid})`}
              stroke={metal.outline}
              strokeWidth={1.5}
            />

            {/* Track Grooved Belt Accent */}
            <rect
              x={foot.x - 22}
              y={foot.y - 4}
              width={44}
              height={16}
              rx={8}
              fill="none"
              stroke={metal.dark}
              strokeWidth={1.5}
              strokeDasharray="4 2.5"
            />

            {/* Three Clean 2D Internal Road Wheels */}
            {[-12, 0, 12].map((dx, i) => (
              <g key={`wheel-${i}`}>
                <circle cx={foot.x + dx} cy={foot.y + 4} r={4.5} fill={metal.base} stroke={metal.outline} strokeWidth={1} />
                <circle cx={foot.x + dx} cy={foot.y + 4} r={2} fill={`url(#accent-grad-${uid})`} />
              </g>
            ))}

            {/* Top Mudguard with Accent Gradient */}
            <rect
              x={foot.x - 18}
              y={foot.y - 7}
              width={36}
              height={4}
              rx={2}
              fill={`url(#accent-grad-${uid})`}
              stroke={accent.outline}
              strokeWidth={1}
            />

            {/* Mudguard Status Light */}
            <circle cx={foot.x} cy={foot.y - 5} r={1.5} fill={glow} />
          </g>
        </g>
      );

      return (
        <g id="robot-legs">
          {renderTread(lh, lf, rig.leftFootAngle, true)}
          {renderTread(rh, rf, rig.rightFootAngle, false)}
        </g>
      );
    }

    // D. COMPACT PEGS (Sleek 2D Pylons with Glowing Magnetic Tips)
    if (leg === "compact_pegs") {
      const renderPeg = (hip: Point2D, knee: Point2D, foot: Point2D, angle: number, isLeft: boolean) => (
        <g key={isLeft ? "peg-l" : "peg-r"}>
          {/* Smooth 2D Tapered Leg Path */}
          <path d={isLeft ? rig.leftLegPath : rig.rightLegPath} fill="none" stroke={shell.base} strokeWidth={7} strokeLinecap="round" />

          {/* Neon Energy Core Stripe */}
          <path
            d={isLeft ? rig.leftLegPath : rig.rightLegPath}
            fill="none"
            stroke={glow}
            strokeWidth={2}
            strokeLinecap="round"
          />

          {/* Knee Gyro Ring */}
          <circle cx={knee.x} cy={knee.y} r={5} fill={metal.dark} stroke={metal.outline} strokeWidth={1} />
          <circle cx={knee.x} cy={knee.y} r={2.5} fill={`url(#accent-grad-${uid})`} />

          {/* Glowing Magnetic Contact Tip */}
          <g transform={`rotate(${angle} ${foot.x} ${foot.y})`}>
            {/* Contact Disc with Accent Gradient */}
            <ellipse cx={foot.x} cy={foot.y} rx={12} ry={5} fill={`url(#accent-grad-${uid})`} stroke={accent.outline} strokeWidth={1.5} />

            {/* Glowing Magnetic Core */}
            <circle cx={foot.x} cy={foot.y} r={3.5} fill={glow} />
            <circle cx={foot.x - 1} cy={foot.y - 1} r={1.2} fill="#FFFFFF" />

            {/* 2D Anti-Grav Hover Ring */}
            <ellipse
              cx={foot.x}
              cy={foot.y + 4}
              rx={8}
              ry={2.5}
              fill="none"
              stroke={glow}
              strokeWidth={1.2}
              opacity={0.8}
            />
          </g>
        </g>
      );

      return (
        <g id="robot-legs">
          {renderPeg(lh, lk, lf, rig.leftFootAngle, true)}
          {renderPeg(rh, rk, rf, rig.rightFootAngle, false)}
        </g>
      );
    }

    // E. DEFAULT: SHORT STURDY (Clean 2D Rounded Cyber Boots with Accent Gradients)
    const renderShortSturdy = (hip: Point2D, knee: Point2D, foot: Point2D, angle: number, isLeft: boolean) => (
      <g key={isLeft ? "sturdy-l" : "sturdy-r"}>
        {/* Main 2D Shell Leg */}
        <path
          d={isLeft ? rig.leftLegPath : rig.rightLegPath}
          fill="none"
          stroke={shell.base}
          strokeWidth={12}
          strokeLinecap="round"
        />

        {/* Cute Circular Knee Accent Joint */}
        <circle cx={knee.x} cy={knee.y} r={5} fill={metal.dark} stroke={metal.outline} strokeWidth={1} />
        <circle cx={knee.x} cy={knee.y} r={3} fill={`url(#accent-grad-${uid})`} />

        {/* Chunky 2D Rounded Boot */}
        <g transform={`rotate(${angle} ${foot.x} ${foot.y})`}>
          {/* Main Boot Body with Accent Gradient */}
          <ellipse
            cx={foot.x}
            cy={foot.y}
            rx={18}
            ry={8.5}
            fill={`url(#accent-grad-${uid})`}
            stroke={accent.outline}
            strokeWidth={1.6}
          />

          {/* Front Bumper Cap Accent */}
          <path
            d={`M ${foot.x + (isLeft ? -15 : 5)} ${foot.y - 3} Q ${foot.x + (isLeft ? -18 : 18)} ${foot.y} ${foot.x + (isLeft ? -15 : 5)} ${foot.y + 4}`}
            fill={metal.base}
            stroke={metal.outline}
            strokeWidth={1}
          />

          {/* Luminous Neon Sole Underglow Tread */}
          <ellipse
            cx={foot.x}
            cy={foot.y + 2.5}
            rx={13}
            ry={3}
            fill="none"
            stroke={glow}
            strokeWidth={1.5}
          />
        </g>
      </g>
    );

    return (
      <g id="robot-legs">
        {renderShortSturdy(lh, lk, lf, rig.leftFootAngle, true)}
        {renderShortSturdy(rh, rk, rf, rig.rightFootAngle, false)}
      </g>
    );
  };

  // 8. ACCESSORIES (Crown, Jetpack, Cap, Visor, Drone, etc.)
  const renderAccessories = (layer: "back" | "front") => {
    const acc = norm.accessory;
    if (acc === "none") return null;

    if (layer === "back") {
      if (acc === "jetpack") {
        return (
          <g id="robot-jetpack-back">
            {/* Left Thruster Canister */}
            <rect x={124} y={230} width={22} height={58} rx={10} fill={metal.base} stroke={metal.outline} strokeWidth={2} />
            <ellipse cx={135} cy={288} rx={9} ry={4} fill={rubber.deepShadow} />
            <polygon points="128,290 142,290 135,315" fill={norm.screenGlowColor} opacity={0.8} filter={`url(#screen-glow-${uid})`} />

            {/* Right Thruster Canister */}
            <rect x={254} y={230} width={22} height={58} rx={10} fill={metal.base} stroke={metal.outline} strokeWidth={2} />
            <ellipse cx={265} cy={288} rx={9} ry={4} fill={rubber.deepShadow} />
            <polygon points="258,290 272,290 265,315" fill={norm.screenGlowColor} opacity={0.8} filter={`url(#screen-glow-${uid})`} />
          </g>
        );
      }
      if (acc === "backpack") {
        return (
          <g id="robot-backpack-back">
            <rect x={138} y={226} width={124} height={72} rx={18} fill="#EA580C" stroke="#9A3412" strokeWidth={2.5} />
            <rect x={154} y={240} width={92} height={42} rx={10} fill="#F97316" />
          </g>
        );
      }
      return null;
    }

    // FRONT ACCESSORIES
    if (acc === "crown") {
      const top = rig.antennaSocket;
      return (
        <g id="robot-crown">
          {/* Grandmaster Polished Gold Crown */}
          <polygon
            points={`${top.x - 30},${top.y - 6} ${top.x - 34},${top.y - 28} ${top.x - 16},${top.y - 14} ${top.x},${top.y - 34} ${top.x + 16},${top.y - 14} ${top.x + 34},${top.y - 28} ${top.x + 30},${top.y - 6}`}
            fill="url(#gold-crown-grad)"
            stroke="#B45309"
            strokeWidth={2}
          />
          {/* Ruby / Cyan Inset Jewels */}
          <circle cx={top.x} cy={top.y - 16} r={4.5} fill="#EF4444" stroke="#991B1B" strokeWidth={1} />
          <circle cx={top.x - 18} cy={top.y - 12} r={3} fill="#00E5FF" />
          <circle cx={top.x + 18} cy={top.y - 12} r={3} fill="#00E5FF" />
        </g>
      );
    }

    if (acc === "cap") {
      const top = rig.antennaSocket;
      return (
        <g id="robot-sport-cap">
          <path
            d={`M ${top.x - 52} ${top.y + 12} C ${top.x - 52} ${top.y - 26}, ${top.x + 52} ${top.y - 26}, ${top.x + 52} ${top.y + 12} Z`}
            fill="#EF4444"
            stroke="#B91C1C"
            strokeWidth={2}
          />
          {/* Cap Brim */}
          <path
            d={`M ${top.x - 58} ${top.y + 12} Q ${top.x} ${top.y + 24} ${top.x + 58} ${top.y + 12} L ${top.x + 64} ${top.y + 17} Q ${top.x} ${top.y + 30} ${top.x - 64} ${top.y + 17} Z`}
            fill="#DC2626"
            stroke="#991B1B"
            strokeWidth={1.5}
          />
          <circle cx={top.x} cy={top.y - 26} r={4} fill="#B91C1C" />
        </g>
      );
    }

    if (acc === "visor") {
      return (
        <g id="robot-cyber-visor">
          <path
            d="M 124 135 L 276 135 L 268 155 L 132 155 Z"
            fill={norm.screenGlowColor}
            opacity={0.7}
            stroke="#FFFFFF"
            strokeWidth={1.5}
            filter={`url(#screen-glow-${uid})`}
          />
        </g>
      );
    }

    if (acc === "scarf") {
      return (
        <g id="robot-scarf">
          <path
            d="M 152 204 Q 200 220 248 204 Q 256 218 242 228 Q 200 236 158 228 Z"
            fill="#EF4444"
            stroke="#B91C1C"
            strokeWidth={2}
          />
          {/* Hanging Scarf Tail */}
          <path
            d="M 226 218 L 244 268 L 222 272 L 214 224 Z"
            fill="#DC2626"
            stroke="#991B1B"
            strokeWidth={1.5}
          />
        </g>
      );
    }

    if (acc === "floating_companion" || acc === "mini_drone") {
      return (
        <g id="robot-mini-drone" className="animate-bounce">
          {/* Floating mini orb companion */}
          <circle cx={310} cy={110} r={16} fill={`url(#head-shell-grad-${uid})`} stroke={shell.outline} strokeWidth={2} />
          <circle cx={310} cy={110} r={9} fill="#0A0F1E" />
          <circle cx={310} cy={110} r={5} fill={norm.screenGlowColor} filter={`url(#screen-glow-${uid})`} />
          <ellipse cx={310} cy={132} rx={10} ry={3} fill="#000000" opacity={0.3} />
        </g>
      );
    }

    if (acc === "celebration_sparks") {
      return (
        <g id="robot-celebration-sparks">
          {[
            { cx: 120, cy: 90, r: 4, fill: "#FBBF24" },
            { cx: 280, cy: 80, r: 5, fill: "#EC4899" },
            { cx: 90, cy: 170, r: 3.5, fill: "#00E5FF" },
            { cx: 310, cy: 190, r: 4.5, fill: "#10B981" },
            { cx: 200, cy: 50, r: 6, fill: "#A855F7" }
          ].map((sp, i) => (
            <circle
              key={`spark-${i}`}
              cx={sp.cx}
              cy={sp.cy}
              r={sp.r}
              fill={sp.fill}
              filter={`url(#screen-glow-${uid})`}
            />
          ))}
        </g>
      );
    }

    return null;
  };

  // 9. EXCLUSIVE FULL BUNDLE HEADWEAR, MASKS, EYE OPTICS & LIMB PROPS
  const renderBundleFrontHeadAndProps = () => {
    const skin = norm.skinOutfit || norm.activeBundle;
    if (!skin || skin === "none") return null;
    const top = rig.antennaSocket;
    const lh = rig.leftHandAnchor;
    const tc = rig.torsoCenter;
    const ls = rig.leftShoulderSocket;
    const rs = rig.rightShoulderSocket;

    // 0a. AIDEN MASCOT (Sporty Boyish Blue & Red Vanguard)
    if (skin === "aiden_mascot") {
      return (
        <g id="bundle-front-aiden">
          {/* Dual Crimson Racing Stripes on Torso */}
          <path d={`M ${tc.x - 18} ${tc.y - 30} L ${tc.x - 22} ${tc.y + 40}`} stroke="#EF4444" strokeWidth={3} strokeLinecap="round" />
          <path d={`M ${tc.x + 18} ${tc.y - 30} L ${tc.x + 22} ${tc.y + 40}`} stroke="#EF4444" strokeWidth={3} strokeLinecap="round" />
          {/* Athletic White Pinstripes */}
          <path d={`M ${tc.x - 24} ${tc.y - 25} L ${tc.x - 28} ${tc.y + 35}`} stroke="#FFFFFF" strokeWidth={1.5} opacity={0.8} />
          <path d={`M ${tc.x + 24} ${tc.y - 25} L ${tc.x + 28} ${tc.y + 35}`} stroke="#FFFFFF" strokeWidth={1.5} opacity={0.8} />
          {/* Forehead Boyish Speed Notch Crest */}
          <polygon points={`${top.x},${top.y + 6} ${top.x + 10},${top.y + 16} ${top.x - 10},${top.y + 16}`} fill="#EF4444" />
          <polygon points={`${top.x},${top.y + 8} ${top.x + 6},${top.y + 14} ${top.x - 6},${top.y + 14}`} fill="#00E5FF" filter={`url(#screen-glow-${uid})`} />
        </g>
      );
    }

    // 0b. LUMI MASCOT (Girlish Rose & Violet Creative Muse)
    if (skin === "lumi_mascot") {
      return (
        <g id="bundle-front-lumi">
          {/* Delicate Rose Gold Cyber Necklace / Choker Ring */}
          <ellipse cx={tc.x} cy={tc.y - 36} rx={22} ry={6} fill="none" stroke="#F472B6" strokeWidth={2} />
          <circle cx={tc.x} cy={tc.y - 30} r={3.5} fill="#FF2A8D" filter={`url(#screen-glow-${uid})`} />
          <circle cx={tc.x} cy={tc.y - 30} r={1.5} fill="#FFFFFF" />
          
          {/* Chic Pearlescent Rose Trim Curves on Torso */}
          <path d={`M ${tc.x - 26} ${tc.y - 10} Q ${tc.x} ${tc.y + 15} ${tc.x + 26} ${tc.y - 10}`} fill="none" stroke="#F472B6" strokeWidth={1.8} opacity={0.85} />
          <path d={`M ${tc.x - 20} ${tc.y + 15} Q ${tc.x} ${tc.y + 35} ${tc.x + 20} ${tc.y + 15}`} fill="none" stroke="#FF2A8D" strokeWidth={1.5} opacity={0.7} />
          
          {/* Forehead Delicate Starlight Diadem */}
          <polygon points={`${top.x},${top.y + 4} ${top.x + 6},${top.y + 12} ${top.x},${top.y + 20} ${top.x - 6},${top.y + 12}`} fill="#FF2A8D" filter={`url(#screen-glow-${uid})`} />
          <circle cx={top.x} cy={top.y + 12} r={2} fill="#FFFFFF" />
        </g>
      );
    }

    // 0c. VEX MASCOT (Apex Demonic Horns, Spiked Pauldrons & Magma Fissures)
    if (skin === "vex_mascot") {
      return (
        <g id="bundle-front-vex">
          {/* Menacing Dual Demonic Obsidian Horns flaring from Crown */}
          {/* Left Horn */}
          <path
            d={`M ${top.x - 18} ${top.y + 12} Q ${top.x - 38} ${top.y - 12} ${top.x - 52} ${top.y - 44} Q ${top.x - 32} ${top.y - 20} ${top.x - 6} ${top.y + 8} Z`}
            fill="#08080A"
            stroke="#EF4444"
            strokeWidth={2}
          />
          {/* Left Horn Glowing Magma Channel */}
          <path
            d={`M ${top.x - 16} ${top.y + 8} Q ${top.x - 32} ${top.y - 14} ${top.x - 46} ${top.y - 40}`}
            fill="none"
            stroke="#FF0033"
            strokeWidth={2}
            filter={`url(#screen-glow-${uid})`}
          />

          {/* Right Horn */}
          <path
            d={`M ${top.x + 18} ${top.y + 12} Q ${top.x + 38} ${top.y - 12} ${top.x + 52} ${top.y - 44} Q ${top.x + 32} ${top.y - 20} ${top.x + 6} ${top.y + 8} Z`}
            fill="#08080A"
            stroke="#EF4444"
            strokeWidth={2}
          />
          {/* Right Horn Glowing Magma Channel */}
          <path
            d={`M ${top.x + 16} ${top.y + 8} Q ${top.x + 32} ${top.y - 14} ${top.x + 46} ${top.y - 40}`}
            fill="none"
            stroke="#FF0033"
            strokeWidth={2}
            filter={`url(#screen-glow-${uid})`}
          />

          {/* Forehead Demonic Inverted Crown Crest */}
          <polygon
            points={`${top.x - 14},${top.y + 12} ${top.x + 14},${top.y + 12} ${top.x},${top.y + 26}`}
            fill="#08080A"
            stroke="#EF4444"
            strokeWidth={1.8}
          />
          <polygon
            points={`${top.x - 8},${top.y + 14} ${top.x + 8},${top.y + 14} ${top.x},${top.y + 22}`}
            fill="#FF0033"
            filter={`url(#screen-glow-${uid})`}
          />

          {/* Spiked Armored Obsidian Shoulder Pauldrons */}
          <g>
            {/* Left Spiked Pauldron */}
            <polygon
              points={`${ls.x - 20},${ls.y - 14} ${ls.x + 8},${ls.y - 14} ${ls.x + 14},${ls.y + 12} ${ls.x - 14},${ls.y + 12} ${ls.x - 28},${ls.y}`}
              fill="#08080A"
              stroke="#EF4444"
              strokeWidth={1.8}
            />
            <polygon
              points={`${ls.x - 26},${ls.y - 1} ${ls.x - 18},${ls.y - 8} ${ls.x - 14},${ls.y}`}
              fill="#FF0033"
              filter={`url(#screen-glow-${uid})`}
            />

            {/* Right Spiked Pauldron */}
            <polygon
              points={`${rs.x + 20},${rs.y - 14} ${rs.x - 8},${rs.y - 14} ${rs.x - 14},${rs.y + 12} ${rs.x + 14},${rs.y + 12} ${rs.x + 28},${rs.y}`}
              fill="#08080A"
              stroke="#EF4444"
              strokeWidth={1.8}
            />
            <polygon
              points={`${rs.x + 26},${rs.y - 1} ${rs.x + 18},${rs.y - 8} ${rs.x + 14},${rs.y}`}
              fill="#FF0033"
              filter={`url(#screen-glow-${uid})`}
            />
          </g>

          {/* Glowing Red Magma Fissures across Obsidian Torso Plating */}
          <path
            d={`M ${tc.x - 28} ${tc.y - 20} L ${tc.x - 16} ${tc.y + 6} L ${tc.x - 8} ${tc.y + 24} L ${tc.x} ${tc.y + 36}`}
            fill="none"
            stroke="#EF4444"
            strokeWidth={2.2}
            filter={`url(#screen-glow-${uid})`}
          />
          <path
            d={`M ${tc.x + 28} ${tc.y - 20} L ${tc.x + 16} ${tc.y + 6} L ${tc.x + 8} ${tc.y + 24} L ${tc.x} ${tc.y + 36}`}
            fill="none"
            stroke="#EF4444"
            strokeWidth={2.2}
            filter={`url(#screen-glow-${uid})`}
          />
          <line x1={tc.x - 18} y1={tc.y + 16} x2={tc.x + 18} y2={tc.y + 16} stroke="#FF0033" strokeWidth={1.8} filter={`url(#screen-glow-${uid})`} />
        </g>
      );
    }

    // 1. MILITARY COMMANDER: Exclusive Kevlar Helmet & Monocular Night-Vision Optic + Comms Boom
    if (skin === "military") {
      return (
        <g id="bundle-front-military">
          {/* Exclusive Military Kevlar Helmet Shell */}
          <path
            d={`M ${top.x - 56} ${top.y + 16} C ${top.x - 58} ${top.y - 32}, ${top.x + 58} ${top.y - 32}, ${top.x + 56} ${top.y + 16} Z`}
            fill="#3F4F38"
            stroke="#1C1917"
            strokeWidth={3}
          />
          {/* Helmet Front Brow Rim & NVG Mount Plate */}
          <path
            d={`M ${top.x - 56} ${top.y + 16} Q ${top.x} ${top.y + 26} ${top.x + 56} ${top.y + 16} L ${top.x + 54} ${top.y + 22} Q ${top.x} ${top.y + 32} ${top.x - 54} ${top.y + 22} Z`}
            fill="#273424"
            stroke="#1C1917"
            strokeWidth={1.5}
          />
          {/* Night Vision Goggle (NVG) Mount */}
          <rect x={top.x - 14} y={top.y - 4} width={28} height={18} rx={3} fill="#1C1917" stroke="#78716C" strokeWidth={1} />
          {/* Flip-down Monocular Optic over Right Eye */}
          <rect x={top.x + 10} y={top.y + 16} width={24} height={20} rx={4} fill="#1C1917" stroke="#EF4444" strokeWidth={1.5} />
          <circle cx={top.x + 22} cy={top.y + 26} r={7} fill="#EF4444" filter={`url(#screen-glow-${uid})`} />
          <circle cx={top.x + 22} cy={top.y + 26} r={3} fill="#FFFFFF" />
          {/* Comms Boom Microphone */}
          <path d={`M ${top.x - 48} ${top.y + 32} Q ${top.x - 30} ${top.y + 70} ${top.x - 6} ${top.y + 64}`} fill="none" stroke="#1C1917" strokeWidth={3} strokeLinecap="round" />
          <circle cx={top.x - 4} cy={top.y + 64} r={4.5} fill="#78716C" stroke="#1C1917" strokeWidth={1} />
        </g>
      );
    }

    // 2. SNOW COMMANDER: Sub-Zero Arctic Helmet, Polarized Snow Goggles & Frost Icicles
    if (skin === "snow_military") {
      return (
        <g id="bundle-front-snow-military">
          {/* Arctic Insulated Helmet Brow */}
          <path
            d={`M ${top.x - 56} ${top.y + 14} C ${top.x - 58} ${top.y - 30}, ${top.x + 58} ${top.y - 30}, ${top.x + 56} ${top.y + 14} Z`}
            fill="#F1F5F9"
            stroke="#94A3B8"
            strokeWidth={3}
          />
          {/* Polarized Snow Goggles Strap & Frame */}
          <rect x={top.x - 52} y={top.y + 8} width={104} height={24} rx={10} fill="#1E293B" stroke="#38BDF8" strokeWidth={2} />
          {/* Twin Glacial Polarized Cyan Lenses */}
          <rect x={top.x - 44} y={top.y + 12} width={38} height={16} rx={6} fill="#00E5FF" filter={`url(#screen-glow-${uid})`} opacity={0.9} />
          <rect x={top.x + 6} y={top.y + 12} width={38} height={16} rx={6} fill="#00E5FF" filter={`url(#screen-glow-${uid})`} opacity={0.9} />
          {/* Lens Specular Reflection */}
          <line x1={top.x - 38} y1={top.y + 15} x2={top.x - 18} y2={top.y + 25} stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
          <line x1={top.x + 12} y1={top.y + 15} x2={top.x + 32} y2={top.y + 25} stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
        </g>
      );
    }

    // 3. CYBER KING: Enormous Futuristic Geometric Cyber Crown
    if (skin === "cyber_king") {
      return (
        <g id="bundle-front-cyber-king">
          {/* Futuristic Multi-tier Cyber Crown */}
          <polygon
            points={`${top.x - 46},${top.y + 4} ${top.x - 52},${top.y - 36} ${top.x - 24},${top.y - 16} ${top.x},${top.y - 48} ${top.x + 24},${top.y - 16} ${top.x + 52},${top.y - 36} ${top.x + 46},${top.y + 4}`}
            fill="#F59E0B"
            stroke="#B45309"
            strokeWidth={2.5}
          />
          {/* Glowing Geometric Royal Jewel Cells */}
          <polygon points={`${top.x},${top.y - 34} ${top.x + 8},${top.y - 22} ${top.x},${top.y - 10} ${top.x - 8},${top.y - 22}`} fill="#00E5FF" filter={`url(#screen-glow-${uid})`} />
          <circle cx={top.x - 36} cy={top.y - 20} r={4.5} fill="#EF4444" filter={`url(#screen-glow-${uid})`} />
          <circle cx={top.x + 36} cy={top.y - 20} r={4.5} fill="#EF4444" filter={`url(#screen-glow-${uid})`} />
          <rect x={top.x - 42} y={top.y} width={84} height={8} rx={2} fill="#1E1B4B" stroke="#F59E0B" strokeWidth={1} />
        </g>
      );
    }

    // 4. TERMINATOR: Battle-Damaged Exposed Metal Faceplate & Crimson Target Monocle
    if (skin === "terminator") {
      return (
        <g id="bundle-front-terminator">
          {/* Right-Side Battle-Damaged Fractured Plating */}
          <path
            d="M 200 115 L 255 118 L 260 175 L 205 178 Z"
            fill="#334155"
            stroke="#94A3B8"
            strokeWidth={1.5}
            opacity={0.8}
          />
          {/* Exposed Chrome Endoskeleton Face Section */}
          <circle cx={228} cy={145} r={18} fill="#0F172A" stroke="#DC2626" strokeWidth={2} />
          {/* Crimson Target Scanner Optic */}
          <circle cx={228} cy={145} r={10} fill="#DC2626" filter={`url(#screen-glow-${uid})`} />
          <circle cx={228} cy={145} r={4} fill="#FFFFFF" />
          {/* Target HUD Reticle Lines */}
          <line x1={212} y1={145} x2={244} y2={145} stroke="#FFFFFF" strokeWidth={1.5} />
          <line x1={228} y1={129} x2={228} y2={161} stroke="#FFFFFF" strokeWidth={1.5} />
        </g>
      );
    }

    // 5. FOOTBALL CHAMPION: High-Velocity Sports Headband & Visor
    if (skin === "football") {
      return (
        <g id="bundle-front-football">
          {/* Athletic Captain Headband */}
          <path
            d={`M ${top.x - 54} ${top.y + 12} Q ${top.x} ${top.y + 24} ${top.x + 54} ${top.y + 12} L ${top.x + 52} ${top.y + 22} Q ${top.x} ${top.y + 34} ${top.x - 52} ${top.y + 22} Z`}
            fill="#0284C7"
            stroke="#0369A1"
            strokeWidth={1.5}
          />
          {/* Gold Captain 'C' Insignia */}
          <rect x={top.x - 8} y={top.y + 14} width={16} height={12} rx={2} fill="#FACC15" stroke="#CA8A04" strokeWidth={1} />
          <text x={top.x} y={top.y + 23} fontSize="9" fontWeight="900" fill="#0F172A" textAnchor="middle" fontFamily="sans-serif">C</text>
        </g>
      );
    }

    // 6. CYBER NINJA: Armored Shinobi Stealth Face Mask & Clan Plate
    if (skin === "cyber_ninja") {
      return (
        <g id="bundle-front-cyber-ninja">
          {/* Forehead Shinobi Clan Plate */}
          <rect x={top.x - 30} y={top.y + 8} width={60} height={14} rx={3} fill="#27272A" stroke="#10B981" strokeWidth={1.5} />
          <circle cx={top.x} cy={top.y + 15} r={3} fill="#10B981" filter={`url(#screen-glow-${uid})`} />
          {/* Armored Lower Stealth Face Mask with Slit Respirators */}
          <polygon
            points={`${top.x - 42},${top.y + 44} ${top.x + 42},${top.y + 44} ${top.x + 28},${top.y + 82} ${top.x - 28},${top.y + 82}`}
            fill="#09090B"
            stroke="#10B981"
            strokeWidth={2}
          />
          {/* Neon Emerald Breath Slits */}
          <line x1={top.x - 18} y1={top.y + 56} x2={top.x + 18} y2={top.y + 56} stroke="#10B981" strokeWidth={2} filter={`url(#screen-glow-${uid})`} />
          <line x1={top.x - 14} y1={top.y + 64} x2={top.x + 14} y2={top.y + 64} stroke="#10B981" strokeWidth={2} filter={`url(#screen-glow-${uid})`} />
          <line x1={top.x - 8} y1={top.y + 72} x2={top.x + 8} y2={top.y + 72} stroke="#10B981" strokeWidth={2} filter={`url(#screen-glow-${uid})`} />
        </g>
      );
    }

    // 7. SPACE COMMANDER: Gold-Mirrored Polarized Dome Visor & Oxygen Feed Hose Loop
    if (skin === "space_explorer" || skin === "astronaut_suit") {
      return (
        <g id="bundle-front-space-commander">
          {/* Gold Polarized Mirror Reflection over Face Screen */}
          <path
            d="M 152 135 Q 200 115 248 135 Q 260 165 248 185 Q 200 200 152 185 Q 140 165 152 135 Z"
            fill="#F59E0B"
            opacity={0.35}
            stroke="#FDE047"
            strokeWidth={1.5}
            filter={`url(#screen-glow-${uid})`}
          />
          {/* Mirrored Specular Glint */}
          <path d="M 165 140 Q 195 130 225 142" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.8} />
          {/* Oxygen Hose entering Helmet Collar */}
          <path d="M 148 200 C 135 220 135 240 155 250" fill="none" stroke="#94A3B8" strokeWidth={4} strokeLinecap="round" />
        </g>
      );
    }

    // 8. MECHA PIRATE: Captain's Bicorne Hat, Cyber Eyepatch & Robotic Laser Hook
    if (skin === "pirate") {
      return (
        <g id="bundle-front-pirate">
          {/* Captain's Grand Bicorne Hat */}
          <path
            d={`M ${top.x - 65} ${top.y + 12} Q ${top.x} ${top.y - 45} ${top.x + 65} ${top.y + 12} L ${top.x + 50} ${top.y + 18} Q ${top.x} ${top.y - 15} ${top.x - 50} ${top.y + 18} Z`}
            fill="#1E1B4B"
            stroke="#D97706"
            strokeWidth={2.5}
          />
          {/* Gold Feather & Skull Emblem on Hat */}
          <circle cx={top.x} cy={top.y - 8} r={7} fill="#FDE68A" stroke="#78350F" strokeWidth={1} />
          <path d={`M ${top.x - 2} ${top.y - 22} Q ${top.x + 18} ${top.y - 40} ${top.x + 35} ${top.y - 36}`} fill="none" stroke="#EF4444" strokeWidth={3} strokeLinecap="round" />

          {/* Cybernetic Eye Patch with Crosshair Scanner */}
          <line x1={top.x - 42} y1={top.y + 15} x2={top.x} y2={top.y + 60} stroke="#18181B" strokeWidth={2.5} />
          <rect x={top.x - 28} y={top.y + 30} width={22} height={20} rx={4} fill="#18181B" stroke="#D97706" strokeWidth={2} />
          <circle cx={top.x - 17} cy={top.y + 40} r={5} fill="#10B981" filter={`url(#screen-glow-${uid})`} />

          {/* Robotic Gold/Chrome Laser Hook Hand (Replaces Left Hand) */}
          <g transform={`translate(${lh.x - 12}, ${lh.y - 12})`}>
            {/* Hook Base Socket */}
            <circle cx={12} cy={12} r={10} fill="#D97706" stroke="#78350F" strokeWidth={2} />
            {/* Curving Robotic Razor Hook */}
            <path
              d="M 12 18 C 12 36 -6 32 -6 18 C -6 8 4 6 10 10"
              fill="none"
              stroke="#FDE68A"
              strokeWidth={5}
              strokeLinecap="round"
            />
            <circle cx={-6} cy={18} r={3} fill="#EF4444" filter={`url(#screen-glow-${uid})`} />
          </g>
        </g>
      );
    }

    // 9. ARCANE MACHINE: Techno-Mage Hood & Floating Mystic Eye Sigil
    if (skin === "arcane_machine" || skin === "tech_mage") {
      return (
        <g id="bundle-front-arcane-machine">
          {/* Techno-Mage Hood Shroud */}
          <path
            d={`M ${top.x - 58} ${top.y + 18} C ${top.x - 55} ${top.y - 34}, ${top.x + 55} ${top.y - 34}, ${top.x + 58} ${top.y + 18} L ${top.x + 50} ${top.y + 44} Q ${top.x} ${top.y + 20} ${top.x - 50} ${top.y + 44} Z`}
            fill="#2E1065"
            stroke="#A855F7"
            strokeWidth={2.5}
          />
          {/* Gold Filigree Embroidery on Hood Lip */}
          <path d={`M ${top.x - 50} ${top.y + 42} Q ${top.x} ${top.y + 18} ${top.x + 50} ${top.y + 42}`} fill="none" stroke="#FBBF24" strokeWidth={2} />
          {/* Floating Glowing All-Seeing Mystic Eye Sigil */}
          <g transform={`translate(${top.x}, ${top.y - 12})`}>
            <polygon points="0,-12 14,0 0,12 -14,0" fill="none" stroke="#C084FC" strokeWidth={1.5} filter={`url(#screen-glow-${uid})`} />
            <circle cx={0} cy={0} r={4} fill="#FBBF24" filter={`url(#screen-glow-${uid})`} />
          </g>
        </g>
      );
    }

    // 10. F1 MACHINE: Aero Helmet Visor Stripe & Tear-Offs
    if (skin === "racing" || skin === "formula_racer") {
      return (
        <g id="bundle-front-racing">
          {/* Aerodynamic Speed Visor Stripe with Sponsor */}
          <path
            d={`M ${top.x - 52} ${top.y + 14} Q ${top.x} ${top.y + 26} ${top.x + 52} ${top.y + 14} L ${top.x + 50} ${top.y + 24} Q ${top.x} ${top.y + 36} ${top.x - 50} ${top.y + 24} Z`}
            fill="#1E293B"
            stroke="#3B82F6"
            strokeWidth={1.5}
          />
          <line x1={top.x - 30} y1={top.y + 22} x2={top.x + 30} y2={top.y + 22} stroke="#EF4444" strokeWidth={2.5} />
        </g>
      );
    }

    return null;
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: size,
        height: size,
        perspective: 900,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="w-full h-full flex items-center justify-center"
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          scale: isHovered ? 1.03 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 24,
          mass: 0.5,
        }}
      >
        <svg
          viewBox={faceZoom ? "70 45 260 260" : "0 0 400 400"}
          width={size}
          height={size}
          className="w-full h-full overflow-visible transition-all duration-300"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ==================================================== */}
          {/* 3D VOLUMETRIC SHADER DEFINITIONS & LIGHTING RIG     */}
          {/* ==================================================== */}
          <defs>
            {/* 3D Directional Keylight & Curvature Ambient Shell Gradient */}
            <linearGradient id={`head-shell-grad-${uid}`} x1="0.12" y1="0.08" x2="0.88" y2="0.95">
              <stop offset="0%" stopColor={shell.specular} />
              <stop offset="16%" stopColor={shell.highlight} />
              <stop offset="38%" stopColor={shell.keyLight} />
              <stop offset="65%" stopColor={shell.base} />
              <stop offset="88%" stopColor={shell.shadow} />
              <stop offset="100%" stopColor={shell.deepShadow} />
            </linearGradient>

            {/* 3D Torso Cylindrical Directional Keylight Gradient */}
            <linearGradient id={`torso-shell-grad-${uid}`} x1="0.14" y1="0.1" x2="0.86" y2="0.95">
              <stop offset="0%" stopColor={shell.specular} />
              <stop offset="20%" stopColor={shell.highlight} />
              <stop offset="52%" stopColor={shell.base} />
              <stop offset="85%" stopColor={shell.shadow} />
              <stop offset="100%" stopColor={shell.deepShadow} />
            </linearGradient>

            {/* 3D Accent Material Gradient with Specular Glint */}
            <linearGradient id={`accent-grad-${uid}`} x1="0.1" y1="0.08" x2="0.88" y2="0.92">
              <stop offset="0%" stopColor={accent.specular} />
              <stop offset="22%" stopColor={accent.highlight} />
              <stop offset="58%" stopColor={accent.base} />
              <stop offset="88%" stopColor={accent.shadow} />
              <stop offset="100%" stopColor={accent.deepShadow} />
            </linearGradient>

            {/* Inset 3D Screen Cavity Depth Bevel */}
            <linearGradient id={`screen-cavity-grad-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#030610" />
              <stop offset="60%" stopColor="#091024" />
              <stop offset="100%" stopColor={rubber.base} />
            </linearGradient>

            {/* 3D Obsidian Curved Dark Glass Visor Surface */}
            <linearGradient id={`screen-glass-grad-${uid}`} x1="0.2" y1="0.05" x2="0.8" y2="0.95">
              <stop offset="0%" stopColor="#18233C" />
              <stop offset="32%" stopColor="#0C1324" />
              <stop offset="85%" stopColor="#050812" />
              <stop offset="100%" stopColor="#020408" />
            </linearGradient>

            {/* 3D Crown Gold Metallic Sheen */}
            <linearGradient id="gold-crown-grad" x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="25%" stopColor="#FDE68A" />
              <stop offset="60%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>

            {/* Background Ambient Radial Gradient */}
            <radialGradient id={`bg-radial-${uid}`} cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor={norm.backgroundColor} stopOpacity="1" />
              <stop offset="100%" stopColor="#050814" stopOpacity="1" />
            </radialGradient>

            {/* 3D Anisotropic Thruster Metal Chrome */}
            <linearGradient id={`thruster-metal-grad-${uid}`} x1="0.05" y1="0.1" x2="0.95" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="20%" stopColor={metal.highlight} />
              <stop offset="50%" stopColor={metal.base} />
              <stop offset="80%" stopColor={metal.shadow} />
              <stop offset="100%" stopColor={metal.deepShadow} />
            </linearGradient>

            {/* 3D Specular Chrome Hydraulic Piston */}
            <linearGradient id={`hydraulic-piston-grad-${uid}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="30%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* 3D Tread Frame Track Gradient */}
            <linearGradient id={`tread-track-grad-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            {/* 3D Soft Ambient Occlusion Floor Contact Shadow */}
            <radialGradient id={`ground-shadow-${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
              <stop offset="45%" stopColor="#000000" stopOpacity="0.25" />
              <stop offset="80%" stopColor="#000000" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* 3D LED Phosphor Glow Emission */}
            <filter id={`screen-glow-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.2" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ==================================================== */}
          {/* 1. LAYER: Optional Background Backdrop Canvas        */}
          {/* ==================================================== */}
          {showBackground && (
            <g id="avatar-backdrop">
              <rect
                width="400"
                height="400"
                rx="48"
                fill={`url(#bg-radial-${uid})`}
              />
              {/* Subtle Vignette & Frame */}
              <rect
                width="400"
                height="400"
                rx="48"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeOpacity="0.15"
              />
            </g>
          )}

          {/* ==================================================== */}
          {/* 2. LAYER: Ground Contact Shadow in 3D Perspective    */}
          {/* ==================================================== */}
          {showBackground && (
            <g id="avatar-ground-shadow">
              <ellipse
                cx={200}
                cy={372}
                rx={66}
                ry={13}
                fill={`url(#ground-shadow-${uid})`}
              />
            </g>
          )}

          {/* ==================================================== */}
          {/* 3. LAYER: Animated Robot Rig Hierarchy               */}
          {/* ==================================================== */}
          {animate ? (
            <motion.g
              animate={activeMood}
              variants={robotVariants as any}
              initial="idle"
            >
              {/* Exclusive Full Bundle Back Layer FX (Cloaks, Wings, Katanas, Jetpacks) */}
              {renderBundleBackFX()}

              {/* Back Accessories (Jetpack / Backpack) */}
              {renderAccessories("back")}

              {/* Mobility (Legs / Thrusters) */}
              {renderLegsAndFeet()}

              {/* Torso / Body Chassis */}
              <g id="robot-torso">
                {/* Torso Base Solid Path with 3D Volumetric Directional Gradient */}
                <path
                  d={rig.torsoPath}
                  fill={`url(#torso-shell-grad-${uid})`}
                  stroke={shell.outline}
                  strokeWidth={2.5}
                />
                {/* 3D Lower-Right Form Shadow */}
                <path
                  d={rig.torsoShadowPath}
                  fill={shell.deepShadow}
                  opacity={0.38}
                />
                {/* 3D Upper-Left Directional Specular Crest */}
                <path
                  d={rig.torsoHighlightPath}
                  fill={shell.highlight}
                  opacity={0.55}
                />
                {/* 3D Subtle Upper-Right Back Rim Light */}
                <path
                  d={rig.torsoRimPath}
                  stroke={shell.rimLight}
                  strokeWidth={2}
                  strokeLinecap="round"
                  fill="none"
                  opacity={0.65}
                />
              </g>

              {/* Chest Core / Display */}
              {renderChestCore()}

              {/* 1-Piece Skin Outfit Layer */}
              {renderSkinOutfit()}

              {/* Neck Bushing & Mechanical Sockets */}
              <g id="robot-neck">
                <path d={rig.neckPath} fill={metal.shadow} stroke={metal.outline} strokeWidth={1.5} />
                {/* Head Contact Shadow onto Neck */}
                <path d={rig.neckShadowPath} fill="#000000" opacity={0.45} />
              </g>

              {/* Side Ear Modules & Headphones */}
              {renderEarModules()}

              {/* Head Shell Structure */}
              <g id="robot-head">
                {/* Main Molded Shell with 3D Keylight Illumination */}
                <path
                  d={rig.headPath}
                  fill={`url(#head-shell-grad-${uid})`}
                  stroke={shell.outline}
                  strokeWidth={3}
                />
                {/* 3D Lower-Right Form Shadow */}
                <path
                  d={rig.headShadowPath}
                  fill={shell.deepShadow}
                  opacity={0.4}
                />
                {/* 3D Upper-Left Directional Highlight Crest */}
                <path
                  d={rig.headHighlightPath}
                  fill={shell.highlight}
                  opacity={0.6}
                />
                {/* 3D Back Rim Light */}
                <path
                  d={rig.headRimPath}
                  stroke={shell.rimLight}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  fill="none"
                  opacity={0.7}
                />
              </g>

              {/* Antenna System */}
              {renderAntenna()}

              {/* INSET DISPLAY SCREEN CAVITY (Recessed Glass Architecture) */}
              <g id="robot-screen-assembly">
                {/* 1. Recessed Cavity Bevel */}
                <path
                  d={rig.screenCavityPath}
                  fill={`url(#screen-cavity-grad-${uid})`}
                />
                {/* 2. Bezel Border Frame */}
                <path
                  d={rig.screenBezelPath}
                  fill={rubber.deepShadow}
                  stroke={rubber.outline}
                  strokeWidth={1.5}
                />
                {/* 3. Obsidian Dark Glass Display */}
                <path
                  d={rig.screenGlassPath}
                  fill={`url(#screen-glass-grad-${uid})`}
                />

                {/* 4. Screen Digital Face Emission */}
                {renderScreenEyes()}
                {renderScreenMouth()}

                {/* 5. Curved Physical Glass 3D Gloss Reflection */}
                <path
                  d={rig.screenGlossPath}
                  fill="#FFFFFF"
                  opacity={0.18}
                />
              </g>

              {/* Limbs: Arms & Hands */}
              {renderArmsAndHands()}

              {/* Front Accessories (Crown, Cap, Visor, Scarf, Drone) */}
              {renderAccessories("front")}

              {/* Exclusive Full Bundle Headwear, Monoculars, Masks & Exclusive Props */}
              {renderBundleFrontHeadAndProps()}
            </motion.g>
          ) : (
            <g>
              {/* Exclusive Full Bundle Back Layer FX */}
              {renderBundleBackFX()}
              {renderAccessories("back")}
              {renderLegsAndFeet()}
              <g id="robot-torso">
                <path d={rig.torsoPath} fill={`url(#torso-shell-grad-${uid})`} stroke={shell.outline} strokeWidth={2.5} />
                <path d={rig.torsoShadowPath} fill={shell.deepShadow} opacity={0.38} />
                <path d={rig.torsoHighlightPath} fill={shell.highlight} opacity={0.55} />
                <path d={rig.torsoRimPath} stroke={shell.rimLight} strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.65} />
              </g>
              {renderChestCore()}
              {renderSkinOutfit()}
              <g id="robot-neck">
                <path d={rig.neckPath} fill={metal.shadow} stroke={metal.outline} strokeWidth={1.5} />
                <path d={rig.neckShadowPath} fill="#000000" opacity={0.45} />
              </g>
              {renderEarModules()}
              <g id="robot-head">
                <path d={rig.headPath} fill={`url(#head-shell-grad-${uid})`} stroke={shell.outline} strokeWidth={3} />
                <path d={rig.headShadowPath} fill={shell.deepShadow} opacity={0.4} />
                <path d={rig.headHighlightPath} fill={shell.highlight} opacity={0.6} />
                <path d={rig.headRimPath} stroke={shell.rimLight} strokeWidth={2.5} strokeLinecap="round" fill="none" opacity={0.7} />
              </g>
              {renderAntenna()}
              <g id="robot-screen-assembly">
                <path d={rig.screenCavityPath} fill={`url(#screen-cavity-grad-${uid})`} />
                <path d={rig.screenBezelPath} fill={rubber.deepShadow} stroke={rubber.outline} strokeWidth={1.5} />
                <path d={rig.screenGlassPath} fill={`url(#screen-glass-grad-${uid})`} />
                {renderScreenEyes()}
                {renderScreenMouth()}
                <path d={rig.screenGlossPath} fill="#FFFFFF" opacity={0.18} />
              </g>
              {renderArmsAndHands()}
              {renderAccessories("front")}
              {renderBundleFrontHeadAndProps()}
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
};

export default AIfluenceAvatar;
