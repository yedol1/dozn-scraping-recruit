import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Dispatch, SetStateAction } from 'react';

interface TablePaginationProps {
  setPage: Dispatch<SetStateAction<number>>;
  currentPage: number;
  totalPages: number;
}

export function TablePagination({ setPage, currentPage, totalPages }: TablePaginationProps) {
  const numPagesToShow = 5;
  const halfPagesToShow = Math.floor(numPagesToShow / 2);

  let startPage = Math.max(1, currentPage - halfPagesToShow);
  let endPage = Math.min(totalPages, currentPage + halfPagesToShow);

  if (currentPage <= halfPagesToShow) {
    endPage = numPagesToShow;
  }
  if (totalPages - currentPage < halfPagesToShow) {
    startPage = totalPages - numPagesToShow + 1;
  }

  startPage = Math.max(startPage, 1);
  endPage = Math.min(endPage, totalPages);

  const renderPaginationItems = (): JSX.Element[] => {
    const items: JSX.Element[] = [];
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationLink key={i} onClick={() => setPage(i)} isActive={currentPage === i}>
          {i}
        </PaginationLink>,
      );
    }
    return items;
  };

  const goToPreviousPage = () => {
    setPage(Math.max(1, currentPage - 1));
  };

  const goToNextPage = () => {
    setPage(Math.min(totalPages, currentPage + 1));
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationPrevious onClick={goToPreviousPage} />
        {startPage > 1 && (
          <>
            <PaginationLink onClick={() => setPage(1)}>1</PaginationLink>
            {startPage > 2 && <PaginationEllipsis />}
          </>
        )}
        {renderPaginationItems()}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <PaginationEllipsis />}
            <PaginationLink onClick={() => setPage(totalPages)}>{totalPages}</PaginationLink>
          </>
        )}
        <PaginationNext onClick={goToNextPage} />
      </PaginationContent>
    </Pagination>
  );
}
