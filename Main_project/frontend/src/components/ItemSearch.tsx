import { useState, useMemo, useCallback, useEffect } from 'react';
import useInventoryStore from '../store/inventoryStore';
import { useCartStore } from '../store/cartStore';
import { useAiStore } from '../store/aiStore';
import ItemImage from './ItemImage';
import { useSettingsStore, formatPrice } from '../store/settingsStore';
import { motion, AnimatePresence } from 'framer-motion';

function useDebounce(value: string, delay = 150) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function ItemSearch() {
  const items = useInventoryStore((s) => s.items);
  const { currencyCode } = useSettingsStore();
  const { rankItems, frequentlyWith, predictQty } = useAiStore();
  const cart = useCartStore((s) => s.cart);

  const [query, setQuery] = useState('');
  const [quantities, setQuantities] = useState<Record<number, string>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [added, setAdded] = useState<Record<number, boolean>>({});

  const debouncedQuery = useDebounce(query);

  // AI-ranked filtered list
  const filtered = useMemo(
    () => rankItems(items, debouncedQuery),
    [items, debouncedQuery, rankItems]
  );

  // AI: auto-fill predicted quantity when item first appears in view
  useEffect(() => {
    const newQtys: Record<number, string> = {};
    filtered.forEach((item) => {
      if (!(item.id in quantities)) {
        const predicted = predictQty(item.id);
        if (predicted > 1) newQtys[item.id] = String(predicted);
      }
    });
    if (Object.keys(newQtys).length > 0) {
      setQuantities((p) => ({ ...p, ...newQtys }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered]);

  // AI: "frequently bought together" based on current cart
  const suggestions = useMemo(() => {
    if (cart.length === 0) return [];
    const cartIds = new Set(cart.map((ci) => ci.item.id));
    const seen = new Set<number>();
    const result: typeof items = [];
    for (const ci of cart) {
      for (const s of frequentlyWith(ci.item.id, items, 3)) {
        if (!cartIds.has(s.id) && !seen.has(s.id)) {
          seen.add(s.id);
          result.push(s);
        }
      }
    }
    return result.slice(0, 4);
  }, [cart, items, frequentlyWith]);

  const handleAdd = useCallback((itemId: number, overrideQty?: number) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const raw = overrideQty != null ? String(overrideQty) : (quantities[itemId] ?? '');
    const qty = parseInt(raw, 10);
    if (!raw || isNaN(qty) || qty < 1) {
      setErrors((p) => ({ ...p, [itemId]: 'Enter a valid quantity (≥ 1)' }));
      return;
    }
    if (qty > item.stock) {
      setErrors((p) => ({ ...p, [itemId]: `Only ${item.stock} in stock` }));
      return;
    }
    useCartStore.getState().addToCart(item, qty);
    setQuantities((p) => ({ ...p, [itemId]: '' }));
    setErrors((p) => ({ ...p, [itemId]: '' }));
    setAdded((p) => ({ ...p, [itemId]: true }));
    setTimeout(() => setAdded((p) => ({ ...p, [itemId]: false })), 1200);
  }, [items, quantities]);

  return (
    <div className="p-4">
      {/* Search input */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">🔍</span>
        <input
          id="item-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search items... (AI-ranked)"
          aria-label="Search items"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-xl pl-9 pr-8 py-2.5 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">✕</button>
        )}
      </div>

      {/* AI: Frequently bought together */}
      <AnimatePresence>
        {suggestions.length > 0 && !query && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-3">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1">
                <span>🤖</span> AI suggests — often bought together
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleAdd(item.id, predictQty(item.id))}
                    className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                  >
                    <ItemImage name={item.name} size={24} className="w-6 h-6 rounded" />
                    {item.name}
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">+{predictQty(item.id)}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Item list */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-400 dark:text-gray-500">
          <div className="text-3xl mb-2">🔍</div>
          <p className="text-sm">No items match "{query}"</p>
        </div>
      ) : (
        <ul className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {filtered.map((item) => {
              const predicted = predictQty(item.id);
              const hasPrediction = predicted > 1;
              return (
                <motion.li
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className={`flex flex-col sm:flex-row sm:items-center gap-2 rounded-xl p-3 border transition-colors ${
                    item.stock === 0
                      ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 opacity-60'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:bg-green-50 dark:hover:bg-green-900/20'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <ItemImage name={item.name} size={48} className="w-12 h-12 rounded-lg shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 dark:text-gray-100 text-sm truncate">{item.name}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-sm font-semibold text-green-700 dark:text-green-400">{formatPrice(item.price, currencyCode)}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                          item.stock === 0 ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'
                          : item.stock < 10 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                        }`}>
                          {item.stock === 0 ? 'Out of stock' : `${item.stock} left`}
                        </span>
                        {hasPrediction && (
                          <span className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-0.5">
                            🤖 usually ×{predicted}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <label htmlFor={`qty-${item.id}`} className="sr-only">Quantity for {item.name}</label>
                    <input
                      id={`qty-${item.id}`}
                      type="number"
                      min={1}
                      max={item.stock}
                      value={quantities[item.id] ?? ''}
                      onChange={(e) => {
                        setQuantities((p) => ({ ...p, [item.id]: e.target.value }));
                        setErrors((p) => ({ ...p, [item.id]: '' }));
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleAdd(item.id)}
                      placeholder="Qty"
                      disabled={item.stock === 0}
                      className="w-16 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                    />
                    <button
                      onClick={() => handleAdd(item.id)}
                      disabled={item.stock === 0}
                      className={`text-sm px-3 py-1.5 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                        added[item.id]
                          ? 'bg-green-500 text-white scale-95'
                          : 'bg-green-700 hover:bg-green-800 text-white'
                      }`}
                    >
                      {added[item.id] ? '✓' : '+ Add'}
                    </button>
                  </div>
                  {errors[item.id] && (
                    <p className="text-red-500 text-xs w-full">{errors[item.id]}</p>
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
