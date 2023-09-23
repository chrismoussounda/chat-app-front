import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/services/auth';
import { CONSTANT } from '@/lib/constants';
import { queryClient } from '@/hooks/use-query-client';

export function useUser() {
  const { isLoading, data: user, error } = useQuery([CONSTANT.USER], getCurrentUser);

  return { isLoading, user, error };
}

export function clearUser() {
  return queryClient.clear();
}
