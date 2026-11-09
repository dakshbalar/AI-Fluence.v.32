import React, { useState, useEffect, useRef } from "react";
import { useGamification } from "../../utils/gamificationStore";
import { useEngagementStore } from "../../utils/engagementStore";
import {
  GemSvg,
  HeartSvg,
  XpSvg,
  ShieldStreakSvg,
  Time1hSvg,
  RenderStoreIcon,
} from "./StoreIcons";

interface StoreItem {
  id: string;
  k?: string;
  n: string;
  d: string;
  p?: number;
  cash?: string;
  c: string;
  r?: [number, number];
  xp?: number;
  g?: number;
  h?: number;
}

const ICONS: Record<string, string> = {
  gem: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="128" height="128" role="img" aria-label="Diamonds (Gems)"><title>Diamonds (Gems)</title><defs><linearGradient id="i-gem-a" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#7DBDFF"/><stop offset="1" stop-color="#0057E7"/></linearGradient><linearGradient id="i-gem-b" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#DDEEFF"/><stop offset="1" stop-color="#5CA4FF"/></linearGradient></defs><polygon points="18,10 46,10 58,24 6,24" fill="url(#i-gem-b)"/><polygon points="6,24 58,24 32,58" fill="url(#i-gem-a)"/><path d="M18 10 L26 24 L32 10 L38 24 L46 10 M26 24 L32 58 L38 24" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.2"/><polygon points="14,22 20,12 25,12 18,22" fill="#fff" opacity=".85"/><circle cx="48" cy="18" r="2" fill="#fff"/></svg>',
  heart: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="128" height="128" role="img" aria-label="Energy Lives (Heart)"><title>Energy Lives (Heart)</title><defs><linearGradient id="i-heart-a" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#FF7A7A"/><stop offset="1" stop-color="#B3001B"/></linearGradient></defs><path d="M32 57 C10 41 6 26 12 17 C18 8 29 10 32 18 C35 10 46 8 52 17 C58 26 54 41 32 57Z" fill="url(#i-heart-a)" stroke="#5c0010" stroke-width="2.5" stroke-linejoin="round"/><path d="M17 22 C17 16 24 14 28 18" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".7"/></svg>',
  xp: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="128" height="128" role="img" aria-label="XP (Lightning Bolt)"><title>XP (Lightning Bolt)</title><defs><linearGradient id="i-xp-a" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#4FA3FF"/><stop offset="1" stop-color="#0A3FB3"/></linearGradient><linearGradient id="i-xp-b" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#FFF08A"/><stop offset="1" stop-color="#FFB400"/></linearGradient></defs><circle cx="32" cy="32" r="28" fill="url(#i-xp-a)" stroke="#BBCCD7" stroke-width="3"/><polygon points="37,8 17,36 29,36 25,57 47,26 34,26" fill="url(#i-xp-b)" stroke="#8a5a00" stroke-width="1.5" stroke-linejoin="round"/><ellipse cx="22" cy="16" rx="9" ry="4" fill="#fff" opacity=".25" transform="rotate(-30 22 16)"/></svg>',
  shield_streak: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="128" height="128" role="img" aria-label="Streak Shield"><title>Streak Shield</title><defs><linearGradient id="i-shield_streak-a" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#6FB4FF"/><stop offset="1" stop-color="#0A47C8"/></linearGradient><linearGradient id="i-shield_streak-b" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#FFC857"/><stop offset="1" stop-color="#FF3D00"/></linearGradient></defs><path d="M32 3 L57 11 V31 C57 46 46 57 32 61 C18 57 7 46 7 31 V11Z" fill="url(#i-shield_streak-a)" stroke="#BBCCD7" stroke-width="3" stroke-linejoin="round"/><path d="M32 12 L49 18 V31 C49 41 42 49 32 53 C22 49 15 41 15 31 V18Z" fill="#010B1F" opacity=".35"/><path d="M32 21 C33 29 41 32 41 40 C41 46 37 50 32 50 C27 50 23 46 23 40 C23 36 27 34 28 30 C30 32 30 34 30 35 C34 31 33 26 32 21Z" fill="url(#i-shield_streak-b)"/></svg>',
  chest_silver: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="128" height="128" role="img" aria-label="Silver Chest"><title>Silver Chest</title><defs><linearGradient id="i-chest_silver-a" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#F2F6FA"/><stop offset="1" stop-color="#9AA5B1"/></linearGradient><linearGradient id="i-chest_silver-b" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#C5CED8"/><stop offset="1" stop-color="#5B6572"/></linearGradient></defs><rect x="7" y="28" width="50" height="27" rx="4" fill="url(#i-chest_silver-b)"/><path d="M7 30 V24 C7 14 18 9 32 9 C46 9 57 14 57 24 V30Z" fill="url(#i-chest_silver-a)"/><rect x="7" y="27" width="50" height="5" fill="#7B8794"/><rect x="14" y="10" width="5" height="45" fill="#7B8794" opacity=".75"/><rect x="45" y="10" width="5" height="45" fill="#7B8794" opacity=".75"/><rect x="26" y="26" width="12" height="14" rx="3" fill="#F5C542" stroke="#000" stroke-opacity=".3"/><circle cx="32" cy="33" r="2" fill="#333"/><circle cx="11" cy="35" r="1.8" fill="#F5C542"/><circle cx="53" cy="35" r="1.8" fill="#F5C542"/><circle cx="11" cy="50" r="1.8" fill="#F5C542"/><circle cx="53" cy="50" r="1.8" fill="#F5C542"/></svg>',
  chest_gold: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="128" height="128" role="img" aria-label="Gold Chest"><title>Gold Chest</title><defs><linearGradient id="i-chest_gold-a" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#FFE98A"/><stop offset="1" stop-color="#D18A00"/></linearGradient><linearGradient id="i-chest_gold-b" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#F0B429"/><stop offset="1" stop-color="#9A5B00"/></linearGradient></defs><rect x="7" y="28" width="50" height="27" rx="4" fill="url(#i-chest_gold-b)"/><path d="M7 30 V24 C7 14 18 9 32 9 C46 9 57 14 57 24 V30Z" fill="url(#i-chest_gold-a)"/><rect x="7" y="27" width="50" height="5" fill="#B87400"/><rect x="14" y="10" width="5" height="45" fill="#B87400" opacity=".75"/><rect x="45" y="10" width="5" height="45" fill="#B87400" opacity=".75"/><rect x="26" y="26" width="12" height="14" rx="3" fill="#FFE27A" stroke="#000" stroke-opacity=".3"/><circle cx="32" cy="33" r="2" fill="#333"/><circle cx="11" cy="35" r="1.8" fill="#FFE27A"/><circle cx="53" cy="35" r="1.8" fill="#FFE27A"/><circle cx="11" cy="50" r="1.8" fill="#FFE27A"/><circle cx="53" cy="50" r="1.8" fill="#FFE27A"/><polygon points="32,10 38,16 32,24 26,16" fill="#E0115F" stroke="#fff" stroke-width="1"/></svg>',
  chest_deluxe: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="128" height="128" role="img" aria-label="Deluxe Epic Stash"><title>Deluxe Epic Stash</title><defs><linearGradient id="i-chest_deluxe-a" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#9CFFF2"/><stop offset="1" stop-color="#3D8BFF"/></linearGradient><linearGradient id="i-chest_deluxe-b" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#4FA3FF"/><stop offset="1" stop-color="#1a2a8c"/></linearGradient></defs><circle cx="32" cy="34" r="30" fill="#7DF3FF" opacity=".25"/><rect x="7" y="28" width="50" height="27" rx="4" fill="url(#i-chest_deluxe-b)"/><path d="M7 30 V24 C7 14 18 9 32 9 C46 9 57 14 57 24 V30Z" fill="url(#i-chest_deluxe-a)"/><rect x="7" y="27" width="50" height="5" fill="#7DF3FF"/><rect x="14" y="10" width="5" height="45" fill="#7DF3FF" opacity=".75"/><rect x="45" y="10" width="5" height="45" fill="#7DF3FF" opacity=".75"/><rect x="26" y="26" width="12" height="14" rx="3" fill="#E8FBFF" stroke="#000" stroke-opacity=".3"/><circle cx="32" cy="33" r="2" fill="#333"/><circle cx="11" cy="35" r="1.8" fill="#E8FBFF"/><circle cx="53" cy="35" r="1.8" fill="#E8FBFF"/><circle cx="11" cy="50" r="1.8" fill="#E8FBFF"/><circle cx="53" cy="50" r="1.8" fill="#E8FBFF"/><polygon points="32,10 38,16 32,24 26,16" fill="#E0115F" stroke="#fff" stroke-width="1"/><polygon points="54,4 56,9 61,11 56,13 54,18 52,13 47,11 52,9" fill="#fff"/><polygon points="8,6 9.5,10 14,11.5 9.5,13 8,17 6.5,13 2,11.5 6.5,10" fill="#fff" opacity=".8"/></svg>',
  wheel: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="128" height="128" role="img" aria-label="Wheel / Daily Bonus"><title>Wheel / Daily Bonus</title><defs></defs><path d="M32 34 L32.0 8.0 A26 26 0 0 1 50.4 15.6 Z" fill="#0057E7"/><path d="M32 34 L50.4 15.6 A26 26 0 0 1 58.0 34.0 Z" fill="#06224d"/><path d="M32 34 L58.0 34.0 A26 26 0 0 1 50.4 52.4 Z" fill="#1D6BFF"/><path d="M32 34 L50.4 52.4 A26 26 0 0 1 32.0 60.0 Z" fill="#021436"/><path d="M32 34 L32.0 60.0 A26 26 0 0 1 13.6 52.4 Z" fill="#4FA3FF"/><path d="M32 34 L13.6 52.4 A26 26 0 0 1 6.0 34.0 Z" fill="#0a2a66"/><path d="M32 34 L6.0 34.0 A26 26 0 0 1 13.6 15.6 Z" fill="#2f4fd0"/><path d="M32 34 L13.6 15.6 A26 26 0 0 1 32.0 8.0 Z" fill="#010B1F"/><circle cx="32" cy="34" r="27" fill="none" stroke="#D7E2EA" stroke-width="3"/><circle cx="32" cy="34" r="7" fill="#fff"/><circle cx="32" cy="34" r="3.5" fill="#1D6BFF"/><polygon points="26,1 38,1 32,13" fill="#FFE27A" stroke="#8a5a00" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  flask: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="128" height="128" role="img" aria-label="Scholar Flask"><title>Scholar Flask</title><defs><linearGradient id="i-flask-a" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#8EC5FF"/><stop offset="1" stop-color="#0057E7"/></linearGradient></defs><path d="M25 6 H39 V10 H36 V24 L50 50 C53 57 48 59 44 59 H20 C16 59 11 57 14 50 L28 24 V10 H25Z" fill="#DDEEFF" fill-opacity=".25" stroke="#BBCCD7" stroke-width="2.5" stroke-linejoin="round"/><path d="M19.4 40 H44.6 L50 50 C53 57 48 59 44 59 H20 C16 59 11 57 14 50Z" fill="url(#i-flask-a)"/><rect x="24" y="2" width="16" height="6" rx="2" fill="#8B5A2B"/><circle cx="28" cy="48" r="2.5" fill="#fff" opacity=".8"/><circle cx="36" cy="52" r="1.8" fill="#fff" opacity=".8"/></svg>',
  elixir: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="128" height="128" role="img" aria-label="Elixir Bottle"><title>Elixir Bottle</title><defs><linearGradient id="i-elixir-a" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#7DFFE0"/><stop offset="1" stop-color="#00A8FF"/></linearGradient></defs><circle cx="32" cy="40" r="26" fill="#7DFFF0" opacity=".22"/><rect x="27" y="9" width="10" height="16" fill="#DDEEFF" fill-opacity=".3" stroke="#BBCCD7" stroke-width="2"/><rect x="25" y="3" width="14" height="7" rx="2" fill="#8B5A2B"/><circle cx="32" cy="42" r="18" fill="#DDEEFF" fill-opacity=".25" stroke="#BBCCD7" stroke-width="2.5"/><circle cx="32" cy="42" r="14.5" fill="url(#i-elixir-a)"/><ellipse cx="26" cy="36" rx="4" ry="2.5" fill="#fff" opacity=".7" transform="rotate(-30 26 36)"/><polygon points="44,18 45.5,22 50,23.5 45.5,25 44,29 42.5,25 38,23.5 42.5,22" fill="#fff"/></svg>',
  time_1h: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="128" height="128" role="img" aria-label="1H Time Boost Stone"><title>1H Time Boost Stone</title><defs><linearGradient id="i-time_1h-a" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#7DF3FF"/><stop offset="1" stop-color="#0090C8"/></linearGradient></defs><polygon points="20,3 44,3 61,20 61,44 44,61 20,61 3,44 3,20" fill="url(#i-time_1h-a)" stroke="#D7E2EA" stroke-opacity=".7" stroke-width="2"/><polygon points="24,12 40,12 32,24" fill="#fff"/><polygon points="32,24 24,36 40,36" fill="#fff" opacity=".85"/><path d="M22 11 H42 M22 37 H42" stroke="#fff" stroke-width="2" stroke-linecap="round"/><text x="32" y="55" text-anchor="middle" font-family="Kanit,sans-serif" font-weight="800" font-size="12" fill="#fff">1H</text></svg>',
  time_3h: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="128" height="128" role="img" aria-label="3H Time Boost Stone"><title>3H Time Boost Stone</title><defs><linearGradient id="i-time_3h-a" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#6FB4FF"/><stop offset="1" stop-color="#0A47C8"/></linearGradient></defs><polygon points="20,3 44,3 61,20 61,44 44,61 20,61 3,44 3,20" fill="url(#i-time_3h-a)" stroke="#D7E2EA" stroke-opacity=".7" stroke-width="2"/><polygon points="24,12 40,12 32,24" fill="#fff"/><polygon points="32,24 24,36 40,36" fill="#fff" opacity=".85"/><path d="M22 11 H42 M22 37 H42" stroke="#fff" stroke-width="2" stroke-linecap="round"/><text x="32" y="55" text-anchor="middle" font-family="Kanit,sans-serif" font-weight="800" font-size="12" fill="#fff">3H</text></svg>',
  time_24h: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="128" height="128" role="img" aria-label="24H Time Boost Stone"><title>24H Time Boost Stone</title><defs><linearGradient id="i-time_24h-a" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#8A9BFF"/><stop offset="1" stop-color="#2a2aa8"/></linearGradient></defs><polygon points="20,3 44,3 61,20 61,44 44,61 20,61 3,44 3,20" fill="url(#i-time_24h-a)" stroke="#D7E2EA" stroke-opacity=".7" stroke-width="2"/><polygon points="24,12 40,12 32,24" fill="#fff"/><polygon points="32,24 24,36 40,36" fill="#fff" opacity=".85"/><path d="M22 11 H42 M22 37 H42" stroke="#fff" stroke-width="2" stroke-linecap="round"/><text x="32" y="55" text-anchor="middle" font-family="Kanit,sans-serif" font-weight="800" font-size="12" fill="#fff">24H</text></svg>',
  id_card: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="128" height="128" role="img" aria-label="Scholar ID Card"><title>Scholar ID Card</title><defs><linearGradient id="i-id_card-a" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#4FA3FF"/><stop offset="1" stop-color="#0A3FB3"/></linearGradient><linearGradient id="i-id_card-b" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#FFE98A"/><stop offset="1" stop-color="#D18A00"/></linearGradient></defs><rect x="5" y="14" width="54" height="36" rx="6" fill="url(#i-id_card-a)" stroke="#BBCCD7" stroke-width="2"/><circle cx="19" cy="28" r="6" fill="#fff"/><path d="M9 44 C9 35 29 35 29 44Z" fill="#fff"/><rect x="34" y="21" width="18" height="3" rx="1.5" fill="#fff"/><rect x="34" y="28" width="13" height="3" rx="1.5" fill="#fff" opacity=".6"/><rect x="34" y="36" width="11" height="8" rx="2" fill="url(#i-id_card-b)"/><circle cx="5" cy="32" r="4" fill="#0C0C0C"/><circle cx="59" cy="32" r="4" fill="#0C0C0C"/></svg>'
};

function ic(id: string, z: number) {
  return '<span style="display:inline-block;flex:none;width:' + z + 'px;height:' + z + 'px">' + (ICONS[id] || '') + '</span>';
}

const IT: StoreItem[] = [
  { id: "chest_silver", n: "Silver Chest", d: "Silver loot: 20–80 gems.", p: 100, c: "Chests", r: [20, 80] },
  { id: "chest_gold", n: "Gold Chest", d: "80–220 gems plus bonus XP.", p: 250, c: "Chests", r: [80, 220] },
  { id: "chest_deluxe", n: "Deluxe Epic Stash", d: "200–600 gems, XP and a bonus item.", p: 600, c: "Chests", r: [200, 600] },
  { id: "wheel", n: "Spin Ticket", d: "One spin of the daily wheel: 10–100 gems.", p: 60, c: "Chests", r: [10, 100] },
  { id: "flask", n: "Scholar Flask", d: "Drink for an instant +100 XP.", p: 120, c: "Potions", xp: 100 },
  { id: "elixir", n: "Elixir Bottle", d: "Radiant brew. Instant +250 XP.", p: 260, c: "Potions", xp: 250 },
  { id: "heart", n: "Heart Refill", d: "Restore 1 life, up to a maximum of 5.", p: 50, c: "Boosters" },
  { id: "shield_streak", n: "Streak Shield", d: "Protects your streak for one missed day.", p: 150, c: "Boosters" },
  { id: "time_1h", n: "1H Time Boost", d: "2× XP for 1 hour.", p: 80, c: "Boosters", h: 1 },
  { id: "time_3h", n: "3H Time Boost", d: "2× XP for 3 hours.", p: 200, c: "Boosters", h: 3 },
  { id: "time_24h", n: "24H Time Boost", d: "2× XP for a full day.", p: 500, c: "Boosters", h: 24 },
  { id: "id_card", n: "Scholar ID Card", d: "Ticket to change your player name.", p: 300, c: "Boosters" },
  { id: "gem", n: "Gem Pouch", d: "100 gems. Demo purchase.", cash: "$0.99", g: 100, c: "Gems", k: "gem1" },
  { id: "gem", n: "Gem Sack", d: "550 gems. Demo purchase.", cash: "$4.99", g: 550, c: "Gems", k: "gem2" },
  { id: "gem", n: "Gem Vault", d: "1200 gems. Demo purchase.", cash: "$9.99", g: 1200, c: "Gems", k: "gem3" },
];

IT.forEach((x) => {
  x.k = x.k || x.id;
});

interface StoreState {
  gems: number;
  lives: number;
  xp: number;
  name: string;
  shield: number;
  boost: number;
  inv: Record<string, number>;
}

const STORAGE_KEY = "techno_store_v1";

interface StorePageProps {
  diamonds?: number;
  onSpendDiamonds?: (amount: number) => boolean;
  onAddDiamonds?: (amount: number) => void;
  onAddXP?: (amount: number) => void;
  onActivateUnlimitedLives?: (hours: number) => void;
  onShowToast?: (msg: string) => void;
  themeColor?: string;
}

interface RewardItem {
  t: 'gems' | 'xp' | 'life' | 'shield' | 'boost' | 'item' | 'name';
  n?: number;
  h?: number;
  k?: string;
  i: string;
  l: string;
  c: string;
}

export const StorePage: React.FC<StorePageProps> = ({
  diamonds,
  onSpendDiamonds,
  onAddDiamonds,
  onAddXP,
  onActivateUnlimitedLives,
  onShowToast,
}) => {
  const { state: gamificationState, addDiamonds: addStoreDiamonds, addXp: addStoreXp } = useGamification();
  const { profile, updateProfile } = useEngagementStore();

  const [tab, setTab] = useState<1 | 2>(1); // 1: Store, 2: Inventory
  const [cat, setCat] = useState<string>("All");
  const [cur, setCur] = useState<StoreItem | null>(null);
  const [qty, setQty] = useState<number>(1);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [isToastActive, setIsToastActive] = useState<boolean>(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Busy flag ref to ignore taps while an animation plays
  const busyRef = useRef<boolean>(false);

  // Rename modal state for ID Card
  const [isRenameOpen, setIsRenameOpen] = useState<boolean>(false);
  const [renameInput, setRenameInput] = useState<string>("");

  const [storeState, setStoreState] = useState<StoreState>(() => {
    const defaultName = profile?.username || "Techno";
    const defaultState: StoreState = {
      gems: typeof diamonds === "number" ? diamonds : 1250,
      lives: 3,
      xp: gamificationState?.xp || 800,
      name: defaultName,
      shield: 0,
      boost: 0,
      inv: {},
    };

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...defaultState,
          ...parsed,
          gems: typeof diamonds === "number" ? diamonds : (parsed.gems ?? 1250),
          name: profile?.username || parsed.name || defaultName,
        };
      }
    } catch (e) {
      console.warn("Error reading store state from localStorage", e);
    }
    return defaultState;
  });

  // Display counters (D) for smooth flying particle incrementing
  const DRef = useRef<{ gems: number; lives: number; xp: number; shield: number; boost: number }>({
    gems: storeState.gems,
    lives: storeState.lives,
    xp: storeState.xp,
    shield: storeState.shield,
    boost: storeState.boost,
  });

  const [dispCounters, setDispCounters] = useState({
    gems: storeState.gems,
    lives: storeState.lives,
    xp: storeState.xp,
    shield: storeState.shield,
  });

  const syncDisplayValues = (st?: StoreState) => {
    const target = st || storeState;
    DRef.current.gems = target.gems;
    DRef.current.lives = target.lives;
    DRef.current.xp = target.xp;
    DRef.current.shield = target.shield;
    DRef.current.boost = target.boost;
    setDispCounters({
      gems: Math.round(target.gems),
      lives: target.lives,
      xp: Math.round(target.xp),
      shield: target.shield,
    });
  };

  const updateDisplayBar = () => {
    setDispCounters({
      gems: Math.round(DRef.current.gems),
      lives: DRef.current.lives,
      xp: Math.round(DRef.current.xp),
      shield: DRef.current.shield,
    });
  };

  // Sync external diamonds if changed
  useEffect(() => {
    if (typeof diamonds === "number" && diamonds !== storeState.gems) {
      setStoreState((prev) => {
        const next = { ...prev, gems: diamonds };
        DRef.current.gems = diamonds;
        setDispCounters((dc) => ({ ...dc, gems: Math.round(diamonds) }));
        return next;
      });
    }
  }, [diamonds]);

  // Sync external username if changed
  useEffect(() => {
    if (profile?.username && profile.username !== storeState.name) {
      setStoreState((prev) => ({ ...prev, name: profile.username }));
    }
  }, [profile?.username]);

  // Save to localStorage whenever storeState updates
  const saveState = (newState: StoreState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.warn("Error saving store state", e);
    }
  };

  const showInternalToast = (msg: string) => {
    setToastMessage(msg);
    setIsToastActive(true);
    if (onShowToast) onShowToast(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setIsToastActive(false);
    }, 2200);
  };

  // 2x XP Boost countdown tick
  const [boostRemaining, setBoostRemaining] = useState<string>("");
  const isBoostActive = storeState.boost > Date.now();

  const tickBoost = () => {
    const remainingMs = (DRef.current.boost || storeState.boost) - Date.now();
    if (remainingMs > 0) {
      const s = Math.floor(remainingMs / 1000);
      const pad = (n: number) => (n < 10 ? "0" : "") + n;
      const formatted = `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
      setBoostRemaining(formatted);
    } else {
      setBoostRemaining("");
    }
  };

  useEffect(() => {
    tickBoost();
    const interval = setInterval(tickBoost, 1000);
    return () => clearInterval(interval);
  }, [storeState.boost]);

  const openSheet = (item: StoreItem) => {
    if (busyRef.current) return;
    setCur(item);
    setQty(1);
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  // Buy item flow
  const handleBuy = () => {
    if (busyRef.current || !cur) return;
    const x = cur;
    const itemKey = x.k || x.id;

    if (x.g) {
      // Demo cash purchase
      const addedGems = x.g * qty;
      const updatedGems = storeState.gems + addedGems;
      const updated: StoreState = { ...storeState, gems: updatedGems };
      setStoreState(updated);
      saveState(updated);
      syncDisplayValues(updated);
      if (onAddDiamonds) onAddDiamonds(addedGems);
      else if (addStoreDiamonds) addStoreDiamonds(addedGems);
      showInternalToast(`+${addedGems} gems added`);
    } else {
      const totalCost = (x.p || 0) * qty;
      if (storeState.gems < totalCost) {
        showInternalToast("Not enough gems");
        return;
      }
      if (onSpendDiamonds && !onSpendDiamonds(totalCost)) {
        showInternalToast("Transaction failed");
        return;
      }
      const updatedGems = storeState.gems - totalCost;
      const updatedInv = { ...storeState.inv, [itemKey]: (storeState.inv[itemKey] || 0) + qty };
      const updated: StoreState = { ...storeState, gems: updatedGems, inv: updatedInv };
      setStoreState(updated);
      saveState(updated);
      syncDisplayValues(updated);
      showInternalToast(`${qty} × ${x.n} added to inventory`);
    }

    closeSheet();
  };

  // Helper random
  const rnd = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));

  // ---------------------------------------------------------------------------
  // ANIMATION SYSTEM HELPERS
  // ---------------------------------------------------------------------------
  const W = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const E = (cls: string, html?: string, css?: string, par?: HTMLElement): HTMLElement => {
    const e = document.createElement('div');
    e.className = cls;
    if (html) e.innerHTML = html;
    if (css) e.style.cssText = css;
    const target = par || document.getElementById('fx-stg');
    if (target) target.appendChild(e);
    return e;
  };

  const A = (e: HTMLElement, kf: PropertyIndexedKeyframes | Keyframe[], o?: KeyframeAnimationOptions): Promise<Animation> => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const opts: KeyframeAnimationOptions = Object.assign({ fill: 'forwards', easing: 'ease-out' }, o);
    if (reducedMotion && opts.duration && typeof opts.duration === 'number') {
      opts.duration = Math.max(100, Math.floor(opts.duration / 2));
    }
    return e.animate(kf, opts).finished;
  };

  const big = (id: string, w?: number, src?: string): HTMLElement => {
    return E('fx-abs', '<div class="fx-big" style="width:' + (w || 62) + '%">' + (src || ICONS[id] || '') + '</div>');
  };

  const flashEffect = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;
    const f = E('fx-flash');
    A(f, [{ opacity: 0.9 }, { opacity: 0 }], { duration: 550 }).then(() => f.remove());
  };

  const ringEffect = (c: string, d?: number) => {
    const r = E('fx-ring', '', '--c:' + c);
    A(r, [{ transform: 'scale(.5)', opacity: 0.95 }, { transform: 'scale(7)', opacity: 0 }], { duration: 1000, delay: d || 0, fill: 'both' }).then(() => r.remove());
  };

  const burstEffect = (n: number, cols: string[], R: number, sz: number, icon?: string) => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const count = reducedMotion ? Math.max(4, Math.floor(n / 3)) : n;
    for (let i = 0; i < count; i++) {
      (function(idx) {
        const a = Math.random() * 6.28;
        const r = R * (0.4 + Math.random() * 0.8);
        const c = cols[idx % cols.length];
        const d = E(
          'fx-dot',
          icon ? ICONS[icon] : '',
          'width:' + sz + 'px;height:' + sz + 'px;' + (icon ? '' : 'background:' + c + ';box-shadow:0 0 8px ' + c)
        );
        A(d, [
          { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
          { transform: 'translate(calc(-50% + ' + Math.cos(a) * r + 'px),calc(-50% + ' + (Math.sin(a) * r - (icon ? 40 : 0)) + 'px)) scale(.2)', opacity: 0 }
        ], { duration: 700 + Math.random() * 600 }).then(() => d.remove());
      })(i);
    }
  };

  const createCards = (rw: RewardItem[]): HTMLElement => {
    const c = E('fx-cards');
    rw.forEach((r, i) => {
      const d = E('fx-rc', ic(r.i, 52) + '<b>' + r.l + '</b>', '--c:' + r.c, c);
      A(d, [
        { transform: 'translateY(70px) scale(.2) rotate(' + (i % 2 ? 25 : -25) + 'deg)', opacity: 0 },
        { transform: 'translateY(-14px) scale(1.12) rotate(0)', opacity: 1, offset: 0.7 },
        { transform: 'none', opacity: 1 }
      ], { duration: 650, delay: i * 180, easing: 'cubic-bezier(.3,1.3,.5,1)', fill: 'both' });
    });
    return c;
  };

  const holdEffect = (ms: number, overlay: HTMLElement): Promise<void> => {
    return new Promise((r) => {
      const t = setTimeout(done, ms);
      function done() {
        clearTimeout(t);
        overlay.removeEventListener('click', done);
        r();
      }
      overlay.addEventListener('click', done);
    });
  };

  const revealRewards = async (rw: RewardItem[], overlay: HTMLElement, cap: HTMLElement, txt?: string): Promise<HTMLElement> => {
    cap.textContent = 'You got';
    const c = createCards(rw);
    await W(rw.length * 180 + 700);
    cap.textContent = txt || 'Tap to collect';
    await holdEffect(2600, overlay);
    return c;
  };

  // ---------------------------------------------------------------------------
  // ANIMATIONS PER ITEM TYPE
  // ---------------------------------------------------------------------------
  const animChest = async (x: StoreItem, rw: RewardItem[], overlay: HTMLElement, stg: HTMLElement, cap: HTMLElement) => {
    const lv = { chest_silver: 0, chest_gold: 1, chest_deluxe: 2 }[x.id] || 0;
    const col = ['#BBD3F0', '#FFC62E', '#7DF3FF'][lv];
    const rays = E('fx-rays', '', '--c:' + col);
    const glow = E('fx-glow', '', '--c:' + col);
    const b = big(x.id, 66);
    if (lv === 2) {
      rays.style.animation = 'fx-spin 8s linear infinite, fx-hue 3s linear infinite';
      glow.style.animation = 'fx-hue 3s linear infinite';
    }
    cap.textContent = x.n;
    A(b, [{ transform: 'translateY(-240px) scale(.6)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 600, easing: 'cubic-bezier(.3,1.5,.5,1)' });
    await W(650);
    A(glow, [{ opacity: 0 }, { opacity: 0.75 }], { duration: 1500 });
    const s = [3, 5, 7, 10][lv];
    const kf = [];
    for (let i = 0; i < 8; i++) {
      kf.push({ transform: 'rotate(' + ((i % 2 ? 1 : -1) * s * (i + 1) / 6) + 'deg) scale(' + (1 + i * 0.03) + ')' });
    }
    await A(b, kf, { duration: 1300 + lv * 300, easing: 'linear' });
    flashEffect();
    ringEffect(col);
    ringEffect('#fff', 120);
    if (lv > 0) ringEffect(col, 260);
    if (lv > 1) {
      ringEffect('#fff', 400);
      A(stg, [{ transform: 'translate(0,0)' }, { transform: 'translate(-10px,8px)' }, { transform: 'translate(10px,-8px)' }, { transform: 'translate(0,0)' }], { duration: 350 });
    }
    burstEffect([26, 44, 76][lv], [col, '#fff', lv === 1 ? '#FFE27A' : '#9CFFF2'], 220 + lv * 40, 8);
    A(b, [{ transform: 'scale(1.25)', opacity: 1 }, { transform: 'scale(2.2)', opacity: 0 }], { duration: 500 });
    A(rays, [{ opacity: 0 }, { opacity: 0.7 }], { duration: 400 });
    A(glow, [{ opacity: 0.75, transform: 'scale(1)' }, { opacity: 1, transform: 'scale(1.25)' }], { duration: 500 });
    await W(450);
    return await revealRewards(rw, overlay, cap);
  };

  const animWheel = async (x: StoreItem, rw: RewardItem[], overlay: HTMLElement, stg: HTMLElement, cap: HTMLElement) => {
    const col = '#4FA3FF';
    const rays = E('fx-rays', '', '--c:' + col);
    const glow = E('fx-glow', '', '--c:' + col);
    const wheelSrc = ICONS.wheel.replace(/<polygon points="26,1[^>]*>/, '');
    const b = big('wheel', 72, wheelSrc);
    const pt = E(
      'fx-abs',
      '<svg viewBox="0 0 24 30" style="width:28px"><polygon points="2,2 22,2 12,26" fill="#FFE27A" stroke="#8a5a00" stroke-width="2" stroke-linejoin="round"/></svg>',
      'position:absolute;left:50%;top:3%;width:28px;margin-left:-14px;z-index:3;transform-origin:50% 20%'
    );
    cap.textContent = 'Spin!';
    A(glow, [{ opacity: 0 }, { opacity: 0.5 }], { duration: 800 });
    A(b, [{ transform: 'scale(.3) rotate(0)', opacity: 0 }, { transform: 'scale(1) rotate(0)', opacity: 1 }], { duration: 500 });
    await W(500);
    A(pt, [{ transform: 'rotate(0)' }, { transform: 'rotate(-22deg)' }, { transform: 'rotate(0)' }], { duration: 170, iterations: 22 });
    await A(b, [{ transform: 'rotate(0)' }, { transform: 'rotate(' + (360 * 5 + rnd(0, 359)) + 'deg)' }], { duration: 3800, easing: 'cubic-bezier(.12,.6,.1,1)' });
    flashEffect();
    ringEffect(col);
    burstEffect(36, [col, '#fff', '#FFE27A'], 240, 8);
    A(rays, [{ opacity: 0 }, { opacity: 0.6 }], { duration: 400 });
    A(b, [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(1.6)', opacity: 0 }], { duration: 500 });
    pt.remove();
    await W(450);
    return await revealRewards(rw, overlay, cap);
  };

  const animPotion = async (x: StoreItem, rw: RewardItem[], overlay: HTMLElement, stg: HTMLElement, cap: HTMLElement) => {
    const fl = x.id === 'flask';
    const cs = fl ? ['#8EC5FF', '#0057E7', '#fff'] : ['#7DFFE0', '#00A8FF', '#FF9DE6'];
    const col = cs[0];
    const glow = E('fx-glow', '', '--c:' + col);
    const b = big(x.id, 56);
    if (!fl) glow.style.animation = 'fx-hue 3s linear infinite';
    cap.textContent = x.n;
    A(glow, [{ opacity: 0 }, { opacity: fl ? 0.35 : 0.7 }], { duration: 1400 });
    A(b, [{ transform: 'translateY(-220px) scale(.7)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 550, easing: 'cubic-bezier(.3,1.5,.5,1)' });
    await W(600);
    const cr = E('fx-abs', '<svg viewBox="0 0 64 64" style="width:56%;opacity:0"><path d="M32 16 L28 27 L36 33 L30 45 L34 55 M28 27 L20 31 M36 33 L45 36" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>');
    setTimeout(() => {
      if (cr && cr.firstChild) (cr.firstChild as HTMLElement).style.opacity = '1';
    }, 800);
    const kf = [];
    for (let i = 0; i < 12; i++) {
      kf.push({ transform: 'translate(' + ((i % 2 ? 1 : -1) * (i + 1) * 1.2) + 'px,0) rotate(' + ((i % 2 ? 1 : -1) * (i + 1) * 1.4) + 'deg)' });
    }
    await A(b, kf, { duration: 1500, easing: 'linear' });
    b.style.visibility = 'hidden';
    cr.remove();
    flashEffect();
    ringEffect(col);
    if (!fl) {
      ringEffect('#fff', 150);
      burstEffect(30, cs, 230, 7);
    }
    for (let i = 0; i < 16; i++) {
      (function() {
        const a = Math.random() * 6.28;
        const dx = Math.cos(a) * (80 + Math.random() * 120);
        const dy = Math.sin(a) * (60 + Math.random() * 80) - 70;
        const p = [[0, 0], [50, 0], [100, 30], [30, 100]].slice(0, 3 + rnd(0, 1)).map((q) => (q[0] + rnd(-15, 15)) + '% ' + (q[1] + rnd(-5, 15)) + '%').join(',');
        const sh = E('fx-shard', '', 'background:linear-gradient(135deg,' + cs[0] + ',' + cs[1] + ');clip-path:polygon(' + p + ');opacity:.95');
        A(sh, [
          { transform: 'translate(-50%,-50%) rotate(0)', opacity: 1 },
          { transform: 'translate(calc(-50% + ' + dx + 'px),calc(-50% + ' + dy + 'px)) rotate(' + rnd(-300, 300) + 'deg)', opacity: 1, offset: 0.4 },
          { transform: 'translate(calc(-50% + ' + (dx * 1.4) + 'px),calc(-50% + ' + (dy + 300) + 'px)) rotate(' + rnd(-600, 600) + 'deg)', opacity: 0 }
        ], { duration: 1200, easing: 'ease-in' }).then(() => sh.remove());
      })();
    }
    burstEffect(14, [cs[1], cs[0], '#fff'], 150, 12);
    await W(500);
    return await revealRewards(rw, overlay, cap);
  };

  const animHeart = async (x: StoreItem, rw: RewardItem[], overlay: HTMLElement, stg: HTMLElement, cap: HTMLElement) => {
    const col = '#FF4B5C';
    const glow = E('fx-glow', '', '--c:' + col);
    const b = big('heart', 54);
    cap.textContent = 'Life restored';
    A(b, [{ transform: 'scale(0)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 500, easing: 'cubic-bezier(.3,1.6,.5,1)' });
    A(glow, [{ opacity: 0 }, { opacity: 0.7 }], { duration: 1500 });
    await W(600);
    for (let i = 1; i <= 3; i++) {
      ringEffect(col, 0);
      burstEffect(6 * i, [col], 110 + i * 20, 26, 'heart');
      await A(b, [{ transform: 'scale(1)' }, { transform: 'scale(' + (1 + i * 0.14) + ')' }, { transform: 'scale(1)' }], { duration: 480, easing: 'ease-in-out' });
    }
    flashEffect();
    ringEffect('#fff');
    burstEffect(30, [col, '#FFB3BA', '#fff'], 220, 8);
    await W(300);
    A(b, [{ transform: 'scale(1.4)', opacity: 1 }, { transform: 'scale(1.9)', opacity: 0 }], { duration: 400 });
    return await revealRewards(rw, overlay, cap);
  };

  const animShield = async (x: StoreItem, rw: RewardItem[], overlay: HTMLElement, stg: HTMLElement, cap: HTMLElement) => {
    const col = '#4FA3FF';
    const dome = E('fx-dome');
    const b = big('shield_streak', 58);
    cap.textContent = 'Streak protected';
    await A(b, [{ transform: 'scale(4.5)', opacity: 0 }, { transform: 'scale(.92)', opacity: 1, offset: 0.7 }, { transform: 'scale(1)', opacity: 1 }], { duration: 750, easing: 'cubic-bezier(.5,0,.9,.6)' });
    A(stg, [{ transform: 'translate(0,0)' }, { transform: 'translate(-9px,7px)' }, { transform: 'translate(9px,-7px)' }, { transform: 'translate(0,0)' }], { duration: 320 });
    ringEffect(col);
    ringEffect('#fff', 140);
    ringEffect(col, 280);
    flashEffect();
    burstEffect(34, [col, '#fff', '#9CFFF2'], 230, 8);
    A(dome, [{ transform: 'scale(.2)', opacity: 0.9 }, { transform: 'scale(5)', opacity: 0 }], { duration: 1300 });
    await A(b, [{ transform: 'scale(1)', filter: 'brightness(1)' }, { transform: 'scale(1.15)', filter: 'brightness(1.6)' }, { transform: 'scale(1)', filter: 'brightness(1)' }], { duration: 800 });
    return await revealRewards(rw, overlay, cap);
  };

  const animStone = async (x: StoreItem, rw: RewardItem[], overlay: HTMLElement, stg: HTMLElement, cap: HTMLElement) => {
    const col = { time_1h: '#7DF3FF', time_3h: '#6FB4FF', time_24h: '#8A9BFF' }[x.id] || '#7DF3FF';
    const glow = E('fx-glow', '', '--c:' + col);
    const rg = E('fx-abs', '<svg viewBox="0 0 100 100" style="width:92%"><circle cx="50" cy="50" r="46" fill="none" stroke="' + col + '" stroke-width="3" stroke-linecap="round" stroke-dasharray="289" stroke-dashoffset="289" transform="rotate(-90 50 50)"/></svg>');
    const b = big(x.id, 54);
    cap.textContent = x.n;
    A(glow, [{ opacity: 0 }, { opacity: 0.6 }], { duration: 1500 });
    A(b, [{ transform: 'translateY(-200px) scale(.5)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 550, easing: 'cubic-bezier(.3,1.5,.5,1)' });
    await W(550);
    if (rg && rg.firstChild && rg.firstChild.firstChild) {
      (rg.firstChild.firstChild as HTMLElement).animate([{ strokeDashoffset: '289' }, { strokeDashoffset: '0' }], { duration: 1700, fill: 'forwards', easing: 'ease-in-out' });
    }
    setTimeout(() => {
      burstEffect(14, [col, '#fff'], 130, 7);
      burstEffect(6, [col], 120, 22, 'xp');
    }, 800);
    await A(b, [{ transform: 'perspective(600px) rotateY(0) scale(1)' }, { transform: 'perspective(600px) rotateY(1080deg) scale(1.18)' }], { duration: 1800, easing: 'cubic-bezier(.3,.1,.2,1)' });
    flashEffect();
    ringEffect(col);
    ringEffect('#fff', 140);
    burstEffect(32, [col, '#fff'], 230, 8);
    const t = E('fx-abs', '<div style="font-weight:900;font-size:4.5rem;color:#fff;text-shadow:0 0 30px ' + col + '">2×</div>');
    A(t, [{ transform: 'scale(0)', opacity: 0 }, { transform: 'scale(1.3)', opacity: 1, offset: 0.5 }, { transform: 'scale(1)', opacity: 1 }], { duration: 600, easing: 'cubic-bezier(.3,1.5,.5,1)' });
    A(b, [{ transform: 'scale(1.18)', opacity: 1 }, { transform: 'scale(.7)', opacity: 0 }], { duration: 500 });
    await W(900);
    A(t, [{ opacity: 1 }, { opacity: 0 }], { duration: 300 });
    await W(300);
    return await revealRewards(rw, overlay, cap);
  };

  const animIdCard = async (x: StoreItem, rw: RewardItem[], overlay: HTMLElement, stg: HTMLElement, cap: HTMLElement) => {
    const col = '#FFE27A';
    const glow = E('fx-glow', '', '--c:' + col);
    const b = big('id_card', 72);
    cap.textContent = 'Name changed';
    A(glow, [{ opacity: 0 }, { opacity: 0.55 }], { duration: 1500 });
    await A(b, [
      { transform: 'translateY(220px) perspective(700px) rotateY(0) scale(.5)', opacity: 0 },
      { transform: 'translateY(0) perspective(700px) rotateY(360deg) scale(1.15)', opacity: 1, offset: 0.6 },
      { transform: 'translateY(-8px) perspective(700px) rotateY(720deg) scale(1)', opacity: 1 }
    ], { duration: 1700, easing: 'cubic-bezier(.3,.8,.3,1)' });
    flashEffect();
    ringEffect(col);
    burstEffect(28, [col, '#fff', '#4FA3FF'], 220, 8);
    await W(300);
    A(b, [{ opacity: 1 }, { opacity: 0 }], { duration: 300 });
    return await revealRewards(rw, overlay, cap);
  };

  // Generate reward items
  const computeRewards = (x: StoreItem, nm?: string): RewardItem[] => {
    const r: RewardItem[] = [];
    const addGems = (n: number) => {
      r.push({ t: 'gems', n: n, i: 'gem', l: '+' + n + ' Gems', c: '#4FA3FF' });
    };
    const addXp = (n: number, c?: string) => {
      r.push({ t: 'xp', n: n, i: 'xp', l: '+' + n + ' XP', c: c || '#FFC62E' });
    };

    if (x.r) {
      addGems(rnd(x.r[0], x.r[1]));
      if (x.id === 'chest_gold') addXp(rnd(20, 60));
      if (x.id === 'chest_deluxe') {
        addXp(rnd(50, 150), '#7DF3FF');
        const p = ['time_1h', 'heart', 'shield_streak', 'flask'][rnd(0, 3)];
        const it = IT.find((y) => y.id === p) || IT[0];
        r.push({ t: 'item', k: it.k, i: it.id, l: it.n, c: '#9CFFF2' });
      }
    } else if (x.xp) {
      addXp(x.xp, '#4FA3FF');
    } else if (x.id === 'heart') {
      r.push({ t: 'life', n: 1, i: 'heart', l: '+1 Life', c: '#FF4B5C' });
    } else if (x.id === 'shield_streak') {
      r.push({ t: 'shield', n: 1, i: 'shield_streak', l: 'Streak Shield', c: '#4FA3FF' });
    } else if (x.h) {
      r.push({ t: 'boost', h: x.h, i: x.id, l: '2× XP · ' + x.h + 'H', c: '#7DF3FF' });
    } else {
      r.push({ t: 'name', i: 'id_card', l: nm || 'New Name', c: '#FFE27A' });
    }
    return r;
  };

  // Fly particles to target selectors
  const flyParticle = (id: string, f: { x: number; y: number }, sel: string, n: number, sz: number, cb: () => void): Promise<void[]> => {
    const ps: Promise<void>[] = [];
    for (let i = 0; i < n; i++) {
      ps.push(new Promise((res) => {
        const p = document.createElement('div');
        p.className = 'fx-fl';
        p.style.cssText = 'width:' + sz + 'px;height:' + sz + 'px';
        p.innerHTML = ICONS[id] || '';
        document.body.appendChild(p);

        const targetElem = document.querySelector(sel);
        if (!targetElem) {
          p.remove();
          cb();
          res();
          return;
        }
        const rect = targetElem.getBoundingClientRect();
        const tx = rect.left + rect.width / 2 - sz / 2;
        const ty = rect.top + rect.height / 2 - sz / 2;
        const sx = f.x - sz / 2;
        const sy = f.y - sz / 2;
        const a = Math.random() * 6.28;
        const dist = 40 + Math.random() * 70;
        const mx = sx + Math.cos(a) * dist;
        const my = sy + Math.sin(a) * dist;

        p.animate([
          { transform: 'translate(' + sx + 'px,' + sy + 'px) scale(.4)', opacity: 0 },
          { transform: 'translate(' + mx + 'px,' + my + 'px) scale(1.25)', opacity: 1, offset: 0.25, easing: 'cubic-bezier(.5,0,.9,.5)' },
          { transform: 'translate(' + tx + 'px,' + ty + 'px) scale(.5)', opacity: 1 }
        ], {
          duration: 1000 + Math.random() * 300,
          delay: i * 70,
          fill: 'both',
          easing: 'ease-out'
        }).finished.then(() => {
          p.remove();
          cb();
          const t = document.querySelector(sel);
          if (t) {
            t.classList.remove('fx-bump');
            void (t as HTMLElement).offsetWidth;
            t.classList.add('fx-bump');
          }
          res();
        }).catch(() => {
          p.remove();
          cb();
          res();
        });
      }));
    }
    return Promise.all(ps);
  };

  const collectRewards = async (rw: RewardItem[], cd: HTMLElement, overlay: HTMLElement, cap: HTMLElement) => {
    const cs = Array.from(cd.children) as HTMLElement[];
    const fr = cs.map((c) => {
      const rect = c.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    });
    overlay.classList.add('fx-out');
    cap.style.opacity = '0';
    cs.forEach((c) => {
      A(c, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.4)' }], { duration: 350 });
    });
    await W(250);

    const ps: Promise<void[]>[] = [];
    rw.forEach((r, i) => {
      const f = fr[i];
      let numParticles = 1;
      if (r.t === 'gems' && r.n) {
        numParticles = Math.min(14, Math.max(5, Math.round(r.n / 15)));
        const increment = r.n / numParticles;
        ps.push(flyParticle('gem', f, '#pg', numParticles, 34, () => {
          DRef.current.gems += increment;
          updateDisplayBar();
        }));
      } else if (r.t === 'xp' && r.n) {
        numParticles = Math.min(10, Math.max(4, Math.round(r.n / 15)));
        const increment = r.n / numParticles;
        ps.push(flyParticle('xp', f, '#px', numParticles, 34, () => {
          DRef.current.xp += increment;
          updateDisplayBar();
        }));
      } else if (r.t === 'life') {
        ps.push(flyParticle('heart', f, '#ph', 1, 44, () => {
          DRef.current.lives = Math.min(5, DRef.current.lives + 1);
          updateDisplayBar();
        }));
      } else if (r.t === 'shield') {
        ps.push(flyParticle('shield_streak', f, '#ps', 1, 46, () => {
          DRef.current.shield += 1;
          updateDisplayBar();
        }));
      } else if (r.t === 'boost' && r.h) {
        DRef.current.boost = Math.max(Date.now(), DRef.current.boost) + r.h * 3600000;
        tickBoost();
        ps.push(flyParticle(r.i, f, '#bst', 1, 46, () => {}));
      } else if (r.t === 'item') {
        ps.push(flyParticle(r.i, f, '#t2', 1, 40, () => {}));
      } else if (r.t === 'name') {
        ps.push(flyParticle('id_card', f, '#who', 1, 40, () => {
          updateDisplayBar();
        }));
      }
    });
    await Promise.all(ps);
  };

  // Main Item Use Flow with Animation System
  const handleUse = async () => {
    if (busyRef.current || !cur) return;
    const x = cur;
    const itemKey = x.k || x.id;
    const currentQty = storeState.inv[itemKey] || 0;

    if (currentQty <= 0) {
      closeSheet();
      return;
    }

    // Rule Check 1: Heart refill block if lives are full (>= 5)
    if (x.id === 'heart' && storeState.lives >= 5) {
      showInternalToast("Lives already full");
      return;
    }

    // Rule Check 1: ID Card asks for new name first
    let newName = '';
    if (x.id === 'id_card') {
      const prompted = prompt("New player name", storeState.name);
      if (!prompted || !prompted.trim()) return;
      newName = prompted.trim().slice(0, 14);
    }

    busyRef.current = true;
    closeSheet();

    // Consume item & compute rewards
    const nextInv = { ...storeState.inv, [itemKey]: currentQty - 1 };
    let updatedGems = storeState.gems;
    let updatedXp = storeState.xp;
    let updatedLives = storeState.lives;
    let updatedShield = storeState.shield;
    let updatedBoost = storeState.boost;
    let updatedName = storeState.name;

    const rw = computeRewards(x, newName);

    rw.forEach((v) => {
      if (v.t === 'gems' && v.n) {
        updatedGems += v.n;
        if (onAddDiamonds) onAddDiamonds(v.n);
        else if (addStoreDiamonds) addStoreDiamonds(v.n);
      } else if (v.t === 'xp' && v.n) {
        updatedXp += v.n;
        if (onAddXP) onAddXP(v.n);
        else if (addStoreXp) addStoreXp(v.n);
      } else if (v.t === 'life') {
        updatedLives = Math.min(5, updatedLives + 1);
      } else if (v.t === 'shield') {
        updatedShield += 1;
      } else if (v.t === 'boost' && v.h) {
        updatedBoost = Math.max(Date.now(), updatedBoost) + v.h * 3600000;
        if (onActivateUnlimitedLives) onActivateUnlimitedLives(v.h);
      } else if (v.t === 'item' && v.k) {
        nextInv[v.k] = (nextInv[v.k] || 0) + 1;
      } else if (v.t === 'name') {
        updatedName = newName;
        if (updateProfile) updateProfile({ username: newName });
      }
    });

    const updatedState: StoreState = {
      gems: updatedGems,
      lives: updatedLives,
      xp: updatedXp,
      name: updatedName,
      shield: updatedShield,
      boost: updatedBoost,
      inv: nextInv,
    };

    saveState(updatedState);
    setStoreState(updatedState);

    // Dark fullscreen overlay execution
    const overlay = document.getElementById('fx-overlay');
    const stg = document.getElementById('fx-stg');
    const cap = document.getElementById('fx-cap');

    if (overlay && stg && cap) {
      overlay.className = 'fx-overlay fx-on';
      stg.innerHTML = '';
      cap.style.opacity = '1';
      cap.textContent = '';

      const fn = (x.id === 'wheel') ? animWheel
        : (x.r ? animChest
        : (x.xp ? animPotion
        : (x.id === 'heart' ? animHeart
        : (x.id === 'shield_streak' ? animShield
        : (x.h ? animStone : animIdCard)))));

      try {
        const cd = await fn(x, rw, overlay, stg, cap);
        await collectRewards(rw, cd, overlay, cap);
      } catch (err) {
        console.warn("Item use animation error:", err);
      } finally {
        overlay.className = 'fx-overlay';
        stg.innerHTML = '';
        syncDisplayValues(updatedState);
        busyRef.current = false;
      }
    } else {
      syncDisplayValues(updatedState);
      busyRef.current = false;
    }
  };

  const handleConfirmRename = () => {
    const trimmed = renameInput.trim().slice(0, 14);
    if (!trimmed) return;
    const itemKey = "id_card";
    const currentQty = storeState.inv[itemKey] || 0;
    if (currentQty <= 0) return;

    const nextInv = { ...storeState.inv, [itemKey]: currentQty - 1 };
    const updated: StoreState = {
      ...storeState,
      name: trimmed,
      inv: nextInv,
    };
    setStoreState(updated);
    saveState(updated);
    if (updateProfile) updateProfile({ username: trimmed });
    showInternalToast(`Name changed to @${trimmed}`);
    setIsRenameOpen(false);
    closeSheet();
  };

  const categories = ["All", "Chests", "Potions", "Boosters", "Gems"];

  // Filter items
  const filteredItems = IT.filter((x) => cat === "All" || x.c === cat);
  const ownedItems = IT.filter((x) => (storeState.inv[x.k || x.id] || 0) > 0);

  const sanitizedHandle = storeState.name.toLowerCase().replace(/\s+/g, "");

  return (
    <div className="scholar-store-root w-full min-h-screen bg-[#0C0C0C] text-[#D7E2EA] font-['Kanit',sans-serif] selection:bg-[#1D6BFF] selection:text-white select-none">
      <style>{`
        .scholar-store-root {
          --fg: #D7E2EA;
          --b2: #4FA3FF;
          box-sizing: border-box;
        }
        .scholar-store-main {
          max-width: 520px;
          margin: 0 auto;
          padding: 16px 16px 80px;
          overflow-x: clip;
        }
        .scholar-hh {
          background: linear-gradient(180deg, #646973, #BBCCD7);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 900;
          text-transform: uppercase;
          line-height: 1;
          letter-spacing: -0.025em;
        }
        .scholar-bar {
          display: flex;
          gap: 8px;
          position: sticky;
          top: 0;
          z-index: 20;
          background: rgba(12, 12, 12, 0.92);
          backdrop-filter: blur(8px);
          padding: 10px 0;
        }
        .scholar-pill {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border: 2px solid rgba(215, 226, 234, 0.35);
          border-radius: 999px;
          padding: 6px 8px;
          font-weight: 700;
          background: #111418;
          font-size: 0.95rem;
        }
        .scholar-pill.g {
          border-color: #1D6BFF;
          color: #4FA3FF;
        }
        .scholar-title {
          font-size: clamp(3rem, 15vw, 5rem);
          margin: 18px 0 4px;
        }
        .scholar-sub {
          font-weight: 300;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-size: 0.8rem;
          opacity: 0.7;
        }
        .scholar-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          border: 2px solid rgba(215, 226, 234, 0.35);
          border-radius: 999px;
          padding: 5px;
          margin: 20px 0 14px;
        }
        .scholar-tabs button {
          border: 0;
          background: none;
          border-radius: 999px;
          padding: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.85rem;
          color: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .scholar-tabs button.on {
          background: linear-gradient(123deg, #010B1F 7%, #0057E7 37%, #1D6BFF 72%, #4FA3FF 100%);
          box-shadow: 4px 4px 12px #2170F1 inset;
          color: #fff;
        }
        .scholar-chips {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 6px;
          margin-bottom: 12px;
          scrollbar-width: none;
        }
        .scholar-chips::-webkit-scrollbar {
          display: none;
        }
        .scholar-chip {
          flex: none;
          border: 2px solid rgba(215, 226, 234, 0.35);
          background: none;
          border-radius: 999px;
          padding: 7px 16px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.75rem;
          color: inherit;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .scholar-chip.on {
          background: #D7E2EA;
          color: #0C0C0C;
          border-color: #D7E2EA;
          font-weight: 700;
        }
        .scholar-boost {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 2px solid #1D6BFF;
          background: #06142e;
          border-radius: 28px;
          padding: 10px 16px;
          margin-bottom: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-size: 0.8rem;
        }
        .scholar-boost b {
          margin-left: auto;
          color: #4FA3FF;
          font-variant-numeric: tabular-nums;
        }
        .scholar-feat {
          border: 2px solid #4FA3FF;
          border-radius: 40px;
          padding: 20px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          background: radial-gradient(circle at 20% 30%, #0a2a66, #06090f);
          box-shadow: 0 0 40px rgba(29, 107, 255, 0.25);
          cursor: pointer;
        }
        .scholar-feat small {
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #4FA3FF;
          font-weight: 600;
        }
        .scholar-feat h3 {
          font-weight: 800;
          text-transform: uppercase;
          font-size: 1.3rem;
          line-height: 1.1;
          margin: 2px 0 10px;
        }
        .scholar-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .scholar-sec {
          grid-column: 1 / -1;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.9rem;
          opacity: 0.8;
          margin-top: 10px;
        }
        .scholar-card {
          border: 2px solid rgba(215, 226, 234, 0.4);
          border-radius: 32px;
          padding: 14px;
          background: #0f1216;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 6px;
          position: relative;
          cursor: pointer;
          transition: transform 0.15s ease, border-color 0.2s ease;
        }
        .scholar-card:hover {
          border-color: rgba(79, 163, 255, 0.7);
        }
        .scholar-card .art {
          width: 100%;
          aspect-ratio: 1.2;
          display: grid;
          place-items: center;
          border-radius: 22px;
          background: radial-gradient(circle at 50% 40%, #0a1a3d, #06090f);
        }
        .scholar-card b {
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 0.03em;
          line-height: 1.2;
        }
        .scholar-card small {
          font-weight: 300;
          opacity: 0.65;
          font-size: 0.72rem;
          line-height: 1.35;
          min-height: 2.7em;
        }
        .scholar-own {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #1D6BFF;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 9px;
          color: #fff;
        }
        .scholar-price {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-weight: 700;
          font-size: 1rem;
          color: #fff;
          border-radius: 999px;
          padding: 8px 16px;
          width: 100%;
          border: 0;
          background: linear-gradient(123deg, #010B1F 7%, #0057E7 37%, #1D6BFF 72%, #4FA3FF 100%);
          box-shadow: 0 4px 4px rgba(1, 87, 231, 0.25), 4px 4px 12px #2170F1 inset;
          outline: 2px solid #fff;
          outline-offset: -3px;
          cursor: pointer;
        }
        .scholar-price.use {
          background: none;
          box-shadow: none;
          outline: 0;
          border: 2px solid #D7E2EA;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.8rem;
        }
        .scholar-empty {
          grid-column: 1 / -1;
          text-align: center;
          border: 2px solid rgba(215, 226, 234, 0.4);
          border-radius: 40px;
          padding: 36px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .scholar-empty h4 {
          font-size: 1.4rem;
          text-transform: uppercase;
          font-weight: 700;
        }
        .scholar-empty p {
          font-weight: 300;
          opacity: 0.8;
          line-height: 1.6;
          font-size: 0.95rem;
        }
        .scholar-bd {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          z-index: 50;
        }
        .scholar-sheet {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          max-width: 520px;
          margin: 0 auto;
          z-index: 60;
          background: #fff;
          color: #0C0C0C;
          border-radius: 40px 40px 0 0;
          padding: 26px 22px 36px;
          text-align: center;
          box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.6);
          animation: slideUp 0.35s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
        }
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .scholar-sheet .art {
          width: 150px;
          height: 150px;
          margin: 0 auto 6px;
          border-radius: 32px;
          display: grid;
          place-items: center;
          background: radial-gradient(circle, #0a1a3d, #06090f);
        }
        .scholar-sheet h3 {
          font-weight: 900;
          text-transform: uppercase;
          font-size: 1.6rem;
        }
        .scholar-sheet p {
          font-weight: 300;
          line-height: 1.5;
          margin: 6px 0 14px;
          opacity: 0.75;
        }
        .scholar-qty {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 18px;
          margin-bottom: 14px;
        }
        .scholar-qty button {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid #0C0C0C;
          background: none;
          font-size: 1.4rem;
          font-weight: 700;
          cursor: pointer;
        }
        .scholar-qty b {
          font-size: 1.6rem;
          min-width: 2ch;
        }
        .scholar-tot {
          display: flex;
          justify-content: center;
          gap: 8px;
          align-items: center;
          font-weight: 700;
          margin-bottom: 14px;
          font-size: 1.1rem;
        }
        .scholar-sheet .go {
          width: 100%;
          border: 0;
          border-radius: 999px;
          padding: 15px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #fff;
          background: linear-gradient(123deg, #010B1F 7%, #0057E7 37%, #1D6BFF 72%, #4FA3FF 100%);
          box-shadow: 4px 4px 12px #2170F1 inset;
          cursor: pointer;
        }
        .scholar-sheet .go:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .scholar-sheet .no {
          color: #c0182b;
          font-weight: 600;
          font-size: 0.85rem;
          margin-bottom: 10px;
        }
        .scholar-toast {
          position: fixed;
          left: 50%;
          bottom: 28px;
          transform: translate(-50%, 0);
          background: #D7E2EA;
          color: #0C0C0C;
          font-weight: 600;
          border-radius: 999px;
          padding: 10px 22px;
          z-index: 80;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.78rem;
          text-align: center;
          max-width: 90vw;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
          transition: opacity 0.3s ease;
        }

        /* ------------------------------------------------------------------ */
        /* FX ANIMATION OVERLAY SCOPED STYLES (rule 3: all prefixed with fx-) */
        /* ------------------------------------------------------------------ */
        .fx-overlay {
          position: fixed;
          inset: 0;
          z-index: 90;
          display: none;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          background: rgba(2, 5, 12, 0.94);
          transition: background 0.5s;
          overflow: hidden;
          font-family: 'Kanit', sans-serif;
          color: #D7E2EA;
        }
        .fx-overlay.fx-on {
          display: flex;
        }
        .fx-overlay.fx-out {
          background: rgba(2, 5, 12, 0);
        }
        .fx-stg {
          position: relative;
          width: min(78vw, 320px);
          height: min(78vw, 320px);
          display: grid;
          place-items: center;
        }
        .fx-abs {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          pointer-events: none;
        }
        .fx-big {
          position: relative;
        }
        .fx-big svg {
          width: 100%;
          height: auto;
          display: block;
          filter: drop-shadow(0 0 22px rgba(125, 190, 255, 0.55));
        }
        .fx-rays {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 190%;
          aspect-ratio: 1;
          margin: -95% 0 0 -95%;
          border-radius: 50%;
          background: repeating-conic-gradient(var(--c) 0 7deg, transparent 7deg 22deg);
          -webkit-mask: radial-gradient(circle, #000 4%, transparent 62%);
          mask: radial-gradient(circle, #000 4%, transparent 62%);
          opacity: 0;
          animation: fx-spin 8s linear infinite;
        }
        .fx-glow {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 130%;
          aspect-ratio: 1;
          margin: -65% 0 0 -65%;
          border-radius: 50%;
          background: radial-gradient(circle, var(--c), transparent 65%);
          opacity: 0;
        }
        @keyframes fx-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fx-hue {
          to { filter: hue-rotate(360deg); }
        }
        .fx-cap {
          margin-top: 22px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          text-align: center;
          min-height: 1.6em;
          font-size: 1rem;
          transition: opacity 0.3s;
        }
        .fx-cards {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          width: min(94vw, 420px);
        }
        .fx-rc {
          width: 104px;
          border: 2px solid var(--c);
          border-radius: 24px;
          background: linear-gradient(160deg, #0a1a3d, #06090f);
          padding: 12px 6px;
          text-align: center;
          box-shadow: 0 0 28px var(--c);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .fx-rc b {
          font-weight: 800;
          font-size: 0.78rem;
          text-transform: uppercase;
          margin-top: 6px;
          line-height: 1.15;
        }
        .fx-rc::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, transparent 35%, rgba(255, 255, 255, 0.45) 50%, transparent 65%);
          transform: translateX(-120%);
          animation: fx-shn 1.5s 0.7s infinite;
        }
        @keyframes fx-shn {
          to { transform: translateX(120%); }
        }
        .fx-fl {
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
          pointer-events: none;
          will-change: transform;
        }
        .fx-fl svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        .fx-bump {
          animation: fx-bmp 0.35s;
        }
        @keyframes fx-bmp {
          50% {
            transform: scale(1.22);
            box-shadow: 0 0 24px #4FA3FF;
          }
        }
        .fx-ring {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 30%;
          aspect-ratio: 1;
          margin: -15% 0 0 -15%;
          border-radius: 50%;
          border: 4px solid var(--c);
          opacity: 0;
          pointer-events: none;
        }
        .fx-dome {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 60%;
          aspect-ratio: 1;
          margin: -30% 0 0 -30%;
          border-radius: 50%;
          border: 3px solid #9CD0FF;
          background: radial-gradient(circle, rgba(79, 163, 255, 0.3), transparent 70%);
          opacity: 0;
          pointer-events: none;
        }
        .fx-dot {
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 50%;
          pointer-events: none;
        }
        .fx-dot svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        .fx-shard {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 38px;
          height: 38px;
          pointer-events: none;
        }
        .fx-flash {
          position: absolute;
          inset: -60vh -60vw;
          background: #fff;
          opacity: 0;
          pointer-events: none;
          z-index: 2;
        }
      `}</style>

      <main className="scholar-store-main">
        {/* TOP STATUS BAR PILLS */}
        <div className="scholar-bar" id="bar">
          <div className="scholar-pill g" id="pg">
            <GemSvg size={22} />
            <span>{dispCounters.gems}</span>
          </div>
          <div className="scholar-pill" id="ph">
            <HeartSvg size={22} />
            <span>{dispCounters.lives}/5</span>
          </div>
          <div className="scholar-pill" id="px">
            <XpSvg size={22} />
            <span>{dispCounters.xp}</span>
          </div>
          <div className="scholar-pill" id="ps">
            <ShieldStreakSvg size={22} />
            <span>{dispCounters.shield}</span>
          </div>
        </div>

        {/* HERO TITLE & USER HANDLE */}
        <h1 className="scholar-hh scholar-title">Store</h1>
        <p className="scholar-sub" id="who">
          @{sanitizedHandle} · Scholar Store
        </p>

        {/* DUAL SWITCH TABS */}
        <div className="scholar-tabs">
          <button
            id="t1"
            className={tab === 1 ? "on" : ""}
            onClick={() => { if (!busyRef.current) setTab(1); }}
          >
            Store
          </button>
          <button
            id="t2"
            className={tab === 2 ? "on" : ""}
            onClick={() => { if (!busyRef.current) setTab(2); }}
          >
            Inventory
          </button>
        </div>

        {/* 2X XP BOOST BANNER */}
        {isBoostActive && (
          <div className="scholar-boost" id="bst" style={{ display: 'flex' }}>
            <Time1hSvg size={28} />
            <span>2× XP Boost active</span>
            <b id="btm">{boostRemaining}</b>
          </div>
        )}

        {/* CATEGORY CHIPS */}
        {tab === 1 && (
          <div className="scholar-chips" id="chips">
            {categories.map((c) => (
              <button
                key={c}
                className={`scholar-chip ${c === cat ? "on" : ""}`}
                onClick={() => { if (!busyRef.current) setCat(c); }}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* MAIN GRID VIEW */}
        <div className="scholar-grid" id="view">
          {tab === 1 ? (
            <>
              {/* FEATURED DELUXE EPIC STASH */}
              {cat === "All" && (
                <div
                  className="scholar-feat"
                  style={{ gridColumn: "1 / -1" }}
                  onClick={() => {
                    if (busyRef.current) return;
                    const featItem = IT.find((x) => x.id === "chest_deluxe");
                    if (featItem) openSheet(featItem);
                  }}
                >
                  <RenderStoreIcon id="chest_deluxe" size={96} />
                  <div>
                    <small>Epic deal</small>
                    <h3>Deluxe Epic Stash</h3>
                    <span
                      className="scholar-price"
                      style={{ width: "auto", display: "inline-flex" }}
                    >
                      <GemSvg size={20} />
                      <span>600</span>
                    </span>
                  </div>
                </div>
              )}

              {/* SECTION GROUPED ITEMS */}
              {(() => {
                let lastSection = "";
                return filteredItems.map((item) => {
                  const showSectionHeader = cat === "All" && item.c !== lastSection;
                  if (showSectionHeader) {
                    lastSection = item.c;
                  }
                  const itemKey = item.k || item.id;
                  const ownedCount = storeState.inv[itemKey] || 0;

                  return (
                    <React.Fragment key={itemKey}>
                      {showSectionHeader && (
                        <div className="scholar-sec">{item.c}</div>
                      )}
                      <div
                        className="scholar-card"
                        onClick={() => openSheet(item)}
                      >
                        <div className="art">
                          <RenderStoreIcon id={item.id} size={70} />
                        </div>
                        {ownedCount > 0 && (
                          <span className="scholar-own">x{ownedCount}</span>
                        )}
                        <b>{item.n}</b>
                        <small>{item.d}</small>
                        <span className="scholar-price">
                          {item.cash ? (
                            item.cash
                          ) : (
                            <>
                              <GemSvg size={20} />
                              <span>{item.p}</span>
                            </>
                          )}
                        </span>
                      </div>
                    </React.Fragment>
                  );
                });
              })()}
            </>
          ) : (
            /* INVENTORY VIEW */
            <>
              {ownedItems.length === 0 ? (
                <div className="scholar-empty">
                  <RenderStoreIcon id="chest_silver" size={90} />
                  <h4>Inventory is empty</h4>
                  <p>
                    Items you buy from the store are kept here. Open chests, drink
                    potions and activate boosters.
                  </p>
                  <button
                    className="scholar-price"
                    style={{ width: "auto" }}
                    onClick={() => { if (!busyRef.current) setTab(1); }}
                  >
                    Go to Store
                  </button>
                </div>
              ) : (
                ownedItems.map((item) => {
                  const itemKey = item.k || item.id;
                  const count = storeState.inv[itemKey] || 0;
                  return (
                    <div
                      key={itemKey}
                      className="scholar-card"
                      onClick={() => openSheet(item)}
                    >
                      <div className="art">
                        <RenderStoreIcon id={item.id} size={70} />
                      </div>
                      <span className="scholar-own">x{count}</span>
                      <b>{item.n}</b>
                      <small>{item.d}</small>
                      <span className="scholar-price use">Use</span>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </main>

      {/* BOTTOM SHEET MODAL */}
      {isSheetOpen && cur && (
        <>
          <div className="scholar-bd" onClick={closeSheet} />
          <div className="scholar-sheet">
            <div className="art">
              <RenderStoreIcon id={cur.id} size={100} />
            </div>
            <h3>{cur.n}</h3>
            <p>
              {cur.d}
              {storeState.inv[cur.k || cur.id]
                ? ` You own ${storeState.inv[cur.k || cur.id]}.`
                : ""}
            </p>

            {tab === 1 ? (
              <>
                <div className="scholar-qty">
                  <button
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  >
                    −
                  </button>
                  <b>{qty}</b>
                  <button
                    onClick={() => setQty((prev) => Math.min(99, prev + 1))}
                  >
                    +
                  </button>
                </div>
                <div className="scholar-tot">
                  <span>Total:</span>
                  {cur.cash ? (
                    cur.cash
                  ) : (
                    <>
                      <GemSvg size={22} />
                      <span>{(cur.p || 0) * qty}</span>
                    </>
                  )}
                </div>
                {Boolean(!cur.cash && storeState.gems < (cur.p || 0) * qty) && (
                  <div className="no">Not enough gems</div>
                )}
                <button
                  className="go"
                  disabled={Boolean(!cur.cash && storeState.gems < (cur.p || 0) * qty)}
                  onClick={handleBuy}
                >
                  Confirm purchase
                </button>
              </>
            ) : (
              <button className="go" onClick={handleUse}>
                Use one
              </button>
            )}
          </div>
        </>
      )}

      {/* RENAME MODAL FOR SCHOLAR ID CARD */}
      {isRenameOpen && (
        <>
          <div className="scholar-bd" onClick={() => setIsRenameOpen(false)} />
          <div className="scholar-sheet">
            <div className="art">
              <RenderStoreIcon id="id_card" size={100} />
            </div>
            <h3>Change Player Name</h3>
            <p>Choose your new scholar display handle (up to 14 characters).</p>
            <div style={{ marginBottom: 16 }}>
              <input
                type="text"
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                maxLength={14}
                placeholder="New name..."
                style={{
                  width: "100%",
                  padding: "12px 18px",
                  borderRadius: 999,
                  border: "2px solid #0C0C0C",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  textAlign: "center",
                  outline: "none",
                  fontFamily: "inherit",
                }}
                autoFocus
              />
            </div>
            <button
              className="go"
              disabled={!renameInput.trim()}
              onClick={handleConfirmRename}
            >
              Confirm Name Change
            </button>
          </div>
        </>
      )}

      {/* FULLSCREEN ANIMATION OVERLAY */}
      <div id="fx-overlay" className="fx-overlay">
        <div id="fx-stg" className="fx-stg"></div>
        <div id="fx-cap" className="fx-cap"></div>
      </div>

      {/* TOAST PILL */}
      {isToastActive && (
        <div className="scholar-toast">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
