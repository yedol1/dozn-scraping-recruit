'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/ui/modal';
import { formatDateString } from '@/utils/formatingDate';

//
// 히스토리 아이템 타입
//
interface ScrapRecruitHistoryItem {
  apiCd: string;
  mdulCustCd: string;
  apiNm?: string;
  mdulNm?: string;
  calledAt: string | Date;
  responseData: any;
  isBookmarked?: boolean;
}

const SCRAP_HISTORY_KEY = ['scrapHistory'];

export default function CallHistoryCard() {
  const queryClient = useQueryClient();

  // scrapHistory 캐시 불러오기 (없으면 빈 배열)
  const { data: historyData = [] } = useQuery<ScrapRecruitHistoryItem[]>({
    queryKey: SCRAP_HISTORY_KEY,
    initialData: () => [],
  });

  // 새로고침 시에도 캐시 복원 위한 로직
  useEffect(() => {
    const saved = localStorage.getItem('scrapHistory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // 만약 saved가 캐시보다 '더 최신'이라면 덮어쓸 수도 있음
          queryClient.setQueryData<ScrapRecruitHistoryItem[]>(SCRAP_HISTORY_KEY, parsed);
        }
      } catch (err) {
        console.error('Failed to parse local scrapHistory', err);
      }
    }
  }, [queryClient]);

  // 정렬 방식 (최신순/오래된순)
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const [selectedItem, setSelectedItem] = useState<ScrapRecruitHistoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  //
  // 북마크 토글
  //
  const toggleBookmark = (apiCd: string, mdulCustCd: string) => {
    queryClient.setQueryData<ScrapRecruitHistoryItem[]>(SCRAP_HISTORY_KEY, (oldData) => {
      if (!oldData) return [];
      const newArr = oldData.map((item) =>
        item.apiCd === apiCd && item.mdulCustCd === mdulCustCd ? { ...item, isBookmarked: !item.isBookmarked } : item,
      );
      return newArr;
    });

    // 캐시 수정 후 localStorage도 업데이트
    const updated = queryClient.getQueryData<ScrapRecruitHistoryItem[]>(SCRAP_HISTORY_KEY);
    if (updated) {
      localStorage.setItem('scrapHistory', JSON.stringify(updated));
    }
  };

  //
  // 정렬
  //
  const sortedData = useMemo(() => {
    if (!historyData) return [];
    const newData = [...historyData];

    newData.sort((a, b) => {
      // 북마크 우선
      const aBookmarked = a.isBookmarked ? true : false;
      const bBookmarked = b.isBookmarked ? true : false;
      if (aBookmarked !== bBookmarked) {
        return aBookmarked ? -1 : 1;
      }

      // calledAt 비교
      const dateA = typeof a.calledAt === 'string' ? new Date(a.calledAt) : a.calledAt;
      const dateB = typeof b.calledAt === 'string' ? new Date(b.calledAt) : b.calledAt;
      const timeA = dateA instanceof Date ? dateA.getTime() : 0;
      const timeB = dateB instanceof Date ? dateB.getTime() : 0;

      if (sortOrder === 'desc') {
        return timeB - timeA;
      } else {
        return timeA - timeB;
      }
    });

    return newData;
  }, [historyData, sortOrder]);

  //
  // 정렬 변경
  //
  const handleChangeSort = (order: 'desc' | 'asc') => {
    setSortOrder(order);
  };

  //
  // 카드 클릭 -> 모달 열기
  //
  const handleOpenModal = (item: ScrapRecruitHistoryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 space-y-4">
      {/* 정렬 버튼 */}
      <div className="space-x-2">
        <button
          onClick={() => handleChangeSort('desc')}
          className={`px-4 py-2 border rounded ${sortOrder === 'desc' ? 'bg-gray-200 font-semibold' : ''}`}
        >
          최신순
        </button>
        <button
          onClick={() => handleChangeSort('asc')}
          className={`px-4 py-2 border rounded ${sortOrder === 'asc' ? 'bg-gray-200 font-semibold' : ''}`}
        >
          오래된순
        </button>
      </div>

      {/* 카드 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedData.map((item) => (
          <div
            key={`${item.apiCd}-${item.mdulCustCd}`}
            className="border rounded p-4 shadow cursor-pointer flex flex-col justify-between"
            onClick={() => handleOpenModal(item)}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">{item.apiNm || '(API 이름 없음)'}</h2>
                {/* 북마크 아이콘 */}
                <svg
                  onClick={(e) => {
                    e.stopPropagation(); // 부모 클릭 방지
                    toggleBookmark(item.apiCd, item.mdulCustCd);
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill={item.isBookmarked ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className={`w-6 h-6 ${item.isBookmarked ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-400`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5c0-1.1046.8954-2 2-2h10c1.1046 
                      0 2 .8954 2 2v18l-7-3-7 3V5z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600">API 코드: {item.apiCd}</p>
              <p className="text-sm text-gray-600">모듈 코드: {item.mdulCustCd}</p>
              <p className="text-sm text-gray-600">모듈 이름: {item.mdulNm}</p>
            </div>
            <div className="mt-4 text-sm text-gray-400">호출 시간: {formatDateString(item.calledAt as string)}</div>
          </div>
        ))}

        {sortedData.length === 0 && (
          <div className="col-span-full text-center text-gray-600 p-4">호출 이력이 없습니다.</div>
        )}
      </div>

      {/* 모달 - 스크래핑 응답 내용 표시 */}
      <Modal
        open={isModalOpen}
        title="스크래핑 응답"
        description=""
        onCancel={handleCloseModal}
        subContent={
          selectedItem && (
            <pre className="mt-2 p-2 bg-gray-100 text-sm rounded">
              {JSON.stringify(selectedItem.responseData, null, 2)}
            </pre>
          )
        }
      />
    </div>
  );
}
