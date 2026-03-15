import { useEffect, useState } from 'react';

interface SearchBarProps {
  value: string;
  onSearch: (query: string) => void;
}

export default function SearchBar({ value, onSearch }: SearchBarProps) {
  const [input, setInput] = useState(value);

  useEffect(() => { setInput(value); }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => { onSearch(input); }, 300);
    return () => clearTimeout(timer);
  }, [input, onSearch]);

  return (
    <div className="relative w-full">
      <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 dark:text-gray-500 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </span>
      <input
        type="text"
        aria-label="Search items"
        placeholder="Search items..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
