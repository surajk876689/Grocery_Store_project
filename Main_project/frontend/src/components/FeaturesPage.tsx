import { motion } from 'framer-motion';

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

const features = [
  { icon: '📦', title: 'Inventory Management',    desc: 'Add, edit, delete items. Low-stock alerts, pagination, sort & search.' },
  { icon: '🛒', title: 'Smart Purchase Flow',      desc: 'Customer name entry, AI-ranked item search, cart management, one-click checkout.' },
  { icon: '🧾', title: 'Receipt Generation',       desc: 'Instant itemised receipt after checkout with print support.' },
  { icon: '🤖', title: 'AI Smart Features',        desc: 'Fuzzy ranking, quantity prediction, and "frequently bought together" — all local.' },
  { icon: '🌍', title: '12 Currencies',            desc: 'INR, USD, EUR, GBP, JPY, CNY, AED, BRL, AUD, CAD, KRW, CHF — switch instantly.' },
  { icon: '🎨', title: '3D UI & Animations',       desc: 'Framer Motion animations, 3D card depth effects, smooth transitions.' },
  { icon: '🌙', title: 'Dark / Light / System',    desc: 'Full theme support with system preference detection and instant switching.' },
  { icon: '👤', title: 'Local Profile System',     desc: 'Name, bio, avatar colour — stored in browser, no login required.' },
  { icon: '🖼️', title: 'Real Item Images',         desc: 'Unsplash API integration with per-item unique photos and in-memory caching.' },
  { icon: '📱', title: 'Mobile Ready',             desc: 'Responsive design + Capacitor Android APK support.' },
  { icon: '🔒', title: 'Security by Design',       desc: 'Parameterised queries, CORS policy, TOCTOU-safe checkout, safe error handling.' },
  { icon: '🧪', title: 'Property-Based Testing',   desc: '6 passing Pytest + Hypothesis test suites covering core correctness properties.' },
];

const limitations = [
  { icon: '🔑', title: 'No Authentication',        desc: 'No login system — anyone with the URL can access the app. Not multi-user ready.' },
  { icon: '🗄️', title: 'SQLite Only',              desc: 'Not suitable for high-concurrency production. No migrations, no auto-backup.' },
  { icon: '🧠', title: 'AI is Browser-Local',      desc: 'AI history resets if browser data is cleared. Not shared across devices.' },
  { icon: '🖼️', title: 'Unsplash Rate Limit',      desc: 'Free tier: 50 req/hour. Requires API key in .env. Cache resets on refresh.' },
  { icon: '💱', title: 'Display Currency Only',    desc: 'Switching currency changes the symbol only — no real exchange rate conversion.' },
  { icon: '🧾', title: 'No Receipt History',       desc: 'Receipts visible only immediately after checkout. No lookup or PDF export.' },
  { icon: '📊', title: 'No Analytics',             desc: 'No sales reports, no purchase history dashboard, no trend charts.' },
  { icon: '📡', title: 'No Offline Support',       desc: 'No PWA / service worker. Requires active connection to backend.' },
  { icon: '⏱️', title: 'Cold Start Delay',         desc: 'Render free tier sleeps after 15 min inactivity — first request takes ~30s.' },
  { icon: '♿', title: 'Accessibility Gaps',        desc: 'Not fully WCAG 2.1 tested. No screen reader validation performed.' },
];

const future = [
  '🔐 User authentication & role-based access',
  '🐘 PostgreSQL for production scalability',
  '📈 Sales analytics & purchase history dashboard',
  '💱 Real exchange rate API integration',
  '📷 Barcode scanning via device camera',
  '📂 CSV bulk import for inventory',
  '📶 PWA / offline support',
  '📄 PDF receipt export',
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors overflow-x-hidden">

      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-800 via-teal-900 to-green-900 text-white py-16 px-4 text-center">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <motion.div className="relative max-w-2xl mx-auto" initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp} className="text-5xl mb-3">✨</motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-white via-green-200 to-amber-200 bg-clip-text text-transparent">
            Features & Limitations
          </motion.h1>
          <motion.p variants={fadeUp} className="text-green-200 text-sm">
            Grocery Store App · Version 1.0.0 · Developed by <span className="text-white font-bold">Suraj</span>
          </motion.p>
          {/* pill stats */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3 mt-6">
            {[
              ['12', 'Features'],
              ['10', 'Limitations'],
              ['6',  'Tests Passing'],
              ['12', 'Currencies'],
              ['3',  'AI Algorithms'],
            ].map(([val, lbl]) => (
              <span key={lbl} className="bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
                <span className="text-amber-300 font-extrabold">{val}</span> {lbl}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

        {/* ── Features ── */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">✅</span>
            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">What It Can Do</h2>
            <span className="ml-auto text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full px-3 py-1 font-semibold">
              {features.length} features
            </span>
          </div>
          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true }}>
            {features.map(({ icon, title, desc }) => (
              <motion.div key={title} variants={fadeUp}
                className="card-3d bg-white dark:bg-gray-800 rounded-2xl p-5 border border-green-100 dark:border-green-900/30 flex gap-3 hover:border-green-300 dark:hover:border-green-700 transition-colors"
              >
                <span className="text-2xl shrink-0 mt-0.5">{icon}</span>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1">{title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ── Limitations ── */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">⚠️</span>
            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">Current Limitations</h2>
            <span className="ml-auto text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-full px-3 py-1 font-semibold">
              {limitations.length} limitations
            </span>
          </div>
          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true }}>
            {limitations.map(({ icon, title, desc }) => (
              <motion.div key={title} variants={fadeUp}
                className="card-3d bg-white dark:bg-gray-800 rounded-2xl p-5 border border-amber-100 dark:border-amber-900/30 flex gap-3 hover:border-amber-300 dark:hover:border-amber-700 transition-colors"
              >
                <span className="text-2xl shrink-0 mt-0.5">{icon}</span>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1">{title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ── Future Improvements ── */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🚀</span>
            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">Future Improvements</h2>
          </div>
          <div className="card-3d bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="grid sm:grid-cols-2 gap-3">
              {future.map((item) => (
                <motion.div key={item}
                  initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400"
                >
                  <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                  {item}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── Bottom note ── */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center text-xs text-gray-400 dark:text-gray-600 pb-4"
        >
          Grocery Store App v1.0.0 · Developed by <span className="text-gray-500 dark:text-gray-500 font-medium">Suraj</span> · 2025
        </motion.div>

      </div>
    </div>
  );
}
