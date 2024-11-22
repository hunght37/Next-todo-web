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
    <div className="w-64 bg-white border-r h-screen fixed left-0 top-16">
      <nav className="p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 p-3 rounded-lg mb-1 ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
