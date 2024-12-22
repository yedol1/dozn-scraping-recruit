'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { signOut } from 'next-auth/react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { status?: number; digest?: string };
  reset: () => void;
}) {
  const handleLogout = async () => {
    await signOut();
  };

  // 401 Unauthorized Error Page
  if (error.message === 'Unauthorized: Token has expired') {
    return (
      <div className="flex flex-1 min-h-screen min-w-max bg-gray-200">
        <div className="flex flex-1 items-center justify-center">
          <Card className="flex flex-col bg-white p-8 w-[512px]">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">세션이 만료되었습니다.</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mt-4 text-gray-600">다시 로그인 해주시기 바랍니다.</p>
            </CardContent>
            <CardFooter>
              <Button size="lg" onClick={handleLogout}>
                Login
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
