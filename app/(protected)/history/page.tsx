import HistoryPage from '@/screens/history/page';
import { Suspense } from 'react';

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HistoryPage />
    </Suspense>
  );
}
