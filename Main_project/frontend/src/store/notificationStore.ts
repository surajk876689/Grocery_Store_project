import { create } from 'zustand';

interface NotificationState {
  message: string | null;
  type: 'error' | 'success' | null;
  setError: (message: string) => void;
  setSuccess: (message: string) => void;
  clear: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  message: null,
  type: null,
  setError: (message) => set({ message, type: 'error' }),
  setSuccess: (message) => set({ message, type: 'success' }),
  clear: () => set({ message: null, type: null }),
}));
