import React from "react";

export interface LeagueEmblemProps {
  leagueId: string;
  size?: number;
  className?: string;
  isLocked?: boolean;
}

/**
 * Custom High-Fidelity Clash-Style Emblems for all ranks:
 * Bronze, Silver, Gold, Crystal, Masters, Champion, Emerald
 */
export const LeagueEmblem: React.FC<LeagueEmblemProps> = ({
  leagueId,
  size = 64,
  className = "",
  isLocked = false,
}) => {
  const normId = (leagueId || "bronze").toLowerCase();

  switch (normId) {
    // 1. BRONZE LEAGUE EMBLEM
    case "bronze":
      return (
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className={`drop-shadow-[0_4px_12px_rgba(122,69,32,0.45)] ${className}`}
        >
          <defs>
            <linearGradient id="brz-body" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5C088" />
              <stop offset="35%" stopColor="#D98A48" />
              <stop offset="70%" stopColor="#9C5221" />
              <stop offset="100%" stopColor="#5C2D0E" />
            </linearGradient>
            <linearGradient id="brz-rim" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFE0B2" />
              <stop offset="50%" stopColor="#B3652E" />
              <stop offset="100%" stopColor="#3E1A04" />
            </linearGradient>
            <radialGradient id="brz-glow" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#FFE1B9" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#CD7832" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#7A390C" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Base Shield */}
          <path
            d="M50 6 C74 6 88 16 86 46 C84 72 50 94 50 94 C50 94 16 72 14 46 C12 16 26 6 50 6 Z"
            fill="url(#brz-body)"
            stroke="url(#brz-rim)"
            strokeWidth="4"
          />
          {/* Inner Inset Rim */}
          <path
            d="M50 14 C70 14 80 22 78 46 C76 67 50 84 50 84 C50 84 24 67 22 46 C20 22 30 14 50 14 Z"
            fill="#4A2209"
            opacity="0.85"
            stroke="url(#brz-rim)"
            strokeWidth="2"
          />
          {/* Ambient center radial glow */}
          <circle cx="50" cy="46" r="24" fill="url(#brz-glow)" />
          {/* Crossed Bronze Heavy Spikes / Swords */}
          <path
            d="M32 28 L68 64 M68 28 L32 64"
            stroke="#FFE0B2"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.75"
          />
          {/* Center Bronze Chevron Crest */}
          <path
            d="M50 28 L62 42 L58 48 L50 40 L42 48 L38 42 Z"
            fill="#FFE6CC"
            stroke="#3E1A04"
            strokeWidth="1.5"
          />
          <path
            d="M50 44 L64 60 L58 66 L50 56 L42 66 L36 60 Z"
            fill="url(#brz-body)"
            stroke="#FFE6CC"
            strokeWidth="1.5"
          />
          {/* Shield Rivets */}
          <circle cx="50" cy="11" r="2" fill="#FFE0B2" />
          <circle cx="20" cy="30" r="2" fill="#FFE0B2" />
          <circle cx="80" cy="30" r="2" fill="#FFE0B2" />
          <circle cx="26" cy="62" r="2" fill="#FFE0B2" />
          <circle cx="74" cy="62" r="2" fill="#FFE0B2" />
        </svg>
      );

    // 2. SILVER LEAGUE EMBLEM
    case "silver":
      return (
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className={`drop-shadow-[0_4px_14px_rgba(180,205,225,0.45)] ${className}`}
        >
          <defs>
            <linearGradient id="slv-body" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#CFD9E0" />
              <stop offset="70%" stopColor="#7E8E9B" />
              <stop offset="100%" stopColor="#434F59" />
            </linearGradient>
            <linearGradient id="slv-rim" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#A4B3BF" />
              <stop offset="100%" stopColor="#303A42" />
            </linearGradient>
            <linearGradient id="slv-wing" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E2EAF0" />
              <stop offset="100%" stopColor="#6C7C89" />
            </linearGradient>
          </defs>
          {/* Silver Side Wings */}
          <path
            d="M14 36 C8 24 16 12 28 20 C22 28 24 38 28 44 Z"
            fill="url(#slv-wing)"
            stroke="#FFF"
            strokeWidth="1.5"
          />
          <path
            d="M86 36 C92 24 84 12 72 20 C78 28 76 38 72 44 Z"
            fill="url(#slv-wing)"
            stroke="#FFF"
            strokeWidth="1.5"
          />
          {/* Main Knight Shield */}
          <path
            d="M50 8 C72 8 84 18 80 48 C77 74 50 94 50 94 C50 94 23 74 20 48 C16 18 28 8 50 8 Z"
            fill="url(#slv-body)"
            stroke="url(#slv-rim)"
            strokeWidth="4"
          />
          {/* Inner Plate */}
          <path
            d="M50 16 C68 16 76 24 74 48 C71 68 50 84 50 84 C50 84 29 68 26 48 C24 24 32 16 50 16 Z"
            fill="#1E2730"
            stroke="#A4B3BF"
            strokeWidth="2"
          />
          {/* Silver Polished Cross / Star */}
          <polygon
            points="50,22 55,38 71,40 58,50 63,66 50,55 37,66 42,50 29,40 45,38"
            fill="url(#slv-body)"
            stroke="#FFF"
            strokeWidth="1.5"
          />
          {/* Central Blue Silver Core */}
          <circle cx="50" cy="46" r="6" fill="#38BDF8" stroke="#FFF" strokeWidth="1.5" />
          {/* Highlights */}
          <circle cx="50" cy="13" r="2.5" fill="#FFF" />
          <circle cx="26" cy="28" r="2" fill="#FFF" />
          <circle cx="74" cy="28" r="2" fill="#FFF" />
        </svg>
      );

    // 3. GOLD LEAGUE EMBLEM
    case "gold":
      return (
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className={`drop-shadow-[0_4px_16px_rgba(255,212,0,0.5)] ${className}`}
        >
          <defs>
            <linearGradient id="gld-body" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF4B8" />
              <stop offset="25%" stopColor="#FFD400" />
              <stop offset="60%" stopColor="#D99B00" />
              <stop offset="100%" stopColor="#7A5200" />
            </linearGradient>
            <linearGradient id="gld-rim" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#FFE066" />
              <stop offset="100%" stopColor="#664400" />
            </linearGradient>
            <radialGradient id="gld-shine" cx="50%" cy="35%" r="45%">
              <stop offset="0%" stopColor="#FFF9D6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFD400" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Royal Crown Points at Top */}
          <polygon points="50,4 62,18 78,8 70,26 30,26 22,8 38,18" fill="url(#gld-body)" stroke="#FFF" strokeWidth="1.5" />
          {/* Main Shield */}
          <path
            d="M50 18 C75 18 88 28 84 56 C80 80 50 96 50 96 C50 96 20 80 16 56 C12 28 25 18 50 18 Z"
            fill="url(#gld-body)"
            stroke="url(#gld-rim)"
            strokeWidth="4"
          />
          {/* Inner Dark Royal Gold Plate */}
          <path
            d="M50 25 C70 25 80 34 76 56 C73 74 50 87 50 87 C50 87 27 74 24 56 C20 34 30 25 50 25 Z"
            fill="#3B2603"
            stroke="#FFE066"
            strokeWidth="2.5"
          />
          {/* Radiant Core Star */}
          <circle cx="50" cy="54" r="22" fill="url(#gld-shine)" />
          <polygon
            points="50,30 56,46 72,48 60,60 64,76 50,67 36,76 40,60 28,48 44,46"
            fill="url(#gld-body)"
            stroke="#FFF"
            strokeWidth="2"
          />
          {/* Central Gem */}
          <polygon points="50,46 56,54 50,62 44,54" fill="#FFFFFF" stroke="#D99B00" strokeWidth="1" />
          {/* Crown Jewels */}
          <circle cx="50" cy="7" r="2.5" fill="#FFF" />
          <circle cx="23" cy="11" r="2" fill="#FFF" />
          <circle cx="77" cy="11" r="2" fill="#FFF" />
        </svg>
      );

    // 4. CRYSTAL LEAGUE EMBLEM
    case "crystal":
      return (
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className={`drop-shadow-[0_4px_18px_rgba(201,162,255,0.55)] ${className}`}
        >
          <defs>
            <linearGradient id="cry-body" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5E8FF" />
              <stop offset="30%" stopColor="#C9A2FF" />
              <stop offset="70%" stopColor="#7E3AF2" />
              <stop offset="100%" stopColor="#3B0764" />
            </linearGradient>
            <linearGradient id="cry-gem" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#D8B4FE" />
              <stop offset="100%" stopColor="#6B21A8" />
            </linearGradient>
          </defs>
          {/* Spiky Crystal Outer Wings */}
          <polygon points="12,42 22,22 28,38 20,52" fill="#9333EA" stroke="#F5E8FF" strokeWidth="1.5" />
          <polygon points="88,42 78,22 72,38 80,52" fill="#9333EA" stroke="#F5E8FF" strokeWidth="1.5" />
          {/* Hexagonal Crystal Shield */}
          <polygon
            points="50,6 84,24 84,68 50,94 16,68 16,24"
            fill="url(#cry-body)"
            stroke="#F5E8FF"
            strokeWidth="3.5"
          />
          {/* Inner Facet Lines */}
          <polygon
            points="50,16 76,30 76,64 50,84 24,64 24,30"
            fill="#1E0A3C"
            stroke="#A855F7"
            strokeWidth="2"
          />
          {/* Big Multi-Faceted Violet Gem */}
          <polygon points="50,24 68,40 50,78 32,40" fill="url(#cry-gem)" stroke="#FFF" strokeWidth="2" />
          <polygon points="50,24 50,78 32,40" fill="#7E3AF2" opacity="0.4" />
          <polygon points="50,38 62,48 50,66 38,48" fill="#FFFFFF" opacity="0.6" />
          {/* Crystal Nodes */}
          <circle cx="50" cy="8" r="3" fill="#FFF" />
          <circle cx="84" cy="24" r="2.5" fill="#FFF" />
          <circle cx="16" cy="24" r="2.5" fill="#FFF" />
        </svg>
      );

    // 5. MASTERS LEAGUE EMBLEM
    case "masters":
      return (
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className={`drop-shadow-[0_4px_18px_rgba(30,41,59,0.7)] ${className}`}
        >
          <defs>
            <linearGradient id="mst-body" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="35%" stopColor="#475569" />
              <stop offset="70%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <linearGradient id="mst-edge" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="60%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          {/* Menacing Dark Curved Horns */}
          <path
            d="M26 24 C10 8 4 28 8 46 C14 36 22 30 26 24 Z"
            fill="#334155"
            stroke="#E2E8F0"
            strokeWidth="1.5"
          />
          <path
            d="M74 24 C90 8 96 28 92 46 C86 36 78 30 74 24 Z"
            fill="#334155"
            stroke="#E2E8F0"
            strokeWidth="1.5"
          />
          {/* Obsidian Heavy Dread Shield */}
          <polygon
            points="50,6 82,20 86,58 50,96 14,58 18,20"
            fill="url(#mst-body)"
            stroke="url(#mst-edge)"
            strokeWidth="4"
          />
          {/* Inner Dark Carbon Core */}
          <polygon
            points="50,16 74,28 76,54 50,84 24,54 26,28"
            fill="#050811"
            stroke="#64748B"
            strokeWidth="2.5"
          />
          {/* Dual Edge Titanium Skull / Blade */}
          <path
            d="M50 20 L58 44 L68 50 L56 62 L50 78 L44 62 L32 50 L42 44 Z"
            fill="#CBD5E1"
            stroke="#FFF"
            strokeWidth="2"
          />
          {/* Glowing Red Master's Eye */}
          <circle cx="50" cy="48" r="5" fill="#EF4444" stroke="#FFF" strokeWidth="1.5" />
          <circle cx="50" cy="48" r="2" fill="#FFF" />
        </svg>
      );

    // 6. CHAMPION LEAGUE EMBLEM
    case "champion":
      return (
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className={`drop-shadow-[0_4px_22px_rgba(255,100,100,0.6)] ${className}`}
        >
          <defs>
            <linearGradient id="chm-body" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFA6A6" />
              <stop offset="25%" stopColor="#FF4D4D" />
              <stop offset="70%" stopColor="#B91C1C" />
              <stop offset="100%" stopColor="#450A0A" />
            </linearGradient>
            <linearGradient id="chm-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF275" />
              <stop offset="50%" stopColor="#FFB800" />
              <stop offset="100%" stopColor="#805400" />
            </linearGradient>
          </defs>
          {/* Blazing Crimson Wings on Sides */}
          <path
            d="M16 48 C2 28 10 8 30 14 C18 24 20 38 24 48 Z"
            fill="url(#chm-gold)"
            stroke="#FFF"
            strokeWidth="1.5"
          />
          <path
            d="M84 48 C98 28 90 8 70 14 C82 24 80 38 76 48 Z"
            fill="url(#chm-gold)"
            stroke="#FFF"
            strokeWidth="1.5"
          />
          {/* Flame Shield Base */}
          <path
            d="M50 10 C74 10 86 24 82 54 C78 78 50 96 50 96 C50 96 22 78 18 54 C14 24 26 10 50 10 Z"
            fill="url(#chm-body)"
            stroke="url(#chm-gold)"
            strokeWidth="4"
          />
          {/* Inner Fiery Core */}
          <path
            d="M50 18 C68 18 76 28 73 52 C70 70 50 84 50 84 C50 84 30 70 27 52 C24 28 32 18 50 18 Z"
            fill="#2D0606"
            stroke="#FF4D4D"
            strokeWidth="2.5"
          />
          {/* Golden Champion Crown & Crossed Swords */}
          <polygon points="50,22 56,36 70,36 60,46 64,60 50,52 36,60 40,46 30,36 44,36" fill="url(#chm-gold)" stroke="#FFF" strokeWidth="2" />
          {/* Radiant Fiery Heart Gem */}
          <polygon points="50,42 58,52 50,66 42,52" fill="#FF2E88" stroke="#FFF" strokeWidth="1.5" />
          <circle cx="50" cy="52" r="3" fill="#FFF" />
        </svg>
      );

    // 7. EMERALD / TITAN LEAGUE EMBLEM
    case "emerald":
    default:
      return (
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className={`drop-shadow-[0_4px_22px_rgba(92,242,168,0.65)] ${className}`}
        >
          <defs>
            <linearGradient id="emr-body" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A7F3D0" />
              <stop offset="30%" stopColor="#34D399" />
              <stop offset="70%" stopColor="#059669" />
              <stop offset="100%" stopColor="#022C22" />
            </linearGradient>
            <linearGradient id="emr-gold" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="60%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#713F12" />
            </linearGradient>
          </defs>
          {/* Golden Mythic Laurel Wreath Wings */}
          <path
            d="M12 40 C6 20 22 10 32 20 C20 26 22 36 24 46 Z"
            fill="url(#emr-gold)"
            stroke="#FFF"
            strokeWidth="1.5"
          />
          <path
            d="M88 40 C94 20 78 10 68 20 C80 26 78 36 76 46 Z"
            fill="url(#emr-gold)"
            stroke="#FFF"
            strokeWidth="1.5"
          />
          {/* Royal Emerald Shield */}
          <polygon
            points="50,6 84,20 86,60 50,96 14,60 16,20"
            fill="url(#emr-body)"
            stroke="url(#emr-gold)"
            strokeWidth="4"
          />
          {/* Inner Deep Jade Plate */}
          <polygon
            points="50,16 76,28 78,56 50,85 22,56 24,28"
            fill="#011B14"
            stroke="#34D399"
            strokeWidth="2.5"
          />
          {/* Grand Faceted Radiant Emerald */}
          <polygon
            points="50,22 70,38 70,58 50,78 30,58 30,38"
            fill="url(#emr-body)"
            stroke="#FFF"
            strokeWidth="2"
          />
          {/* Facets */}
          <polygon points="50,22 50,78 30,58 30,38" fill="#059669" opacity="0.35" />
          <polygon points="50,34 62,44 50,62 38,44" fill="#E6FFFA" stroke="#FFF" strokeWidth="1.5" />
          {/* Star Sparkle */}
          <circle cx="50" cy="48" r="4" fill="#FFFFFF" />
        </svg>
      );
  }
};
