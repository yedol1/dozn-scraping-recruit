import type { Metadata } from 'next';
import { Theme } from '@radix-ui/themes';
import { cn } from '@/lib/utils';
import '@radix-ui/themes/styles.css';
import '../styles/globals.css';

import QueryProviders from '@/lib/provider/react-query/react-query.provider';
import { Toaster } from '@/components/ui/toaster';
import AuthClientChecker from '@/screens/authChecker';

export const metadata: Metadata = {
  title: 'Dozn 과제 페이지',
  description: 'Dozn 과제 페이지입니다.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-background font-sans antialiased')}>
        <Theme>
          <QueryProviders>
            <AuthClientChecker>{children}</AuthClientChecker>
            <Toaster />
          </QueryProviders>
        </Theme>
      </body>
    </html>
  );
}
