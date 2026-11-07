import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { loadStoredStudentProfile } from "../utils/engagementStore";

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  icon: string;
  desc: string;
  category: string;
  acquiredAt: string;
}

export interface UserInventoryDoc {
  userId: string;
  items: Record<string, InventoryItem>;
  lastUpdatedAt: string;
}

const LOCAL_STORAGE_KEY_PREFIX = "scholar_user_inventory_";

export function getStoredInventory(userId: string): InventoryItem[] {
  try {
    const key = `${LOCAL_STORAGE_KEY_PREFIX}${userId || "guest"}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Error reading stored inventory:", e);
  }
  // Default starter inventory items
  return [
    {
      id: "streak-shield",
      name: "Streak Shield",
      quantity: 1,
      icon: "shield",
      desc: "Protects your daily learning flame streak.",
      category: "Protection",
      acquiredAt: new Date().toISOString(),
    },
  ];
}

export function saveStoredInventory(userId: string, items: InventoryItem[]): void {
  try {
    const key = `${LOCAL_STORAGE_KEY_PREFIX}${userId || "guest"}`;
    localStorage.setItem(key, JSON.stringify(items));
  } catch (e) {
    console.error("Error saving inventory:", e);
  }
}

export async function fetchUserInventory(userId?: string): Promise<InventoryItem[]> {
  const targetUid = userId || auth.currentUser?.uid || loadStoredStudentProfile()?.userId || "guest_user";
  const docRef = doc(db, "user_inventories", targetUid);

  try {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as UserInventoryDoc;
      if (data && data.items) {
        const itemsArray = Object.values(data.items);
        saveStoredInventory(targetUid, itemsArray);
        return itemsArray;
      }
    }
  } catch (e) {
    console.warn("Could not fetch inventory from Firestore, using local:", e);
  }

  return getStoredInventory(targetUid);
}

export async function addItemToInventory(
  userId: string | undefined,
  newItem: { id: string; name: string; quantity?: number; icon?: string; desc?: string; category?: string }
): Promise<InventoryItem[]> {
  const targetUid = userId || auth.currentUser?.uid || loadStoredStudentProfile()?.userId || "guest_user";
  const currentItems = await fetchUserInventory(targetUid);

  const existingIndex = currentItems.findIndex((item) => item.id === newItem.id);
  const qtyToAdd = newItem.quantity ?? 1;

  let updatedItems: InventoryItem[];
  if (existingIndex >= 0) {
    updatedItems = currentItems.map((item, idx) =>
      idx === existingIndex ? { ...item, quantity: item.quantity + qtyToAdd } : item
    );
  } else {
    updatedItems = [
      ...currentItems,
      {
        id: newItem.id,
        name: newItem.name,
        quantity: qtyToAdd,
        icon: newItem.icon || "card",
        desc: newItem.desc || "Collected item",
        category: newItem.category || "Bag",
        acquiredAt: new Date().toISOString(),
      },
    ];
  }

  saveStoredInventory(targetUid, updatedItems);

  // Sync to Firestore
  try {
    const docRef = doc(db, "user_inventories", targetUid);
    const itemsRecord: Record<string, InventoryItem> = {};
    updatedItems.forEach((it) => {
      itemsRecord[it.id] = it;
    });

    const docPayload: UserInventoryDoc = {
      userId: targetUid,
      items: itemsRecord,
      lastUpdatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, docPayload, { merge: true });
  } catch (e) {
    console.warn("Could not sync inventory to Firestore:", e);
  }

  return updatedItems;
}

export async function consumeInventoryItem(
  userId: string | undefined,
  itemId: string
): Promise<InventoryItem[]> {
  const targetUid = userId || auth.currentUser?.uid || loadStoredStudentProfile()?.userId || "guest_user";
  const currentItems = await fetchUserInventory(targetUid);

  const updatedItems = currentItems
    .map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    })
    .filter((item) => item.quantity > 0);

  saveStoredInventory(targetUid, updatedItems);

  try {
    const docRef = doc(db, "user_inventories", targetUid);
    const itemsRecord: Record<string, InventoryItem> = {};
    updatedItems.forEach((it) => {
      itemsRecord[it.id] = it;
    });

    const docPayload: UserInventoryDoc = {
      userId: targetUid,
      items: itemsRecord,
      lastUpdatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, docPayload, { merge: true });
  } catch (e) {
    console.warn("Could not sync inventory consumption to Firestore:", e);
  }

  return updatedItems;
}
