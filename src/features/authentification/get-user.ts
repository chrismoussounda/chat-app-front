import { queryClient } from '@/hooks/use-query-client';
import { User } from '@/types';

export const getUser = () => {
  return queryClient.getQueryData(['user']) as User;
};
