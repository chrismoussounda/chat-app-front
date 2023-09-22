import { queryClient } from '@/hooks/use-query-client';
import { CONSTANT } from '@/lib/constants';
import { getChannels as getChannelApi } from '@/services/channel';
import { Channel } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useChannels = (serverId: string) => {
  const {
    data: channels = [],
    isLoading,
    error,
  } = useQuery([serverId, CONSTANT.CHANNELS], getChannelApi, {
    retry: false,
  });
  return { channels, isLoading, error };
};

export const getChannels = (serverId: string) => {
  return queryClient.getQueryData([serverId, CONSTANT.CHANNELS]) as Channel[];
};

export const refreshChannels = (serverId: string) => {
  return queryClient.refetchQueries([serverId, CONSTANT.CHANNELS]);
};
