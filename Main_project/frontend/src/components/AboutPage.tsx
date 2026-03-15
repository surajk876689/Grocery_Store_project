import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

const techStack = [
  { category: 'Frontend', icon: '⚛️', items: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Zustand', 'React Router v6'] },
  { category: 'Backend',  icon: '🐍', items: ['Python 3.11', 'FastAPI', 'SQLAlchemy', 'SQLite', 'Pydantic v2', 'Uvicorn'] },
  { category: 'AI Layer', icon: '🤖', items: ['Local ML (no API)', 'Fuzzy search ranking', 'Purchase history', 'Co-occurrence engine', 'Qty prediction'] },
  { category: 'Testing',  icon: '🧪', items: ['Pytest', 'Hypothesis (PBT)', 'Property-based tests', '6 passing test suites'] },
  { category: 'DevOps',   icon: '🚀', items: ['Render (backend)', 'Capacitor (Android)', 'CORS-ready', 'Env-based config'] },
];

const features = [
  { icon: '📦', title: 'Inventory Management',    desc: 'Add, edit, search and sort items with real-time low-stock alerts and pagination.' },
  { icon: '🛒', title: 'Smart Purchase Flow',      desc: 'Customer name entry, item search with AI ranking, cart management and one-click checkout.' },
  { icon: '🧾', title: 'Receipt Generation',       desc: 'Instant receipt after checkout with print support and itemised line totals.' },
  { icon: '🤖', title: 'AI Smart Features',        desc: 'Fuzzy search, quantity prediction, and "frequently bought together" — all local, no API cost.' },
  { icon: '🌍', title: '12 Currencies',            desc: 'INR, USD, EUR, GBP, JPY, CNY, AED, BRL, AUD, CAD, KRW, CHF — switch instantly in Settings.' },
  { icon: '🎨', title: '3D UI & Animations',       desc: 'Framer Motion animations, 3D card depth effects, smooth transitions throughout.' },
  { icon: '🌙', title: 'Dark / Light / System',    desc: 'Full theme support with system preference detection and instant switching.' },
  { icon: '👤', title: 'Local Profile System',     desc: 'Name, bio, avatar colour — stored in browser, no login required.' },
  { icon: '🖼️', title: 'Real Item Images',         desc: 'Unsplash API integration with per-item unique photos and in-memory caching.' },
  { icon: '📱', title: 'Mobile Ready',             desc: 'Responsive design + Capacitor Android APK support for native mobile deployment.' },
  { icon: '🔒', title: 'Security by Design',       desc: 'Parameterised queries (no SQL injection), CORS policy, bcrypt password hashing, TOCTOU-safe checkout with row locking, and safe error handling that never leaks stack traces.' },
];

const stats = [
  { value: '13',    label: 'Spec Tasks Completed' },
  { value: '6',     label: 'Passing Tests' },
  { value: '12',    label: 'Currencies Supported' },
  { value: '100+',  label: 'Grocery Items Mapped' },
  { value: '3',     label: 'AI Smart Features' },
  { value: '1',     label: 'Developer 😄' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-800 via-green-900 to-teal-900 text-white py-20 px-4 text-center">
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-green-400/10 rounded-full blur-3xl pointer-events-none" />
        <motion.div className="relative max-w-2xl mx-auto" initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp} className="text-6xl mb-4">🛒</motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
            Grocery Store App
          </motion.h1>
          <motion.p variants={fadeUp} className="text-green-200 text-base mb-2">
            A full-stack, AI-powered grocery management system
          </motion.p>
          <motion.p variants={fadeUp} className="text-green-300 text-sm font-medium">
            Developed by <span className="text-white font-bold">Suraj</span> · Version 1.0.0 · 2025
          </motion.p>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
        <motion.div className="grid grid-cols-3 sm:grid-cols-6 gap-3"
          initial="hidden" animate="show" variants={stagger}
        >
          {stats.map(({ value, label }) => (
            <motion.div key={label} variants={fadeUp}
              className="card-3d bg-white dark:bg-gray-800 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-700"
            >
              <p className="text-2xl font-extrabold text-green-700 dark:text-green-400">{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-tight">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

        {/* ── About the Developer ── */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="card-3d bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-2xl font-extrabold text-white shadow-lg select-none">
                SU
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Suraj</h2>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              This Grocery Store App was designed and built by <strong className="text-gray-800 dark:text-gray-200">Suraj</strong>, a
              Cybersecurity student with a strong interest in software development and secure system design.
              The project demonstrates how security principles — input validation, parameterised queries, CORS policy,
              race condition prevention, and safe error handling — can be applied in a real-world full-stack application.
              It covers everything from database design and REST API development to a polished React frontend with
              AI-powered smart features, property-based testing, and mobile deployment support.
            </p>
          </div>
        </motion.section>

        {/* ── About the App ── */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">📖 About the App</h2>
          <div className="card-3d bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-3">
            <p>
              The <strong className="text-gray-800 dark:text-gray-200">Grocery Store App</strong> is a complete point-of-sale and inventory management system
              built for small grocery stores. It allows store owners to manage their product inventory, serve customers through
              a smooth purchase flow, and generate itemised receipts — all from a single web interface.
            </p>
            <p>
              The app was built spec-first using a structured requirements → design → tasks methodology, with all 13 implementation
              tasks completed and verified. The backend exposes a RESTful API built with FastAPI and SQLite, while the frontend
              is a fully responsive React 18 SPA with Tailwind CSS styling, Framer Motion animations, and 3D card depth effects.
            </p>
            <p>
              A local AI layer provides smart search ranking, quantity prediction, and "frequently bought together" suggestions —
              all running in the browser with no external API calls, improving automatically with every purchase.
            </p>
          </div>
        </motion.section>

        {/* ── Features ── */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">✨ Features</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map(({ icon, title, desc }) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="card-3d bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 flex gap-4"
              >
                <span className="text-2xl shrink-0 mt-0.5">{icon}</span>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1">{title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Tech Stack ── */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">🛠️ Tech Stack & Specifications</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map(({ category, icon, items }) => (
              <motion.div key={category}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="card-3d bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700"
              >
                <p className="font-bold text-gray-800 dark:text-gray-100 text-sm mb-3 flex items-center gap-2">
                  <span className="text-xl">{icon}</span>{category}
                </p>
                <ul className="space-y-1.5">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Architecture ── */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">🏗️ Architecture</h2>
          <div className="card-3d bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="grid sm:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="font-semibold text-green-700 dark:text-green-400 mb-2">Frontend (Port 5173)</p>
                <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <li>→ React SPA with Vite bundler</li>
                  <li>→ Zustand for global state</li>
                  <li>→ Axios for API calls</li>
                  <li>→ LocalStorage persistence</li>
                  <li>→ Framer Motion animations</li>
                </ul>
              </div>
              <div className="flex flex-col items-center justify-center text-3xl text-gray-300 dark:text-gray-600">
                ⟷
              </div>
              <div>
                <p className="font-semibold text-teal-700 dark:text-teal-400 mb-2">Backend (Port 8000)</p>
                <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <li>→ FastAPI REST API</li>
                  <li>→ SQLAlchemy ORM</li>
                  <li>→ SQLite database</li>
                  <li>→ Pydantic validation</li>
                  <li>→ CORS middleware</li>
                </ul>
              </div>
            </div>
            <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700">
              <p className="font-semibold text-purple-700 dark:text-purple-400 text-sm mb-2">API Endpoints</p>
              <div className="grid sm:grid-cols-2 gap-2 text-xs font-mono">
                {[
                  ['GET',    '/items',           'List all inventory items'],
                  ['POST',   '/items',           'Create a new item'],
                  ['PUT',    '/items/{id}',      'Update an item'],
                  ['GET',    '/items/{id}',      'Get single item'],
                  ['POST',   '/checkout',        'Process a purchase'],
                ].map(([method, path, desc]) => (
                  <div key={path} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-1.5">
                    <span className={`font-bold shrink-0 ${method === 'GET' ? 'text-blue-600' : method === 'POST' ? 'text-green-600' : 'text-amber-600'}`}>{method}</span>
                    <span className="text-gray-700 dark:text-gray-300 shrink-0">{path}</span>
                    <span className="text-gray-400 dark:text-gray-500 truncate">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── CTA ── */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center pb-4"
        >
          <div className="card-3d bg-gradient-to-br from-green-700 to-teal-700 rounded-2xl p-8 text-white">
            <div className="text-4xl mb-3">🛒</div>
            <h3 className="text-xl font-extrabold mb-2">Ready to explore?</h3>
            <p className="text-green-200 text-sm mb-6">Jump into the app and see everything in action.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/" className="bg-white text-green-900 font-semibold px-6 py-2.5 rounded-full hover:bg-green-50 hover:scale-105 transition-all text-sm">
                🏠 Go Home
              </Link>
              <Link to="/purchase" className="bg-white/15 border border-white/30 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-white/25 hover:scale-105 transition-all text-sm">
                🛍️ Start Shopping
              </Link>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
