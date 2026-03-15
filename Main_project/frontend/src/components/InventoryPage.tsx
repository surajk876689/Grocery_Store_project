import { useEffect, useState, useCallback } from 'react';
import useInventoryStore from '../store/inventoryStore';
import type { Item, SortConfig } from '../types';
import InventoryTable from './InventoryTable';
import SearchBar from './SearchBar';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import { useSettingsStore, formatPrice } from '../store/settingsStore';

export default function InventoryPage() {
  const { items, loading, fetchItems } = useInventoryStore();
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: 'name', direction: 'asc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSort = useCallback((column: keyof Item) => {
    setSortConfig((prev: SortConfig) => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const filtered = searchQuery
    ? items.filter((item: Item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : items;

  const sorted = [...filtered].sort((a, b) => {
    const { column, direction } = sortConfig;
    const aVal = a[column as keyof Item];
    const bVal = b[column as keyof Item];
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const lowStockCount = items.filter((i) => i.stock < 10).length;
  const totalValue = items.reduce((s, i) => s + i.price * i.stock, 0);
  const { currencyCode } = useSettingsStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-green-700 to-teal-700 text-white px-4 py-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">📦 Inventory</h1>
            <p className="text-green-200 text-sm mt-0.5">{items.length} items · {formatPrice(totalValue, currencyCode)} total value</p>
          </div>
          <div className="flex items-center gap-3">
            {lowStockCount > 0 && (
              <span className="flex items-center gap-1.5 bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-semibold px-3 py-1.5 rounded-full">
                ⚠️ {lowStockCount} low stock
              </span>
            )}
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white text-green-800 rounded-full shadow hover:bg-green-50 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-white"
            >
              + Add Item
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-5">
          <SearchBar value={searchQuery} onSearch={handleSearch} />
        </div>

        {searchQuery && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "<span className="font-medium text-gray-700 dark:text-gray-200">{searchQuery}</span>"
          </p>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-500 dark:text-gray-400 text-sm">Loading inventory…</span>
          </div>
        ) : (
          <div className="card-3d rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <InventoryTable
              items={sorted}
              onEdit={setEditItem}
              sortConfig={sortConfig}
              onSort={handleSort}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <AddItemModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} />
      <EditItemModal item={editItem} onClose={() => setEditItem(null)} />
    </div>
  );
}
