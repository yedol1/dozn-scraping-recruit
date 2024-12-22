'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { LoginSchema } from '.';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface LoginFormProps {
  onSubmit: (data: z.infer<typeof LoginSchema>) => void;
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      admUserId: '',
      userPw: '',
    },
  });

  return (
    <Card className="flex flex-col bg-white p-8 w-[512px]">
      <CardHeader>
        <div className="mb-8">
          <h1 className="text-center text-3xl font-bold">로그인</h1>
        </div>
      </CardHeader>

      <Form {...form}>
        <form data-testid="loginForm" onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <div className="grid w-full gap-4">
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="admUserId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} placeholder="이메일을 입력해주세요." autoComplete="username" type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col space-y-1.5 relative">
                <FormField
                  control={form.control}
                  name="userPw"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="비밀번호를 입력해주세요."
                          type="password"
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center mt-4">
            <Button className="w-full">로그인</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default LoginForm;
