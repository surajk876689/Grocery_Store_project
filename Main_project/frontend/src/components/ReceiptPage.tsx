import { Link, useLocation } from 'react-router-dom';
import { Receipt } from '../types';
import ReceiptTable from './ReceiptTable';
import PrintButton from './PrintButton';
import { motion } from 'framer-motion';

interface LocationState { receipt: Receipt; }

export default function ReceiptPage() {
  const location = useLocation();
  const state = location.state as LocationState | null;
  const receipt = state?.receipt;

  if (!receipt) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center gap-4 transition-colors">
        <p className="text-gray-600 dark:text-gray-400 text-lg">No receipt data found.</p>
        <Link to="/purchase" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
          Back to Purchase
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <style>{`@media print { nav, .no-print { display: none !important; } }`}</style>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
        >Receipt</motion.h1>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="card-3d bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <ReceiptTable receipt={receipt} />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <PrintButton />
        </motion.div>
      </div>
    </motion.div>
  );
}
