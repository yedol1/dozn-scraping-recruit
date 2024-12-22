'use client';

import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { TablePagination } from '@/components/table-pagination';
import Modal from '@/components/ui/modal';
import { ScrapRecruitDataResponse, getScrapRecruitData } from '@/lib/queries/scrapRecruit/getScrapRecruitData';
import { ApiItem, ApiListResponse, getApiList } from '@/lib/queries/apiList/getApiList';
import { Button } from '@/components/ui/button';

//
// 히스토리 아이템 타입
//
export interface ScrapRecruitHistoryItem {
  calledAt: Date | string;
  apiCd: string;
  mdulCustCd: string;
  apiNm?: string;
  mdulNm?: string;
  responseData: ScrapRecruitDataResponse;
}

// Mutation 파라미터 타입
interface ScrapRecruitVariables {
  apiCd: string;
  mdulCustCd: string;
  apiNm?: string;
  mdulNm?: string;
}

const SCRAP_HISTORY_KEY = ['scrapHistory'];

export default function ListPageTable() {
  // 브라우저에서만 localStorage로부터 토큰 읽기
  const [token, setToken] = useState('');
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken') || '';
    setToken(storedToken);
  }, []);

  const queryClient = useQueryClient();

  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [scrapResult, setScrapResult] = useState<ScrapRecruitDataResponse | null>(null);

  //
  // 앱 초기 로드시, localStorage -> React Query 캐시 복원
  //
  useEffect(() => {
    const saved = localStorage.getItem('scrapHistory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          queryClient.setQueryData<ScrapRecruitHistoryItem[]>(SCRAP_HISTORY_KEY, parsed);
        }
      } catch (err) {
        console.error('Failed to parse local scrapHistory', err);
      }
    }
  }, [queryClient]);

  //
  //  API 목록 호출
  //
  const { data, isLoading, isError, error } = useQuery<ApiListResponse>({
    queryKey: ['apiList', page],
    queryFn: () => getApiList(token, page, pageSize),
    enabled: !!token,
  });

  //
  // 스크래핑 호출
  //
  const scrapMutation = useMutation<ScrapRecruitDataResponse, Error, ScrapRecruitVariables>({
    mutationFn: async ({ apiCd, mdulCustCd }) => {
      if (!token) throw new Error('No token');
      return getScrapRecruitData({ token, apiCd, mdulCustCd });
    },
    onSuccess: (res, variables) => {
      // 모달 표시
      setScrapResult(res);
      setIsModalOpen(true);

      // 히스토리 캐시 업데이트
      queryClient.setQueryData<ScrapRecruitHistoryItem[]>(SCRAP_HISTORY_KEY, (oldData) => {
        const newItem: ScrapRecruitHistoryItem = {
          calledAt: new Date().toISOString(),
          apiCd: variables.apiCd,
          mdulCustCd: variables.mdulCustCd,
          apiNm: variables.apiNm,
          mdulNm: variables.mdulNm,
          responseData: res,
        };

        if (!oldData) {
          return [newItem];
        }

        // 이미 같은 apiCd + mdulCustCd가 있으면 업데이트, 없으면 추가
        const existingIndex = oldData.findIndex(
          (item) => item.apiCd === variables.apiCd && item.mdulCustCd === variables.mdulCustCd,
        );
        if (existingIndex !== -1) {
          const updated = [...oldData];
          updated[existingIndex] = {
            ...updated[existingIndex],
            calledAt: new Date().toISOString(),
            responseData: res,
            apiNm: variables.apiNm || updated[existingIndex].apiNm,
            mdulNm: variables.mdulNm || updated[existingIndex].mdulNm,
          };
          return updated;
        } else {
          return [...oldData, newItem];
        }
      });

      //
      // 캐시가 업데이트된 뒤, localStorage에도 저장
      //
      const updatedData = queryClient.getQueryData<ScrapRecruitHistoryItem[]>(SCRAP_HISTORY_KEY);
      if (updatedData) {
        localStorage.setItem('scrapHistory', JSON.stringify(updatedData));
      }
    },
    onError: (err) => {
      alert(`스크래핑 호출 실패: ${err.message}`);
    },
  });

  //
  // 로딩/에러 처리
  //
  if (isLoading) {
    return <div className="p-4">로딩 중...</div>;
  }
  if (isError || !data) {
    return (
      <div className="p-4 text-red-600">
        오류가 발생했습니다: {error instanceof Error ? error.message : '알 수 없는 오류'}
      </div>
    );
  }

  // 테이블 표시
  const apiList = data.data.list || [];
  const totalPages = data.data.totalPage || 0;

  const handleScrapClick = (item: ApiItem) => {
    scrapMutation.mutate({
      apiCd: item.apiCd,
      mdulCustCd: item.mdulCustCd,
      apiNm: item.apiNm,
      mdulNm: item.mdulNm,
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>API 이름</TableHead>
              <TableHead>API 코드</TableHead>
              <TableHead>API 설명</TableHead>
              <TableHead>모듈 코드</TableHead>
              <TableHead>모듈 이름</TableHead>
              <TableHead>키워드 코드</TableHead>
              <TableHead>키워드 이름</TableHead>
              <TableHead>제공기관</TableHead>
              <TableHead>액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiList.map((item, idx) => (
              <TableRow key={`${item.apiCd}-${idx}`}>
                <TableCell>{item.apiNm}</TableCell>
                <TableCell>{item.apiCd}</TableCell>
                <TableCell>{item.apiDesc}</TableCell>
                <TableCell>{item.mdulCustCd}</TableCell>
                <TableCell>{item.mdulNm}</TableCell>
                <TableCell>{item.kwrdCd}</TableCell>
                <TableCell>{item.kwrdNm}</TableCell>
                <TableCell>{item.prvr}</TableCell>
                <TableCell>
                  <Button onClick={() => handleScrapClick(item)} className="text-white">
                    스크래핑 호출
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {apiList.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6">
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination currentPage={page} setPage={setPage} totalPages={totalPages} />

      {/* 모달: 스크래핑 결과 */}
      <Modal
        open={isModalOpen}
        title="스크래핑 결과"
        description=""
        onCancel={() => setIsModalOpen(false)}
        subContent={
          scrapResult ? (
            <pre className="p-4 bg-gray-100 rounded">{JSON.stringify(scrapResult, null, 2)}</pre>
          ) : (
            <div>결과가 없습니다.</div>
          )
        }
      />
    </div>
  );
}
