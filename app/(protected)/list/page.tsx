import ListPage from '@/screens/list/page';
import { Suspense } from 'react';

export default function Home() {
  return (
    <Suspense fallback={null}>
      <ListPage />
    </Suspense>
  );
}
