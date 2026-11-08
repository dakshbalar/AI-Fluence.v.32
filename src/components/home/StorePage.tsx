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

const IT: StoreItem[] = [
  { id: "chest_silver", n: "Silver Chest", d: "Silver loot with a gem reward of 20–80.", p: 100, c: "Chests", r: [20, 80] },
  { id: "chest_gold", n: "Gold Chest", d: "Gold loot with a gem reward of 80–220.", p: 250, c: "Chests", r: [80, 220] },
  { id: "chest_deluxe", n: "Deluxe Epic Stash", d: "Holographic vault. 200–600 gems inside.", p: 600, c: "Chests", r: [200, 600] },
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

  // Sync external diamonds if changed
  useEffect(() => {
    if (typeof diamonds === "number" && diamonds !== storeState.gems) {
      setStoreState((prev) => ({ ...prev, gems: diamonds }));
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

  useEffect(() => {
    const updateTick = () => {
      const remainingMs = storeState.boost - Date.now();
      if (remainingMs > 0) {
        const s = Math.floor(remainingMs / 1000);
        const pad = (n: number) => (n < 10 ? "0" : "") + n;
        const formatted = `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
        setBoostRemaining(formatted);
      } else {
        setBoostRemaining("");
      }
    };
    updateTick();
    const interval = setInterval(updateTick, 1000);
    return () => clearInterval(interval);
  }, [storeState.boost]);

  const openSheet = (item: StoreItem) => {
    setCur(item);
    setQty(1);
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  // Buy item flow
  const handleBuy = () => {
    if (!cur) return;
    const x = cur;
    const itemKey = x.k || x.id;

    if (x.g) {
      // Demo cash purchase
      const addedGems = x.g * qty;
      const updatedGems = storeState.gems + addedGems;
      const updated: StoreState = { ...storeState, gems: updatedGems };
      setStoreState(updated);
      saveState(updated);
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
      showInternalToast(`${qty} × ${x.n} added to inventory`);
    }

    closeSheet();
  };

  // Helper random
  const rnd = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));

  // Use item flow
  const handleUse = () => {
    if (!cur) return;
    const x = cur;
    const itemKey = x.k || x.id;
    const currentQty = storeState.inv[itemKey] || 0;
    if (currentQty <= 0) {
      closeSheet();
      return;
    }

    let msg = "";
    let updatedGems = storeState.gems;
    let updatedXp = storeState.xp;
    let updatedLives = storeState.lives;
    let updatedShield = storeState.shield;
    let updatedBoost = storeState.boost;

    if (x.r) {
      const awardedGems = rnd(x.r[0], x.r[1]);
      updatedGems += awardedGems;
      if (onAddDiamonds) onAddDiamonds(awardedGems);
      else if (addStoreDiamonds) addStoreDiamonds(awardedGems);
      msg = `${x.n}: +${awardedGems} gems`;
    } else if (x.xp) {
      updatedXp += x.xp;
      if (onAddXP) onAddXP(x.xp);
      else if (addStoreXp) addStoreXp(x.xp);
      msg = `+${x.xp} XP`;
    } else if (x.id === "heart") {
      if (updatedLives >= 5) {
        showInternalToast("Lives already full");
        return;
      }
      updatedLives += 1;
      msg = "+1 life";
    } else if (x.id === "shield_streak") {
      updatedShield += 1;
      msg = "Streak shield armed";
    } else if (x.h) {
      updatedBoost = Math.max(Date.now(), updatedBoost) + x.h * 3600000;
      msg = `2× XP for ${x.h}h`;
      if (onActivateUnlimitedLives) onActivateUnlimitedLives(x.h);
    } else if (x.id === "id_card") {
      setRenameInput(storeState.name);
      setIsRenameOpen(true);
      return;
    }

    const nextInv = { ...storeState.inv, [itemKey]: currentQty - 1 };
    const updated: StoreState = {
      ...storeState,
      gems: updatedGems,
      xp: updatedXp,
      lives: updatedLives,
      shield: updatedShield,
      boost: updatedBoost,
      inv: nextInv,
    };
    setStoreState(updated);
    saveState(updated);
    showInternalToast(msg);

    if (nextInv[itemKey] > 0) {
      // Refresh current sheet
      setQty(1);
    } else {
      closeSheet();
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
      `}</style>

      <main className="scholar-store-main">
        {/* TOP STATUS BAR PILLS */}
        <div className="scholar-bar" id="bar">
          <div className="scholar-pill g">
            <GemSvg size={22} />
            <span>{storeState.gems}</span>
          </div>
          <div className="scholar-pill">
            <HeartSvg size={22} />
            <span>{storeState.lives}/5</span>
          </div>
          <div className="scholar-pill">
            <XpSvg size={22} />
            <span>{storeState.xp}</span>
          </div>
          <div className="scholar-pill">
            <ShieldStreakSvg size={22} />
            <span>{storeState.shield}</span>
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
            onClick={() => setTab(1)}
          >
            Store
          </button>
          <button
            id="t2"
            className={tab === 2 ? "on" : ""}
            onClick={() => setTab(2)}
          >
            Inventory
          </button>
        </div>

        {/* 2X XP BOOST BANNER */}
        {isBoostActive && (
          <div className="scholar-boost" id="bst">
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
                onClick={() => setCat(c)}
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
                    onClick={() => setTab(1)}
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

      {/* TOAST PILL */}
      {isToastActive && (
        <div className="scholar-toast">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
