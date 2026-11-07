import { QuizAngle, UsedQuestionRecord } from "../types/curriculum";

const REGISTRY_STORAGE_KEY = "aifluence_used_questions_registry_v1";

/**
 * Normalizes question text + correct answer for canonical SHA-256 deduplication.
 * Strips punctuation, lowercase, strips numbers, and collapses whitespace.
 */
export function normalizeQuestionString(questionText: string, correctAnswer: string): string {
  const combined = `${questionText} ${correctAnswer}`;
  return combined
    .toLowerCase()
    .replace(/[0-9]/g, "")
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Computes SHA-256 hash in browser or Node environment.
 */
export async function computeQuestionHash(questionText: string, correctAnswer: string): Promise<string> {
  const normalized = normalizeQuestionString(questionText, correctAnswer);
  
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(normalized);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  
  // Fallback simple hash for older environments
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `fallback-${Math.abs(hash).toString(16)}`;
}

/**
 * In-memory / localStorage Used Questions Registry store.
 */
export class UsedQuestionsRegistry {
  private static instance: UsedQuestionsRegistry;
  private records: Map<string, UsedQuestionRecord> = new Map();

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): UsedQuestionsRegistry {
    if (!UsedQuestionsRegistry.instance) {
      UsedQuestionsRegistry.instance = new UsedQuestionsRegistry();
    }
    return UsedQuestionsRegistry.instance;
  }

  private loadFromStorage() {
    try {
      if (typeof localStorage !== "undefined") {
        const saved = localStorage.getItem(REGISTRY_STORAGE_KEY);
        if (saved) {
          const parsed: UsedQuestionRecord[] = JSON.parse(saved);
          parsed.forEach((rec) => this.records.set(rec.question_hash, rec));
        }
      }
    } catch (e) {
      console.warn("Could not load used_questions registry from localStorage", e);
    }
  }

  private saveToStorage() {
    try {
      if (typeof localStorage !== "undefined") {
        const array = Array.from(this.records.values());
        localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(array));
      }
    } catch (e) {
      console.warn("Could not save used_questions registry to localStorage", e);
    }
  }

  public hasHash(hash: string): boolean {
    return this.records.has(hash);
  }

  public getRecord(hash: string): UsedQuestionRecord | undefined {
    return this.records.get(hash);
  }

  public registerQuestion(hash: string, levelId: string, angle: QuizAngle): boolean {
    if (this.records.has(hash)) {
      return false; // Duplicate collision!
    }
    const record: UsedQuestionRecord = {
      question_hash: hash,
      level_id: levelId,
      angle,
      created_at: new Date().toISOString(),
    };
    this.records.set(hash, record);
    this.saveToStorage();
    return true;
  }

  public registerBatch(items: { hash: string; levelId: string; angle: QuizAngle }[]): number {
    let added = 0;
    for (const item of items) {
      if (this.registerQuestion(item.hash, item.levelId, item.angle)) {
        added++;
      }
    }
    return added;
  }

  public getAllRecords(): UsedQuestionRecord[] {
    return Array.from(this.records.values());
  }

  public getStats() {
    return {
      totalQuestionsRegistered: this.records.size,
      byBook: {
        PE: Array.from(this.records.values()).filter((r) => r.level_id.startsWith("PE-")).length,
        FT: Array.from(this.records.values()).filter((r) => r.level_id.startsWith("FT-")).length,
        RAG: Array.from(this.records.values()).filter((r) => r.level_id.startsWith("RAG-")).length,
        AFE: Array.from(this.records.values()).filter((r) => r.level_id.startsWith("AFE-")).length,
      },
    };
  }
}

export const usedQuestionsRegistry = UsedQuestionsRegistry.getInstance();
