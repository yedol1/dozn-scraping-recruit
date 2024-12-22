import { LoginSchema } from '@/screens/login';
import { z } from 'zod';
import { LoginRes } from '../definitions/login.type';

export async function signIn(data: z.infer<typeof LoginSchema>) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/api/recruit/login-check`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = (await res.json()) as LoginRes;

  if (result?.data?.accessToken) {
    localStorage.setItem('accessToken', result.data.accessToken);
  }

  if (result.errYn !== 'N') {
    throw new Error(result.msg || '로그인 실패');
  } else {
    return result;
  }
}
