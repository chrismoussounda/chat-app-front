import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      // refetchInterval: 3 * 1000,
    },
  },
});
