import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ROUTER_NON_AUTH, ROUTER_AUTH } from './router';
import { isTokenExpired } from './auth';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 페이지 이동 경로 결정
export function determinePath(path: string): string {
  // 1) 토큰 확인
  const token = localStorage.getItem('accessToken');
  if (!token || isTokenExpired(token)) {
    // 토큰이 없거나 만료 => 로그인 페이지로
    localStorage.removeItem('accessToken');
    return ROUTER_NON_AUTH.LOGIN;
  }

  // 2) 토큰이 유효하고, 현재 경로가 로그인 페이지라면 => LIST
  if (path === ROUTER_NON_AUTH.LOGIN) {
    return ROUTER_AUTH.LIST;
  }

  // 3) NON_AUTH 라우트 중 "로그인" 이외 다른 경로면 => 그대로 유지
  if (Object.values(ROUTER_NON_AUTH).includes(path)) {
    return path;
  }

  // 4) AUTH 라우트 중 "LIST" 이외 다른 경로면 => 그대로 유지
  if (Object.values(ROUTER_AUTH).includes(path)) {
    return path;
  }

  // 5) 그 외(정의되지 않은 경로) => 기본적으로 LIST
  return ROUTER_AUTH.LIST;
}
