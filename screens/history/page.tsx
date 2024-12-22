'use client';

import CallHistoryCard from '@/components/scrpHistory/history-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getTokenExp } from '@/lib/auth';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const HistoryPage = () => {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    // 초기 남은 시간 계산
    if (token) {
      const initialRemaining = getTokenExp(token);
      setRemainingTime(initialRemaining);
    }
  }, [token]);

  useEffect(() => {
    // 매 초마다 남은 시간 재계산
    let timer: NodeJS.Timeout | null = null;

    if (token) {
      timer = setInterval(() => {
        const currentRemaining = getTokenExp(token);
        setRemainingTime(currentRemaining);

        // 남은 시간이 0 이하라면 => 로그아웃 처리
        if (currentRemaining <= 0) {
          clearInterval(timer as NodeJS.Timeout);
          localStorage.removeItem('accessToken');
          // 로그인 페이지로 이동
          router.push('/');
        }
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [token, router]);

  // 남은 시간을 "분 초" 형태로 가공
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div className="flex flex-1 min-h-screen min-w-max bg-gray-200">
      <div className="flex flex-col flex-1 items-center justify-center p-4">
        <div className="flex flex-row w-full min-w-[512px] items-end justify-end">
          <Badge className="mb-8">유효 시간: {remainingTime > 0 ? `${minutes}분 ${seconds}초` : '0분 0초'}</Badge>
        </div>
        <Card className="flex flex-col bg-white p-4 w-full min-w-[512px]">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">히스토리 페이지</CardTitle>
          </CardHeader>
          <CardContent>
            <CallHistoryCard />
          </CardContent>
          <CardFooter>
            <Button
              className="mr-2"
              onClick={() => {
                router.push('/list');
              }}
            >
              API 목록 페이지로 이동
            </Button>
            {/* 로그아웃 관련 API 가 없어서, 토큰 제거로 로그아웃 기능 추가 */}
            <Button
              onClick={() => {
                localStorage.removeItem('accessToken');
                router.push('/');
              }}
            >
              로그아웃
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default HistoryPage;
