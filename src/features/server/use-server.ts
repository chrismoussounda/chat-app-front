import { queryClient } from '@/hooks/use-query-client';
import { CONSTANT } from '@/lib/constants';
import { getServer as getServerApi } from '@/services/server';
import { Server } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useServer = (serverId: string) => {
  const { data, isLoading, error: err } = useQuery([CONSTANT.SERVER, serverId], getServerApi);
  const error = err as Error;
  const server = data as Server;
  return { server, isLoading, error };
};

export const getServer = (serverId: string) => {
  return queryClient.getQueryData([CONSTANT.SERVER, serverId]) as Server;
};

export const refreshServer = (serverId: string) => {
  return queryClient.refetchQueries([CONSTANT.SERVER, serverId]);
};
