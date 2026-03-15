import { useEffect } from 'react';
import { useNotificationStore } from '../store/notificationStore';

export default function NotificationBanner() {
  const { message, type, clear } = useNotificationStore();

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(clear, 5000);
    return () => clearTimeout(timer);
  }, [message, clear]);

  if (!message) return null;

  const isError = type === 'error';
  const cls = isError
    ? 'bg-red-100 dark:bg-red-900/40 border-red-400 dark:border-red-600 text-red-800 dark:text-red-300'
    : 'bg-green-100 dark:bg-green-900/40 border-green-400 dark:border-green-600 text-green-800 dark:text-green-300';

  return (
    <div aria-live="polite" aria-atomic="true">
      <div role="alert" className={`flex items-center justify-between px-4 py-3 border rounded-lg text-sm font-medium ${cls}`}>
        <span>{message}</span>
        <button
          type="button"
          onClick={clear}
          aria-label="Dismiss notification"
          className="ml-4 text-lg leading-none opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-current rounded"
        >×</button>
      </div>
    </div>
  );
}
