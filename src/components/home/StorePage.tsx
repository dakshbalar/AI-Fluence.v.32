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
  ICONS_RAW,
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
  { id: "gem", n: "Gem Pouch", d: "100 gems. Demo purchase.", cash: "$0.99", g: 100, c: "Gems" },
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
  t: "gems" | "xp" | "life" | "shield" | "boost" | "item" | "name";
  n?: number;
  i: string;
  l: string;
  c: string;
  k?: string;
  h?: number;
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
  const isBusyRef = useRef<boolean>(false);

  // FX Stage DOM refs
  const fxRef = useRef<HTMLDivElement | null>(null);
  const stgRef = useRef<HTMLDivElement | null>(null);
  const capRef = useRef<HTMLDivElement | null>(null);

  // State
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

  // Interpolated display state for top bar animation counters
  const [displayState, setDisplayState] = useState<{
    gems: number;
    lives: number;
    xp: number;
    shield: number;
    boost: number;
  }>({
    gems: storeState.gems,
    lives: storeState.lives,
    xp: storeState.xp,
    shield: storeState.shield,
    boost: storeState.boost,
  });

  // Sync displayState with storeState when not animating
  useEffect(() => {
    if (!isBusyRef.current) {
      setDisplayState({
        gems: storeState.gems,
        lives: storeState.lives,
        xp: storeState.xp,
        shield: storeState.shield,
        boost: storeState.boost,
      });
    }
  }, [storeState]);

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

  // Save to localStorage
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
  const isBoostActive = displayState.boost > Date.now();

  useEffect(() => {
    const updateTick = () => {
      const remainingMs = displayState.boost - Date.now();
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
  }, [displayState.boost]);

  const openSheet = (item: StoreItem) => {
    if (isBusyRef.current) return;
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

  // ---------------------------------------------------------------------------
  // ANIMATION ENGINE UTILITIES
  // ---------------------------------------------------------------------------
  const W = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const ic = (id: string, z: number) =>
    `<span class="i" style="width:${z}px;height:${z}px">${ICONS_RAW[id] || ICONS_RAW.gem}</span>`;

  const E = (cls: string, html?: string, css?: string, par?: HTMLElement | null): HTMLElement => {
    const e = document.createElement("div");
    e.className = cls;
    if (html) e.innerHTML = html;
    if (css) e.style.cssText = css;
    (par || stgRef.current!).appendChild(e);
    return e;
  };

  const A = (e: HTMLElement, kf: PropertyIndexedKeyframes | Keyframe[], o?: KeyframeAnimationOptions) => {
    return e.animate(kf, Object.assign({ fill: "forwards", easing: "ease-out" }, o)).finished;
  };

  const big = (id: string, w?: number, src?: string) =>
    E("abs", `<div class="big" style="width:${w || 62}%">${src || ICONS_RAW[id] || ICONS_RAW.gem}</div>`);

  const flash = () => {
    const f = E("flash");
    A(f, [{ opacity: 0.9 }, { opacity: 0 }], { duration: 550 }).then(() => f.remove());
  };

  const ring = (c: string, d?: number) => {
    const r = E("ring", "", "--c:" + c);
    A(r, [{ transform: "scale(.5)", opacity: 0.95 }, { transform: "scale(7)", opacity: 0 }], {
      duration: 1000,
      delay: d || 0,
      fill: "both",
    }).then(() => r.remove());
  };

  const burst = (n: number, cols: string[], R: number, sz: number, icon?: string) => {
    for (let i = 0; i < n; i++) {
      ((index) => {
        const a = Math.random() * 6.28;
        const r = R * (0.4 + Math.random() * 0.8);
        const c = cols[index % cols.length];
        const d = E(
          "dot",
          icon ? ICONS_RAW[icon] : "",
          `width:${sz}px;height:${sz}px;${icon ? "" : `background:${c};box-shadow:0 0 8px ${c}`}`
        );
        A(
          d,
          [
            { transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
            {
              transform: `translate(calc(-50% + ${Math.cos(a) * r}px),calc(-50% + ${
                Math.sin(a) * r - (icon ? 40 : 0)
              }px)) scale(.2)`,
              opacity: 0,
            },
          ],
          { duration: 700 + Math.random() * 600 }
        ).then(() => d.remove());
      })(i);
    }
  };

  const cards = (rw: RewardItem[]) => {
    const c = E("cards");
    rw.forEach((r, i) => {
      const d = E("rc", ic(r.i, 52) + "<b>" + r.l + "</b>", "--c:" + r.c, c);
      A(
        d,
        [
          { transform: `translateY(70px) scale(.2) rotate(${i % 2 ? 25 : -25}deg)`, opacity: 0 },
          { transform: "translateY(-14px) scale(1.12) rotate(0)", opacity: 1, offset: 0.7 },
          { transform: "none", opacity: 1 },
        ],
        { duration: 650, delay: i * 180, easing: "cubic-bezier(.3,1.3,.5,1)", fill: "both" }
      );
    });
    return c;
  };

  const hold = (ms: number) => {
    return new Promise<void>((r) => {
      const fxElem = fxRef.current;
      const t = setTimeout(done, ms);
      function done() {
        clearTimeout(t);
        if (fxElem) fxElem.removeEventListener("click", done);
        r();
      }
      if (fxElem) fxElem.addEventListener("click", done);
    });
  };

  const reveal = async (rw: RewardItem[], txt?: string) => {
    if (capRef.current) capRef.current.textContent = "You got";
    const c = cards(rw);
    await W(rw.length * 180 + 700);
    if (capRef.current) capRef.current.textContent = txt || "Tap to collect";
    await hold(2600);
    return c;
  };

  // Item Specific Animations
  const animChest = async (x: StoreItem, rw: RewardItem[]) => {
    const lv = { chest_silver: 0, chest_gold: 1, chest_deluxe: 2 }[x.id] || 0;
    const col = ["#BBD3F0", "#FFC62E", "#7DF3FF"][lv];
    const rays = E("rays", "", "--c:" + col);
    const glow = E("glow", "", "--c:" + col);
    const b = big(x.id, 66);
    if (lv === 2) {
      rays.style.animation = "spin 8s linear infinite,hue 3s linear infinite";
      glow.style.animation = "hue 3s linear infinite";
    }
    if (capRef.current) capRef.current.textContent = x.n;
    A(b, [{ transform: "translateY(-240px) scale(.6)", opacity: 0 }, { transform: "none", opacity: 1 }], {
      duration: 600,
      easing: "cubic-bezier(.3,1.5,.5,1)",
    });
    await W(650);
    A(glow, [{ opacity: 0 }, { opacity: 0.75 }], { duration: 1500 });
    const s = [3, 5, 7, 10][lv];
    const kf: Keyframe[] = [];
    for (let i = 0; i < 8; i++) {
      kf.push({ transform: `rotate(${(i % 2 ? 1 : -1) * s * (i + 1) / 6}deg) scale(${1 + i * 0.03})` });
    }
    await A(b, kf, { duration: 1300 + lv * 300, easing: "linear" });
    flash();
    ring(col);
    ring("#fff", 120);
    if (lv > 0) ring(col, 260);
    if (lv > 1) {
      ring("#fff", 400);
      A(
        stgRef.current!,
        [
          { transform: "translate(0,0)" },
          { transform: "translate(-10px,8px)" },
          { transform: "translate(10px,-8px)" },
          { transform: "translate(0,0)" },
        ],
        { duration: 350 }
      );
    }
    burst([26, 44, 76][lv], [col, "#fff", lv === 1 ? "#FFE27A" : "#9CFFF2"], 220 + lv * 40, 8);
    A(b, [{ transform: "scale(1.25)", opacity: 1 }, { transform: "scale(2.2)", opacity: 0 }], { duration: 500 });
    A(rays, [{ opacity: 0 }, { opacity: 0.7 }], { duration: 400 });
    A(glow, [{ opacity: 0.75, transform: "scale(1)" }, { opacity: 1, transform: "scale(1.25)" }], { duration: 500 });
    await W(450);
    const c = await reveal(rw);
    return c;
  };

  const animWheel = async (x: StoreItem, rw: RewardItem[]) => {
    const col = "#4FA3FF";
    const rays = E("rays", "", "--c:" + col);
    const glow = E("glow", "", "--c:" + col);
    const b = big("wheel", 72, ICONS_RAW.wheel.replace(/<polygon points="26,1[^>]*>/, ""));
    const pt = E(
      "",
      '<svg viewBox="0 0 24 30"><polygon points="2,2 22,2 12,26" fill="#FFE27A" stroke="#8a5a00" stroke-width="2" stroke-linejoin="round"/></svg>',
      "position:absolute;left:50%;top:3%;width:28px;margin-left:-14px;z-index:3;transform-origin:50% 20%"
    );
    if (capRef.current) capRef.current.textContent = "Spin!";
    A(glow, [{ opacity: 0 }, { opacity: 0.5 }], { duration: 800 });
    A(b, [{ transform: "scale(.3) rotate(0)", opacity: 0 }, { transform: "scale(1) rotate(0)", opacity: 1 }], {
      duration: 500,
    });
    await W(500);
    A(pt, [{ transform: "rotate(0)" }, { transform: "rotate(-22deg)" }, { transform: "rotate(0)" }], {
      duration: 170,
      iterations: 22,
    });
    await A(
      b,
      [{ transform: "rotate(0)" }, { transform: `rotate(${360 * 5 + rnd(0, 359)}deg)` }],
      { duration: 3800, easing: "cubic-bezier(.12,.6,.1,1)" }
    );
    flash();
    ring(col);
    burst(36, [col, "#fff", "#FFE27A"], 240, 8);
    A(rays, [{ opacity: 0 }, { opacity: 0.6 }], { duration: 400 });
    A(b, [{ transform: "scale(1)", opacity: 1 }, { transform: "scale(1.6)", opacity: 0 }], { duration: 500 });
    pt.remove();
    await W(450);
    return await reveal(rw);
  };

  const animPotion = async (x: StoreItem, rw: RewardItem[]) => {
    const fl = x.id === "flask";
    const cs = fl ? ["#8EC5FF", "#0057E7", "#fff"] : ["#7DFFE0", "#00A8FF", "#FF9DE6"];
    const col = cs[0];
    const glow = E("glow", "", "--c:" + col);
    const b = big(x.id, 56);
    if (!fl) glow.style.animation = "hue 3s linear infinite";
    if (capRef.current) capRef.current.textContent = x.n;
    A(glow, [{ opacity: 0 }, { opacity: fl ? 0.35 : 0.7 }], { duration: 1400 });
    A(b, [{ transform: "translateY(-220px) scale(.7)", opacity: 0 }, { transform: "none", opacity: 1 }], {
      duration: 550,
      easing: "cubic-bezier(.3,1.5,.5,1)",
    });
    await W(600);
    const cr = E(
      "abs",
      '<svg viewBox="0 0 64 64" style="width:56%;opacity:0"><path d="M32 16 L28 27 L36 33 L30 45 L34 55 M28 27 L20 31 M36 33 L45 36" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>'
    );
    setTimeout(() => {
      if (cr.firstChild) (cr.firstChild as HTMLElement).style.opacity = "1";
    }, 800);
    const kf: Keyframe[] = [];
    for (let i = 0; i < 12; i++) {
      kf.push({ transform: `translate(${(i % 2 ? 1 : -1) * (i + 1) * 1.2}px,0) rotate(${(i % 2 ? 1 : -1) * (i + 1) * 1.4}deg)` });
    }
    await A(b, kf, { duration: 1500, easing: "linear" });
    b.style.visibility = "hidden";
    cr.remove();
    flash();
    ring(col);
    if (!fl) {
      ring("#fff", 150);
      burst(30, cs, 230, 7);
    }
    for (let i = 0; i < 16; i++) {
      (() => {
        const a = Math.random() * 6.28;
        const dx = Math.cos(a) * (80 + Math.random() * 120);
        const dy = Math.sin(a) * (60 + Math.random() * 80) - 70;
        const p = [[0, 0], [50, 0], [100, 30], [30, 100]]
          .slice(0, 3 + rnd(0, 1))
          .map((q) => `${q[0] + rnd(-15, 15)}% ${q[1] + rnd(-5, 15)}%`)
          .join(",");
        const sh = E(
          "shard",
          "",
          `background:linear-gradient(135deg,${cs[0]},${cs[1]});clip-path:polygon(${p});opacity:.95`
        );
        A(
          sh,
          [
            { transform: "translate(-50%,-50%) rotate(0)", opacity: 1 },
            {
              transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) rotate(${rnd(-300, 300)}deg)`,
              opacity: 1,
              offset: 0.4,
            },
            {
              transform: `translate(calc(-50% + ${dx * 1.4}px),calc(-50% + ${dy + 300}px)) rotate(${rnd(-600, 600)}deg)`,
              opacity: 0,
            },
          ],
          { duration: 1200, easing: "ease-in" }
        ).then(() => sh.remove());
      })();
    }
    burst(14, [cs[1], cs[0], "#fff"], 150, 12);
    await W(500);
    return await reveal(rw);
  };

  const animHeart = async (x: StoreItem, rw: RewardItem[]) => {
    const col = "#FF4B5C";
    const glow = E("glow", "", "--c:" + col);
    const b = big("heart", 54);
    if (capRef.current) capRef.current.textContent = "Life restored";
    A(b, [{ transform: "scale(0)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], {
      duration: 500,
      easing: "cubic-bezier(.3,1.6,.5,1)",
    });
    A(glow, [{ opacity: 0 }, { opacity: 0.7 }], { duration: 1500 });
    await W(600);
    for (let i = 1; i <= 3; i++) {
      ring(col, 0);
      burst(6 * i, [col], 110 + i * 20, 26, "heart");
      await A(b, [{ transform: "scale(1)" }, { transform: `scale(${1 + i * 0.14})` }, { transform: "scale(1)" }], {
        duration: 480,
        easing: "ease-in-out",
      });
    }
    flash();
    ring("#fff");
    burst(30, [col, "#FFB3BA", "#fff"], 220, 8);
    await W(300);
    A(b, [{ transform: "scale(1.4)", opacity: 1 }, { transform: "scale(1.9)", opacity: 0 }], { duration: 400 });
    return await reveal(rw);
  };

  const animShield = async (x: StoreItem, rw: RewardItem[]) => {
    const col = "#4FA3FF";
    const dome = E("dome");
    const b = big("shield_streak", 58);
    if (capRef.current) capRef.current.textContent = "Streak protected";
    await A(
      b,
      [
        { transform: "scale(4.5)", opacity: 0 },
        { transform: "scale(.92)", opacity: 1, offset: 0.7 },
        { transform: "scale(1)", opacity: 1 },
      ],
      { duration: 750, easing: "cubic-bezier(.5,0,.9,.6)" }
    );
    A(
      stgRef.current!,
      [
        { transform: "translate(0,0)" },
        { transform: "translate(-9px,7px)" },
        { transform: "translate(9px,-7px)" },
        { transform: "translate(0,0)" },
      ],
      { duration: 320 }
    );
    ring(col);
    ring("#fff", 140);
    ring(col, 280);
    flash();
    burst(34, [col, "#fff", "#9CFFF2"], 230, 8);
    A(dome, [{ transform: "scale(.2)", opacity: 0.9 }, { transform: "scale(5)", opacity: 0 }], { duration: 1300 });
    await A(
      b,
      [
        { transform: "scale(1)", filter: "brightness(1)" },
        { transform: "scale(1.15)", filter: "brightness(1.6)" },
        { transform: "scale(1)", filter: "brightness(1)" },
      ],
      { duration: 800 }
    );
    return await reveal(rw);
  };

  const animStone = async (x: StoreItem, rw: RewardItem[]) => {
    const col = { time_1h: "#7DF3FF", time_3h: "#6FB4FF", time_24h: "#8A9BFF" }[x.id] || "#7DF3FF";
    const glow = E("glow", "", "--c:" + col);
    const rg = E(
      "abs",
      `<svg viewBox="0 0 100 100" style="width:92%"><circle cx="50" cy="50" r="46" fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round" stroke-dasharray="289" stroke-dashoffset="289" transform="rotate(-90 50 50)"/></svg>`
    );
    const b = big(x.id, 54);
    if (capRef.current) capRef.current.textContent = x.n;
    A(glow, [{ opacity: 0 }, { opacity: 0.6 }], { duration: 1500 });
    A(b, [{ transform: "translateY(-200px) scale(.5)", opacity: 0 }, { transform: "none", opacity: 1 }], {
      duration: 550,
      easing: "cubic-bezier(.3,1.5,.5,1)",
    });
    await W(550);
    if (rg.firstChild && (rg.firstChild as HTMLElement).firstChild) {
      ((rg.firstChild as HTMLElement).firstChild as HTMLElement).animate(
        [{ strokeDashoffset: 289 }, { strokeDashoffset: 0 }],
        { duration: 1700, fill: "forwards", easing: "ease-in-out" }
      );
    }
    setTimeout(() => {
      burst(14, [col, "#fff"], 130, 7);
      burst(6, [col], 120, 22, "xp");
    }, 800);
    await A(
      b,
      [
        { transform: "perspective(600px) rotateY(0) scale(1)" },
        { transform: "perspective(600px) rotateY(1080deg) scale(1.18)" },
      ],
      { duration: 1800, easing: "cubic-bezier(.3,.1,.2,1)" }
    );
    flash();
    ring(col);
    ring("#fff", 140);
    burst(32, [col, "#fff"], 230, 8);
    const t = E("abs", `<div style="font-weight:900;font-size:4.5rem;color:#fff;text-shadow:0 0 30px ${col}">2×</div>`);
    A(t, [{ transform: "scale(0)", opacity: 0 }, { transform: "scale(1.3)", opacity: 1, offset: 0.5 }, { transform: "scale(1)", opacity: 1 }], {
      duration: 600,
      easing: "cubic-bezier(.3,1.5,.5,1)",
    });
    A(b, [{ transform: "scale(1.18)", opacity: 1 }, { transform: "scale(.7)", opacity: 0 }], { duration: 500 });
    await W(900);
    A(t, [{ opacity: 1 }, { opacity: 0 }], { duration: 300 });
    await W(300);
    return await reveal(rw);
  };

  const animIdCard = async (x: StoreItem, rw: RewardItem[]) => {
    const col = "#FFE27A";
    const glow = E("glow", "", "--c:" + col);
    const b = big("id_card", 72);
    if (capRef.current) capRef.current.textContent = "Name changed";
    A(glow, [{ opacity: 0 }, { opacity: 0.55 }], { duration: 1500 });
    await A(
      b,
      [
        { transform: "translateY(220px) perspective(700px) rotateY(0) scale(.5)", opacity: 0 },
        { transform: "translateY(0) perspective(700px) rotateY(360deg) scale(1.15)", opacity: 1, offset: 0.6 },
        { transform: "translateY(-8px) perspective(700px) rotateY(720deg) scale(1)", opacity: 1 },
      ],
      { duration: 1700, easing: "cubic-bezier(.3,.8,.3,1)" }
    );
    flash();
    ring(col);
    burst(28, [col, "#fff", "#4FA3FF"], 220, 8);
    await W(300);
    A(b, [{ opacity: 1 }, { opacity: 0 }], { duration: 300 });
    return await reveal(rw);
  };

  // Compute Reward Items
  const computeRewards = (x: StoreItem, nm?: string): RewardItem[] => {
    const r: RewardItem[] = [];
    const g = (n: number) => r.push({ t: "gems", n, i: "gem", l: `+${n} Gems`, c: "#4FA3FF" });
    const xp = (n: number, c?: string) => r.push({ t: "xp", n, i: "xp", l: `+${n} XP`, c: c || "#FFC62E" });

    if (x.r) {
      const awardedGems = rnd(x.r[0], x.r[1]);
      g(awardedGems);
      if (x.id === "chest_gold") xp(rnd(20, 60));
      if (x.id === "chest_deluxe") {
        xp(rnd(50, 150), "#7DF3FF");
        const pOptions = ["time_1h", "heart", "shield_streak", "flask"];
        const p = pOptions[rnd(0, 3)];
        const it = IT.find((y) => y.id === p);
        if (it) {
          r.push({ t: "item", k: it.k || it.id, i: it.id, l: it.n, c: "#9CFFF2" });
        }
      }
    } else if (x.xp) {
      xp(x.xp, "#4FA3FF");
    } else if (x.id === "heart") {
      r.push({ t: "life", n: 1, i: "heart", l: "+1 Life", c: "#FF4B5C" });
    } else if (x.id === "shield_streak") {
      r.push({ t: "shield", n: 1, i: "shield_streak", l: "Streak Shield", c: "#4FA3FF" });
    } else if (x.h) {
      r.push({ t: "boost", h: x.h, i: x.id, l: `2× XP · ${x.h}H`, c: "#7DF3FF" });
    } else {
      r.push({ t: "name", i: "id_card", l: nm || storeState.name, c: "#FFE27A" });
    }
    return r;
  };

  // Flying Particles Animation to Target Header Pills
  const flyParticle = (id: string, f: { x: number; y: number }, sel: string, n: number, sz: number, cb: () => void) => {
    const ps: Promise<void>[] = [];
    for (let i = 0; i < n; i++) {
      ps.push(
        new Promise<void>((res) => {
          const p = document.createElement("div");
          p.className = "fl";
          p.style.cssText = `width:${sz}px;height:${sz}px`;
          p.innerHTML = ICONS_RAW[id] || ICONS_RAW.gem;
          document.body.appendChild(p);

          const targetElem = document.querySelector(sel);
          let tx = window.innerWidth / 2;
          let ty = 40;
          if (targetElem) {
            const r = targetElem.getBoundingClientRect();
            tx = r.left + r.width / 2 - sz / 2;
            ty = r.top + r.height / 2 - sz / 2;
          }

          const sx = f.x - sz / 2;
          const sy = f.y - sz / 2;
          const a = Math.random() * 6.28;
          const d = 40 + Math.random() * 70;
          const mx = sx + Math.cos(a) * d;
          const my = sy + Math.sin(a) * d;

          p.animate(
            [
              { transform: `translate(${sx}px,${sy}px) scale(.4)`, opacity: 0 },
              {
                transform: `translate(${mx}px,${my}px) scale(1.25)`,
                opacity: 1,
                offset: 0.25,
                easing: "cubic-bezier(.5,0,.9,.5)",
              },
              { transform: `translate(${tx}px,${ty}px) scale(.5)`, opacity: 1 },
            ],
            { duration: 1000 + Math.random() * 300, delay: i * 70, fill: "both", easing: "ease-out" }
          ).finished.then(() => {
            p.remove();
            cb();
            if (targetElem) {
              targetElem.classList.remove("bump");
              // Trigger reflow
              void (targetElem as HTMLElement).offsetWidth;
              targetElem.classList.add("bump");
            }
            res();
          });
        })
      );
    }
    return Promise.all(ps);
  };

  const collectRewards = async (rw: RewardItem[], cd: HTMLElement, currentStoreStateSnapshot: StoreState) => {
    const cs = Array.from(cd.children) as HTMLElement[];
    const fr = cs.map((c) => {
      const r = c.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });

    if (fxRef.current) fxRef.current.classList.add("out");
    if (capRef.current) capRef.current.style.opacity = "0";
    cs.forEach((c) => {
      A(c, [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(.4)" }], { duration: 350 });
    });
    await W(250);

    const ps: Promise<unknown>[] = [];
    let accumGems = currentStoreStateSnapshot.gems;
    let accumXp = currentStoreStateSnapshot.xp;

    rw.forEach((r, i) => {
      const f = fr[i] || { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      if (r.t === "gems" && r.n) {
        const totalAwarded = r.n;
        const n = Math.min(14, Math.max(5, Math.round(totalAwarded / 15)));
        const gemChunk = totalAwarded / n;
        ps.push(
          flyParticle("gem", f, "#pg", n, 34, () => {
            accumGems += gemChunk;
            setDisplayState((prev) => ({ ...prev, gems: Math.round(accumGems) }));
          })
        );
      } else if (r.t === "xp" && r.n) {
        const totalAwarded = r.n;
        const n = Math.min(10, Math.max(4, Math.round(totalAwarded / 15)));
        const xpChunk = totalAwarded / n;
        ps.push(
          flyParticle("xp", f, "#px", n, 34, () => {
            accumXp += xpChunk;
            setDisplayState((prev) => ({ ...prev, xp: Math.round(accumXp) }));
          })
        );
      } else if (r.t === "life") {
        ps.push(
          flyParticle("heart", f, "#ph", 1, 44, () => {
            setDisplayState((prev) => ({ ...prev, lives: Math.min(5, prev.lives + 1) }));
          })
        );
      } else if (r.t === "shield") {
        ps.push(
          flyParticle("shield_streak", f, "#ps", 1, 46, () => {
            setDisplayState((prev) => ({ ...prev, shield: prev.shield + 1 }));
          })
        );
      } else if (r.t === "boost" && r.h) {
        const boostHours = r.h;
        ps.push(
          flyParticle(r.i, f, "#bst", 1, 46, () => {
            setDisplayState((prev) => ({
              ...prev,
              boost: Math.max(Date.now(), prev.boost) + boostHours * 3600000,
            }));
          })
        );
      } else if (r.t === "item") {
        ps.push(flyParticle(r.i, f, "#t2", 1, 40, () => {}));
      } else if (r.t === "name") {
        ps.push(flyParticle("id_card", f, "#who", 1, 40, () => {}));
      }
    });

    await Promise.all(ps);
  };

  // Main Item Consumption Handler with Full FX Animation Stage
  const handleUse = async () => {
    if (!cur || isBusyRef.current) return;
    const x = cur;
    const itemKey = x.k || x.id;
    const currentQty = storeState.inv[itemKey] || 0;
    if (currentQty <= 0) {
      closeSheet();
      return;
    }

    if (x.id === "heart" && storeState.lives >= 5) {
      showInternalToast("Lives already full");
      return;
    }

    let nm: string | undefined = undefined;
    if (x.id === "id_card") {
      const promptRes = prompt("New player name", storeState.name);
      if (!promptRes || !promptRes.trim()) return;
      nm = promptRes.trim().slice(0, 14);
    }

    isBusyRef.current = true;
    closeSheet();

    // 1. Consume from inventory state
    const nextInv = { ...storeState.inv, [itemKey]: currentQty - 1 };

    // 2. Generate rewards
    const rw = computeRewards(x, nm);

    // 3. Apply state changes
    let updatedGems = storeState.gems;
    let updatedXp = storeState.xp;
    let updatedLives = storeState.lives;
    let updatedShield = storeState.shield;
    let updatedBoost = storeState.boost;
    let updatedName = storeState.name;

    rw.forEach((v) => {
      if (v.t === "gems" && v.n) {
        updatedGems += v.n;
        if (onAddDiamonds) onAddDiamonds(v.n);
        else if (addStoreDiamonds) addStoreDiamonds(v.n);
      } else if (v.t === "xp" && v.n) {
        updatedXp += v.n;
        if (onAddXP) onAddXP(v.n);
        else if (addStoreXp) addStoreXp(v.n);
      } else if (v.t === "life") {
        updatedLives = Math.min(5, updatedLives + 1);
      } else if (v.t === "shield") {
        updatedShield += 1;
      } else if (v.t === "boost" && v.h) {
        updatedBoost = Math.max(Date.now(), updatedBoost) + v.h * 3600000;
        if (onActivateUnlimitedLives) onActivateUnlimitedLives(v.h);
      } else if (v.t === "item" && v.k) {
        nextInv[v.k] = (nextInv[v.k] || 0) + 1;
      } else if (v.t === "name" && nm) {
        updatedName = nm;
        if (updateProfile) updateProfile({ username: nm });
      }
    });

    const newStoreState: StoreState = {
      gems: updatedGems,
      lives: updatedLives,
      xp: updatedXp,
      name: updatedName,
      shield: updatedShield,
      boost: updatedBoost,
      inv: nextInv,
    };

    setStoreState(newStoreState);
    saveState(newStoreState);

    // Select animation function
    const animFn =
      x.id === "wheel"
        ? animWheel
        : x.r
        ? animChest
        : x.xp
        ? animPotion
        : x.id === "heart"
        ? animHeart
        : x.id === "shield_streak"
        ? animShield
        : x.h
        ? animStone
        : animIdCard;

    // Show FX Overlay
    if (fxRef.current) fxRef.current.className = "on";
    if (stgRef.current) stgRef.current.innerHTML = "";
    if (capRef.current) {
      capRef.current.style.opacity = "1";
      capRef.current.textContent = "";
    }

    try {
      const cd = await animFn(x, rw);
      await collectRewards(rw, cd, storeState);
    } catch (e) {
      console.warn("FX Animation interrupted", e);
    }

    // Reset FX Overlay Stage
    if (fxRef.current) fxRef.current.className = "";
    if (stgRef.current) stgRef.current.innerHTML = "";

    // Sync displayState to final state
    setDisplayState({
      gems: newStoreState.gems,
      lives: newStoreState.lives,
      xp: newStoreState.xp,
      shield: newStoreState.shield,
      boost: newStoreState.boost,
    });

    isBusyRef.current = false;
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

        /* FX STAGE ANIMATION STYLES */
        #fx {
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
        }
        #fx.on {
          display: flex;
        }
        #fx.out {
          background: rgba(2, 5, 12, 0);
        }
        #stg {
          position: relative;
          width: min(78vw, 320px);
          height: min(78vw, 320px);
          display: grid;
          place-items: center;
        }
        .abs {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          pointer-events: none;
        }
        .big {
          position: relative;
        }
        .big svg {
          width: 100%;
          height: auto;
          display: block;
          filter: drop-shadow(0 0 22px rgba(125, 190, 255, 0.55));
        }
        .rays {
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
          animation: spin 8s linear infinite;
        }
        .glow {
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
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes hue {
          to {
            filter: hue-rotate(360deg);
          }
        }
        .cap {
          margin-top: 22px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          text-align: center;
          min-height: 1.6em;
          font-size: 1rem;
          transition: opacity 0.3s;
        }
        .cards {
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
        .rc {
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
        .rc b {
          font-weight: 800;
          font-size: 0.78rem;
          text-transform: uppercase;
          margin-top: 6px;
          line-height: 1.15;
        }
        .rc::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, transparent 35%, rgba(255, 255, 255, 0.45) 50%, transparent 65%);
          transform: translateX(-120%);
          animation: shn 1.5s 0.7s infinite;
        }
        @keyframes shn {
          to {
            transform: translateX(120%);
          }
        }
        .fl {
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
          pointer-events: none;
          will-change: transform;
        }
        .fl svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        .bump {
          animation: bmp 0.35s;
        }
        @keyframes bmp {
          50% {
            transform: scale(1.22);
            box-shadow: 0 0 24px #4FA3FF;
          }
        }
        .ring {
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
        .dome {
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
        .dot {
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 50%;
          pointer-events: none;
        }
        .dot svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        .shard {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 38px;
          height: 38px;
          pointer-events: none;
        }
        .flash {
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
            <span>{displayState.gems}</span>
          </div>
          <div className="scholar-pill" id="ph">
            <HeartSvg size={22} />
            <span>{displayState.lives}/5</span>
          </div>
          <div className="scholar-pill" id="px">
            <XpSvg size={22} />
            <span>{displayState.xp}</span>
          </div>
          <div className="scholar-pill" id="ps">
            <ShieldStreakSvg size={22} />
            <span>{displayState.shield}</span>
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
          <div className="scholar-boost on" id="bst">
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

      {/* TOAST PILL */}
      {isToastActive && (
        <div className="scholar-toast">
          {toastMessage}
        </div>
      )}

      {/* FULLSCREEN ANIMATION FX STAGE OVERLAY */}
      <div id="fx" ref={fxRef}>
        <div id="stg" ref={stgRef}></div>
        <div className="cap" id="cap" ref={capRef}></div>
      </div>
    </div>
  );
};
