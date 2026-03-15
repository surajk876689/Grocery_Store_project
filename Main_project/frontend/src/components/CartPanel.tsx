import { CartItem } from '../types/index';
import { useCartStore } from '../store/cartStore';
import ItemImage from './ItemImage';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore, formatPrice } from '../store/settingsStore';

interface CartItemRowProps {
  cartItem: CartItem;
  onRemove: (id: number) => void;
  onUpdateQty: (id: number, qty: number) => void;
}

export function CartItemRow({ cartItem, onRemove, onUpdateQty }: CartItemRowProps) {
  const { item, quantity } = cartItem;
  const { currencyCode } = useSettingsStore();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 py-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
    >
      <ItemImage name={item.name} size={36} className="w-9 h-9" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{item.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{formatPrice(item.price, currencyCode)} each</p>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onUpdateQty(item.id, quantity - 1)}
          disabled={quantity <= 1}
          aria-label={`Decrease quantity of ${item.name}`}
          className="w-7 h-7 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >−</button>
        <span className="w-8 text-center text-sm font-medium text-gray-800 dark:text-gray-200">{quantity}</span>
        <button
          onClick={() => onUpdateQty(item.id, quantity + 1)}
          disabled={quantity >= item.stock}
          aria-label={`Increase quantity of ${item.name}`}
          className="w-7 h-7 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >+</button>
      </div>

      <div className="w-16 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
        {formatPrice(item.price * quantity, currencyCode)}
      </div>

      <button
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.name} from cart`}
        className="ml-1 text-red-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
      >✕</button>
    </motion.div>
  );
}

export default function CartPanel() {
  const { cart, total, removeFromCart, updateQty } = useCartStore();
  const { currencyCode } = useSettingsStore();

  if (cart.length === 0) {
    return <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">Your cart is empty</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 overflow-y-auto px-4">
        <AnimatePresence mode="popLayout">
          {cart.map((ci) => (
            <CartItemRow key={ci.item.id} cartItem={ci} onRemove={removeFromCart} onUpdateQty={updateQty} />
          ))}
        </AnimatePresence>
      </div>
      <div className="px-4 pt-3 border-t border-gray-300 dark:border-gray-600 mt-2">
        <p className="text-base font-semibold text-gray-900 dark:text-white text-right">Total: {formatPrice(total, currencyCode)}</p>
      </div>
    </div>
  );
}
