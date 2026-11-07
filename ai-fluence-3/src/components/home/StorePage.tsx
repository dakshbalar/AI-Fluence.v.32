import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  ShoppingBag,
  Package,
  Sparkles,
  Zap,
  Shield,
  Check,
  Flame,
  Search,
  X,
} from "lucide-react";
import { QuestRewardChest, QuestChestTier } from "./QuestRewardChest";
import { AIfluenceAvatar } from "../avatar/AIfluenceAvatar";
import {
  getStoredActiveBundleId,
  persistActiveBundleId,
} from "../../data/avatarSkinsData";
import { FULL_BUNDLES } from "../../data/avatarData";
import { auth } from "../../lib/firebase";
import { buyInventoryItem } from "../../services/gamificationBackendService";

interface StorePageProps {
  diamonds: number;
  onSpendDiamonds: (amount: number) => boolean;
  onAddDiamonds: (amount: number) => void;
  onAddXP: (amount: number) => void;
  onActivateUnlimitedLives: (hours: number) => void;
  onShowToast: (msg: string) => void;
  themeColor?: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: "stone" | "elixir" | "streak" | "key" | "chest" | "skin";
  count: number;
  effectType: "unlimited_lives" | "xp_boost" | "streak_freeze" | "skin" | "open_chest";
  effectValue: number;
  iconBg: string;
  skinBundleId?: string;
}

interface ShopItem {
  id: string;
  name: string;
  category: "stones" | "elixirs" | "streak" | "chests" | "skins";
  costDiamonds: number;
  badge?: string;
  iconBg: string;
  tier?: QuestChestTier;
  skinBundleId?: string;
}

const INVENTORY_STORAGE_KEY = "dsa_user_inventory_v1";
const OWNED_SKINS_STORAGE_KEY = "dsa_user_owned_skins_v1";

const DEFAULT_INVENTORY: InventoryItem[] = [
  {
    id: "stone-1h",
    name: "1-Hour Life Stone",
    category: "stone",
    count: 2,
    effectType: "unlimited_lives",
    effectValue: 1,
    iconBg: "bg-emerald-500/20 text-emerald-300",
  },
  {
    id: "stone-3h",
    name: "3-Hour Life Stone",
    category: "stone",
    count: 1,
    effectType: "unlimited_lives",
    effectValue: 3,
    iconBg: "bg-teal-500/20 text-teal-300",
  },
  {
    id: "elixir-200",
    name: "Arcane XP Flask",
    category: "elixir",
    count: 3,
    effectType: "xp_boost",
    effectValue: 200,
    iconBg: "bg-purple-500/20 text-purple-300",
  },
  {
    id: "streak-freeze",
    name: "Streak Shield",
    category: "streak",
    count: 2,
    effectType: "streak_freeze",
    effectValue: 1,
    iconBg: "bg-sky-500/20 text-sky-300",
  },
];

const SHOP_ITEMS: ShopItem[] = [
  // Stones
  {
    id: "buy-stone-1h",
    name: "1-Hour Life Stone",
    category: "stones",
    costDiamonds: 50,
    badge: "POPULAR",
    iconBg: "bg-emerald-950/60 text-emerald-400",
  },
  {
    id: "buy-stone-3h",
    name: "3-Hour Life Stone",
    category: "stones",
    costDiamonds: 120,
    badge: "BEST VALUE",
    iconBg: "bg-teal-950/60 text-teal-300",
  },
  {
    id: "buy-stone-24h",
    name: "24-Hour Rune Stone",
    category: "stones",
    costDiamonds: 350,
    badge: "LEGENDARY",
    iconBg: "bg-amber-950/60 text-amber-300",
  },
  // Elixirs
  {
    id: "buy-elixir-200",
    name: "Arcane XP Flask",
    category: "elixirs",
    costDiamonds: 40,
    iconBg: "bg-purple-950/60 text-purple-400",
  },
  {
    id: "buy-elixir-500",
    name: "Grand XP Elixir",
    category: "elixirs",
    costDiamonds: 85,
    badge: "BOOST",
    iconBg: "bg-fuchsia-950/60 text-fuchsia-300",
  },
  // Streak
  {
    id: "buy-streak-freeze",
    name: "Streak Shield",
    category: "streak",
    costDiamonds: 60,
    badge: "ESSENTIAL",
    iconBg: "bg-sky-950/60 text-sky-400",
  },
  // Chests
  {
    id: "buy-chest-silver",
    name: "Silver Chest",
    category: "chests",
    costDiamonds: 35,
    tier: "silver",
    iconBg: "bg-sky-950/60 text-sky-300",
  },
  {
    id: "buy-chest-gold",
    name: "Royal Crown Chest",
    category: "chests",
    costDiamonds: 75,
    tier: "gold",
    badge: "HOT",
    iconBg: "bg-rose-950/60 text-rose-300",
  },
  {
    id: "buy-chest-deluxe",
    name: "Deluxe Chest",
    category: "chests",
    costDiamonds: 150,
    tier: "deluxe",
    badge: "MYTHIC",
    iconBg: "bg-purple-950/60 text-purple-300",
  },
  // Mascot Skins
  {
    id: "buy-skin-cyber-king",
    name: "Algorithmic King",
    category: "skins",
    costDiamonds: 250,
    skinBundleId: "cyber_king",
    badge: "ROYAL",
    iconBg: "bg-amber-950/60 text-amber-300",
  },
  {
    id: "buy-skin-cyber-ninja",
    name: "Cyber Ninja",
    category: "skins",
    costDiamonds: 200,
    skinBundleId: "cyber_ninja",
    iconBg: "bg-emerald-950/60 text-emerald-300",
  },
  {
    id: "buy-skin-terminator",
    name: "Silicon Titan",
    category: "skins",
    costDiamonds: 220,
    skinBundleId: "terminator",
    iconBg: "bg-cyan-950/60 text-cyan-300",
  },
];

export const StorePage: React.FC<StorePageProps> = ({
  diamonds,
  onSpendDiamonds,
  onAddDiamonds,
  onAddXP,
  onActivateUnlimitedLives,
  onShowToast,
}) => {
  // Section toggle: store vs inventory
  const [activeSection, setActiveSection] = useState<"store" | "inventory">("store");

  // Shop category filter inside Store
  const [shopCategory, setShopCategory] = useState<
    "all" | "stones" | "elixirs" | "chests" | "skins" | "streak"
  >("all");

  // Search input
  const [searchQuery, setSearchQuery] = useState("");

  // User Inventory State
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return DEFAULT_INVENTORY;
  });

  // Owned Skins State
  const [ownedSkinIds, setOwnedSkinIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(OWNED_SKINS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return ["aiden_mascot", "cyber_ninja"];
  });

  // Currently Equipped Avatar Bundle
  const [activeBundleId, setActiveBundleId] = useState<string>(() =>
    getStoredActiveBundleId()
  );

  const activeBundle = useMemo(() => {
    return FULL_BUNDLES.find((b) => b.id === activeBundleId) || FULL_BUNDLES[0];
  }, [activeBundleId]);

  const persistInventory = (items: InventoryItem[]) => {
    setInventory(items);
    try {
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {}
  };

  const persistOwnedSkins = (skins: string[]) => {
    setOwnedSkinIds(skins);
    try {
      localStorage.setItem(OWNED_SKINS_STORAGE_KEY, JSON.stringify(skins));
    } catch (e) {}
  };

  // Consume / Use item from inventory
  const handleUseItem = (item: InventoryItem) => {
    if (item.count <= 0) return;

    if (item.effectType === "unlimited_lives") {
      onActivateUnlimitedLives(item.effectValue);
      onShowToast(`🛡️ Activated Unlimited Lives (${item.effectValue}h)!`);
    } else if (item.effectType === "xp_boost") {
      onAddXP(item.effectValue);
      onShowToast(`⚡ Added +${item.effectValue} XP!`);
    } else if (item.effectType === "streak_freeze") {
      onShowToast(`❄️ Streak Shield Active!`);
    }

    const updated = inventory
      .map((it) => (it.id === item.id ? { ...it, count: it.count - 1 } : it))
      .filter((it) => it.count > 0);

    persistInventory(updated);
  };

  // Equip Skin
  const handleEquipSkin = (bundleId: string) => {
    persistActiveBundleId(bundleId);
    setActiveBundleId(bundleId);
    const bundle = FULL_BUNDLES.find((b) => b.id === bundleId);
    onShowToast(`Equipped: ${bundle?.name || bundleId}`);
  };

  // Purchase item in shop
  const handlePurchase = (item: ShopItem) => {
    if (diamonds < item.costDiamonds) {
      onShowToast(`Need ${item.costDiamonds - diamonds} more diamonds`);
      return;
    }

    const success = onSpendDiamonds(item.costDiamonds);
    if (!success) return;

    if (auth.currentUser) {
      buyInventoryItem(auth.currentUser.uid, item.id, item.costDiamonds).catch((err) => {
        console.warn("Could not sync store purchase to Firestore:", err);
      });
    }

    // Skin handling
    if (item.category === "skins" && item.skinBundleId) {
      if (!ownedSkinIds.includes(item.skinBundleId)) {
        const next = [...ownedSkinIds, item.skinBundleId];
        persistOwnedSkins(next);
        handleEquipSkin(item.skinBundleId);
      }
      onShowToast(`Unlocked ${item.name}!`);
      return;
    }

    // Chest handling
    if (item.category === "chests") {
      const xpReward = item.tier === "silver" ? 60 : item.tier === "gold" ? 150 : 300;
      const gemReward = item.tier === "silver" ? 15 : item.tier === "gold" ? 35 : 70;
      onAddXP(xpReward);
      onAddDiamonds(gemReward);
      onShowToast(`+${xpReward} XP & +${gemReward} 💎!`);
      return;
    }

    // Inventory powerups
    const mapping: Record<
      string,
      {
        id: string;
        name: string;
        category: InventoryItem["category"];
        effectType: InventoryItem["effectType"];
        effectValue: number;
      }
    > = {
      "buy-stone-1h": {
        id: "stone-1h",
        name: "1-Hour Life Stone",
        category: "stone",
        effectType: "unlimited_lives",
        effectValue: 1,
      },
      "buy-stone-3h": {
        id: "stone-3h",
        name: "3-Hour Life Stone",
        category: "stone",
        effectType: "unlimited_lives",
        effectValue: 3,
      },
      "buy-stone-24h": {
        id: "stone-24h",
        name: "24-Hour Rune Stone",
        category: "stone",
        effectType: "unlimited_lives",
        effectValue: 24,
      },
      "buy-elixir-200": {
        id: "elixir-200",
        name: "Arcane XP Flask",
        category: "elixir",
        effectType: "xp_boost",
        effectValue: 200,
      },
      "buy-elixir-500": {
        id: "elixir-500",
        name: "Grand XP Elixir",
        category: "elixir",
        effectType: "xp_boost",
        effectValue: 500,
      },
      "buy-streak-freeze": {
        id: "streak-freeze",
        name: "Streak Shield",
        category: "streak",
        effectType: "streak_freeze",
        effectValue: 1,
      },
    };

    const target = mapping[item.id];
    if (target) {
      const existing = inventory.find((i) => i.id === target.id);
      let updated: InventoryItem[];
      if (existing) {
        updated = inventory.map((i) =>
          i.id === target.id ? { ...i, count: i.count + 1 } : i
        );
      } else {
        updated = [
          ...inventory,
          {
            id: target.id,
            name: target.name,
            category: target.category,
            count: 1,
            effectType: target.effectType,
            effectValue: target.effectValue,
            iconBg: item.iconBg,
          },
        ];
      }
      persistInventory(updated);
      onShowToast(`Added ${target.name}!`);
    }
  };

  // Filter shop items
  const filteredShopItems = useMemo(() => {
    return SHOP_ITEMS.filter((item) => {
      const matchCat = shopCategory === "all" || item.category === shopCategory;
      const matchQuery =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [shopCategory, searchQuery]);

  // Filter inventory items
  const filteredInventoryItems = useMemo(() => {
    return inventory.filter((item) => {
      return (
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [inventory, searchQuery]);

  // Filter owned skins
  const filteredOwnedSkins = useMemo(() => {
    return ownedSkinIds
      .map((id) => FULL_BUNDLES.find((b) => b.id === id))
      .filter((b): b is (typeof FULL_BUNDLES)[0] => !!b)
      .filter(
        (bundle) =>
          !searchQuery.trim() ||
          bundle.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [ownedSkinIds, searchQuery]);

  // Render Clash of Clans style 3D icon for shop/inventory items
  const renderCoCItemVisual = (
    category: string,
    id: string,
    tier?: QuestChestTier,
    skinBundleId?: string
  ) => {
    if (category === "chests" && tier) {
      return <QuestRewardChest tier={tier} size="sm" />;
    }
    if (category === "skins" && skinBundleId) {
      return (
        <AIfluenceAvatar
          config={
            FULL_BUNDLES.find((b) => b.id === skinBundleId)?.config ||
            activeBundle.config
          }
          size={52}
          showBackground={false}
        />
      );
    }
    if (category === "stones" || category === "stone") {
      // 3D Faceted Cut Rune Gemstone
      const isLegendary = id.includes("24h");
      const is3h = id.includes("3h");
      const baseGrad = isLegendary
        ? "from-amber-400 to-yellow-600"
        : is3h
        ? "from-cyan-400 to-teal-600"
        : "from-emerald-400 to-teal-700";

      return (
        <div className="relative w-12 h-12 flex items-center justify-center">
          <svg viewBox="0 0 40 40" className="w-11 h-11 drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)]">
            {/* Outer Dark Socket */}
            <polygon points="10,4 30,4 38,16 20,38 2,16" fill="#051016" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            {/* Left Upper Facet */}
            <polygon points="10,4 2,16 12,16" fill={isLegendary ? "#b45309" : is3h ? "#0369a1" : "#047857"} />
            {/* Right Upper Facet */}
            <polygon points="30,4 38,16 28,16" fill={isLegendary ? "#92400e" : is3h ? "#075985" : "#065f46"} />
            {/* Center Table */}
            <polygon points="10,4 30,4 28,16 12,16" fill={isLegendary ? "#fde047" : is3h ? "#38bdf8" : "#34d399"} />
            {/* Lower Center Facet */}
            <polygon points="12,16 28,16 20,38" fill={isLegendary ? "#f59e0b" : is3h ? "#0ea5e9" : "#10b981"} />
            {/* Lower Left Facet */}
            <polygon points="2,16 12,16 20,38" fill={isLegendary ? "#d97706" : is3h ? "#0284c7" : "#059669"} />
            {/* Lower Right Facet */}
            <polygon points="38,16 28,16 20,38" fill={isLegendary ? "#78350f" : is3h ? "#0c4a6e" : "#064e3b"} />
            {/* Specular Highlight Glint */}
            <polygon points="13,6 20,6 17,12" fill="#ffffff" opacity="0.8" />
            <circle cx="15" cy="7" r="1.5" fill="#ffffff" />
          </svg>
        </div>
      );
    }
    if (category === "elixirs" || category === "elixir") {
      // 3D Glass Flask with Glowing Arcane Liquid
      return (
        <div className="relative w-12 h-12 flex items-center justify-center">
          <svg viewBox="0 0 40 40" className="w-11 h-11 drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)]">
            {/* Cork */}
            <rect x="16" y="2" width="8" height="4" rx="1" fill="#78350f" stroke="#b45309" strokeWidth="1" />
            {/* Flask Neck */}
            <path d="M17 6 L17 12 L8 28 C6 32 9 36 14 36 L26 36 C31 36 34 32 32 28 L23 12 L23 6 Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
            {/* Liquid Fill */}
            <path d="M12 24 C16 22 24 26 28 24 L31 29 C32 32 30 35 26 35 L14 35 C10 35 8 32 9 29 Z" fill="url(#elixirLiquidGrad)" />
            {/* Liquid Glow Highlight */}
            <circle cx="16" cy="30" r="2" fill="#fbcfe8" opacity="0.8" />
            <circle cx="23" cy="28" r="1.5" fill="#fbcfe8" opacity="0.6" />
            {/* Glass Glare */}
            <path d="M11 26 L19 13" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
            <defs>
              <linearGradient id="elixirLiquidGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="50%" stopColor="#c026d3" />
                <stop offset="100%" stopColor="#701a75" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );
    }
    // Streak Shield / Fire
    return (
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg viewBox="0 0 36 40" className="w-10 h-11 drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)]">
          {/* Flame Shield Base */}
          <path d="M18 1 L32 5 V20 C32 28 25 35 18 39 C11 35 4 28 4 20 V5 Z" fill="#1c0e04" stroke="#f59e0b" strokeWidth="1.5" />
          {/* Outer Fire */}
          <path d="M18 8 C20 13, 27 18, 27 25 C27 30, 23 34, 18 34 C13 34, 9 30, 9 25 C9 19, 15 14, 18 8 Z" fill="url(#storeFlameOuter)" />
          {/* Inner Golden Fire */}
          <path d="M18 15 C19 18, 23 21, 23 26 C23 29, 21 31, 18 31 C15 31, 13 29, 13 26 C13 22, 16 19, 18 15 Z" fill="#fffae0" />
          <defs>
            <linearGradient id="storeFlameOuter" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffedd5" />
              <stop offset="30%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col bg-black min-h-full pb-28 select-none text-left relative overflow-hidden">
      <div className="relative z-10 w-full space-y-3 pt-3">
        {/* =====================================================================
            TOP BAR: TITLE & DIAMONDS (Sleek Obsidian Black)
            ===================================================================== */}
        <div className="px-4">
          <div className="rounded-2xl bg-[#0b0b0e] border border-white/10 p-3 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.85)]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center shadow-inner">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-black text-white tracking-tight">
                Store
              </h1>
            </div>

            {/* Diamond Balance */}
            <div className="bg-black/80 border border-white/15 rounded-xl px-3 py-1 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
              <span className="text-xs font-black font-mono text-cyan-300">
                {diamonds}
              </span>
              <span className="text-[10px]">💎</span>
            </div>
          </div>
        </div>

        {/* =====================================================================
            SEARCH BAR (Obsidian Black with Crisp Glass Focus)
            ===================================================================== */}
        <div className="px-4">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search store & inventory..."
              className="w-full bg-[#0b0b0e] border border-white/10 rounded-xl pl-10 pr-9 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/30 focus:bg-[#111116] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-zinc-400 hover:text-white p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* =====================================================================
            SECTION SWITCHER: [ STORE ] vs [ INVENTORY ] (Crisp Glass Style)
            ===================================================================== */}
        <div className="px-4">
          <div className="bg-[#0b0b0e] rounded-xl p-1 border border-white/10 flex items-center gap-1 shadow-md">
            <button
              onClick={() => setActiveSection("store")}
              className={`flex-1 py-2 rounded-lg font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                activeSection === "store"
                  ? "bg-white/[0.12] border border-white/25 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Store</span>
            </button>

            <button
              onClick={() => setActiveSection("inventory")}
              className={`flex-1 py-2 rounded-lg font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                activeSection === "inventory"
                  ? "bg-white/[0.12] border border-white/25 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>
                Inventory ({inventory.reduce((a, b) => a + b.count, 0)})
              </span>
            </button>
          </div>
        </div>

        {/* =====================================================================
            SECTION 1: STORE (2-IN-A-ROW GRID - Sleek Black & Glass Buy Buttons)
            ===================================================================== */}
        {activeSection === "store" && (
          <div className="px-4 space-y-3">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              {(
                [
                  { id: "all", label: "All" },
                  { id: "stones", label: "Stones" },
                  { id: "elixirs", label: "XP" },
                  { id: "chests", label: "Chests" },
                  { id: "skins", label: "Skins" },
                  { id: "streak", label: "Streak" },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setShopCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-black whitespace-nowrap transition-all cursor-pointer ${
                    shopCategory === cat.id
                      ? "bg-white/[0.14] text-white border border-white/30 shadow-sm"
                      : "bg-[#0b0b0e] text-zinc-400 hover:text-white hover:bg-white/[0.05] border border-white/10"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* 2-in-a-row Shopping App Grid */}
            {filteredShopItems.length === 0 ? (
              <div className="bg-[#0b0b0e] border border-white/10 rounded-2xl p-6 text-center text-xs text-zinc-400">
                No items found
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {filteredShopItems.map((item) => {
                  const isSkin = item.category === "skins";
                  const isOwnedSkin =
                    isSkin && item.skinBundleId && ownedSkinIds.includes(item.skinBundleId);
                  const isEquippedSkin = isSkin && item.skinBundleId === activeBundleId;

                  return (
                    <div
                      key={item.id}
                      className="bg-[#0c0c10] border border-white/10 hover:border-white/20 rounded-2xl p-3 flex flex-col items-center justify-between text-center transition-all shadow-[0_4px_16px_rgba(0,0,0,0.85)] group relative"
                    >
                      {/* Image / Icon Container */}
                      <div className="w-20 h-20 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center relative overflow-hidden my-1 shadow-inner">
                        {renderCoCItemVisual(item.category, item.id, item.tier, item.skinBundleId)}

                        {item.badge && (
                          <span className="absolute top-0 right-0 bg-white/15 backdrop-blur-sm border-b border-l border-white/20 text-white font-black text-[8px] px-1.5 py-0.5 rounded-bl-md shadow">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* Title only */}
                      <h3 className="text-xs font-bold text-zinc-100 text-center leading-tight line-clamp-2 h-7 flex items-center justify-center w-full px-1">
                        {item.name}
                      </h3>

                      {/* Price / Action Button (Signature Glass Style) */}
                      <div className="w-full mt-2">
                        {isEquippedSkin ? (
                          <div className="w-full py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase flex items-center justify-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>EQUIPPED</span>
                          </div>
                        ) : isOwnedSkin ? (
                          <button
                            onClick={() => item.skinBundleId && handleEquipSkin(item.skinBundleId)}
                            className="w-full py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/20 font-black text-[10px] uppercase cursor-pointer transition-all active:scale-95 shadow-sm"
                          >
                            EQUIP
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePurchase(item)}
                            className="w-full py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] active:bg-white/[0.20] backdrop-blur-md border border-white/20 hover:border-white/40 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_14px_rgba(0,0,0,0.6)] relative overflow-hidden group/btn"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 pointer-events-none" />
                            <span className="text-xs">💎</span>
                            <span className="font-mono text-cyan-300 font-bold">{item.costDiamonds}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            SECTION 2: INVENTORY (SHOPPING APP 2-IN-A-ROW GRID - Sleek Black & Glass Buttons)
            ===================================================================== */}
        {activeSection === "inventory" && (
          <div className="px-4 space-y-4">
            {/* Owned Items: 2 in a row */}
            <div>
              <div className="flex items-center justify-between mb-2 text-xs font-black uppercase tracking-wider text-zinc-400">
                <span>ITEMS</span>
                <span className="font-mono text-white font-bold">
                  {inventory.length}
                </span>
              </div>

              {filteredInventoryItems.length === 0 ? (
                <div className="bg-[#0b0b0e] border border-white/10 rounded-2xl p-6 text-center text-xs text-zinc-400">
                  {searchQuery ? "No matching items" : "Vault is empty"}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  {filteredInventoryItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#0c0c10] border border-white/10 hover:border-white/20 rounded-2xl p-3 flex flex-col items-center justify-between text-center transition-all shadow-[0_4px_16px_rgba(0,0,0,0.85)]"
                    >
                      {/* Image / Icon with Count Badge */}
                      <div className="w-20 h-20 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center relative my-1 shadow-inner">
                        {renderCoCItemVisual(item.category, item.id)}

                        <span className="absolute top-1 right-1 bg-white/20 backdrop-blur-md border border-white/30 text-white font-black text-[10px] px-1.5 py-0.2 rounded-full shadow">
                          x{item.count}
                        </span>
                      </div>

                      {/* Title only */}
                      <h4 className="text-xs font-bold text-zinc-100 text-center leading-tight line-clamp-2 h-7 flex items-center justify-center w-full px-1">
                        {item.name}
                      </h4>

                      {/* Use Action Button (Signature Glass Style) */}
                      <button
                        onClick={() => handleUseItem(item)}
                        className="w-full mt-2 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] active:bg-white/[0.20] backdrop-blur-md border border-white/20 hover:border-white/40 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_14px_rgba(0,0,0,0.6)]"
                      >
                        {item.effectType === "unlimited_lives"
                          ? "ACTIVATE"
                          : item.effectType === "xp_boost"
                          ? "BOOST"
                          : "USE"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Owned Skins: 2 in a row */}
            <div>
              <div className="flex items-center justify-between mb-2 text-xs font-black uppercase tracking-wider text-zinc-400">
                <span>SKINS</span>
                <span className="font-mono text-white font-bold">
                  {ownedSkinIds.length}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {filteredOwnedSkins.map((bundle) => {
                  const isEquipped = bundle.id === activeBundleId;

                  return (
                    <div
                      key={bundle.id}
                      className={`rounded-2xl p-3 flex flex-col items-center justify-between text-center border transition-all ${
                        isEquipped
                          ? "bg-[#13131a] border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                          : "bg-[#0c0c10] border-white/10 hover:border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.85)]"
                      }`}
                    >
                      <div className="w-20 h-20 flex items-center justify-center my-1">
                        <AIfluenceAvatar
                          config={bundle.config}
                          size={54}
                          showBackground={false}
                          animate={isEquipped}
                        />
                      </div>

                      <span className="text-xs font-bold text-zinc-100 text-center leading-tight line-clamp-1 w-full mt-1">
                        {bundle.name}
                      </span>

                      <div className="w-full mt-2">
                        {isEquipped ? (
                          <div className="w-full py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase flex items-center justify-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>EQUIPPED</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEquipSkin(bundle.id)}
                            className="w-full py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/20 text-[10px] font-black uppercase cursor-pointer transition-all active:scale-95 shadow-sm"
                          >
                            EQUIP
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
