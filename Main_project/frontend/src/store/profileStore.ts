import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProfileState {
  name: string;
  bio: string;
  avatarColor: string;
  setName: (name: string) => void;
  setBio: (bio: string) => void;
  setAvatarColor: (color: string) => void;
}

export const AVATAR_COLORS = [
  'from-indigo-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-blue-500 to-cyan-600',
  'from-violet-500 to-fuchsia-600',
  'from-green-500 to-lime-600',
  'from-red-500 to-orange-600',
];

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      name: 'Guest',
      bio: '',
      avatarColor: 'from-indigo-500 to-purple-600',
      setName: (name) => set({ name }),
      setBio: (bio) => set({ bio }),
      setAvatarColor: (avatarColor) => set({ avatarColor }),
    }),
    { name: 'grocery-profile' }
  )
);
