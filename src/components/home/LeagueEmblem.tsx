import React from "react";
import { LeagueId } from "../../data/leaguesData";

interface LeagueEmblemProps {
  leagueId: LeagueId;
  subTier?: "III" | "II" | "I";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showGlow?: boolean;
}

export const LeagueEmblem: React.FC<LeagueEmblemProps> = ({
  leagueId,
  subTier,
  size = "md",
  className = "",
  showGlow = true,
}) => {
  const sizeDims = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-11 h-11",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }[size];

  // Visual palettes and assets based on Clash of Clans League Badges
  switch (leagueId) {
    case "bronze":
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${sizeDims} ${className}`}>
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md" fill="none">
            {/* Wooden/Bronze Wings Base */}
            <path d="M12 28L4 20L10 38L22 46L12 28Z" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
            <path d="M52 28L60 20L54 38L42 46L52 28Z" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
            {/* Bronze Main Shield */}
            <path
              d="M32 6L48 16V36C48 48 32 58 32 58C32 58 16 48 16 36V16L32 6Z"
              fill="url(#bronzeGrad)"
              stroke="#451a03"
              strokeWidth="2"
            />
            {/* Inner Bronze Inlay */}
            <path
              d="M32 12L42 19V34C42 43 32 50 32 50C32 50 22 43 22 34V19L32 12Z"
              fill="#b45309"
            />
            {/* Rivets / Crest */}
            <circle cx="32" cy="28" r="5" fill="#fef3c7" stroke="#78350f" strokeWidth="1.5" />
            <path d="M30 25L32 21L34 25L32 35L30 25Z" fill="#f59e0b" />
            <defs>
              <linearGradient id="bronzeGrad" x1="16" y1="6" x2="48" y2="58" gradientUnits="userSpaceOnUse">
                <stop stopColor="#d97706" />
                <stop offset="0.5" stopColor="#b45309" />
                <stop offset="1" stopColor="#78350f" />
              </linearGradient>
            </defs>
          </svg>
          {subTier && (
            <span className="absolute -bottom-1 text-[9px] font-black text-amber-200 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] bg-black/70 px-1 rounded">
              {subTier}
            </span>
          )}
        </div>
      );

    case "silver":
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${sizeDims} ${className}`}>
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md" fill="none">
            {/* Silver Steel Wings */}
            <path d="M10 24L3 18L7 38L20 46L10 24Z" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
            <path d="M54 24L61 18L57 38L44 46L54 24Z" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
            {/* Silver Shield */}
            <path
              d="M32 6L48 16V36C48 48 32 58 32 58C32 58 16 48 16 36V16L32 6Z"
              fill="url(#silverGrad)"
              stroke="#334155"
              strokeWidth="2"
            />
            {/* Inner Plate */}
            <path
              d="M32 12L42 19V34C42 43 32 50 32 50C32 50 22 43 22 34V19L32 12Z"
              fill="#94a3b8"
            />
            {/* Crossed Blades / Emblem */}
            <path d="M26 22L38 34M38 22L26 34" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="32" cy="28" r="3" fill="#38bdf8" />
            <defs>
              <linearGradient id="silverGrad" x1="16" y1="6" x2="48" y2="58" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f8fafc" />
                <stop offset="0.5" stopColor="#cbd5e1" />
                <stop offset="1" stopColor="#64748b" />
              </linearGradient>
            </defs>
          </svg>
          {subTier && (
            <span className="absolute -bottom-1 text-[9px] font-black text-slate-100 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] bg-black/70 px-1 rounded">
              {subTier}
            </span>
          )}
        </div>
      );

    case "gold":
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${sizeDims} ${className}`}>
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-lg" fill="none">
            {/* Gold Majestic Wings */}
            <path d="M10 22L2 14L5 36L20 48L10 22Z" fill="#ca8a04" stroke="#854d0e" strokeWidth="1.5" />
            <path d="M54 22L62 14L59 36L44 48L54 22Z" fill="#ca8a04" stroke="#854d0e" strokeWidth="1.5" />
            {/* Main Gold Shield */}
            <path
              d="M32 5L50 15V36C50 49 32 60 32 60C32 60 14 49 14 36V15L32 5Z"
              fill="url(#goldGrad)"
              stroke="#854d0e"
              strokeWidth="2"
            />
            {/* Inner Plate */}
            <path
              d="M32 11L43 18V34C43 43 32 52 32 52C32 52 21 43 21 34V18L32 11Z"
              fill="#eab308"
            />
            {/* Golden Star / Emblem */}
            <path
              d="M32 19L34.5 24.5L40 25.5L36 29.5L37 35L32 32.5L27 35L28 29.5L24 25.5L29.5 24.5L32 19Z"
              fill="#fef08a"
              stroke="#ca8a04"
              strokeWidth="1"
            />
            <defs>
              <linearGradient id="goldGrad" x1="14" y1="5" x2="50" y2="60" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fef08a" />
                <stop offset="0.3" stopColor="#facc15" />
                <stop offset="0.8" stopColor="#ca8a04" />
                <stop offset="1" stopColor="#854d0e" />
              </linearGradient>
            </defs>
          </svg>
          {subTier && (
            <span className="absolute -bottom-1 text-[9px] font-black text-amber-300 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] bg-black/70 px-1 rounded border border-amber-400/40">
              {subTier}
            </span>
          )}
        </div>
      );

    case "crystal":
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${sizeDims} ${className}`}>
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-xl" fill="none">
            {/* Crystal Shards Wings */}
            <path d="M12 24L3 14L8 38L21 48L12 24Z" fill="#9333ea" stroke="#581c87" strokeWidth="1.5" />
            <path d="M52 24L61 14L56 38L43 48L52 24Z" fill="#9333ea" stroke="#581c87" strokeWidth="1.5" />
            {/* Crystal Shield */}
            <path
              d="M32 4L50 14V36C50 50 32 60 32 60C32 60 14 50 14 36V14L32 4Z"
              fill="url(#crystalGrad)"
              stroke="#581c87"
              strokeWidth="2"
            />
            {/* Inner Gem Facet */}
            <path
              d="M32 11L43 18V34C43 44 32 52 32 52C32 52 21 44 21 34V18L32 11Z"
              fill="#c084fc"
            />
            {/* Glowing Crystal Diamond */}
            <path d="M32 18L39 28L32 42L25 28L32 18Z" fill="#f3e8ff" stroke="#a855f7" strokeWidth="1.5" />
            <defs>
              <linearGradient id="crystalGrad" x1="14" y1="4" x2="50" y2="60" gradientUnits="userSpaceOnUse">
                <stop stopColor="#e9d5ff" />
                <stop offset="0.4" stopColor="#c084fc" />
                <stop offset="0.8" stopColor="#9333ea" />
                <stop offset="1" stopColor="#581c87" />
              </linearGradient>
            </defs>
          </svg>
          {subTier && (
            <span className="absolute -bottom-1 text-[9px] font-black text-purple-200 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] bg-black/70 px-1 rounded border border-purple-400/40">
              {subTier}
            </span>
          )}
        </div>
      );

    case "master":
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${sizeDims} ${className}`}>
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-xl" fill="none">
            {/* Master Spiked Dark Wings */}
            <path d="M8 20L1 10L6 34L18 46L8 20Z" fill="#881337" stroke="#4c0519" strokeWidth="1.5" />
            <path d="M56 20L63 10L58 34L46 46L56 20Z" fill="#881337" stroke="#4c0519" strokeWidth="1.5" />
            {/* Master Shield (Black & Crimson) */}
            <path
              d="M32 4L52 14V36C52 50 32 60 32 60C32 60 12 50 12 36V14L32 4Z"
              fill="url(#masterGrad)"
              stroke="#fb7185"
              strokeWidth="2"
            />
            {/* Inner Plate */}
            <path
              d="M32 11L44 18V34C44 44 32 53 32 53C32 53 20 44 20 34V18L32 11Z"
              fill="#9f1239"
            />
            {/* Spiky Master Skull / Emblem */}
            <path
              d="M32 18L37 24L35 34L32 37L29 34L27 24L32 18Z"
              fill="#ffe4e6"
              stroke="#f43f5e"
              strokeWidth="1.5"
            />
            <defs>
              <linearGradient id="masterGrad" x1="12" y1="4" x2="52" y2="60" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fda4af" />
                <stop offset="0.3" stopColor="#e11d48" />
                <stop offset="0.8" stopColor="#881337" />
                <stop offset="1" stopColor="#1e1b4b" />
              </linearGradient>
            </defs>
          </svg>
          {subTier && (
            <span className="absolute -bottom-1 text-[9px] font-black text-rose-200 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] bg-black/70 px-1 rounded border border-rose-500/40">
              {subTier}
            </span>
          )}
        </div>
      );

    case "champion":
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${sizeDims} ${className}`}>
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-2xl" fill="none">
            {/* Dragon Horns & Fiery Golden Wings */}
            <path d="M8 16L0 6L6 32L18 46L8 16Z" fill="#c2410c" stroke="#7c2d12" strokeWidth="1.5" />
            <path d="M56 16L64 6L58 32L46 46L56 16Z" fill="#c2410c" stroke="#7c2d12" strokeWidth="1.5" />
            {/* Champion Red/Gold Shield */}
            <path
              d="M32 3L52 13V36C52 51 32 61 32 61C32 61 12 51 12 36V13L32 3Z"
              fill="url(#champGrad)"
              stroke="#facc15"
              strokeWidth="2.5"
            />
            {/* Inner Radiant Plate */}
            <path
              d="M32 10L44 17V34C44 45 32 54 32 54C32 54 20 45 20 34V17L32 10Z"
              fill="#ea580c"
            />
            {/* Flaming Champion Crest */}
            <path
              d="M32 16C35 22 40 24 38 32C36 37 32 38 32 38C32 38 28 37 26 32C24 24 29 22 32 16Z"
              fill="#fef08a"
              stroke="#f97316"
              strokeWidth="1.5"
            />
            <defs>
              <linearGradient id="champGrad" x1="12" y1="3" x2="52" y2="61" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fef08a" />
                <stop offset="0.3" stopColor="#f97316" />
                <stop offset="0.7" stopColor="#c2410c" />
                <stop offset="1" stopColor="#7c2d12" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case "titan":
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${sizeDims} ${className}`}>
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-2xl" fill="none">
            {/* Celestial Titan Feathered Wings */}
            <path d="M6 14L0 4L5 32L18 46L6 14Z" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
            <path d="M58 14L64 4L59 32L46 46L58 14Z" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
            {/* Titan Platinum & Sky Blue Shield */}
            <path
              d="M32 3L53 13V36C53 51 32 61 32 61C32 61 11 51 11 36V13L32 3Z"
              fill="url(#titanGrad)"
              stroke="#38bdf8"
              strokeWidth="2.5"
            />
            {/* Inner Plate */}
            <path
              d="M32 9L44 17V34C44 45 32 54 32 54C32 54 20 45 20 34V17L32 9Z"
              fill="#0ea5e9"
            />
            {/* Sunburst Titan Core */}
            <circle cx="32" cy="27" r="7" fill="#f0f9ff" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="32" cy="27" r="3.5" fill="#38bdf8" />
            <defs>
              <linearGradient id="titanGrad" x1="11" y1="3" x2="53" y2="61" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f0f9ff" />
                <stop offset="0.3" stopColor="#38bdf8" />
                <stop offset="0.8" stopColor="#0284c7" />
                <stop offset="1" stopColor="#0c4a6e" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case "legend":
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${sizeDims} ${className}`}>
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-2xl" fill="none">
            {/* Legendary Cosmic Wings */}
            <path d="M6 12L0 2L4 32L17 48L6 12Z" fill="#4338ca" stroke="#312e81" strokeWidth="2" />
            <path d="M58 12L64 2L60 32L47 48L58 12Z" fill="#4338ca" stroke="#312e81" strokeWidth="2" />
            {/* Legend Shield (Purple/Indigo Cosmic Glass) */}
            <path
              d="M32 2L54 12V36C54 52 32 62 32 62C32 62 10 52 10 36V12L32 2Z"
              fill="url(#legendGrad)"
              stroke="#a5b4fc"
              strokeWidth="2.5"
            />
            {/* Inner Plate */}
            <path
              d="M32 8L45 16V34C45 46 32 55 32 55C32 55 19 46 19 34V16L32 8Z"
              fill="#4f46e5"
            />
            {/* Golden Star of Legend */}
            <path
              d="M32 14L34.5 22.5L43 23.5L36.5 29L38.5 37.5L32 33L25.5 37.5L27.5 29L21 23.5L29.5 22.5L32 14Z"
              fill="#fef08a"
              stroke="#fbbf24"
              strokeWidth="1.5"
            />
            <circle cx="32" cy="27" r="3" fill="#818cf8" />
            <defs>
              <linearGradient id="legendGrad" x1="10" y1="2" x2="54" y2="62" gradientUnits="userSpaceOnUse">
                <stop stopColor="#e0e7ff" />
                <stop offset="0.3" stopColor="#818cf8" />
                <stop offset="0.7" stopColor="#4338ca" />
                <stop offset="1" stopColor="#1e1b4b" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    default:
      return null;
  }
};
