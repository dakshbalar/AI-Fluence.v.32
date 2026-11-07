import React from "react";
import { motion } from "motion/react";
import { CharacterMood } from "../../../types/avatar";

interface AidenMascotSVGProps {
  size?: number;
  mood?: CharacterMood;
  className?: string;
  animate?: boolean;
  faceZoom?: boolean;
}

export const AidenMascotSVG: React.FC<AidenMascotSVGProps> = ({
  size = 340,
  mood = "wave",
  className = "",
  animate = true,
  faceZoom = false,
}) => {
  const isWaving = mood === "wave" || mood === "happy" || mood === "idle";

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={faceZoom ? "100 70 200 200" : "0 0 400 480"}
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="aiden-head-grad" x1="140" y1="110" x2="260" y2="230" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2c3e75" />
            <stop offset="50%" stopColor="#22315c" />
            <stop offset="100%" stopColor="#172242" />
          </linearGradient>

          <linearGradient id="aiden-head-sheen" x1="150" y1="115" x2="250" y2="155" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="aiden-screen-grad" x1="150" y1="130" x2="250" y2="220" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0a0f1d" />
            <stop offset="100%" stopColor="#050811" />
          </linearGradient>

          <linearGradient id="aiden-body-grad" x1="150" y1="240" x2="250" y2="360" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2c3e75" />
            <stop offset="60%" stopColor="#202e57" />
            <stop offset="100%" stopColor="#151e3b" />
          </linearGradient>

          <radialGradient id="aiden-glow-red" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff4d4d" />
            <stop offset="60%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="aiden-glow-cyan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="aiden-portal-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#0f1f45" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Glow Filters */}
          <filter id="aiden-cyan-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="aiden-red-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. GROUND PLATFORM & ORBITING RING */}
        <g id="aiden-pedestal-portal">
          {/* Deep dark portal shadow disc */}
          <ellipse cx="200" cy="425" rx="88" ry="18" fill="#030712" />
          <ellipse cx="200" cy="425" rx="84" ry="16" fill="url(#aiden-portal-glow)" />
          <ellipse cx="200" cy="425" rx="72" ry="12" fill="#050a18" stroke="#00E5FF" strokeWidth="1.5" strokeOpacity="0.5" />

          {/* Glowing cyan dashed orbital ellipse line circling around him */}
          <ellipse
            cx="200"
            cy="375"
            rx="105"
            ry="38"
            fill="none"
            stroke="#00E5FF"
            strokeWidth="1.8"
            strokeDasharray="4 5"
            strokeOpacity="0.75"
            transform="rotate(-14 200 375)"
            filter="url(#aiden-cyan-glow)"
          />
        </g>

        {/* 2. MAIN ROBOT BODY ASSEMBLY */}
        <motion.g
          animate={
            animate
              ? {
                  y: [0, -7, 0],
                }
              : undefined
          }
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
          }}
        >
          {/* --- LEGS & FEET --- */}
          <g id="aiden-legs">
            {/* Left Leg (viewer's left) */}
            <rect x="174" y="340" width="9" height="38" rx="4.5" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
            {/* Right Leg (viewer's right) */}
            <rect x="217" y="340" width="9" height="38" rx="4.5" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />

            {/* Left Boot / Pod Foot */}
            <ellipse cx="178" cy="378" rx="17" ry="10" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
            {/* Top gloss highlight on left foot */}
            <ellipse cx="177" cy="374" rx="11" ry="5" fill="#FFFFFF" fillOpacity="0.55" />

            {/* Right Boot / Pod Foot */}
            <ellipse cx="222" cy="378" rx="17" ry="10" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
            {/* Top gloss highlight on right foot */}
            <ellipse cx="221" cy="374" rx="11" ry="5" fill="#FFFFFF" fillOpacity="0.55" />
          </g>

          {/* --- TORSO & CHEST --- */}
          <g id="aiden-torso">
            {/* Main Blue Body Chassis */}
            <rect
              x="142"
              y="244"
              width="116"
              height="96"
              rx="24"
              fill="url(#aiden-body-grad)"
              stroke="#34467E"
              strokeWidth="2.5"
            />

            {/* Subtle soft edge shadow */}
            <rect
              x="145"
              y="247"
              width="110"
              height="90"
              rx="21"
              fill="none"
              stroke="#131b34"
              strokeWidth="2"
              strokeOpacity="0.6"
            />

            {/* Shoulder Corner Notches: Red with cyan trim */}
            {/* Left Shoulder Notch */}
            <polygon points="144,248 168,248 144,272" fill="#EF4444" />
            <line x1="145" y1="270" x2="166" y2="249" stroke="#00E5FF" strokeWidth="1.5" />

            {/* Right Shoulder Notch */}
            <polygon points="256,248 232,248 256,272" fill="#EF4444" />
            <line x1="255" y1="270" x2="234" y2="249" stroke="#00E5FF" strokeWidth="1.5" />

            {/* Vertical Racing Stripes */}
            {/* Cyan Outer Lines */}
            <line x1="168" y1="265" x2="168" y2="322" stroke="#00E5FF" strokeWidth="1.5" strokeOpacity="0.75" />
            <line x1="232" y1="265" x2="232" y2="322" stroke="#00E5FF" strokeWidth="1.5" strokeOpacity="0.75" />

            {/* Red Inner Racing Lines */}
            <line x1="176" y1="272" x2="176" y2="328" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="224" y1="272" x2="224" y2="328" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />

            {/* Center Chest Emblem: Red Inverted Triangle & Core Reactor */}
            <polygon
              points="182,266 218,266 200,300"
              fill="#10172e"
              stroke="#EF4444"
              strokeWidth="2.5"
            />
            {/* Center Glowing Core Diamond / Circle */}
            <circle cx="200" cy="281" r="7" fill="#EF4444" filter="url(#aiden-red-glow)" />
            <circle cx="200" cy="281" r="3.5" fill="#FFFFFF" />

            {/* Lower Belt Band */}
            <rect x="156" y="332" width="88" height="6" rx="3" fill="#EF4444" />
          </g>

          {/* --- ARMS & HANDS --- */}
          {/* Left Arm (viewer's left: relaxed / posed) */}
          <g id="aiden-arm-left">
            {/* Shoulder Joint */}
            <circle cx="138" cy="256" r="8" fill="#EF4444" stroke="#172242" strokeWidth="2" />
            {/* Upper Arm */}
            <path d="M 136 258 L 118 290" stroke="#253564" strokeWidth="10" strokeLinecap="round" />
            {/* Elbow Joint Notch with Cyan Accent */}
            <polygon points="116,280 128,292 110,296" fill="#EF4444" stroke="#00E5FF" strokeWidth="1.5" />
            {/* Forearm */}
            <path d="M 120 292 L 132 322" stroke="#223059" strokeWidth="9" strokeLinecap="round" />
            {/* Red Forearm Cuff */}
            <ellipse cx="132" cy="324" rx="7" ry="5" fill="#EF4444" />
            {/* Red Mitten Hand */}
            <circle cx="134" cy="332" r="8" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.2" />
            <circle cx="132" cy="330" r="3.5" fill="#FFFFFF" fillOpacity="0.4" />
          </g>

          {/* Right Arm (viewer's right: waving cheerfully!) */}
          <motion.g
            id="aiden-arm-right"
            animate={
              isWaving && animate
                ? {
                    rotate: [0, 8, -4, 8, 0],
                  }
                : undefined
            }
            transition={{
              repeat: Infinity,
              duration: 2.2,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "262px 256px" }}
          >
            {/* Shoulder Joint */}
            <circle cx="262" cy="256" r="8" fill="#EF4444" stroke="#172242" strokeWidth="2" />
            {/* Upper Arm raised up */}
            <path d="M 264 256 L 278 285" stroke="#253564" strokeWidth="10" strokeLinecap="round" />
            {/* Elbow Joint Notch with Cyan Accent */}
            <polygon points="284,276 272,288 290,292" fill="#EF4444" stroke="#00E5FF" strokeWidth="1.5" />
            {/* Forearm reaching up to wave */}
            <path d="M 276 288 L 268 252" stroke="#223059" strokeWidth="9" strokeLinecap="round" />
            {/* Red Forearm Cuff */}
            <ellipse cx="267" cy="248" rx="6" ry="5" fill="#EF4444" />

            {/* Waving 4-finger Friendly Hand (open palm facing user) */}
            <g id="aiden-waving-hand" transform="translate(262, 222)">
              {/* Palm */}
              <ellipse cx="6" cy="16" rx="8" ry="7" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" />
              {/* Thumb */}
              <path d="M -1 16 C -4 14, -6 10, -4 8 C -2 6, 2 10, 2 14 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" />
              {/* Index Finger */}
              <path d="M 1 12 C 1 6, 4 3, 6 4 C 8 5, 7 10, 6 12 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" />
              {/* Middle Finger */}
              <path d="M 6 11 C 7 4, 10 2, 12 3 C 14 5, 12 10, 11 11 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" />
              {/* Ring Finger */}
              <path d="M 11 13 C 13 8, 16 6, 17 8 C 18 10, 16 13, 14 14 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" />
              {/* Pinky Finger */}
              <path d="M 14 16 C 17 13, 19 12, 20 14 C 21 16, 18 18, 16 18 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" />
              {/* Inner Palm Highlight */}
              <circle cx="6" cy="16" r="3.5" fill="#FF7878" />
            </g>
          </motion.g>

          {/* --- NECK --- */}
          <g id="aiden-neck">
            <rect x="190" y="234" width="20" height="13" rx="4" fill="#151d36" stroke="#253564" strokeWidth="1.5" />
            <line x1="193" y1="239" x2="207" y2="239" stroke="#EF4444" strokeWidth="1.5" />
          </g>

          {/* --- HEAD & VISOR --- */}
          <g id="aiden-head">
            {/* Left Ear Pod (Red oblong with 4 cyan speaker dots) */}
            <g id="aiden-ear-left">
              <rect x="116" y="152" width="13" height="34" rx="6.5" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
              <circle cx="122.5" cy="159" r="1.8" fill="#00E5FF" filter="url(#aiden-cyan-glow)" />
              <circle cx="122.5" cy="165" r="1.8" fill="#00E5FF" filter="url(#aiden-cyan-glow)" />
              <circle cx="122.5" cy="171" r="1.8" fill="#00E5FF" filter="url(#aiden-cyan-glow)" />
              <circle cx="122.5" cy="177" r="1.8" fill="#00E5FF" filter="url(#aiden-cyan-glow)" />
            </g>

            {/* Right Ear Pod (Red oblong with 4 cyan speaker dots) */}
            <g id="aiden-ear-right">
              <rect x="271" y="152" width="13" height="34" rx="6.5" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
              <circle cx="277.5" cy="159" r="1.8" fill="#00E5FF" filter="url(#aiden-cyan-glow)" />
              <circle cx="277.5" cy="165" r="1.8" fill="#00E5FF" filter="url(#aiden-cyan-glow)" />
              <circle cx="277.5" cy="171" r="1.8" fill="#00E5FF" filter="url(#aiden-cyan-glow)" />
              <circle cx="277.5" cy="177" r="1.8" fill="#00E5FF" filter="url(#aiden-cyan-glow)" />
            </g>

            {/* Head Casing: Rounded navy blue helmet */}
            <rect
              x="126"
              y="124"
              width="148"
              height="114"
              rx="46"
              fill="url(#aiden-head-grad)"
              stroke="#34467E"
              strokeWidth="3"
            />

            {/* Head Top Gloss Highlight Sheen */}
            <path
              d="M 148 132 C 172 126, 228 126, 252 132 C 258 134, 252 146, 240 148 C 210 152, 190 152, 160 148 C 148 146, 142 134, 148 132 Z"
              fill="url(#aiden-head-sheen)"
            />

            {/* Visor Screen Cavity & Glass (Dark Indigo) */}
            <rect
              x="142"
              y="138"
              width="116"
              height="86"
              rx="32"
              fill="url(#aiden-screen-grad)"
              stroke="#131c36"
              strokeWidth="2.5"
            />

            {/* Screen Top Curved Glass Reflection */}
            <path
              d="M 152 144 C 176 140, 224 140, 248 144 C 252 152, 244 162, 200 162 C 156 162, 148 152, 152 144 Z"
              fill="#FFFFFF"
              fillOpacity="0.08"
            />

            {/* --- VISOR FACE: EYES & SMILE --- */}
            {/* Left Eye (Curved friendly glowing cyan arc) */}
            <g id="aiden-eye-left" filter="url(#aiden-cyan-glow)">
              <rect x="162" y="165" width="26" height="15" rx="7.5" fill="#00E5FF" />
              <rect x="166" y="168" width="18" height="9" rx="4.5" fill="#FFFFFF" />
            </g>

            {/* Right Eye (Curved friendly glowing cyan arc) */}
            <g id="aiden-eye-right" filter="url(#aiden-cyan-glow)">
              <rect x="212" y="165" width="26" height="15" rx="7.5" fill="#00E5FF" />
              <rect x="216" y="168" width="18" height="9" rx="4.5" fill="#FFFFFF" />
            </g>

            {/* Smiling Mouth: Curved glowing cyan line */}
            <path
              d="M 186 195 Q 200 206 214 195"
              fill="none"
              stroke="#00E5FF"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#aiden-cyan-glow)"
            />

            {/* --- ANTENNA SYSTEM --- */}
            {/* Base triangular collar */}
            <polygon points="190,125 210,125 200,114" fill="#EF4444" stroke="#00E5FF" strokeWidth="1.2" />
            {/* Antenna Stem */}
            <line x1="200" y1="114" x2="200" y2="88" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
            {/* Glowing Red Antenna Bulb */}
            <circle cx="200" cy="84" r="8.5" fill="url(#aiden-glow-red)" filter="url(#aiden-red-glow)" />
            <circle cx="200" cy="84" r="6" fill="#EF4444" />
            <circle cx="198" cy="82" r="2.5" fill="#FFFFFF" />
          </g>
        </motion.g>
      </svg>
    </div>
  );
};
