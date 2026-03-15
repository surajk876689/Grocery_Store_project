import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type PageSize = 10 | 20 | 50;

export interface CurrencyOption {
  code: string;   // ISO 4217
  symbol: string;
  label: string;
  flag: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee',       flag: '🇮🇳' },
  { code: 'USD', symbol: '$', label: 'US Dollar',           flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', label: 'Euro',                flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', label: 'British Pound',       flag: '🇬🇧' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen',        flag: '🇯🇵' },
  { code: 'CNY', symbol: '¥', label: 'Chinese Yuan',        flag: '🇨🇳' },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham',        flag: '🇦🇪' },
  { code: 'BRL', symbol: 'R$', label: 'Brazilian Real',     flag: '🇧🇷' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar',  flag: '🇦🇺' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar',    flag: '🇨🇦' },
  { code: 'KRW', symbol: '₩', label: 'South Korean Won',   flag: '🇰🇷' },
  { code: 'CHF', symbol: 'Fr', label: 'Swiss Franc',        flag: '🇨🇭' },
];

export function getCurrencySymbol(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? code;
}

export function formatPrice(amount: number, currencyCode: string): string {
  const symbol = getCurrencySymbol(currencyCode);
  return `${symbol}${amount.toLocaleString()}`;
}

interface SettingsState {
  theme: Theme;
  currencyCode: string;
  pageSize: PageSize;
  storeName: string;
  setTheme: (theme: Theme) => void;
  setCurrencyCode: (code: string) => void;
  setPageSize: (pageSize: PageSize) => void;
  setStoreName: (name: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      currencyCode: 'INR',
      pageSize: 20,
      storeName: 'Grocery Store',
      setTheme: (theme) => set({ theme }),
      setCurrencyCode: (currencyCode) => set({ currencyCode }),
      setPageSize: (pageSize) => set({ pageSize }),
      setStoreName: (storeName) => set({ storeName }),
    }),
    { name: 'grocery-settings' }
  )
);
