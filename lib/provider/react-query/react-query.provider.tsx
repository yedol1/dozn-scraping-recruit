'use client';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, ReactNode } from 'react';

interface QueryProvidersProps {
  children: ReactNode;
}

function QueryProviders(props: QueryProvidersProps) {
  const [client] = useState(
    new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: 5000 } },
    }),
  );

  return (
    <QueryClientProvider client={client}>
      {props.children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default QueryProviders;
