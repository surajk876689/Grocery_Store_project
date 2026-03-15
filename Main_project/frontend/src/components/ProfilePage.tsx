import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProfileStore, AVATAR_COLORS } from '../store/profileStore';
import useInventoryStore from '../store/inventoryStore';
import { useSettingsStore, formatPrice } from '../store/settingsStore';

function avatarInitials(name: string) {
  return name.trim().slice(0, 2).toUpperCase() || 'GU';
}

export default function ProfilePage() {
  const { name, bio, avatarColor, setName, setBio, setAvatarColor } = useProfileStore();
  const { items } = useInventoryStore();
  const { currencyCode } = useSettingsStore();

  const [editName, setEditName] = useState(name);
  const [editBio, setEditBio] = useState(bio);
  const [saved, setSaved] = useState(false);

  const totalItems = items.length;
  const lowStock = items.filter((i) => i.stock < 10).length;
  const totalValue = items.reduce((s, i) => s + i.price * i.stock, 0);

  function handleSave() {
    setName(editName.trim() || 'Guest');
    setBio(editBio.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-teal-700 text-white px-4 py-10">
        <div className="max-w-2xl mx-auto flex items-center gap-5">
          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-2xl font-extrabold text-white shadow-lg ring-4 ring-white/30 select-none`}>
            {avatarInitials(name)}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">{name}</h1>
            {bio && <p className="text-green-200 text-sm mt-1 max-w-xs">{bio}</p>}
            <span className="inline-flex items-center gap-1 mt-2 text-xs bg-white/20 border border-white/30 rounded-full px-3 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Store Member
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-4"
        >
          {[
            { label: 'Total Items', value: totalItems, color: 'text-green-700 dark:text-green-400' },
            { label: 'Low Stock',   value: lowStock,   color: 'text-amber-600 dark:text-amber-400' },
            { label: 'Store Value', value: formatPrice(totalValue, currencyCode), color: 'text-teal-600 dark:text-teal-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card-3d bg-white dark:bg-gray-800 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-700">
              <p className={`text-xl font-extrabold ${color}`}>{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Edit Profile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="card-3d bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">✏️ Edit Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Your name" maxLength={30}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
              <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} rows={2}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                placeholder="A short bio..." maxLength={100}
              />
            </div>
            <button onClick={handleSave}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:from-green-700 hover:to-teal-700 transition-all focus:outline-none focus:ring-2 focus:ring-green-500"
            >{saved ? '✅ Saved!' : '💾 Save Profile'}</button>
          </div>
        </motion.div>

        {/* Avatar Color */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="card-3d bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">🎨 Avatar Color</h2>
          <div className="flex flex-wrap gap-3">
            {AVATAR_COLORS.map((color) => (
              <button key={color} onClick={() => setAvatarColor(color)}
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} transition-all hover:scale-110 focus:outline-none ${avatarColor === color ? 'ring-4 ring-green-500 ring-offset-2' : ''}`}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
