import Login from '@/screens/login';
import { Suspense } from 'react';

export default function Home() {
  return (
    <Suspense fallback={null}>
      <Login />
    </Suspense>
  );
}
