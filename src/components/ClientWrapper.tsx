'use client';

import { Suspense } from 'react';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
    </div>
  );
}
