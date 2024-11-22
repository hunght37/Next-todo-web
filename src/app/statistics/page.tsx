'use client';

import { Suspense } from 'react';
import ClientWrapper from '@/components/ClientWrapper';
import StatisticsContent from '@/components/StatisticsContent';

export default function Statistics() {
  return (
    <ClientWrapper>
      <Suspense fallback={<div>Loading statistics...</div>}>
        <StatisticsContent />
      </Suspense>
    </ClientWrapper>
  );
}
