import { queryClient } from '@/hooks/use-query-client';
import { CONSTANT } from '@/lib/constants';
import { getChannel as getChannelApi } from '@/services/channel';
import { Channel } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useChannel = (channelId: string) => {
  const { data, isLoading, error } = useQuery([CONSTANT.CHANNEL, channelId], getChannelApi);
  const channel = data as Channel;
  return { channel, isLoading, error };
};

export const getChannel = (channelId: string) => {
  return queryClient.getQueryData([CONSTANT.CHANNEL, channelId]) as Channel;
};

export const refreshChannel = (channelId: string) => {
  return queryClient.refetchQueries([CONSTANT.CHANNEL, channelId]);
};
