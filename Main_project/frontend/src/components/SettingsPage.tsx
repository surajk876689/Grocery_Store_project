import { useEffect, useState } from 'react';
import { useSettingsStore, type Theme, type PageSize, CURRENCIES } from '../store/settingsStore';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-3d bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Row({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{label}</p>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

const themeOptions: { value: Theme; label: string; icon: string }[] = [
  { value: 'light',  label: 'Light',  icon: '☀️' },
  { value: 'dark',   label: 'Dark',   icon: '🌙' },
  { value: 'system', label: 'System', icon: '💻' },
];

export default function SettingsPage() {
  const { theme, currencyCode, pageSize, storeName, setTheme, setCurrencyCode, setPageSize, setStoreName } = useSettingsStore();
  const [nameInput, setNameInput] = useState(storeName);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (theme === 'dark' || (theme === 'system' && prefersDark)) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    setStoreName(trimmed);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">⚙️ Settings</h1>

        {/* Appearance */}
        <Section title="Appearance">
          <Row label="Theme" description="Choose light, dark, or follow your system preference.">
            <div className="flex gap-2">
              {themeOptions.map(({ value, label, icon }) => (
                <button key={value} onClick={() => setTheme(value)} aria-pressed={theme === value}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border-2 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    theme === value
                      ? 'border-green-600 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-400'
                  }`}
                >
                  <span className="text-lg">{icon}</span>{label}
                </button>
              ))}
            </div>
          </Row>
        </Section>

        {/* Store */}
        <Section title="Store">
          <Row label="Store Name" description="Displayed in the nav bar and receipts.">
            <div className="flex items-center gap-2">
              <input type="text" value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                className="w-40 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button onClick={handleSaveName}
                className="px-3 py-1.5 text-sm rounded-lg bg-green-700 text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              >{saved ? '✓ Saved' : 'Save'}</button>
            </div>
          </Row>
        </Section>

        {/* Display */}
        <Section title="Display">
          <Row label="Currency" description="Applied to all prices across the app.">
            <select value={currencyCode} onChange={(e) => setCurrencyCode(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {CURRENCIES.map(({ code, symbol, label, flag }) => (
                <option key={code} value={code}>{flag} {symbol} {code} — {label}</option>
              ))}
            </select>
          </Row>

          <Row label="Items per page" description="How many inventory rows to show per page.">
            <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value) as PageSize)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </Row>
        </Section>

        {/* About */}
        <Section title="About">
          <Row label="Version"><span className="text-sm text-gray-500 dark:text-gray-400">1.0.0</span></Row>
          <Row label="Backend"><span className="text-sm text-gray-500 dark:text-gray-400">FastAPI + SQLite</span></Row>
          <Row label="Frontend"><span className="text-sm text-gray-500 dark:text-gray-400">React 18 + Vite + Tailwind</span></Row>
        </Section>
      </div>
    </div>
  );
}
