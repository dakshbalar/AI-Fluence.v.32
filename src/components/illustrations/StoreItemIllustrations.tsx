import React from "react";

export const DiamondIllustration: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="diamond-grad" x1="10" y1="6" x2="38" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#0369a1" />
      </linearGradient>
      <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <g filter="url(#glow-cyan)">
      <polygon points="24,4 42,18 34,42 14,42 6,18" fill="url(#diamond-grad)" stroke="#7dd3fc" strokeWidth="1.5" />
      <polygon points="24,4 14,18 24,20" fill="#bae6fd" opacity="0.9" />
      <polygon points="24,4 34,18 24,20" fill="#7dd3fc" opacity="0.8" />
      <polygon points="6,18 14,18 24,20" fill="#0284c7" opacity="0.7" />
      <polygon points="42,18 34,18 24,20" fill="#0369a1" opacity="0.8" />
      <polygon points="14,18 24,20 19,42" fill="#0284c7" opacity="0.9" />
      <polygon points="34,18 24,20 29,42" fill="#0369a1" opacity="0.9" />
      <path d="M24 10 L28 16 L24 18 L20 16 Z" fill="#ffffff" opacity="0.85" />
    </g>
  </svg>
);

export const GoldTrophyIllustration: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="gold-grad" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="50%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#a16207" />
      </linearGradient>
    </defs>
    <g>
      <path d="M14 14 C8 14 8 24 14 28" stroke="#facc15" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M34 14 C40 14 40 24 34 28" stroke="#facc15" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M15 10 H33 L30 28 C29 33 19 33 18 28 Z" fill="url(#gold-grad)" stroke="#fef08a" strokeWidth="1.5" />
      <path d="M24 16 L25.5 19.5 H29 L26 21.5 L27 25 L24 23 L21 25 L22 21.5 L19 19.5 H22.5 Z" fill="#ffffff" opacity="0.9" />
      <rect x="22" y="32" width="4" height="6" fill="#ca8a04" />
      <path d="M16 38 H32 L34 42 H14 Z" fill="url(#gold-grad)" stroke="#fef08a" strokeWidth="1" />
    </g>
  </svg>
);

export const SilverTrophyIllustration: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="silver-grad" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f1f5f9" />
        <stop offset="50%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    </defs>
    <g>
      <path d="M14 14 C8 14 8 24 14 28" stroke="#cbd5e1" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M34 14 C40 14 40 24 34 28" stroke="#cbd5e1" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M15 10 H33 L30 28 C29 33 19 33 18 28 Z" fill="url(#silver-grad)" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="24" cy="20" r="4" fill="#ffffff" opacity="0.85" />
      <rect x="22" y="32" width="4" height="6" fill="#64748b" />
      <path d="M16 38 H32 L34 42 H14 Z" fill="url(#silver-grad)" stroke="#ffffff" strokeWidth="1" />
    </g>
  </svg>
);

export const BronzeTrophyIllustration: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="bronze-grad" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fdba74" />
        <stop offset="50%" stopColor="#c2410c" />
        <stop offset="100%" stopColor="#7c2d12" />
      </linearGradient>
    </defs>
    <g>
      <path d="M14 14 C8 14 8 24 14 28" stroke="#fb923c" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M34 14 C40 14 40 24 34 28" stroke="#fb923c" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M15 10 H33 L30 28 C29 33 19 33 18 28 Z" fill="url(#bronze-grad)" stroke="#fed7aa" strokeWidth="1.5" />
      <circle cx="24" cy="20" r="4" fill="#fed7aa" opacity="0.85" />
      <rect x="22" y="32" width="4" height="6" fill="#7c2d12" />
      <path d="M16 38 H32 L34 42 H14 Z" fill="url(#bronze-grad)" stroke="#fed7aa" strokeWidth="1" />
    </g>
  </svg>
);

export const RuneStoneIllustration: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="stone-grad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="50%" stopColor="#059669" />
        <stop offset="100%" stopColor="#064e3b" />
      </linearGradient>
    </defs>
    <g>
      <path d="M20 6 L38 14 L42 32 L28 42 L10 36 L6 18 Z" fill="url(#stone-grad)" stroke="#6ee7b7" strokeWidth="1.5" />
      <path d="M24 14 V34 M16 22 H32" stroke="#a7f3d0" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="24" r="6" fill="#10b981" opacity="0.6" />
    </g>
  </svg>
);

export const XpPotionIllustration: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="potion-grad" x1="16" y1="20" x2="32" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#7e22ce" />
      </linearGradient>
    </defs>
    <g>
      <rect x="20" y="8" width="8" height="6" rx="1" fill="#cbd5e1" />
      <path d="M18 14 H30 V18 C30 28 36 34 36 38 C36 41 30 43 24 43 C18 43 12 41 12 38 C12 34 18 28 18 18 Z" fill="url(#potion-grad)" stroke="#e879f9" strokeWidth="1.5" />
      <path d="M16 30 Q24 26 32 30" stroke="#f5d0fe" strokeWidth="1.5" fill="none" opacity="0.7" />
      <circle cx="20" cy="34" r="1.5" fill="#ffffff" opacity="0.8" />
      <circle cx="28" cy="37" r="1" fill="#ffffff" opacity="0.8" />
    </g>
  </svg>
);

export const StreakShieldIllustration: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="shield-grad" x1="12" y1="6" x2="36" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
    </defs>
    <g>
      <path d="M24 4 L40 10 V24 C40 34 32 41 24 44 C16 41 8 34 8 24 V10 Z" fill="url(#shield-grad)" stroke="#7dd3fc" strokeWidth="1.5" />
      <path d="M24 14 L28 22 H25 V28 H23 V22 H20 Z" fill="#facc15" />
    </g>
  </svg>
);

export const NameCardIllustration: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="card-grad" x1="6" y1="10" x2="42" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>
    <g>
      <rect x="6" y="12" width="36" height="24" rx="4" fill="url(#card-grad)" stroke="#fde68a" strokeWidth="1.5" />
      <circle cx="15" cy="24" r="5" fill="#ffffff" opacity="0.9" />
      <rect x="23" y="20" width="14" height="3" rx="1" fill="#ffffff" opacity="0.9" />
      <rect x="23" y="26" width="9" height="2" rx="1" fill="#ffffff" opacity="0.7" />
    </g>
  </svg>
);
