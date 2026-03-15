import { useState, type FormEvent, type MouseEvent } from 'react';
import { createItem } from '../api/items';
import useInventoryStore from '../store/inventoryStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '../store/settingsStore';

interface AddItemModalProps { isOpen: boolean; onClose: () => void; }
interface FormErrors { name?: string; price?: string; stock?: string; }

const inputCls = 'w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500';
const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

export default function AddItemModal({ isOpen, onClose }: AddItemModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const { currencyCode } = useSettingsStore();

  if (!isOpen) return null;

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!name.trim()) errs.name = 'Name is required.';
    const p = Number(price);
    if (!price || isNaN(p) || p <= 0) errs.price = 'Price must be greater than 0.';
    const s = Number(stock);
    if (!stock || isNaN(s) || !Number.isInteger(s) || s <= 0) errs.stock = 'Stock must be a whole number greater than 0.';
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    try {
      const item = await createItem({ name: name.trim(), price: Number(price), stock: Number(stock) });
      useInventoryStore.getState().addItem(item);
      setName(''); setPrice(''); setStock('');
      onClose();
    } finally { setSubmitting(false); }
  }

  return (
    <AnimatePresence>
    {isOpen && (
    <motion.div
      key="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e: MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        key="panel"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        role="dialog" aria-modal="true" aria-labelledby="add-item-title"
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="add-item-title" className="text-xl font-semibold text-gray-800 dark:text-gray-100">Add New Item</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded">×</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="item-name" className={labelCls}>Name</label>
            <input id="item-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="e.g. Tomatoes" />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="item-price" className={labelCls}>Price ({currencyCode})</label>
            <input id="item-price" type="number" min="1" value={price} onChange={(e) => setPrice(e.target.value)} className={inputCls} placeholder="e.g. 50" />
            {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="item-stock" className={labelCls}>Stock</label>
            <input id="item-stock" type="number" min="1" step="1" value={stock} onChange={(e) => setStock(e.target.value)} className={inputCls} placeholder="e.g. 100" />
            {errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock}</p>}
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="px-4 py-2 text-sm rounded-lg bg-green-700 text-white hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500">
              {submitting ? 'Adding…' : 'Add Item'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
    )}
    </AnimatePresence>
  );
}
