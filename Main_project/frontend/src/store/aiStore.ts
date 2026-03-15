/**
 * AI Smart Store — local intelligence, no external API needed.
 *
 * Features:
 * 1. Purchase history tracking (persisted)
 * 2. Smart quantity prediction (avg qty per item from history)
 * 3. Frequently bought together (co-occurrence matrix)
 * 4. Search ranking (boost items bought before)
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Item } from '../types';

interface PurchaseRecord {
  itemId: number;
  itemName: string;
  quantity: number;
  sessionItems: number[]; // other item IDs bought in same session
  timestamp: number;
}

interface AiState {
  history: PurchaseRecord[];

  // Record a completed checkout
  recordPurchase: (items: { item: Item; quantity: number }[]) => void;

  // Predict quantity for an item (avg of past purchases, default 1)
  predictQty: (itemId: number) => number;

  // Items frequently bought with a given item (sorted by co-occurrence)
  frequentlyWith: (itemId: number, allItems: Item[], limit?: number) => Item[];

  // Rank items by relevance to query + purchase history
  rankItems: (items: Item[], query: string) => Item[];
}

export const useAiStore = create<AiState>()(
  persist(
    (set, get) => ({
      history: [],

      recordPurchase: (items) => {
        const sessionIds = items.map((i) => i.item.id);
        const records: PurchaseRecord[] = items.map(({ item, quantity }) => ({
          itemId: item.id,
          itemName: item.name,
          quantity,
          sessionItems: sessionIds.filter((id) => id !== item.id),
          timestamp: Date.now(),
        }));
        set((s) => ({ history: [...s.history, ...records].slice(-500) })); // keep last 500
      },

      predictQty: (itemId) => {
        const { history } = get();
        const relevant = history.filter((r) => r.itemId === itemId);
        if (relevant.length === 0) return 1;
        const avg = relevant.reduce((s, r) => s + r.quantity, 0) / relevant.length;
        return Math.max(1, Math.round(avg));
      },

      frequentlyWith: (itemId, allItems, limit = 3) => {
        const { history } = get();
        const coCount: Record<number, number> = {};
        history
          .filter((r) => r.itemId === itemId)
          .forEach((r) => r.sessionItems.forEach((id) => {
            coCount[id] = (coCount[id] ?? 0) + 1;
          }));
        return Object.entries(coCount)
          .sort(([, a], [, b]) => b - a)
          .slice(0, limit)
          .map(([id]) => allItems.find((i) => i.id === Number(id)))
          .filter((i): i is Item => !!i && i.stock > 0);
      },

      rankItems: (items, query) => {
        const { history } = get();
        const q = query.trim().toLowerCase();

        // Build purchase frequency map
        const freq: Record<number, number> = {};
        history.forEach((r) => { freq[r.itemId] = (freq[r.itemId] ?? 0) + 1; });

        const scored = items.map((item) => {
          const name = item.name.toLowerCase();
          let score = 0;

          // Exact match
          if (name === q) score += 100;
          // Starts with query
          else if (name.startsWith(q)) score += 60;
          // Contains query
          else if (name.includes(q)) score += 30;
          // Fuzzy: each query char present in order
          else if (q && fuzzyMatch(name, q)) score += 10;

          // Boost by purchase history
          score += Math.min((freq[item.id] ?? 0) * 5, 40);

          // Penalise out-of-stock
          if (item.stock === 0) score -= 50;

          return { item, score };
        });

        return scored
          .filter((s) => !q || s.score > 0)
          .sort((a, b) => b.score - a.score)
          .map((s) => s.item);
      },
    }),
    { name: 'grocery-ai' }
  )
);

/** Simple fuzzy: all chars of needle appear in haystack in order */
function fuzzyMatch(haystack: string, needle: string): boolean {
  let hi = 0;
  for (const ch of needle) {
    const idx = haystack.indexOf(ch, hi);
    if (idx === -1) return false;
    hi = idx + 1;
  }
  return true;
}
