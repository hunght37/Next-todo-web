'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ListTodo, Calendar, Star, CheckCircle, BarChart2 } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const navItems = [
  { name: 'All Tasks', href: '/', icon: ListTodo },
  { name: 'Today', href: '/today', icon: Calendar },
  { name: 'Important', href: '/important', icon: Star },
  { name: 'Completed', href: '/completed', icon: CheckCircle },
  { name: 'Statistics', href: '/statistics', icon: BarChart2 },
];

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-white h-full shadow-lg overflow-hidden">
      <nav className="flex flex-col h-full">
        <div className="flex-1 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t">
          <div className="text-xs text-gray-500">Made with ❤️ by hunght37</div>
        </div>
      </nav>
    </aside>
  );
}
