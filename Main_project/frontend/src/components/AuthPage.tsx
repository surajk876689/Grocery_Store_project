import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

const inputCls = 'w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors';
const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', ok: /[a-z]/.test(password) },
    { label: 'Number', ok: /\d/.test(password) },
    { label: 'Special character (!@#$...)', ok: /[!@#$%^&*(),.?":{}|<>_\-]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ['bg-red-400', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-green-500'];

  if (!password) return null;
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[0,1,2,3,4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < score ? colors[score] : 'bg-gray-200 dark:bg-gray-600'}`} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 mt-1">
        {checks.map(({ label, ok }) => (
          <p key={label} className={`text-xs flex items-center gap-1 ${ok ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
            <span>{ok ? '✓' : '○'}</span> {label}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function AuthPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const reset = () => { setUsername(''); setEmail(''); setPassword(''); setError(''); };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = mode === 'login'
        ? await loginUser(username, password)
        : await registerUser(username, email, password);
      setAuth(res.access_token, res.user);
      navigate('/');
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
      if (Array.isArray(detail)) {
        // FastAPI validation errors: [{loc, msg, type}, ...]
        setError(detail.map((d: { msg?: string }) => d.msg ?? String(d)).join('\n'));
      } else if (typeof detail === 'string') {
        setError(detail);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-indigo-800 to-purple-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🛒</div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Grocery Store</h1>
          <p className="text-indigo-200 text-sm mt-1">Manage your store securely</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Tab switcher */}
          <div className="flex rounded-xl bg-gray-100 dark:bg-gray-700 p-1 mb-6">
            {(['login', 'register'] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); reset(); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${mode === m ? 'bg-white dark:bg-gray-600 text-indigo-700 dark:text-indigo-300 shadow' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              >
                {m === 'login' ? '🔑 Sign In' : '✨ Create Account'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form key={mode} initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              onSubmit={handleSubmit} noValidate className="space-y-4"
            >
              <div>
                <label className={labelCls}>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                  className={inputCls} placeholder="e.g. john_doe" autoComplete="username" required />
              </div>

              {mode === 'register' && (
                <div>
                  <label className={labelCls}>Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className={inputCls} placeholder="you@example.com" autoComplete="email" required />
                </div>
              )}

              <div>
                <label className={labelCls}>Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password}
                    onChange={(e) => setPassword(e.target.value)} className={inputCls}
                    placeholder={mode === 'register' ? 'Min 8 chars, mixed case + symbol' : 'Your password'}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required />
                  <button type="button" onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >{showPassword ? '🙈' : '👁️'}</button>
                </div>
                {mode === 'register' && <PasswordStrength password={password} />}
              </div>

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg px-3 py-2 space-y-0.5"
                >
                  {error.split('\n').map((line, i) => (
                    <p key={i}>⚠️ {line}</p>
                  ))}
                </motion.div>
              )}

              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-indigo-700 hover:to-purple-700 hover:scale-[1.02] transition-all shadow-lg disabled:opacity-50 disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-2"
              >
                {loading ? '⏳ Please wait...' : mode === 'login' ? '🔑 Sign In' : '✨ Create Account'}
              </button>
            </motion.form>
          </AnimatePresence>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
            🔒 Passwords are encrypted with bcrypt &nbsp;·&nbsp; JWT secured sessions
          </p>
        </div>
      </motion.div>
    </div>
  );
}
