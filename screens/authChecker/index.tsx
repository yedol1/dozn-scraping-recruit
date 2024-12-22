'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { determinePath } from '@/lib/utils';
import { isTokenExpired } from '@/lib/auth';

interface Props {
  children: React.ReactNode;
}

export default function AuthClientChecker({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 토큰 가져오기
    const token = localStorage.getItem('accessToken');

    // 토큰 존재 여부 & 만료 여부
    if (!token || isTokenExpired(token)) {
      // 로컬 스토리지에 저장된것들 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('scrapHistory');
      router.replace('/');
      return;
    }

    // 그 외 경우 -> determinePath로 경로 결정
    const nextPath = determinePath(pathname);
    if (nextPath !== pathname) {
      router.replace(nextPath);
    }
  }, [pathname, router]);

  return <>{children}</>;
}
