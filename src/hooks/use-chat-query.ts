import { fetchMessages } from '@/services/message';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSocket } from './use-socket';
interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
}

export const useChatQuery = ({ paramKey, paramValue, queryKey }: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: ({ pageParam }) => fetchMessages({ paramKey, paramValue, pageParam }),
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: isConnected ? false : 0,
  });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
