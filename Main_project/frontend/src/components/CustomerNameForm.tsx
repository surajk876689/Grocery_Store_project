import { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { motion } from 'framer-motion';

interface CustomerNameFormProps { onNameSet: () => void; }

export default function CustomerNameForm({ onNameSet }: CustomerNameFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Please enter your name to continue.'); return; }
    useCartStore.getState().setCustomerName(name.trim());
    onNameSet();
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="card-3d w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700"
      >
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🛍️</div>
          <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">Welcome!</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Enter your name to start shopping</p>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-5">
            <label htmlFor="customer-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Your Name
            </label>
            <input
              id="customer-name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); if (error) setError(''); }}
              placeholder="e.g. Jane Smith"
              autoFocus
              className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              aria-describedby={error ? 'name-error' : undefined}
            />
            {error && <p id="name-error" className="mt-1.5 text-sm text-red-600" role="alert">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 hover:scale-[1.02] transition-all shadow-lg shadow-green-200 dark:shadow-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Start Shopping →
          </button>
        </form>
      </motion.div>
    </div>
  );
}
