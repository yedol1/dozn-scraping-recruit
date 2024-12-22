'use client';

import { SubmitHandler } from 'react-hook-form';
import ErrorMessage from '@/lib/errorMessage';
import Modal from '@/components/ui/modal';
import { useState } from 'react';
import { z } from 'zod';

import Regex from '@/lib/regex';
import LoginForm from './login-form';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/mutations/auth';

export const LoginSchema = z.object({
  admUserId: z.string().min(1, { message: ErrorMessage.REQUIRED }),
  userPw: z
    .string()
    .min(1, {
      message: ErrorMessage.REQUIRED,
    })
    .regex(Regex.PASSWORD, { message: ErrorMessage.PASSWORD_PATTERN }),
});

const Login = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const closeDialog = () => {
    setIsDialogOpen(false);
    return router.push('/');
  };

  const onSubmit: SubmitHandler<z.infer<typeof LoginSchema>> = async (data) => {
    try {
      await signIn(data);
      return router.push('/list');
    } catch (err: any) {
      setErrorMessage('로그인에 실패하였습니다. 다시 시도해 주세요.');
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="flex flex-1 justify-center items-center min-h-screen">
      <LoginForm onSubmit={onSubmit} />
      <Modal open={isDialogOpen} title="로그인에 실패하였습니다." description={errorMessage} onCancel={closeDialog} />
    </div>
  );
};

export default Login;
