import { Item, SortConfig } from '../types';
import ItemImage from './ItemImage';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore, formatPrice } from '../store/settingsStore';

interface ItemRowProps {
  item: Item;
  onEdit: (item: Item) => void;
}

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  show:   { opacity: 1, x: 0 },
  exit:   { opacity: 0, x: 20 },
};

function ItemRow({ item, onEdit }: ItemRowProps) {
  const isLowStock = item.stock < 10;
  const { currencyCode } = useSettingsStore();
  return (
    <motion.tr
      layout
      variants={rowVariants}
      initial="hidden" animate="show" exit="exit"
      transition={{ duration: 0.2 }}
      className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${isLowStock ? 'bg-amber-50 dark:bg-amber-900/20' : 'dark:bg-gray-800'}`}
    >
      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
        <div className="flex items-center gap-3">
          <ItemImage name={item.name} size={40} className="w-10 h-10 ring-1 ring-gray-200 dark:ring-gray-700" />
          <span className="font-medium">{item.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
        {formatPrice(item.price, currencyCode)}
      </td>
      <td className="px-4 py-3 text-sm">
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
          isLowStock
            ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
            : item.stock < 30
            ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
            : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
        }`}>
          {isLowStock ? '🔴' : item.stock < 30 ? '🟡' : '🟢'} {item.stock}
        </span>
      </td>
      <td className="px-4 py-3 text-sm">
        <button onClick={() => onEdit(item)} aria-label={`Edit ${item.name}`}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-green-700 rounded-lg hover:bg-green-800 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
        >✏️ Edit</button>
      </td>
    </motion.tr>
  );
}

interface InventoryTableProps {
  items: Item[];
  onEdit: (item: Item) => void;
  sortConfig: SortConfig;
  onSort: (column: keyof Item) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function InventoryTable({
  items, onEdit, sortConfig, onSort, currentPage, onPageChange,
}: InventoryTableProps) {
  const { currencyCode, pageSize } = useSettingsStore();
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const pageItems = items.slice(startIndex, startIndex + pageSize);
  const columns = [
    { key: 'name'  as keyof Item, label: 'Name' },
    { key: 'price' as keyof Item, label: `Price (${currencyCode})` },
    { key: 'stock' as keyof Item, label: 'Stock' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {columns.map(({ key, label }) => (
              <th key={key} scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={() => onSort(key)} tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSort(key)}
                aria-sort={sortConfig.column === key ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                {label}
                {sortConfig.column === key && (
                  <span className="ml-1" aria-hidden="true">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
            ))}
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
          <AnimatePresence mode="popLayout">
            {pageItems.length === 0 ? (
              <motion.tr key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  No items available
                </td>
              </motion.tr>
            ) : (
              pageItems.map((item) => <ItemRow key={item.id} item={item} onEdit={onEdit} />)
            )}
          </AnimatePresence>
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-4 px-1">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
        >Previous</button>
        <span className="text-sm text-gray-600 dark:text-gray-400">Page {currentPage} of {totalPages}</span>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
        >Next</button>
      </div>
    </div>
  );
}
