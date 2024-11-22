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
    params.set('page', '1');
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
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search tasks..."
        className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    </div>
  );
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b h-16 z-30">
      <div className="max-w-7xl mx-auto h-full px-4 md:px-6">
        <div className="flex items-center justify-between h-full gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg md:text-xl font-bold text-gray-800 whitespace-nowrap">
              Todo App
            </h1>
          </div>

          <div className="flex-1 hidden sm:block">
            <Suspense fallback={<div className="h-10 animate-pulse bg-gray-100 rounded-lg" />}>
              <SearchInput />
            </Suspense>
          </div>

          <div className="flex items-center gap-2">
            <button className="sm:hidden p-2 hover:bg-gray-100 rounded-lg" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
