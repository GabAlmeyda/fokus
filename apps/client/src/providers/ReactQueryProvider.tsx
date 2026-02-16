import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { JSX } from 'react';

export const queryClient = new QueryClient({});

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
