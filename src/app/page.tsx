'use client';

import { Suspense } from 'react';
import HomeContent from '@/components/HomeContent';
import ClientWrapper from '@/components/ClientWrapper';

export default function Home() {
  return (
    <ClientWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <HomeContent />
      </Suspense>
    </ClientWrapper>
  );
}
