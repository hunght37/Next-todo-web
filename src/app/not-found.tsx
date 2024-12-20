'use client';

import Link from 'next/link';
import ClientWrapper from '@/components/ClientWrapper';

function NotFoundContent() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <Link
          href="/"
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <ClientWrapper>
      <NotFoundContent />
    </ClientWrapper>
  );
}
