// Persistent Name Change & Renaming Card Manager
const INITIAL_NAME_SET_KEY = "aifluence_has_set_initial_name_v2";
const NAME_CHANGE_CARDS_KEY = "aifluence_name_change_cards_count_v2";
const STORE_INVENTORY_KEY = "dsa_user_inventory_v1";

export interface NameChangeStatus {
  hasSetInitialName: boolean;
  cardsOwned: number;
  canChangeFree: boolean;
  canChangeWithCard: boolean;
}

export function getNameChangeStatus(): NameChangeStatus {
  try {
    const hasSet = localStorage.getItem(INITIAL_NAME_SET_KEY) === "true";
    let cards = parseInt(localStorage.getItem(NAME_CHANGE_CARDS_KEY) || "0", 10);
    if (isNaN(cards) || cards < 0) cards = 0;

    // Check store inventory if not synced
    try {
      const invRaw = localStorage.getItem(STORE_INVENTORY_KEY);
      if (invRaw) {
        const inv = JSON.parse(invRaw);
        const cardItem = inv.find((item: any) => item.id === "name-change-card" || item.id === "card-rename");
        if (cardItem && cardItem.count > cards) {
          cards = cardItem.count;
          localStorage.setItem(NAME_CHANGE_CARDS_KEY, cards.toString());
        }
      }
    } catch {}

    return {
      hasSetInitialName: hasSet,
      cardsOwned: cards,
      canChangeFree: !hasSet,
      canChangeWithCard: cards > 0,
    };
  } catch (e) {
    return {
      hasSetInitialName: true,
      cardsOwned: 0,
      canChangeFree: false,
      canChangeWithCard: false,
    };
  }
}

export function markInitialNameAsSet(): void {
  try {
    localStorage.setItem(INITIAL_NAME_SET_KEY, "true");
  } catch {}
}

export function addNameChangeCard(count: number = 1): number {
  try {
    const status = getNameChangeStatus();
    const newCount = status.cardsOwned + count;
    localStorage.setItem(NAME_CHANGE_CARDS_KEY, newCount.toString());

    // Sync to store inventory
    try {
      const invRaw = localStorage.getItem(STORE_INVENTORY_KEY);
      let inv: any[] = invRaw ? JSON.parse(invRaw) : [];
      const idx = inv.findIndex((item: any) => item.id === "name-change-card" || item.id === "card-rename");
      if (idx >= 0) {
        inv[idx].count = newCount;
      } else {
        inv.push({
          id: "name-change-card",
          name: "Name Change Card",
          category: "key",
          count: newCount,
          effectType: "rename_pass",
          effectValue: 1,
          iconBg: "bg-amber-500/20 text-amber-300",
        });
      }
      localStorage.setItem(STORE_INVENTORY_KEY, JSON.stringify(inv));
    } catch {}

    return newCount;
  } catch {
    return 1;
  }
}

export function consumeNameChangeCard(): boolean {
  try {
    const status = getNameChangeStatus();
    if (status.canChangeFree) {
      markInitialNameAsSet();
      return true;
    }

    if (status.cardsOwned > 0) {
      const newCount = Math.max(0, status.cardsOwned - 1);
      localStorage.setItem(NAME_CHANGE_CARDS_KEY, newCount.toString());

      // Sync to store inventory
      try {
        const invRaw = localStorage.getItem(STORE_INVENTORY_KEY);
        if (invRaw) {
          let inv: any[] = JSON.parse(invRaw);
          const idx = inv.findIndex((item: any) => item.id === "name-change-card" || item.id === "card-rename");
          if (idx >= 0) {
            inv[idx].count = newCount;
            if (newCount <= 0) {
              inv = inv.filter((item: any) => item.id !== "name-change-card" && item.id !== "card-rename");
            }
            localStorage.setItem(STORE_INVENTORY_KEY, JSON.stringify(inv));
          }
        }
      } catch {}

      return true;
    }

    return false;
  } catch {
    return false;
  }
}
