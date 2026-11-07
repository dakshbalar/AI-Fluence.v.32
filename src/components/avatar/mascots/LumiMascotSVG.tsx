import React from "react";
import { motion } from "motion/react";
import { CharacterMood } from "../../../types/avatar";

interface LumiMascotSVGProps {
  size?: number;
  mood?: CharacterMood;
  className?: string;
  animate?: boolean;
  faceZoom?: boolean;
}

export const LumiMascotSVG: React.FC<LumiMascotSVGProps> = ({
  size = 340,
  mood = "idea",
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
        viewBox={faceZoom ? "100 75 200 200" : "0 0 400 490"}
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="lumi-head-grad" x1="140" y1="120" x2="260" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>

          <linearGradient id="lumi-body-grad" x1="150" y1="240" x2="250" y2="380" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          <linearGradient id="lumi-screen-grad" x1="150" y1="140" x2="250" y2="230" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#14091d" />
            <stop offset="100%" stopColor="#08030c" />
          </linearGradient>

          <radialGradient id="lumi-portal-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF2A8D" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#2e0821" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="lumi-pink-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#FF2A8D" />
            <stop offset="100%" stopColor="#FF2A8D" stopOpacity="0" />
          </radialGradient>

          {/* Glow Filters */}
          <filter id="lumi-pink-bloom" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. GROUND PLATFORM & ORBITING RING */}
        <g id="lumi-pedestal-portal">
          {/* Deep dark portal shadow disc */}
          <ellipse cx="200" cy="435" rx="88" ry="18" fill="#050106" />
          <ellipse cx="200" cy="435" rx="82" ry="15" fill="url(#lumi-portal-glow)" />
          <ellipse cx="200" cy="435" rx="70" ry="11" fill="#0d030f" stroke="#FF2A8D" strokeWidth="1.5" strokeOpacity="0.5" />

          {/* Glowing pink dashed orbital ellipse line */}
          <ellipse
            cx="200"
            cy="390"
            rx="106"
            ry="38"
            fill="none"
            stroke="#FF2A8D"
            strokeWidth="1.8"
            strokeDasharray="4 5"
            strokeOpacity="0.8"
            transform="rotate(-15 200 390)"
            filter="url(#lumi-pink-bloom)"
          />

          {/* Floating Starlight Sparkles around platform */}
          {[
            { x: 100, y: 310, s: 7 },
            { x: 300, y: 315, s: 8 },
            { x: 92, y: 395, s: 6 },
            { x: 308, y: 400, s: 7 },
            { x: 135, y: 430, s: 5 },
            { x: 265, y: 435, s: 6 },
          ].map((sp, idx) => (
            <path
              key={`lumi-sparkle-${idx}`}
              d={`M ${sp.x} ${sp.y - sp.s} Q ${sp.x} ${sp.y} ${sp.x + sp.s} ${sp.y} Q ${sp.x} ${sp.y} ${sp.x} ${sp.y + sp.s} Q ${sp.x} ${sp.y} ${sp.x - sp.s} ${sp.y} Q ${sp.x} ${sp.y} ${sp.x} ${sp.y - sp.s} Z`}
              fill="#FF2A8D"
              filter="url(#lumi-pink-bloom)"
            />
          ))}
        </g>

        {/* 2. MAIN FLOATING ROBOT ASSEMBLY */}
        <motion.g
          animate={
            animate
              ? {
                  y: [0, -9, 0],
                }
              : undefined
          }
          transition={{
            repeat: Infinity,
            duration: 3.2,
            ease: "easeInOut",
          }}
        >
          {/* --- HALO SYSTEM FLOATING ABOVE HEAD --- */}
          <motion.g
            id="lumi-halo"
            animate={
              animate
                ? {
                    y: [0, -4, 0],
                  }
                : undefined
            }
            transition={{
              repeat: Infinity,
              duration: 2.4,
              ease: "easeInOut",
            }}
          >
            {/* Halo Stem with Diamond Crystal Joint */}
            <line x1="200" y1="126" x2="200" y2="100" stroke="#FF2A8D" strokeWidth="2.5" />
            <polygon points="200,108 205,114 200,120 195,114" fill="#FF2A8D" filter="url(#lumi-pink-bloom)" />

            {/* Glowing Neon Pink Oval Halo */}
            <ellipse
              cx="200"
              cy="95"
              rx="40"
              ry="10"
              fill="none"
              stroke="#FF2A8D"
              strokeWidth="4"
              filter="url(#lumi-pink-bloom)"
            />
            <ellipse
              cx="200"
              cy="95"
              rx="40"
              ry="10"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeOpacity="0.8"
            />
          </motion.g>

          {/* --- LOWER BODY: TAPERED FLOATING CONICAL THRUSTER TIP --- */}
          <g id="lumi-floating-thruster">
            {/* Tapered Pod Tail */}
            <path
              d="M 172 340 L 200 395 L 228 340 Z"
              fill="url(#lumi-body-grad)"
              stroke="#CBD5E1"
              strokeWidth="1.5"
            />
            {/* Glowing Pink Diamond Crystal at Tip */}
            <polygon
              points="200,388 208,400 200,414 192,400"
              fill="#FF2A8D"
              filter="url(#lumi-pink-bloom)"
            />
            <polygon points="200,392 205,400 200,409 195,400" fill="#FFFFFF" />
          </g>

          {/* --- TORSO & CHEST --- */}
          <g id="lumi-torso">
            {/* Pearlescent White Torso Pod */}
            <path
              d="M 152 246 C 152 246, 142 280, 162 336 C 166 348, 234 348, 238 336 C 258 280, 248 246, 248 246 Z"
              fill="url(#lumi-body-grad)"
              stroke="#CBD5E1"
              strokeWidth="2"
            />

            {/* Pearlescent Edge Highlight */}
            <path
              d="M 158 252 C 154 280, 168 330, 172 336"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Curved Pink Trim Contour Lines on Body */}
            <path
              d="M 172 264 Q 200 274 228 264"
              stroke="#F472B6"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeOpacity="0.8"
            />
            <path
              d="M 180 326 Q 200 334 220 326"
              stroke="#FF2A8D"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeOpacity="0.7"
            />

            {/* Center Chest Core: Glowing Pink Diamond with Orbital Ring */}
            {/* Inverted triangular badge frame */}
            <polygon points="186,280 214,280 200,306" fill="#14091d" stroke="#F472B6" strokeWidth="1.5" />
            {/* Center Glowing Gem */}
            <circle cx="200" cy="292" r="7.5" fill="#FF2A8D" filter="url(#lumi-pink-bloom)" />
            <circle cx="200" cy="292" r="3.5" fill="#FFFFFF" />
            {/* Tilted Orbital Ring around gem */}
            <ellipse
              cx="200"
              cy="292"
              rx="15"
              ry="5.5"
              fill="none"
              stroke="#FF2A8D"
              strokeWidth="1.8"
              transform="rotate(-20 200 292)"
              filter="url(#lumi-pink-bloom)"
            />
          </g>

          {/* --- ARMS & HANDS --- */}
          {/* Left Arm (viewer's left: relaxed elegant floating) */}
          <g id="lumi-arm-left">
            <path d="M 148 256 C 136 276, 134 300, 142 320" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
            <ellipse cx="142" cy="322" rx="5.5" ry="4" fill="#F472B6" />
            <circle cx="144" cy="328" r="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
          </g>

          {/* Right Arm (viewer's right: holding glowing stylus/pointer wand) */}
          <motion.g
            id="lumi-arm-right"
            animate={
              animate
                ? {
                    rotate: [0, -3, 3, 0],
                  }
                : undefined
            }
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "252px 256px" }}
          >
            {/* Upper Arm & Forearm pointing up */}
            <path d="M 252 256 C 262 270, 268 288, 262 300 C 258 308, 252 302, 248 290" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
            {/* Pink Cuff */}
            <ellipse cx="250" cy="288" rx="5.5" ry="4" fill="#F472B6" />
            {/* White Hand */}
            <circle cx="250" cy="282" r="5.5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />

            {/* Glowing Pointer Wand / Stylus pointing upwards */}
            <line x1="250" y1="282" x2="266" y2="236" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
            {/* Wand Pink glowing tip */}
            <circle cx="266" cy="235" r="4.5" fill="#FF2A8D" filter="url(#lumi-pink-bloom)" />
            <circle cx="266" cy="235" r="2" fill="#FFFFFF" />
          </motion.g>

          {/* --- NECK --- */}
          <g id="lumi-neck">
            <rect x="191" y="234" width="18" height="13" rx="4" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
            <line x1="193" y1="239" x2="207" y2="239" stroke="#FF2A8D" strokeWidth="1.5" />
          </g>

          {/* --- HEAD & VISOR --- */}
          <g id="lumi-head">
            {/* Left Ear: Neon Pink Ring Pod */}
            <g id="lumi-ear-left">
              <ellipse cx="120" cy="172" rx="7" ry="16" fill="#14091d" stroke="#FF2A8D" strokeWidth="3.5" filter="url(#lumi-pink-bloom)" />
              <ellipse cx="120" cy="172" rx="4" ry="11" fill="none" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.7" />
            </g>

            {/* Right Ear: Neon Pink Ring Pod */}
            <g id="lumi-ear-right">
              <ellipse cx="280" cy="172" rx="7" ry="16" fill="#14091d" stroke="#FF2A8D" strokeWidth="3.5" filter="url(#lumi-pink-bloom)" />
              <ellipse cx="280" cy="172" rx="4" ry="11" fill="none" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.7" />
            </g>

            {/* Pearlescent White Capsule Head */}
            <rect
              x="126"
              y="126"
              width="148"
              height="112"
              rx="48"
              fill="url(#lumi-head-grad)"
              stroke="#CBD5E1"
              strokeWidth="2.5"
            />

            {/* Head Top Sheen */}
            <path
              d="M 148 134 C 172 128, 228 128, 252 134 C 258 136, 252 148, 240 150 C 210 154, 190 154, 160 150 C 148 148, 142 136, 148 134 Z"
              fill="#FFFFFF"
              fillOpacity="0.6"
            />

            {/* Dark Visor Cavity Glass */}
            <rect
              x="142"
              y="140"
              width="116"
              height="84"
              rx="32"
              fill="url(#lumi-screen-grad)"
              stroke="#1a0d24"
              strokeWidth="2"
            />

            {/* Visor Glass Curved Highlight */}
            <path
              d="M 152 146 C 176 142, 224 142, 248 146 C 252 154, 244 162, 200 162 C 156 162, 148 154, 152 146 Z"
              fill="#FFFFFF"
              fillOpacity="0.1"
            />

            {/* --- VISOR FACE: SPARKLE STAR EYES & BLUSH --- */}
            {/* Left Sparkle Eye with Eyelash */}
            <g id="lumi-eye-left" filter="url(#lumi-pink-bloom)">
              {/* Eyelash flick */}
              <path d="M 154 165 Q 160 162 168 165" stroke="#FF2A8D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              {/* 4-point Sparkle Star */}
              <path
                d="M 172 162 Q 172 172 182 172 Q 172 172 172 182 Q 172 172 162 172 Q 172 172 172 162 Z"
                fill="#FF2A8D"
              />
              <circle cx="172" cy="172" r="2.5" fill="#FFFFFF" />
            </g>

            {/* Right Sparkle Eye with Eyelash */}
            <g id="lumi-eye-right" filter="url(#lumi-pink-bloom)">
              {/* Eyelash flick */}
              <path d="M 246 165 Q 240 162 232 165" stroke="#FF2A8D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              {/* 4-point Sparkle Star */}
              <path
                d="M 228 162 Q 228 172 238 172 Q 228 172 228 182 Q 228 172 218 172 Q 228 172 228 162 Z"
                fill="#FF2A8D"
              />
              <circle cx="228" cy="172" r="2.5" fill="#FFFFFF" />
            </g>

            {/* Soft Cheerful Blush Marks */}
            <ellipse cx="162" cy="184" rx="6" ry="2.5" fill="#FF2A8D" fillOpacity="0.4" />
            <ellipse cx="238" cy="184" rx="6" ry="2.5" fill="#FF2A8D" fillOpacity="0.4" />

            {/* Smiling Mouth: Cute glowing pink line */}
            <path
              d="M 190 192 Q 200 200 210 192"
              fill="none"
              stroke="#FF2A8D"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#lumi-pink-bloom)"
            />
          </g>
        </motion.g>
      </svg>
    </div>
  );
};
