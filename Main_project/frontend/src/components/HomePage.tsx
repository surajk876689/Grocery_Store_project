import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useInventoryStore from '../store/inventoryStore';
import { useSettingsStore, getCurrencySymbol } from '../store/settingsStore';

const features = [
  { icon: '📦', title: 'Inventory',  description: 'Add, edit and track stock levels with low-stock alerts.', to: '/inventory', cta: 'Manage Inventory', gradient: 'from-green-600 to-teal-600' },
  { icon: '🛒', title: 'Purchase',   description: 'Search items, build a cart and checkout in seconds.',    to: '/purchase',  cta: 'Start Shopping',    gradient: 'from-amber-500 to-orange-500'  },
  { icon: '🧾', title: 'Receipt',    description: 'View your last receipt and print it for records.',       to: '/receipt',   cta: 'View Receipt',      gradient: 'from-cyan-500 to-blue-500'     },
  { icon: '⚙️', title: 'Settings',   description: 'Switch themes, set currency and personalise the store.',to: '/settings',  cta: 'Open Settings',     gradient: 'from-lime-500 to-green-600'    },
];

function useCount(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const steps = 40; const inc = target / steps; let cur = 0;
    const id = setInterval(() => {
      cur += inc;
      if (cur >= target) { setCount(target); clearInterval(id); }
      else setCount(Math.floor(cur));
    }, duration / steps);
    return () => clearInterval(id);
  }, [target, duration]);
  return count;
}

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

export default function HomePage() {
  const { items, fetchItems } = useInventoryStore();
  const { currencyCode } = useSettingsStore();
  useEffect(() => { fetchItems(); }, [fetchItems]);

  const totalItems  = items.length;
  const lowStock    = items.filter((i) => i.stock < 10).length;
  const totalValue  = items.reduce((s, i) => s + i.price * i.stock, 0);

  const countItems = useCount(totalItems);
  const countLow   = useCount(lowStock);
  const countValue = useCount(totalValue);

  const stats = [
    { label: 'Total Items',     value: countItems, color: 'text-green-700 dark:text-green-400',  prefix: '' },
    { label: 'Low Stock',       value: countLow,   color: 'text-amber-600 dark:text-amber-400',  prefix: '' },
    { label: 'Inventory Value', value: countValue, color: 'text-teal-600 dark:text-teal-400',    prefix: getCurrencySymbol(currencyCode) },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-800 via-green-900 to-teal-900 text-white py-24 px-4 text-center">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-green-400/20 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          className="relative max-w-2xl mx-auto"
          initial="hidden" animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
        >
          <motion.div variants={fadeUp}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Store is open
          </motion.div>

          <motion.div variants={fadeUp} className="text-7xl mb-4 drop-shadow-lg">🛒</motion.div>

          <motion.h1 variants={fadeUp}
            className="text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent"
          >
            Grocery Store
          </motion.h1>

          <motion.p variants={fadeUp} className="text-green-200 text-lg mb-10 max-w-lg mx-auto">
            Manage inventory, serve customers and track every sale — all in one place.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
            <Link to="/purchase"
              className="inline-block bg-white text-green-900 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-green-50 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-900"
            >🛍️ Start Shopping</Link>
            <Link to="/inventory"
              className="inline-block bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/20 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-900"
            >📦 View Inventory</Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
        <motion.div className="grid grid-cols-3 gap-4"
          initial="hidden" animate="show" variants={stagger}
        >
          {stats.map(({ label, value, color, prefix }) => (
            <motion.div key={label} variants={fadeUp}
              className="card-3d bg-white dark:bg-gray-800 rounded-2xl p-5 text-center border border-gray-100 dark:border-gray-700"
            >
              <p className={`text-3xl font-extrabold ${color}`}>{prefix}{value.toLocaleString()}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium uppercase tracking-wide">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Feature Cards ── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-2">What would you like to do?</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-10">Pick a section to get started</p>
        </motion.div>

        <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
        >
          {features.map(({ icon, title, description, to, cta, gradient }) => (
            <motion.div key={to} variants={fadeUp} whileHover={{ y: -6, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Link to={to}
                className={`card-3d group flex flex-col rounded-2xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-green-500`}
              >
                <div className={`bg-gradient-to-br ${gradient} p-6 text-white`}>
                  <div className="text-4xl mb-2">{icon}</div>
                  <h3 className="text-lg font-bold">{title}</h3>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 flex-1 flex flex-col justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
                  <span className="text-sm font-semibold text-green-700 dark:text-green-400 group-hover:underline">{cta} →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="text-center text-xs text-gray-400 dark:text-gray-600 pb-10">
        <div className="flex justify-center gap-1 mb-1 text-base">🥦🍎🥛🧅🍋</div>
        Grocery Store App &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
