'use client';

import { Menu, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, Suspense } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface HeaderProps {
  onMenuClick: () => void;
}

function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');

  const debouncedSearch = useDebouncedCallback((value: string) => {
    if (!searchParams) return;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }
    params.set('page', '1'); // Reset to first page on new search
    router.push(`/?${params.toString()}`);
  }, 300);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  return (
    <div className="relative flex-1 max-w-md">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search tasks..."
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    </div>
  );
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white border-b px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg mr-2"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Suspense
            fallback={<div className="h-10 w-full max-w-md bg-gray-100 animate-pulse rounded-lg" />}
          >
            <SearchInput />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
