import { create } from 'zustand';
import { Item, CartItem } from '../types/index';

export function cartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
}

interface CartState {
  customerName: string;
  cart: CartItem[];
  total: number;
  setCustomerName: (name: string) => void;
  addToCart: (item: Item, quantity: number) => void;
  removeFromCart: (itemId: number) => void;
  updateQty: (itemId: number, qty: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  customerName: '',
  cart: [],
  total: 0,

  setCustomerName: (name) => set({ customerName: name }),

  addToCart: (item, quantity) =>
    set((state) => {
      const existing = state.cart.find((ci) => ci.item.id === item.id);
      const newCart = existing
        ? state.cart.map((ci) =>
            ci.item.id === item.id
              ? { ...ci, quantity: ci.quantity + quantity }
              : ci
          )
        : [...state.cart, { item, quantity }];
      return { cart: newCart, total: cartTotal(newCart) };
    }),

  removeFromCart: (itemId) =>
    set((state) => {
      const newCart = state.cart.filter((ci) => ci.item.id !== itemId);
      return { cart: newCart, total: cartTotal(newCart) };
    }),

  updateQty: (itemId, qty) =>
    set((state) => {
      const newCart =
        qty <= 0
          ? state.cart.filter((ci) => ci.item.id !== itemId)
          : state.cart.map((ci) =>
              ci.item.id === itemId ? { ...ci, quantity: qty } : ci
            );
      return { cart: newCart, total: cartTotal(newCart) };
    }),

  clearCart: () => set({ cart: [], total: 0 }),
}));
