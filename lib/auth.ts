import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
  iat?: number;
}

export function isTokenExpired(token: string) {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded.exp) {
      return true;
    }
    const nowInSeconds = Math.floor(Date.now() / 1000);
    return nowInSeconds >= decoded.exp;
  } catch (error) {
    return true;
  }
}

// 토큰유효시간 알아내기
export function getTokenExp(token: string) {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const nowInSeconds = Math.floor(Date.now() / 1000);
    return decoded.exp - nowInSeconds;
  } catch (error) {
    return 0;
  }
}
