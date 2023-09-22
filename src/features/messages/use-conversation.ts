import { useQuery } from '@tanstack/react-query';
import { getConversation } from '@/services/message';
import { Conversation } from '@/types';

export function useConversation(memberOneId: string, memberTwoId: string) {
  const { isLoading, data, error } = useQuery(
    [memberOneId, memberTwoId],
    () => getConversation({ memberOneId, memberTwoId }),
    {
      staleTime: Infinity,
    }
  );
  const conversation = data as Conversation;

  return { isLoading, conversation, error };
}
