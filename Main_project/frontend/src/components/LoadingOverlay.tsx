import { useLoadingStore } from '../store/loadingStore';

export default function LoadingOverlay() {
  const isLoading = useLoadingStore((s) => s.isLoading);

  if (!isLoading) return null;

  return (
    <div
      aria-label="Loading"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div
        aria-hidden="true"
        className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"
      />
    </div>
  );
}
