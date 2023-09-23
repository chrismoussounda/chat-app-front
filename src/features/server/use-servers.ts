import { queryClient } from '@/hooks/use-query-client';
import { CONSTANT } from '@/lib/constants';
import { getServers as getServersApi } from '@/services/server';
import { Server } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useServers = () => {
  const { data: servers = [], isLoading, error } = useQuery([CONSTANT.SERVERS], getServersApi);
  return { servers, isLoading, error };
};

export const getServers = () => {
  return queryClient.getQueryData([CONSTANT.SERVERS]) as Server[];
};

export const refreshServers = async () => {
  return await queryClient.refetchQueries([CONSTANT.SERVERS]);
};
