import React, { useState, useEffect } from "react";
import { useGamification } from "../../utils/gamificationStore";
import { useEngagementStore, loadStoredStudentProfile } from "../../utils/engagementStore";
import { addNameChangeCard } from "../../utils/nameChangeService";
import {
  getStoredActiveBundleId,
  persistActiveBundleId,
} from "../../data/avatarSkinsData";
import { X, Check, Edit3, Package, Sparkles } from "lucide-react";
import {
  fetchUserInventory,
  addItemToInventory,
  consumeInventoryItem,
  InventoryItem,
} from "../../services/inventoryService";
import { auth } from "../../firebase";

interface StorePageProps {
  diamonds: number;
  onSpendDiamonds: (amount: number) => boolean;
  onAddDiamonds: (amount: number) => void;
  onAddXP: (amount: number) => void;
  onActivateUnlimitedLives: (hours: number) => void;
  onShowToast: (msg: string) => void;
  themeColor?: string;
}

// ---------------------------------------------------------------------------
// SVG ICONS EXACTLY REPLICATING TEMPLATE SPECS
// ---------------------------------------------------------------------------

export const GemIcon: React.FC<{ size?: number; className?: string }> = ({ size = 22, className = "" }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    style={{ width: size, height: size }}
    className={className}
  >
    <path
      d="M32 8 52 24 32 56 12 24Z"
      fill="url(#gb)"
      stroke="#D7E2EA"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <path
      d="M12 24h40M24 24l8-16 8 16-8 32zM24 24 32 56 40 24"
      stroke="#fff"
      strokeOpacity=".55"
      strokeWidth="1.5"
    />
  </svg>
);

const CardIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" fill="none">
    <rect x="5" y="12" width="54" height="36" rx="8" fill="url(#gd)" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <circle cx="19" cy="27" r="6" fill="url(#gb)" />
    <path d="M9 42c2-8 14-8 20 0z" fill="url(#gb)" />
    <path d="M36 24h16M36 32h8" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M38 52l14-14 5 5-14 14-7 2z" fill="url(#gs)" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);

const Stone1hIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" fill="none">
    <path d="M32 4 50 18 45 58H19L14 18Z" fill="url(#gb)" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M14 18h36" stroke="#fff" strokeOpacity=".4" />
    <circle cx="32" cy="36" r="12" fill="#010B1F" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M32 29v7l5 3" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);

const Stone3hIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" fill="none">
    <path d="M32 4 50 18 45 58H19L14 18Z" fill="url(#gb)" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M14 18h36" stroke="#fff" strokeOpacity=".4" />
    <circle cx="32" cy="36" r="12" fill="#010B1F" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M32 29v7l5 3" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <circle cx="32" cy="36" r="18" stroke="#fff" strokeDasharray="3 4" opacity=".8" />
  </svg>
);

const Stone24hIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" fill="none">
    <path d="M32 4 50 18 45 58H19L14 18Z" fill="url(#gb)" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M14 18h36" stroke="#fff" strokeOpacity=".4" />
    <path d="M7 32 14 22v26ZM57 32 50 22v26Z" fill="url(#gs)" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <circle cx="32" cy="36" r="12" fill="#010B1F" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M26 30l12 12M38 30 26 42M32 28v16" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);

const FlaskIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" fill="none">
    <path d="M26 6h12v5h-2v12l14 23a6 6 0 0 1-5 10H19a6 6 0 0 1-5-10l14-23V11h-2z" fill="url(#gs)" fillOpacity=".25" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M20 40h24l6 8a4 4 0 0 1-3.5 6h-29A4 4 0 0 1 14 48z" fill="url(#gb)" />
    <path d="M34 29l-7 10h5l-3 9 9-12h-5z" fill="#fff" />
    <circle cx="40" cy="44" r="2" fill="#fff" opacity=".7" />
  </svg>
);

const ElixirIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" fill="none">
    <rect x="25" y="3" width="14" height="8" rx="2" fill="url(#gs)" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M28 11h8v8c9 3 14 10 14 20 0 10-8 17-18 17S14 49 14 39c0-10 5-17 14-20z" fill="url(#gd)" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M15 38c1 10 8 16 17 16s16-6 17-16c-9-4-25-4-34 0z" fill="url(#gb)" />
    <path d="m32 30 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#fff" />
  </svg>
);

const StreakShieldIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" fill="none">
    <path d="M32 4 53 12v18c0 14-9 24-21 30C20 54 11 44 11 30V12Z" fill="url(#gb)" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M32 20c2 7 9 9 9 17a9 9 0 0 1-18 0c0-5 3-6 4-10 2 1 4 2 5 5 1-3 1-7 0-12z" fill="#fff" />
  </svg>
);

const ChestSilverIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" fill="none">
    <rect x="8" y="34" width="48" height="24" rx="4" fill="url(#gd)" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M8 34v-6a24 14 0 0 1 48 0v6z" fill="url(#gs)" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M22 16v42M42 16v42" stroke="#D7E2EA" strokeWidth="3" strokeLinecap="round" />
    <rect x="27" y="31" width="10" height="12" rx="2" fill="url(#gs)" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);

const ChestGoldIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" fill="none">
    <path d="M19 14 21 3l11 7 11-7 2 11z" fill="url(#gs)" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <rect x="8" y="34" width="48" height="24" rx="4" fill="url(#gd)" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M8 34v-6a24 14 0 0 1 48 0v6z" fill="url(#gb)" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M22 16v42M42 16v42" stroke="#D7E2EA" strokeWidth="3" strokeLinecap="round" />
    <rect x="27" y="31" width="10" height="12" rx="2" fill="url(#gs)" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);

const ChestDeluxeIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" fill="none">
    <path d="M32 0l7 8-7 9-7-9z" fill="url(#gb)" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M10 6l4 3M54 6l-4 3M6 18l5 1M58 18l-5 1" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <rect x="8" y="34" width="48" height="24" rx="4" fill="url(#gd)" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M8 34v-6a24 14 0 0 1 48 0v6z" fill="url(#gb)" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M22 16v42M42 16v42" stroke="#D7E2EA" strokeWidth="3" strokeLinecap="round" />
    <rect x="27" y="31" width="10" height="12" rx="2" fill="url(#gs)" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);

const KingIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" fill="none">
    <path d="M7 46 11 16l15 14 6-18 6 18 15-14 4 30z" fill="url(#gb)" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <rect x="7" y="46" width="50" height="9" rx="3" fill="url(#gs)" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <circle cx="11" cy="13" r="3" fill="#fff" />
    <circle cx="32" cy="9" r="3" fill="#fff" />
    <circle cx="53" cy="13" r="3" fill="#fff" />
  </svg>
);

const NinjaIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" fill="none">
    <circle cx="30" cy="34" r="22" fill="url(#gd)" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <rect x="8" y="26" width="44" height="15" rx="6" fill="url(#gb)" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <ellipse cx="21" cy="33" rx="5" ry="3" fill="#fff" />
    <ellipse cx="39" cy="33" rx="5" ry="3" fill="#fff" />
    <path d="M52 30l9-7M52 36l9 7" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);

const RobotIcon: React.FC = () => (
  <svg viewBox="0 0 64 64" fill="none">
    <rect x="11" y="20" width="42" height="34" rx="10" fill="url(#gd)" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <rect x="17" y="29" width="30" height="13" rx="6.5" fill="url(#gb)" />
    <circle cx="26" cy="35.5" r="3" fill="#fff" />
    <circle cx="38" cy="35.5" r="3" fill="#fff" />
    <path d="M32 20v-8M26 48h12" stroke="#D7E2EA" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    <circle cx="32" cy="9" r="3.5" fill="url(#gs)" />
    <path d="M7 31v12M57 31v12" stroke="#D7E2EA" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);

const ICON_MAP: Record<string, React.ReactNode> = {
  card: <CardIcon />,
  s1: <Stone1hIcon />,
  s3: <Stone3hIcon />,
  s24: <Stone24hIcon />,
  flask: <FlaskIcon />,
  elixir: <ElixirIcon />,
  shield: <StreakShieldIcon />,
  c1: <ChestSilverIcon />,
  c2: <ChestGoldIcon />,
  c3: <ChestDeluxeIcon />,
  king: <KingIcon />,
  ninja: <NinjaIcon />,
  robot: <RobotIcon />,
};

interface StoreCategoryItem {
  id: string;
  name: string;
  price: number;
  desc: string;
  tag?: string;
  icon: string;
  isHot?: boolean;
  xpBonus?: number;
  gemBonus?: number;
  lifeHours?: number;
  isRenamePass?: boolean;
  isStreakFreeze?: boolean;
  skinBundleId?: string;
}

interface StoreCategory {
  num: string;
  title: string;
  items: StoreCategoryItem[];
}

const STORE_CATEGORIES: StoreCategory[] = [
  {
    num: "01",
    title: "Identity Passes & Cards",
    items: [
      {
        id: "name-change-card",
        name: "Name Change Card",
        price: 50,
        desc: "Consumable pass to rename your scholar display handle across courses and leaderboards.",
        icon: "card",
        isRenamePass: true,
      },
    ],
  },
  {
    num: "02",
    title: "Life Stones · Unlimited Practice Lives",
    items: [
      {
        id: "stone-1h",
        name: "1-Hour Life Stone",
        price: 50,
        desc: "Grants 1 hour of continuous unlimited practice lives.",
        icon: "s1",
        lifeHours: 1,
      },
      {
        id: "stone-3h",
        name: "3-Hour Life Stone",
        price: 120,
        desc: "Grants 3 hours of continuous unlimited practice lives.",
        tag: "Best Value",
        icon: "s3",
        isHot: true,
        lifeHours: 3,
      },
      {
        id: "stone-24h",
        name: "24-Hour Rune Stone",
        price: 350,
        desc: "Grants a full 24 hours of unlimited practice lives.",
        tag: "Legendary",
        icon: "s24",
        isHot: true,
        lifeHours: 24,
      },
    ],
  },
  {
    num: "03",
    title: "XP Elixirs & Boosts",
    items: [
      {
        id: "flask-200",
        name: "Arcane XP Flask",
        price: 40,
        desc: "Instantly adds +200 XP to your learning level.",
        icon: "flask",
        xpBonus: 200,
      },
      {
        id: "elixir-500",
        name: "Grand XP Elixir",
        price: 85,
        desc: "Instantly adds +500 XP to your learning level.",
        icon: "elixir",
        xpBonus: 500,
      },
    ],
  },
  {
    num: "04",
    title: "Streak Protection",
    items: [
      {
        id: "streak-shield",
        name: "Streak Shield",
        price: 60,
        desc: "Protects your daily learning flame streak if you miss a day.",
        icon: "shield",
        isStreakFreeze: true,
      },
    ],
  },
  {
    num: "05",
    title: "Loot Chests",
    items: [
      {
        id: "chest-silver",
        name: "Silver Chest",
        price: 35,
        desc: "Unlocks instant loot (+60 XP & +15 gems).",
        icon: "c1",
        xpBonus: 60,
        gemBonus: 15,
      },
      {
        id: "chest-gold",
        name: "Royal Crown Chest",
        price: 75,
        desc: "Unlocks royal loot (+150 XP & +35 gems).",
        icon: "c2",
        xpBonus: 150,
        gemBonus: 35,
      },
      {
        id: "chest-deluxe",
        name: "Deluxe Chest",
        price: 150,
        desc: "Unlocks mythic loot (+300 XP & +70 gems).",
        tag: "Mythic",
        icon: "c3",
        isHot: true,
        xpBonus: 300,
        gemBonus: 70,
      },
    ],
  },
  {
    num: "06",
    title: "Mascot Avatar Skins",
    items: [
      {
        id: "skin-king",
        name: "Algorithmic King",
        price: 250,
        desc: "A regal mascot skin fit for the ruler of all algorithms.",
        tag: "Royal Skin",
        icon: "king",
        skinBundleId: "cyber_king",
      },
      {
        id: "skin-ninja",
        name: "Cyber Ninja",
        price: 200,
        desc: "Stealth cyberpunk mascot skin that strikes from the shadows.",
        tag: "Stealth Cyberpunk",
        icon: "ninja",
        skinBundleId: "cyber_ninja",
      },
      {
        id: "skin-robot",
        name: "Silicon Titan",
        price: 220,
        desc: "Futuristic AI robot mascot skin built from pure silicon.",
        tag: "Futuristic AI Robot",
        icon: "robot",
        skinBundleId: "terminator",
      },
    ],
  },
];

const OWNED_SKINS_STORAGE_KEY = "dsa_user_owned_skins_v1";

export const StorePage: React.FC<StorePageProps> = ({
  diamonds,
  onSpendDiamonds,
  onAddDiamonds,
  onAddXP,
  onActivateUnlimitedLives,
  onShowToast,
}) => {
  const { state: gamificationState } = useGamification();
  const currentXP = gamificationState?.xp ?? 0;

  // View switch: "store" vs "inventory" (Bag)
  const [storeView, setStoreView] = useState<"store" | "inventory">("store");

  // User inventory state
  const currentProfile = loadStoredStudentProfile();
  const currentUserId = currentProfile?.userId || auth.currentUser?.uid || "guest_user";
  const [userInventory, setUserInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    fetchUserInventory(currentUserId).then(setUserInventory).catch(console.warn);
  }, [currentUserId]);

  // Track owned mascot skins
  const [ownedSkinIds, setOwnedSkinIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(OWNED_SKINS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [];
  });

  const [isBalBumping, setIsBalBumping] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newNameInput, setNewNameInput] = useState("");
  const { profile, updateProfile } = useEngagementStore();

  const triggerBalBump = () => {
    setIsBalBumping(true);
    setTimeout(() => setIsBalBumping(false), 400);
  };

  const handlePurchase = async (item: StoreCategoryItem) => {
    if (diamonds < item.price) {
      onShowToast("Not enough gems");
      return;
    }

    const spent = onSpendDiamonds(item.price);
    if (!spent) return;

    triggerBalBump();

    // Add item to user's unique inventory (Bag)
    const updatedInv = await addItemToInventory(currentUserId, {
      id: item.id,
      name: item.name,
      quantity: 1,
      icon: item.icon,
      desc: item.desc,
      category: item.tag || "Store Purchase",
    });
    setUserInventory(updatedInv);

    // 1. Name Change Card
    if (item.isRenamePass) {
      addNameChangeCard();
      onShowToast(`${item.name} purchased & added to Bag · Rename unlocked`);
      setIsRenameModalOpen(true);
      return;
    }

    // 2. Life Stone
    if (item.lifeHours) {
      onActivateUnlimitedLives(item.lifeHours);
      onShowToast(`${item.name} added to Bag & activated!`);
      return;
    }

    // 3. XP Flask / Elixir
    if (item.xpBonus && !item.gemBonus) {
      onAddXP(item.xpBonus);
      onShowToast(`${item.name} added to Bag · +${item.xpBonus} XP added`);
      return;
    }

    // 4. Streak Shield
    if (item.isStreakFreeze) {
      onShowToast(`${item.name} added to Bag · Streak protected`);
      return;
    }

    // 5. Loot Chests
    if (item.gemBonus && item.xpBonus) {
      onAddXP(item.xpBonus);
      onAddDiamonds(item.gemBonus);
      onShowToast(`${item.name} added to Bag · +${item.xpBonus} XP & +${item.gemBonus} gems`);
      return;
    }

    // 6. Skins
    if (item.skinBundleId) {
      const updatedSkins = [...ownedSkinIds, item.skinBundleId];
      setOwnedSkinIds(updatedSkins);
      try {
        localStorage.setItem(OWNED_SKINS_STORAGE_KEY, JSON.stringify(updatedSkins));
      } catch (e) {}
      persistActiveBundleId(item.skinBundleId);
      onShowToast(`${item.name} added to Bag & equipped!`);
      return;
    }

    onShowToast(`${item.name} purchased and stored in your Bag!`);
  };

  // Use or open item from Inventory Bag
  const handleUseInventoryItem = async (invItem: InventoryItem) => {
    const updated = await consumeInventoryItem(currentUserId, invItem.id);
    setUserInventory(updated);

    if (invItem.id.includes("stone")) {
      onActivateUnlimitedLives(1);
      onShowToast(`⚡ Activated ${invItem.name} from Bag!`);
    } else if (invItem.id.includes("flask") || invItem.id.includes("elixir")) {
      onAddXP(100);
      onShowToast(`✨ Consumed ${invItem.name} · +100 XP!`);
    } else if (invItem.id.includes("chest")) {
      onAddXP(150);
      onAddDiamonds(25);
      onShowToast(`🎁 Opened ${invItem.name} from Bag · +150 XP & +25 Gems!`);
    } else if (invItem.id === "name-change-card") {
      setIsRenameModalOpen(true);
      onShowToast(`📝 Name Change Card used!`);
    } else {
      onShowToast(`✅ Used ${invItem.name} from Bag.`);
    }
  };

  const handleSaveNewName = () => {
    const trimmed = newNameInput.trim();
    if (trimmed.length >= 2) {
      updateProfile({ username: trimmed });
      onShowToast(`Handle updated to "${trimmed}"!`);
      setIsRenameModalOpen(false);
      setNewNameInput("");
    }
  };

  return (
    <main className="store-main select-none text-left">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <linearGradient id="gb" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7DBDFF" />
            <stop offset="1" stopColor="#0057E7" />
          </linearGradient>
          <linearGradient id="gs" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#8fa3b5" />
          </linearGradient>
          <linearGradient id="gd" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#16327a" />
            <stop offset="1" stopColor="#010B1F" />
          </linearGradient>
        </defs>
      </svg>

      {/* STICKY HEADER */}
      <header className="store-header flex items-center justify-between">
        <span className="brand">Scholar Store & Bag</span>
        <div className="store-pills flex items-center gap-2">
          <div className="store-pill flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white font-mono text-xs">
            <span style={{ opacity: 0.7 }}>XP</span>
            <span>{currentXP.toLocaleString()}</span>
          </div>
          <div className={`store-pill flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white font-mono text-xs ${isBalBumping ? "store-bump" : ""}`}>
            <GemIcon size={20} />
            <span>{diamonds.toLocaleString()}</span>
          </div>
        </div>
      </header>

      {/* VIEW TOGGLE TABS */}
      <div className="flex items-center justify-center my-4">
        <div className="flex items-center gap-1 p-1 rounded-full border-2 border-white/15 bg-[#121418] shadow-lg">
          <button
            onClick={() => setStoreView("store")}
            className={`px-5 py-2 rounded-full font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
              storeView === "store"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Store
          </button>
          <button
            onClick={() => setStoreView("inventory")}
            className={`px-5 py-2 rounded-full font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              storeView === "inventory"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Inventory Bag ({userInventory.reduce((acc, it) => acc + it.quantity, 0)})</span>
          </button>
        </div>
      </div>

      {storeView === "store" ? (
        <>
          <h1 className="hero-heading store-h1 fade in">Store</h1>
          <p className="store-sub fade in">Spend gems · power up your learning · store items in your Bag</p>

          <div id="shop">
            {STORE_CATEGORIES.map((cat) => (
              <section key={cat.num} className="store-section fade in">
                <div className="store-sh">
                  <span className="n hero-heading">{cat.num}</span>
                  <h2>{cat.title}</h2>
                </div>

                <div className="store-grid">
                  {cat.items.map((item) => {
                    const isOwned = item.skinBundleId && ownedSkinIds.includes(item.skinBundleId);
                    return (
                      <div key={item.id} className="store-card">
                        <div className="store-tile">
                          {ICON_MAP[item.icon] || <GemIcon size={56} />}
                        </div>

                        {item.tag && (
                          <span className={`store-tag ${item.isHot ? "hot" : ""}`}>
                            {item.tag}
                          </span>
                        )}

                        <h3>{item.name}</h3>
                        <p>{item.desc}</p>

                        <div className="store-buy">
                          <div className="store-price">
                            <GemIcon size={26} />
                            <span>{item.price}</span>
                          </div>
                          <button
                            onClick={() => handlePurchase(item)}
                            disabled={Boolean(isOwned)}
                            className="store-btn"
                          >
                            {isOwned ? "Owned" : "Buy & Bag"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </>
      ) : (
        /* ================= INVENTORY BAG VIEW ================= */
        <div className="space-y-4 fade in">
          <div className="bg-[#121418] border-2 border-blue-500/40 rounded-[32px] p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase text-white tracking-tight">Scholar's Inventory Bag</h2>
                <p className="text-xs text-slate-400">Unique user storage for chests, stones, potions & passes</p>
              </div>
            </div>

            {userInventory.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm font-bold">Your bag is empty!</p>
                <p className="text-xs mt-1">Purchase items from the Store to store them here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {userInventory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#0b0e14] border border-white/10 rounded-2xl p-4 flex flex-col justify-between relative hover:border-blue-500/50 transition-all shadow-lg"
                  >
                    <div className="absolute top-3 right-3 bg-blue-600 text-white font-mono font-bold text-xs px-2.5 py-0.5 rounded-full shadow">
                      x{item.quantity}
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        {ICON_MAP[item.icon] || <GemIcon size={32} />}
                      </div>
                      <div className="min-w-0 pr-6">
                        <h3 className="font-bold text-sm text-white truncate">{item.name}</h3>
                        <span className="text-[10px] text-blue-400 font-mono uppercase">{item.category}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300/80 mb-4 line-clamp-2">{item.desc}</p>

                    <button
                      onClick={() => handleUseInventoryItem(item)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider shadow-md cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Use / Open Item</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Name Change Modal */}
      {isRenameModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0C0C0C] border-2 border-[#D7E2EA] rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => setIsRenameModalOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                <Edit3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold uppercase text-white">Rename Scholar</h3>
                <p className="text-xs text-white/60">Choose your new display handle</p>
              </div>
            </div>
            <input
              type="text"
              placeholder={profile?.username || "Enter new handle..."}
              value={newNameInput}
              onChange={(e) => setNewNameInput(e.target.value)}
              maxLength={24}
              className="w-full bg-[#121418] border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 mb-4 text-sm"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setIsRenameModalOpen(false)}
                className="flex-1 py-2.5 rounded-full border border-white/20 text-white/70 hover:bg-white/10 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Keep for Later
              </button>
              <button
                onClick={handleSaveNewName}
                disabled={newNameInput.trim().length < 2}
                className="flex-1 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-colors"
              >
                Save Handle
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
