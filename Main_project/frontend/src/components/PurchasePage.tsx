import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { postCheckout } from '../api/checkout';
import CustomerNameForm from './CustomerNameForm';
import ItemSearch from './ItemSearch';
import CartPanel from './CartPanel';
import { motion } from 'framer-motion';
import { useSettingsStore, formatPrice } from '../store/settingsStore';
import { useAiStore } from '../store/aiStore';

export default function PurchasePage() {
  const navigate = useNavigate();
  const { cart, total, customerName, clearCart } = useCartStore();
  const { currencyCode } = useSettingsStore();
  const recordPurchase = useAiStore((s) => s.recordPurchase);
  const [phase, setPhase] = useState<'name' | 'shopping'>(customerName ? 'shopping' : 'name');
  const [processing, setProcessing] = useState(false);
  const [emptyCartMessage, setEmptyCartMessage] = useState('');
  const [checkoutError, setCheckoutError] = useState('');

  const handleCheckout = async () => {
    if (cart.length === 0) { setEmptyCartMessage('Your cart is empty. Add items before checking out.'); return; }
    setEmptyCartMessage(''); setCheckoutError(''); setProcessing(true);
    try {
      const receipt = await postCheckout({
        customer_name: customerName,
        items: cart.map((ci) => ({ item_id: ci.item.id, quantity: ci.quantity })),
      });
      recordPurchase(cart.map((ci) => ({ item: ci.item, quantity: ci.quantity })));
      clearCart();
      navigate('/receipt', { state: { receipt } });
    } catch {
      setCheckoutError('Checkout failed. Please try again.');
    } finally { setProcessing(false); }
  };

  if (phase === 'name') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-4 py-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-extrabold">🛍️ Purchase</h1>
            <p className="text-green-200 text-sm mt-0.5">Enter your name to start shopping</p>
          </div>
        </div>
        <CustomerNameForm onNameSet={() => setPhase('shopping')} />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-4 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">🛍️ Purchase</h1>
            <p className="text-green-200 text-sm mt-0.5">Shopping as <span className="font-semibold text-white">{customerName}</span></p>
          </div>
          {cart.length > 0 && (
            <span className="bg-white/20 border border-white/30 text-white text-sm font-semibold px-3 py-1.5 rounded-full">
              🛒 {cart.length} item{cart.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-8 pt-6">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="card-3d bg-white dark:bg-gray-800 rounded-2xl overflow-hidden mb-6 lg:mb-0">
            <ItemSearch />
          </div>

          <div className="flex flex-col gap-4">
            <div className="card-3d bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
              <div className="px-4 pt-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Your Cart</h2>
              </div>
              <CartPanel />
            </div>

            <div className="card-3d bg-white dark:bg-gray-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-semibold text-gray-700 dark:text-gray-300">Total</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{formatPrice(total, currencyCode)}</span>
              </div>

              {emptyCartMessage && (
                <p role="alert" className="mb-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded px-3 py-2">
                  {emptyCartMessage}
                </p>
              )}
              {checkoutError && (
                <p role="alert" className="mb-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded px-3 py-2">
                  {checkoutError}
                </p>
              )}

              <button
                onClick={handleCheckout}
                disabled={processing}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold text-base hover:from-green-700 hover:to-emerald-700 hover:scale-[1.02] transition-all shadow-lg shadow-green-200 dark:shadow-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                {processing ? '⏳ Processing...' : '✅ Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
