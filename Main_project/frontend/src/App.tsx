import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import InventoryPage from './components/InventoryPage';
import PurchasePage from './components/PurchasePage';
import ReceiptPage from './components/ReceiptPage';
import SettingsPage from './components/SettingsPage';
import ProfilePage from './components/ProfilePage';
import AboutPage from './components/AboutPage';
import FeaturesPage from './components/FeaturesPage';
import NotificationBanner from './components/NotificationBanner';
import LoadingOverlay from './components/LoadingOverlay';
import { useSettingsStore } from './store/settingsStore';
import { useProfileStore } from './store/profileStore';

function NavBar({ storeName }: { storeName: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { name, avatarColor } = useProfileStore();
  const navigate = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-green-700 text-white' : 'text-green-100 hover:bg-green-600 hover:text-white'
    }`;

  const initials = name.trim().slice(0, 2).toUpperCase() || 'GU';

  return (
    <nav className="no-print bg-green-900 shadow-md">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <span className="text-white font-bold text-lg tracking-tight">🛒 {storeName}</span>

          <div className="hidden sm:flex items-center gap-2">
            <NavLink to="/" end className={linkClass}>Home</NavLink>
            <NavLink to="/inventory" className={linkClass}>Inventory</NavLink>
            <NavLink to="/purchase" className={linkClass}>Purchase</NavLink>
            <NavLink to="/receipt" className={linkClass}>Receipt</NavLink>
            <NavLink to="/settings" className={linkClass}>⚙️ Settings</NavLink>
            <NavLink to="/about" className={linkClass}>ℹ️ About</NavLink>
            <NavLink to="/features" className={linkClass}>✨ Features</NavLink>
            <button onClick={() => navigate('/profile')}
              className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white text-sm font-bold ml-2 hover:ring-2 hover:ring-white transition-all focus:outline-none focus:ring-2 focus:ring-white`}
              aria-label="Profile"
            >{initials}</button>
          </div>

          <button className="sm:hidden text-green-100 hover:text-white focus:outline-none rounded p-1"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="sm:hidden pb-3 flex flex-col gap-1">
            <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
            <NavLink to="/inventory" className={linkClass} onClick={() => setMenuOpen(false)}>Inventory</NavLink>
            <NavLink to="/purchase" className={linkClass} onClick={() => setMenuOpen(false)}>Purchase</NavLink>
            <NavLink to="/receipt" className={linkClass} onClick={() => setMenuOpen(false)}>Receipt</NavLink>
            <NavLink to="/settings" className={linkClass} onClick={() => setMenuOpen(false)}>⚙️ Settings</NavLink>
            <NavLink to="/about" className={linkClass} onClick={() => setMenuOpen(false)}>ℹ️ About</NavLink>
            <NavLink to="/features" className={linkClass} onClick={() => setMenuOpen(false)}>✨ Features</NavLink>
            <NavLink to="/profile" className={linkClass} onClick={() => setMenuOpen(false)}>👤 Profile</NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  const { theme, storeName } = useSettingsStore();

  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (theme === 'dark' || (theme === 'system' && prefersDark)) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  return (
    <BrowserRouter>
      <NotificationBanner />
      <LoadingOverlay />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors">
        <NavBar storeName={storeName} />
        <main className="flex-1 w-full max-w-[2560px] mx-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/purchase" element={<PurchasePage />} />
            <Route path="/receipt" element={<ReceiptPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
