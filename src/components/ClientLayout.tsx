'use client';

import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={toggleSidebar} />
      <div className="flex pt-16">
        <div
          className={`fixed md:static transition-all duration-300 ease-in-out z-20 h-[calc(100vh-4rem)] ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <Sidebar isOpen={isSidebarOpen} />
        </div>

        {isSidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black/50 z-10 md:hidden transition-opacity duration-300"
            onClick={toggleSidebar}
          />
        )}

        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full min-h-[calc(100vh-4rem)]">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
