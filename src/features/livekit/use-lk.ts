import { useQuery } from '@tanstack/react-query';
import { getToken } from '@/services/lk';

export function useLiveKit(roomId: string, username: string) {
  const {
    isLoading,
    data: token = '',
    error,
  } = useQuery([roomId, username], () => getToken({ roomId, username }), {
    staleTime: 6 * 60 * 60 * 1000,
    retry: false,
  });

  return { isLoading, token, error };
}
