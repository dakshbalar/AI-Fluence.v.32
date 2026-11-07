import React from "react";
import { motion } from "motion/react";
import { CharacterMood } from "../../../types/avatar";

interface VexMascotSVGProps {
  size?: number;
  mood?: CharacterMood;
  className?: string;
  animate?: boolean;
  faceZoom?: boolean;
}

export const VexMascotSVG: React.FC<VexMascotSVGProps> = ({
  size = 340,
  mood = "challenging",
  className = "",
  animate = true,
  faceZoom = false,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={faceZoom ? "100 65 200 200" : "0 0 400 490"}
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="vex-head-grad" x1="140" y1="110" x2="260" y2="230" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#252932" />
            <stop offset="50%" stopColor="#16181e" />
            <stop offset="100%" stopColor="#0b0c0e" />
          </linearGradient>

          <linearGradient id="vex-body-grad" x1="150" y1="240" x2="250" y2="360" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#282c35" />
            <stop offset="60%" stopColor="#181a20" />
            <stop offset="100%" stopColor="#0a0b0d" />
          </linearGradient>

          <linearGradient id="vex-wing-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#b91c1c" />
            <stop offset="60%" stopColor="#7f1d1d" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>

          <radialGradient id="vex-portal-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF0033" stopOpacity="0.38" />
            <stop offset="60%" stopColor="#280308" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="vex-red-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#FF0033" />
            <stop offset="100%" stopColor="#FF0033" stopOpacity="0" />
          </radialGradient>

          {/* Glow Filters */}
          <filter id="vex-crimson-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. GROUND PLATFORM & ORBITING RING */}
        <g id="vex-pedestal-portal">
          {/* Deep dark portal shadow disc */}
          <ellipse cx="200" cy="435" rx="88" ry="18" fill="#040102" />
          <ellipse cx="200" cy="435" rx="82" ry="15" fill="url(#vex-portal-glow)" />
          <ellipse cx="200" cy="435" rx="70" ry="11" fill="#0c0204" stroke="#FF0033" strokeWidth="1.5" strokeOpacity="0.5" />

          {/* Glowing red dashed orbital ellipse line */}
          <ellipse
            cx="200"
            cy="390"
            rx="106"
            ry="38"
            fill="none"
            stroke="#FF0033"
            strokeWidth="1.8"
            strokeDasharray="4 5"
            strokeOpacity="0.8"
            transform="rotate(-15 200 390)"
            filter="url(#vex-crimson-glow)"
          />
        </g>

        {/* 2. MAIN VEX MECHA ASSEMBLY */}
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
            duration: 2.8,
            ease: "easeInOut",
          }}
        >
          {/* --- MECHA WINGS / SHOULDER THRUSTERS (LEFT & RIGHT) --- */}
          {/* Left Jagged Crimson Wing */}
          <g id="vex-wing-left">
            <polygon
              points="136,252 68,260 92,278 60,292 98,312 86,322 136,298"
              fill="url(#vex-wing-grad)"
              stroke="#FF0033"
              strokeWidth="2"
            />
            {/* Wing Chevron Marker */}
            <polygon points="120,274 105,282 120,290" fill="#FF0033" filter="url(#vex-crimson-glow)" />
          </g>

          {/* Right Jagged Crimson Wing */}
          <g id="vex-wing-right">
            <polygon
              points="264,252 332,260 308,278 340,292 302,312 314,322 264,298"
              fill="url(#vex-wing-grad)"
              stroke="#FF0033"
              strokeWidth="2"
            />
            {/* Wing Chevron Marker */}
            <polygon points="280,274 295,282 280,290" fill="#FF0033" filter="url(#vex-crimson-glow)" />
          </g>

          {/* --- LEGS & FEET --- */}
          <g id="vex-legs">
            {/* Left Leg */}
            <rect x="175" y="340" width="8" height="38" rx="4" fill="#334155" stroke="#1e293b" strokeWidth="1" />
            {/* Right Leg */}
            <rect x="217" y="340" width="8" height="38" rx="4" fill="#334155" stroke="#1e293b" strokeWidth="1" />

            {/* Left Mechanical Foot */}
            <polygon points="166,378 188,378 190,385 162,385" fill="#475569" stroke="#1e293b" strokeWidth="1" />
            <rect x="164" y="380" width="22" height="3" fill="#94a3b8" />

            {/* Right Mechanical Foot */}
            <polygon points="212,378 234,378 238,385 210,385" fill="#475569" stroke="#1e293b" strokeWidth="1" />
            <rect x="214" y="380" width="22" height="3" fill="#94a3b8" />
          </g>

          {/* --- TORSO & CHEST --- */}
          <g id="vex-torso">
            {/* Armored Stealth Chassis */}
            <polygon
              points="146,244 254,244 246,336 200,352 154,336"
              fill="url(#vex-body-grad)"
              stroke="#2d3340"
              strokeWidth="2.5"
            />

            {/* Shoulder Armored Plates with Red Accents */}
            <polygon points="144,244 168,244 146,270" fill="#EF4444" stroke="#FF0033" strokeWidth="1" />
            <polygon points="256,244 232,244 254,270" fill="#EF4444" stroke="#FF0033" strokeWidth="1" />

            {/* Center Chest Inverted Triangle & Magma Reactor Core */}
            <polygon
              points="178,266 222,266 200,308"
              fill="#0d0e12"
              stroke="#FF0033"
              strokeWidth="2.5"
            />
            {/* Glowing Magma Reactor Core */}
            <circle cx="200" cy="284" r="8" fill="#FF0033" filter="url(#vex-crimson-glow)" />
            <circle cx="200" cy="284" r="4" fill="#FFFFFF" />

            {/* Lower Rib Vents: 3 Vertical Slits on each side */}
            <g id="vex-rib-vents">
              {/* Left Rib Vents */}
              <circle cx="166" cy="326" r="6.5" fill="#1e293b" stroke="#FF0033" strokeWidth="1.2" />
              <line x1="163" y1="322" x2="163" y2="330" stroke="#FF0033" strokeWidth="1.5" />
              <line x1="166" y1="322" x2="166" y2="330" stroke="#FF0033" strokeWidth="1.5" />
              <line x1="169" y1="322" x2="169" y2="330" stroke="#FF0033" strokeWidth="1.5" />

              {/* Right Rib Vents */}
              <circle cx="234" cy="326" r="6.5" fill="#1e293b" stroke="#FF0033" strokeWidth="1.2" />
              <line x1="231" y1="322" x2="231" y2="330" stroke="#FF0033" strokeWidth="1.5" />
              <line x1="234" y1="322" x2="234" y2="330" stroke="#FF0033" strokeWidth="1.5" />
              <line x1="237" y1="322" x2="237" y2="330" stroke="#FF0033" strokeWidth="1.5" />
            </g>
          </g>

          {/* --- ARMS & HANDS --- */}
          {/* Left Arm (viewer's left: resting armored) */}
          <g id="vex-arm-left">
            <path d="M 144 256 L 128 290" stroke="#1f232b" strokeWidth="10" strokeLinecap="round" />
            <path d="M 128 290 L 138 322" stroke="#181a20" strokeWidth="8" strokeLinecap="round" />
            <ellipse cx="138" cy="324" rx="5" ry="4" fill="#334155" />
            <circle cx="140" cy="330" r="6" fill="#1e293b" stroke="#FF0033" strokeWidth="1" />
          </g>

          {/* Right Arm (viewer's right: resting armored) */}
          <g id="vex-arm-right">
            <path d="M 256 256 L 272 290" stroke="#1f232b" strokeWidth="10" strokeLinecap="round" />
            <path d="M 272 290 L 262 322" stroke="#181a20" strokeWidth="8" strokeLinecap="round" />
            <ellipse cx="262" cy="324" rx="5" ry="4" fill="#334155" />
            <circle cx="260" cy="330" r="6" fill="#1e293b" stroke="#FF0033" strokeWidth="1" />
          </g>

          {/* --- NECK --- */}
          <g id="vex-neck">
            <rect x="188" y="234" width="24" height="13" rx="3" fill="#0f1115" stroke="#282c35" strokeWidth="1.5" />
            <polygon points="196,242 204,242 200,246" fill="#FF0033" />
          </g>

          {/* --- HEAD & VISOR --- */}
          <g id="vex-head">
            {/* Left Ear: Ribbed Cooling Vent Slats */}
            <g id="vex-ear-left">
              <rect x="117" y="156" width="12" height="24" rx="2" fill="#0d0e12" stroke="#334155" strokeWidth="1" />
              <line x1="119" y1="161" x2="127" y2="161" stroke="#94a3b8" strokeWidth="2" />
              <line x1="119" y1="166" x2="127" y2="166" stroke="#94a3b8" strokeWidth="2" />
              <line x1="119" y1="171" x2="127" y2="171" stroke="#94a3b8" strokeWidth="2" />
              <line x1="119" y1="176" x2="127" y2="176" stroke="#94a3b8" strokeWidth="2" />
            </g>

            {/* Right Ear: Ribbed Cooling Vent Slats */}
            <g id="vex-ear-right">
              <rect x="271" y="156" width="12" height="24" rx="2" fill="#0d0e12" stroke="#334155" strokeWidth="1" />
              <line x1="273" y1="161" x2="281" y2="161" stroke="#94a3b8" strokeWidth="2" />
              <line x1="273" y1="166" x2="281" y2="166" stroke="#94a3b8" strokeWidth="2" />
              <line x1="273" y1="171" x2="281" y2="171" stroke="#94a3b8" strokeWidth="2" />
              <line x1="273" y1="176" x2="281" y2="176" stroke="#94a3b8" strokeWidth="2" />
            </g>

            {/* Faceted Angular Stealth Helmet */}
            <polygon
              points="148,124 252,124 274,166 264,228 200,240 136,228 126,166"
              fill="url(#vex-head-grad)"
              stroke="#333842"
              strokeWidth="2.5"
            />

            {/* Faceted Chiseled Edge Highlights */}
            <line x1="148" y1="124" x2="164" y2="154" stroke="#4b5563" strokeWidth="1.5" />
            <line x1="252" y1="124" x2="236" y2="154" stroke="#4b5563" strokeWidth="1.5" />

            {/* Stealth Dark Visor Glass */}
            <polygon
              points="152,142 248,142 260,172 250,214 200,224 150,214 140,172"
              fill="#060709"
              stroke="#1b1e24"
              strokeWidth="2"
            />

            {/* Forehead Inverted Red Triangle */}
            <polygon points="192,130 208,130 200,140" fill="#FF0033" filter="url(#vex-crimson-glow)" />

            {/* --- VISOR FACE: MENACING CRIMSON SLIT EYES & JAGGED TEETH --- */}
            {/* Left Angry Slit Eye */}
            <g id="vex-eye-left" filter="url(#vex-crimson-glow)">
              <polygon points="160,174 186,180 186,185 160,181" fill="#FF0033" />
              <line x1="162" y1="176" x2="184" y2="182" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
            </g>

            {/* Right Angry Slit Eye */}
            <g id="vex-eye-right" filter="url(#vex-crimson-glow)">
              <polygon points="240,174 214,180 214,185 240,181" fill="#FF0033" />
              <line x1="238" y1="176" x2="216" y2="182" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
            </g>

            {/* Menacing Jagged Grin / Fangs */}
            <path
              d="M 186 204 L 193 209 L 200 204 L 207 209 L 214 204"
              fill="none"
              stroke="#FF0033"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#vex-crimson-glow)"
            />

            {/* --- CROWN: LIGHTNING ANTENNA & V-SHAPED HORNS --- */}
            {/* Center Antenna Stem */}
            <line x1="200" y1="124" x2="200" y2="82" stroke="#475569" strokeWidth="3" />
            {/* Center Lightning Bolt Emblem */}
            <polygon
              points="201,84 195,96 200,96 198,106 207,94 202,94"
              fill="#FF0033"
              filter="url(#vex-crimson-glow)"
            />
            <polygon
              points="201,86 196,96 200,96 198,104 205,94 201,94"
              fill="#FFFFFF"
            />

            {/* Dual Aggressive Red V-Horns */}
            {/* Left V-Horn */}
            <polygon points="196,124 164,74 154,76 186,124" fill="#FF0033" filter="url(#vex-crimson-glow)" />
            <polygon points="194,124 166,77 158,78 186,124" fill="#DC2626" />
            <line x1="188" y1="122" x2="162" y2="76" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8" />

            {/* Right V-Horn */}
            <polygon points="204,124 236,74 246,76 214,124" fill="#FF0033" filter="url(#vex-crimson-glow)" />
            <polygon points="206,124 234,77 242,78 214,124" fill="#DC2626" />
            <line x1="212" y1="122" x2="238" y2="76" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8" />
          </g>
        </motion.g>
      </svg>
    </div>
  );
};
