import { Channel, ChannelType } from '@/types';
import axios from './axios';
import { QueryFunctionContext } from '@tanstack/react-query';

interface CreateChannelProps {
  id?: string;
  name: string;
  type: ChannelType;
  serverId: string;
}

export const getChannels = async () => {
  const res = await axios.get('/channel');
  if (res.status !== 200) throw new Error(res.data.message);
  return res.data as Channel[];
};

export const getChannel = async (context: QueryFunctionContext) => {
  const res = await axios.get(`/channel/${context.queryKey[1]}`);
  if (res.status !== 200) throw new Error(res.data.message);
  return res.data as Channel;
};

export const createChannel = async (values: CreateChannelProps) => {
  const res = await axios.post('/channel', values);
  if (res.status !== 201) throw new Error(res.data.message);
  return res.data as Channel;
};

export const updateChannel = async (values: CreateChannelProps) => {
  const res = await axios.patch(`/channel/${values.id}`, values);
  if (res.status !== 200) throw new Error(res.data.message);
  return res.data as Channel;
};

export const deleteChannel = async (channelId: string) => {
  await axios.delete(`channel/${channelId}`);
  // if (res.status !== 200) throw new Error(res.data.message);
};
