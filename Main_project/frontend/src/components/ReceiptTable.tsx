import { Receipt } from '../types';
import { useSettingsStore, formatPrice } from '../store/settingsStore';

interface Props { receipt: Receipt; }

export default function ReceiptTable({ receipt }: Props) {
  const { currencyCode } = useSettingsStore();
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Customer: {receipt.customer_name}
      </h2>
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 uppercase text-xs">
            <th className="pb-2 pr-4">Item</th>
            <th className="pb-2 pr-4 text-right">Unit Price</th>
            <th className="pb-2 pr-4 text-right">Qty</th>
            <th className="pb-2 text-right">Line Total</th>
          </tr>
        </thead>
        <tbody>
          {receipt.items.map((line, idx) => (
            <tr key={idx} className="border-b border-gray-100 dark:border-gray-700">
              <td className="py-2 pr-4 text-gray-800 dark:text-gray-200">{line.name}</td>
              <td className="py-2 pr-4 text-right text-gray-700 dark:text-gray-300">{formatPrice(line.unit_price, currencyCode)}</td>
              <td className="py-2 pr-4 text-right text-gray-700 dark:text-gray-300">{line.quantity}</td>
              <td className="py-2 text-right text-gray-700 dark:text-gray-300">{formatPrice(line.line_total, currencyCode)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="pt-3 pr-4 text-right font-semibold text-gray-800 dark:text-gray-200">Grand Total</td>
            <td className="pt-3 text-right font-bold text-gray-900 dark:text-white">{formatPrice(receipt.grand_total, currencyCode)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
