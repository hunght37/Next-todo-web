import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-3 rounded-full bg-gray-100 dark:bg-gray-800 
        hover:bg-gray-200 dark:hover:bg-gray-700 
        shadow-lg dark:shadow-gray-900
        transform transition-all duration-500 ease-in-out
        hover:scale-110 active:scale-95
        ring-1 ring-gray-200 dark:ring-gray-700
        focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-6 h-6">
        <div className={`absolute inset-0 transform transition-transform duration-500 ${
          theme === 'light' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'
        }`}>
          <SunIcon className="w-6 h-6 text-yellow-500" />
        </div>
        <div className={`absolute inset-0 transform transition-transform duration-500 ${
          theme === 'dark' ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
        }`}>
          <MoonIcon className="w-6 h-6 text-blue-300" />
        </div>
      </div>
    </button>
  );
}
